declare const locales: readonly ["en", "es", "de", "fr", "it", "pt"];
type Locale = (typeof locales)[number];
type Price = {
    min: number;
    max: number;
};
type PriceLevel = "Mid Range" | "Fine Dining" | "Cheap Eats";
type FilterSchema = {
    amenities?: string[];
    hotelStyle?: string[];
    price?: Price | null;
    minRating?: number;
    starRating?: number;
    numAdults: number;
    numRooms: number;
    checkIn: string;
    checkOut: string;
    location?: {
        locationId: number | null;
        city: string | null;
        state: string | null;
        country: string | null;
        longitude: number | null;
        latitude: number | null;
    } | null;
    currency: string;
    limit?: number;
    language?: Locale;
    primary_type?: PropertyType;
    transformed_query?: string;
    selected_restaurant_price_levels?: PriceLevel[];
};
type Offer = {
    availability: "available" | "unavailable" | "pending";
    providerId: number;
    displayName: string;
    displayPrice?: string;
    price?: number;
    logo: string;
    clickUrl: string;
    freeCancellationDate?: string;
    timeOfPayment?: string;
};
type HotelPricingAPIResults = {
    availability: "pending" | "available" | "unavailable";
    strikeThroughDisplayPrice?: string;
    offer?: Offer;
};
type HotelPricingAPIResponse = {
    success?: {
        isComplete: boolean;
        pollingLink?: string;
        results?: Property[];
    };
};
type PropertyAwardImage = {
    key: string;
    url: string;
};
type PropertyAward = {
    name: string;
    image: PropertyAwardImage;
    type: "0" | "1";
};
type PropertyType = "Accommodation" | "Eat & Drink" | "Attraction";
type PropertyUrls = {
    tripadvisor: {
        main: string;
    };
};
type Property = {
    tripadvisor_id: number;
    name: string;
    rating: number;
    reviews: number;
    location?: {
        lat: number;
        lon: number;
    };
    type: PropertyType;
    awards?: PropertyAward[];
    pricing?: HotelPricingAPIResults;
    urls?: PropertyUrls;
    secondaries: string[];
    price_level?: PriceLevel;
    city?: string;
    country?: string;
};
type APIResponse = {
    location_id?: number;
    filters: FilterSchema;
    properties: Property[];
    isComplete: boolean | undefined;
    pollingLink: string | undefined;
    durationSeconds: number;
};
type InitialRequestBody = {
    initial?: boolean;
    query?: string;
    bounds?: {
        sw: {
            lat: number;
            lng: number;
        };
        ne: {
            lat: number;
            lng: number;
        };
    };
    filters?: FilterSchema;
    city?: string;
    country?: string;
    location_id?: number;
    longitude?: number;
    latitude?: number;
    radius?: number;
};
type SmartFilter = {
    id: string;
    label: string;
    type: "amenity" | "hotelStyle" | "priceRange" | "minRating" | "starRating" | "primary_type" | "transformed_query" | "selected_restaurant_price_levels";
    value: string;
    numericValue?: number;
    priceRange?: {
        min: number;
        max?: number;
    };
    propertyType?: PropertyType;
    priceLevels?: PriceLevel[];
};
type PollOptions = {
    pollingLink: string;
    maxAttempts?: number;
    delayMs?: number;
    isCancelled?: () => boolean;
    price?: Price;
    limit?: number;
};
type InitialLocationData = {
    city?: string;
    country?: string;
    query?: string;
    currency?: string;
};

type ClusterDisplayItem = {
    kind: "primary";
    marker: Property;
    key: string;
} | {
    kind: "dot";
    marker: Property;
    key: string;
    parentId: number;
};
type ViewStateSnapshot = {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
};

type MapLibreMarkerHandle = {
    setLngLat(lngLat: [number, number]): MapLibreMarkerHandle;
    addTo(map: any): MapLibreMarkerHandle;
    remove(): void;
    getElement(): HTMLElement;
};
type MapLibreNamespace = {
    Marker: new (options?: {
        element?: HTMLElement;
        anchor?: string;
    }) => MapLibreMarkerHandle;
};

