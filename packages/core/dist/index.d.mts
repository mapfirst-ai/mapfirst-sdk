type PriceLevel = "Mid Range" | "Fine Dining" | "Cheap Eats";
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

type Price = {
    min: number;
    max: number;
};
type PollOptions = {
    pollingLink: string;
    maxAttempts?: number;
    delayMs?: number;
    isCancelled?: () => boolean;
    price?: Price;
    limit?: number;
};
type HotelPricingAPIResponse = {
    success?: {
        isComplete: boolean;
        pollingLink?: string;
        results?: Property[];
    };
};
type APIResponse = {
    location_id?: number;
    filters: any;
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
    filters?: any;
    city?: string;
    country?: string;
    location_id?: number;
    longitude?: number;
    latitude?: number;
    radius?: number;
};

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
declare function fetchProperties<TBody = any, TResponse = any>(url: string, body: TBody, { signal }?: FetchPropertiesOptions): Promise<TResponse>;
type BaseMapFirstOptions = {
    properties?: Property[];
    primaryType?: PropertyType;
    selectedMarkerId?: number | null;
    clusterRadiusMeters?: number;
    autoSelectOnClick?: boolean;
    onClusterUpdate?: (clusters: ClusterDisplayItem[], viewState: ViewStateSnapshot | null) => void;
    state?: Partial<MapState>;
    callbacks?: MapStateCallbacks;
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
    mapInstance: any;
    google: GoogleMapsNamespace;
    onMarkerClick?: (marker: Property) => void;
};
type MapboxOptions = BaseMapFirstOptions & {
    platform: "mapbox";
    mapInstance: any;
    mapboxgl: MapboxNamespace;
    onMarkerClick?: (marker: Property) => void;
};
type MapFirstOptions = AdapterDrivenOptions | MapLibreOptions | GoogleMapsOptions | MapboxOptions;
declare class MapFirstCore {
    private readonly options;
    private readonly adapter;
    private properties;
    private primaryType?;
    private selectedMarkerId;
    private destroyed;
    private clusterItems;
    private state;
    private callbacks;
    private readonly environment;
    private readonly apiUrl;
    private readonly mfid?;
    private readonly requestBody?;
    constructor(options: MapFirstOptions);
    private autoLoadProperties;
    private createAdapter;
    private initializeAdapter;
    _setProperties(markers: Property[]): void;
    addMarker(marker: Property): void;
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
    getFilters(): any;
    loadProperties({ fetchFn, onSuccess, onError, }: {
        fetchFn: () => Promise<Property[]>;
        onSuccess?: (properties: Property[]) => void;
        onError?: (error: unknown) => void;
    }): Promise<void>;
    pollForPricing({ pollingLink, maxAttempts, delayMs, isCancelled, price, limit, }: PollOptions): Promise<{
        completed: boolean;
        pollData?: HotelPricingAPIResponse;
    }>;
    private setProperties;
    private mostCommonTypeFromProperties;
    runPropertiesSearch({ body, beforeApplyProperties, onError, }: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: APIResponse) => {
            price?: Price | null;
            limit?: number;
        };
        onError?: (error: unknown) => void;
    }): Promise<APIResponse | null>;
    getClusters(): ClusterDisplayItem[];
    refresh(): void;
    destroy(): void;
    private resolvePrimaryType;
    private safeExtractViewState;
    private ensureAlive;
}

export { type APIResponse, type ActiveLocation, type Environment, type FilterState, type GoogleMapsNamespace, type HotelPricingAPIResponse, type InitialRequestBody, type MapBounds, MapFirstCore, type MapFirstOptions, type MapLibreNamespace, type MapState, type MapStateCallbacks, type MapStateUpdate, type MapboxNamespace, type PollOptions, type Price, PropertiesFetchError, type Property, type PropertyType, type ViewState, fetchProperties };
