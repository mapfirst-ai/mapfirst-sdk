---
sidebar_position: 2
---

# Smart Filter Search Example

Example showing natural language search with dynamic filters.

## React Example

```tsx
import { useEffect, useRef, useState } from "react";
import {
  useMapFirst,
  processApiFilters,
  convertToApiFilters,
} from "@mapfirst.ai/react";
import type { SmartFilter } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function SmartFilterSearch() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SmartFilter[]>([]);

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
    state: {
      filters: {
        checkIn: "2024-06-01",
        checkOut: "2024-06-07",
        numAdults: 2,
        numRooms: 1,
        currency: "EUR",
      },
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    map.on("load", () => {
      mapFirst?.attachMap(map, {
        platform: "maplibre",
        maplibregl,
      });
    });

    return () => map.remove();
  }, [mapFirst]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    await smartFilterSearch.search({
      query: searchQuery,
      filters: filters.length ? convertToApiFilters(filters) : undefined,
      onProcessFilters: (responseFilters) => {
        const newFilters = filters.length
          ? filters
          : processApiFilters(responseFilters);

        if (!filters.length) {
          setFilters(newFilters);
        }

        return {
          smartFilters: convertToApiFilters(newFilters),
          price: responseFilters.price,
          limit: responseFilters.limit ?? 30,
        };
      },
    });
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    const updatedFilters = filters.filter((f) => f.id !== filterId);
    setFilters(updatedFilters);

    if (searchQuery && !state?.isSearching) {
      smartFilterSearch.search({
        query: searchQuery,
        filters: convertToApiFilters(updatedFilters),
      });
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "20px",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Smart Filter Search</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Try: hotels near Eiffel Tower with pool"
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={state?.isSearching || !searchQuery.trim()}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: state?.isSearching ? "not-allowed" : "pointer",
            }}
          >
            {state?.isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filters.map((filter) => (
              <span
                key={filter.id}
                style={{
                  padding: "6px 12px",
                  background: "#e0e7ff",
                  borderRadius: "20px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "16px",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <p style={{ marginTop: "10px", color: "#64748b" }}>
          Properties: {state?.properties.length || 0}
        </p>
      </div>

      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
  );
}
```

## HTML/JavaScript Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smart Filter Search</title>

    <link
      href="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.js"></script>
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: system-ui, -apple-system, sans-serif;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      #controls {
        padding: 20px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      #search-container {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
      }

      #search-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 14px;
      }

      #search-btn {
        padding: 10px 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      #search-btn:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      #filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }

      .filter-tag {
        padding: 6px 12px;
        background: #e0e7ff;
        border-radius: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .filter-tag button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
      }

      #map {
        flex: 1;
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <h2>Smart Filter Search</h2>

      <div id="search-container">
        <input
          id="search-input"
          type="text"
          placeholder="Try: hotels near Eiffel Tower with pool"
        />
        <button id="search-btn">Search</button>
      </div>

      <div id="filters"></div>

      <p id="info" style="color: #64748b; margin-top: 10px;">
        Properties: <span id="count">0</span>
      </p>
    </div>

    <div id="map"></div>

    <script>
      const { MapFirstCore, processApiFilters, convertToApiFilters } =
        window.MapFirstCore;

      let activeFilters = [];

      // Initialize map
      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.mapfirst.ai/static/style.json",
        center: [2.3522, 48.8566],
        zoom: 12,
      });

      let mapFirst;

      map.on("load", function () {
        mapFirst = new MapFirstCore({
          apiKey: "your-api-key",
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
          state: {
            filters: {
              checkIn: "2024-06-01",
              checkOut: "2024-06-07",
              numAdults: 2,
              numRooms: 1,
              currency: "EUR",
            },
          },
          callbacks: {
            onPropertiesChange: function (properties) {
              document.getElementById("count").textContent = properties.length;
            },
            onSearchingStateChange: function (searching) {
              document.getElementById("search-btn").disabled = searching;
              document.getElementById("search-btn").textContent = searching
                ? "Searching..."
                : "Search";
            },
          },
        });

        mapFirst.attachMap(map, {
          platform: "maplibre",
          maplibregl: maplibregl,
        });
      });

      // Render filters
      function renderFilters() {
        const container = document.getElementById("filters");
        container.innerHTML = "";

        activeFilters.forEach((filter) => {
          const tag = document.createElement("span");
          tag.className = "filter-tag";
          tag.innerHTML = `
            ${filter.label}
            <button onclick="removeFilter('${filter.id}')">×</button>
          `;
          container.appendChild(tag);
        });
      }

      // Remove filter
      function removeFilter(filterId) {
        activeFilters = activeFilters.filter((f) => f.id !== filterId);
        renderFilters();

        const query = document.getElementById("search-input").value;
        if (query && mapFirst) {
          handleSearch();
        }
      }

      // Handle search
      async function handleSearch() {
        const query = document.getElementById("search-input").value.trim();
        if (!query) return;

        await mapFirst.runSmartFilterSearch({
          query: query,
          filters: activeFilters.length
            ? convertToApiFilters(activeFilters)
            : undefined,
          onProcessFilters: function (responseFilters) {
            if (!activeFilters.length) {
              activeFilters = processApiFilters(responseFilters);
              renderFilters();
            }

            return {
              smartFilters: convertToApiFilters(activeFilters),
              price: responseFilters.price,
              limit: responseFilters.limit || 30,
            };
          },
        });
      }

      // Event listeners
      document
        .getElementById("search-btn")
        .addEventListener("click", handleSearch);

      document
        .getElementById("search-input")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            handleSearch();
          }
        });
    </script>
  </body>
</html>
```

## Example Queries

Try these natural language queries:

- "hotels near Eiffel Tower with pool"
- "romantic restaurants with outdoor seating"
- "budget hotels near Louvre Museum"
- "5 star hotels with spa"
- "family friendly attractions"
- "cheap eats in Montmartre"
- "hotels with free wifi and parking"

## See Also

- [Searching Guide](../guides/searching)
- [useMapFirst API](../api/use-mapfirst)
- [Basic Map Example](./basic-map)
