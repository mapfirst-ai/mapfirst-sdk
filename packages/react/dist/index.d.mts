import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { BaseMapFirstOptions, MapFirstCore, MapState, Property, PropertyType, MapLibreNamespace, GoogleMapsNamespace, MapboxNamespace, MapFirstOptions } from '@mapfirst/core';

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
 * Helper component that simply renders the markers it receives so non-React environments
 * can verify data flows before wiring the SDK into a map.
 */
declare function MarkerDebugList({ markers }: {
    markers: Property[];
}): react_jsx_runtime.JSX.Element;

export { MarkerDebugList, useGoogleMapsAttachment, useMapFirst, useMapFirstCore, useMapFirstProperties, useMapFirstSelectedProperty, useMapLibreAttachment, useMapboxAttachment, usePrimaryType, useSelectedMarker };
