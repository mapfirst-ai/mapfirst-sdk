---
sidebar_position: 1
---

# Basic Map Example

A complete, copy-paste example that gives you a working map with property search, type switching, and marker interaction. This is the fastest way to see the SDK in action.

:::tip What you'll build
By the end of this example, you'll have a map that:
- Displays property markers for a city (Paris)
- Lets users switch between Hotels, Restaurants, and Attractions
- Shows a property count and loading state
- Responds to marker clicks with property details
:::

---

## React Example

```typescript
import { useEffect, useRef, useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function BasicMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { attachMapLibre, state, propertiesSearch, setPrimaryType } =
    useMapFirst({
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
        onPropertiesChange: (properties) => {
          console.log("Properties loaded:", properties.length);
        },
        onSearchingStateChange: (searching) => {
          console.log("Searching:", searching);
        },
      },
    });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566], // Paris
      zoom: 12,
    });

    map.on("load", () => {
      setMapLoaded(true);
      attachMapLibre(map, {
        onMarkerClick: (property) => {
          alert(`${property.name}\nRating: ${property.rating || "N/A"}`);
        },
      });
    });

    return () => map.remove();
  }, [attachMapLibre]);

  const handleSearch = async () => {
    await propertiesSearch({
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

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Controls */}
      <div
        style={{
          padding: "20px",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <h2>MapFirst SDK - Basic Example</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button onClick={() => setPrimaryType("Accommodation")}>
            Hotels
          </button>
          <button onClick={() => setPrimaryType("Eat & Drink")}>
            Restaurants
          </button>
          <button onClick={() => setPrimaryType("Attraction")}>
            Attractions
          </button>
        </div>

        <button
          onClick={handleSearch}
          disabled={state.isSearching || !mapLoaded}
          style={{
            padding: "10px 20px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: state.isSearching ? "not-allowed" : "pointer",
          }}
        >
          {state.isSearching ? "Searching..." : "Search Paris"}
        </button>

        <p>
          Type: {state.primaryType} | Properties: {state.properties.length} |
          {state.isSearching && " Loading..."}
        </p>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} style={{ flex: 1 }} />
    </div>
  );
}
```

---

## HTML/JavaScript Example

The same functionality works without React — just include the SDK via CDN and use the `MapFirstCore` class directly:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MapFirst SDK - Basic Example</title>

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
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
      }

      #controls {
        padding: 20px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      #map {
        height: calc(100vh - 200px);
      }

      .btn-group {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      button {
        padding: 10px 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      button:hover {
        background: #2563eb;
      }

      button:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      #info {
        margin-top: 15px;
        padding: 10px;
        background: #f1f5f9;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <h2>MapFirst SDK - Basic Example</h2>

      <div class="btn-group">
        <button id="hotels-btn">Hotels</button>
        <button id="restaurants-btn">Restaurants</button>
        <button id="attractions-btn">Attractions</button>
      </div>

      <button id="search-btn">Search Paris</button>

      <div id="info">
        <p>Type: <span id="current-type">Accommodation</span></p>
        <p>Properties: <span id="property-count">0</span></p>
        <p id="loading-status"></p>
      </div>
    </div>

    <div id="map"></div>

    <script>
      const { MapFirstCore } = window.MapFirstCore;

      // Initialize map
      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.mapfirst.ai/static/style.json",
        center: [2.3522, 48.8566], // Paris
        zoom: 12,
      });

      let mapFirst;

      map.on("load", function () {
        // Initialize MapFirst SDK
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
              document.getElementById("property-count").textContent =
                properties.length;
              console.log("Properties loaded:", properties);
            },
            onSearchingStateChange: function (isSearching) {
              const status = document.getElementById("loading-status");
              const searchBtn = document.getElementById("search-btn");

              status.textContent = isSearching ? "Loading..." : "";
              searchBtn.disabled = isSearching;
            },
          },
        });

        // Attach map to MapFirst
        mapFirst.attachMap(map, {
          platform: "maplibre",
          maplibregl: maplibregl,
          onMarkerClick: function (property) {
            alert(property.name + "\nRating: " + (property.rating || "N/A"));
          },
        });
      });

      // Property type buttons
      document
        .getElementById("hotels-btn")
        .addEventListener("click", function () {
          mapFirst.setPrimaryType("Accommodation");
          document.getElementById("current-type").textContent = "Accommodation";
        });

      document
        .getElementById("restaurants-btn")
        .addEventListener("click", function () {
          mapFirst.setPrimaryType("Eat & Drink");
          document.getElementById("current-type").textContent = "Eat & Drink";
        });

      document
        .getElementById("attractions-btn")
        .addEventListener("click", function () {
          mapFirst.setPrimaryType("Attraction");
          document.getElementById("current-type").textContent = "Attraction";
        });

      // Search button
      document
        .getElementById("search-btn")
        .addEventListener("click", function () {
          mapFirst.runPropertiesSearch({
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
        });
    </script>
  </body>
</html>
```

---

## What This Example Demonstrates

| Feature | How it's used |
|---|---|
| **Map Initialization** | Creates a MapLibre GL JS map with the MapFirst tile style |
| **SDK Attachment** | Connects the map to MapFirst for automatic marker rendering |
| **Property Type Switching** | Toggles between Hotels, Restaurants, and Attractions |
| **Search** | Runs a location-based search with date and guest filters |
| **Marker Interaction** | Handles clicks on property markers |
| **State Tracking** | Displays property count and loading state in real time |

:::tip Try it live
Open the [Playground](/playground) to experiment with these features in your browser — no setup required.
:::

---

## Next Steps

- **[useMapFirst API](../api/use-mapfirst)** — Full hook reference with all parameters and return values.
- **[Searching Guide](../guides/searching)** — Learn smart search, bounds search, and advanced patterns.
- **[Map Integration Guide](../guides/map-integration)** — Set up Mapbox or Google Maps instead of MapLibre.
- **[Smart Filter Search Example](./smart-filter-search)** — Add AI-powered natural language search.
- **[Property Details Example](./property-details)** — Build a sidebar with images, ratings, and pricing.
