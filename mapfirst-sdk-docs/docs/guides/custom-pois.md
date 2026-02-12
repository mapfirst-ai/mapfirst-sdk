---
sidebar_position: 3
---

# Use with Custom POIs

Sometimes you don't want to search by city name — you want to search around a specific point on the map, within a drawn area, or wherever the user clicks. This guide covers all coordinate-based and bounds-based search methods.

:::tip When to use this
Use coordinate/bounds search when you're building **custom location pickers**, **"near me" features**, **click-to-search maps**, or any experience where the user defines the search area themselves — rather than typing a city name.
:::

---

## Overview

MapFirst SDK supports three ways to define a custom search area:

| Method | Best For |
|---|---|
| **Longitude, Latitude & Radius** | "Near me" searches, circular areas around a point |
| **Bounds (SW/NE corners)** | "Search this area" buttons, rectangular map viewport queries |
| **Fly-to & Bounds Search** | Navigating to a location and then searching the visible area |

:::caution Priority rule
When both `bounds` and `longitude/latitude/radius` are provided in the same request, **bounds takes priority** and the coordinate/radius values are ignored.
:::

---

## Search Methods

### Method 1: Initialize with Custom Location

Define your search area up front when creating the MapFirst instance. The SDK will automatically search this area on initialization.

#### Using Longitude, Latitude & Radius

```typescript
import { useMapFirst } from "@mapfirst.ai/react";

function CustomLocationMap() {
  const { state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      longitude: 2.3522,  // Paris coordinates
      latitude: 48.8566,
      radius: 5000,        // 5km radius
      zoom: 13,
      currency: "EUR",
    },
  });

  return (
    <div>
      <h3>Properties near custom location</h3>
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

#### Using Bounds

```typescript
import { useMapFirst } from "@mapfirst.ai/react";