type GoogleMapsNamespace = any;

type MapboxMarkerHandle = {
    setLngLat(lngLat: [number, number]): MapboxMarkerHandle;
    addTo(map: any): MapboxMarkerHandle;
    remove(): void;
    getElement(): HTMLElement;
};
type MapboxNamespace = {
    Marker: new (options?: {
        element?: HTMLElement;
        anchor?: string;
    }) => MapboxMarkerHandle;
};

/**
 * Abstract base class for map adapters supporting different map libraries
 */
declare abstract class MapAdapter {
    protected map: any;
    constructor(map: any);
    /**
     * Get the underlying map instance
     * @returns {any} The native map instance
     */
    getMap(): any;
    /**
     * Initialize the adapter with platform-specific configuration
     * @param {any} options Platform-specific initialization options
     * @returns {any} The marker manager instance
     */
    abstract initialize(options: any): any;
    /**
     * Get the marker manager instance
     * @returns {any} The marker manager
     */
    abstract getMarkerManager(): any;
    /**
     * Clean up event listeners and resources
     */
    abstract cleanup(): void;
    /**
     * Get the map container element
     * @returns {HTMLElement | null} The map container DOM element
     */
    abstract getContainer(): HTMLElement | null;
    /**
     * Set up impression tracking when map becomes visible
     * @param {() => void} onImpression Callback to invoke when map is visible
     */
    setupImpressionTracking(onImpression: () => void): void;
    /**
     * Get the current center coordinates of the map
     * @returns {{ lng: number; lat: number }} [longitude, latitude]
     */
    abstract getCenter(): {
        lng: number;
        lat: number;
    };
    /**
     * Get the current zoom level of the map
     * @returns {number} Current zoom level
     */
    abstract getZoom(): number;
    /**
     * Get the current bearing (rotation) of the map
     * @returns {number} Bearing in degrees
     */
    abstract getBearing(): number;
    /**
     * Get the current pitch (tilt) of the map
     * @returns {number} Pitch in degrees
     */
    abstract getPitch(): number;
    /**
     * Get the current bounds of the map viewport
     * @returns {MapBounds} Map bounds with southwest and northeast corners
     */
    abstract getMapBounds(): MapBounds$1;
    /**
     * Project a geographical coordinate to screen space
     * @param {[number, number]} lngLat [longitude, latitude]
     * @returns {{ x: number; y: number }} Screen coordinates
     */
    abstract project(lngLat: [number, number]): {
        x: number;
        y: number;
    };
}
type MapBounds$1 = {
    sw: {
        lat: number;
        lng: number;
    };
    ne: {
        lat: number;
        lng: number;
    };
};

interface MapBounds {
    sw: {
        lat: number;
        lng: number;
    };
    ne: {
        lat: number;
        lng: number;
    };
}
interface ViewState {
    center: [number, number];
    zoom: number;
    bounds: MapBounds | null;
}
interface ActiveLocation {
    city?: string;
    state?: string;
    country: string;
    location_id: number | null;
    locationName: string;
    coordinates: [number, number];
}
interface FilterState {
    checkIn?: Date | string;
    checkOut?: Date | string;
    numAdults?: number;
    numRooms?: number;
    currency?: string;
}
interface MapState {
    center: [number, number];
    zoom: number;
    bounds: MapBounds | null;
    pendingBounds: MapBounds | null;
    tempBounds: MapBounds | null;
    properties: Property[];
    primary: PropertyType;
    selectedPropertyId: number | null;
    initialLoading: boolean;
    isSearching: boolean;
    firstCallDone: boolean;
    filters: FilterState;
    activeLocation: ActiveLocation;
    isFlyToAnimating: boolean;
}
interface MapStateCallbacks {
    onCenterChange?: (center: [number, number], zoom: number) => void;
    onBoundsChange?: (bounds: MapBounds | null) => void;
    onPendingBoundsChange?: (bounds: MapBounds | null) => void;
    onZoomChange?: (zoom: number) => void;
    onPropertiesChange?: (properties: Property[]) => void;
    onSelectedPropertyChange?: (propertyId: number | null) => void;
    onPrimaryTypeChange?: (type: PropertyType) => void;
    onFiltersChange?: (filters: FilterState) => void;
    onActiveLocationChange?: (location: ActiveLocation) => void;
    onLoadingStateChange?: (loading: boolean) => void;
    onSearchingStateChange?: (searching: boolean) => void;
    onPropertiesLoadError?: (error: unknown) => void;
    onError?: (error: Error | string, context?: string) => void;
}
type MapStateUpdate = Partial<MapState>;

