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
} from "@mapfirst.ai/core";

// Export filter utilities from core
export {
  processApiFilters,
  convertToApiFilters,
  type ApiFiltersResponse,
} from "@mapfirst.ai/core";

// Export all components
export * from "./components";

// Export all hooks
export * from "./hooks";

// Import additional types for search functionality
type InitialRequestBody = {
  initial?: boolean;
  query?: string;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
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
  type:
    | "amenity"
    | "hotelStyle"
    | "priceRange"
    | "minRating"
    | "starRating"
    | "primary_type"
    | "transformed_query"
    | "selected_restaurant_price_levels";
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
 * Comprehensive hook for MapFirst SDK with all functionality in one place.
 * Creates a MapFirstCore instance with reactive state and provides all necessary methods.
 *
 * @example
 * ```tsx
 * // Initialize with location data
 * const {
 *   instance,
 *   state,
 *   setPrimaryType,
 *   setSelectedMarker,
 *   propertiesSearch,
 *   smartFilterSearch,
 *   boundsSearch,
 *   attachMapLibre,
 *   attachGoogle,
 *   attachMapbox
 * } = useMapFirst({
 *   initialLocationData: {
 *     city: "New York",
 *     country: "United States",
 *     currency: "USD"
 *   }
 * });
 *
 * // Access reactive state
 * console.log(state?.properties);
 * console.log(state?.isSearching);
 * console.log(state?.selectedPropertyId);
 *
 * // Attach map when ready
 * useEffect(() => {
 *   if (mapLibreInstance) {
 *     attachMapLibre(mapLibreInstance, maplibregl, {
 *       onMarkerClick: (marker) => console.log(marker)
 *     });
 *   }
 * }, [mapLibreInstance]);
 *
 * // Use search methods
 * await propertiesSearch.search({
 *   body: { city: "Paris", country: "France" }
 * });
 *
 * await smartFilterSearch.search({
 *   query: "hotels near beach with pool"
 * });
 *
 * await boundsSearch.perform();
 * ```
 */
export function useMapFirst(options: BaseMapFirstOptions) {
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
        onPendingBoundsChange: (pendingBounds) => {
          setState((prev) => (prev ? { ...prev, pendingBounds } : null));
          optionsRef.current.callbacks?.onPendingBoundsChange?.(pendingBounds);
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

  // Primary type control
  const setPrimaryType = React.useCallback((type: PropertyType) => {
    if (instanceRef.current) {
      instanceRef.current.setPrimaryType(type);
    }
  }, []);

  // Selected marker control
  const setSelectedMarker = React.useCallback((id: number | null) => {
    if (instanceRef.current) {
      instanceRef.current.setSelectedMarker(id);
    }
  }, []);

  // Properties search
  const [propertiesSearchLoading, setPropertiesSearchLoading] =
    React.useState(false);
  const [propertiesSearchError, setPropertiesSearchError] =
    React.useState<Error | null>(null);

  const propertiesSearch = React.useMemo(
    () => ({
      search: async (options: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: any) => {
          price?: any;
          limit?: number;
        };
        smartFiltersClearable?: boolean;
      }) => {
        if (!instanceRef.current) {
          const err = new Error("MapFirst instance not available");
          setPropertiesSearchError(err);
          throw err;
        }

        setPropertiesSearchLoading(true);
        setPropertiesSearchError(null);

        try {
          const result = await instanceRef.current.runPropertiesSearch({
            ...options,
            onError: (err) => {
              const error = err instanceof Error ? err : new Error(String(err));
              setPropertiesSearchError(error);
            },
          });
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setPropertiesSearchError(error);
          throw error;
        } finally {
          setPropertiesSearchLoading(false);
        }
      },
      isLoading: propertiesSearchLoading,
      error: propertiesSearchError,
    }),
    [propertiesSearchLoading, propertiesSearchError]
  );

  // Smart filter search
  const [smartFilterSearchLoading, setSmartFilterSearchLoading] =
    React.useState(false);
  const [smartFilterSearchError, setSmartFilterSearchError] =
    React.useState<Error | null>(null);

  const smartFilterSearch = React.useMemo(
    () => ({
      search: async (options: {
        query?: string;
        filters?: SmartFilter[];
        onProcessFilters?: (
          filters: any,
          location_id?: number
        ) => {
          smartFilters?: SmartFilter[];
          price?: any;
          limit?: number;
          language?: string;
        };
      }) => {
        if (!instanceRef.current) {
          const err = new Error("MapFirst instance not available");
          setSmartFilterSearchError(err);
          throw err;
        }

        setSmartFilterSearchLoading(true);
        setSmartFilterSearchError(null);

        try {
          const result = await instanceRef.current.runSmartFilterSearch({
            ...options,
            onError: (err) => {
              const error = err instanceof Error ? err : new Error(String(err));
              setSmartFilterSearchError(error);
            },
          });
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setSmartFilterSearchError(error);
          throw error;
        } finally {
          setSmartFilterSearchLoading(false);
        }
      },
      isLoading: smartFilterSearchLoading,
      error: smartFilterSearchError,
    }),
    [smartFilterSearchLoading, smartFilterSearchError]
  );

  // Bounds search
  const [boundsSearchLoading, setBoundsSearchLoading] = React.useState(false);
  const [boundsSearchError, setBoundsSearchError] =
    React.useState<Error | null>(null);

  const boundsSearch = React.useMemo(
    () => ({
      perform: async () => {
        if (!instanceRef.current) {
          return null;
        }

        setBoundsSearchLoading(true);
        setBoundsSearchError(null);

        try {
          const result = await instanceRef.current.performBoundsSearch();
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setBoundsSearchError(error);
          throw error;
        } finally {
          setBoundsSearchLoading(false);
        }
      },
      isSearching: boundsSearchLoading,
      error: boundsSearchError,
    }),
    [boundsSearchLoading, boundsSearchError]
  );

  // Map attachment helpers
  const mapLibreAttachedRef = React.useRef(false);
  const attachMapLibre = React.useCallback(
    (
      map: any,
      maplibregl: MapLibreNamespace,
      options?: { onMarkerClick?: (marker: Property) => void }
    ) => {
      if (instanceRef.current && map && !mapLibreAttachedRef.current) {
        instanceRef.current.attachMap(map, {
          platform: "maplibre",
          maplibregl,
          onMarkerClick: options?.onMarkerClick,
        });
        mapLibreAttachedRef.current = true;
      }
    },
    []
  );

  const googleMapsAttachedRef = React.useRef(false);
  const attachGoogle = React.useCallback(
    (
      map: any,
      google: GoogleMapsNamespace,
      options?: { onMarkerClick?: (marker: Property) => void }
    ) => {
      if (instanceRef.current && map && !googleMapsAttachedRef.current) {
        instanceRef.current.attachMap(map, {
          platform: "google",
          google,
          onMarkerClick: options?.onMarkerClick,
        });
        googleMapsAttachedRef.current = true;
      }
    },
    []
  );

  const mapboxAttachedRef = React.useRef(false);
  const attachMapbox = React.useCallback(
    (
      map: any,
      mapboxgl: MapboxNamespace,
      options?: { onMarkerClick?: (marker: Property) => void }
    ) => {
      if (instanceRef.current && map && !mapboxAttachedRef.current) {
        instanceRef.current.attachMap(map, {
          platform: "mapbox",
          mapboxgl,
          onMarkerClick: options?.onMarkerClick,
        });
        mapboxAttachedRef.current = true;
      }
    },
    []
  );

  return {
    instance: instanceRef.current,
    state,
    setPrimaryType,
    setSelectedMarker,
    propertiesSearch,
    smartFilterSearch,
    boundsSearch,
    attachMapLibre,
    attachGoogle,
    attachMapbox,
  };
}
