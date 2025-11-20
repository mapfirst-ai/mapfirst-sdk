import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { BaseMapFirstOptions, MapFirstCore, MapState, Property, PropertyType, MapLibreNamespace, GoogleMapsNamespace, MapboxNamespace, MapFirstOptions } from '@mapfirst.ai/core';

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
    priceLevels?: any[];
};
/**
 * Hook that creates a MapFirstCore instance that can be initialized before maps are ready.
 * Supports two-phase initialization: create SDK first, attach map later.
 * Returns the instance and reactive state that updates when SDK state changes.
 *
 * @example
 * ```tsx
 * // Phase 1: Create SDK instance with location data
 * const { mapFirst, state } = useMapFirstCore({
 *   initialLocationData: {
 *     city: "New York",
 *     country: "United States",
 *     currency: "USD"
 *   }
 * });
 *
 * // Access reactive state
 * console.log(state.properties); // Updates when properties change
 * console.log(state.isSearching); // Updates when search state changes
 *
 * // Phase 2: Attach map when ready
 * useEffect(() => {
 *   if (mapLibreInstance && mapFirst) {
 *     mapFirst.attachMap(mapLibreInstance, {
 *       platform: "maplibre",
 *       maplibregl: maplibregl,
 *       onMarkerClick: (marker) => console.log(marker)
 *     });
 *   }
 * }, [mapLibreInstance, mapFirst]);
 * ```
 */
declare function useMapFirstCore(options: BaseMapFirstOptions): {
    mapFirst: MapFirstCore | null;
    state: MapState | null;
};
/**
 * Hook to access reactive properties from MapFirst SDK.
 * Returns the current properties array that updates when properties change.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const properties = useMapFirstProperties(mapFirst);
 *
 * return <div>Found {properties.length} properties</div>;
 * ```
 */
declare function useMapFirstProperties(mapFirst: MapFirstCore | null): Property[];
/**
 * Hook to access the selected property ID from MapFirst SDK.
 * Returns the currently selected property ID that updates when selection changes.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const selectedId = useMapFirstSelectedProperty(mapFirst);
 *
 * return <div>Selected: {selectedId || 'None'}</div>;
 * ```
 */
declare function useMapFirstSelectedProperty(mapFirst: MapFirstCore | null): number | null;
/**
 * Hook to access and control the primary property type.
 * Returns the current primary type and a setter function.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const [primaryType, setPrimaryType] = usePrimaryType(mapFirst);
 *
 * return (
 *   <select value={primaryType} onChange={(e) => setPrimaryType(e.target.value as PropertyType)}>
 *     <option value="Accommodation">Hotels</option>
 *     <option value="Restaurant">Restaurants</option>
 *     <option value="Attraction">Attractions</option>
 *   </select>
 * );
 * ```
 */
declare function usePrimaryType(mapFirst: MapFirstCore | null): [PropertyType, (type: PropertyType) => void];
/**
 * Hook to access and control the selected marker.
 * Returns the current selected marker ID and a setter function.
 * Note: This hook requires the MapFirstCore instance. For simpler usage with reactive updates,
 * use state.selectedPropertyId from useMapFirstCore instead.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const [selectedMarker, setSelectedMarker] = useSelectedMarker(mapFirst);
 *
 * return (
 *   <div>
 *     <p>Selected: {selectedMarker || 'None'}</p>
 *     <button onClick={() => setSelectedMarker(null)}>Clear Selection</button>
 *   </div>
 * );
 * ```
 */
declare function useSelectedMarker(mapFirst: MapFirstCore | null): [number | null, (id: number | null) => void];
/**
 * Hook for MapLibre GL JS integration.
 * Automatically attaches the map when both the SDK instance and map are available.
 *
 * @example
 * ```tsx
 * const { mapFirst, state } = useMapFirstCore({ initialLocationData: { city: "Paris", country: "France" } });
 * const mapRef = useRef<maplibregl.Map | null>(null);
 *
 * useMapLibreAttachment({
 *   mapFirst,
 *   map: mapRef.current,
 *   maplibregl: maplibregl,
 *   onMarkerClick: (marker) => console.log(marker)
 * });
 *
 * // Access reactive state
 * console.log(state?.properties);
 * ```
 */
declare function useMapLibreAttachment({ mapFirst, map, maplibregl, onMarkerClick, }: {
    mapFirst: MapFirstCore | null;
    map: any | null;
    maplibregl: MapLibreNamespace;
    onMarkerClick?: (marker: Property) => void;
}): void;
/**
 * Hook for Google Maps integration.
 * Automatically attaches the map when both the SDK instance and map are available.
 *
 * @example
 * ```tsx
 * const { mapFirst, state } = useMapFirstCore({ initialLocationData: { city: "Tokyo", country: "Japan" } });
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * useGoogleMapsAttachment({
 *   mapFirst,
 *   map: mapRef.current,
 *   google: window.google,
 *   onMarkerClick: (marker) => console.log(marker)
 * });
 *
 * // Access reactive state
 * console.log(state?.isSearching);
 * ```
 */
