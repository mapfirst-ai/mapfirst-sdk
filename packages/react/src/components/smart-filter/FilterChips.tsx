import React, { FunctionComponent, CSSProperties } from "react";
import { Chip } from "./Chip";
import { MinRatingFilterChip } from "./MinRatingFilterChip";
import { PriceRangeFilterChip } from "./PriceRangeFilterChip";
import { RestaurantPriceLevelChip } from "./RestaurantPriceLevelChip";
import { TransformedQueryChip } from "./TransformedQueryChip";
import { SearchIcon, NextIcon } from "../Icons";
import { useFilterScroll } from "../../hooks/useFilterScroll";
import type { Filter } from "./types";

export interface FilterChipsProps {
  filters: Filter[];
  currency: string;
  minRatingSuffix: string;
  clearAllLabel: string;
  previousFiltersLabel: string;
  nextFiltersLabel: string;
  formatCurrency: (value: number, currency?: string) => string;
  onFilterChange: (
    filters: Filter[],
    clearAll?: boolean
  ) => void | Promise<void>;
  onResetFilters: () => void;
  onClearAll: () => void;
}

const containerStyles: CSSProperties = {
  position: "relative",
  width: "100%",
};

const scrollContainerBase: CSSProperties = {
  display: "flex",
  gap: "8px",
  overflowX: "auto",
  alignItems: "center",
  width: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const gradientStyles: CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "40px",
};

const navButtonStyles: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "white",
  color: "#003c30",
  border: "1px solid #003c30",
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

export const FilterChips: FunctionComponent<FilterChipsProps> = ({
  filters,
  currency,
  minRatingSuffix: _minRatingSuffix,
  clearAllLabel,
  previousFiltersLabel,
  nextFiltersLabel,
  formatCurrency: _formatCurrency,
  onFilterChange,
  onResetFilters: _onResetFilters,
  onClearAll,
}) => {
  const { scrollerRef, atStart, atEnd, scrollByDir } = useFilterScroll(
    filters.length
  );
  const [navHover, setNavHover] = React.useState<"prev" | "next" | null>(null);
  const [clearHover, setClearHover] = React.useState(false);
  const removeFilter = React.useCallback(
    (filterId: string) => {
      void onFilterChange(filters.filter((f) => f.id !== filterId));
    },
    [filters, onFilterChange]
  );
  const patchFilter = React.useCallback(
    (filterId: string, patch: Partial<Filter>) => {
      const nextFilters = filters.map((f) =>
        f.id === filterId ? { ...f, ...patch } : f
      );
      void onFilterChange(nextFilters);
    },
    [filters, onFilterChange]
  );

  return (
    <div style={containerStyles}>
      <div
        ref={scrollerRef}
        style={{
          ...scrollContainerBase,
          padding: "8px",
          // Hide scrollbar for webkit browsers
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {filters.map((filter) => {
          const renderStandardChip = () => (
            <Chip
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              remove={() => removeFilter(filter.id)}
            />
          );

          if (filter.type === "minRating" || filter.type === "starRating") {
            const currentRating = filter.numericValue ?? Number(filter.value);
            if (!Number.isFinite(currentRating)) {
              return renderStandardChip();
            }

            return (
              <MinRatingFilterChip
                star={filter.type === "starRating"}
                key={filter.id}
                rating={currentRating}
                onChange={(nextRating) => {
                  patchFilter(filter.id, {
                    numericValue: nextRating,
                    value: String(nextRating),
                  });
                }}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (filter.type === "priceRange" && filter.priceRange) {
            return (
              <PriceRangeFilterChip
                key={filter.id}
                priceRange={filter.priceRange}
                currency={currency}
                onChange={(nextRange) => {
                  patchFilter(filter.id, { priceRange: nextRange });
                }}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (filter.type === "transformed_query") {
            return (
              <TransformedQueryChip
                key={filter.id}
                value={filter.value}
                onChange={(nextValue) => {
                  patchFilter(filter.id, { value: nextValue });
                }}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          if (filter.type === "selected_restaurant_price_levels") {
            return (
              <RestaurantPriceLevelChip
                key={filter.id}
                values={filter.priceLevels ?? []}
                onChange={(nextLevels) => {
                  patchFilter(filter.id, { priceLevels: nextLevels });
                }}
                onRemove={() => removeFilter(filter.id)}
              />
            );
          }

          return renderStandardChip();
        })}
        <button
          style={{
            flexShrink: 0,
            padding: "4px 16px",
            borderRadius: "9999px",
            cursor: "pointer",
            fontSize: "14px",
            userSelect: "none",
            backgroundColor: clearHover ? "#eee" : "white",
            color: "black",
            border: "1px solid #03852e",
          }}
          onClick={onClearAll}
          onMouseEnter={() => setClearHover(true)}
          onMouseLeave={() => setClearHover(false)}
        >
          {clearAllLabel}
        </button>
      </div>

      {!atStart && (
        <div
          aria-hidden="true"
          style={{
            ...gradientStyles,
            left: 0,
            background: "linear-gradient(to right, white, transparent)",
          }}
        />
      )}

      {!atEnd && (
        <div
          aria-hidden="true"
          style={{
            ...gradientStyles,
            right: 0,
            background: "linear-gradient(to left, white, transparent)",
          }}
        />
      )}

      {!atStart && (
        <button
          type="button"
          aria-label={previousFiltersLabel}
          style={{
            ...navButtonStyles,
            left: "4px",
            transform: "translateY(-50%) rotate(180deg)",
            backgroundColor: navHover === "prev" ? "#e5e5e5" : "white",
          }}
          onClick={() => scrollByDir("prev")}
          onMouseEnter={() => setNavHover("prev")}
          onMouseLeave={() => setNavHover(null)}
        >
          <NextIcon style={{ width: "20px", height: "20px" }} />
        </button>
      )}

      {!atEnd && (
        <button
          type="button"
          aria-label={nextFiltersLabel}
          style={{
            ...navButtonStyles,
            right: "4px",
            backgroundColor: navHover === "next" ? "#e5e5e5" : "white",
          }}
          onClick={() => scrollByDir("next")}
          onMouseEnter={() => setNavHover("next")}
          onMouseLeave={() => setNavHover(null)}
        >
          <NextIcon style={{ width: "20px", height: "20px" }} />
        </button>
      )}
    </div>
  );
};
