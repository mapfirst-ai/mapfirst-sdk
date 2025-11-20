# React SDK Examples

## Complete Example with Reactive State

```tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  usePrimaryType,
  useSelectedMarker,
} from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

function HotelSearchApp() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Create SDK instance with reactive state
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
    callbacks: {
      onError: (error, context) => {
        console.error(`Error in ${context}:`, error);
      },
    },
  });

  // Use dedicated hooks for controlling state
  const [primaryType, setPrimaryType] = usePrimaryType(mapFirst);
  const [selectedMarker, setSelectedMarker] = useSelectedMarker(mapFirst);

  // Access reactive state
  const properties = state?.properties || [];
  const isSearching = state?.isSearching || false;
  const filters = state?.filters;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Attach map to SDK
  useMapLibreAttachment({
    mapFirst,
    map,
    maplibregl,
    onMarkerClick: (marker) => {
      console.log("Clicked:", marker.name);
    },
  });

  // Handle search
  const handleSearch = async () => {
    if (!mapFirst) return;

    await mapFirst.runPropertiesSearch({
      body: {
        city: "Paris",
        country: "France",
        filters: {
          checkIn: "2024-06-01",
          checkOut: "2024-06-07",
          numAdults: 2,
          currency: "EUR",
        },
      },
    });
  };

  // Handle date change
  const handleDateChange = (checkIn: Date, checkOut: Date) => {
    if (!mapFirst) return;

    mapFirst.setFilters({
      ...filters,
      checkIn,
      checkOut,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Search Controls */}
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <h1>Hotel Search</h1>
        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </button>
        <p>
          {isSearching
            ? "Searching for properties..."
            : `Found ${properties.length} properties`}
        </p>
        {selectedId && <p>Selected Property ID: {selectedId}</p>}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Property List */}
      <div
        style={{
          maxHeight: "200px",
          overflow: "auto",
          background: "#fff",
          borderTop: "1px solid #ddd",
        }}
      >
        {properties.map((property) => (
          <div
            key={property.tripadvisor_id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              background:
                selectedId === property.tripadvisor_id
                  ? "#e3f2fd"
                  : "transparent",
              cursor: "pointer",
            }}
            onClick={() => {
              // Use the hook setter instead of calling the SDK method directly
              setSelectedMarker(property.tripadvisor_id);
              if (mapFirst && property.location) {
                mapFirst.flyMapTo(
                  property.location.lon,
                  property.location.lat,
                  14
                );
              }
            }}
          >
            <strong>{property.name}</strong>
            <br />
            {property.pricing && (
              <span>
                {property.pricing.isPending
                  ? "Loading price..."
                  : `$${property.pricing.lead_rate?.display_price}`}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelSearchApp;
```

## Using Dedicated Hooks for Performance

When you only need specific state values, use the dedicated hooks to avoid unnecessary re-renders:

```tsx
import React from "react";
import {
  useMapFirstCore,
  useMapFirstProperties,
  useMapFirstSelectedProperty,
} from "@mapfirst/react";

function PropertyStats() {
  const { mapFirst } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
    },
  });

  // Only re-renders when properties change
  const properties = useMapFirstProperties(mapFirst);

  // Only re-renders when selection changes
  const selectedId = useMapFirstSelectedProperty(mapFirst);

  const selectedProperty = properties.find(
    (p) => p.tripadvisor_id === selectedId
  );

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Properties: {properties.length}</p>
      <p>
        Accommodations:{" "}
        {properties.filter((p) => p.type === "Accommodation").length}
      </p>
      <p>
        Restaurants: {properties.filter((p) => p.type === "Restaurant").length}
      </p>
      <p>
        Attractions: {properties.filter((p) => p.type === "Attraction").length}
      </p>

      {selectedProperty && (
        <div>
          <h3>Selected</h3>
          <p>{selectedProperty.name}</p>
          <p>{selectedProperty.type}</p>
        </div>
      )}
    </div>
  );
}
```

