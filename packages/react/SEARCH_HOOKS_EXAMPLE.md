# Search Hooks Examples

Complete examples showing how to use `usePropertiesSearch` and `useSmartFilterSearch` hooks.

## Basic Properties Search Example

```tsx
import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  usePropertiesSearch,
} from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

function BasicSearchExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Initialize MapFirst SDK
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // Initialize search hook
  const { search, isLoading, error } = usePropertiesSearch(mapFirst);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    mapInstance.on("load", () => setMap(mapInstance));

    return () => mapInstance.remove();
  }, []);

  // Attach map to SDK
  useMapLibreAttachment({
    mapFirst,
    map,
    maplibregl,
  });

  // Handle search
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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "300px", padding: "20px" }}>
        <h2>Hotel Search</h2>
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Hotels"}
        </button>
        {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
        <div style={{ marginTop: "20px" }}>
          <strong>Found: {state?.properties.length || 0} properties</strong>
          <div style={{ maxHeight: "500px", overflow: "auto" }}>
            {state?.properties.map((property) => (
              <div
                key={property.tripadvisor_id}
                style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
              >
                <strong>{property.name}</strong>
                {property.pricing && (
                  <div>{property.pricing.display_price}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
  );
}

export default BasicSearchExample;
```

## Smart Filter Search with Natural Language

```tsx
import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  useSmartFilterSearch,
} from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

function SmartSearchExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const { search, isLoading, error } = useSmartFilterSearch(mapFirst);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    mapInstance.on("load", () => setMap(mapInstance));

    return () => mapInstance.remove();
  }, []);

  useMapLibreAttachment({
    mapFirst,
    map,
    maplibregl,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    await search({ query });
  };

  const exampleQueries = [
    "Hotels near Times Square with free wifi",
    "4-star hotels with pool and gym",
    "Budget hotels under $150",
    "Luxury hotels with spa and breakfast",
    "Family-friendly hotels with connecting rooms",
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "400px", padding: "20px", overflow: "auto" }}>
        <h2>Smart Hotel Search</h2>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Describe what you're looking for in natural language
        </p>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., hotels near beach with pool"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <strong>Try these examples:</strong>
          <div style={{ marginTop: "10px" }}>
            {exampleQueries.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuery(q);
                  search({ query: q });
                }}
                disabled={isLoading}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  marginBottom: "5px",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#fee",
              color: "red",
            }}
          >
            Error: {error.message}
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <strong>Results: {state?.properties.length || 0} properties</strong>
          <div style={{ marginTop: "10px" }}>
            {state?.properties.slice(0, 10).map((property) => (
              <div
                key={property.tripadvisor_id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (mapFirst && property.location) {
                    mapFirst.flyMapTo(
                      property.location.lon,
                      property.location.lat,
                      15
                    );
                    mapFirst.setSelectedMarker(property.tripadvisor_id);
                  }
                }}
              >
                <strong>{property.name}</strong>
                {property.rating && <div>⭐ {property.rating}/5</div>}
                {property.pricing && (
                  <div style={{ color: "#007bff", fontWeight: "bold" }}>
                    {property.pricing.display_price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
  );
}

export default SmartSearchExample;
```

## Combined Search Interface

