import * as _mapfirst_ai_core from '@mapfirst.ai/core';
import { PropertyType, PriceLevel, BaseMapFirstOptions, MapFirstCore, MapState, Property, MapLibreNamespace, GoogleMapsNamespace, MapboxNamespace } from '@mapfirst.ai/core';
export { ApiFiltersResponse, convertToApiFilters, processApiFilters } from '@mapfirst.ai/core';
import * as React$1 from 'react';
import React__default, { FunctionComponent, CSSProperties, ReactNode } from 'react';

type Filter = {
    id: string;
    label: string | React.ReactNode;
    type: "amenity" | "hotelStyle" | "priceRange" | "minRating" | "starRating" | "primary_type" | "transformed_query" | "selected_restaurant_price_levels";
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

interface SmartFilterProps {
    filters: Filter[];
    isSearching?: boolean;
    onFilterChange: (filters: Filter[]) => Promise<void> | void;
    customTranslations?: Record<string, string>;
    currency?: string;
    style?: CSSProperties;
    containerStyle?: CSSProperties;
}
/**
 * SmartFilter component for AI-powered search with filter chips.
 * Provides a search input with smart filtering capabilities.
 *
 * @example
 * ```tsx
 * const { mapFirst, state } = useMapFirstCore({ ... });
 * const [filters, setFilters] = useState<Filter[]>([]);
 * const [searchValue, setSearchValue] = useState("");
 *
 * const handleSearch = async (query: string, currentFilters?: Filter[]) => {
 *   // Perform search using mapFirst.runSmartFilterSearch
 *   const result = await mapFirst.runSmartFilterSearch({
 *     query,
 *     filters: currentFilters
 *   });
 *   // Update filters based on response
 * };
 *
 * return (
 *   <SmartFilter
 *     mapFirst={mapFirst}
 *     filters={filters}
 *     value={searchValue}
 *     isSearching={state?.isSearching}
 *     onSearch={handleSearch}
 *     onFilterChange={setFilters}
 *     onValueChange={setSearchValue}
 *   />
 * );
 * ```
 */
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
}
declare const FilterChips: FunctionComponent<FilterChipsProps>;

declare const MinRatingFilterChip: FunctionComponent<{
    star?: boolean;
    rating: number;
    onChange: (rating: number) => void;
    onRemove: () => void;
}>;

declare const PriceRangeFilterChip: FunctionComponent<{
    priceRange: PriceRangeValue;
    currency: string;
    onChange: (range: PriceRangeValue) => void;
    onRemove: () => void;
}>;

interface RestaurantPriceLevelChipProps {
    values: PriceLevel[];
    onChange: (values: PriceLevel[]) => void;
    onRemove: () => void;
}
declare const RestaurantPriceLevelChip: FunctionComponent<RestaurantPriceLevelChipProps>;

interface TransformedQueryChipProps {
    value: string;
    onChange: (nextValue: string) => void;
    onRemove: () => void;
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
declare function useMapFirst(options: BaseMapFirstOptions): {
    instance: MapFirstCore | null;
    state: MapState | null;
    setPrimaryType: (type: PropertyType) => void;
    setSelectedMarker: (id: number | null) => void;
    setUseApi: (useApi: boolean, autoLoad?: boolean) => void;
    propertiesSearch: {
        search: (options: {
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
    };
    smartFilterSearch: {
        search: (options: {
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
    };
    boundsSearch: {
        perform: () => Promise<{
            location_id?: number;
            filters: _mapfirst_ai_core.FilterSchema;
            properties: Property[];
            isComplete: boolean | undefined;
            pollingLink: string | undefined;
            durationSeconds: number;
        } | null>;
    };
    attachMapLibre: (map: any, maplibregl: MapLibreNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
    }) => void;
    attachGoogle: (map: any, google: GoogleMapsNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
    }) => void;
    attachMapbox: (map: any, mapboxgl: MapboxNamespace, options?: {
        onMarkerClick?: (marker: Property) => void;
    }) => void;
};

export { Chip, type ChipProps, CloseIcon, EditIcon, type Filter, FilterChips, type FilterChipsProps, type IconProps, type Locale, MinRatingFilterChip, NextIcon, PriceRangeFilterChip, type PriceRangeValue, RestaurantPriceLevelChip, type RestaurantPriceLevelChipProps, SearchIcon, SmartFilter$1 as SmartFilter, type SmartFilterProps, StarIcon, TransformedQueryChip, type TransformedQueryChipProps, createMinRatingFilterLabel, createPriceRangeFilterLabel, formatRatingValue, renderStars, useFilterScroll, useMapFirst, useTranslation };
