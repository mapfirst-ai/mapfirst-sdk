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

// Environment configuration
export type Environment = "prod" | "test";

const API_URLS: Record<Environment, string> = {
  prod: "https://api.mapfirst.ai",
  test: "https://ta-backend-test-290791666935.us-central1.run.app",
};

// Properties fetch error class
export class PropertiesFetchError extends Error {
  status: number;
  code?: string;

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status: number;
    code?: string;
  }) {
    super(message);
    this.name = "PropertiesFetchError";
    this.status = status;
    this.code = code;
  }
}

type PropertiesErrorResponse = {
  error?: string;
  detail?: string;
  code?: string;
};

type FetchPropertiesOptions = {
  signal?: AbortSignal;
};

// Fetch properties from API
export async function fetchProperties<TBody = any, TResponse = any>(
  url: string,
  body: TBody,
  { signal }: FetchPropertiesOptions = {}
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let message = `Unexpected response: ${response.status}`;
    let code: string | undefined;
    try {
      const errorBody = (await response.json()) as PropertiesErrorResponse;
      message = errorBody.detail ?? errorBody.error ?? message;
      code = errorBody.code;
    } catch {
      // ignore JSON parsing errors and fall back to status-based message
    }
    throw new PropertiesFetchError({ message, status: response.status, code });
  }

  return (await response.json()) as TResponse;
}

// Helper function to convert Date to ISO date string (YYYY-MM-DD)
function toISO(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}

type BaseMapFirstOptions = {
  properties?: Property[];
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
  // API configuration
  environment?: Environment;
  mfid?: string;
  requestBody?: any;
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

// Helper function to calculate default check-in/check-out dates
function getDefaultDates(): { checkIn: Date; checkOut: Date } {
  const dayMs = 24 * 60 * 60 * 1000;
  const base = new Date(Date.now() + 10 * dayMs);
  const daysUntilSaturday = (6 - base.getDay() + 7) % 7;
  const checkIn = new Date(base.getTime() + daysUntilSaturday * dayMs);
  const startDay = checkIn.getDay();
  const daysUntilWeekend = startDay === 0 ? 6 : 6 - startDay;
  const checkOut = new Date(checkIn.getTime() + (daysUntilWeekend + 1) * dayMs);
  return { checkIn, checkOut };
}

export class MapFirstCore {
  private readonly adapter: MapAdapter;
  private properties: Property[] = [];
  private primaryType?: PropertyType;
  private selectedMarkerId: number | null = null;
  private destroyed = false;
  private clusterItems: ClusterDisplayItem[] = [];

  // State management
  private state: MapState;
  private callbacks: MapStateCallbacks;

  // API configuration
  private readonly environment: Environment;
  private readonly apiUrl: string;
  private readonly mfid?: string;
  private readonly requestBody?: any;

  constructor(private readonly options: MapFirstOptions) {
    this.properties = [...(options.properties ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    // Initialize API configuration
    this.environment = options.environment ?? "prod";
    this.apiUrl = API_URLS[this.environment];
    this.mfid = options.mfid ?? "default";
    this.requestBody = options.requestBody;

    // Initialize default dates
    const defaultDates = getDefaultDates();

    // Initialize state
    this.state = {
      center: [0, 0],
      zoom: 0,
      bounds: null,
      pendingBounds: null,
      tempBounds: null,
      properties: this.properties,
      primary: this.primaryType ?? DEFAULT_PRIMARY_TYPE,
      selectedPropertyId: this.selectedMarkerId,
      initialLoading: true,
      isSearching: false,
      firstCallDone: false,
      filters: {
        checkIn: defaultDates.checkIn,
        checkOut: defaultDates.checkOut,
        numAdults: 2,
        numRooms: 1,
      },
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

    // Auto-load properties if requestBody is provided
    if (this.requestBody) {
      this.autoLoadProperties();
    }
  }

  private async autoLoadProperties(): Promise<void> {
    if (!this.requestBody) return;

    // Default request body structure based on InitialDataLoader.tsx
    const defaultRequestBody = {
      filters: this.getFilters(),
      initial: true,
      ...this.requestBody,
    };

    await this.loadProperties({
      fetchFn: async () => {
        const response = await fetchProperties<any, any>(
          `${this.apiUrl}/${this.mfid}/hotels`,
          defaultRequestBody
        );
        return response.properties || [];
      },
      onError: (error) => {
        console.error("Failed to load properties:", error);
        this.callbacks.onPropertiesLoadError?.(error);
      },
    });
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
        // Change primary type if clicking a secondary marker
        if (marker.type !== this.primaryType) {
          this.setPrimaryType(marker.type);
        }
        if (shouldAutoSelect) {
          this.setSelectedMarker(
            marker.tripadvisor_id === this.selectedMarkerId
              ? null
              : marker.tripadvisor_id
          );
        }
        config.onMarkerClick?.(marker);
      },
      onRefresh: () => this.refresh(),
    });
    return adapter;
  }

  setMarkers(markers: Property[]) {
    this.ensureAlive();
    this.properties = [...markers];
    this.updateState({ properties: markers });
    this.callbacks.onPropertiesChange?.(markers);
    this.refresh();
  }

  addMarker(marker: Property) {
    this.ensureAlive();
    this.properties = [...this.properties, marker];
    this.updateState({ properties: this.properties });
    this.callbacks.onPropertiesChange?.(this.properties);
    this.refresh();
  }

  clearMarkers() {
    this.ensureAlive();
    this.properties = [];
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

  getFilters(): any {
    const filters = { ...this.state.filters };
    // Convert Date objects to ISO strings for API compatibility
    if (filters.checkIn instanceof Date) {
      filters.checkIn = toISO(filters.checkIn);
    }
    if (filters.checkOut instanceof Date) {
      filters.checkOut = toISO(filters.checkOut);
    }
    return filters;
  }

  async loadProperties({
    fetchFn,
    onSuccess,
    onError,
  }: {
    fetchFn: () => Promise<Property[]>;
    onSuccess?: (properties: Property[]) => void;
    onError?: (error: unknown) => void;
  }): Promise<void> {
    this.ensureAlive();
    this.setLoading(true);
    this.setSearching(true);
    this.clearMarkers();

    try {
      const properties = await fetchFn();

      // Apply properties to map
      this.setMarkers(properties);

      // Determine primary type from properties if not set
      if (!this.primaryType && properties.length > 0) {
        const typeCounts = properties.reduce((counts, property) => {
          counts[property.type] = (counts[property.type] || 0) + 1;
          return counts;
        }, {} as Record<PropertyType, number>);

        const mostCommonType = Object.entries(typeCounts).reduce((a, b) =>
          typeCounts[a[0] as PropertyType] > typeCounts[b[0] as PropertyType]
            ? a
            : b
        )[0] as PropertyType;

        this.setPrimaryType(mostCommonType);
      }

      this.setState({ firstCallDone: true });
      onSuccess?.(properties);
    } catch (error) {
      this.clearMarkers();
      onError?.(error);
    } finally {
      this.setSearching(false);
      this.setLoading(false);
      this.setState({ firstCallDone: true });
    }
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
      markers: this.properties,
      map: this.adapter,
      selectedMarkerId: this.selectedMarkerId,
      zoom: viewState?.zoom ?? 0,
    });

    const markerManager = this.adapter.getMarkerManager();
    markerManager.render(this.clusterItems, primaryType, this.selectedMarkerId);

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
    this.properties = [];
    this.destroyed = true;
  }

  private resolvePrimaryType(): PropertyType {
    return (
      this.primaryType ??
      this.properties.find((marker) => marker.type)?.type ??
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