/**
 * Response type from the API containing filter information
 */
type ApiFiltersResponse = Pick<FilterSchema, "amenities" | "hotelStyle" | "price" | "minRating" | "starRating" | "transformed_query" | "selected_restaurant_price_levels">;
/**
 * Converts API filter response into SmartFilter objects that can be used with the SmartFilter component.
 * This utility processes the various filter types returned from the API and transforms them into
 * a standardized SmartFilter format.
 *
 * @param apiFilters - The filter response from the API
 * @returns An array of SmartFilter objects
 *
 * @example
 * ```typescript
 * const apiResponse = await search({ query: "hotels with pool" });
 * const filters = processApiFilters(apiResponse.filters);
 * // filters will contain SmartFilter objects for amenities, price range, ratings, etc.
 * ```
 */
declare function processApiFilters(apiFilters: ApiFiltersResponse): SmartFilter[];
/**
 * Converts filter objects (SmartFilter or React Filter) back to API-compatible filter format.
 * This is the inverse operation of processApiFilters.
 * Accepts filters with label as string or ReactNode and normalizes them.
 *
 * @param filters - Array of filter objects (SmartFilter or React Filter with ReactNode labels)
 * @returns API-compatible SmartFilter array
 *
 * @example
 * ```typescript
 * const filters = [
 *   { id: "amenity-pool", label: "Pool", type: "amenity", value: "Pool" }
 * ];
 * const apiFilters = convertToApiFilters(filters);
 * // apiFilters will contain normalized SmartFilter objects
 * ```
 */
declare function convertToApiFilters(filters: any[]): SmartFilter[];

