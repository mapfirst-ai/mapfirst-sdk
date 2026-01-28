---
sidebar_position: 1
---

# React Setup

Learn how to integrate MapFirst SDK into your React application in just a few minutes.

## Installation

Install the required packages using your preferred package manager:

```bash
npm install @mapfirst.ai/react maplibre-gl
# or
pnpm add @mapfirst.ai/react maplibre-gl
# or
yarn add @mapfirst.ai/react maplibre-gl
```

## Basic Example

Here's a complete working example:

```tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapFirst } from "@mapfirst.ai/react";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const {
    instance: mapFirst,
    state,
    attachMapLibre,
  } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    mapInstance.on("load", () => setMap(mapInstance));

    return () => mapInstance.remove();
  }, []);

  // Attach map to SDK
  useEffect(() => {
    if (map && mapFirst) {
      attachMapLibre(map, maplibregl);
    }
  }, [map, mapFirst, attachMapLibre]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
      <p>Properties: {state?.properties?.length || 0}</p>
      <p>Loading: {state?.isSearching ? "Yes" : "No"}</p>
    </div>
  );
}

export default MapComponent;
```

## Performing Searches

### Basic Search

```tsx
function SearchExample() {
  const { instance: mapFirst, state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  const handleSearch = async () => {
    await mapFirst?.runPropertiesSearch({
      body: {
        city: "Paris",
        country: "France",
        filters: {
          checkIn: "2024-06-01",
          checkOut: "2024-06-07",
          numAdults: 2,
          numRooms: 1,
          currency: "EUR",
        },
      },
    });
  };

  return (
    <button onClick={handleSearch} disabled={state?.isSearching}>
      {state?.isSearching ? "Searching..." : "Search"}
    </button>
  );
}
```

### Smart Filter Search

```tsx
function SmartSearchExample() {
  const { smartFilterSearch, state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  const handleSearch = async (query: string) => {
    await smartFilterSearch.search({
      query: query,
      onProcessFilters: (responseFilters) => {
        return {
          smartFilters: responseFilters.smartFilters,
          price: responseFilters.price,
          limit: 30,
        };
      },
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="e.g., Hotels near beach with pool"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.currentTarget.value);
          }
        }}
      />
      <p>Searching: {state?.isSearching ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Using Different Map Providers

### Mapbox

```tsx
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const mapInstance = new mapboxgl.Map({
  container: mapContainerRef.current,
  style: "mapbox://styles/mapbox/streets-v12",
  center: [2.3522, 48.8566],
  zoom: 12,
});

// Then use attachMapbox
attachMapbox(mapInstance, mapboxgl);
```

### Google Maps

```tsx
const mapInstance = new google.maps.Map(mapContainerRef.current, {
  center: { lat: 48.8566, lng: 2.3522 },
  zoom: 12,
  mapId: "YOUR_MAP_ID",
});

// Then use attachGoogle
attachGoogle(mapInstance, window.google.maps);
```

## Hook API

The `useMapFirst` hook returns:

```tsx
const {
  instance, // MapFirstCore instance
  state, // Reactive state
  setPrimaryType, // Change property type
  setSelectedMarker, // Select a marker
  setUseApi, // Toggle API usage
  propertiesSearch, // Properties search
  smartFilterSearch, // Smart search
  boundsSearch, // Bounds search
  attachMapLibre, // Attach MapLibre
  attachMapbox, // Attach Mapbox
  attachGoogle, // Attach Google Maps
} = useMapFirst(options);
```

### State Object

```typescript
{
  properties: Property[],           // Properties on map
  selectedPropertyId: number | null, // Selected property
  primary: PropertyType,            // Property type filter
  isSearching: boolean,             // Search in progress
  filters: FilterState,             // Active filters
  bounds: MapBounds | null,         // Map bounds
  pendingBounds: MapBounds | null,  // Bounds changed
  center: [number, number],         // Map center
  zoom: number,                     // Zoom level
}
```

> See [Property Type Reference](../api/core#property) for complete type definitions.

## Common Issues

**Map not showing?** Make sure you imported the CSS:

```tsx
import "maplibre-gl/dist/maplibre-gl.css";
```

**Properties not loading?** Check your location data:

```tsx
initialLocationData: {
  city: "Paris",
  country: "France",
  currency: "EUR"  // Required for pricing
}
```
