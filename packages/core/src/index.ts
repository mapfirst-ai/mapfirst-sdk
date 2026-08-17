import type { MapAdapter } from "./adapters";
import { MapLibreAdapter } from "./adapters/maplibre";
import { GoogleMapsAdapter } from "./adapters/google";
import { MapboxAdapter } from "./adapters/mapbox";
import type {
  APIResponse,
  FilterSchema,
  HotelPricingAPIResponse,
  InitialLocationData,
  InitialRequestBody,
  PollOptions,
  Price,
  PriceLevel,
  Property,
  PropertyType,
  SmartFilter,
} from "./types";
import type { MapLibreNamespace } from "./adapters/maplibre/markermanager";
import type { GoogleMapsNamespace } from "./adapters/google/markermanager";
import type { MapboxNamespace } from "./adapters/mapbox/markermanager";
import type { MarkerOptions } from "./marker";
import {
  ClusterDisplayItem,
  clusterMarkers,
  extractViewState,
  ViewStateSnapshot,
} from "./utils/clustering";
import {
  getLocationIfAlreadyGranted,
  subscribeToLocationPermissionChanges,
} from "./utils/geolocation";
import type {
  MapBounds,
  ActiveLocation,
  FilterState,
  MapState,
  MapStateCallbacks,
  MapStateUpdate,
} from "./state-types";

export type {
  Property,
  PropertyType,
  PriceLevel,
  Price,
  FilterSchema,
  Locale,
  SmartFilter,
} from "./types";

export type { ApiFiltersResponse } from "./utils/filters";
export { processApiFilters, convertToApiFilters } from "./utils/filters";
export {
  getLocationWhenGranted,
  getCurrentLocation,
} from "./utils/geolocation";
export { isWebGLSupported } from "./utils/webgl";

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
export type {
  LeafletNamespace,
  LeafletMarkerHandle,
} from "./adapters/leaflet/markermanager";
export { LeafletMarkerManager } from "./adapters/leaflet/markermanager";
export { LeafletAdapter } from "./adapters/leaflet/index";
export type { MarkerOptions } from "./marker";

// Environment configuration
export type Environment = "prod" | "test";

const API_URLS: Record<Environment, string> = {
  prod: "https://api.mapfirst.ai",
  test: "https://api.mapfirst.ai/test",
};

const API_DISABLED_ERROR_MESSAGE = "API usage is disabled";
const USE_API_FALSE_PLATFORM_ERROR =
  "When useApi is false, only maplibre platform is supported. Google Maps and Mapbox require API usage.";
const USE_API_FALSE_PLATFORM_WARNING =
  "When useApi is false, only maplibre platform is supported. Please switch to maplibre.";

function getDocumentReferrer(): string | undefined {
  try {
    return document.referrer || undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

function createSdkHeaders(apiKey?: string, referrer?: string) {
  return {
    "Content-Type": "application/json",
    "X-Source": "SDK",
    ...(apiKey && { "X-API-Key": apiKey }),
    ...(referrer && { "X-Referer": referrer }),
  };
}

/**
 * Pricing refinements still flowing on a search stream that is already open
 * (see openSearchStream). Handed to the caller with the search envelope so it
 * can decide WHEN merging starts — frames are buffered until then.
 */
interface StreamedPricing {
  begin(opts: {
    price?: Price;
    limit?: number;
  }): Promise<{ completed: boolean }>;
}

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

// Image fetch types
export type TripAdvisorImage = {
  [key: string]: { url: string };
};

export type TripAdvisorImageResponse = {
  photos: TripAdvisorImage[];
};

// Fetch images for a property from Tripadvisor
export async function fetchImages(
  tripadvisorId: number,
  limit: number = 1,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://l4detuz832.execute-api.us-east-1.amazonaws.com/dev/photo?id=${tripadvisorId}&limit=${limit}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TripAdvisorImageResponse;

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0]["FullSizeURL"].url;

      // Verify the image URL is accessible
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.debug("Failed to fetch images:", error);
    return null;
  }
}

