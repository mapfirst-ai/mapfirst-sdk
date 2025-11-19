# @mapfirst/react

React hooks for the MapFirst SDK supporting MapLibre, Google Maps, and Mapbox.

## Installation

```bash
npm install @mapfirst/react @mapfirst/core
# or
pnpm add @mapfirst/react @mapfirst/core
# or
yarn add @mapfirst/react @mapfirst/core
```

## Usage

The React SDK supports a two-phase initialization pattern:

1. Create the MapFirst SDK instance (optionally with location data)
2. Attach your map when it's ready

### MapLibre GL JS

```tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMapFirstCore, useMapLibreAttachment } from "@mapfirst/react";
import "maplibre-gl/dist/maplibre-gl.css";

function MapLibreExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Phase 1: Create SDK instance with location data
  const { mapFirst, state } = useMapFirstCore({
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

  // Phase 2: Attach map to SDK
  useMapLibreAttachment({
    mapFirst,
    map,
    maplibregl,
    onMarkerClick: (marker) => {
      console.log("Marker clicked:", marker);
    },
  });

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

### Google Maps

```tsx
import React, { useEffect, useRef, useState } from "react";
import { useMapFirstCore, useGoogleMapsAttachment } from "@mapfirst/react";

function GoogleMapsExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Phase 1: Create SDK instance
  const { mapFirst, state } = useMapFirstCore({
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
  useGoogleMapsAttachment({
    mapFirst,
    map,
    google: window.google,
    onMarkerClick: (marker) => {
      console.log("Marker clicked:", marker);
    },
  });

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

### Mapbox GL JS

```tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMapFirstCore, useMapboxAttachment } from "@mapfirst/react";
import "mapbox-gl/dist/mapbox-gl.css";

function MapboxExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  // Phase 1: Create SDK instance
  const { mapFirst, state } = useMapFirstCore({
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
  useMapboxAttachment({
    mapFirst,
    map,
    mapboxgl,
    onMarkerClick: (marker) => {
      console.log("Marker clicked:", marker);
    },
  });

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "600px" }} />
  );
}
```

## Advanced Usage

### Accessing SDK Methods and Reactive State

All SDK methods are available through the `mapFirst` instance, and state updates automatically trigger React re-renders:

```tsx
const { mapFirst, state } = useMapFirstCore({
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

// Run search
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

// Set filters
mapFirst?.setFilters({
  checkIn: new Date("2024-06-01"),
  checkOut: new Date("2024-06-07"),
  numAdults: 2,
  currency: "EUR",
});
```

### Alternative: Using Dedicated Hooks

For more granular control, use the dedicated hooks that only update when specific state changes:

```tsx
const { mapFirst } = useMapFirstCore({
  /* ... */
});

// Only re-renders when properties change
const properties = useMapFirstProperties(mapFirst);

// Only re-renders when selection changes
const selectedId = useMapFirstSelectedProperty(mapFirst);

// Get and set primary type with a single hook
const [primaryType, setPrimaryType] = usePrimaryType(mapFirst);

// Get and set selected marker with a single hook
const [selectedMarker, setSelectedMarker] = useSelectedMarker(mapFirst);

return (
  <div>
    <h2>Properties ({properties.length})</h2>

    {/* Type selector */}
    <select
      value={primaryType}
      onChange={(e) => setPrimaryType(e.target.value as PropertyType)}
    >
      <option value="Accommodation">Hotels</option>
      <option value="Restaurant">Restaurants</option>
      <option value="Attraction">Attractions</option>
    </select>

    {/* Selection controls */}
    {selectedMarker && (
      <div>
        <p>Selected: {selectedMarker}</p>
        <button onClick={() => setSelectedMarker(null)}>Clear Selection</button>
      </div>
    )}
  </div>
);
```

### State Management with Callbacks

```tsx
const mapFirst = useMapFirstCore({
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
const mapFirst = useMapFirstCore({
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

### `useMapFirstCore(options)`

Creates a MapFirst SDK instance and returns reactive state.

**Returns:** `{ mapFirst: MapFirstCore | null, state: MapState | null }`

- `mapFirst` - The SDK instance for calling methods
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

### `useMapLibreAttachment(options)`

Attaches MapLibre map to SDK instance.

**Options:**

- `mapFirst` - SDK instance
- `map` - MapLibre map instance
- `maplibregl` - MapLibre GL namespace
- `onMarkerClick?` - Marker click handler

### `useGoogleMapsAttachment(options)`

Attaches Google Maps to SDK instance.

**Options:**

- `mapFirst` - SDK instance
- `map` - Google Maps instance
- `google` - Google Maps namespace
- `onMarkerClick?` - Marker click handler

### `useMapboxAttachment(options)`

Attaches Mapbox map to SDK instance.

**Options:**

- `mapFirst` - SDK instance
- `map` - Mapbox map instance
- `mapboxgl` - Mapbox GL namespace
- `onMarkerClick?` - Marker click handler

### `useMapFirstProperties(mapFirst)`

Returns the current properties array. Only triggers re-renders when properties change.

**Parameters:**

- `mapFirst` - SDK instance from `useMapFirstCore`

**Returns:** `Property[]`

**Example:**

```tsx
const { mapFirst } = useMapFirstCore({ ... });
const properties = useMapFirstProperties(mapFirst);

return <div>Found {properties.length} properties</div>;
```

### `useMapFirstSelectedProperty(mapFirst)`

Returns the currently selected property ID. Only triggers re-renders when selection changes.

**Parameters:**

- `mapFirst` - SDK instance from `useMapFirstCore`

**Returns:** `number | null`

**Example:**

```tsx
const { mapFirst } = useMapFirstCore({ ... });
const selectedId = useMapFirstSelectedProperty(mapFirst);

return <div>Selected: {selectedId || 'None'}</div>;
```

### `usePrimaryType(mapFirst)`

Returns the current primary property type and a setter function. Re-renders when primary type changes.

**Parameters:**

- `mapFirst` - SDK instance from `useMapFirstCore`

**Returns:** `[PropertyType, (type: PropertyType) => void]`

**Example:**

```tsx
const { mapFirst } = useMapFirstCore({ ... });
const [primaryType, setPrimaryType] = usePrimaryType(mapFirst);

return (
  <select value={primaryType} onChange={(e) => setPrimaryType(e.target.value as PropertyType)}>
    <option value="Accommodation">Hotels</option>
    <option value="Restaurant">Restaurants</option>
    <option value="Attraction">Attractions</option>
  </select>
);
```

### `useSelectedMarker(mapFirst)`

Returns the currently selected marker ID and a setter function. Re-renders when selection changes.

**Parameters:**

- `mapFirst` - SDK instance from `useMapFirstCore`

**Returns:** `[number | null, (id: number | null) => void]`

**Example:**

```tsx
const { mapFirst } = useMapFirstCore({ ... });
const [selectedMarker, setSelectedMarker] = useSelectedMarker(mapFirst);

return (
  <div>
    <p>Selected: {selectedMarker || 'None'}</p>
    <button onClick={() => setSelectedMarker(null)}>Clear Selection</button>
    <button onClick={() => setSelectedMarker(123456)}>Select Property 123456</button>
  </div>
);
```

**Example:**

```tsx
const { mapFirst } = useMapFirstCore({ ... });
const selectedId = useMapFirstSelectedProperty(mapFirst);

return <div>Selected: {selectedId || 'None'}</div>;
```

## Legacy API

The old `useMapFirst` hook is still available but deprecated:

```tsx
const mapFirst = useMapFirst({
  platform: "maplibre",
  mapInstance: mapLibreInstance,
  maplibregl: maplibregl,
  // ... other options
});
```

**Note:** This requires the map to be available immediately. Use the new two-phase initialization pattern instead.

## License

MIT
