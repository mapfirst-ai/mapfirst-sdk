# Quick Reference: React Search Hooks

## Installation

```bash
npm install @mapfirst/react @mapfirst/core
```

## Basic Setup

```tsx
import {
  useMapFirstCore,
  usePropertiesSearch,
  useSmartFilterSearch,
} from "@mapfirst/react";

function MyComponent() {
  // 1. Initialize SDK
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // 2. Initialize search hooks
  const propertiesSearch = usePropertiesSearch(mapFirst);
  const smartSearch = useSmartFilterSearch(mapFirst);

  // 3. Use in your component
  // ...
}
```

## usePropertiesSearch

**Purpose:** Location-based property search (city, country, coordinates)

**Quick Example:**

```tsx
const { search, isLoading, error } = usePropertiesSearch(mapFirst);

const handleSearch = async () => {
  await search({
    body: {
      city: "Paris",
      country: "France",
      filters: {
        checkIn: new Date("2024-06-01"),
        checkOut: new Date("2024-06-07"),
        numAdults: 2,
        numRooms: 1,
        currency: "EUR",
      },
    },
  });
};
```

**Return Values:**

- `search`: Function to trigger search
- `isLoading`: Boolean indicating search in progress
- `error`: Error object if search failed, null otherwise

## useSmartFilterSearch

**Purpose:** Natural language queries or filter-based search

**Quick Example (Natural Language):**

```tsx
const { search, isLoading, error } = useSmartFilterSearch(mapFirst);

const handleSearch = async (query: string) => {
  await search({ query });
};

// Usage
handleSearch("hotels near beach with pool and spa");
```

**Quick Example (Filters):**

```tsx
const handleFilterSearch = async () => {
  await search({
    filters: [
      { id: "pool", label: "Pool", type: "amenity", value: "pool" },
      {
        id: "4star",
        label: "4 Star",
        type: "starRating",
        value: "4",
        numericValue: 4,
      },
    ],
  });
};
```

## Common Patterns

### 1. Search Button with Loading State

```tsx
<button onClick={handleSearch} disabled={isLoading}>
  {isLoading ? "Searching..." : "Search"}
</button>
```

### 2. Error Display

```tsx
{
  error && <div style={{ color: "red" }}>Error: {error.message}</div>;
}
```

### 3. Results Display

```tsx
const properties = state?.properties || [];

<div>Found {properties.length} properties</div>;
```

### 4. Combined with Other Hooks

```tsx
const { mapFirst, state } = useMapFirstCore({ ... });
const [primaryType, setPrimaryType] = usePrimaryType(mapFirst);
const { search, isLoading } = usePropertiesSearch(mapFirst);

// All work together seamlessly
```

## Complete Mini Example

```tsx
import React, { useState } from "react";
import { useMapFirstCore, useSmartFilterSearch } from "@mapfirst/react";

function HotelSearch() {
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const { search, isLoading, error } = useSmartFilterSearch(mapFirst);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await search({ query });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hotels..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div>Error: {error.message}</div>}

      <div>
        Found {state?.properties.length || 0} properties
        {state?.properties.map((p) => (
          <div key={p.tripadvisor_id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## API Quick Reference

### usePropertiesSearch Parameters

```typescript
search({
  body: {
    city?: string;              // e.g., "Paris"
    country?: string;           // e.g., "France"
    location_id?: number;       // Alternative to city/country
    longitude?: number;         // For coordinate-based search
    latitude?: number;
    radius?: number;            // Search radius in meters
    filters?: {
      checkIn: Date | string;   // Check-in date
      checkOut: Date | string;  // Check-out date
      numAdults: number;        // Number of adults
      numRooms: number;         // Number of rooms
      currency: string;         // e.g., "USD", "EUR"
    }
  }
})
```

### useSmartFilterSearch Parameters

```typescript
search({
  query?: string;               // Natural language query
  filters?: Array<{
    id: string;
    label: string;
    type: "amenity" | "hotelStyle" | "priceRange" | "minRating" | "starRating" | ...;
    value: string;
    numericValue?: number;
    priceRange?: { min: number; max?: number };
  }>
})
```

## Tips

1. **Always check if mapFirst exists** before calling search
2. **Use isLoading** to disable buttons and show loading states
3. **Handle errors gracefully** with the error object
4. **Access results** through `state.properties` from useMapFirstCore
5. **Combine hooks** for complete functionality (map attachment, search, state management)

## More Examples

See the following files for complete examples:

- `EXAMPLES.md` - Basic usage examples
- `SEARCH_HOOKS_EXAMPLE.md` - Complete component implementations
- `README.md` - Full API documentation
