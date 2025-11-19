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
import type {
  MapBounds,
  ViewState,
  ActiveLocation,
  FilterState,
  MapState,
  MapStateCallbacks,
  MapStateUpdate,
} from "./state-types";

export type { Property, PropertyType } from "./types";

export type {
  MapBounds,
  ViewState,
  ActiveLocation,
  FilterState,
  MapState,
  MapStateCallbacks,
  MapStateUpdate,
} from "./state-types";

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
  // State management options
  state?: Partial<MapState>;
  callbacks?: MapStateCallbacks;
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

  // State management
  private state: MapState;
  private callbacks: MapStateCallbacks;

  constructor(private readonly options: MapFirstOptions) {
    this.markers = [...(options.markers ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    // Initialize state
    this.state = {
      center: [0, 0],
      zoom: 0,
      bounds: null,
      pendingBounds: null,
      tempBounds: null,
      properties: this.markers,
      primary: this.primaryType ?? DEFAULT_PRIMARY_TYPE,
      selectedPropertyId: this.selectedMarkerId,
      initialLoading: true,
      isSearching: false,
      firstCallDone: false,
      filters: {},
      activeLocation: {
        country: "",
        location_id: null,
        locationName: "",
        coordinates: [0, 0],
      },
      isFlyToAnimating: false,
      ...options.state,
    };

    this.callbacks = options.callbacks ?? {};

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
    this.updateState({ properties: markers });
    this.callbacks.onPropertiesChange?.(markers);
    this.refresh();
  }

  addMarker(marker: Property) {
    this.ensureAlive();
    this.markers = [...this.markers, marker];
    this.updateState({ properties: this.markers });
    this.callbacks.onPropertiesChange?.(this.markers);
    this.refresh();
  }

  clearMarkers() {
    this.ensureAlive();
    this.markers = [];
    this.updateState({ properties: [] });
    this.callbacks.onPropertiesChange?.([]);
    this.refresh();
  }

  setPrimaryType(primary: PropertyType) {
    this.ensureAlive();
    if (this.primaryType === primary) return;
    this.primaryType = primary;
    this.updateState({ primary });
    this.callbacks.onPrimaryTypeChange?.(primary);
    this.refresh();
  }

  setSelectedMarker(markerId: number | null) {
    this.ensureAlive();
    if (this.selectedMarkerId === markerId) return;
    this.selectedMarkerId = markerId;
    this.updateState({ selectedPropertyId: markerId });
    this.callbacks.onSelectedPropertyChange?.(markerId);
    this.refresh();
  }

  // State management methods
  getState(): Readonly<MapState> {
    return { ...this.state };
  }

  updateState(update: MapStateUpdate) {
    this.state = { ...this.state, ...update };
  }

  setState(newState: Partial<MapState>) {
    const prevState = { ...this.state };
    this.updateState(newState);

    // Trigger callbacks for changed values
    if (newState.center !== undefined && newState.center !== prevState.center) {
      this.callbacks.onCenterChange?.(newState.center, this.state.zoom);
    }
    if (newState.zoom !== undefined && newState.zoom !== prevState.zoom) {
      this.callbacks.onZoomChange?.(newState.zoom);
    }
    if (newState.bounds !== undefined && newState.bounds !== prevState.bounds) {
      this.callbacks.onBoundsChange?.(newState.bounds);
    }
    if (
      newState.filters !== undefined &&
      newState.filters !== prevState.filters
    ) {
      this.callbacks.onFiltersChange?.(newState.filters);
    }
    if (
      newState.activeLocation !== undefined &&
      newState.activeLocation !== prevState.activeLocation
    ) {
      this.callbacks.onActiveLocationChange?.(newState.activeLocation);
    }
    if (
      newState.initialLoading !== undefined &&
      newState.initialLoading !== prevState.initialLoading
    ) {
      this.callbacks.onLoadingStateChange?.(newState.initialLoading);
    }
    if (
      newState.isSearching !== undefined &&
      newState.isSearching !== prevState.isSearching
    ) {
      this.callbacks.onSearchingStateChange?.(newState.isSearching);
    }
  }

  setFilters(filters: FilterState) {
    this.setState({ filters });
  }

  setActiveLocation(location: ActiveLocation) {
    this.setState({ activeLocation: location });
  }

  setBounds(bounds: MapBounds | null) {
    this.setState({ bounds });
  }

  setPendingBounds(bounds: MapBounds | null) {
    this.setState({ pendingBounds: bounds });
  }

  setTempBounds(bounds: MapBounds | null) {
    this.setState({ tempBounds: bounds });
  }

  setLoading(loading: boolean) {
    this.setState({ initialLoading: loading });
  }

  setSearching(searching: boolean) {
    this.setState({ isSearching: searching });
  }

  setFlyToAnimating(animating: boolean) {
    this.setState({ isFlyToAnimating: animating });
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
