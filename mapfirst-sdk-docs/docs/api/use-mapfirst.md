---
sidebar_position: 1
---

# useMapFirst Hook

The `useMapFirst` hook is the single entry point for using MapFirst SDK in React. It creates and manages a `MapFirstCore` instance, exposes reactive state, and provides helper methods for searching, filtering, and connecting to map libraries — all in one call.

:::info This is the recommended way to use MapFirst in React
You don't need to instantiate `MapFirstCore` manually. This hook handles initialization, cleanup, and state synchronization for you. For vanilla JavaScript, see the [MapFirstCore API](./core) instead.
:::

---

## Import

```typescript
import { useMapFirst } from "@mapfirst.ai/react";
```

## Usage

```typescript
const {
  instance, // The underlying MapFirstCore instance
  state, // Reactive state (re-renders your component on change)
  setPrimaryType, // Switch property type filter
  setSelectedMarker, // Select/deselect a marker
  propertiesSearch, // Location-based search
  smartFilterSearch, // AI-powered natural language search
  boundsSearch, // Search within visible map bounds
  attachMapLibre, // Connect a MapLibre GL JS map
  attachGoogle, // Connect a Google Maps instance
  attachMapbox, // Connect a Mapbox GL JS map
} = useMapFirst(config);
```

---

## Parameters

### config

Configuration object for initializing MapFirst. All fields are optional except `apiKey` (required for API calls).

```typescript
interface MapFirstConfig {
  // API Configuration
  apiKey?: string; // Your MapFirst API key
  useApi?: boolean; // Use MapFirst API (default: true)
  environment?: "dev" | "prod"; // API environment (default: "prod")
  apiUrl?: string; // Custom API URL (optional)

  // Initial location data
  initialLocationData?: {
    city?: string;
    country?: string;
    currency?: string;
  };

  // Initial request body (alternative to initialLocationData)
  requestBody?: any;

  // Initial state
  state?: Partial<MapState>;

  // Property configuration
  properties?: Property[]; // Pre-loaded properties
  primaryType?: PropertyType; // Initial property type filter
  selectedMarkerId?: number | null; // Initially selected marker

  // Map behavior
  autoSelectOnClick?: boolean; // Auto-select marker on click
  fitBoundsPadding?: {
    // Padding for fitBounds
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  // Callbacks
  callbacks?: {
    onPropertiesChange?: (properties: Property[]) => void;
    onSelectedPropertyChange?: (id: number | null) => void;
    onPrimaryTypeChange?: (type: PropertyType) => void;
    onFiltersChange?: (filters: FilterState) => void;
    onBoundsChange?: (bounds: MapBounds | null) => void;
    onPendingBoundsChange?: (bounds: MapBounds | null) => void;
    onCenterChange?: (center: [number, number], zoom: number) => void;
    onZoomChange?: (zoom: number) => void;
    onActiveLocationChange?: (location: ActiveLocation) => void;
    onLoadingStateChange?: (loading: boolean) => void;
    onSearchingStateChange?: (searching: boolean) => void;
    onFirstCallDoneChange?: (firstCallDone: boolean) => void;
    onIsFlyToAnimatingChange?: (animating: boolean) => void;
  };
}
```

---

## Return Values

### instance

The underlying `MapFirstCore` instance. Use this for advanced operations not covered by the hook's convenience methods. Will be `null` until initialization completes.

```typescript
instance: MapFirstCore | null;
```

---

### state

Reactive state object. Your component re-renders automatically whenever any value in this object changes — no manual subscriptions needed.

```typescript
interface MapFirstState {
  properties: Property[];
  selectedProperty: number | null;
  isSearching: boolean;
  bounds: Bounds | null;
  primaryType: "Accommodation" | "Restaurant" | "Attraction";
}
```

---

### setPrimaryType

Switch the active property type filter. This immediately updates which markers are visible on the map.

```typescript
setPrimaryType: (type: 'Accommodation' | 'Restaurant' | 'Attraction') => void
```

**Example:**

```typescript
setPrimaryType("Restaurant");
```

---

### setSelectedMarker

Select or deselect a property marker. The selected marker is visually highlighted on the map and the `state.selectedProperty` value updates accordingly.

```typescript
setSelectedMarker: (id: number | null) => void
```

**Example:**

```typescript
// Select property with ID 12345
setSelectedMarker(12345);

// Deselect
setSelectedMarker(null);
```

---

### propertiesSearch

Search for properties by location and filters. This is the primary search method — results are stored in `state.properties` and markers appear on the map automatically.

```typescript
propertiesSearch: (params: SearchParams) => Promise<SearchResponse | null>;
```

**Parameters:**

```typescript
interface SearchParams {
  body: {
    city: string;
    country: string;
    filters?: {
      checkIn?: string; // ISO date format
      checkOut?: string; // ISO date format
      numAdults?: number;
      numChildren?: number;
      numRooms?: number;
      currency?: string;
      minPrice?: number;
      maxPrice?: number;
    };
  };
  beforeApplyProperties?: (data: APIResponse) => {
    price?: Price | null;
    limit?: number;
  };
  smartFiltersClearable?: boolean;
  onError?: (error: Error) => void;
}
```

