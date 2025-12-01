import React, {
  FormEventHandler,
  FunctionComponent,
  useCallback,
  useState,
  CSSProperties,
} from "react";
import { FilterChips } from "./smart-filter/FilterChips";
import { useTranslation } from "../hooks/useTranslation";
import type { Filter } from "./smart-filter/types";
import type { MapFirstCore } from "@mapfirst.ai/core";

export interface SmartFilterProps {
  mapFirst: MapFirstCore | null;
  filters: Filter[];
  value?: string;
  isSearching?: boolean;
  placeholder?: string;
  onSearch: (query: string, filters?: Filter[]) => Promise<void> | void;
  onFilterChange: (filters: Filter[]) => Promise<void> | void;
  onValueChange?: (value: string) => void;
  showTypingPrompt?: boolean;
  customTranslations?: Record<string, string>;
  currency?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  containerStyle?: CSSProperties;
}

const containerStyles: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};

const formStyles: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
};

const inputContainerStyles: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  flex: 1,
  backgroundColor: "white",
  borderRadius: "24px",
  border: "1px solid #e5e5e5",
  padding: "0 16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const inputStyles: CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "16px",
  backgroundColor: "transparent",
  color: "#000",
  padding: "10px",
};

const loaderContainerStyles: CSSProperties = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
};

const loaderStyles: CSSProperties = {
  width: "20px",
  height: "20px",
  border: "2px solid #e5e5e5",
  borderTop: "2px solid #03852e",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const typingPromptStyles: CSSProperties = {
  position: "absolute",
  padding: "10px",
  color: "#737373",
  pointerEvents: "none",
  fontSize: "16px",
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
  mapFirst,
  filters,
  value: controlledValue,
  isSearching = false,
  placeholder,
  onSearch,
  onFilterChange,
  onValueChange,
  showTypingPrompt = true,
  customTranslations,
  currency = "USD",
  style,
  inputStyle,
  containerStyle,
}) => {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onValueChange || setInternalValue;

  const { t, formatCurrency } = useTranslation(customTranslations);

  const minRatingSuffix = t("smartFilter.minRating.suffix");
  const typingPrompt = placeholder || t("smartFilter.typingPrompt");
  const previousFiltersLabel = t("smartFilter.nav.previous");
  const nextFiltersLabel = t("smartFilter.nav.next");
  const clearAllLabel = t("smartFilter.clearAll");

  const formSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const query = value.trim();
    if (!query || isSearching) {
      return;
    }
    try {
      await onSearch(query);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

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
    setValue("");
  }, [handleFilterChange, setValue]);

  return (
    <div style={{ ...containerStyles, ...containerStyle }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {filters.length === 0 && (
        <form onSubmit={formSubmit} style={{ ...formStyles, ...style }}>
          <div style={inputContainerStyles}>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isSearching}
              style={{ ...inputStyles, ...inputStyle }}
              autoComplete="off"
              aria-label="Smart search"
            />
            {showTypingPrompt && value.length === 0 && !isSearching && (
              <span style={typingPromptStyles}>{typingPrompt}</span>
            )}
            {isSearching && (
              <div style={loaderContainerStyles}>
                <div style={loaderStyles} />
              </div>
            )}
          </div>
        </form>
      )}

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