// Fetch properties from API
export async function fetchProperties<TBody = any, TResponse = any>(
  url: string,
  body: TBody,
  apiKey?: string,
  { signal }: FetchPropertiesOptions = {},
): Promise<TResponse> {
  const referrer = getDocumentReferrer();
  const response = await fetch(url, {
    method: "POST",
    headers: createSdkHeaders(apiKey, referrer),
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

function toISO(date: Date | string): string {
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}

async function trackMapImpression(
  apiUrl: string,
  apiKey?: string,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    await fetch(`${apiUrl}/${apiKey}/impressions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        type: "map_view",
        ...metadata,
      }),
    });
  } catch (error) {
    // Silently fail - don't block user experience for analytics
    console.debug("Failed to track map impression:", error);
  }
}

export type BaseMapFirstOptions = {
  properties?: Property[];
  primaryType?: PropertyType;
  selectedMarkerId?: number | null;
  onClusterUpdate?: (
    clusters: ClusterDisplayItem[],
    viewState: ViewStateSnapshot | null,
  ) => void;
  // State management options
  state?: Partial<MapState>;
  callbacks?: MapStateCallbacks;
  // API configuration
  useApi?: boolean; // default: true, can only be set at initialization
  environment?: Environment;
  apiKey?: string;
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
  /**
   * Refine pricing over SSE (one server-driven connection) instead of the
   * browser polling loop. Requires a backend exposing POST /properties/stream
   * (mapfirst-backend); api.mapfirst.ai does not. Defaults to false — if the
   * endpoint is missing the SDK falls back to polling automatically and stops
   * retrying it for the session.
   */
  streaming?: boolean;
  // Current location marker option
  currentLocationMarker?: boolean;
  // Request-level options (not filters, sent at body level)
  include_urls?: boolean;
  include_rankings?: boolean;
  include_phone_numbers?: boolean;
  include_address?: boolean;
  include_opening_hours?: boolean;
  include_star_rating?: boolean;
  restrict_location_id?: number;
  restrict_bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
    polygon?: [number, number][];
  };
  chain?: string;
  markerOptions?: {
    showLabel?: boolean;
    hideBadge?: boolean;
    showTail?: boolean;
    hideNonPrimary?: boolean;
    disableHoverCard?: boolean;
    badgeImageUrl?: string;
  };
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

/**
 * Most of the map box that fit padding is ever allowed to consume.
 *
 * The renderers differ in how they fail when padding does not fit, and all the
 * failures are bad: MapLibre/Mapbox abandon the camera move entirely (see
 * resolveFitPadding), while Leaflet will happily solve for a negative viewport
 * and fly somewhere meaningless. Reserving 40% of each axis for actual map
 * keeps a fit possible at any size. It only ever binds on small maps —
 * the defaults (210px vertical) sit under it from roughly 525px of height up.
 */
const MAX_FIT_PADDING_FRACTION = 0.6;

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
  private stopLocationPermissionListener: (() => void) | null = null;
  private locationWatchId: number | null = null;

  // State management
  private state: MapState;
  private callbacks: MapStateCallbacks;

  // API configuration
  private useApi: boolean;
  private readonly environment: Environment;
  private readonly apiUrl: string;
  /** Not readonly: cleared permanently if the backend has no stream endpoint. */
  private streaming: boolean;
  private apiKey?: string;
  private currentPlatform:
    | "google"
    | "maplibre"
    | "mapbox"
    | "leaflet"
    | undefined;
  private requestBody?: InitialRequestBody;
  private readonly fitBoundsPadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  // Request-level options
  private readonly includeUrls: boolean;
  private readonly includeRankings: boolean;
  private readonly includePhoneNumbers: boolean;
  private readonly includeAddress: boolean;
  private readonly includeOpeningHours: boolean;
  private readonly includeStarRating: boolean;
  private readonly restrictLocationId?: number;
  private readonly restrictBounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
    polygon?: [number, number][];
  };
  private readonly chain?: string;

  constructor(private readonly options: MapFirstOptions) {
    this.properties = [...(options.properties ?? [])];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = options.selectedMarkerId ?? null;

    // Initialize API configuration
    this.useApi = options.useApi ?? true;
    this.environment = options.environment ?? "prod";
    this.apiUrl = options.apiUrl ?? API_URLS[this.environment];
    this.streaming = options.streaming ?? false;
    this.apiKey = options.apiKey;
    this.requestBody = options.requestBody;
    this.currentPlatform = options.platform;

    // Request-level options
    this.includeUrls = options.include_urls ?? false;
    this.includeRankings = options.include_rankings ?? false;
    this.includePhoneNumbers = options.include_phone_numbers ?? false;
    this.includeAddress = options.include_address ?? false;
    this.includeOpeningHours = options.include_opening_hours ?? false;
    this.includeStarRating = options.include_star_rating ?? false;
    this.restrictLocationId = options.restrict_location_id;
    this.restrictBounds = options.restrict_bounds;
    this.chain = options.chain;

    // Validate platform restrictions when useApi is false
    this.assertPlatformSupportForNoApi(options.platform, "throw");

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
      center:
        options.initialLocationData?.latitude &&
        options.initialLocationData.longitude
          ? [
              options.initialLocationData.latitude,
              options.initialLocationData.longitude,
            ]
          : [0, 0],
      zoom: options.initialLocationData?.zoom ?? 0,
      bounds: options.initialLocationData?.bounds ?? null,
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
      userLocation: null,
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

  private assertPlatformSupportForNoApi(
    platform: "google" | "maplibre" | "mapbox" | "leaflet" | undefined,
    mode: "throw" | "warn",
  ): void {
    if (
      this.useApi ||
      !platform ||
      platform === "maplibre" ||
      platform === "leaflet"
    ) {
      return;
    }
    if (mode === "throw") {
      throw new Error(USE_API_FALSE_PLATFORM_ERROR);
    }
    console.warn(USE_API_FALSE_PLATFORM_WARNING);
  }

  private ensureApiEnabled(
    method: string,
    onError?: (error: unknown) => void,
  ): boolean {
    if (this.useApi) return true;
    console.warn(`${method} requires API usage. Set useApi to true.`);
    onError?.(new Error(API_DISABLED_ERROR_MESSAGE));
    return false;
  }

  private async initializeFromLocationData(
    locationData: InitialLocationData,
  ): Promise<void> {
    if (!this.ensureApiEnabled("initializeFromLocationData")) {
      return;
    }
    try {
      const {
        city,
        state,
        country,
        query,
        latitude,
        longitude,
        radius,
        bounds,
      } = locationData;

      const requestBody: InitialRequestBody = {
        filters: this.getFilters(),
        initial: true,
        query,
        latitude,
        longitude,
        radius,
        bounds,
        ...this.getRequestLevelOptions(),
      };

      const location = [city, state].filter(Boolean).join(", ");

      if (country || location) {
        const geoResponse = await fetch(
          `${this.apiUrl}/geo-lookup2?${new URLSearchParams({
            ...(country && { country_code: country }),
            ...(location && { q: location }),
          }).toString()}`,
          {
            headers: {
              ...(this.apiKey && {
                "X-API-Key": this.apiKey,
              }),
            },
          },
        );

        if (geoResponse.ok) {
          const place = (await geoResponse.json()) as {
            id?: number;
            lon?: number;
            lat?: number;
            name: string;
            state?: string;
            country?: string;
            country_code?: string;
            type: string;
          };

          requestBody.city = ![
            "country",
            "island",
            "island group",
            "state",
          ].includes(place.type)
            ? place.name
            : undefined;
          requestBody.state =
            place.type === "state"
              ? place.name
              : !["country", "island", "island group", "county"].includes(
                    place.type,
                  )
                ? place.state
                : undefined;
          requestBody.country = ["country", "island", "island group"].includes(
            place.type,
          )
            ? place.name
            : place.country;
          requestBody.location_id = place.id;
          requestBody.latitude = place.lat;
          requestBody.longitude = place.lon;

          this.setActiveLocation({
            city,
            state,
            country,
            location_id: place.id ?? null,
            locationName: [city, state, country].filter(Boolean).join(", "),
            ...(place.lon &&
              place.lat && { coordinates: [place.lat, place.lon] }),
          });

          if (place.lon && place.lat) {
            this.setState({
              center: [place.lat, place.lon],
              zoom: city ? 12 : state ? 8 : 5,
            });
          }
        } else {
          this.handleError(
            new Error(`Geo mapping fetch failed: ${geoResponse.statusText}`),
            "initializeFromLocationData",
          );
        }
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
    if (!this.ensureApiEnabled("autoLoadProperties")) {
      return;
    }
    if (!this.requestBody) return;

    // Default request body structure based on InitialDataLoader.tsx
    const defaultRequestBody: InitialRequestBody = {
      filters: this.getFilters(),
      initial: true,
      ...this.requestBody,
      ...this.getRequestLevelOptions(),
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
      markerOptions?: MarkerOptions;
    },
  ): void {
    // Validate platform restrictions when useApi is false
    this.assertPlatformSupportForNoApi(config.platform, "throw");

    if (this.isMapAttached) {
      console.warn("Map is already attached. Destroying previous adapter.");
      this.stopLocationPermissionListener?.();
      this.stopLocationPermissionListener = null;
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
      ...(config.markerOptions !== undefined && {
        markerOptions: config.markerOptions,
      }),
    };

    this.currentPlatform = config.platform;
    this.adapter = this.createAdapter(adapterConfig);
    this.isMapAttached = true;
    this.refresh();

    // Initialize current location marker if enabled
    if (this.options.currentLocationMarker) {
      this.initializeCurrentLocationMarker();
      void this.setupCurrentLocationPermissionListener();
    }

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
        markerOptions: options.markerOptions,
      });
    }
    if (isGoogleMapsOptions(options) && options.mapInstance) {
      return this.initializeAdapter(
        new GoogleMapsAdapter(options.mapInstance),
        {
          google: options.google,
          onMarkerClick: options.onMarkerClick,
          markerOptions: options.markerOptions,
        },
      );
    }
    if (isMapboxOptions(options) && options.mapInstance) {
      return this.initializeAdapter(new MapboxAdapter(options.mapInstance), {
        mapboxgl: options.mapboxgl,
        onMarkerClick: options.onMarkerClick,
        markerOptions: options.markerOptions,
      });
    }
    if ("adapter" in options && options.adapter) {
      return options.adapter;
    }
    return null;
  }

  private initializeAdapter(adapter: MapAdapter, config: any): MapAdapter {
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
        this.setSelectedMarker(
          marker.tripadvisor_id === this.selectedMarkerId
            ? null
            : marker.tripadvisor_id,
        );
        config.onMarkerClick?.(marker);
      },
      onRefresh: () => this.refresh(),
      onMapMoveEnd: (bounds: MapBounds) => {
        // Only call handleMapMoveEnd if it's a real movement, not initial setup
        if (this.state.tempBounds === null) {
          this.setTempBounds(bounds);
          this.setPendingBounds(null);
        } else {
          this.handleMapMoveEnd(bounds);
        }
      },
    });

    // Set up impression tracking when map becomes visible in viewport
    if (this.useApi) {
      adapter.setupImpressionTracking(() => {
        // trackMapImpression(this.apiUrl, this.apiKey, {
        //   platform: this.currentPlatform,
        //   environment: this.environment,
        // });
        // console.log("ToDo: Track Map Impression");
      });
    }

    return adapter;
  }

  _setProperties(properties: Property[]) {
    this.ensureAlive();
    this.properties = [
      ...properties.filter(
        (x) => !!x.location && x.pricing?.availability !== "unavailable",
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

  /**
   * Initialize current location marker fetching.
   * Retrieves user location and renders blue dot marker on map.
   */
  private async initializeCurrentLocationMarker(): Promise<void> {
    try {
      const synced = await this.syncUserLocationIfGranted({
        maxAttempts: 3,
        timeoutMs: 10000,
      });
      if (synced) {
        // Permission is already granted at startup; enable continuous tracking immediately.
        this.startLocationTracking();
      }
    } catch (error) {
      // Silently fail if geolocation is not available or user denies permission
      console.debug("Current location marker initialization failed:", error);
    }
  }

  /**
   * Try to resolve and set user location when permission is already granted.
   * Retries help with transient startup timing issues where coordinates are not
   * immediately available even though permission is granted.
   */
  private async syncUserLocationIfGranted({
    maxAttempts = 1,
    timeoutMs = 10000,
    retryDelayMs = 1200,
  }: {
    maxAttempts?: number;
    timeoutMs?: number;
    retryDelayMs?: number;
  } = {}): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (this.destroyed) return false;

      const location = await getLocationIfAlreadyGranted(timeoutMs);
      if (location) {
        this.setUserLocation(location);
        return true;
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    return false;
  }

  /**
   * Observe permission transitions and update location marker automatically.
   */
  private async setupCurrentLocationPermissionListener(): Promise<void> {
    this.stopLocationPermissionListener?.();
    this.stopLocationPermissionListener = null;

    this.stopLocationPermissionListener =
      await subscribeToLocationPermissionChanges({
        onGranted: async () => {
          if (this.destroyed) return;
          await this.syncUserLocationIfGranted({
            maxAttempts: 2,
            timeoutMs: 10000,
          });
          // Start continuous tracking when permission is granted
          this.startLocationTracking();
        },
        onDenied: () => {
          if (this.destroyed) return;
          this.setUserLocation(null);
          // Stop watching when permission is denied
          this.stopLocationTracking();
        },
      });
  }

  /**
   * Start continuous location tracking using watchPosition.
   * Updates blue dot marker in real-time as user moves.
   */
  private startLocationTracking(): void {
    if (!navigator.geolocation || this.locationWatchId !== null) {
      return;
    }

    this.locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        if (this.destroyed) return;
        this.setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Silently handle watch errors (permission denied, unavailable, etc.)
        console.debug("Location watch failed:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  /**
   * Stop continuous location tracking.
   */
  private stopLocationTracking(): void {
    if (this.locationWatchId !== null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
  }

  /**
   * Update the user's current location and render the marker.
   */
  setUserLocation(location: { lat: number; lng: number } | null): void {
    this.ensureAlive();
    if (this.state.userLocation === location) return;

    this.updateState({ userLocation: location });
    this.callbacks.onUserLocationChange?.(location);
    this.refresh();
  }

  /**
   * Sync user location after the app has handled permission UI.
   * This method never prompts for permission; it only reads coordinates if
   * permission is already granted.
   */
  async onLocationPermissionResult(granted: boolean): Promise<boolean> {
    this.ensureAlive();
    if (!granted) {
      this.setUserLocation(null);
      this.stopLocationTracking();
      return false;
    }

    const synced = await this.syncUserLocationIfGranted({
      maxAttempts: 2,
      timeoutMs: 10000,
    });

    if (synced) {
      this.startLocationTracking();
    }

    return synced;
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
      newState.pendingBounds !== undefined &&
      newState.pendingBounds !== prevState.pendingBounds
    ) {
      this.callbacks.onPendingBoundsChange?.(newState.pendingBounds);
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
    if (
      newState.firstCallDone !== undefined &&
      newState.firstCallDone !== prevState.firstCallDone
    ) {
      this.callbacks.onFirstCallDoneChange?.(newState.firstCallDone);
    }
    if (
      newState.isFlyToAnimating !== undefined &&
      newState.isFlyToAnimating !== prevState.isFlyToAnimating
    ) {
      this.callbacks.onIsFlyToAnimatingChange?.(newState.isFlyToAnimating);
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

  handleMapMoveEnd(bounds: MapBounds) {
    if (this.state.isFlyToAnimating) {
      this.setState({
        isFlyToAnimating: false,
        tempBounds: bounds,
        pendingBounds: null,
      });
      return;
    }

    const tempBounds = this.state.tempBounds;
    if (!tempBounds) {
      this.setState({
        tempBounds: bounds,
        pendingBounds: bounds,
      });
      return;
    }

    const delta = 0.01;
    const hasChanged =
      Math.abs(bounds.sw.lat - tempBounds.sw.lat) > delta ||
      Math.abs(bounds.sw.lng - tempBounds.sw.lng) > delta ||
      Math.abs(bounds.ne.lat - tempBounds.ne.lat) > delta ||
      Math.abs(bounds.ne.lng - tempBounds.ne.lng) > delta;

    if (hasChanged) {
      this.setState({ pendingBounds: bounds });
    } else {
      this.setState({ pendingBounds: null });
    }
  }

  flyMapTo(
    longitude: number,
    latitude: number,
    zoom?: number | null,
    animation: boolean = true,
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

    if (this.currentPlatform === "leaflet") {
      this.setFlyToAnimating(true);
      if (mapInstance.flyTo) {
        mapInstance.flyTo([latitude, longitude], zoom ?? 13);
        mapInstance.once?.("moveend", () => this.setFlyToAnimating(false));
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

  private extractPoiPoints(
    properties: Property[],
    type?: PropertyType,
  ): { lat: number; lng: number }[] {
    return properties
      .filter(
        (property) =>
          property.location !== undefined &&
          typeof property.location.lat === "number" &&
          Number.isFinite(property.location.lat) &&
          typeof property.location.lon === "number" &&
          Number.isFinite(property.location.lon) &&
          (type !== undefined ? property.type === type : true),
      )
      .map((property) => ({
        lat: property.location!.lat,
        lng: property.location!.lon,
      }));
  }

  /**
   * The map's drawing area in CSS pixels, or null when it cannot be determined.
   * Every renderer exposes this differently and none is guaranteed to be
   * present, so each lookup is optional and failure is non-fatal.
   */
  private getMapPixelSize(
    mapInstance: any,
  ): { width: number; height: number } | null {
    try {
      const usable = (w: unknown, h: unknown) =>
        typeof w === "number" &&
        typeof h === "number" &&
        Number.isFinite(w) &&
        Number.isFinite(h) &&
        w > 0 &&
        h > 0
          ? { width: w, height: h }
          : null;

      if (this.currentPlatform === "google") {
        const div = mapInstance?.getDiv?.();
        return usable(div?.offsetWidth, div?.offsetHeight);
      }
      if (this.currentPlatform === "leaflet") {
        const size = mapInstance?.getSize?.();
        return usable(size?.x, size?.y);
      }
      // MapLibre / Mapbox
      const canvas = mapInstance?.getCanvas?.();
      const fromCanvas = usable(canvas?.clientWidth, canvas?.clientHeight);
      if (fromCanvas) return fromCanvas;
      const container = mapInstance?.getContainer?.();
      return usable(container?.clientWidth, container?.clientHeight);
    } catch {
      return null;
    }
  }

  /**
   * Fit padding the map can actually honour.
   *
   * `fitBoundsPadding` is fixed at construction (default 50 top / 160 bottom =
   * 210px vertical). On a short map that exceeds the drawing area, and MapLibre
   * then refuses to move the camera AT ALL — cameraForBounds works out the space
   * left after padding and gives up when it goes negative:
   *
   *     b = (height - (top + bottom + offset)) / v.y
   *     if (b < 0 || x < 0) return void warnOnce();
   *
   * The only symptom is a console warning ("Map cannot fit within canvas with
   * the given bounds, padding, and/or offset"), so fitBounds silently does
   * nothing and the map never reframes. A real case: the widget embedded at
   * 315x250 leaves a 313x197 canvas, where 210px of vertical padding cannot fit,
   * so switching the primary type updated the markers but never the framing.
   *
   * Clamping to a fraction of the map box gives a small map a tighter fit
   * instead of no fit, while anything with room keeps the configured values
   * exactly. The ratio between opposing sides is preserved, so the intent of a
   * larger bottom gutter (room for a card carousel) survives the scaling.
   */
  private resolveFitPadding(mapInstance: any): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } {
    const padding = this.fitBoundsPadding;
    const size = this.getMapPixelSize(mapInstance);
    // Unknown size: leave the configured values untouched rather than guess.
    if (!size) return padding;

    const clamp = (a: number, b: number, extent: number): [number, number] => {
      const total = a + b;
      const max = extent * MAX_FIT_PADDING_FRACTION;
      if (total <= max || total <= 0) return [a, b];
      const scale = max / total;
      return [Math.floor(a * scale), Math.floor(b * scale)];
    };

    const [top, bottom] = clamp(padding.top, padding.bottom, size.height);
    const [left, right] = clamp(padding.left, padding.right, size.width);
    return { top, bottom, left, right };
  }

  flyToPOIs(
    pois?: { lat: number; lng: number }[],
    type?: PropertyType,
    animate: boolean = true,
  ) {
    this.ensureAlive();
    if (!this.adapter) return;
    const mapInstance = this.adapter.getMap();
    if (!mapInstance) return;

    let points = pois;
    if (!points || points.length === 0) {
      points = this.extractPoiPoints(this.properties, type);
    }
    if (!points || points.length === 0) return;

    // Filter out any points with non-finite coordinates to prevent map errors
    points = points.filter(
      (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng),
    );
    if (points.length === 0) return;

    // Check if this is Google Maps

    if (points.length === 1) {
      const poi = points[0];
      if (this.currentPlatform === "google") {
        mapInstance.setCenter({ lat: poi.lat, lng: poi.lng });
        mapInstance.setZoom(13);
      } else if (this.currentPlatform === "leaflet") {
        if (mapInstance.flyTo) {
          mapInstance.flyTo([poi.lat, poi.lng], 13);
        }
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
          mapInstance.fitBounds(bounds, this.resolveFitPadding(mapInstance));
        }
      } else if (this.currentPlatform === "leaflet" && mapInstance.fitBounds) {
        // Leaflet: fitBounds uses [[lat, lng], [lat, lng]]
        const sw: [number, number] = [points[0].lat, points[0].lng];
        const ne: [number, number] = [points[0].lat, points[0].lng];
        points.forEach((poi) => {
          sw[0] = Math.min(sw[0], poi.lat);
          sw[1] = Math.min(sw[1], poi.lng);
          ne[0] = Math.max(ne[0], poi.lat);
          ne[1] = Math.max(ne[1], poi.lng);
        });
        if (animate) {
          this.setFlyToAnimating(true);
        }
        // Leaflet padding is [x, y] and applies to BOTH sides of each axis,
        // so 40 costs 80px of width and 80px of height — more than a very short
        // map has. Clamp it the same way the other renderers are clamped.
        const leafletSize = this.getMapPixelSize(mapInstance);
        const leafletPad = (extent: number | undefined): number =>
          extent && extent > 0
            ? Math.min(40, Math.floor((extent * MAX_FIT_PADDING_FRACTION) / 2))
            : 40;
        mapInstance.fitBounds([sw, ne], {
          padding: [
            leafletPad(leafletSize?.width),
            leafletPad(leafletSize?.height),
          ] as [number, number],
          animate,
        });
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
          padding: this.resolveFitPadding(mapInstance),
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
    // Always reflect the current primary type
    if (this.primaryType) {
      filters.primary_type = this.primaryType;
    }
    return filters as FilterSchema;
  }

  private getRequestLevelOptions(): Partial<InitialRequestBody> {
    return {
      ...(this.includeUrls && { include_urls: true }),
      ...(this.includeRankings && { include_rankings: true }),
      ...(this.includePhoneNumbers && { include_phone_numbers: true }),
      ...(this.includeAddress && { include_address: true }),
      ...(this.includeOpeningHours && { include_opening_hours: true }),
      ...(this.includeStarRating && { include_star_rating: true }),
      ...(this.restrictLocationId !== undefined && {
        restrict_location_id: this.restrictLocationId,
      }),
      ...(this.restrictBounds !== undefined && {
        restrict_bounds: this.restrictBounds,
      }),
      ...(this.chain !== undefined && {
        chain: this.chain,
      }),
    };
  }

  /**
   * Merge ONE batch of priced results into `this.properties`.
   *
   * Shared by the polling loop and the SSE stream deliberately: two copies of
   * this drifted apart is exactly how a streamed result ends up ranked or
   * filtered differently from a polled one, for the same data.
   */
  /**
   * Stream pricing over SSE instead of polling from the browser.
   *
   * `pollForPricing` makes one request per attempt (up to maxAttempts), each
   * paying full round-trip latency and each independently throttleable. Here the
   * SERVER drives the TripAdvisor poll loop and pushes refinements down ONE
   * connection (POST /properties/stream):
   *
   *     event: properties  {…search result}       immediately
   *     event: pricing     {results, isComplete}  0..N as prices arrive
   *     event: complete    {isComplete}           always last
   *
   * EventSource cannot POST, so this reads the fetch body stream directly and
   * parses frames itself. Requires a backend exposing /properties/stream
   * (mapfirst-backend); returns { completed: false, unsupported: true } if the
   * endpoint is absent so the caller can fall back to pollForPricing.
   *
   * Each `pricing` frame goes through applyPricingBatch — the SAME merge the
   * polling path uses — so streamed and polled results cannot diverge.
   */
  async streamPricing({
    pollingLink,
    isCancelled,
    price,
    limit,
    requestBody,
  }: Omit<PollOptions, "maxAttempts" | "delayMs">): Promise<{
    completed: boolean;
    unsupported?: boolean;
  }> {
    this.ensureAlive();
    if (!this.ensureApiEnabled("streamPricing")) return { completed: false };

    const filters = this.getFilters();
    if (limit) filters.limit = limit;
    const body = {
      ...requestBody,
      filters,
      // Sending the pollingLink puts the endpoint in RESUME mode: it skips its
      // own search and streams only pricing refinements. Without it the server
      // re-runs the same query the caller just ran via POST /properties — two
      // identical searches per user search.
      ...(pollingLink && { pollingLink }),
      ...this.getRequestLevelOptions(),
    };

    const controller = new AbortController();
    let completed = false;
    try {
      const resp = await fetch(`${this.apiUrl}/properties/stream`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: createSdkHeaders(this.apiKey, getDocumentReferrer()),
        signal: controller.signal,
      });
      // 404/405 means this deployment predates the stream — the caller falls
      // back to polling rather than losing pricing entirely.
      if (resp.status === 404 || resp.status === 405) {
        return { completed: false, unsupported: true };
      }
      if (!resp.ok || !resp.body) {
        throw new PropertiesFetchError({
          message: `Stream failed: ${resp.status}`,
          status: resp.status,
        });
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (isCancelled?.()) {
          controller.abort();
          return { completed };
        }
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Frames are separated by a blank line. Keep the trailing partial in
        // the buffer — a chunk boundary can land mid-frame.
        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const raw = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          if (raw.startsWith(":")) continue; // heartbeat
          const eventMatch = /^event: (.*)$/m.exec(raw);
          const dataMatch = /^data: (.*)$/m.exec(raw);
          if (!eventMatch || !dataMatch) continue;
          let payload: any;
          try {
            payload = JSON.parse(dataMatch[1]!);
          } catch {
            continue; // a malformed frame must not kill the stream
          }
          switch (eventMatch[1]) {
            case "pricing":
              this.applyPricingBatch(payload, price);
              break;
            case "complete":
              completed = payload?.isComplete === true;
              if (completed) this.finalizePricing();
              break;
            case "error":
              throw new PropertiesFetchError({
                message: String(payload?.message ?? "stream error"),
                status: 500,
              });
            default:
              break; // "properties" — the caller already rendered these
          }
        }
      }
      return { completed };
    } catch (error) {
      if (isCancelled?.()) return { completed };
      this.callbacks.onPropertiesLoadError?.(error as Error);
      return { completed };
    } finally {
      controller.abort();
    }
  }

  /**
   * Run the search AND its pricing refinement over one POST /properties/stream.
   *
   * Resolves as soon as the `properties` frame arrives, so the caller renders
   * at the same moment it used to — the difference is that no second request is
   * needed, because pricing keeps flowing on the connection already open. This
   * is what removes the `properties` + `stream` pair from the network panel.
   *
   * Pricing frames that arrive before begin() is called are BUFFERED, not
   * applied. The caller only knows `price`/`limit` after beforeApplyProperties
   * has run, and a frame that beat that would merge without the price filter —
   * today the server's poll delay hides the race, which is exactly the kind of
   * thing that breaks when a cache makes the first poll instant.
   *
   * Returns { unsupported: true } on 404/405 so the caller can fall back to
   * POST /properties rather than losing the search.
   */
  private async openSearchStream(
    body: unknown,
  ): Promise<{
    unsupported?: boolean;
    data?: APIResponse;
    pricing?: StreamedPricing;
  }> {
    this.ensureAlive();
    const controller = new AbortController();
    let resp: Response;
    try {
      resp = await fetch(`${this.apiUrl}/properties/stream`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: createSdkHeaders(this.apiKey, getDocumentReferrer()),
        signal: controller.signal,
      });
    } catch (error) {
      controller.abort();
      throw error;
    }
    // A deployment predating the stream, or one where the search itself failed.
    // Both fall back to POST /properties: a 5xx here is a real error status
    // precisely because the server runs the search BEFORE hijacking the reply.
    if (!resp.ok || !resp.body) {
      controller.abort();
      if (resp.status === 404 || resp.status === 405) return { unsupported: true };
      throw new PropertiesFetchError({
        message: `Stream failed: ${resp.status}`,
        status: resp.status,
      });
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let settled = false;
    let completed = false;
    /** Frames seen before begin(); replayed in order once options are known. */
    const buffered: unknown[] = [];
    let apply: ((payload: unknown) => void) | null = null;

    return await new Promise((resolveOpen, rejectOpen) => {
      // Drives the connection for its whole life. The caller's promise settles
      // early (on the properties frame); this keeps running for pricing.
      const pump = (async (): Promise<{ completed: boolean }> => {
        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let sep: number;
            while ((sep = buffer.indexOf("\n\n")) !== -1) {
              const raw = buffer.slice(0, sep);
              buffer = buffer.slice(sep + 2);
              if (raw.startsWith(":")) continue; // heartbeat
              const eventMatch = /^event: (.*)$/m.exec(raw);
              const dataMatch = /^data: (.*)$/m.exec(raw);
              if (!eventMatch || !dataMatch) continue;
              let payload: any;
              try {
                payload = JSON.parse(dataMatch[1]!);
              } catch {
                continue; // a malformed frame must not kill the stream
              }
              switch (eventMatch[1]) {
                case "properties":
                  if (!settled) {
                    settled = true;
                    resolveOpen({
                      data: payload as APIResponse,
                      pricing: {
                        begin: (opts) => {
                          apply = (p) => this.applyPricingBatch(p as never, opts.price);
                          for (const p of buffered.splice(0)) apply(p);
                          return pump;
                        },
                      },
                    });
                  }
                  break;
                case "pricing":
                  if (apply) apply(payload);
                  else buffered.push(payload);
                  break;
                case "complete":
                  completed = payload?.isComplete === true;
                  if (completed) {
                    // Flush anything still held: a stream can complete before
                    // begin() when the search needed no refinement.
                    if (apply) for (const p of buffered.splice(0)) apply(p);
                    this.finalizePricing();
                  }
                  break;
                case "error":
                  throw new PropertiesFetchError({
                    message: String(payload?.message ?? "stream error"),
                    status: 500,
                  });
                default:
                  break;
              }
            }
          }
          return { completed };
        } finally {
          controller.abort();
        }
      })();

      // A stream that ends without ever sending `properties` is a failed
      // search, not an empty one — surface it so the caller can fall back
      // instead of rendering nothing.
      pump.then(
        () => {
          if (!settled) {
            settled = true;
            resolveOpen({ unsupported: true });
          }
        },
        (error) => {
          if (!settled) {
            settled = true;
            rejectOpen(error);
          }
        },
      );
    });
  }

  /**
   * The end-of-pricing step, shared by the polling and streaming paths.
   *
   * Drops accommodations that never got a bookable offer, then clears the
   * searching flag. streamPricing originally only set its local `completed`
   * and skipped BOTH of these — so the spinner span forever and sold-out
   * hotels stayed on the map even though the stream had emitted `complete`.
   */
  private finalizePricing(): void {
    // Promo properties are exempt: they never price, so "no bookable offer"
    // is their permanent — and correct — state.
    this.setProperties((prev) =>
      prev.filter(
        (property) =>
          property.type !== "Accommodation" ||
          !!property.promo ||
          (property.pricing?.offer?.availability === "available" &&
            property.pricing?.offer?.displayPrice),
      ),
    );
    this.setSearching(false);
  }

  private applyPricingBatch(
    success: HotelPricingAPIResponse["success"] | undefined,
    price?: { min: number; max: number },
  ): void {
    const results = success?.results ?? [];
    const unsupportedIds = new Set(success?.invalidHotelIds?.map(Number) ?? []);
    const unsupportedIds2 = new Set(
      success?.unsupportedHotelIds?.map(Number) ?? [],
    );

    if (results.length > 0 || unsupportedIds.size > 0) {
      this.setProperties((prev) => {
        const updatedProperties = prev.filter(
          (property) =>
            !unsupportedIds.has(property.tripadvisor_id) &&
            !unsupportedIds2.has(property.tripadvisor_id),
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
            (h) => h.tripadvisor_id === property.tripadvisor_id,
          );
          if (existingIndex >= 0) {
            // Pricing frames replace the row wholesale; carry `promo` over so
            // a server-injected offer can't be wiped by a price arriving.
            const prevPromo = updatedProperties[existingIndex].promo;
            updatedProperties[existingIndex] = prevPromo
              ? { ...property, promo: property.promo ?? prevPromo }
              : property;
          } else {
            updatedProperties.push(property);
          }
        });
        return updatedProperties;
      });
    }
  }

  async pollForPricing({
    pollingLink,
    maxAttempts = 15,
    delayMs = 2000,
    isCancelled,
    price,
    limit,
    requestBody,
  }: PollOptions): Promise<{
    completed: boolean;
    pollData?: HotelPricingAPIResponse;
  }> {
    this.ensureAlive();

    if (!this.ensureApiEnabled("pollForPricing")) {
      return { completed: false };
    }

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
      ...requestBody,
      filters,
      pollingLink,
      ...this.getRequestLevelOptions(),
    };

    const referrer = getDocumentReferrer();
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (isCancelled?.()) {
        return { completed, pollData };
      }

      try {
        const pollResp = await fetch(
          `${this.apiUrl}/ta-polling?pollingNumber=${attempt}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: createSdkHeaders(this.apiKey, referrer),
          },
        );

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

        this.applyPricingBatch(pollData?.success, price);

        // When isComplete, always remove hotels without a valid offer/availability,
        // regardless of whether this final response contained any results.
        if (pollData?.success?.isComplete) {
          this.finalizePricing();
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
    const typeCounts = properties.reduce(
      (counts, property) => {
        counts[property.type] = (counts[property.type] || 0) + 1;
        return counts;
      },
      {} as Record<PropertyType, number>,
    );

    return Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0] as PropertyType] > typeCounts[b[0] as PropertyType]
        ? a
        : b,
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

    if (!this.ensureApiEnabled("runPropertiesSearch", onError)) {
      return null;
    }

    this.setState({ firstCallDone: false });
    this.setSearching(true);
    this.clearProperties();

    try {
      const enrichedBody = { ...body, ...this.getRequestLevelOptions() };

      // ONE request when streaming: /properties/stream runs the search itself
      // and pushes pricing down the SAME connection, so the browser no longer
      // shows `properties` and `stream` back to back. openSearchStream resolves
      // the moment the `properties` frame lands — everything below is unchanged
      // and still runs against a fully-formed search envelope.
      let data: APIResponse;
      let pricing: StreamedPricing | null = null;
      const streamed = this.streaming
        ? await this.openSearchStream(enrichedBody)
        : null;
      if (streamed && !streamed.unsupported) {
        data = streamed.data!;
        pricing = streamed.pricing!;
      } else {
        if (streamed?.unsupported) {
          // Endpoint absent → this deployment cannot stream. Do not retry it
          // for the rest of the session; every search would pay the failed
          // request first. Property fetching still works: we fall back to the
          // plain POST below rather than losing the search entirely.
          this.streaming = false;
        }
        data = await fetchProperties<InitialRequestBody, APIResponse>(
          `${this.apiUrl}/properties`,
          enrichedBody,
          this.apiKey,
        );
      }

      this.updateActiveLocationFromResponse(data);

      let price: Price | null = null;
      let limit: number = 30;
      let primary_type: PropertyType | undefined = data.filters.primary_type;

      if (data.isComplete) {
        // Same promo exemption as finalizePricing — a server-injected offer
        // property must survive an already-complete response.
        data.properties = data.properties.filter(
          (property) =>
            property.type !== "Accommodation" ||
            !!property.promo ||
            (property.pricing?.offer?.availability === "available" &&
              property.pricing?.offer?.displayPrice),
        );
      }

      if (beforeApplyProperties) {
        const result = beforeApplyProperties(data);
        price = result.price ?? null;
        limit = result.limit ?? 30;
      }

      // Track if we've already flown to POIs
      const flown = data.properties.some((x) => !!x.location);
      const primaryTypePoiPoints = this.extractPoiPoints(
        data.properties,
        data.filters.primary_type,
      );

      // Apply price filtering if price range is specified
      const filteredProperties = price
        ? data.properties.map((x) =>
            x.pricing?.offer
              ? {
                  ...x,
                  ...(x.pricing?.offer && {
                    pricing: {
                      ...x.pricing,
                      availability: x.pricing.offer.price
                        ? x.pricing.offer.price < price.min ||
                          x.pricing.offer.price > price.max
                          ? "unavailable"
                          : x.pricing.availability
                        : "unavailable",
                    },
                  }),
                }
              : x,
          )
        : data.properties;

      // Apply properties
      this._setProperties(filteredProperties);

      // Fly to POIs if properties have locations
      if (flown) {
        this.flyToPOIs(primaryTypePoiPoints, undefined, body.initial !== true);
      }

      // Determine and set primary type
      if (
        data.filters.primary_type &&
        data.properties.filter(
          (property) =>
            property.type === data.filters.primary_type &&
            (property.type === "Accommodation"
              ? property.pricing?.availability !== "unavailable"
              : true),
        ).length > 0
      ) {
        primary_type = data.filters.primary_type;
        this.setPrimaryType(data.filters.primary_type);
      } else if (data.properties.length > 0) {
        const mostCommonType = this.mostCommonTypeFromProperties(
          data.properties,
        );
        this.setPrimaryType(mostCommonType);
        primary_type = mostCommonType;
      }

      this.setState({ firstCallDone: true });

      // Pricing refinement. Prefer the SSE stream — one connection, server-driven
      // — and fall back to the polling loop when `streaming` is off or the
      // backend has no /properties/stream (older deployments answer 404/405).
      // Both paths share applyPricingBatch, so the merged result is identical.
      if (data.isComplete === false && data.pollingLink) {
        let refined: { completed: boolean; unsupported?: boolean } | null = null;
        if (pricing) {
          // Refinements are already flowing on the open connection. Release the
          // frames buffered since the properties frame — they are held rather
          // than applied on arrival because `price`/`limit` are only known once
          // beforeApplyProperties has run above, and a frame that beat it would
          // merge without the price filter.
          refined = await pricing.begin({
            ...(price && { price }),
            ...(limit && { limit }),
          });
        } else if (this.streaming) {
          // No open stream (the search came from the plain POST) — refine over
          // a resume-mode stream, which skips its own search.
          refined = await this.streamPricing({
            pollingLink: data.pollingLink,
            ...(price && { price }),
            ...(limit && { limit }),
            requestBody: enrichedBody,
          });
          if (refined.unsupported) {
            this.streaming = false;
            refined = null;
          }
        }
        const { completed, pollData } = refined
          ? { completed: refined.completed, pollData: undefined }
          : await this.pollForPricing({
          pollingLink: data.pollingLink,
          ...(price && { price }),
          ...(limit && { limit }),
          requestBody: enrichedBody,
        });

        if (
          completed &&
          pollData?.success?.results &&
          pollData.success.results.filter(
            (property) =>
              property.type === data.filters.primary_type &&
              (property.type === "Accommodation"
                ? property.pricing?.availability !== "unavailable"
                : true),
          ).length === 0 &&
          primary_type &&
          primary_type !== data.filters.primary_type
        ) {
          const mostCommonType = this.mostCommonTypeFromProperties(
            data.properties,
          );
          this.setPrimaryType(mostCommonType);
        }

        // Ensure markers are refreshed after polling completes
        if (completed) {
          this.refresh();
        }
      } else if (data.isComplete === true) {
        // Already priced. The server emits `complete` and ends without polling,
        // so drain the connection rather than leaving it dangling — begin()
        // resolves on the terminator.
        if (pricing) await pricing.begin({});
        // If the initial response is complete, set searching to false now
        this.setSearching(false);
      }

      // Fly to POIs if not already done
      if (!flown) {
        if (
          data.filters.location?.latitude &&
          data.filters.location?.longitude
        ) {
          this.flyMapTo(
            data.filters.location.longitude,
            data.filters.location.latitude,
            12,
            body.initial !== true,
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
      this.setSearching(false);
      return null;
    }
  }

  async performBoundsSearch(): Promise<APIResponse | null> {
    this.ensureAlive();

    if (!this.ensureApiEnabled("performBoundsSearch")) {
      return null;
    }

    if (!this.state.pendingBounds) {
      return null;
    }

    const filters = this.getFilters();
    const body: InitialRequestBody = {
      bounds: this.state.pendingBounds,
      filters,
      ...this.getRequestLevelOptions(),
    };

    const priceFilter = filters?.price ?? undefined;

    const result = await this.runPropertiesSearch({
      body,
      beforeApplyProperties: () => {
        return { price: priceFilter ?? null };
      },
    });

    if (result) {
      this.setBounds(this.state.pendingBounds);
      this.setTempBounds(this.state.pendingBounds);
      this.setPendingBounds(null);
    }

    return result;
  }

  private updateActiveLocationFromResponse(data: APIResponse) {
    const newLocationId = data.location_id ?? null;
    const newCity = data.filters.location?.city ?? undefined;
    const newCountry = data.filters.location?.country || "";
    const newCoordinates = data.filters.location
      ? [data.filters.location.latitude, data.filters.location.longitude]
      : undefined;

    const currentLocation = this.state.activeLocation;

    // Update if we have new coordinates or a new location_id
    if (
      newCoordinates ||
      (newLocationId && newLocationId !== currentLocation?.location_id)
    ) {
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
          ...(newCoordinates && {
            coordinates: newCoordinates as [number, number],
          }),
        });
      }
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
      location_id?: number,
    ) => {
      smartFilters?: SmartFilter[];
      price?: Price | null;
      limit?: number;
      language?: string;
    };
    onError?: (error: unknown) => void;
  }): Promise<APIResponse | null> {
    this.ensureAlive();

    if (!this.ensureApiEnabled("runSmartFilterSearch", onError)) {
      return null;
    }

    // Build filter payload from smart filters if provided.
    // Strip primary_type from the base state — it should only enter the request
    // body if explicitly included as a SmartFilter, not leaked from instance state.
    const { primary_type: _basePrimaryType, ...baseFilterPayload } =
      this.getFilters();
    let filterPayload = baseFilterPayload as ReturnType<typeof this.getFilters>;
    const state = this.getState();

    if (filters && filters.length > 0) {
      const amenities = new Set<string>();
      const hotelStyle = new Set<string>();
      const features = new Set<string>();
      const goodFor = new Set<string>();
      const meals = new Set<string>();
      const specialDiets = new Set<string>();
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
          case "features":
            features.add(filter.value);
            break;
          case "goodFor":
            goodFor.add(filter.value);
            break;
          case "meals":
            meals.add(filter.value);
            break;
          case "specialDiets":
            specialDiets.add(filter.value);
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
        ...(features.size > 0 && { features: Array.from(features) }),
        ...(goodFor.size > 0 && { goodFor: Array.from(goodFor) }),
        ...(meals.size > 0 && { meals: Array.from(meals) }),
        ...(specialDiets.size > 0 && {
          specialDiets: Array.from(specialDiets),
        }),
        ...(price && { price }),
        ...(minRating !== undefined && { minRating }),
        ...(starRating !== undefined && { starRating }),
        ...(primary_type && { primary_type }),
        ...(transformed_query && { transformed_query }),
        ...(selected_restaurant_price_levels && {
          selected_restaurant_price_levels,
        }),
      };
    } else {
      // No explicit filters provided — keep default minRating = 4 if not already set
      if (!filterPayload.minRating) {
        filterPayload.minRating = 4;
      }
    }

    const body: InitialRequestBody = {
      filters: filterPayload,
      ...(query && { query }),
      ...(state.bounds
        ? { bounds: state.bounds }
        : state.activeLocation.location_id
          ? { location_id: state.activeLocation.location_id }
          : state.activeLocation.coordinates &&
              (state.activeLocation.coordinates[0] !== 0 ||
                state.activeLocation.coordinates[1] !== 0)
            ? {
                latitude: state.activeLocation.coordinates[0],
                longitude: state.activeLocation.coordinates[1],
              }
            : {}),
      ...this.getRequestLevelOptions(),
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

  setUseApi(useApi: boolean, autoLoad: boolean = true) {
    this.ensureAlive();

    // Update useApi value
    this.useApi = useApi;

    // Validate platform restrictions when switching to useApi = false
    if (!useApi) {
      this.assertPlatformSupportForNoApi(this.currentPlatform, "warn");
    }

    // Clear properties when disabling API
    if (!useApi) {
      this.clearProperties();
    }

    // Auto-load properties if enabled and useApi is turned on
    if (useApi && autoLoad) {
      if (this.options.initialLocationData) {
        this.initializeFromLocationData(this.options.initialLocationData);
      } else if (this.requestBody && this.isMapAttached) {
        this.autoLoadProperties();
      }
    }
  }

  setApiKey(apiKey: string | undefined) {
    this.ensureAlive();
    const oldKey = this.apiKey;
    this.apiKey = apiKey;

    // If API key changed and map is attached, refresh
    if (oldKey !== this.apiKey && this.isMapAttached) {
      this.refresh();

      if (this.useApi) {
        if (this.options.initialLocationData) {
          this.initializeFromLocationData(this.options.initialLocationData);
        } else if (this.requestBody) {
          this.autoLoadProperties();
        }
      }
    }
  }

  getApiKey(): string | undefined {
    return this.apiKey;
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
      labelExtentPx: this.options.markerOptions?.showLabel ? 160 : undefined,
    });

    const markerManager = this.adapter.getMarkerManager();
    markerManager.render(this.clusterItems, primaryType, this.selectedMarkerId);

    // Render user location marker if available
    markerManager.renderUserLocation(this.state.userLocation);

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

    this.stopLocationPermissionListener?.();
    this.stopLocationPermissionListener = null;
    this.stopLocationTracking();

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
  options: MapFirstOptions,
): options is MapLibreOptions {
  return (options as MapLibreOptions).platform === "maplibre";
}

function isGoogleMapsOptions(
  options: MapFirstOptions,
): options is GoogleMapsOptions {
  return (options as GoogleMapsOptions).platform === "google";
}

function isMapboxOptions(options: MapFirstOptions): options is MapboxOptions {
  return (options as MapboxOptions).platform === "mapbox";
}
