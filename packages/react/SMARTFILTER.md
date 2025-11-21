# SmartFilter Component

A comprehensive AI-powered search component with filter chips for the MapFirst SDK.

## Features

- **Smart Search Input**: AI-powered search with natural language queries
- **Filter Chips**: Interactive chips for managing search filters
- **Rating Filters**: Min rating and star rating filters with interactive controls
- **Price Range Filters**: Editable min/max price filters
- **Restaurant Price Levels**: Checkbox-based price level selection
- **Transformed Query**: Editable search query chip
- **Native React Styles**: No Tailwind CSS dependency - fully customizable with CSS-in-JS
- **Responsive Design**: Adapts to portrait and landscape orientations
- **Accessibility**: Full keyboard navigation and ARIA labels

## Installation

The SmartFilter component is included in `@mapfirst.ai/react` package.

```bash
npm install @mapfirst.ai/react @mapfirst.ai/core
```

## Basic Usage

```tsx
import { useMapFirstCore, SmartFilter, Filter } from "@mapfirst.ai/react";
import { useState } from "react";

function App() {
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async (query: string, currentFilters?: Filter[]) => {
    if (!mapFirst) return;

    const result = await mapFirst.runSmartFilterSearch({
      query,
      filters: currentFilters,
      onProcessFilters: (responseFilters, location_id) => {
        // Process and convert API response to Filter objects
        const newFilters = processApiFilters(responseFilters);
        setFilters(newFilters);
        return { smartFilters: newFilters };
      },
    });
  };

  return (
    <SmartFilter
      mapFirst={mapFirst}
      filters={filters}
      value={searchValue}
      isSearching={state?.isSearching}
      onSearch={handleSearch}
      onFilterChange={setFilters}
      onValueChange={setSearchValue}
      currency="USD"
    />
  );
}
```

## Props

### SmartFilterProps

| Prop                 | Type                                                           | Required | Description                                |
| -------------------- | -------------------------------------------------------------- | -------- | ------------------------------------------ |
| `mapFirst`           | `MapFirstCore \| null`                                         | Yes      | MapFirst SDK instance                      |
| `filters`            | `Filter[]`                                                     | Yes      | Array of active filters                    |
| `value`              | `string`                                                       | No       | Controlled search input value              |
| `isSearching`        | `boolean`                                                      | No       | Loading state indicator                    |
| `placeholder`        | `string`                                                       | No       | Custom placeholder text                    |
| `onSearch`           | `(query: string, filters?: Filter[]) => Promise<void> \| void` | Yes      | Search handler                             |
| `onFilterChange`     | `(filters: Filter[]) => Promise<void> \| void`                 | Yes      | Filter change handler                      |
| `onValueChange`      | `(value: string) => void`                                      | No       | Input value change handler                 |
| `showTypingPrompt`   | `boolean`                                                      | No       | Show typing prompt overlay (default: true) |
| `customTranslations` | `Record<string, string>`                                       | No       | Custom translation strings                 |
| `currency`           | `string`                                                       | No       | Currency code (default: "USD")             |
| `style`              | `CSSProperties`                                                | No       | Custom form styles                         |
| `inputStyle`         | `CSSProperties`                                                | No       | Custom input styles                        |
| `containerStyle`     | `CSSProperties`                                                | No       | Custom container styles                    |

## Filter Type

```typescript
type Filter = {
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
  priceRange?: { min?: number; max?: number };
  propertyType?: PropertyType;
  priceLevels?: PriceLevel[];
};
```

## Individual Components

You can also use individual components separately:

### FilterChips

```tsx
import { FilterChips } from "@mapfirst.ai/react";

<FilterChips
  filters={filters}
  isPortrait={false}
  currency="USD"
  minRatingSuffix="+"
  clearAllLabel="Clear all"
  previousFiltersLabel="Previous"
  nextFiltersLabel="Next"
  formatCurrency={(value, currency) => `${currency}${value}`}
  onFilterChange={setFilters}
  onResetFilters={() => setFilters([])}
  onClearAll={() => setFilters([])}
/>;
```

