import * as _mapfirst_ai_core from '@mapfirst.ai/core';
import { PropertyType, PriceLevel, BaseMapFirstOptions, MapFirstCore, MapState, Property, MapLibreNamespace, MarkerOptions, GoogleMapsNamespace, MapboxNamespace, LeafletNamespace } from '@mapfirst.ai/core';
export { ActiveLocation, ApiFiltersResponse, BaseMapFirstOptions, Environment, FilterSchema, FilterState, GoogleMapsNamespace, LeafletAdapter, LeafletNamespace, MapBounds, MapFirstCore, MapFirstOptions, MapLibreNamespace, MapState, MapStateCallbacks, MapStateUpdate, MapboxNamespace, Price, PriceLevel, PropertiesFetchError, Property, PropertyType, TripAdvisorImage, TripAdvisorImageResponse, ViewState, convertToApiFilters, fetchImages, fetchProperties, isWebGLSupported, processApiFilters } from '@mapfirst.ai/core';
import * as React$1 from 'react';
import React__default, { CSSProperties, FunctionComponent, ReactNode } from 'react';

interface IconProps$1 {
    className?: string;
    style?: CSSProperties;
}
interface IconsContextValue {
    CloseIcon: React__default.FC<IconProps$1>;
    EditIcon: React__default.FC<IconProps$1>;
    NextIcon: React__default.FC<IconProps$1>;
    SearchIcon: React__default.FC<IconProps$1>;
}
declare const IconsProvider: React__default.FC<{
    value?: Partial<IconsContextValue>;
    children: React__default.ReactNode;
}>;
declare const useIcons: () => IconsContextValue;

type Filter = {
    id: string;
    label: string | React.ReactNode;
    type: "amenity" | "hotelStyle" | "features" | "goodFor" | "meals" | "specialDiets" | "priceRange" | "minRating" | "starRating" | "primary_type" | "transformed_query" | "selected_restaurant_price_levels";
    value: string;
    numericValue?: number;
    icon?: React.ReactNode;
    priceRange?: PriceRangeValue;
    propertyType?: PropertyType;
    priceLevels?: PriceLevel[];
};
type PriceRangeValue = {
    min?: number;
    max?: number;
};

/** Per-element style overrides for the SmartFilter component tree. */
interface SmartFilterStyles {
    /** Outer wrapper div */
    container?: CSSProperties;
    /** Horizontally-scrollable chips row */
    scrollContainer?: CSSProperties;
    /** Generic text chips (amenities, hotel style, etc.) */
    chip?: CSSProperties;
    /** minRating / starRating interactive chip container */
    minRatingChip?: CSSProperties;
    /** Price range chip container */
    priceRangeChip?: CSSProperties;
    /** Transformed-query chip container */
    transformedQueryChip?: CSSProperties;
    /** Restaurant price-level chip container */
    restaurantPriceLevelChip?: CSSProperties;
    /** Prev / next scroll nav buttons */
    navButton?: CSSProperties;
    /** "Clear all" button */
    clearAllButton?: CSSProperties;
}
interface SmartFilterProps {
    filters: Filter[];
    isSearching?: boolean;
    onFilterChange: (filters: Filter[]) => Promise<void> | void;
    customTranslations?: Record<string, string>;
    currency?: string;
    /**
     * Content rendered as the first item inside the scroll row, before any
     * chips. Use this to place a sticky-looking action button (e.g. a search /
     * reset icon) that scrolls together with the chips.
     */
    beforeContent?: ReactNode;
    /** Fine-grained style overrides for every visual part of the component. */
    styles?: SmartFilterStyles;
    /** Custom icon components to replace the SDK defaults. */
    customIcons?: Partial<IconsContextValue>;
    /** @deprecated Use `styles.container` instead. */
    style?: CSSProperties;
    /** @deprecated Use `styles.container` instead. */
    containerStyle?: CSSProperties;
}
declare const SmartFilter$1: FunctionComponent<SmartFilterProps>;

interface IconProps {
    className?: string;
    style?: CSSProperties;
}
declare const SearchIcon: React__default.FC<IconProps>;
declare const CloseIcon: React__default.FC<IconProps>;
declare const EditIcon: React__default.FC<IconProps>;
declare const NextIcon: React__default.FC<IconProps>;
declare const StarIcon: React__default.FC<IconProps & {
    fill?: string;
}>;

interface ChipProps {
    label: string | ReactNode;
    icon?: ReactNode;
    remove: () => void;
    style?: CSSProperties;
}
declare const Chip: React__default.FC<ChipProps>;

interface FilterChipsProps {
    filters: Filter[];
    currency: string;
    minRatingSuffix: string;
    clearAllLabel: string;
    previousFiltersLabel: string;
    nextFiltersLabel: string;
    formatCurrency: (value: number, currency?: string) => string;
    onFilterChange: (filters: Filter[], clearAll?: boolean) => void | Promise<void>;
    onResetFilters: () => void;
    onClearAll: () => void;
    /** Rendered as the first item in the scroll row, before any chips. */
    beforeContent?: ReactNode;
    /** Style overrides forwarded from SmartFilter. */
    styles?: SmartFilterStyles;
}
declare const FilterChips: FunctionComponent<FilterChipsProps>;

