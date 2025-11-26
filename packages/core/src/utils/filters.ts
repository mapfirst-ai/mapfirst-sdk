import type { FilterSchema, SmartFilter } from "../types";

/**
 * Response type from the API containing filter information
 */
export type ApiFiltersResponse = Pick<
  FilterSchema,
  | "amenities"
  | "hotelStyle"
  | "price"
  | "minRating"
  | "starRating"
  | "transformed_query"
  | "selected_restaurant_price_levels"
>;

/**
 * Converts API filter response into SmartFilter objects that can be used with the SmartFilter component.
 * This utility processes the various filter types returned from the API and transforms them into
 * a standardized SmartFilter format.
 *
 * @param apiFilters - The filter response from the API
 * @returns An array of SmartFilter objects
 *
 * @example
 * ```typescript
 * const apiResponse = await search({ query: "hotels with pool" });
 * const filters = processApiFilters(apiResponse.filters);
 * // filters will contain SmartFilter objects for amenities, price range, ratings, etc.
 * ```
 */
export function processApiFilters(
  apiFilters: ApiFiltersResponse
): SmartFilter[] {
  const filters: SmartFilter[] = [];

  // Process amenities
  if (apiFilters.amenities && Array.isArray(apiFilters.amenities)) {
    apiFilters.amenities.forEach((amenity: string) => {
      filters.push({
        id: `amenity-${amenity}`,
        label: amenity,
        type: "amenity",
        value: amenity,
      });
    });
  }

  // Process hotel styles
  if (apiFilters.hotelStyle && Array.isArray(apiFilters.hotelStyle)) {
    apiFilters.hotelStyle.forEach((style: string) => {
      filters.push({
        id: `hotelStyle-${style}`,
        label: style,
        type: "hotelStyle",
        value: style,
      });
    });
  }

  // Process price range
  if (apiFilters.price) {
    filters.push({
      id: "priceRange",
      label: "Price Range",
      type: "priceRange",
      value: `${apiFilters.price.min}-${apiFilters.price.max}`,
      priceRange: apiFilters.price,
    });
  }

  // Process minimum rating
  if (
    typeof apiFilters.minRating === "number" &&
    Number.isFinite(apiFilters.minRating)
  ) {
    filters.push({
      id: "minRating",
      label: `${apiFilters.minRating}+`,
      type: "minRating",
      value: String(apiFilters.minRating),
      numericValue: apiFilters.minRating,
    });
  }

  // Process star rating
  if (
    typeof apiFilters.starRating === "number" &&
    Number.isFinite(apiFilters.starRating)
  ) {
    filters.push({
      id: "starRating",
      label: `${apiFilters.starRating} Stars`,
      type: "starRating",
      value: String(apiFilters.starRating),
      numericValue: apiFilters.starRating,
    });
  }

  // Process transformed query
  if (apiFilters.transformed_query) {
    filters.push({
      id: "transformed_query",
      label: apiFilters.transformed_query,
      type: "transformed_query",
      value: apiFilters.transformed_query,
    });
  }

  // Process restaurant price levels
  if (apiFilters.selected_restaurant_price_levels) {
    filters.push({
      id: "selected_restaurant_price_levels",
      label: apiFilters.selected_restaurant_price_levels.join(", "),
      type: "selected_restaurant_price_levels",
      value: apiFilters.selected_restaurant_price_levels.join(", "),
      priceLevels: apiFilters.selected_restaurant_price_levels,
    });
  }

  return filters;
}

/**
 * Converts filter objects (SmartFilter or React Filter) back to API-compatible filter format.
 * This is the inverse operation of processApiFilters.
 * Accepts filters with label as string or ReactNode and normalizes them.
 *
 * @param filters - Array of filter objects (SmartFilter or React Filter with ReactNode labels)
 * @returns API-compatible SmartFilter array
 *
 * @example
 * ```typescript
 * const filters = [
 *   { id: "amenity-pool", label: "Pool", type: "amenity", value: "Pool" }
 * ];
 * const apiFilters = convertToApiFilters(filters);
 * // apiFilters will contain normalized SmartFilter objects
 * ```
 */
export function convertToApiFilters(filters: any[]): SmartFilter[] {
  return filters.map((filter) => {
    const apiFilter: SmartFilter = {
      id: filter.id,
      label:
        typeof filter.label === "string"
          ? filter.label
          : String(filter.label || ""),
      type: filter.type,
      value: filter.value,
    };

    if (filter.numericValue !== undefined) {
      apiFilter.numericValue = filter.numericValue;
    }

    if (filter.priceRange) {
      // Handle both optional and required min/max
      const min = filter.priceRange.min;
      const max = filter.priceRange.max;
      if (min !== undefined) {
        apiFilter.priceRange = {
          min,
          ...(max !== undefined && { max }),
        };
      }
    }

    if (filter.priceLevels) {
      apiFilter.priceLevels = filter.priceLevels;
    }

    return apiFilter;
  });
}
