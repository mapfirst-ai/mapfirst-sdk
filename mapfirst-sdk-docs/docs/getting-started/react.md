---
sidebar_position: 1
---

# React Setup

Get MapFirst SDK running in your React application in under five minutes. This guide covers installation, basic map rendering, and your first property search.

:::info Works with all React frameworks
This guide applies to **React 18+**, **Next.js**, **Remix**, **Vite**, and any other React-based setup. The SDK is fully compatible with SSR frameworks — just make sure map initialization happens on the client side.
:::

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 20+** and a package manager (npm, pnpm, or yarn)
- A **MapFirst API key** — [get one here](https://mapfirst.ai)
- A React project (or create one with `npx create-vite@latest my-app --template react-ts`)

---

## Step 1 — Install Dependencies

Install the MapFirst React package and a map library. We'll use MapLibre GL JS (free, open-source) in this guide:

```bash
npm install @mapfirst.ai/react maplibre-gl
# or
pnpm add @mapfirst.ai/react maplibre-gl
# or
yarn add @mapfirst.ai/react maplibre-gl
```

:::tip Using Mapbox or Google Maps instead?
You can swap MapLibre for Mapbox GL JS or Google Maps later. See the [Map Integration Guide](../guides/map-integration) for platform-specific instructions.
:::

---

## Step 2 — Render a Map

Create a component that initializes a MapLibre map and connects it to the MapFirst SDK:

```tsx
import { useEffect, useRef, useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // 1. Initialize the SDK
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

  // 2. Create the map
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

  // 3. Attach the SDK to the map
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

:::caution Map not showing?
The most common cause is a missing CSS import. Make sure you have this line at the top of your component:
```tsx
import "maplibre-gl/dist/maplibre-gl.css";
```
Also ensure the map container has explicit dimensions (`width` and `height`).
:::

---

## Step 3 — Search for Properties

Now that the map is connected, you can search for properties. The SDK provides several search methods:

### Basic Location Search

Search by city and country with optional date and guest filters:

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
      {state?.isSearching ? "Searching..." : "Search Paris"}
    </button>
  );
}
```

### AI-Powered Smart Search

Search with natural language — the SDK uses AI to extract filters automatically:

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
        placeholder='Try: "Hotels near Eiffel Tower with pool"'
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.currentTarget.value);
          }
        }}
      />
      <p>
        {state?.isSearching
          ? "Searching..."
          : `${state?.properties?.length || 0} results`}
      </p>
    </div>
  );
}
```

---

## Step 4 — Switch Property Types

Toggle between accommodations, restaurants, and attractions:

```tsx
function TypeSwitcher() {
  const { setPrimaryType, state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: { city: "Paris", country: "France", currency: "EUR" },
  });

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={() => setPrimaryType("Accommodation")}>
        🏨 Hotels
      </button>
      <button onClick={() => setPrimaryType("Eat & Drink")}>
        🍽️ Restaurants
      </button>
      <button onClick={() => setPrimaryType("Attraction")}>
        🎡 Attractions
      </button>
      <span>Active: {state?.primaryType}</span>
    </div>
  );
}
```

---

## Using Other Map Providers

### Mapbox GL JS

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

// Attach with the Mapbox helper
attachMapbox(mapInstance, mapboxgl);
```

### Google Maps

```tsx
const mapInstance = new google.maps.Map(mapContainerRef.current, {
  center: { lat: 48.8566, lng: 2.3522 },
  zoom: 12,
  mapId: "YOUR_MAP_ID",
});

// Attach with the Google helper
attachGoogle(mapInstance, window.google.maps);
```

---

## Hook API Reference

The `useMapFirst` hook returns everything you need in one object:

```tsx
const {
  instance,          // MapFirstCore instance (for advanced use)
  state,             // Reactive state (properties, search status, etc.)
  setPrimaryType,    // Switch between Accommodation / Eat & Drink / Attraction
  setSelectedMarker, // Select or deselect a property marker
  setUseApi,         // Toggle API usage
  propertiesSearch,  // Run a location-based search
  smartFilterSearch,  // Run an AI-powered natural language search
  boundsSearch,      // Search within current map bounds
  attachMapLibre,    // Attach a MapLibre GL JS map
  attachMapbox,      // Attach a Mapbox GL JS map
  attachGoogle,      // Attach a Google Maps instance
} = useMapFirst(options);
```

### State Object

The `state` object is reactive — your component re-renders whenever it changes:

```typescript
{
  properties: Property[],            // Properties currently on the map
  selectedPropertyId: number | null,  // ID of the selected property
  primaryType: PropertyType,          // Active property type filter
  isSearching: boolean,               // Whether a search is in progress
  filters: FilterState,               // Active search filters
  bounds: MapBounds | null,           // Current map bounds
  pendingBounds: MapBounds | null,    // Bounds that changed (for "search this area")
  center: [number, number],           // Map center [lng, lat]
  zoom: number,                       // Current zoom level
}
```

> See the [Property type reference](../api/core#property) for complete type definitions.

---

## Common Issues

### Properties not loading?

Make sure your `initialLocationData` includes all required fields:

```tsx
initialLocationData: {
  city: "Paris",      // Required
  country: "France",  // Required
  currency: "EUR",    // Required for pricing data
}
```

### Hydration errors in Next.js?

Map libraries require the browser DOM. Wrap your map component in a dynamic import:

```tsx
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});
```

### TypeScript errors with map libraries?

Install the type definitions:

```bash
# For MapLibre (types are included)
npm install maplibre-gl

# For Mapbox
npm install mapbox-gl @types/mapbox-gl
```

---

## Next Steps

You now have a working map with property search. Here's where to go from here:

- **[Searching Guide](../guides/searching)** — Learn all three search methods in depth.
- **[SmartFilter Component](../components/smart-filter)** — Add interactive AI filter chips.
- **[Customizing Markers](../guides/customizing-markers)** — Style markers to match your brand.
- **[Custom POIs](../guides/custom-pois)** — Search by coordinates, radius, or bounds.
- **[API Reference](../api/use-mapfirst)** — Complete hook documentation.
- **[Examples](../examples/basic-map)** — Full working examples to copy and adapt.