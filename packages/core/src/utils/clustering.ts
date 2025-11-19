import { MapAdapter } from "../adapters";
import { Property, PropertyType } from "../types";

export type ClusterDisplayItem =
  | {
      kind: "primary";
      marker: Property;
      key: string;
    }
  | {
      kind: "dot";
      marker: Property;
      key: string;
      parentId: number;
    };

export type ViewStateSnapshot = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
};

export type ClusterParams = {
  primaryType: PropertyType;
  markers: Property[];
  map: MapAdapter | null;
  selectedMarkerId: number | null;
  zoom: number;
  collisionThresholdPx?: number;
  dotCollisionThresholdPx?: number;
};

export type ProjectedMarker = {
  marker: Property;
  index: number;
  x: number;
  y: number;
};

export function extractViewState(mapInstance: MapAdapter): ViewStateSnapshot {
  const center = mapInstance.getCenter();
  return {
    longitude: center.lng,
    latitude: center.lat,
    zoom: mapInstance.getZoom(),
    bearing: mapInstance.getBearing(),
    pitch: mapInstance.getPitch(),
  };
}

const COLLISION_THRESHOLD_PX_ZOOM_BREAKPOINTS: Array<{
  zoom: number;
  threshold: number;
}> = [
  { zoom: 6, threshold: 120 },
  { zoom: 8, threshold: 108 },
  { zoom: 10, threshold: 92 },
  { zoom: 12, threshold: 80 },
  { zoom: 14, threshold: 68 },
  { zoom: 16, threshold: 56 },
];

function resolveCollisionThreshold(zoom: number) {
  for (const breakpoint of COLLISION_THRESHOLD_PX_ZOOM_BREAKPOINTS) {
    if (zoom <= breakpoint.zoom) {
      return breakpoint.threshold;
    }
  }
  return 48;
}

export function clusterMarkers({
  primaryType,
  markers,
  map,
  selectedMarkerId,
  zoom,
  collisionThresholdPx,
  dotCollisionThresholdPx,
}: ClusterParams): ClusterDisplayItem[] {
  if (!markers.length) return [];
  if (!map) {
    return markers.map((marker) => ({
      kind: "primary" as const,
      marker,
      key: `primary-${marker.tripadvisor_id}`,
    }));
  }

  const projected: ProjectedMarker[] = markers
    .map((marker, index) => {
      const location = marker.location as { lon?: number; lat?: number };
      if (
        typeof location?.lon !== "number" ||
        typeof location?.lat !== "number"
      ) {
        return null;
      }
      const { x, y } = map.project([location.lon, location.lat]);
      return { marker, index, x, y };
    })
    .filter((value): value is ProjectedMarker => Boolean(value));

  if (!projected.length) {
    return [];
  }

  const threshold = resolveCollisionThreshold(zoom);
  const dotThreshold = resolveDotCollisionThreshold(zoom);
  const parent = projected.map((_, idx) => idx);

  const find = (i: number): number => {
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]);
    return parent[i];
  };

  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    parent[rootB] = rootA;
  };

  for (let i = 0; i < projected.length; i += 1) {
    for (let j = i + 1; j < projected.length; j += 1) {
      const dx = projected[i].x - projected[j].x;
      const dy = projected[i].y - projected[j].y;
      if (Math.hypot(dx, dy) <= threshold) {
        union(i, j);
      }
    }
  }

  const groups = new Map<number, ProjectedMarker[]>();
  for (const item of projected) {
    const root = find(item.index);
    const group = groups.get(root);
    if (group) {
      group.push(item);
    } else {
      groups.set(root, [item]);
    }
  }

  const clustered: ClusterDisplayItem[] = [];

  groups.forEach((groupItems) => {
    if (groupItems.length === 1) {
      const [{ marker }] = groupItems;
      const isPrimary = marker.type === primaryType;
      const isSelected = selectedMarkerId === marker.tripadvisor_id;
      clustered.push({
        kind: "primary",
        marker,
        key: `primary-${marker.tripadvisor_id}-p${isPrimary ? 1 : 0}-s${
          isSelected ? 1 : 0
        }`,
      });
      return;
    }

    const sorted = [...groupItems].sort((a, b) =>
      compareMarkers(b.marker, a.marker, primaryType)
    );
    const [primary, ...rest] = sorted;
    const isPrimaryPrimary = primary.marker.type === primaryType;
    const isSelectedPrimary =
      selectedMarkerId === primary.marker.tripadvisor_id;
    clustered.push({
      kind: "primary",
      marker: primary.marker,
      key: `primary-${primary.marker.tripadvisor_id}-p${
        isPrimaryPrimary ? 1 : 0
      }-s${isSelectedPrimary ? 1 : 0}`,
    });

    if (!rest.length) return;

    const dotCandidates: ProjectedMarker[] = [];
    const remainder: ProjectedMarker[] = [];

    rest.forEach((item) => {
      if (selectedMarkerId && item.marker.tripadvisor_id === selectedMarkerId) {
        const isPrimary = item.marker.type === primaryType;
        clustered.push({
          kind: "primary",
          marker: item.marker,
          key: `primary-${item.marker.tripadvisor_id}-p${isPrimary ? 1 : 0}-s1`,
        });
        return;
      }

      if (distancePx(primary, item) <= dotThreshold) {
        dotCandidates.push(item);
      } else {
        remainder.push(item);
      }
    });

    dotCandidates.forEach((item) => {
      const isPrimary = item.marker.type === primaryType;
      clustered.push({
        kind: "dot",
        marker: item.marker,
        key: `dot-${item.marker.tripadvisor_id}-p${isPrimary ? 1 : 0}-s0`,
        parentId: primary.marker.tripadvisor_id,
      });
    });

    if (remainder.length) {
      const followUp = clusterMarkers({
        markers: remainder.map((item) => item.marker),
        map,
        selectedMarkerId,
        zoom,
        primaryType,
        collisionThresholdPx,
        dotCollisionThresholdPx,
      });
      clustered.push(...followUp);
    }
  });

  return clustered;
}

