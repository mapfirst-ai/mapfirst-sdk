import type { MapAdapter } from "./adapters";
import { MapLibreAdapter } from "./adapters/maplibre";
import type { Property, PropertyType } from "./types";

export type { Property, PropertyType } from "./types";

export type MapLibreMarkerHandle = {
  setLngLat(lngLat: [number, number]): MapLibreMarkerHandle;
  addTo(map: any): MapLibreMarkerHandle;
  remove(): void;
  getElement(): HTMLElement;
};

export type MapLibreNamespace = {
  Marker: new (options?: { element?: HTMLElement; anchor?: string }) =>
    MapLibreMarkerHandle;
};

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

export type MapFirstOptions = AdapterDrivenOptions | MapLibreOptions;

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
  private readonly markerRenderer?: MapLibreMarkerManager;
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

    this.markerRenderer?.render(this.clusterItems, {
      primaryType,
      selectedMarkerId: this.selectedMarkerId,
    });

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

  const threshold =
    typeof collisionThresholdPx === "number" &&
    Number.isFinite(collisionThresholdPx) &&
    collisionThresholdPx > 0
      ? collisionThresholdPx
      : resolveCollisionThreshold(zoom);
  const dotThreshold =
    typeof dotCollisionThresholdPx === "number" &&
    Number.isFinite(dotCollisionThresholdPx) &&
    dotCollisionThresholdPx > 0
      ? dotCollisionThresholdPx
      : resolveDotCollisionThreshold(zoom, threshold);
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

function resolveDotCollisionThreshold(zoom: number, base?: number) {
  const fallback =
    typeof base === "number" && Number.isFinite(base) && base > 0
      ? base
      : resolveCollisionThreshold(zoom);
  return Math.max(48, fallback);
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

type MarkerRenderContext = {
  primaryType: PropertyType;
  selectedMarkerId: number | null;
};

type MapLibreMarkerManagerOptions = {
  mapInstance: any;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
};

class MapLibreMarkerManager {
  private readonly mapInstance: any;
  private readonly MarkerCtor?: MapLibreNamespace["Marker"];
  private readonly onMarkerClick?: (marker: Property) => void;
  private activeMarkers: MapLibreMarkerHandle[] = [];

  constructor(options: MapLibreMarkerManagerOptions) {
    this.mapInstance = options.mapInstance;
    this.MarkerCtor = options.maplibregl?.Marker;
    this.onMarkerClick = options.onMarkerClick;
  }

  render(items: ClusterDisplayItem[], context: MarkerRenderContext) {
    this.clear();
    if (!this.MarkerCtor) {
      return;
    }
    for (const item of items) {
      const handle = this.createMarker(item, context);
      if (handle) {
        this.activeMarkers.push(handle);
      }
    }
  }

  destroy() {
    this.clear();
  }

  private clear() {
    for (const marker of this.activeMarkers) {
      try {
        marker.remove();
      } catch {
        // ignore marker removal failures
      }
    }
    this.activeMarkers = [];
  }

  private createMarker(
    item: ClusterDisplayItem,
    context: MarkerRenderContext
  ): MapLibreMarkerHandle | null {
    if (typeof document === "undefined" || !this.MarkerCtor) {
      return null;
    }
    const coords = safeLatLon(item.marker.location);
    if (!coords) {
      return null;
    }

    const element =
      item.kind === "primary"
        ? createPrimaryMarkerElement(item, context, this.onMarkerClick)
        : createDotMarkerElement(item, context, this.onMarkerClick);
    if (!element) {
      return null;
    }

    const marker = new this.MarkerCtor({
      element,
      anchor: item.kind === "primary" ? "bottom" : "center",
    })
      .setLngLat([coords.lon, coords.lat])
      .addTo(this.mapInstance);
    return marker;
  }
}

function createPrimaryMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "primary" }>,
  context: MarkerRenderContext,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }
  const { background, text } = resolveMarkerColors(item.marker, context);
  const root = document.createElement("div");
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.alignItems = "center";
  root.style.pointerEvents = "auto";

  const pill = document.createElement("button");
  pill.type = "button";
  pill.style.background = background;
  pill.style.color = text;
  pill.style.border = "none";
  pill.style.borderRadius = "999px";
  pill.style.padding = "6px 12px";
  pill.style.fontSize = "12px";
  pill.style.fontWeight = "600";
  pill.style.fontFamily = "system-ui, -apple-system, sans-serif";
  pill.style.boxShadow = "0 15px 30px rgba(15, 23, 42, 0.45)";
  pill.style.cursor = "pointer";
  pill.style.display = "flex";
  pill.style.flexDirection = "column";
  pill.style.gap = "2px";
  pill.style.minWidth = "140px";
  pill.style.maxWidth = "220px";
  pill.style.whiteSpace = "nowrap";
  pill.style.overflow = "hidden";
  pill.style.textOverflow = "ellipsis";
  pill.title = item.marker.name ?? String(item.marker.tripadvisor_id);

  const title = document.createElement("span");
  title.textContent = item.marker.name ?? `#${item.marker.tripadvisor_id}`;
  title.style.textAlign = "left";
  pill.appendChild(title);

  const subtitle = formatMarkerSubtitle(item.marker);
  if (subtitle) {
    const subtitleEl = document.createElement("span");
    subtitleEl.textContent = subtitle;
    subtitleEl.style.fontSize = "11px";
    subtitleEl.style.fontWeight = "500";
    subtitleEl.style.opacity = "0.85";
    subtitleEl.style.textAlign = "left";
    pill.appendChild(subtitleEl);
  }

  pill.addEventListener("click", (evt) => {
    evt.stopPropagation();
    onMarkerClick?.(item.marker);
  });

  const pointer = document.createElement("span");
  pointer.style.width = "0";
  pointer.style.height = "0";
  pointer.style.borderLeft = "6px solid transparent";
  pointer.style.borderRight = "6px solid transparent";
  pointer.style.borderTop = `8px solid ${background}`;
  pointer.style.marginTop = "4px";

  root.appendChild(pill);
  root.appendChild(pointer);
  return root;
}

function createDotMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "dot" }>,
  context: MarkerRenderContext,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }
  const { background } = resolveMarkerColors(item.marker, context);
  const button = document.createElement("button");
  button.type = "button";
  button.style.width = "14px";
  button.style.height = "14px";
  button.style.borderRadius = "999px";
  button.style.border = "2px solid #ffffff";
  button.style.background = background;
  button.style.boxShadow = "0 6px 16px rgba(15, 23, 42, 0.4)";
  button.style.cursor = "pointer";
  button.title = item.marker.name ?? String(item.marker.tripadvisor_id);

  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    onMarkerClick?.(item.marker);
  });

  return button;
}

const TYPE_COLORS: Record<PropertyType, string> = {
  Accommodation: "#2563eb",
  "Eat & Drink": "#db2777",
  Attraction: "#0f766e",
};

function resolveMarkerColors(
  marker: Property,
  context: MarkerRenderContext
) {
  const base = TYPE_COLORS[marker.type] ?? "#475569";
  if (context.selectedMarkerId === marker.tripadvisor_id) {
    return { background: "#f97316", text: "#0f172a" };
  }
  if (context.primaryType && marker.type !== context.primaryType) {
    return { background: "#1f2937", text: "#f8fafc" };
  }
  return { background: base, text: "#ffffff" };
}

function formatMarkerSubtitle(marker: Property) {
  const price = marker.pricing?.offer?.displayPrice;
  const rating = formatRatingLabel(marker);
  if (price && rating) {
    return `${rating} · ${price}`;
  }
  return price ?? rating ?? marker.city ?? marker.type;
}

function safeLatLon(location?: { lon?: number; lat?: number }) {
  if (typeof location?.lon !== "number" || typeof location?.lat !== "number") {
    return null;
  }
  if (Number.isNaN(location.lon) || Number.isNaN(location.lat)) {
    return null;
  }
  return { lon: location.lon, lat: location.lat };
}

function formatRatingLabel(marker: Property) {
  const rating = resolveRating(marker);
  if (!Number.isFinite(rating) || rating <= 0) {
    return null;
  }
  return `${rating.toFixed(1)}★`;
}
