---
sidebar_position: 1
---

# Searching for Properties

MapFirst SDK gives you three powerful ways to search for properties — each designed for different user experiences. This guide covers all three with complete code examples.

:::tip Which search method should I use?

- **Properties Search** — Best for structured forms where users pick a city, dates, and filters.
- **Smart Filter Search** — Best for search bars where users type natural language queries like _"romantic hotels near the beach."_
- **Bounds Search** — Best for "search this area" buttons that re-query based on the visible map.
  :::

---

## Properties Search

The most common search method. Specify a city and country, along with optional date and guest filters, and the SDK returns matching properties.

### React Example

```typescript
import { useMapFirst } from "@mapfirst.ai/react";

function SearchComponent() {
  const { propertiesSearch, state } = useMapFirst({
    apiKey: "your-api-key",
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
  apiKey: "your-api-key",
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

---

## Smart Filter Search

Smart Filter Search uses AI to parse natural language queries into structured filters. Type something like _"boutique hotels with rooftop bar near the river"_ and the SDK will extract the right filters automatically.

:::info How it works
When you call `smartFilterSearch()`, the SDK sends your query to the MapFirst AI backend. The response includes both matching properties **and** a set of filter objects that you can display as interactive chips using the [SmartFilter component](../components/smart-filter).
:::

### React Example

```typescript
import { useState } from "react";
import {
  useMapFirst,
  SmartFilter,
  Filter,
  processApiFilters,
  convertToApiFilters,
} from "@mapfirst.ai/react";

function SmartSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);

  const { smartFilterSearch, state } = useMapFirst({
    apiKey: "your-api-key",
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

      await smartFilterSearch({
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

    if (searchQuery && !state.isSearching) {
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
          isSearching={state.isSearching}
          onFilterChange={handleFilterChange}
          currency="JPY"
        />
      )}

      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

### JavaScript Example

```javascript
mapFirst.runSmartFilterSearch({
  query: "boutique hotels near the river",
});
```

:::tip Want interactive filter chips?
Pair Smart Filter Search with the [SmartFilter component](../components/smart-filter) to display AI-generated filters as toggleable chips that users can modify in real time.
:::

---

## Bounds Search

Bounds Search queries properties within the current visible area of the map. This is perfect for a "Search this area" button that appears when users pan or zoom the map.

### React Example

```typescript
function BoundsSearch() {
  const { boundsSearch, state } = useMapFirst({
    apiKey: "your-api-key",
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

---

## Filtering by Property Type

Switch between hotels, restaurants, and attractions. Changing the property type updates the markers on the map immediately.

### React Example

```typescript
function TypeFilter() {
  const { setPrimaryType, state } = useMapFirst({
    apiKey: "your-api-key",
  });

  return (
    <div>
      <button onClick={() => setPrimaryType("Accommodation")}>Hotels</button>
      <button onClick={() => setPrimaryType("Eat & Drink")}>Restaurants</button>
      <button onClick={() => setPrimaryType("Attraction")}>Attractions</button>
      <p>Current: {state.primary}</p>
    </div>
  );
}
```

### JavaScript Example

```javascript
mapFirst.setPrimaryType("Eat & Drink");
```

---

## Handling Search Results

Once a search completes, the `state.properties` array contains all matching results. Here's how to display and filter them.

### Display Results

```typescript
function SearchResults() {
  const { state } = useMapFirst({
    apiKey: "your-api-key",
  });

  if (state.isSearching) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Found {state.properties.length} properties</h3>
      <ul>
        {state.properties.map((property) => (
          <li key={property.tripadvisor_id}>
            {property.name} - {property.rating}/5
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Filter Results Locally

You can also filter properties on the client side without making another API call:

```typescript
function FilteredResults() {
  const { state } = useMapFirst({
    apiKey: "your-api-key",
  });

  // Filter by rating
  const highRated = state.properties.filter((p) => p.rating >= 4.5);

  return (
    <div>
      <h3>High Rated ({highRated.length})</h3>
    </div>
  );
}
```

---

## Advanced Search Patterns

These patterns help you build more polished, production-ready search experiences.

### Debounced Search

Avoid making an API call on every keystroke — wait until the user stops typing:

```typescript
import { useState, useEffect } from "react";

function DebouncedSearch() {
  const { smartFilterSearch } = useMapFirst({

    apiKey: "your-api-key",
  });
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

Automatically re-search whenever the user pans or zooms the map:

```typescript
function AutoSearch() {
  const { boundsSearch, attachMapLibre } = useMapFirst({

    apiKey: "your-api-key",
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [0, 0],
      zoom: 2,
    });

    map.on("load", () => {
      attachMapLibre(map, maplibregl, {});

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

---

## Best Practices

:::caution Avoid excessive API calls
Always debounce user-triggered searches (especially on keystroke or map move) and disable the search button while `state.isSearching` is `true`. This prevents duplicate requests and unexpected behavior.
:::

1. **Always handle loading states** — Show a spinner or disable the button during searches so users know something is happening.
2. **Debounce user input** — Wait 300–500ms after the last keystroke before firing a smart search.
3. **Cache results** — Store previous searches when appropriate to avoid redundant API calls.
4. **Handle errors gracefully** — Use the `onError` callback or a try/catch block to surface meaningful error messages.
5. **Validate dates** — Ensure check-in is before check-out, and both are in the future.
6. **Use bounds search wisely** — Show a "Search this area" button when `state.pendingBounds` is set, rather than auto-searching on every pan.

---

## Next Steps

- **[useMapFirst API](../api/use-mapfirst)** — Full hook reference with all parameters and return values.
- **[MapFirstCore API](../api/core)** — Core class docs for vanilla JavaScript.
- **[SmartFilter Component](../components/smart-filter)** — Display AI-generated filter chips.
- **[Custom POIs](./custom-pois)** — Search by coordinates, radius, or bounds.
- **[Basic Map Example](../examples/basic-map)** — A complete, copy-paste example.
