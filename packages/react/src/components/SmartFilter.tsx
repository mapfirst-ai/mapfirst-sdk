import { FunctionComponent, useCallback, CSSProperties } from "react";
import { FilterChips } from "./smart-filter/FilterChips";
import { useTranslation } from "../hooks/useTranslation";
import type { Filter } from "./smart-filter/types";

export interface SmartFilterProps {
  filters: Filter[];
  isSearching?: boolean;
  onFilterChange: (filters: Filter[]) => Promise<void> | void;
  customTranslations?: Record<string, string>;
  currency?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
}

const containerStyles: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};
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
export const SmartFilter: FunctionComponent<SmartFilterProps> = ({
  filters,
  isSearching = false,
  onFilterChange,
  customTranslations,
  currency = "USD",
  containerStyle,
  style,
}) => {
  const { t, formatCurrency } = useTranslation(customTranslations);

  const minRatingSuffix = t("smartFilter.minRating.suffix");
  const previousFiltersLabel = t("smartFilter.nav.previous");
  const nextFiltersLabel = t("smartFilter.nav.next");
  const clearAllLabel = t("smartFilter.clearAll");

  const handleFilterChange = useCallback(
    async (nextFilters: Filter[], clearAll?: boolean) => {
      if (isSearching) {
        return;
      }
      try {
        await onFilterChange(nextFilters);
      } catch (error) {
        console.error("Filter change error:", error);
      }
    },
    [isSearching, onFilterChange]
  );

  const resetFilters = useCallback(() => {
    void handleFilterChange([]);
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    void handleFilterChange([], true);
  }, [handleFilterChange]);

  return (
    <div style={{ ...containerStyles, ...containerStyle }}>
      {filters.length > 0 && (
        <FilterChips
          filters={filters}
          currency={currency}
          minRatingSuffix={minRatingSuffix}
          clearAllLabel={clearAllLabel}
          previousFiltersLabel={previousFiltersLabel}
          nextFiltersLabel={nextFiltersLabel}
          formatCurrency={formatCurrency}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          onClearAll={clearAllFilters}
        />
      )}
    </div>
  );
};
