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
import {
  ClusterDisplayItem,
  clusterMarkers,
  extractViewState,
  metersToPixels,
  ViewStateSnapshot,
} from "./utils/clustering";

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
