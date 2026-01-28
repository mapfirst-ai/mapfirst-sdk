---
sidebar_position: 3
---

# Use with Custom POIs

Learn how to search for properties around custom points of interest (POIs) using coordinates, radius, or map bounds.

## Overview

MapFirst SDK allows you to search for properties around specific locations or areas you define. This is useful when:

- Building custom location pickers or map explorers
- Searching around user-selected coordinates
- Finding properties near specific landmarks or addresses
- Exploring properties within a custom area or radius

You can define your search area using:

1. **Longitude, Latitude & Radius** - Circular area around a point
2. **Bounds** - Rectangular area defined by southwest and northeast corners
3. **Fly-to & Bounds Search** - Navigate to a location and search the visible area

**Note:** When both `bounds` and `longitude/latitude/radius` are provided, **bounds takes priority**.

## Search Methods

### Method 1: Initialize with Custom Location

Define your search area when creating the MapFirst instance using `initialLocationData`.

#### Using Longitude, Latitude & Radius

```typescript
import { useMapFirst } from "@mapfirst.ai/react";

function CustomLocationMap() {
  const { state } = useMapFirst({
    adapter: null,
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
    adapter: null,
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

### Method 2: Search with runPropertiesSearch

Programmatically search for properties using custom coordinates or bounds.

#### React Example - Coordinate Search

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
    adapter: null,
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

#### React Example - Bounds Search

```typescript
import { useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";

function CustomBoundsSearch() {
  const { propertiesSearch, state } = useMapFirst({
    adapter: null,
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

#### JavaScript Example

```javascript
const mapFirst = new MapFirstCore({
  adapter: null,
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

### Method 3: Fly-to Location & Bounds Search

Navigate the map to a specific location, then search the visible area using `performBoundsSearch`.

#### React Example

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function FlyToSearch() {
  const mapContainerRef = useRef(null);
  const { attachMapLibre, flyMapTo, boundsSearch, state } = useMapFirst({
    adapter: null,
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

#### JavaScript Example

```javascript
const mapFirst = new MapFirstCore({
  adapter: null,
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

## Priority Rules

When multiple location parameters are provided:

1. **Bounds takes priority** over longitude/latitude/radius
2. If both are provided, only bounds will be used
3. If neither is provided, you must provide city/country or location_id

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

## Combining with Other Search Parameters

You can combine location parameters with other search options:

### With Property Type Filtering

```typescript
const { propertiesSearch, setPrimaryType, state } = useMapFirst({
  adapter: null,
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

## Best Practices

1. **Choose appropriate radius values**
   - Urban areas: 1000-3000 meters
   - Suburban areas: 3000-10000 meters
   - Rural areas: 10000+ meters

2. **Use bounds for rectangular areas**
   - Better for map viewport searches
   - More precise control over the search area
   - Ideal for "search this area" features

3. **Use coordinates + radius for circular areas**
   - Better for "near me" or "around this point" searches
   - Simpler to define programmatically
   - Good for location-based searches

4. **Consider zoom levels with flyMapTo**
   - City level: 12-14
   - Neighborhood: 14-16
   - Street level: 16-18

5. **Handle animation timing**
   - Wait for map animations to complete before searching
   - Use callbacks or timeouts appropriately
   - Consider using map's `moveend` event for more reliable timing

6. **Validate coordinates**
   - Latitude: -90 to 90
   - Longitude: -180 to 180
   - Radius: reasonable values in meters

## Advanced Pattern: Click to Search

Search for properties wherever the user clicks on the map:

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";

function ClickToSearch() {
  const mapContainerRef = useRef(null);
  const { attachMapLibre, propertiesSearch, state } = useMapFirst({
    adapter: null,
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

## See Also

- [Searching for Properties](./searching)
- [Map Integration](./map-integration)
- [useMapFirst API](../api/use-mapfirst)
- [MapFirstCore API](../api/core)
