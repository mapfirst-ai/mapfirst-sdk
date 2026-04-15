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
  type MapStateCallbacks,
  type PropertyType,
  type MarkerOptions,
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
 * await propertiesSearch({
 *   body: { city: "Paris", country: "France" }
 * });
 *
 * await smartFilterSearch({
 *   query: "hotels near beach with pool"
 * });
 *
 * await boundsSearch();
 * ```
 */
export function useMapFirst(options: BaseMapFirstOptions) {
  // Keep options in a ref so callbacks always read the latest values.
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  // Stable mutable callbacks container. MapFirstCore stores this by reference,
  // so assigning properties after construction is reflected inside the core.
  const callbacksRef = React.useRef<MapStateCallbacks>({});

  // Create the instance synchronously on the first render so that the initial
  // state is always a valid MapState — never null.
  const instanceRef = React.useRef<MapFirstCore | null>(null);
  if (instanceRef.current === null) {
    instanceRef.current = new MapFirstCore({
      adapter: null as any,
      ...optionsRef.current,
      callbacks: callbacksRef.current,
    });
  }

  // State initialized directly from the instance — always non-null.
  const [state, setState] = React.useState<MapState>(() =>
    instanceRef.current!.getState(),
  );

  React.useEffect(() => {
    // React StrictMode mounts, cleans up, then mounts again to detect side
    // effects. The first cleanup destroys the instance; re-create it here.
    if (!instanceRef.current) {
      callbacksRef.current = {};
      instanceRef.current = new MapFirstCore({
        adapter: null as any,
        ...optionsRef.current,
        callbacks: callbacksRef.current,
      });
      setState(instanceRef.current.getState());
      // Reset attachment flags so the new instance can accept a map.
      mapLibreAttachedRef.current = false;
      googleMapsAttachedRef.current = false;
      mapboxAttachedRef.current = false;
    }

    // Wire up reactive callbacks. The instance already holds callbacksRef.current
    // by reference, so these assignments are immediately visible inside the core.
    const cb = callbacksRef.current;
    cb.onPropertiesChange = (properties) => {
      setState((prev) => ({ ...prev, properties }));
      forwardCallback(optionsRef, "onPropertiesChange", properties);
    };
    cb.onSelectedPropertyChange = (id) => {
      setState((prev) => ({ ...prev, selectedPropertyId: id }));
      forwardCallback(optionsRef, "onSelectedPropertyChange", id);
    };
    cb.onPrimaryTypeChange = (type) => {
      setState((prev) => ({ ...prev, primary: type }));
      forwardCallback(optionsRef, "onPrimaryTypeChange", type);
    };
    cb.onFiltersChange = (filters) => {
      setState((prev) => ({ ...prev, filters }));
      forwardCallback(optionsRef, "onFiltersChange", filters);
    };
    cb.onBoundsChange = (bounds) => {
      setState((prev) => ({ ...prev, bounds }));
      forwardCallback(optionsRef, "onBoundsChange", bounds);
    };
    cb.onPendingBoundsChange = (pendingBounds) => {
      setState((prev) => ({ ...prev, pendingBounds }));
      forwardCallback(optionsRef, "onPendingBoundsChange", pendingBounds);
    };
    cb.onCenterChange = (center, zoom) => {
      setState((prev) => ({ ...prev, center, zoom }));
      forwardCallback(optionsRef, "onCenterChange", center, zoom);
    };
    cb.onZoomChange = (zoom) => {
      setState((prev) => ({ ...prev, zoom }));
      forwardCallback(optionsRef, "onZoomChange", zoom);
    };
    cb.onActiveLocationChange = (location) => {
      setState((prev) => ({ ...prev, activeLocation: location }));
      forwardCallback(optionsRef, "onActiveLocationChange", location);
    };
    cb.onLoadingStateChange = (loading) => {
      setState((prev) => ({ ...prev, initialLoading: loading }));
      forwardCallback(optionsRef, "onLoadingStateChange", loading);
    };
    cb.onSearchingStateChange = (searching) => {
      setState((prev) => ({ ...prev, isSearching: searching }));
      forwardCallback(optionsRef, "onSearchingStateChange", searching);
    };
    cb.onFirstCallDoneChange = (firstCallDone) => {
      setState((prev) => ({ ...prev, firstCallDone }));
      forwardCallback(optionsRef, "onFirstCallDoneChange", firstCallDone);
    };
    cb.onIsFlyToAnimatingChange = (animating) => {
      setState((prev) => ({ ...prev, isFlyToAnimating: animating }));
      forwardCallback(optionsRef, "onIsFlyToAnimatingChange", animating);
    };

    return () => {
      // Clear all callbacks so the destroyed instance cannot trigger setState
      // after the component has unmounted.
      const existingCb = callbacksRef.current;
      (Object.keys(existingCb) as Array<keyof MapStateCallbacks>).forEach(
        (k) => delete existingCb[k],
      );
      instanceRef.current?.destroy();
      instanceRef.current = null;
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
  const propertiesSearch = React.useCallback(
    async (options: {
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
    [],
  );

  // Smart filter search
  const smartFilterSearch = React.useCallback(
    async (options: {
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
    [],
  );

  // Bounds search
  const boundsSearch = React.useCallback(async () => {
    if (!instanceRef.current) {
      return null;
    }

    return await instanceRef.current.performBoundsSearch();
  }, []);

  // Map attachment helpers
  const mapLibreAttachedRef = React.useRef(false);
  const attachMapLibre = React.useCallback(
    (
      map: any,
      maplibregl: MapLibreNamespace,
      options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
      },
    ) => {
      attachMapOnce(instanceRef, mapLibreAttachedRef, map, {
        platform: "maplibre",
        maplibregl,
        onMarkerClick: options?.onMarkerClick,
        markerOptions: options?.markerOptions,
      });
    },
    [],
  );

  const googleMapsAttachedRef = React.useRef(false);
  const attachGoogle = React.useCallback(
    (
      map: any,
      google: GoogleMapsNamespace,
      options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
      },
    ) => {
      attachMapOnce(instanceRef, googleMapsAttachedRef, map, {
        platform: "google",
        google,
        onMarkerClick: options?.onMarkerClick,
        markerOptions: options?.markerOptions,
      });
    },
    [],
  );

  const mapboxAttachedRef = React.useRef(false);
  const attachMapbox = React.useCallback(
    (
      map: any,
      mapboxgl: MapboxNamespace,
      options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
      },
    ) => {
      attachMapOnce(instanceRef, mapboxAttachedRef, map, {
        platform: "mapbox",
        mapboxgl,
        onMarkerClick: options?.onMarkerClick,
        markerOptions: options?.markerOptions,
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
