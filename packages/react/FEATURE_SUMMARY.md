# React Search Hooks - Feature Summary

## Overview

Added two new React hooks to the `@mapfirst/react` package that provide easy access to the MapFirst SDK's search functionality:

1. **`usePropertiesSearch`** - For location-based property searches
2. **`useSmartFilterSearch`** - For natural language and filter-based searches

## New Hooks

### `usePropertiesSearch(mapFirst)`

Provides access to location-based property search functionality.

**Returns:**

```typescript
{
  search: (options: {
    body: InitialRequestBody;
    beforeApplyProperties?: (data: any) => { price?: any; limit?: number };
    smartFiltersClearable?: boolean;
  }) => Promise<APIResponse | null>;
  isLoading: boolean;
  error: Error | null;
}
```

**Usage:**

```tsx
const { search, isLoading, error } = usePropertiesSearch(mapFirst);

await search({
  body: {
    city: "Paris",
    country: "France",
    filters: {
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 86400000 * 3),
      numAdults: 2,
      numRooms: 1,
      currency: "EUR",
    },
  },
});
```

### `useSmartFilterSearch(mapFirst)`

Provides access to natural language query and filter-based search.

**Returns:**

```typescript
{
  search: (options: {
    query?: string;
    filters?: SmartFilter[];
    onProcessFilters?: (
      filters: any,
      location_id?: number
    ) => {
      smartFilters?: SmartFilter[];
      price?: any;
      limit?: number;
      language?: string;
    };
  }) => Promise<APIResponse | null>;
  isLoading: boolean;
  error: Error | null;
}
```

**Usage:**

```tsx
const { search, isLoading, error } = useSmartFilterSearch(mapFirst);

// Natural language search
await search({ query: "hotels near beach with pool" });

// Or with filters
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
```

## Features

### Built-in State Management

- **Loading State**: Both hooks provide an `isLoading` boolean that automatically tracks search progress
- **Error Handling**: Automatic error capture and storage in the `error` state
- **React Integration**: All state changes trigger re-renders automatically

### Integration with Existing Hooks

Works seamlessly with `useMapFirstCore`:

```tsx
const { mapFirst, state } = useMapFirstCore({ ... });
const { search, isLoading, error } = usePropertiesSearch(mapFirst);

// state.properties updates automatically when search completes
console.log(state?.properties);
```

### TypeScript Support

Full type definitions for all parameters and return values:

- `InitialRequestBody` - Type for location-based search parameters
- `SmartFilter` - Type for filter definitions
- All callbacks and options are properly typed

## Files Modified

1. **packages/react/src/index.tsx**

   - Added `usePropertiesSearch` hook
   - Added `useSmartFilterSearch` hook
   - Added necessary type definitions for TypeScript support

2. **packages/react/README.md**

   - Added documentation for both new hooks
   - Added usage examples with complete code samples

3. **packages/react/EXAMPLES.md**

   - Added "Search Hooks Examples" section
   - Added "Location Search Example" with full implementation
   - Added "Smart Filter Search Example" with natural language queries
   - Added "Combined Search" example showing both approaches

4. **packages/react/SEARCH_HOOKS_EXAMPLE.md** (new file)
   - Comprehensive examples with complete component implementations
   - Includes BasicSearchExample, SmartSearchExample, and CombinedSearchInterface
   - Shows real-world usage patterns with forms, error handling, and map integration

## Example Integration

```tsx
import React, { useState } from "react";
import {
  useMapFirstCore,
  usePropertiesSearch,
  useSmartFilterSearch,
} from "@mapfirst/react";

function HotelSearch() {
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const propertiesSearch = usePropertiesSearch(mapFirst);
  const smartSearch = useSmartFilterSearch(mapFirst);

  const handleLocationSearch = async () => {
    await propertiesSearch.search({
      body: {
        city: "New York",
        country: "United States",
        filters: {
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 86400000 * 3),
          numAdults: 2,
          numRooms: 1,
          currency: "USD",
        },
      },
    });
  };

  const handleSmartSearch = async () => {
    await smartSearch.search({ query });
  };

  return (
    <div>
      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hotels..."
        />
        <button onClick={handleSmartSearch} disabled={smartSearch.isLoading}>
          {smartSearch.isLoading ? "Searching..." : "Smart Search"}
        </button>
        <button
          onClick={handleLocationSearch}
          disabled={propertiesSearch.isLoading}
        >
          {propertiesSearch.isLoading ? "Searching..." : "Location Search"}
        </button>
      </div>

      {(propertiesSearch.error || smartSearch.error) && (
        <div>
          Error: {(propertiesSearch.error || smartSearch.error)?.message}
        </div>
      )}

      <div>Found {state?.properties.length || 0} properties</div>
    </div>
  );
}
```

## Benefits

1. **Simplified API**: Hooks provide a cleaner, more React-idiomatic way to trigger searches
2. **Automatic State Management**: Loading and error states are automatically managed
3. **Type Safety**: Full TypeScript support ensures correct usage at compile time
4. **Flexible**: Supports both location-based and natural language searches
5. **Composable**: Can be combined with other MapFirst hooks for complete functionality
6. **Error Resilient**: Built-in error handling and propagation

## Backward Compatibility

These new hooks are additions to the existing API and do not break any existing functionality. All existing hooks and methods continue to work as before:

- `useMapFirstCore` - Still the primary hook for creating SDK instances
- `useMapLibreAttachment` / `useGoogleMapsAttachment` / `useMapboxAttachment` - Still used for map integration
- `usePrimaryType`, `useSelectedMarker`, etc. - All existing utility hooks remain unchanged

Direct SDK method calls (`mapFirst.runPropertiesSearch()`, `mapFirst.runSmartFilterSearch()`) continue to work for users who prefer the imperative API.
