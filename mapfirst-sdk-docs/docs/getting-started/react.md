---
sidebar_position: 1
---

# Getting Started with React

Learn how to integrate MapFirst SDK into your React application in just a few minutes.

## Installation

Install the required packages using your preferred package manager:

```bash
npm install @mapfirst/react @mapfirst/core
# or
pnpm add @mapfirst/react @mapfirst/core
# or
yarn add @mapfirst/react @mapfirst/core
```

Additionally, install your preferred map library:

**For MapLibre GL JS:**

```bash
npm install maplibre-gl
```

**For Mapbox GL JS:**

```bash
npm install mapbox-gl
```

**For Google Maps:**
No additional package needed, but you'll need to load the Google Maps JavaScript API.

## Basic Setup

### 1. Choose Your Map Provider

MapFirst SDK works with three popular map providers. Choose the one that fits your needs:

- **MapLibre GL JS** - Free and open-source
- **Mapbox GL JS** - Feature-rich with great styling options
- **Google Maps** - Familiar interface with extensive POI data

### 2. Create Your First Map Component

Here's a complete example using **MapLibre GL JS**:

```tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapFirst } from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Initialize MapFirst SDK
  const {
    instance: mapFirst,
    state,
    attachMapLibre,
  } = useMapFirst({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
    environment: "prod",
  });

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [2.3522, 48.8566], // Paris
      zoom: 12,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Attach map to MapFirst SDK
  useEffect(() => {
    if (map && mapFirst) {
      attachMapLibre(map, maplibregl, {
        onMarkerClick: (property) => {
          console.log("Property clicked:", property);
        },
      });
    }
  }, [map, mapFirst, attachMapLibre]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
      <div>
        <p>Properties found: {state?.properties?.length || 0}</p>
        <p>Loading: {state?.initialLoading ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

export default MapComponent;
```

### 3. Using Different Map Providers

#### Mapbox GL JS

```tsx
import { useMapFirst } from "@mapfirst/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function MapboxExample() {
  const { instance: mapFirst, attachMapbox } = useMapFirst({
    initialLocationData: { city: "London", country: "UK" },
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5074],
      zoom: 12,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map && mapFirst) {
      attachMapbox(map, mapboxgl);
    }
  }, [map, mapFirst, attachMapbox]);

  // ...rest of component
}
```

#### Google Maps

```tsx
import { useMapFirst } from "@mapfirst/react";

function GoogleMapsExample() {
  const { instance: mapFirst, attachGoogle } = useMapFirst({
    initialLocationData: { city: "Tokyo", country: "Japan" },
  });

  useEffect(() => {
    if (!mapContainerRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapContainerRef.current, {
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 12,
      mapId: "YOUR_MAP_ID", // Required for Advanced Markers
    });

    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (map && mapFirst) {
      attachGoogle(map, window.google);
    }
  }, [map, mapFirst, attachGoogle]);

  // ...rest of component
}
```

## Understanding the Hook

The `useMapFirst` hook returns everything you need:

```tsx
const {
  instance, // MapFirstCore instance for direct method calls
  state, // Reactive state (properties, loading, etc.)
  setPrimaryType, // Change property type (Accommodation/Restaurant/Attraction)
  setSelectedMarker, // Select a marker programmatically
  propertiesSearch, // Search with filters
  smartFilterSearch, // AI-powered search
  boundsSearch, // Search within current map bounds
  attachMapLibre, // Attach MapLibre map
  attachGoogle, // Attach Google Maps
  attachMapbox, // Attach Mapbox map
} = useMapFirst({
  /* options */
});
```

### State Object

The `state` object contains reactive data:

```typescript
{
  properties: Property[],        // Array of properties on the map
  selectedPropertyId: number | null, // Currently selected property
  primary: PropertyType,         // Current property type filter
  filters: FilterState,          // Active filters
  isSearching: boolean,          // Search in progress
  initialLoading: boolean,       // Initial data loading
  bounds: MapBounds | null,      // Current map bounds
  pendingBounds: MapBounds | null, // Bounds changed, search pending
  center: [number, number],      // Map center [lng, lat]
  zoom: number,                  // Current zoom level
  activeLocation: ActiveLocation, // Current location context
}
```

## Next Steps

- [Add SmartFilter Component](../components/smartfilter) - Add AI-powered search
- [Perform Searches](../guides/searching) - Learn about different search methods
- [Handle Events](../guides/events) - Respond to user interactions
- [Customize Styling](../guides/styling) - Match your brand

## Common Issues

### Map Not Showing

Make sure you've imported the CSS:

```tsx
import "maplibre-gl/dist/maplibre-gl.css";
// or
import "mapbox-gl/dist/mapbox-gl.css";
```

### Properties Not Loading

Check that you've provided valid location data:

```tsx
initialLocationData: {
  city: "Paris",
  country: "France",
  currency: "EUR", // Required for hotel pricing
}
```

### TypeScript Errors

Make sure your map type is correct:

```tsx
const [map, setMap] = useState<maplibregl.Map | null>(null);
// or
const [map, setMap] = useState<mapboxgl.Map | null>(null);
// or
const [map, setMap] = useState<google.maps.Map | null>(null);
```
