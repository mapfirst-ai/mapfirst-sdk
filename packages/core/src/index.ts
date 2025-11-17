import type { MapAdapter } from "./adapters";
import { MapLibreAdapter } from "./adapters/maplibre";
import { GoogleMapsAdapter } from "./adapters/google";
import { MapboxAdapter } from "./adapters/mapbox";
import type { Property, PropertyType } from "./types";
import {
  MapLibreMarkerManager,
  type MapLibreMarkerHandle,
  type MapLibreNamespace,
} from "./adapters/maplibre/markermanager";
import {
  GoogleMapsMarkerManager,
  type GoogleMapsMarkerHandle,
  type GoogleMapsNamespace,
} from "./adapters/google/markermanager";
import {
  MapboxMarkerManager,
  type MapboxMarkerHandle,
  type MapboxNamespace,
} from "./adapters/mapbox/markermanager";

export type { Property, PropertyType } from "./types";

export type {
  MapLibreMarkerHandle,
  MapLibreNamespace,
} from "./adapters/maplibre/markermanager";

export type {
  GoogleMapsMarkerHandle,
  GoogleMapsNamespace,
} from "./adapters/google/markermanager";

export type {
  MapboxMarkerHandle,
  MapboxNamespace,
} from "./adapters/mapbox/markermanager";

type BaseMapFirstOptions = {
  markers?: Property[];
  primaryType?: PropertyType;
  selectedMarkerId?: number | null;
  clusterRadiusMeters?: number;
  autoSelectOnClick?: boolean;
  onClusterUpdate?: (
    clusters: ClusterDisplayItem[],
    viewState: ViewStateSnapshot | null
  ) => void;
};

type AdapterDrivenOptions = BaseMapFirstOptions & {
  adapter: MapAdapter;
  platform?: undefined;
};

