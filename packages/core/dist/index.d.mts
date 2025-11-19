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
    abstract getMapBounds(): MapBounds;
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
type MapBounds = {
    sw: {
        lat: number;
        lng: number;
    };
    ne: {
        lat: number;
        lng: number;
    };
};

type BaseMapFirstOptions = {
    markers?: Property[];
    primaryType?: PropertyType;
    selectedMarkerId?: number | null;
    clusterRadiusMeters?: number;
    autoSelectOnClick?: boolean;
    onClusterUpdate?: (clusters: ClusterDisplayItem[], viewState: ViewStateSnapshot | null) => void;
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
    private markers;
    private primaryType?;
    private selectedMarkerId;
    private destroyed;
    private clusterItems;
    constructor(options: MapFirstOptions);
    setMarkers(markers: Property[]): void;
    addMarker(marker: Property): void;
    clearMarkers(): void;
    setPrimaryType(primary: PropertyType): void;
    setSelectedMarker(markerId: number | null): void;
    getClusters(): ClusterDisplayItem[];
    refresh(): void;
    destroy(): void;
    private resolvePrimaryType;
    private safeExtractViewState;
    private ensureAlive;
}

export { type GoogleMapsNamespace, MapFirstCore, type MapFirstOptions, type MapLibreNamespace, type MapboxNamespace, type Property, type PropertyType };