type Environment = "prod" | "test";
declare class PropertiesFetchError extends Error {
    status: number;
    code?: string;
    constructor({ message, status, code, }: {
        message: string;
        status: number;
        code?: string;
    });
}
type FetchPropertiesOptions = {
    signal?: AbortSignal;
};
declare function fetchProperties<TBody = any, TResponse = any>(url: string, body: TBody, apiKey?: string, { signal }?: FetchPropertiesOptions): Promise<TResponse>;
type BaseMapFirstOptions = {
    properties?: Property[];
    primaryType?: PropertyType;
    selectedMarkerId?: number | null;
    clusterRadiusMeters?: number;
    autoSelectOnClick?: boolean;
    onClusterUpdate?: (clusters: ClusterDisplayItem[], viewState: ViewStateSnapshot | null) => void;
    state?: Partial<MapState>;
    callbacks?: MapStateCallbacks;
    useApi?: boolean;
    environment?: Environment;
    apiKey?: string;
    requestBody?: any;
    initialLocationData?: InitialLocationData;
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
    mapInstance?: any;
    google: GoogleMapsNamespace;
    onMarkerClick?: (marker: Property) => void;
};
type MapboxOptions = BaseMapFirstOptions & {
    platform: "mapbox";
    mapInstance?: any;
    mapboxgl: MapboxNamespace;
    onMarkerClick?: (marker: Property) => void;
};
type MapFirstOptions = AdapterDrivenOptions | MapLibreOptions | GoogleMapsOptions | MapboxOptions;
declare class MapFirstCore {
    private readonly options;
    private adapter;
    private properties;
    private primaryType?;
    private selectedMarkerId;
    private destroyed;
    private clusterItems;
    private isMapAttached;
    private state;
    private callbacks;
    private useApi;
    private readonly environment;
    private readonly apiUrl;
    private apiKey?;
    private currentPlatform;
    private requestBody?;
    private readonly fitBoundsPadding;
    constructor(options: MapFirstOptions);
    private hasMapInstance;
    private initializeFromLocationData;
    private autoLoadProperties;
    attachMap(mapInstance: any, config: {
        platform: "maplibre" | "google" | "mapbox";
        maplibregl?: MapLibreNamespace;
        google?: GoogleMapsNamespace;
        mapboxgl?: MapboxNamespace;
        onMarkerClick?: (marker: Property) => void;
    }): void;
    private createAdapter;
    private initializeAdapter;
    _setProperties(properties: Property[]): void;
    addProperty(property: Property): void;
    clearProperties(): void;
    setPrimaryType(primary: PropertyType): void;
    setSelectedMarker(markerId: number | null): void;
    getState(): Readonly<MapState>;
    private handleError;
    updateState(update: MapStateUpdate): void;
    setState(newState: Partial<MapState>): void;
    setFilters(filters: FilterState): void;
    setActiveLocation(location: ActiveLocation): void;
    setBounds(bounds: MapBounds | null): void;
    setPendingBounds(bounds: MapBounds | null): void;
    setTempBounds(bounds: MapBounds | null): void;
    setLoading(loading: boolean): void;
    setSearching(searching: boolean): void;
    setFlyToAnimating(animating: boolean): void;
    handleMapMoveEnd(bounds: MapBounds): void;
    flyMapTo(longitude: number, latitude: number, zoom?: number | null, animation?: boolean): void;
    flyToPOIs(pois?: {
        lat: number;
        lng: number;
    }[], type?: PropertyType, animate?: boolean): void;
    getFilters(): FilterSchema;
    pollForPricing({ pollingLink, maxAttempts, delayMs, isCancelled, price, limit, }: PollOptions): Promise<{
        completed: boolean;
        pollData?: HotelPricingAPIResponse;
    }>;
    private setProperties;
    private mostCommonTypeFromProperties;
    runPropertiesSearch({ body, beforeApplyProperties, smartFiltersClearable, onError, }: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: APIResponse) => {
            price?: Price | null;
            limit?: number;
        };
        smartFiltersClearable?: boolean;
        onError?: (error: unknown) => void;
    }): Promise<APIResponse | null>;
    performBoundsSearch(): Promise<APIResponse | null>;
    private updateActiveLocationFromResponse;
    runSmartFilterSearch({ query, filters, onProcessFilters, onError, }: {
        query?: string;
        filters?: SmartFilter[];
        onProcessFilters?: (filters: any, location_id?: number) => {
            smartFilters?: SmartFilter[];
            price?: Price | null;
            limit?: number;
            language?: string;
        };
        onError?: (error: unknown) => void;
    }): Promise<APIResponse | null>;
    getClusters(): ClusterDisplayItem[];
    setUseApi(useApi: boolean, autoLoad?: boolean): void;
    setApiKey(apiKey: string | undefined): void;
    getApiKey(): string | undefined;
    refresh(): void;
    destroy(): void;
    private resolvePrimaryType;
    private safeExtractViewState;
    private ensureAlive;
}

export { type ActiveLocation, type ApiFiltersResponse, type BaseMapFirstOptions, type Environment, type FilterSchema, type FilterState, type GoogleMapsNamespace, type Locale, type MapBounds, MapFirstCore, type MapFirstOptions, type MapLibreNamespace, type MapState, type MapStateCallbacks, type MapStateUpdate, type MapboxNamespace, type Price, type PriceLevel, PropertiesFetchError, type Property, type PropertyType, type SmartFilter, type ViewState, convertToApiFilters, fetchProperties, processApiFilters };