function BoundsInitMap() {
  const { state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      bounds: {
        sw: { lat: 48.8155, lng: 2.2241 },  // Southwest corner
        ne: { lat: 48.9021, lng: 2.4699 },  // Northeast corner
      },
      currency: "EUR",
    },
  });

  return (
    <div>
      <h3>Properties in custom bounds</h3>
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

---

### Method 2: Search with `runPropertiesSearch`

Trigger a search programmatically at any time — perfect for search forms, buttons, or click handlers.

#### React Example — Coordinate Search

```typescript
import { useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";

function CoordinateSearch() {
  const [coordinates, setCoordinates] = useState({
    longitude: 139.6917,
    latitude: 35.6895,
  });
  const [radius, setRadius] = useState(3000);

  const { propertiesSearch, state } = useMapFirst({
    apiKey: "your-api-key",
  });

  const handleSearch = async () => {
    await propertiesSearch({
      body: {
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        radius: radius,  // meters
        filters: {
          checkIn: "2024-09-01",
          checkOut: "2024-09-05",
          numAdults: 2,
          currency: "JPY",
        },
      },
    });
  };

  return (
    <div>
      <div>
        <label>
          Latitude:
          <input
            type="number"
            value={coordinates.latitude}
            onChange={(e) =>
              setCoordinates({ ...coordinates, latitude: +e.target.value })
            }
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            value={coordinates.longitude}
            onChange={(e) =>
              setCoordinates({ ...coordinates, longitude: +e.target.value })
            }
          />
        </label>
        <label>
          Radius (meters):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(+e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSearch} disabled={state.isSearching}>
        {state.isSearching ? "Searching..." : "Search Area"}
      </button>

      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

#### React Example — Bounds Search

```typescript
import { useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";

function CustomBoundsSearch() {
  const { propertiesSearch, state } = useMapFirst({
    apiKey: "your-api-key",
  });

  const searchCustomArea = async () => {
    await propertiesSearch({
      body: {
        bounds: {
          sw: { lat: 40.7128, lng: -74.0060 },  // Lower Manhattan
          ne: { lat: 40.7589, lng: -73.9690 },  // Upper Manhattan
        },
        filters: {
          checkIn: "2024-10-15",
          checkOut: "2024-10-18",
          numAdults: 2,
          numRooms: 1,
          currency: "USD",
          minPrice: 100,
          maxPrice: 500,
        },
      },
    });
  };

  return (
    <div>
      <button onClick={searchCustomArea} disabled={state.isSearching}>
        Search Manhattan Area
      </button>
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

#### Vanilla JavaScript Example

```javascript
const mapFirst = new MapFirstCore({
  apiKey: "your-api-key",
  callbacks: {
    onPropertiesChange: (properties) => {
      console.log("Found:", properties.length);
    },
  },
});

// Search by coordinates and radius
mapFirst.runPropertiesSearch({
  body: {
    longitude: -0.1278,
    latitude: 51.5074,
    radius: 2000, // 2km radius
    filters: {
      checkIn: "2024-08-01",
      checkOut: "2024-08-05",
      numAdults: 2,
      currency: "GBP",
    },
  },
});

// Or search by bounds
mapFirst.runPropertiesSearch({
  body: {
    bounds: {
      sw: { lat: 51.4975, lng: -0.1755 },
      ne: { lat: 51.5173, lng: -0.0801 },
    },
    filters: {
      checkIn: "2024-08-01",
      checkOut: "2024-08-05",
      numAdults: 2,
      currency: "GBP",
    },
  },
});
```

---

### Method 3: Fly-to & Bounds Search

Navigate the map to a specific location first, wait for the animation to finish, then search whatever is visible. This gives users a smooth "fly and explore" experience.

#### React Example

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function FlyToSearch() {
  const mapContainerRef = useRef(null);
  const { attachMapLibre, flyMapTo, boundsSearch, state } = useMapFirst({
    apiKey: "your-api-key",
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [0, 0],
      zoom: 2,
    });

    map.on("load", () => {
      attachMapLibre(map, {
        onMarkerClick: (property) => {
          console.log("Clicked:", property);
        },
      });
    });

    return () => map.remove();
  }, [attachMapLibre]);

  const searchNearLocation = async (lng: number, lat: number, zoom: number) => {
    // Fly to the location
    flyMapTo(lng, lat, zoom, true);

    // Wait for animation and map bounds update
    setTimeout(async () => {
      // Search the visible area
      await boundsSearch();
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => searchNearLocation(2.3522, 48.8566, 13)}
          disabled={state.isSearching}
        >
          Search Paris
        </button>
        <button
          onClick={() => searchNearLocation(139.6917, 35.6895, 13)}
          disabled={state.isSearching}
        >
          Search Tokyo
        </button>
        <button
          onClick={() => searchNearLocation(-74.0060, 40.7128, 13)}
          disabled={state.isSearching}
        >
          Search New York
        </button>
      </div>

      <div ref={mapContainerRef} style={{ height: "500px" }} />

      {state.isSearching && <p>Searching...</p>}
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

#### Vanilla JavaScript Example

```javascript
const mapFirst = new MapFirstCore({
  apiKey: "your-api-key",
});

// Attach map
const map = new maplibregl.Map({
  container: "map",
  style: "https://api.mapfirst.ai/static/style.json",
  center: [0, 0],
  zoom: 2,
});

map.on("load", () => {
  mapFirst.attachMap(map, {
    platform: "maplibre",
    maplibregl: maplibregl,
  });

  // Fly to location and search
  document.getElementById("search-btn").addEventListener("click", async () => {
    // Navigate to Barcelona
    mapFirst.flyMapTo(2.1734, 41.3851, 13, true);

    // Wait for map animation to complete
    setTimeout(async () => {
      // Search the visible area
      await mapFirst.performBoundsSearch();
    }, 1000);
  });
});
```

---

## Priority Rules

:::info How the SDK resolves conflicts
When multiple location parameters are provided in the same request:

1. **Bounds takes priority** over longitude/latitude/radius
2. If both are provided, only bounds will be used
3. If neither is provided, you must provide `city`/`country` or `location_id`
:::

```typescript
// Only bounds will be used
await propertiesSearch({
  body: {
    bounds: { sw: { lat: 48.8, lng: 2.2 }, ne: { lat: 48.9, lng: 2.5 } },
    longitude: 2.3522, // Ignored
    latitude: 48.8566, // Ignored
    radius: 5000, // Ignored
    filters: {
      /* ... */
    },
  },
});
```

---

## Combining with Other Search Parameters

Coordinate and bounds searches work seamlessly with all other SDK features — property type filters, price ranges, date filters, and more.

### With Property Type Filtering

```typescript
const { propertiesSearch, setPrimaryType, state } = useMapFirst({
  apiKey: "your-api-key",
});

// Search for restaurants in a specific area
setPrimaryType("Restaurant");
await propertiesSearch({
  body: {
    longitude: -118.2437,
    latitude: 34.0522,
    radius: 1000,
    filters: {
      currency: "USD",
    },
  },
});
```

### With Filters

```typescript
await propertiesSearch({
  body: {
    longitude: 13.405,
    latitude: 52.52,
    radius: 3000,
    filters: {
      checkIn: "2024-09-15",
      checkOut: "2024-09-18",
      numAdults: 2,
      minPrice: 50,
      maxPrice: 200,
      currency: "EUR",
    },
  },
});
```

---

## Best Practices

:::tip Choosing radius values
Pick a radius that matches the density of the area you're searching:
- **Urban areas:** 1,000–3,000 meters
- **Suburban areas:** 3,000–10,000 meters
- **Rural areas:** 10,000+ meters
:::

1. **Use bounds for map viewport searches** — They map directly to what the user sees on screen, making them ideal for "search this area" buttons.

2. **Use coordinates + radius for "near me" searches** — Simpler to define programmatically and more intuitive for location-based discovery.

3. **Match zoom levels to `flyMapTo`** — Use zoom 12–14 for city level, 14–16 for neighborhoods, and 16–18 for street level.

4. **Handle animation timing carefully** — Wait for map animations to complete before calling `performBoundsSearch`. Using the map's `moveend` event is more reliable than a fixed `setTimeout`:

   ```typescript
   map.once("moveend", async () => {
     await boundsSearch();
   });
   flyMapTo(lng, lat, zoom);
   ```

5. **Validate coordinates before searching** — Latitude must be between -90 and 90, longitude between -180 and 180. Invalid values will cause API errors.

---

## Advanced Pattern: Click to Search

Build a "click anywhere to explore" experience — search for properties wherever the user clicks on the map:

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";

function ClickToSearch() {
  const mapContainerRef = useRef(null);
  const { attachMapLibre, propertiesSearch, state } = useMapFirst({
    apiKey: "your-api-key",
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [0, 0],
      zoom: 2,
    });

    map.on("load", () => {
      attachMapLibre(map, {});

      // Search on map click
      map.on("click", async (e) => {
        const { lng, lat } = e.lngLat;

        await propertiesSearch({
          body: {
            longitude: lng,
            latitude: lat,
            radius: 2000,
            filters: {
              checkIn: "2024-09-01",
              checkOut: "2024-09-05",
              numAdults: 2,
              currency: "USD",
            },
          },
        });
      });
    });

    return () => map.remove();
  }, [attachMapLibre, propertiesSearch]);

  return (
    <div>
      <p>Click anywhere on the map to search that area</p>
      <div ref={mapContainerRef} style={{ height: "500px" }} />
      {state.isSearching && <p>Searching...</p>}
      <p>Found {state.properties.length} properties</p>
    </div>
  );
}
```

---

## Next Steps

- **[Searching Guide](./searching)** — Learn all three search methods (location, smart, bounds).
- **[Map Integration](./map-integration)** — Set up MapLibre, Mapbox, or Google Maps.
- **[useMapFirst API](../api/use-mapfirst)** — Full React hook reference.
- **[MapFirstCore API](../api/core)** — Core class docs for vanilla JavaScript.
- **[Basic Map Example](../examples/basic-map)** — A complete, copy-paste example.
