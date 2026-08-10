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
  /** Extra horizontal pixels to add to the collision check (e.g. label width) */
  labelExtentPx?: number;
};

export type ProjectedMarker = {
  marker: Property;
  index: number;
  x: number;
  y: number;
};

type RawProjectedMarker = Omit<ProjectedMarker, "index">;

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
  labelExtentPx,
}: ClusterParams): ClusterDisplayItem[] {
  if (!markers.length) return [];
  if (!map) {
    return markers.map((marker) => createSimplePrimaryClusterItem(marker));
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
      return { marker, x, y };
    })
    .filter((value): value is RawProjectedMarker => Boolean(value))
    .map((value, index) => ({ ...value, index }));

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
      const collides =
        labelExtentPx !== undefined
          ? Math.abs(dx) <= threshold + labelExtentPx &&
            Math.abs(dy) <= threshold
          : Math.hypot(dx, dy) <= threshold;
      if (collides) {
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
      clustered.push(
        createPrimaryClusterItem(marker, primaryType, selectedMarkerId),
      );
      return;
    }

    const sorted = [...groupItems].sort((a, b) =>
      compareMarkers(b.marker, a.marker, primaryType),
    );
    const [primary, ...rest] = sorted;
    clustered.push(
      createPrimaryClusterItem(primary.marker, primaryType, selectedMarkerId),
    );

    if (!rest.length) return;

    const dotCandidates: ProjectedMarker[] = [];
    const remainder: ProjectedMarker[] = [];

    rest.forEach((item) => {
      if (selectedMarkerId && item.marker.tripadvisor_id === selectedMarkerId) {
        clustered.push(
          createPrimaryClusterItem(item.marker, primaryType, true),
        );
        return;
      }

      if (distancePx(primary, item) <= dotThreshold) {
        dotCandidates.push(item);
      } else {
        remainder.push(item);
      }
    });

    dotCandidates.forEach((item) => {
      clustered.push(createDotClusterItem(item.marker, primaryType, primary));
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
        labelExtentPx,
      });
      clustered.push(...followUp);
    }
  });

  return clustered;
}

function createSimplePrimaryClusterItem(marker: Property): ClusterDisplayItem {
  return {
    kind: "primary",
    marker,
    key: `primary-${marker.tripadvisor_id}`,
  };
}

function createPrimaryClusterItem(
  marker: Property,
  primaryType: PropertyType,
  selected: number | null | boolean,
): ClusterDisplayItem {
  const isPrimary = marker.type === primaryType;
  const isSelected =
    typeof selected === "boolean"
      ? selected
      : selected === marker.tripadvisor_id;
  return {
    kind: "primary",
    marker,
    key: buildClusterKey("primary", marker, isPrimary, isSelected),
  };
}

function createDotClusterItem(
  marker: Property,
  primaryType: PropertyType,
  parent: ProjectedMarker,
): ClusterDisplayItem {
  const isPrimary = marker.type === primaryType;
  return {
    kind: "dot",
    marker,
    key: buildClusterKey("dot", marker, isPrimary, false),
    parentId: parent.marker.tripadvisor_id,
  };
}

function buildClusterKey(
  kind: "primary" | "dot",
  marker: Property,
  isPrimary: boolean,
  isSelected: boolean,
): string {
  return `${kind}-${marker.tripadvisor_id}-p${isPrimary ? 1 : 0}-s${
    isSelected ? 1 : 0
  }-${marker.pricing?.availability}-${marker.pricing?.offer?.displayPrice ?? ""}`;
}

function distancePx(a: ProjectedMarker, b: ProjectedMarker) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function resolveDotCollisionThreshold(zoom: number) {
  const base = resolveCollisionThreshold(zoom);
  return Math.max(48, base);
}

function compareMarkers(a: Property, b: Property, primaryType: PropertyType) {
  // Partner promo properties win cluster collisions outright — an offer must
  // stay visible even when a primary-type marker lands on top of it.
  const aIsPromo = !!a.promo;
  const bIsPromo = !!b.promo;
  if (aIsPromo && !bIsPromo) return 1;
  if (!aIsPromo && bIsPromo) return -1;

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
      .replace(/,/g, ""),
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
