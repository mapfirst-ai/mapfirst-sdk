---
sidebar_position: 1
---

# SmartFilter Component

The `SmartFilter` component renders AI-generated search filters as interactive, toggleable chips. After a user performs a natural language search (e.g., *"hotels near the beach with a pool"*), the SDK extracts structured filters — and this component displays them in a clean, user-friendly UI that lets users modify or remove individual filters in real time.

:::tip When to use this
Use `SmartFilter` whenever you're using the `smartFilterSearch` method. It turns the raw filter data from the AI response into a polished set of chips that your users can interact with — no custom UI work needed.
:::

---

## Installation

The `SmartFilter` component is included in the `@mapfirst.ai/react` package:

```bash
npm install @mapfirst.ai/react
```

---

## Basic Usage

Here's the minimal setup — render the component when filters are available, and pass a callback to handle changes:

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
      await smartFilterSearch({
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

---

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

---

### `isSearching`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Indicates if a search is currently in progress. When true, filter modifications are disabled to prevent conflicts.

---

### `onFilterChange` (required)

- **Type:** `(filters: Filter[]) => Promise<void> | void`
- **Description:** Callback function called when filters are modified. Receives the updated filters array.

```tsx
const handleFilterChange = async (updatedFilters: Filter[]) => {
  setFilters(updatedFilters);
  // Optionally trigger a new search
};
```

---

### `customTranslations`

- **Type:** `Record<string, string>`
- **Description:** Custom translations for filter labels and UI text

---

### `currency`

- **Type:** `string`
- **Default:** `"USD"`
- **Description:** Currency code for displaying price filters (e.g., "USD", "EUR", "GBP")

---

### `style`

- **Type:** `CSSProperties`
- **Description:** Custom styles for the component wrapper

---

### `containerStyle`

- **Type:** `CSSProperties`
- **Description:** Custom styles for the container element

---

## Complete Example with Search

Here's a full example showing `SmartFilter` integrated with AI search. The filters appear after the first search and update the results when modified:

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

      await smartFilterSearch({
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

---

## Filter Types

The `SmartFilter` component supports various filter types. These are generated automatically by the AI search engine — you don't need to create them manually:

### Price Range

```tsx
{
  type: "price",
  label: "Price",
  value: { min: 100, max: 300 }
}
```

---

### Rating

```tsx
{
  type: "rating",
  label: "Rating",
  value: 4 // Minimum rating
}
```

---

### Amenities

```tsx
{
  type: "amenity",
  label: "Pool",
  value: "pool"
}
```

---

### Property Type

```tsx
{
  type: "propertyType",
  label: "Hotel",
  value: "hotel"
}
```

---

## Styling

### Custom Styles

Override the component's default look by passing inline styles:

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

---

### Custom Translations

Override the default English labels for internationalization or branding:

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

---

## Best Practices

:::caution Don't forget to disable during search
Always pass `isSearching={state?.isSearching}` to prevent users from modifying filters while a search is in progress. Changing filters mid-search can cause race conditions and unexpected results.
:::

1. **Conditional Rendering** — Only render `SmartFilter` when `filters.length > 0`. This avoids showing an empty container before the first search.
2. **Disable During Search** — Use the `isSearching` prop to prevent modifications during active searches.
3. **Persist State** — Store filters in React state to maintain them across re-renders and component updates.
4. **Re-run Searches on Change** — Trigger a new search in your `onFilterChange` callback so results update immediately when a user removes or toggles a filter.
5. **Currency Consistency** — Use the same `currency` value here as you do in your search parameters. Mismatched currencies will cause confusing price filter labels.

---

## Next Steps

- **[useMapFirst Hook](../api/use-mapfirst)** — Full hook reference, including `smartFilterSearch`.
- **[Searching Guide](../guides/searching)** — Learn all three search methods, including smart search.
- **[Smart Filter Search Example](../examples/smart-filter-search)** — Complete, copy-paste example with filters and a map.
- **[Fetching Images](../guides/fetching-images)** — Display property photos alongside your filter results.
