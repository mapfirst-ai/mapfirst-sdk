---
sidebar_position: 1
---

# SmartFilter Component

The `SmartFilter` component provides an elegant way to display and manage filter chips after performing an AI-powered search. It shows active filters as interactive chips that users can modify or remove.

## Installation

The SmartFilter component is included in the `@mapfirst.ai/react` package:

```bash
npm install @mapfirst.ai/react
```

## Basic Usage

```tsx
import { useState } from "react";
import { SmartFilter, Filter, useMapFirst } from "@mapfirst.ai/react";

function MyComponent() {
  const [filters, setFilters] = useState<Filter[]>([]);

  const {
    instance: mapFirst,
    state,
    smartFilterSearch,
  } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  const handleFilterChange = async (updatedFilters: Filter[]) => {
    setFilters(updatedFilters);

    // Re-run search with updated filters
    if (searchQuery) {
      await smartFilterSearch.search({
        query: searchQuery,
        filters: convertToApiFilters(updatedFilters),
      });
    }
  };

  return (
    <div>
      {filters.length > 0 && (
        <SmartFilter
          filters={filters}
          isSearching={state?.isSearching}
          onFilterChange={handleFilterChange}
          currency="EUR"
        />
      )}
    </div>
  );
}
```

## Props

### `filters` (required)

- **Type:** `Filter[]`
- **Description:** Array of active filter objects to display as chips

```tsx
interface Filter {
  type: string;
  label: string;
  value: any;
  // Additional properties based on filter type
}
```

### `isSearching`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Indicates if a search is currently in progress. When true, filter modifications are disabled to prevent conflicts.

### `onFilterChange` (required)

- **Type:** `(filters: Filter[]) => Promise<void> | void`
- **Description:** Callback function called when filters are modified. Receives the updated filters array.

```tsx
const handleFilterChange = async (updatedFilters: Filter[]) => {
  setFilters(updatedFilters);
  // Optionally trigger a new search
};
```

### `customTranslations`

- **Type:** `Record<string, string>`
- **Description:** Custom translations for filter labels and UI text

### `currency`

- **Type:** `string`
- **Default:** `"USD"`
- **Description:** Currency code for displaying price filters (e.g., "USD", "EUR", "GBP")

### `style`

- **Type:** `CSSProperties`
- **Description:** Custom styles for the component wrapper

### `containerStyle`

- **Type:** `CSSProperties`
- **Description:** Custom styles for the container element

## Complete Example with Search

Here's a complete example showing SmartFilter integrated with search functionality:

```tsx
import { useState, useCallback } from "react";
import {
  useMapFirst,
  SmartFilter,
  Filter,
  processApiFilters,
  convertToApiFilters,
} from "@mapfirst.ai/react";

function SearchWithFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);

  const {
    instance: mapFirst,
    state,
    smartFilterSearch,
  } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // Handle search
  const handleSearch = async (query: string, currentFilters?: Filter[]) => {
    if (!query.trim()) return;

    try {
      const apiFilters = currentFilters
        ? convertToApiFilters(currentFilters)
        : undefined;

      await smartFilterSearch.search({
        query: query.trim(),
        filters: apiFilters,
        onProcessFilters: (responseFilters) => {
          // Process API response and convert to Filter objects
          const newFilters =
            currentFilters || processApiFilters(responseFilters);

          if (!currentFilters) {
            setFilters(newFilters);
          }

          return {
            smartFilters: convertToApiFilters(newFilters),
            price: responseFilters.price,
            limit: responseFilters.limit ?? 30,
            language: responseFilters.language,
          };
        },
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (updatedFilters: Filter[]) => {
    setFilters(updatedFilters);

    if (state?.isSearching) {
      return;
    }

    // Re-run search with updated filters
    if (searchQuery) {
      await handleSearch(searchQuery, updatedFilters);
    }
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search hotels..."
      />
      <button onClick={() => handleSearch(searchQuery)}>Search</button>

      {/* Filter Chips */}
      {filters.length > 0 && (
        <SmartFilter
          filters={filters}
          isSearching={state?.isSearching}
          onFilterChange={handleFilterChange}
          currency="EUR"
        />
      )}

      {/* Results */}
      <div>
        {state?.properties?.map((property) => (
          <div key={property.id}>
            <h3>{property.name}</h3>
            <p>Rating: {property.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Filter Types

The SmartFilter component supports various filter types:

### Price Range

```tsx
{
  type: "price",
  label: "Price",
  value: { min: 100, max: 300 }
}
```

### Rating

```tsx
{
  type: "rating",
  label: "Rating",
  value: 4 // Minimum rating
}
```

### Amenities

```tsx
{
  type: "amenity",
  label: "Pool",
  value: "pool"
}
```

### Property Type

```tsx
{
  type: "propertyType",
  label: "Hotel",
  value: "hotel"
}
```

## Styling

### Custom Styles

```tsx
<SmartFilter
  filters={filters}
  onFilterChange={handleFilterChange}
  currency="USD"
  containerStyle={{
    padding: "16px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  }}
  style={{
    gap: "12px",
  }}
/>
```

### Custom Translations

```tsx
<SmartFilter
  filters={filters}
  onFilterChange={handleFilterChange}
  customTranslations={{
    "smartFilter.clearAll": "Clear Filters",
    "smartFilter.minRating.suffix": "+ stars",
    "smartFilter.nav.previous": "Back",
    "smartFilter.nav.next": "More",
  }}
/>
```

## Best Practices

1. **Conditional Rendering**: Only render SmartFilter when there are active filters
2. **Disable During Search**: Use `isSearching` prop to prevent modifications during active searches
3. **Persist State**: Store filters in state to maintain them across re-renders
4. **Re-run Searches**: Trigger a new search when filters change to update results
5. **Currency Consistency**: Use the same currency across your application

## See Also

- [useMapFirst Hook](../api/use-mapfirst) - Main React hook for MapFirst SDK
- [Searching Guide](../guides/searching) - Learn about smart search functionality