```tsx
import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import {
  useMapFirstCore,
  useMapLibreAttachment,
  usePropertiesSearch,
  useSmartFilterSearch,
} from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

type SearchMode = "location" | "smart";

function CombinedSearchInterface() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [mode, setMode] = useState<SearchMode>("location");

  // Location search state
  const [city, setCity] = useState("Los Angeles");
  const [country, setCountry] = useState("United States");
  const [checkIn, setCheckIn] = useState("2024-06-01");
  const [checkOut, setCheckOut] = useState("2024-06-07");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Smart search state
  const [query, setQuery] = useState("");

  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: { city, country, currency: "USD" },
  });

  const propertiesSearch = usePropertiesSearch(mapFirst);
  const smartSearch = useSmartFilterSearch(mapFirst);

  const currentSearch = mode === "location" ? propertiesSearch : smartSearch;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-118.2437, 34.0522],
      zoom: 12,
    });

    mapInstance.on("load", () => setMap(mapInstance));

    return () => mapInstance.remove();
  }, []);

  useMapLibreAttachment({
    mapFirst,
    map,
    maplibregl,
    onMarkerClick: (property) => {
      console.log("Clicked:", property.name);
    },
  });

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await propertiesSearch.search({
      body: {
        city,
        country,
        filters: {
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          numAdults: adults,
          numRooms: rooms,
          currency: "USD",
        },
      },
    });
  };

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await smartSearch.search({ query });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "350px",
          padding: "20px",
          overflow: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Hotel Search</h2>

        {/* Search Mode Toggle */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              padding: "10px",
              backgroundColor: mode === "location" ? "#007bff" : "#fff",
              color: mode === "location" ? "#fff" : "#000",
              cursor: "pointer",
              marginBottom: "5px",
              border: "1px solid #ddd",
            }}
          >
            <input
              type="radio"
              checked={mode === "location"}
              onChange={() => setMode("location")}
              style={{ marginRight: "10px" }}
            />
            Location Search
          </label>
          <label
            style={{
              display: "block",
              padding: "10px",
              backgroundColor: mode === "smart" ? "#007bff" : "#fff",
              color: mode === "smart" ? "#fff" : "#000",
              cursor: "pointer",
              border: "1px solid #ddd",
            }}
          >
            <input
              type="radio"
              checked={mode === "smart"}
              onChange={() => setMode("smart")}
              style={{ marginRight: "10px" }}
            />
            Smart Search
          </label>
        </div>

        {/* Location Search Form */}
        {mode === "location" && (
          <form onSubmit={handleLocationSearch}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Country
              </label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Adults
                </label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={propertiesSearch.isLoading}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: propertiesSearch.isLoading
                  ? "#ccc"
                  : "#007bff",
                color: "white",
                border: "none",
                cursor: propertiesSearch.isLoading ? "not-allowed" : "pointer",
              }}
            >
              {propertiesSearch.isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        )}

        {/* Smart Search Form */}
        {mode === "smart" && (
          <form onSubmit={handleSmartSearch}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                What are you looking for?
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., luxury hotels near beach with spa and pool"
                rows={4}
                style={{ width: "100%", padding: "8px", fontSize: "14px" }}
              />
            </div>
            <button
              type="submit"
              disabled={smartSearch.isLoading}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: smartSearch.isLoading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: smartSearch.isLoading ? "not-allowed" : "pointer",
              }}
            >
              {smartSearch.isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        )}

        {/* Error Display */}
        {currentSearch.error && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#fee",
              color: "red",
              borderRadius: "4px",
            }}
          >
            Error: {currentSearch.error.message}
          </div>
        )}

        {/* Results */}
        <div style={{ marginTop: "20px" }}>
          <strong>
            {currentSearch.isLoading
              ? "Searching..."
              : `Found ${state?.properties.length || 0} properties`}
          </strong>
          <div style={{ marginTop: "10px" }}>
            {state?.properties.slice(0, 10).map((property) => (
              <div
                key={property.tripadvisor_id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border:
                    state.selectedPropertyId === property.tripadvisor_id
                      ? "2px solid #007bff"
                      : "1px solid #ddd",
                }}
                onClick={() => {
                  if (mapFirst && property.location) {
                    mapFirst.flyMapTo(
                      property.location.lon,
                      property.location.lat,
                      15
                    );
                    mapFirst.setSelectedMarker(property.tripadvisor_id);
                  }
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {property.name}
                </div>
                {property.rating && (
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    ⭐ {property.rating}/5
                  </div>
                )}
                {property.pricing && (
                  <div
                    style={{
                      color: "#007bff",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    {property.pricing.display_price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
  );
}

export default CombinedSearchInterface;
```

## Key Features

### Error Handling

Both hooks provide built-in error handling:

- `error` - Contains any error that occurred during search
- Errors are automatically captured from the SDK's `onError` callback

### Loading State

Both hooks track loading state:

- `isLoading` - Boolean indicating if search is in progress
- Automatically managed during search execution

### Integration with MapFirst State

The hooks work seamlessly with the reactive state from `useMapFirstCore`:

- Search results automatically update `state.properties`
- Loading states reflect in `state.isSearching`
- All state changes trigger React re-renders

### Type Safety

Full TypeScript support with proper types for:

- Search options
- Filter configurations
- Error objects
- Return values
