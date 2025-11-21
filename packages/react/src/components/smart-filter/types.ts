import type { PropertyType, PriceLevel } from "@mapfirst.ai/core";

export type Filter = {
  id: string;
  label: string | React.ReactNode;
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
  icon?: React.ReactNode;
  priceRange?: PriceRangeValue;
  propertyType?: PropertyType;
  priceLevels?: PriceLevel[];
};

export type PriceRangeValue = {
  min?: number;
  max?: number;
};
