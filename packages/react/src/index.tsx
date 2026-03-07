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

// Re-export all of @mapfirst.ai/core so users only need @mapfirst.ai/react.
// SmartFilter and Locale are excluded here because the react package provides
// its own versions (SmartFilter component, Locale from useTranslation).
export type {
  Property,
  PropertyType,
  PriceLevel,
  Price,
  FilterSchema,
  ApiFiltersResponse,
  MapBounds,
  ViewState,
  ActiveLocation,
  FilterState,
  MapState,
  MapStateCallbacks,
  MapStateUpdate,
  MapLibreNamespace,
  GoogleMapsNamespace,
  MapboxNamespace,
  Environment,
  TripAdvisorImage,
  TripAdvisorImageResponse,
  BaseMapFirstOptions,
  MapFirstOptions,
} from "@mapfirst.ai/core";
export {
  processApiFilters,
  convertToApiFilters,
  PropertiesFetchError,
  fetchImages,
  fetchProperties,
  MapFirstCore,
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

type StateSetter = React.Dispatch<React.SetStateAction<MapState | null>>;

function updateStateField<K extends keyof MapState>(
  setState: StateSetter,
  key: K,
  value: MapState[K],
) {
  setState((prev) => (prev ? { ...prev, [key]: value } : null));
}

function forwardCallback(
  optionsRef: React.MutableRefObject<BaseMapFirstOptions>,
  key: keyof NonNullable<BaseMapFirstOptions["callbacks"]>,
  ...args: any[]
) {
  const callback = optionsRef.current.callbacks?.[key] as
    | ((...callbackArgs: any[]) => void)
    | undefined;
  callback?.(...args);
}

type AttachMapConfig = Parameters<MapFirstCore["attachMap"]>[1];

function attachMapOnce(
  instanceRef: React.MutableRefObject<MapFirstCore | null>,
  attachedRef: React.MutableRefObject<boolean>,
  map: any,
  config: AttachMapConfig,
) {
  if (!instanceRef.current || !map || attachedRef.current) {
    return;
  }
  instanceRef.current.attachMap(map, config);
  attachedRef.current = true;
}

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
          updateStateField(setState, "properties", properties);
          forwardCallback(optionsRef, "onPropertiesChange", properties);
        },
        onSelectedPropertyChange: (id) => {
          updateStateField(setState, "selectedPropertyId", id);
          forwardCallback(optionsRef, "onSelectedPropertyChange", id);
        },
        onPrimaryTypeChange: (type) => {
          updateStateField(setState, "primary", type);
          forwardCallback(optionsRef, "onPrimaryTypeChange", type);
        },
        onFiltersChange: (filters) => {
          updateStateField(setState, "filters", filters);
          forwardCallback(optionsRef, "onFiltersChange", filters);
        },
        onBoundsChange: (bounds) => {
          updateStateField(setState, "bounds", bounds);
          forwardCallback(optionsRef, "onBoundsChange", bounds);
        },
        onPendingBoundsChange: (pendingBounds) => {
          updateStateField(setState, "pendingBounds", pendingBounds);
          forwardCallback(optionsRef, "onPendingBoundsChange", pendingBounds);
        },
        onCenterChange: (center, zoom) => {
          setState((prev) => (prev ? { ...prev, center, zoom } : null));
          forwardCallback(optionsRef, "onCenterChange", center, zoom);
        },
        onZoomChange: (zoom) => {
          updateStateField(setState, "zoom", zoom);
          forwardCallback(optionsRef, "onZoomChange", zoom);
        },
        onActiveLocationChange: (location) => {
          updateStateField(setState, "activeLocation", location);
          forwardCallback(optionsRef, "onActiveLocationChange", location);
        },
        onLoadingStateChange: (loading) => {
          updateStateField(setState, "initialLoading", loading);
          forwardCallback(optionsRef, "onLoadingStateChange", loading);
        },
        onSearchingStateChange: (searching) => {
          updateStateField(setState, "isSearching", searching);
          forwardCallback(optionsRef, "onSearchingStateChange", searching);
        },
        onFirstCallDoneChange: (firstCallDone) => {
          updateStateField(setState, "firstCallDone", firstCallDone);
          forwardCallback(optionsRef, "onFirstCallDoneChange", firstCallDone);
        },
        onIsFlyToAnimatingChange: (animating) => {
          updateStateField(setState, "isFlyToAnimating", animating);
          forwardCallback(optionsRef, "onIsFlyToAnimatingChange", animating);
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

  // Use API control
  const setUseApi = React.useCallback(
    (useApi: boolean, autoLoad: boolean = true) => {
      if (instanceRef.current) {
        instanceRef.current.setUseApi(useApi, autoLoad);
      }
    },
    [],
  );

  // Properties search
  const propertiesSearch = React.useMemo(
    () => ({
      search: async (options: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: any) => {
          price?: any;
          limit?: number;
        };
        smartFiltersClearable?: boolean;
        onError?: (error: unknown) => void;
      }) => {
        if (!instanceRef.current) {
          throw new Error("MapFirst instance not available");
        }

        return await instanceRef.current.runPropertiesSearch(options);
      },
    }),
    [],
  );

  // Smart filter search
  const smartFilterSearch = React.useMemo(
    () => ({
      search: async (options: {
        query?: string;
        filters?: SmartFilter[];
        onProcessFilters?: (
          filters: any,
          location_id?: number,
        ) => {
          smartFilters?: SmartFilter[];
          price?: any;
          limit?: number;
          language?: string;
        };
        onError?: (error: unknown) => void;
      }) => {
        if (!instanceRef.current) {
          throw new Error("MapFirst instance not available");
        }

        return await instanceRef.current.runSmartFilterSearch(options);
      },
    }),
    [],
  );

  // Bounds search
  const boundsSearch = React.useMemo(
    () => ({
      perform: async () => {
        if (!instanceRef.current) {
          return null;
        }

        return await instanceRef.current.performBoundsSearch();
      },
    }),
    [],
  );

  // Map attachment helpers
  const mapLibreAttachedRef = React.useRef(false);
  const attachMapLibre = React.useCallback(
    (
      map: any,
      maplibregl: MapLibreNamespace,
      options?: { onMarkerClick?: (marker: Property) => void },
    ) => {
      attachMapOnce(instanceRef, mapLibreAttachedRef, map, {
        platform: "maplibre",
        maplibregl,
        onMarkerClick: options?.onMarkerClick,
      });
    },
    [],
  );

  const googleMapsAttachedRef = React.useRef(false);
  const attachGoogle = React.useCallback(
    (
      map: any,
      google: GoogleMapsNamespace,
      options?: { onMarkerClick?: (marker: Property) => void },
    ) => {
      attachMapOnce(instanceRef, googleMapsAttachedRef, map, {
        platform: "google",
        google,
        onMarkerClick: options?.onMarkerClick,
      });
    },
    [],
  );

  const mapboxAttachedRef = React.useRef(false);
  const attachMapbox = React.useCallback(
    (
      map: any,
      mapboxgl: MapboxNamespace,
      options?: { onMarkerClick?: (marker: Property) => void },
    ) => {
      attachMapOnce(instanceRef, mapboxAttachedRef, map, {
        platform: "mapbox",
        mapboxgl,
        onMarkerClick: options?.onMarkerClick,
      });
    },
    [],
  );

  return {
    instance: instanceRef.current,
    state,
    setPrimaryType,
    setSelectedMarker,
    setUseApi,
    propertiesSearch,
    smartFilterSearch,
    boundsSearch,
    attachMapLibre,
    attachGoogle,
    attachMapbox,
  };
}