declare const MinRatingFilterChip: FunctionComponent<{
    star?: boolean;
    rating: number;
    onChange: (rating: number) => void;
    onRemove: () => void;
    style?: CSSProperties;
}>;

declare const PriceRangeFilterChip: FunctionComponent<{
    priceRange: PriceRangeValue;
    currency: string;
    onChange: (range: PriceRangeValue) => void;
    onRemove: () => void;
    style?: CSSProperties;
}>;

interface RestaurantPriceLevelChipProps {
    values: PriceLevel[];
    onChange: (values: PriceLevel[]) => void;
    onRemove: () => void;
    style?: CSSProperties;
}
declare const RestaurantPriceLevelChip: FunctionComponent<RestaurantPriceLevelChipProps>;

interface TransformedQueryChipProps {
    value: string;
    onChange: (nextValue: string) => void;
    onRemove: () => void;
    style?: CSSProperties;
}
declare const TransformedQueryChip: FunctionComponent<TransformedQueryChipProps>;

declare const renderStars: (rating: number) => ReactNode[];
declare const createMinRatingFilterLabel: (rating: number, suffix?: string) => ReactNode;
declare const formatRatingValue: (rating: number) => string;
declare const createPriceRangeFilterLabel: (min: number, max: number | undefined, currency: string | undefined, formatCurrencyFn: (value: number, currency?: string) => string) => string;

declare const useFilterScroll: (dependency: number) => {
    scrollerRef: React$1.RefObject<HTMLDivElement | null>;
    atStart: boolean;
    atEnd: boolean;
    scrollByDir: (dir: "prev" | "next") => void;
};

type Locale = "en" | "es" | "de" | "fr" | "it" | "pt";
type TranslationFunction = (key: string, params?: Record<string, any>) => string;
type FormatCurrencyFunction = (value: number, currency?: string) => string;
/**
 * Simple translation hook with default English translations.
 * Can be extended with custom translations and locales.
 */
declare const useTranslation: (customTranslations?: Record<string, string>, customFormatCurrency?: FormatCurrencyFunction) => {
    t: TranslationFunction;
    locale: Locale;
    setLocale: React$1.Dispatch<React$1.SetStateAction<Locale>>;
    formatCurrency: (value: number, currency?: string) => string;
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
type SmartFilter = {
    id: string;
    label: string;
    type: "amenity" | "hotelStyle" | "features" | "goodFor" | "meals" | "specialDiets" | "priceRange" | "minRating" | "starRating" | "primary_type" | "transformed_query" | "selected_restaurant_price_levels";
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
declare function useMapFirst(options: BaseMapFirstOptions): {
    instance: MapFirstCore;
    state: MapState;
    setPrimaryType: (type: PropertyType) => void;
    setSelectedMarker: (id: number | null) => void;
    setUseApi: (useApi: boolean, autoLoad?: boolean) => void;
    propertiesSearch: (options: {
        body: InitialRequestBody;
        beforeApplyProperties?: (data: any) => {
            price?: any;
            limit?: number;
        };
        smartFiltersClearable?: boolean;
        onError?: (error: unknown) => void;
    }) => Promise<{
        location_id?: number;
        filters: _mapfirst_ai_core.FilterSchema;
        properties: Property[];
        isComplete: boolean | undefined;
        pollingLink: string | undefined;
        durationSeconds: number;
    } | null>;
    smartFilterSearch: (options: {
        query?: string;
        filters?: SmartFilter[];
        onProcessFilters?: (filters: any, location_id?: number) => {
            smartFilters?: SmartFilter[];
            price?: any;
            limit?: number;
            language?: string;
        };
        onError?: (error: unknown) => void;
    }) => Promise<{
        location_id?: number;
        filters: _mapfirst_ai_core.FilterSchema;
        properties: Property[];
        isComplete: boolean | undefined;
        pollingLink: string | undefined;
        durationSeconds: number;
    } | null>;
    boundsSearch: () => Promise<{
        location_id?: number;
        filters: _mapfirst_ai_core.FilterSchema;
        properties: Property[];
        isComplete: boolean | undefined;
        pollingLink: string | undefined;
        durationSeconds: number;
    } | null>;
    attachMapLibre: (map: any, maplibregl: MapLibreNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
    }) => void;
    attachGoogle: (map: any, google: GoogleMapsNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
    }) => void;
    attachMapbox: (map: any, mapboxgl: MapboxNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
    }) => void;
    attachLeaflet: (map: any, leaflet: LeafletNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
        markerOptions?: MarkerOptions;
    }) => void;
};

export { Chip, type ChipProps, CloseIcon, EditIcon, type Filter, FilterChips, type FilterChipsProps, type IconProps$1 as IconProps, type IconsContextValue, IconsProvider, type Locale, MinRatingFilterChip, NextIcon, PriceRangeFilterChip, type PriceRangeValue, RestaurantPriceLevelChip, type RestaurantPriceLevelChipProps, SearchIcon, SmartFilter$1 as SmartFilter, type SmartFilterProps, type SmartFilterStyles, StarIcon, TransformedQueryChip, type TransformedQueryChipProps, createMinRatingFilterLabel, createPriceRangeFilterLabel, formatRatingValue, renderStars, useFilterScroll, useIcons, useMapFirst, useTranslation };
