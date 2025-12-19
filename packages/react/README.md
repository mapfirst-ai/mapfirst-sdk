# @mapfirst.ai/react

React hooks and components for the MapFirst SDK supporting MapLibre, Google Maps, and Mapbox.

## Features

- 🗺️ **Multi-Platform Support**: Works with MapLibre GL JS, Google Maps, and Mapbox GL JS
- 🔍 **SmartFilter Component**: AI-powered search with interactive filter chips
- ⚛️ **React Hooks**: Reactive state management for properties, filters, and map state
- 🎨 **Customizable**: Native React styles (CSS-in-JS) - no framework dependencies
- ♿ **Accessible**: Full keyboard navigation and ARIA support
- 🌍 **i18n Ready**: Built-in translations with extensibility

## Installation

```bash
npm install @mapfirst.ai/react @mapfirst.ai/core
# or
pnpm add @mapfirst.ai/react @mapfirst.ai/core
# or
yarn add @mapfirst.ai/react @mapfirst.ai/core
```

## Quick Start - SmartFilter Component

```tsx
import { useMapFirst, SmartFilter } from "@mapfirst.ai/react";
import { useState } from "react";

function App() {
  const {
    instance: mapFirst,
    state,
    smartFilterSearch,
  } = useMapFirst({
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const [filters, setFilters] = useState([]);

  return (
    <SmartFilter
      mapFirst={mapFirst}
      filters={filters}
      isSearching={state?.isSearching}
      onSearch={async (query) => {
        await smartFilterSearch.search({ query });
      }}
      onFilterChange={setFilters}
    />
  );
}
```

See [SMARTFILTER.md](./SMARTFILTER.md) for complete SmartFilter documentation.

## Usage

The React SDK supports a two-phase initialization pattern:

1. Create the MapFirst SDK instance (optionally with location data)
2. Attach your map when it's ready

### MapLibre GL JS

```tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapFirst } from "@mapfirst.ai/react";
import "maplibre-gl/dist/maplibre-gl.css";

function MapLibreExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Phase 1: Create SDK instance with location data
  const {
    instance: mapFirst,
    state,
    attachMapLibre,
    smartFilterSearch,
    boundsSearch,
  } = useMapFirst({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
    environment: "prod",
    mfid: "your-mfid",
  });

  // Access reactive state
  const properties = state?.properties || [];
  const isSearching = state?.isSearching || false;

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
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

  // Phase 2: Attach map to SDK
  useEffect(() => {
    if (map && mapFirst) {
      attachMapLibre(map, maplibregl, {
        onMarkerClick: (marker) => {
          console.log("Marker clicked:", marker);
        },
      });
    }
  }, [map, mapFirst, attachMapLibre]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

### Google Maps

```tsx
import React, { useEffect, useRef, useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";

function GoogleMapsExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Phase 1: Create SDK instance
  const {
    instance: mapFirst,
    state,
    attachGoogle,
  } = useMapFirst({
    initialLocationData: {
      city: "Tokyo",
      country: "Japan",
      currency: "JPY",
    },
  });

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainerRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapContainerRef.current, {
      center: { lat: 35.6762, lng: 139.6503 }, // Tokyo
      zoom: 12,
      mapId: "your-map-id", // Required for Advanced Markers
    });

    setMap(mapInstance);
  }, []);

  // Phase 2: Attach map to SDK
  useEffect(() => {
    if (map && mapFirst) {
      attachGoogle(map, window.google, {
        onMarkerClick: (marker) => {
          console.log("Marker clicked:", marker);
        },
      });
    }
  }, [map, mapFirst, attachGoogle]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

### Mapbox GL JS

```tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMapFirst } from "@mapfirst.ai/react";
import "mapbox-gl/dist/mapbox-gl.css";

function MapboxExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  // Phase 1: Create SDK instance
  const {
    instance: mapFirst,
    state,
    attachMapbox,
  } = useMapFirst({
    initialLocationData: {
      city: "London",
      country: "United Kingdom",
      currency: "GBP",
    },
  });

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = "your-mapbox-token";

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5074], // London
      zoom: 12,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Phase 2: Attach map to SDK
  useEffect(() => {
    if (map && mapFirst) {
      attachMapbox(map, mapboxgl, {
        onMarkerClick: (marker) => {
          console.log("Marker clicked:", marker);
        },
      });
    }
  }, [map, mapFirst, attachMapbox]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

## Advanced Usage

### Accessing SDK Methods and Reactive State

All SDK methods are available through the `instance`, and state updates automatically trigger React re-renders:

```tsx
const {
  instance: mapFirst,
  state,
  setPrimaryType,
  setSelectedMarker,
  propertiesSearch,
  smartFilterSearch,
  boundsSearch,
} = useMapFirst({
  /* ... */
});

// Access reactive state (automatically updates)
const properties = state?.properties || [];
const isSearching = state?.isSearching || false;
const selectedId = state?.selectedPropertyId;
const filters = state?.filters;

// Fly to location
useEffect(() => {
  if (mapFirst) {
    mapFirst.flyMapTo(2.3522, 48.8566, 14); // lng, lat, zoom
  }
}, [mapFirst]);

// Run properties search using the hook's search method
const handleSearch = async () => {
  await propertiesSearch.search({
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

// Run smart filter search
const handleSmartSearch = async (query: string) => {
  await smartFilterSearch.search({ query });
};

// Perform bounds search
const handleBoundsSearch = async () => {
  await boundsSearch.perform();
};

// Set primary type
setPrimaryType("Restaurant");

// Set selected marker
setSelectedMarker(123456);

// Set filters directly on instance
mapFirst?.setFilters({
  checkIn: new Date("2024-06-01"),
  checkOut: new Date("2024-06-07"),
  numAdults: 2,
  currency: "EUR",
});
```

### Using Search Methods

The unified hook provides search methods with their own loading states:

```tsx
const {
  instance: mapFirst,
  state,
  propertiesSearch,
  smartFilterSearch,
  boundsSearch,
} = useMapFirst({
  /* ... */
});

// Properties search with loading state
const handlePropertiesSearch = async () => {
  try {
    await propertiesSearch.search({
      body: {
        city: "Paris",
        country: "France",
        filters: {
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 86400000 * 3),
          numAdults: 2,
        },
      },
    });
  } catch (err) {
    console.error("Search failed:", propertiesSearch.error);
  }
};

// Smart filter search with loading state
const handleSmartSearch = async (query: string) => {
  try {
    await smartFilterSearch.search({ query });
  } catch (err) {
    console.error("Search failed:", smartFilterSearch.error);
  }
};

// Bounds search with loading state
const handleBoundsSearch = async () => {
  if (!state?.pendingBounds) return;

  try {
    await boundsSearch.perform();
  } catch (err) {
    console.error("Search failed:", boundsSearch.error);
  }
};

return (
  <div>
    <button
      onClick={handlePropertiesSearch}
      disabled={propertiesSearch.isLoading}
    >
      {propertiesSearch.isLoading ? "Searching..." : "Search Properties"}
    </button>

    <button
      onClick={() => handleSmartSearch("hotels with pool")}
      disabled={smartFilterSearch.isLoading}
    >
      {smartFilterSearch.isLoading ? "Searching..." : "Smart Search"}
    </button>

    <button
      onClick={handleBoundsSearch}
      disabled={boundsSearch.isSearching || !state?.pendingBounds}
    >
      {boundsSearch.isSearching ? "Searching..." : "Search This Area"}
    </button>
  </div>
);
```

### State Management with Callbacks

```tsx
const { instance: mapFirst, state } = useMapFirst({
  initialLocationData: {
    city: "Paris",
    country: "France",
  },
  callbacks: {
    onPropertiesChange: (properties) => {
      console.log("Properties updated:", properties.length);
    },
    onSelectedPropertyChange: (id) => {
      console.log("Selected property:", id);
    },
    onError: (error, context) => {
      console.error(`Error in ${context}:`, error);
    },
    onLoadingStateChange: (loading) => {
      console.log("Loading:", loading);
    },
  },
});
```

### Configuring Map Behavior

```tsx
const { instance: mapFirst, state } = useMapFirst({
  initialLocationData: {
    city: "New York",
    country: "United States",
  },
  fitBoundsPadding: {
    top: 100,
    bottom: 200,
    left: 50,
    right: 50,
  },
  properties: [], // Initial properties
  primaryType: "Accommodation", // or 'Restaurant', 'Attraction'
  autoSelectOnClick: true, // Auto-select marker on click
  environment: "prod", // or 'test'
});
```

## API Reference

### `useMapFirst(options)`

Comprehensive hook for MapFirst SDK with all functionality in one place. Creates a MapFirstCore instance with reactive state and provides all necessary methods.

**Returns:**

```typescript
{
  instance: MapFirstCore | null,
  state: MapState | null,
  setPrimaryType: (type: PropertyType) => void,
  setSelectedMarker: (id: number | null) => void,
  propertiesSearch: {
    search: (options) => Promise<any>,
    isLoading: boolean,
    error: Error | null
  },
  smartFilterSearch: {
    search: (options) => Promise<any>,
    isLoading: boolean,
    error: Error | null
  },
  boundsSearch: {
    perform: () => Promise<any>,
    isSearching: boolean,
    error: Error | null
  },
  attachMapLibre: (map, maplibregl, options?) => void,
  attachGoogle: (map, google, options?) => void,
  attachMapbox: (map, mapboxgl, options?) => void
}
```

- `instance` - The SDK instance for calling methods
- `state` - Reactive state that updates when SDK state changes
  - `properties` - Array of properties
  - `selectedPropertyId` - Currently selected property ID
  - `primary` - Primary property type
  - `filters` - Current filter state
  - `isSearching` - Whether a search is in progress
  - `initialLoading` - Whether initial data is loading
  - `bounds` - Current map bounds
  - `center` - Map center coordinates
  - `zoom` - Current zoom level
  - `activeLocation` - Active location data
- `setPrimaryType` - Function to change the primary property type
- `setSelectedMarker` - Function to select/deselect markers
- `propertiesSearch` - Object with search method, loading state, and error
- `smartFilterSearch` - Object with search method, loading state, and error
- `boundsSearch` - Object with perform method, searching state, and error
- `attachMapLibre` - Function to attach MapLibre map
- `attachGoogle` - Function to attach Google Maps
- `attachMapbox` - Function to attach Mapbox map

**Options:**

- `initialLocationData?` - Location data for geo-lookup
  - `city?` - City name
  - `country?` - Country name
  - `query?` - Search query
  - `currency?` - Currency code
- `environment?` - API environment ('prod' | 'test')
- `mfid?` - MapFirst ID
- `state?` - Initial map state
- `callbacks?` - State change callbacks
- `fitBoundsPadding?` - Padding for fitBounds operations
- `properties?` - Initial properties
- `primaryType?` - Primary property type
- `autoSelectOnClick?` - Auto-select markers on click

### Map Attachment Methods

The hook returns three functions for attaching different map types:

**`attachMapLibre(map, maplibregl, options?)`**

- `map` - MapLibre map instance
- `maplibregl` - MapLibre GL namespace
- `options?.onMarkerClick` - Optional marker click handler

**`attachGoogle(map, google, options?)`**

- `map` - Google Maps instance
- `google` - Google Maps namespace
- `options?.onMarkerClick` - Optional marker click handler

**`attachMapbox(map, mapboxgl, options?)`**

- `map` - Mapbox map instance
- `mapboxgl` - Mapbox GL namespace
- `options?.onMarkerClick` - Optional marker click handler

### Search Methods

**`propertiesSearch.search(options)`**

Runs a properties search with the specified options.

**Options:**

- `body` - Search body with city, country, filters, etc.
- `beforeApplyProperties?` - Callback to modify data before applying
- `smartFiltersClearable?` - Whether smart filters can be cleared

**Returns:** Promise with search results

**`smartFilterSearch.search(options)`**

Runs a smart filter search with natural language or predefined filters.

**Options:**

- `query?` - Natural language search query
- `filters?` - Array of SmartFilter objects
- `onProcessFilters?` - Callback to process filter response

**Returns:** Promise with search results

**`boundsSearch.perform()`**

Performs a search within the current map bounds when `state.pendingBounds` is set.

**Returns:** Promise with search results

## Legacy API

The old separate hooks (`useMapFirstCore`, `useMapLibreAttachment`, etc.) have been consolidated into the single `useMapFirst` hook. If you're using the old API:

```tsx
// Old API (deprecated)
const { mapFirst, state } = useMapFirstCore({ ... });
useMapLibreAttachment({ mapFirst, map, maplibregl });
const { search } = usePropertiesSearch(mapFirst);

// New unified API
const {
  instance: mapFirst,
  state,
  attachMapLibre,
  propertiesSearch
} = useMapFirst({ ... });
```

**Migration Benefits:**

- Single hook import instead of multiple
- All functionality available from one hook
- Better TypeScript support
- Cleaner, more maintainable code

## License

MIT
