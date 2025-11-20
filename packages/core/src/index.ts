import type { MapAdapter } from "./adapters";
import { MapLibreAdapter } from "./adapters/maplibre";
import { GoogleMapsAdapter } from "./adapters/google";
import { MapboxAdapter } from "./adapters/mapbox";
import type { APIResponse, FilterSchema, HotelPricingAPIResponse, InitialLocationData, InitialRequestBody, PollOptions, Price, PriceLevel, Property, PropertyType, SmartFilter } from "./types";
import type { MapLibreNamespace } from "./adapters/maplibre/markermanager";
import type { GoogleMapsNamespace } from "./adapters/google/markermanager";
import type { MapboxNamespace } from "./adapters/mapbox/markermanager";
import {
  ClusterDisplayItem,
  clusterMarkers,
  extractViewState,
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

export type BaseMapFirstOptions = {
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
  // Initial location data (alternative to requestBody)
  initialLocationData?: InitialLocationData;
  // Map behavior options
  fitBoundsPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  apiUrl?: string;
};

type AdapterDrivenOptions = BaseMapFirstOptions & {
  adapter: MapAdapter;
  platform?: undefined;
};

type MapLibreOptions = BaseMapFirstOptions & {
  platform: "maplibre";
  mapInstance?: any;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type GoogleMapsOptions = BaseMapFirstOptions & {
  platform: "google";
  mapInstance?: any; // google.maps.Map
  google: GoogleMapsNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type MapboxOptions = BaseMapFirstOptions & {
  platform: "mapbox";
  mapInstance?: any;
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
  private adapter: MapAdapter | null = null;
  private properties: Property[] = [];
  private primaryType?: PropertyType;
  private selectedMarkerId: number | null = null;
  private destroyed = false;
  private clusterItems: ClusterDisplayItem[] = [];
  private isMapAttached = false;

  // State management
  private state: MapState;
  private callbacks: MapStateCallbacks;

  // API configuration
  private readonly environment: Environment;
  private readonly apiUrl: string;
  private readonly mfid?: string;
  private currentPlatform: "google" | "maplibre" | "mapbox" | undefined;
  private requestBody?: any;
  private readonly fitBoundsPadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  constructor(private readonly options: MapFirstOptions) {
    this.properties = [...(options.properties ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    // Initialize API configuration
    this.environment = options.environment ?? "prod";
    this.apiUrl = options.apiUrl ?? API_URLS[this.environment];
    this.mfid = options.mfid ?? "default";
    this.requestBody = options.requestBody;
    this.currentPlatform = options.platform;

    // Determine if using Google Maps
    const isGoogleMaps = isGoogleMapsOptions(options);

    // Set default padding based on platform (Google Maps uses 0, others use padding)
    this.fitBoundsPadding = {
      top: options.fitBoundsPadding?.top ?? (isGoogleMaps ? 0 : 50),
      bottom: options.fitBoundsPadding?.bottom ?? (isGoogleMaps ? 0 : 160),
      left: options.fitBoundsPadding?.left ?? (isGoogleMaps ? 0 : 50),
      right: options.fitBoundsPadding?.right ?? (isGoogleMaps ? 0 : 50),
    };

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
        ...(options.initialLocationData?.currency && {
          currency: options.initialLocationData.currency,
        }),
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

    // Initialize map adapter if mapInstance is provided
    if (this.hasMapInstance(options)) {
      this.adapter = this.createAdapter(options);
      this.isMapAttached = true;
      this.refresh();
    }

    // Handle initial location data or auto-load properties
    if (options.initialLocationData) {
      this.initializeFromLocationData(options.initialLocationData);
    } else if (this.requestBody && this.isMapAttached) {
      this.autoLoadProperties();
    }
  }

  private hasMapInstance(options: MapFirstOptions): boolean {
    if ("adapter" in options && options.adapter) return true;
    if ("mapInstance" in options && options.mapInstance) return true;
    return false;
  }

  private async initializeFromLocationData(
    locationData: InitialLocationData
  ): Promise<void> {
    try {
      const { city, country, query, currency } = locationData;

      let requestBody: any = {
        filters: this.getFilters(),
        initial: true,
      };

      // Geo-lookup if city/country provided
      if ((city && country) || country) {
        const geoResponse = await fetch(
          `${this.apiUrl}/geo-lookup?country=${encodeURIComponent(country!)}${city ? `&city=${encodeURIComponent(city)}` : ""
          }`
        );

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();

          let finalCity = city;
          if (
            geoData.location_name &&
            geoData.path3_name &&
            geoData.location_name === geoData.path3_name
          ) {
            finalCity = undefined;
          }
          if (geoData.location_name) finalCity = geoData.location_name;

          const finalCountry = geoData.path3_name || country;

          requestBody = {
            ...requestBody,
            city: finalCity,
            country: finalCountry,
            location_id: geoData.location_id,
            longitude: geoData.longitude,
            latitude: geoData.latitude,
          };

          // Update active location
          this.setActiveLocation({
            city: finalCity,
            country: finalCountry,
            location_id: geoData.location_id,
            locationName:
              finalCity && finalCountry
                ? `${finalCity}, ${finalCountry}`
                : finalCountry || "",
            coordinates: [geoData.latitude, geoData.longitude],
          });

          // Update state center
          this.setState({
            center: [geoData.latitude, geoData.longitude],
            zoom: 12,
          });
        } else {
          this.handleError(
            new Error(`Geo mapping fetch failed: ${geoResponse.statusText}`),
            "initializeFromLocationData"
          );
        }
      } else if (query) {
        requestBody.query = query;
      }

      this.requestBody = requestBody;

      // Auto-load properties if map is already attached
      if (this.isMapAttached) {
        await this.autoLoadProperties();
      }
    } catch (error) {
      this.handleError(error, "initializeFromLocationData");
    }
  }

  private async autoLoadProperties(): Promise<void> {
    if (!this.requestBody) return;

    // Default request body structure based on InitialDataLoader.tsx
    const defaultRequestBody: InitialRequestBody = {
      filters: this.getFilters(),
      initial: true,
      ...this.requestBody,
    };

    await this.runPropertiesSearch({
      body: defaultRequestBody,
      onError: (error) => {
        this.handleError(error, "autoLoadProperties");
        this.callbacks.onPropertiesLoadError?.(error);
      },
    });
  }

  attachMap(
    mapInstance: any,
    config: {
      platform: "maplibre" | "google" | "mapbox";
      maplibregl?: MapLibreNamespace;
      google?: GoogleMapsNamespace;
      mapboxgl?: MapboxNamespace;
      onMarkerClick?: (marker: Property) => void;
    }
  ): void {
    if (this.isMapAttached) {
      console.warn("Map is already attached. Destroying previous adapter.");
      if (this.adapter) {
        const markerManager = this.adapter.getMarkerManager();
        markerManager?.destroy();
        this.adapter.cleanup();
      }
    }

    const adapterConfig: any = {
      ...this.options,
      platform: config.platform,
      mapInstance,
      maplibregl: config.maplibregl,
      google: config.google,
      mapboxgl: config.mapboxgl,
      onMarkerClick: config.onMarkerClick,
    };

    this.currentPlatform = config.platform;
    this.adapter = this.createAdapter(adapterConfig);
    this.isMapAttached = true;
    this.refresh();

    // Auto-load properties if we have requestBody and haven't loaded yet
    if (this.requestBody && !this.state.firstCallDone) {
      this.autoLoadProperties();
    }
  }

  private createAdapter(options: MapFirstOptions): MapAdapter | null {
    if (isMapLibreOptions(options) && options.mapInstance) {
      return this.initializeAdapter(new MapLibreAdapter(options.mapInstance), {
        maplibregl: options.maplibregl,
        onMarkerClick: options.onMarkerClick,
      });
    }
    if (isGoogleMapsOptions(options) && options.mapInstance) {
      return this.initializeAdapter(
        new GoogleMapsAdapter(options.mapInstance),
        { google: options.google, onMarkerClick: options.onMarkerClick }
      );
    }
    if (isMapboxOptions(options) && options.mapInstance) {
      return this.initializeAdapter(new MapboxAdapter(options.mapInstance), {
        mapboxgl: options.mapboxgl,
        onMarkerClick: options.onMarkerClick,
      });
    }
    if ("adapter" in options && options.adapter) {
      return options.adapter;
    }
    return null;
  }

  private initializeAdapter(adapter: MapAdapter, config: any): MapAdapter {
    const shouldAutoSelect = this.options.autoSelectOnClick ?? true;
    adapter.initialize({
      ...config,
      onMarkerClick: (marker: Property) => {
        if (marker.location) {
          this.flyMapTo(marker.location.lon, marker.location.lat, 14);
        }

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

  _setProperties(properties: Property[]) {
    this.ensureAlive();
    this.properties = [
      ...properties.filter((x) =>
        x.type === "Accommodation"
          ? x.pricing?.availability !== "unavailable"
          : true
      ),
    ];
    this.updateState({
      properties: this.properties,
    });
    this.callbacks.onPropertiesChange?.(properties);
    this.refresh();
  }

  addProperty(property: Property) {
    this.ensureAlive();
    this.properties = [...this.properties, property];
    this.updateState({ properties: this.properties });
    this.callbacks.onPropertiesChange?.(this.properties);
    this.refresh();
  }

  clearProperties() {
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

    // If selecting a marker, check if we need to change the primary type
    if (markerId !== null) {
      const marker = this.properties.find((p) => p.tripadvisor_id === markerId);
      if (marker && marker.type !== this.primaryType) {
        this.setPrimaryType(marker.type);
      }
    }

    this.selectedMarkerId = markerId;
    this.updateState({ selectedPropertyId: markerId });
    this.callbacks.onSelectedPropertyChange?.(markerId);
    this.refresh();
  }

  // State management methods
  getState(): Readonly<MapState> {
    return { ...this.state };
  }

  // Centralized error handler
  private handleError(error: unknown, context: string = "MapFirstCore") {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorObj = error instanceof Error ? error : new Error(errorMessage);

    console.error(`[${context}]`, errorMessage);

    if (this.callbacks.onError) {
      this.callbacks.onError(errorObj, context);
    }
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

  flyMapTo(
    longitude: number,
    latitude: number,
    zoom?: number | null,
    animation: boolean = true
  ) {
    this.ensureAlive();
    this.setState({ center: [latitude, longitude] });
    if (typeof zoom === "number") {
      this.setState({ zoom });
    }

    if (!this.adapter) return;
    const mapInstance = this.adapter.getMap();
    if (!mapInstance) return;

    if (this.currentPlatform === "google") {
      this.setFlyToAnimating(false);
      mapInstance.setCenter({ lat: latitude, lng: longitude });
      if (zoom !== null && typeof zoom === "number") {
        mapInstance.setZoom(zoom ?? 13);
      }
      return;
    }

    // MapLibre/Mapbox
    if (animation === false) {
      this.setFlyToAnimating(false);
      if (mapInstance.jumpTo) {
        mapInstance.jumpTo({
          center: [longitude, latitude],
          ...(zoom !== null && { zoom: zoom ?? 13 }),
        });
      }
      return;
    }

    this.setFlyToAnimating(true);
    if (mapInstance.flyTo) {
      mapInstance.flyTo({
        center: [longitude, latitude],
        ...(zoom !== null && { zoom: zoom ?? 13 }),
      });
    }
  }

  flyToPOIs(
    pois?: { lat: number; lng: number }[],
    type?: PropertyType,
    animate: boolean = true
  ) {
    this.ensureAlive();
    if (!this.adapter) return;
    const mapInstance = this.adapter.getMap();
    if (!mapInstance) return;

    let points = pois;
    if (!points || points.length === 0) {
      points = this.properties
        .filter(
          (x) =>
            x.location !== undefined &&
            (type !== undefined ? x.type === type : true)
        )
        .map((h) => ({
          lat: h.location!.lat,
          lng: h.location!.lon,
        }));
    }
    if (!points || points.length === 0) return;

    // Check if this is Google Maps

    if (points.length === 1) {
      const poi = points[0];
      if (this.currentPlatform === "google") {
        mapInstance.setCenter({ lat: poi.lat, lng: poi.lng });
        mapInstance.setZoom(13);
      } else if (mapInstance.flyTo) {
        mapInstance.flyTo({
          center: [poi.lng, poi.lat],
          zoom: 13,
        });
      }
    } else {
      if (this.currentPlatform === "google") {
        // Google Maps
        const LatLngBounds = (window as any).google?.maps?.LatLngBounds;
        if (LatLngBounds) {
          const bounds = new LatLngBounds();
          points.forEach((poi) => {
            bounds.extend({ lat: poi.lat, lng: poi.lng });
          });
          if (animate) {
            this.setFlyToAnimating(true);
          }
          mapInstance.fitBounds(bounds, this.fitBoundsPadding);
        }
      } else if (mapInstance.fitBounds) {
        // MapLibre/Mapbox
        const bounds: [[number, number], [number, number]] = [
          [points[0].lng, points[0].lat],
          [points[0].lng, points[0].lat],
        ];

        points.forEach((poi) => {
          bounds[0][0] = Math.min(bounds[0][0], poi.lng);
          bounds[0][1] = Math.min(bounds[0][1], poi.lat);
          bounds[1][0] = Math.max(bounds[1][0], poi.lng);
          bounds[1][1] = Math.max(bounds[1][1], poi.lat);
        });

        if (animate) {
          this.setFlyToAnimating(true);
        }
        mapInstance.fitBounds(bounds, {
          padding: this.fitBoundsPadding,
          animate,
        });
      }
    }
  }

  getFilters() {
    const filters = { ...this.state.filters };
    // Convert Date objects to ISO strings for API compatibility
    if (filters.checkIn instanceof Date) {
      filters.checkIn = toISO(filters.checkIn);
    }
    if (filters.checkOut instanceof Date) {
      filters.checkOut = toISO(filters.checkOut);
    }
    return filters as FilterSchema;
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
    this.clearProperties();

    try {
      const properties = await fetchFn();

      this._setProperties(properties);

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
      this.clearProperties();
      onError?.(error);
    } finally {
      this.setSearching(false);
      this.setLoading(false);
      this.setState({ firstCallDone: true });
    }
  }

  async pollForPricing({
    pollingLink,
    maxAttempts = 15,
    delayMs = 2000,
    isCancelled,
    price,
    limit,
  }: PollOptions): Promise<{
    completed: boolean;
    pollData?: HotelPricingAPIResponse;
  }> {
    this.ensureAlive();

    if (!pollingLink) {
      return { completed: false };
    }

    let completed = false;
    let pollData: HotelPricingAPIResponse | undefined = undefined;

    const filters = this.getFilters();
    if (limit) {
      filters.limit = limit;
    }

    const body: any = {
      filters,
      pollingLink,
    };

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (isCancelled?.()) {
        return { completed, pollData };
      }

      try {
        const pollResp = await fetch(`${this.apiUrl}/${this.mfid}/ta-polling`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });

        if (!pollResp.ok) {
          throw new PropertiesFetchError({
            message: `Poll failed: ${pollResp.status}`,
            status: pollResp.status,
          });
        }

        pollData = await pollResp.json();

        if (isCancelled?.()) {
          return { completed, pollData };
        }

        const results = pollData?.success?.results ?? [];
        if (results.length > 0) {
          this.setProperties((prev) => {
            const resultIds = new Set(results.map((h) => h.tripadvisor_id));
            const updatedProperties = prev.filter(
              (property) =>
                property.type !== "Accommodation" ||
                resultIds.has(property.tripadvisor_id)
            );

            results.forEach((property) => {
              if (!property.location) return;
              if (
                property.pricing?.offer?.price &&
                price &&
                (property.pricing?.offer?.price < price?.min ||
                  property.pricing?.offer?.price > price?.max)
              ) {
                property.pricing.availability = "unavailable";
              }
              const existingIndex = updatedProperties.findIndex(
                (h) => h.tripadvisor_id === property.tripadvisor_id
              );
              if (existingIndex >= 0) {
                updatedProperties[existingIndex] = property;
              } else {
                updatedProperties.push(property);
              }
            });

            return updatedProperties;
          });

          // Force a refresh after updating properties to ensure markers are re-rendered
          this.refresh();
        }

        if (pollData?.success?.isComplete) {
          completed = true;
          break;
        }
      } catch (error) {
        this.handleError(error, "pollForPricing");
        this.callbacks.onPropertiesLoadError?.(error);
        break;
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return { completed, pollData };
  }

  private setProperties(updater: (prev: Property[]) => Property[]): void {
    const updatedProperties = updater(this.properties);
    this._setProperties(updatedProperties);
  }

  private mostCommonTypeFromProperties(properties: Property[]): PropertyType {
    const typeCounts = properties.reduce((counts, property) => {
      counts[property.type] = (counts[property.type] || 0) + 1;
      return counts;
    }, {} as Record<PropertyType, number>);

    return Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0] as PropertyType] > typeCounts[b[0] as PropertyType]
        ? a
        : b
    )[0] as PropertyType;
  }

  async runPropertiesSearch({
    body,
    beforeApplyProperties,
    smartFiltersClearable,
    onError,
  }: {
    body: InitialRequestBody;
    beforeApplyProperties?: (data: APIResponse) => {
      price?: Price | null;
      limit?: number;
    };
    smartFiltersClearable?: boolean;
    onError?: (error: unknown) => void;
  }): Promise<APIResponse | null> {
    this.ensureAlive();
    this.setState({ firstCallDone: false });
    this.setSearching(true);
    this.clearProperties();

    try {
      const data = await fetchProperties<InitialRequestBody, APIResponse>(
        `${this.apiUrl}/${this.mfid}/hotels`,
        body
      );

      this.updateActiveLocationFromResponse(data);

      let price: Price | null = null;
      let limit: number = 30;
      let primary_type: PropertyType | undefined = data.filters.primary_type;

      if (beforeApplyProperties) {
        const result = beforeApplyProperties(data);
        price = result.price ?? null;
        limit = result.limit ?? 30;
      }

      // Track if we've already flown to POIs
      const flown = data.properties.some((x) => !!x.location);

      // Apply properties
      this._setProperties(data.properties);

      // Fly to POIs if properties have locations
      if (flown) {
        this.flyToPOIs(
          data.properties
            .filter(
              (x) =>
                !!x.location &&
                (data.filters.primary_type
                  ? x.type === data.filters.primary_type
                  : true)
            )
            .map((x) => ({ lat: x.location!.lat, lng: x.location!.lon })),
          undefined,
          body.initial !== true
        );
      }

      // Determine and set primary type
      if (
        data.filters.primary_type &&
        data.properties.filter(
          (property) =>
            property.type === data.filters.primary_type &&
            (property.type === "Accommodation"
              ? property.pricing?.availability !== "unavailable"
              : true)
        ).length > 0
      ) {
        primary_type = data.filters.primary_type;
        this.setPrimaryType(data.filters.primary_type);
      } else if (data.properties.length > 0) {
        const mostCommonType = this.mostCommonTypeFromProperties(
          data.properties
        );
        this.setPrimaryType(mostCommonType);
        primary_type = mostCommonType;
      }

      this.setState({ firstCallDone: true });

      // Check if we need to poll for pricing
      if (data.isComplete === false && data.pollingLink) {
        const { completed, pollData } = await this.pollForPricing({
          pollingLink: data.pollingLink,
          ...(price && { price }),
          ...(limit && { limit }),
        });

        if (
          completed &&
          pollData?.success?.results &&
          pollData.success.results.filter(
            (property) =>
              property.type === data.filters.primary_type &&
              (property.type === "Accommodation"
                ? property.pricing?.availability !== "unavailable"
                : true)
          ).length === 0 &&
          primary_type &&
          primary_type !== data.filters.primary_type
        ) {
          const mostCommonType = this.mostCommonTypeFromProperties(
            data.properties
          );
          this.setPrimaryType(mostCommonType);
        }
      }

      // Fly to POIs if not already done
      if (!flown) {
        if (data.properties.some((x) => !!x.location)) {
          this.flyToPOIs(
            data.properties
              .filter(
                (x) =>
                  !!x.location &&
                  (data.filters.primary_type
                    ? x.type === data.filters.primary_type
                    : true)
              )
              .map((x) => ({ lat: x.location!.lat, lng: x.location!.lon })),
            undefined,
            body.initial !== true
          );
        } else if (
          data.filters.location?.latitude &&
          data.filters.location?.longitude
        ) {
          this.flyMapTo(
            data.filters.location.longitude,
            data.filters.location.latitude,
            12,
            body.initial !== true
          );
        }
      }

      return data;
    } catch (error) {
      this.handleError(error, "runPropertiesSearch");
      onError?.(error);
      this.callbacks.onPropertiesLoadError?.(error);
      this.clearProperties();
      this.setState({ firstCallDone: true });
      return null;
    } finally {
      this.setSearching(false);
      this.setState({ firstCallDone: true });
    }
  }

  private updateActiveLocationFromResponse(data: APIResponse) {
    const newLocationId = data.location_id ?? null;
    const newCity = data.filters.location?.city ?? undefined;
    const newCountry = data.filters.location?.country || "";
    const newCoordinates = data.filters.location
      ? [data.filters.location.latitude, data.filters.location.longitude]
      : undefined;

    if (!newCoordinates) return;

    const currentLocation = this.state.activeLocation;

    // Check if location has changed
    if (
      newLocationId !== currentLocation?.location_id ||
      newCity !== currentLocation?.city ||
      newCountry !== currentLocation?.country
    ) {
      this.setActiveLocation({
        city: newCity,
        country: newCountry,
        location_id: newLocationId,
        locationName:
          newCity && newCountry
            ? `${newCity}, ${newCountry}`
            : newCountry || "",
        coordinates: newCoordinates as [number, number],
      });
    }
  }

  async runSmartFilterSearch({
    query,
    filters,
    onProcessFilters,
    onError,
  }: {
    query?: string;
    filters?: SmartFilter[];
    onProcessFilters?: (
      filters: any,
      location_id?: number
    ) => {
      smartFilters?: SmartFilter[];
      price?: Price | null;
      limit?: number;
      language?: string;
    };
    onError?: (error: unknown) => void;
  }): Promise<APIResponse | null> {
    this.ensureAlive();

    // Build filter payload from smart filters if provided
    let filterPayload = this.getFilters();
    const state = this.getState();

    if (filters && filters.length > 0) {
      const amenities = new Set<string>();
      const hotelStyle = new Set<string>();
      let price: { min: number; max: number } | undefined;
      let minRating: number | undefined;
      let starRating: number | undefined;
      let primary_type: PropertyType | undefined;
      let transformed_query: string | undefined;
      let selected_restaurant_price_levels: PriceLevel[] | undefined;

      filters.forEach((filter) => {
        switch (filter.type) {
          case "amenity":
            amenities.add(filter.value);
            break;
          case "hotelStyle":
            hotelStyle.add(filter.value);
            break;
          case "priceRange":
            if (filter.priceRange) {
              price = {
                min: filter.priceRange.min,
                max: filter.priceRange.max ?? 0,
              };
            }
            break;
          case "minRating":
            minRating = filter.numericValue ?? Number(filter.value);
            break;
          case "starRating":
            starRating = filter.numericValue ?? Number(filter.value);
            break;
          case "primary_type":
            primary_type = filter.propertyType;
            break;
          case "transformed_query":
            transformed_query = filter.value;
            break;
          case "selected_restaurant_price_levels":
            selected_restaurant_price_levels = filter.priceLevels;
            break;
        }
      });

      filterPayload = {
        ...filterPayload,
        ...(amenities.size > 0 && { amenities: Array.from(amenities) }),
        ...(hotelStyle.size > 0 && { hotelStyle: Array.from(hotelStyle) }),
        ...(price && { price }),
        ...(minRating !== undefined && { minRating }),
        ...(starRating !== undefined && { starRating }),
        ...(primary_type && { primary_type }),
        ...(transformed_query && { transformed_query }),
        ...(selected_restaurant_price_levels && {
          selected_restaurant_price_levels,
        }),
      };
    } else if (!query) {
      // Add default minRating if no filters and no query
      filterPayload.minRating = 4;
    }

    const body: InitialRequestBody = {
      filters: filterPayload,
      ...(query && { query }),
      ...(state.bounds
        ? { bounds: state.bounds }
        : state.activeLocation.location_id
          ? { location_id: state.activeLocation.location_id }
          : state.activeLocation.coordinates
            ? { latitude: state.activeLocation.coordinates[0], longitude: state.activeLocation.coordinates[1] }
            : {}),
    };

    return this.runPropertiesSearch({
      body,
      beforeApplyProperties: onProcessFilters
        ? (data) => {
          const result = onProcessFilters(data.filters, data.location_id);
          return {
            price: result.price ?? null,
            limit: result.limit ?? 30,
          };
        }
        : undefined,
      smartFiltersClearable: !!query,
      onError,
    });
  }

  getClusters(): ClusterDisplayItem[] {
    this.ensureAlive();
    return [...this.clusterItems];
  }

  refresh() {
    this.ensureAlive();
    if (!this.adapter) return;

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
    if (this.adapter) {
      const markerManager = this.adapter.getMarkerManager();
      markerManager.destroy();
      this.adapter.cleanup();
    }

    this.clusterItems = [];
    this.properties = [];
    this.destroyed = true;
    this.isMapAttached = false;
  }

  private resolvePrimaryType(): PropertyType {
    return (
      this.primaryType ??
      this.properties.find((marker) => marker.type)?.type ??
      DEFAULT_PRIMARY_TYPE
    );
  }

  private safeExtractViewState(): ViewStateSnapshot | null {
    if (!this.adapter) return null;
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
