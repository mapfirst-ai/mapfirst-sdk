import React from "react";
import {
  MapFirstCore,
  type MapFirstOptions,
  type BaseMapFirstOptions,
  type Property,
  type MapLibreNamespace,
  type GoogleMapsNamespace,
  type MapboxNamespace,
  type MapState,
  type PropertyType,
} from "@mapfirst/core";

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
export function useMapFirstCore(options: BaseMapFirstOptions) {
  const instanceRef = React.useRef<MapFirstCore | null>(null);
  const [state, setState] = React.useState<MapState | null>(null);

  // Memoize the options to prevent recreation on every render
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  React.useEffect(() => {
    const opts = optionsRef.current;

    // Create MapFirstCore instance without map using adapter-driven options
    const coreOptions: MapFirstOptions = {
      adapter: null as any, // Will be set when attachMap is called
      ...opts,
      callbacks: {
        ...opts.callbacks,
        // Add internal callbacks to trigger React re-renders
        onPropertiesChange: (properties) => {
          setState((prev) => (prev ? { ...prev, properties } : null));
          optionsRef.current.callbacks?.onPropertiesChange?.(properties);
        },
        onSelectedPropertyChange: (id) => {
          setState((prev) =>
            prev ? { ...prev, selectedPropertyId: id } : null
          );
          optionsRef.current.callbacks?.onSelectedPropertyChange?.(id);
        },
        onPrimaryTypeChange: (type) => {
          setState((prev) => (prev ? { ...prev, primary: type } : null));
          optionsRef.current.callbacks?.onPrimaryTypeChange?.(type);
        },
        onFiltersChange: (filters) => {
          setState((prev) => (prev ? { ...prev, filters } : null));
          optionsRef.current.callbacks?.onFiltersChange?.(filters);
        },
        onBoundsChange: (bounds) => {
          setState((prev) => (prev ? { ...prev, bounds } : null));
          optionsRef.current.callbacks?.onBoundsChange?.(bounds);
        },
        onCenterChange: (center, zoom) => {
          setState((prev) => (prev ? { ...prev, center, zoom } : null));
          optionsRef.current.callbacks?.onCenterChange?.(center, zoom);
        },
        onZoomChange: (zoom) => {
          setState((prev) => (prev ? { ...prev, zoom } : null));
          optionsRef.current.callbacks?.onZoomChange?.(zoom);
        },
        onActiveLocationChange: (location) => {
          setState((prev) =>
            prev ? { ...prev, activeLocation: location } : null
          );
          optionsRef.current.callbacks?.onActiveLocationChange?.(location);
        },
        onLoadingStateChange: (loading) => {
          setState((prev) =>
            prev ? { ...prev, initialLoading: loading } : null
          );
          optionsRef.current.callbacks?.onLoadingStateChange?.(loading);
        },
        onSearchingStateChange: (searching) => {
          setState((prev) =>
            prev ? { ...prev, isSearching: searching } : null
          );
          optionsRef.current.callbacks?.onSearchingStateChange?.(searching);
        },
      },
    };

    const instance = new MapFirstCore(coreOptions);
    instanceRef.current = instance;

    // Initialize state from SDK
    setState(instance.getState());

    return () => {
      instance.destroy();
      instanceRef.current = null;
      setState(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapFirst: instanceRef.current, state };
}

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
export function useMapFirstProperties(
  mapFirst: MapFirstCore | null
): Property[] {
  const [properties, setProperties] = React.useState<Property[]>([]);

  React.useEffect(() => {
    if (!mapFirst) {
      setProperties([]);
      return;
    }

    // Initialize with current state
    setProperties(mapFirst.getState().properties);
  }, [mapFirst]);

  return properties;
}

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
export function useMapFirstSelectedProperty(
  mapFirst: MapFirstCore | null
): number | null {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!mapFirst) {
      setSelectedId(null);
      return;
    }

    // Initialize with current state
    setSelectedId(mapFirst.getState().selectedPropertyId);
  }, [mapFirst]);

  return selectedId;
}

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
export function usePrimaryType(
  mapFirst: MapFirstCore | null
): [PropertyType, (type: PropertyType) => void] {
  const [primaryType, setPrimaryTypeState] =
    React.useState<PropertyType>("Accommodation");

  React.useEffect(() => {
    if (!mapFirst) {
      setPrimaryTypeState("Accommodation");
      return;
    }

    // Initialize with current state
    setPrimaryTypeState(mapFirst.getState().primary);
  }, [mapFirst]);

  const setPrimaryType = React.useCallback(
    (type: PropertyType) => {
      if (mapFirst) {
        mapFirst.setPrimaryType(type);
        setPrimaryTypeState(type);
      }
    },
    [mapFirst]
  );

  return [primaryType, setPrimaryType];
}

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
export function useSelectedMarker(
  mapFirst: MapFirstCore | null
): [number | null, (id: number | null) => void] {
  const [selectedMarker, setSelectedMarkerState] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (!mapFirst) {
      setSelectedMarkerState(null);
      return;
    }

    // Initialize with current state
    setSelectedMarkerState(mapFirst.getState().selectedPropertyId);
  }, [mapFirst]);

  const setSelectedMarker = React.useCallback(
    (id: number | null) => {
      if (mapFirst) {
        mapFirst.setSelectedMarker(id);
        setSelectedMarkerState(id);
      }
    },
    [mapFirst]
  );

  return [selectedMarker, setSelectedMarker];
}

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
export function useMapLibreAttachment({
  mapFirst,
  map,
  maplibregl,
  onMarkerClick,
}: {
  mapFirst: MapFirstCore | null;
  map: any | null;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
}) {
  const attachedRef = React.useRef(false);

  React.useEffect(() => {
    if (!mapFirst || !map || attachedRef.current) {
      return;
    }

    mapFirst.attachMap(map, {
      platform: "maplibre",
      maplibregl,
      onMarkerClick,
    });

    attachedRef.current = true;
  }, [mapFirst, map, maplibregl, onMarkerClick]);
}

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
export function useGoogleMapsAttachment({
  mapFirst,
  map,
  google,
  onMarkerClick,
}: {
  mapFirst: MapFirstCore | null;
  map: any | null;
  google: GoogleMapsNamespace;
  onMarkerClick?: (marker: Property) => void;
}) {
  const attachedRef = React.useRef(false);

  React.useEffect(() => {
    if (!mapFirst || !map || attachedRef.current) {
      return;
    }

    mapFirst.attachMap(map, {
      platform: "google",
      google,
      onMarkerClick,
    });

    attachedRef.current = true;
  }, [mapFirst, map, google, onMarkerClick]);
}

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
export function useMapboxAttachment({
  mapFirst,
  map,
  mapboxgl,
  onMarkerClick,
}: {
  mapFirst: MapFirstCore | null;
  map: any | null;
  mapboxgl: MapboxNamespace;
  onMarkerClick?: (marker: Property) => void;
}) {
  const attachedRef = React.useRef(false);

  React.useEffect(() => {
    if (!mapFirst || !map || attachedRef.current) {
      return;
    }

    mapFirst.attachMap(map, {
      platform: "mapbox",
      mapboxgl,
      onMarkerClick,
    });

    attachedRef.current = true;
  }, [mapFirst, map, mapboxgl, onMarkerClick]);
}

/**
 * Legacy hook that creates the MapFirstCore instance with a map immediately.
 * Use useMapFirstCore + useMap*Attachment hooks for better control.
 *
 * @deprecated Use useMapFirstCore and platform-specific attachment hooks instead
 */
export function useMapFirst(options: MapFirstOptions | null) {
  const instanceRef = React.useRef<MapFirstCore | null>(null);

  React.useEffect(() => {
    if (!options) {
      return undefined;
    }
    const instance = new MapFirstCore(options);
    instanceRef.current = instance;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [options]);

  return instanceRef;
}

/**
 * Helper component that simply renders the markers it receives so non-React environments
 * can verify data flows before wiring the SDK into a map.
 */
export function MarkerDebugList({ markers }: { markers: Property[] }) {
  return (
    <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
      <strong>Markers</strong>
      <ul>
        {markers.map((marker) => (
          <li key={String(marker.tripadvisor_id)}>
            {marker.name} — {marker.location?.lat?.toFixed(3) ?? "n/a"},{" "}
            {marker.location?.lon?.toFixed(3) ?? "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
}