## Combining Multiple State Sources

```tsx
import React, { useState } from "react";
import { useMapFirstCore } from "@mapfirst/react";

function AdvancedSearch() {
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "London",
      country: "United Kingdom",
      currency: "GBP",
    },
  });

  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // SDK reactive state
  const properties = state?.properties || [];
  const isSearching = state?.isSearching || false;
  const filters = state?.filters;

  // Computed values
  const filteredProperties = properties.filter((p) => {
    if (!p.pricing?.lead_rate?.display_price) return true;
    const price = p.pricing.lead_rate.display_price;
    return price >= priceRange.min && price <= priceRange.max;
  });

  const handleApplyFilters = async () => {
    if (!mapFirst) return;

    await mapFirst.runPropertiesSearch({
      body: {
        city: "London",
        country: "United Kingdom",
        filters: {
          ...filters,
          min_price: priceRange.min,
          max_price: priceRange.max,
        },
      },
    });
  };

  return (
    <div>
      <button onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide" : "Show"} Filters
      </button>

      {showFilters && (
        <div>
          <label>
            Min Price: ${priceRange.min}
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  min: parseInt(e.target.value),
                })
              }
            />
          </label>

          <label>
            Max Price: ${priceRange.max}
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: parseInt(e.target.value),
                })
              }
            />
          </label>

          <button onClick={handleApplyFilters} disabled={isSearching}>
            Apply Filters
          </button>
        </div>
      )}

      <p>
        Showing {filteredProperties.length} of {properties.length} properties
        {isSearching && " (searching...)"}
      </p>

      {filteredProperties.map((property) => (
        <div key={property.tripadvisor_id}>{property.name}</div>
      ))}
    </div>
  );
}
```

## Real-time Updates

The reactive state automatically updates when:

- Properties are loaded or updated
- A property is selected/deselected
- Filters are changed
- Search state changes (loading, searching, etc.)
- Map bounds change
- Primary type changes

```tsx
function RealTimeUpdates() {
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "Tokyo",
      country: "Japan",
    },
  });

  // These values update automatically
  const properties = state?.properties || [];
  const isSearching = state?.isSearching || false;
  const selectedId = state?.selectedPropertyId;
  const bounds = state?.bounds;
  const center = state?.center;
  const zoom = state?.zoom;

  // Display real-time updates
  return (
    <div>
      <h2>Real-time State</h2>
      <pre>
        {JSON.stringify(
          {
            propertyCount: properties.length,
            isSearching,
            selectedId,
            bounds,
            center,
            zoom,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
```

## Search Hooks Examples

### Using `usePropertiesSearch` for Location-Based Search

```tsx
import React, { useState } from "react";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  usePropertiesSearch,
} from "@mapfirst/react";
import maplibregl from "maplibre-gl";

function LocationSearchExample() {
  const [city, setCity] = useState("Paris");
  const [country, setCountry] = useState("France");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: { city, country, currency: "USD" },
  });

  const { search, isLoading, error } = usePropertiesSearch(mapFirst);

  const handleSearch = async () => {
    try {
      await search({
        body: {
          city,
          country,
          filters: {
            checkIn: new Date("2024-06-01"),
            checkOut: new Date("2024-06-07"),
            numAdults: 2,
            numRooms: 1,
            currency: "USD",
          },
        },
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div>
      <div>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      <div>Found {state?.properties.length || 0} properties</div>
    </div>
  );
}
```

### Using `useSmartFilterSearch` for Natural Language Queries

