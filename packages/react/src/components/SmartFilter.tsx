import {
  FunctionComponent,
  ReactNode,
  useCallback,
  CSSProperties,
} from "react";
import { FilterChips } from "./smart-filter/FilterChips";
import { useTranslation } from "../hooks/useTranslation";
import { TranslationProvider } from "../context/TranslationContext";
import type { Filter } from "./smart-filter/types";

/** Per-element style overrides for the SmartFilter component tree. */
export interface SmartFilterStyles {
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

export interface SmartFilterProps {
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
  /** @deprecated Use `styles.container` instead. */
  style?: CSSProperties;
  /** @deprecated Use `styles.container` instead. */
  containerStyle?: CSSProperties;
}

const containerStyles: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};

export const SmartFilter: FunctionComponent<SmartFilterProps> = ({
  filters,
  isSearching = false,
  onFilterChange,
  customTranslations,
  currency = "USD",
  beforeContent,
  styles,
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
    [isSearching, onFilterChange],
  );

  const resetFilters = useCallback(() => {
    void handleFilterChange([]);
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    void handleFilterChange([], true);
  }, [handleFilterChange]);

  return (
    <TranslationProvider value={customTranslations}>
      <div
        style={{
          ...containerStyles,
          ...styles?.container,
          ...containerStyle,
          ...style,
        }}
      >
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
            beforeContent={beforeContent}
            styles={styles}
          />
        )}
      </div>
    </TranslationProvider>
  );
};