declare function useGoogleMapsAttachment({ mapFirst, map, google, onMarkerClick, }: {
    mapFirst: MapFirstCore | null;
    map: any | null;
    google: GoogleMapsNamespace;
    onMarkerClick?: (marker: Property) => void;
}): void;
/**
 * Hook for Mapbox GL JS integration.
 * Automatically attaches the map when both the SDK instance and map are available.
 *
 * @example
 * ```tsx
 * const { mapFirst, state } = useMapFirstCore({ initialLocationData: { city: "London", country: "United Kingdom" } });
 * const mapRef = useRef<mapboxgl.Map | null>(null);
 *
 * useMapboxAttachment({
 *   mapFirst,
 *   map: mapRef.current,
 *   mapboxgl: mapboxgl,
 *   onMarkerClick: (marker) => console.log(marker)
 * });
 *
 * // Access reactive state
 * console.log(state?.filters);
 * ```
 */
declare function useMapboxAttachment({ mapFirst, map, mapboxgl, onMarkerClick, }: {
    mapFirst: MapFirstCore | null;
    map: any | null;
    mapboxgl: MapboxNamespace;
    onMarkerClick?: (marker: Property) => void;
}): void;
/**
 * Legacy hook that creates the MapFirstCore instance with a map immediately.
 * Use useMapFirstCore + useMap*Attachment hooks for better control.
 *
 * @deprecated Use useMapFirstCore and platform-specific attachment hooks instead
 */
declare function useMapFirst(options: MapFirstOptions | null): React.RefObject<MapFirstCore | null>;
/**
 * Hook to run properties search with the MapFirst SDK.
 * Returns a function to trigger the search and loading state.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const { search, isLoading, error } = usePropertiesSearch(mapFirst);
 *
 * const handleSearch = async () => {
 *   await search({
 *     body: {
 *       city: "Paris",
 *       country: "France",
 *       filters: {
 *         checkIn: new Date(),
 *         checkOut: new Date(Date.now() + 86400000),
 *         numAdults: 2,
 *         numRooms: 1
 *       }
 *     }
 *   });
 * };
 * ```
 */
declare function usePropertiesSearch(mapFirst: MapFirstCore | null): {
    search: (options: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: any) => {
            price?: any;
            limit?: number;
        };
        smartFiltersClearable?: boolean;
    }) => Promise<{
        location_id?: number;
        filters: {
            amenities?: string[];
            hotelStyle?: string[];
            price?: {
                min: number;
                max: number;
            } | null;
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
            language?: "en" | "es" | "de" | "fr" | "it" | "pt";
            primary_type?: PropertyType;
            transformed_query?: string;
            selected_restaurant_price_levels?: ("Mid Range" | "Fine Dining" | "Cheap Eats")[];
        };
        properties: Property[];
        isComplete: boolean | undefined;
        pollingLink: string | undefined;
        durationSeconds: number;
    } | null>;
    isLoading: boolean;
    error: Error | null;
};
/**
 * Hook to run smart filter search with the MapFirst SDK.
 * Returns a function to trigger the search and loading state.
 *
 * @example
 * ```tsx
 * const { mapFirst } = useMapFirstCore({ ... });
 * const { search, isLoading, error } = useSmartFilterSearch(mapFirst);
 *
 * const handleSearch = async () => {
 *   await search({
 *     query: "hotels near beach with pool"
 *   });
 * };
 *
 * // Or with filters
 * const handleFilterSearch = async () => {
 *   await search({
 *     filters: [
 *       { id: "pool", label: "Pool", type: "amenity", value: "pool" },
 *       { id: "4star", label: "4 Star", type: "starRating", value: "4", numericValue: 4 }
 *     ]
 *   });
 * };
 * ```
 */
declare function useSmartFilterSearch(mapFirst: MapFirstCore | null): {
    search: (options: {
        query?: string;
        filters?: SmartFilter[];
        onProcessFilters?: (filters: any, location_id?: number) => {
            smartFilters?: SmartFilter[];
            price?: any;
            limit?: number;
            language?: string;
        };
    }) => Promise<{
        location_id?: number;
        filters: {
            amenities?: string[];
            hotelStyle?: string[];
            price?: {
                min: number;
                max: number;
            } | null;
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
            language?: "en" | "es" | "de" | "fr" | "it" | "pt";
            primary_type?: PropertyType;
            transformed_query?: string;
            selected_restaurant_price_levels?: ("Mid Range" | "Fine Dining" | "Cheap Eats")[];
        };
        properties: Property[];
        isComplete: boolean | undefined;
        pollingLink: string | undefined;
        durationSeconds: number;
    } | null>;
    isLoading: boolean;
    error: Error | null;
};
/**
 * Helper component that simply renders the markers it receives so non-React environments
 * can verify data flows before wiring the SDK into a map.
 */
declare function MarkerDebugList({ markers }: {
    markers: Property[];
}): react_jsx_runtime.JSX.Element;

export { MarkerDebugList, useGoogleMapsAttachment, useMapFirst, useMapFirstCore, useMapFirstProperties, useMapFirstSelectedProperty, useMapLibreAttachment, useMapboxAttachment, usePrimaryType, usePropertiesSearch, useSelectedMarker, useSmartFilterSearch };