```tsx
import React, { useState } from "react";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  useSmartFilterSearch,
} from "@mapfirst/react";
import maplibregl from "maplibre-gl";

function SmartSearchExample() {
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const { search, isLoading, error } = useSmartFilterSearch(mapFirst);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      await search({ query });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const exampleQueries = [
    "Hotels near Times Square with free wifi",
    "4-star hotels with pool and gym",
    "Budget hotels under $150",
    "Luxury hotels with spa",
  ];

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: hotels near beach with pool"
          style={{ width: "400px", padding: "8px" }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <strong>Try these examples:</strong>
        <ul>
          {exampleQueries.map((q) => (
            <li key={q}>
              <button
                onClick={() => {
                  setQuery(q);
                  search({ query: q });
                }}
                disabled={isLoading}
                style={{ textAlign: "left", padding: "4px 8px" }}
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Error: {error.message}
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        {isLoading ? (
          <p>Searching...</p>
        ) : (
          <p>Found {state?.properties.length || 0} properties</p>
        )}
      </div>
    </div>
  );
}
```

### Combined Search with Filters

```tsx
import React, { useState } from "react";
import {
  useMapFirstCore,
  usePropertiesSearch,
  useSmartFilterSearch,
} from "@mapfirst/react";

type SearchMode = "location" | "smart";

function CombinedSearchExample() {
  const [mode, setMode] = useState<SearchMode>("location");
  const [city, setCity] = useState("Los Angeles");
  const [country, setCountry] = useState("United States");
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: { city, country, currency: "USD" },
  });

  const propertiesSearch = usePropertiesSearch(mapFirst);
  const smartSearch = useSmartFilterSearch(mapFirst);

  const currentSearch = mode === "location" ? propertiesSearch : smartSearch;

  const handleLocationSearch = async () => {
    try {
      await propertiesSearch.search({
        body: {
          city,
          country,
          filters: {
            checkIn: new Date("2024-06-01"),
            checkOut: new Date("2024-06-07"),
            numAdults: 2,
            numRooms: 1,
            currency: "USD",
          },
        },
      });
    } catch (err) {
      console.error("Location search failed:", err);
    }
  };

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
    try {
      await smartSearch.search({ query });
    } catch (err) {
      console.error("Smart search failed:", err);
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            checked={mode === "location"}
            onChange={() => setMode("location")}
          />
          Location Search
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            checked={mode === "smart"}
            onChange={() => setMode("smart")}
          />
          Smart Search
        </label>
      </div>

      {mode === "location" ? (
        <div style={{ marginTop: "10px" }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            style={{ marginLeft: "10px" }}
          />
          <button
            onClick={handleLocationSearch}
            disabled={currentSearch.isLoading}
          >
            Search
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "10px" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            style={{ width: "400px" }}
          />
          <button
            onClick={handleSmartSearch}
            disabled={currentSearch.isLoading}
          >
            Search
          </button>
        </div>
      )}

      {currentSearch.error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Error: {currentSearch.error.message}
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        {currentSearch.isLoading ? (
          <p>Searching...</p>
        ) : (
          <p>Found {state?.properties.length || 0} properties</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Results:</h3>
        <ul>
          {state?.properties.slice(0, 5).map((property) => (
            <li key={property.tripadvisor_id}>
              <strong>{property.name}</strong>
              {property.pricing && (
                <span> - ${property.pricing.display_price}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## TypeScript Usage

Full type safety with TypeScript:

```tsx
import React from "react";
import { useMapFirstCore } from "@mapfirst/react";
import type { Property, MapState, FilterState } from "@mapfirst/core";

function TypeSafeComponent() {
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // All properly typed
  const properties: Property[] = state?.properties || [];
  const mapState: MapState | null = state;
  const filters: FilterState | undefined = state?.filters;

  // Type-safe property access
  const handlePropertyClick = (property: Property) => {
    if (mapFirst && property.location) {
      mapFirst.flyMapTo(property.location.lon, property.location.lat, 14);
    }
  };

  return (
    <div>
      {properties.map((property) => (
        <button
          key={property.tripadvisor_id}
          onClick={() => handlePropertyClick(property)}
        >
          {property.name}
        </button>
      ))}
    </div>
  );
}
```