function distancePx(a: ProjectedMarker, b: ProjectedMarker) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function resolveDotCollisionThreshold(zoom: number) {
  const base = resolveCollisionThreshold(zoom);
  return Math.max(48, base);
}

function compareMarkers(a: Property, b: Property, primaryType: PropertyType) {
  const aIsPrimary = a.type === primaryType;
  const bIsPrimary = b.type === primaryType;
  if (aIsPrimary && !bIsPrimary) return 1;
  if (!aIsPrimary && bIsPrimary) return -1;

  const ratingDiff = resolveRating(a) - resolveRating(b);
  if (ratingDiff !== 0) return ratingDiff;

  const priceDiff = resolvePrice(a) - resolvePrice(b);
  if (priceDiff !== 0) return priceDiff;

  const reviewsDiff = (a.reviews ?? 0) - (b.reviews ?? 0);
  if (reviewsDiff !== 0) return reviewsDiff;

  return a.tripadvisor_id - b.tripadvisor_id;
}

function resolveRating(marker: Property) {
  if (typeof marker.rating === "number") return marker.rating;
  if (marker.rating === undefined || marker.rating === null) return -Infinity;
  const parsed = Number(marker.rating);
  return Number.isNaN(parsed) ? -Infinity : parsed;
}

function resolvePrice(marker: Property) {
  if (!marker.pricing?.offer?.price) return -Infinity;
  const numeric = Number(
    (marker.pricing.offer.displayPrice ?? "0")
      .replace(/[^0-9.,-]+/g, "")
      .replace(/,/g, "")
  );
  return Number.isNaN(numeric) ? -Infinity : numeric;
}

export function metersToPixels(meters: number, latitude: number, zoom: number) {
  const metersPerPixel =
    (Math.cos((latitude * Math.PI) / 180) * 2 * Math.PI * 6378137) /
    (256 * 2 ** zoom);
  if (!Number.isFinite(metersPerPixel) || metersPerPixel <= 0) {
    return meters;
  }
  return meters / metersPerPixel;
}
