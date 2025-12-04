---
sidebar_position: 1
---

# Searching for Properties

Learn how to implement different types of searches in MapFirst SDK.

## Types of Searches

MapFirst SDK supports three types of searches:

1. **Properties Search** - Location-based search with filters
2. **Smart Filter Search** - AI-powered natural language search
3. **Bounds Search** - Search within visible map area

## Properties Search

Search by city, country, and various filters.

### React Example

```typescript
import { useMapFirst } from "@mapfirst/react";

function SearchComponent() {
  const { propertiesSearch, state } = useMapFirst({
    adapter: null,
    environment: "prod",
  });

  const handleSearch = async () => {
    await propertiesSearch({
      body: {
        city: "Barcelona",
        country: "Spain",
        filters: {
          checkIn: "2024-08-01",
          checkOut: "2024-08-07",
          numAdults: 2,
          numRooms: 1,
          currency: "EUR",
          minPrice: 50,
          maxPrice: 200,
        },
      },
    });
  };

  return (
    <div>
      <button onClick={handleSearch}>Search Barcelona</button>
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

### JavaScript Example

```javascript
const mapFirst = new MapFirstCore({
  adapter: null,
  callbacks: {
    onPropertiesChange: (properties) => {
      console.log("Found:", properties.length);
    },
  },
});

mapFirst.runPropertiesSearch({
  body: {
    city: "Barcelona",
    country: "Spain",
    filters: {
      checkIn: "2024-08-01",
      checkOut: "2024-08-07",
      numAdults: 2,
      currency: "EUR",
    },
  },
});
```

## Smart Filter Search

Use natural language to search for properties with AI-powered filters.

### React Example

```typescript
import { useState } from "react";
import {
  useMapFirst,
  SmartFilter,
  Filter,
  processApiFilters,
  convertToApiFilters,
} from "@mapfirst/react";

function SmartSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);

  const { smartFilterSearch, state } = useMapFirst({
    adapter: null,
    environment: "prod",
    initialLocationData: {
      city: "Tokyo",
      country: "Japan",
      currency: "JPY",
    },
  });

  const handleSmartSearch = async (
    query: string,
    currentFilters?: Filter[]
  ) => {
    if (!query.trim()) return;

    try {
      const apiFilters = currentFilters
        ? convertToApiFilters(currentFilters)
        : undefined;

      await smartFilterSearch.search({
        query: query.trim(),
        filters: apiFilters,
        onProcessFilters: (responseFilters) => {
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

  const handleFilterChange = async (updatedFilters: Filter[]) => {
    setFilters(updatedFilters);

    if (searchQuery && !state?.isSearching) {
      await handleSmartSearch(searchQuery, updatedFilters);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search hotels..."
      />
      <button onClick={() => handleSmartSearch(searchQuery)}>Search</button>

      {/* Display filter chips */}
      {filters.length > 0 && (
        <SmartFilter
          filters={filters}
          isSearching={state?.isSearching}
          onFilterChange={handleFilterChange}
          currency="JPY"
        />
      )}

      <p>Found {state?.properties?.length || 0} properties</p>
    </div>
  );
}
```

### JavaScript Example

```javascript
mapFirst.runSmartFilterSearch({
  query: "boutique hotels near the river",
  city: "Prague",
  country: "Czech Republic",
});
```

For more details on the SmartFilter component, see the [SmartFilter Component Guide](../components/smart-filter).

## Bounds Search

Search within the current map viewport.

### React Example

```typescript
function BoundsSearch() {
  const { boundsSearch, state } = useMapFirst({
    adapter: null,
    environment: "prod",
  });

  return (
    <div>
      <button onClick={() => boundsSearch()} disabled={state.isSearching}>
        {state.isSearching ? "Searching..." : "Search This Area"}
      </button>
    </div>
  );
}
```

### JavaScript Example

```javascript
document.getElementById("search-btn").addEventListener("click", async () => {
  await mapFirst.performBoundsSearch();
});
```

## Filtering by Property Type

Switch between different property types.

### React Example

```typescript
function TypeFilter() {
  const { setPrimaryType, state } = useMapFirst({
    adapter: null,
    environment: "prod",
  });

  return (
    <div>
      <button onClick={() => setPrimaryType("Accommodation")}>Hotels</button>
      <button onClick={() => setPrimaryType("Restaurant")}>Restaurants</button>
      <button onClick={() => setPrimaryType("Attraction")}>Attractions</button>
      <p>Current: {state.primaryType}</p>
    </div>
  );
}
```

### JavaScript Example

```javascript
mapFirst.setPrimaryType("Restaurant");
```

## Handling Search Results

### Display Results

```typescript
function SearchResults() {
  const { state } = useMapFirst({
    adapter: null,
    environment: "prod",
  });

  if (state.isSearching) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Found {state.properties.length} properties</h3>
      <ul>
        {state.properties.map((property) => (
          <li key={property.id}>
            {property.name} - {property.rating}/5
            {property.price && ` - ${property.currency}${property.price}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Filter Results Locally

```typescript
function FilteredResults() {
  const { state } = useMapFirst({ adapter: null });

  // Filter by rating
  const highRated = state.properties.filter((p) => p.rating >= 4.5);

  // Filter by price
  const affordable = state.properties.filter((p) => p.price && p.price < 100);

  return (
    <div>
      <h3>High Rated ({highRated.length})</h3>
      <h3>Affordable ({affordable.length})</h3>
    </div>
  );
}
```

## Advanced Search Patterns

### Debounced Search

```typescript
import { useState, useEffect } from "react";

function DebouncedSearch() {
  const { smartFilterSearch } = useMapFirst({ adapter: null });
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 3) {
        smartFilterSearch({ query });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Search on Map Move

```typescript
function AutoSearch() {
  const { boundsSearch, attachMapLibre } = useMapFirst({ adapter: null });
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 0],
      zoom: 2,
    });

    map.on("load", () => {
      attachMapLibre(map, {});

      // Search when map movement ends
      map.on("moveend", () => {
        boundsSearch();
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapRef} style={{ height: "500px" }} />;
}
```

## Best Practices

1. **Always handle loading states** - Show feedback during searches
2. **Debounce user input** - Avoid excessive API calls
3. **Cache results** - Store previous searches when appropriate
4. **Handle errors** - Use `onError` callback to handle failures
5. **Validate dates** - Ensure check-in is before check-out
6. **Set appropriate zoom** - Use bounds search for detailed area exploration

## See Also

- [useMapFirst API](../api/use-mapfirst)
- [MapFirstCore API](../api/core)
- [Basic Map Example](../examples/basic-map)
