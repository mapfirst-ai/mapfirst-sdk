import type { MapAdapter } from "./adapters";
import { MapLibreAdapter } from "./adapters/maplibre";
import { GoogleMapsAdapter } from "./adapters/google";
import { MapboxAdapter } from "./adapters/mapbox";
import type { Property, PropertyType } from "./types";
import type { MapLibreNamespace } from "./adapters/maplibre/markermanager";
import type { GoogleMapsNamespace } from "./adapters/google/markermanager";
import type { MapboxNamespace } from "./adapters/mapbox/markermanager";
import {
  ClusterDisplayItem,
  clusterMarkers,
  extractViewState,
  metersToPixels,
  ViewStateSnapshot,
} from "./utils/clustering";

export type { Property, PropertyType } from "./types";

export type { MapLibreNamespace } from "./adapters/maplibre/markermanager";

export type { GoogleMapsNamespace } from "./adapters/google/markermanager";

export type { MapboxNamespace } from "./adapters/mapbox/markermanager";

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
  private markers: Property[] = [];
  private primaryType?: PropertyType;
  private selectedMarkerId: number | null = null;
  private destroyed = false;
  private clusterItems: ClusterDisplayItem[] = [];

  constructor(private readonly options: MapFirstOptions) {
    this.markers = [...(options.markers ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    this.adapter = this.createAdapter(options);
    this.refresh();
  }

  private createAdapter(options: MapFirstOptions): MapAdapter {
    if (isMapLibreOptions(options)) {
      return this.initializeAdapter(new MapLibreAdapter(options.mapInstance), {
        maplibregl: options.maplibregl,
        onMarkerClick: options.onMarkerClick,
      });
    }
    if (isGoogleMapsOptions(options)) {
      return this.initializeAdapter(
        new GoogleMapsAdapter(options.mapInstance),
        { google: options.google, onMarkerClick: options.onMarkerClick }
      );
    }
    if (isMapboxOptions(options)) {
      return this.initializeAdapter(new MapboxAdapter(options.mapInstance), {
        mapboxgl: options.mapboxgl,
        onMarkerClick: options.onMarkerClick,
      });
    }
    return options.adapter;
  }

  private initializeAdapter(adapter: MapAdapter, config: any): MapAdapter {
    const shouldAutoSelect = this.options.autoSelectOnClick ?? true;
    adapter.initialize({
      ...config,
      onMarkerClick: (marker: Property) => {
        if (shouldAutoSelect) {
          this.setSelectedMarker(marker.tripadvisor_id);
        }
        config.onMarkerClick?.(marker);
      },
      onRefresh: () => this.refresh(),
    });
    return adapter;
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

    this.clusterItems = clusterMarkers({
      primaryType,
      markers: this.markers,
      map: this.adapter,
      selectedMarkerId: this.selectedMarkerId,
      zoom: viewState?.zoom ?? 0,
    });

    const markerManager = this.adapter.getMarkerManager();
    markerManager.render(this.clusterItems);

    this.options.onClusterUpdate?.(this.clusterItems, viewState);
  }

  destroy() {
    if (this.destroyed) {
      return;
    }
    const markerManager = this.adapter.getMarkerManager();
    markerManager.destroy();

    this.adapter.cleanup();

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