### MinRatingFilterChip

```tsx
import { MinRatingFilterChip } from "@mapfirst.ai/react";

<MinRatingFilterChip
  rating={4.5}
  onChange={(newRating) => console.log(newRating)}
  onRemove={() => console.log("removed")}
  star={false} // Use circles instead of stars
/>;
```

### PriceRangeFilterChip

```tsx
import { PriceRangeFilterChip } from "@mapfirst.ai/react";

<PriceRangeFilterChip
  priceRange={{ min: 100, max: 500 }}
  currency="USD"
  onChange={(range) => console.log(range)}
  onRemove={() => console.log("removed")}
/>;
```

### RestaurantPriceLevelChip

```tsx
import { RestaurantPriceLevelChip } from "@mapfirst.ai/react";

<RestaurantPriceLevelChip
  values={["Cheap Eats", "Mid Range"]}
  onChange={(levels) => console.log(levels)}
  onRemove={() => console.log("removed")}
/>;
```

### TransformedQueryChip

```tsx
import { TransformedQueryChip } from "@mapfirst.ai/react";

<TransformedQueryChip
  value="hotels near beach"
  onChange={(newValue) => console.log(newValue)}
  onRemove={() => console.log("removed")}
/>;
```

## Hooks

### useTranslation

```tsx
import { useTranslation } from "@mapfirst.ai/react";

const { t, formatCurrency, locale, setLocale } = useTranslation();

// Use translation
const text = t("smartFilter.placeholder");

// Format currency
const formatted = formatCurrency(100, "USD"); // "$100"
```

### useIsPortrait

```tsx
import { useIsPortrait } from "@mapfirst.ai/react";

const isPortrait = useIsPortrait();
```

### useFilterScroll

```tsx
import { useFilterScroll } from "@mapfirst.ai/react";

const { scrollerRef, atStart, atEnd, scrollByDir } = useFilterScroll(
  filters.length
);

<div ref={scrollerRef}>{/* scrollable content */}</div>;
```

## Customization

All components use native React styles (CSS-in-JS) making them highly customizable:

```tsx
<SmartFilter
  mapFirst={mapFirst}
  filters={filters}
  onSearch={handleSearch}
  onFilterChange={setFilters}
  style={{
    padding: "20px",
    backgroundColor: "#f5f5f5",
  }}
  inputStyle={{
    fontSize: "18px",
    color: "#333",
  }}
  containerStyle={{
    maxWidth: "800px",
    margin: "0 auto",
  }}
/>
```

## Custom Translations

```tsx
const customTranslations = {
  "smartFilter.placeholder": "Search for places...",
  "smartFilter.clearAll": "Remove all filters",
  "smartFilter.minRating.suffix": " stars minimum",
};

<SmartFilter
  mapFirst={mapFirst}
  filters={filters}
  onSearch={handleSearch}
  onFilterChange={setFilters}
  customTranslations={customTranslations}
/>;
```

## Icons

All icons are exported and can be used independently:

```tsx
import {
  SearchIcon,
  CloseIcon,
  EditIcon,
  NextIcon,
  AiIcon,
  StarIcon,
} from "@mapfirst.ai/react";

<SearchIcon style={{ width: "24px", height: "24px", color: "blue" }} />;
```

## Utilities

```tsx
import {
  renderStars,
  createMinRatingFilterLabel,
  formatRatingValue,
  createPriceRangeFilterLabel,
} from "@mapfirst.ai/react";

// Render star rating visualization
const stars = renderStars(4.5);

// Create rating label
const label = createMinRatingFilterLabel(4.5, "+");

// Format rating value
const formatted = formatRatingValue(4.5); // "4.5"
```

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type {
  SmartFilterProps,
  Filter,
  PriceRangeValue,
  FilterChipsProps,
  ChipProps,
  IconProps,
} from "@mapfirst.ai/react";
```