**Example:**

```typescript
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
  onError: (err) => console.error(err),
});
```

---

### smartFilterSearch

AI-powered natural language search. Pass a plain-text query and the SDK extracts structured filters automatically. Pair with the [SmartFilter component](../components/smart-filter) to display interactive filter chips.

```typescript
smartFilterSearch: (params: SmartSearchParams) =>
  Promise<SmartSearchResponse | null>;
```

**Parameters:**

```typescript
interface SmartSearchParams {
  query: string;
  filters?: ApiFilter[];
  onProcessFilters?: (responseFilters: SmartFilterResponse) => {
    smartFilters?: ApiFilter[];
    price?: Price | null;
    limit?: number;
    language?: string;
  };
  onError?: (error: Error) => void;
}
```

**Example:**

```typescript
await smartFilterSearch({
  query: "hotels near eiffel tower with pool",
  onProcessFilters: (responseFilters) => ({
    smartFilters: responseFilters.smartFilters,
    price: responseFilters.price,
    limit: 30,
  }),
});
```

---

### boundsSearch

Search properties within the current visible map area. Perfect for implementing a "Search this area" button that appears when the user pans or zooms.

```typescript
boundsSearch: () => Promise<BoundsSearchResponse | null>;
```

**Example:**

```typescript
// Search visible area
await boundsSearch();
```

---

### attachMapLibre

Connect a MapLibre GL JS map instance. Call this **after** the map's `load` event fires. The SDK will begin rendering markers and tracking map bounds automatically.

```typescript
attachMapLibre: (map: maplibregl.Map, maplibregl: MapLibreNamespace, options?: AttachOptions) => void
```

**Parameters:**

```typescript
interface AttachOptions {
  onMarkerClick?: (property: Property) => void;
  markerStyle?: MarkerStyle;
}
```

**Example:**

```typescript
import maplibregl from "maplibre-gl";

const map = new maplibregl.Map({
  container: "map",
  style: "https://api.mapfirst.ai/static/style.json",
  center: [2.3522, 48.8566],
  zoom: 12,
});

map.on("load", () => {
  attachMapLibre(map, maplibregl, {
    onMarkerClick: (property) => {
      console.log("Clicked:", property.name);
    },
  });
});
```

---

### attachGoogle

Connect a Google Maps instance. The map must have a valid `mapId` for Advanced Markers to work.

```typescript
attachGoogle: (map: google.maps.Map, options: AttachOptions) => void
```

**Example:**

```typescript
const map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: 48.8566, lng: 2.3522 },
  zoom: 12,
  mapId: "YOUR_MAP_ID",
});

attachGoogle(map, {
  onMarkerClick: (property) => {
    console.log("Clicked:", property.name);
  },
});
```

---

### setUseApi

Enable or disable API calls. When `useApi` is `false` the SDK skips network requests (useful for rendering pre-loaded properties). Pass `autoLoad: true` to trigger a new search immediately after enabling.

```typescript
setUseApi: (useApi: boolean, autoLoad?: boolean) => void
```

**Example:**

```typescript
// Turn on API and immediately re-fetch
setUseApi(true, true);

// Turn on without auto-loading
setUseApi(true, false);
```

---

### attachMapbox

Connect a Mapbox GL JS map instance. Call this **after** the map's `load` event fires, just like MapLibre.

```typescript
attachMapbox: (map: mapboxgl.Map, options: AttachOptions) => void
```

**Example:**

```typescript
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [2.3522, 48.8566],
  zoom: 12,
});

map.on("load", () => {
  attachMapbox(map, {
    onMarkerClick: (property) => {
      console.log("Clicked:", property.name);
    },
  });
});
```

---

## Property Object

The `Property` interface describes a single property returned from search results. For the full type definition including awards, pricing, and secondary IDs, see the [MapFirstCore API reference](./core#property).

```typescript
interface Property {
  tripadvisor_id: number; // Unique TripAdvisor ID
  name: string; // Property name
  rating: number; // TripAdvisor rating (0–5)
  reviews: number; // Number of reviews
  location?: {
    // Geographic coordinates
    lat: number;
    lon: number;
  };
  type: PropertyType; // "Accommodation" | "Eat & Drink" | "Attraction"
  awards?: PropertyAward[]; // TripAdvisor awards
  pricing?: HotelPricingAPIResults; // Hotel pricing data
  url?: string; // Property URL
  price_level?: PriceLevel; // Price indicator ($ to $$$$)
  city?: string; // City name
  country?: string; // Country name
}
```

:::tip Fetching property images
Use the [`fetchImages`](../guides/fetching-images) function from `@mapfirst.ai/core` to load TripAdvisor photos for any property using its `tripadvisor_id`.
:::

---

## Next Steps

- **[MapFirstCore API](./core)** — Full class reference for advanced use and vanilla JavaScript.
- **[React Setup](../getting-started/react)** — Step-by-step guide to get started with React.
- **[Searching Guide](../guides/searching)** — Learn all three search methods in depth.
- **[SmartFilter Component](../components/smart-filter)** — Display AI-generated filter chips.
- **[Customizing Markers](../guides/customizing-markers)** — Style markers to match your brand.