type MapLibreOptions = BaseMapFirstOptions & {
  platform: "maplibre";
  mapInstance: any;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type GoogleMapsOptions = BaseMapFirstOptions & {
  platform: "google";
  mapInstance: any; // google.maps.Map
  google: GoogleMapsNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type MapboxOptions = BaseMapFirstOptions & {
  platform: "mapbox";
  mapInstance: any;
  mapboxgl: MapboxNamespace;
  onMarkerClick?: (marker: Property) => void;
};

export type MapFirstOptions =
  | AdapterDrivenOptions
  | MapLibreOptions
  | GoogleMapsOptions
  | MapboxOptions;

const DEFAULT_PRIMARY_TYPE: PropertyType = "Accommodation";

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

export class MapFirstCore {
  private readonly adapter: MapAdapter;
  private readonly cleanupFns: Array<() => void> = [];
  private readonly markerRenderer?:
    | MapLibreMarkerManager
    | GoogleMapsMarkerManager
    | MapboxMarkerManager;
  private markers: Property[] = [];
  private primaryType?: PropertyType;
  private selectedMarkerId: number | null = null;
  private destroyed = false;
  private clusterItems: ClusterDisplayItem[] = [];

  constructor(private readonly options: MapFirstOptions) {
    this.markers = [...(options.markers ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    if (isMapLibreOptions(options)) {
      const shouldAutoSelect = options.autoSelectOnClick ?? true;
      this.adapter = new MapLibreAdapter(options.mapInstance);
      this.markerRenderer = new MapLibreMarkerManager({
        mapInstance: options.mapInstance,
        maplibregl: options.maplibregl,
        onMarkerClick: (marker) => {
          if (shouldAutoSelect) {
            this.setSelectedMarker(marker.tripadvisor_id);
          }
          options.onMarkerClick?.(marker);
        },
      });
      this.attachMapLibreListeners(options.mapInstance);
    } else if (isGoogleMapsOptions(options)) {
      const shouldAutoSelect = options.autoSelectOnClick ?? true;
      this.adapter = new GoogleMapsAdapter(options.mapInstance);
      this.markerRenderer = new GoogleMapsMarkerManager({
        mapInstance: options.mapInstance,
        google: options.google,
        onMarkerClick: (marker) => {
          if (shouldAutoSelect) {
            this.setSelectedMarker(marker.tripadvisor_id);
          }
          options.onMarkerClick?.(marker);
        },
      });
      this.attachGoogleMapsListeners(options.mapInstance);
    } else if (isMapboxOptions(options)) {
      const shouldAutoSelect = options.autoSelectOnClick ?? true;
      this.adapter = new MapboxAdapter(options.mapInstance);
      this.markerRenderer = new MapboxMarkerManager({
        mapInstance: options.mapInstance,
        mapboxgl: options.mapboxgl,
        onMarkerClick: (marker) => {
          if (shouldAutoSelect) {
            this.setSelectedMarker(marker.tripadvisor_id);
          }
          options.onMarkerClick?.(marker);
        },
      });
      this.attachMapboxListeners(options.mapInstance);
    } else {
      this.adapter = options.adapter;
    }

    this.refresh();
  }

  setMarkers(markers: Property[]) {
    this.ensureAlive();
    this.markers = [...markers];
    this.refresh();
  }

  addMarker(marker: Property) {
    this.ensureAlive();
    this.markers = [...this.markers, marker];
    this.refresh();
  }

  clearMarkers() {
    this.ensureAlive();
    this.markers = [];
    this.refresh();
  }

  setPrimaryType(primary: PropertyType) {
    this.ensureAlive();
    if (this.primaryType === primary) return;
    this.primaryType = primary;
    this.refresh();
  }

  setSelectedMarker(markerId: number | null) {
    this.ensureAlive();
    if (this.selectedMarkerId === markerId) return;
    this.selectedMarkerId = markerId;
    this.refresh();
  }

  getClusters(): ClusterDisplayItem[] {
    this.ensureAlive();
    return [...this.clusterItems];
  }

  refresh() {
    this.ensureAlive();
    const viewState = this.safeExtractViewState();
    const primaryType = this.resolvePrimaryType();

    const { collisionPx, dotPx } = this.resolveCollisionOverrides(viewState);

    this.clusterItems = clusterMarkers({
      primaryType,
      markers: this.markers,
      map: this.adapter,
      selectedMarkerId: this.selectedMarkerId,
      zoom: viewState?.zoom ?? 0,
      collisionThresholdPx: collisionPx,
      dotCollisionThresholdPx: dotPx,
    });

    this.markerRenderer?.render(this.clusterItems);

    this.options.onClusterUpdate?.(this.clusterItems, viewState);
  }

  destroy() {
    if (this.destroyed) {
      return;
    }
    this.markerRenderer?.destroy();
    for (const cleanup of this.cleanupFns) {
      try {
        cleanup();
      } catch {
        // ignore listener failures on teardown
      }
    }
    this.cleanupFns.length = 0;
    this.clusterItems = [];
    this.markers = [];
    this.destroyed = true;
  }

  private resolvePrimaryType(): PropertyType {
    return (
      this.primaryType ??
      this.markers.find((marker) => marker.type)?.type ??
      DEFAULT_PRIMARY_TYPE
    );
  }

  private safeExtractViewState(): ViewStateSnapshot | null {
    try {
      return extractViewState(this.adapter);
    } catch {
      return null;
    }
  }

  private resolveCollisionOverrides(viewState: ViewStateSnapshot | null) {
    if (!viewState) {
      return { collisionPx: undefined, dotPx: undefined };
    }
    const radiusMeters = this.options.clusterRadiusMeters;
    if (!radiusMeters || !Number.isFinite(radiusMeters) || radiusMeters <= 0) {
      return { collisionPx: undefined, dotPx: undefined };
    }
    const collisionPx = metersToPixels(
      radiusMeters,
      viewState.latitude,
      viewState.zoom
    );
    if (!Number.isFinite(collisionPx) || collisionPx <= 0) {
      return { collisionPx: undefined, dotPx: undefined };
    }
    const normalized = Math.max(32, Math.round(collisionPx));
    const dotPx = Math.max(48, normalized);
    return { collisionPx: normalized, dotPx };
  }

  private attachMapLibreListeners(mapInstance: any) {
    if (!mapInstance || typeof mapInstance.on !== "function") {
      return;
    }
    const rerender = () => this.refresh();
    const events = ["move", "zoom", "dragend", "pitch", "rotate"];
    events.forEach((eventName) => {
      mapInstance.on(eventName, rerender);
      this.cleanupFns.push(() => {
        if (typeof mapInstance.off === "function") {
          mapInstance.off(eventName, rerender);
        }
      });
    });
  }

  private attachGoogleMapsListeners(mapInstance: any) {
    const rerender = () => this.refresh();
    const events = [
      "center_changed",
      "zoom_changed",
      "drag",
      "heading_changed",
      "tilt_changed",
    ];
    const listeners: any[] = [];

    events.forEach((eventName) => {
      const listener = mapInstance.addListener(eventName, rerender);
      listeners.push(listener);
    });

    this.cleanupFns.push(() => {
      listeners.forEach((listener) => {
        try {
          listener.remove();
        } catch {
          // ignore
        }
      });
    });
  }

  private attachMapboxListeners(mapInstance: any) {
    if (!mapInstance || typeof mapInstance.on !== "function") {
      return;
    }
    const rerender = () => this.refresh();
    const events = ["move", "zoom", "dragend", "pitch", "rotate"];
    events.forEach((eventName) => {
      mapInstance.on(eventName, rerender);
      this.cleanupFns.push(() => {
        if (typeof mapInstance.off === "function") {
          mapInstance.off(eventName, rerender);
        }
      });
    });
  }

  private ensureAlive() {
    if (this.destroyed) {
      throw new Error("MapFirstCore instance has been destroyed");
    }
  }
}

type ViewStateSnapshot = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
};

type ClusterParams = {
  primaryType: PropertyType;
  markers: Property[];
  map: MapAdapter | null;
  selectedMarkerId: number | null;
  zoom: number;
  collisionThresholdPx?: number;
  dotCollisionThresholdPx?: number;
};

type ProjectedMarker = {
  marker: Property;
  index: number;
  x: number;
  y: number;
};

function isMapLibreOptions(
  options: MapFirstOptions
): options is MapLibreOptions {
  return (options as MapLibreOptions).platform === "maplibre";
}

function isGoogleMapsOptions(
  options: MapFirstOptions
): options is GoogleMapsOptions {
  return (options as GoogleMapsOptions).platform === "google";
}

function isMapboxOptions(options: MapFirstOptions): options is MapboxOptions {
  return (options as MapboxOptions).platform === "mapbox";
}

function extractViewState(mapInstance: MapAdapter): ViewStateSnapshot {
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

function clusterMarkers({
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
      clustered.push({
        kind: "primary",
        marker,
        key: `primary-${marker.tripadvisor_id}`,
      });
      return;
    }

    const sorted = [...groupItems].sort((a, b) =>
      compareMarkers(b.marker, a.marker, primaryType)
    );
    const [primary, ...rest] = sorted;
    clustered.push({
      kind: "primary",
      marker: primary.marker,
      key: `primary-${primary.marker.tripadvisor_id}`,
    });

    if (!rest.length) return;

    const dotCandidates: ProjectedMarker[] = [];
    const remainder: ProjectedMarker[] = [];

    rest.forEach((item) => {
      if (selectedMarkerId && item.marker.tripadvisor_id === selectedMarkerId) {
        clustered.push({
          kind: "primary",
          marker: item.marker,
          key: `primary-${item.marker.tripadvisor_id}`,
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
      clustered.push({
        kind: "dot",
        marker: item.marker,
        key: `dot-${item.marker.tripadvisor_id}`,
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

function metersToPixels(meters: number, latitude: number, zoom: number) {
  const metersPerPixel =
    (Math.cos((latitude * Math.PI) / 180) * 2 * Math.PI * 6378137) /
    (256 * 2 ** zoom);
  if (!Number.isFinite(metersPerPixel) || metersPerPixel <= 0) {
    return meters;
  }
  return meters / metersPerPixel;
}
