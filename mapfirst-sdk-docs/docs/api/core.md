---
sidebar_position: 2
---

# MapFirstCore API

The `MapFirstCore` class is the foundation of the MapFirst SDK. It manages map connections, property search, marker rendering, and state — all from a single instance. Use it directly in vanilla JavaScript projects, or let the [`useMapFirst` hook](./use-mapfirst) wrap it for you in React.

:::tip React users
If you're using React, you rarely need to interact with `MapFirstCore` directly. The `useMapFirst` hook creates and manages the instance for you. This page is most useful for **vanilla JavaScript** projects or **advanced React patterns** where you need direct access.
:::

---

## Import

```javascript
// ES Modules
import { MapFirstCore } from "@mapfirst.ai/core";

// Browser (CDN)
const { MapFirstCore } = window.MapFirstCore;
```

---

## Constructor

```javascript
new MapFirstCore(config);
```

### Parameters

```typescript
interface MapFirstConfig {
  // Map adapter (null when using platform-specific initialization)
  adapter: any | null;

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

### Example

Here's a minimal setup that initializes the SDK, listens for property changes, and tracks search state:

```javascript
const mapFirst = new MapFirstCore({
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
      console.log("Properties updated:", properties);
    },
    onSearchingStateChange: (searching) => {
      console.log("Searching:", searching);
    },
  },
});
```

---

## Methods

### attachMap

Attach a map instance to MapFirst. This is how the SDK knows which map to render markers on. Call this **after** the map has fully loaded.

```typescript
attachMap(map: any, options: AttachMapOptions): void
```

**Parameters:**

```typescript
interface AttachMapOptions {
  platform: "maplibre" | "mapbox" | "google";
  maplibregl?: typeof maplibregl; // Required for MapLibre
  mapboxgl?: typeof mapboxgl; // Required for Mapbox
  google?: typeof google; // Required for Google Maps
  onMarkerClick?: (property: Property) => void;
}
```

**Example:**

```javascript
// MapLibre
mapFirst.attachMap(map, {
  platform: "maplibre",
  maplibregl: maplibregl,
  onMarkerClick: (property) => {
    alert(property.name);
  },
});

// Google Maps
mapFirst.attachMap(map, {
  platform: "google",
  google: window.google,
});
```

---

### runPropertiesSearch

Search for properties by location. This is the primary search method — specify a city, country, and optional filters to find accommodations, restaurants, or attractions.

```typescript
runPropertiesSearch(params: SearchParams): Promise<void>
```

**Example:**

```javascript
await mapFirst.runPropertiesSearch({
  body: {
    city: "London",
    country: "United Kingdom",
    filters: {
      checkIn: "2024-07-01",
      checkOut: "2024-07-05",
      numAdults: 2,
      currency: "GBP",
    },
  },
});
```

---

### runSmartFilterSearch

AI-powered natural language search. Pass a plain-text query and the SDK will use AI to extract structured filters and return matching properties.

```typescript
runSmartFilterSearch(params: SmartSearchParams): Promise<void>
```

**Example:**

```javascript
await mapFirst.runSmartFilterSearch({
  query: "romantic restaurants with outdoor seating",
});
```

---

### performBoundsSearch

Search within the current visible map area. Perfect for implementing a "Search this area" button.

```typescript
performBoundsSearch(): Promise<void>
```

**Example:**

```javascript
await mapFirst.performBoundsSearch();
```

---

### setPrimaryType

Set the active property type filter. This controls which category of markers is displayed on the map.

```typescript
setPrimaryType(type: 'Accommodation' | 'Eat & Drink' | 'Attraction'): void
```

**Example:**

```javascript
mapFirst.setPrimaryType("Eat & Drink");
```

---

### setSelectedMarker

Select or deselect a property marker on the map. Selected markers are visually highlighted.

```typescript
setSelectedMarker(id: number | null): void
```

**Example:**

```javascript
// Select
mapFirst.setSelectedMarker(12345);

// Deselect
mapFirst.setSelectedMarker(null);
```

---

### flyMapTo

Smoothly animate the map camera to a specific location and zoom level.

```typescript
flyMapTo(lng: number, lat: number, zoom?: number): void
```

**Example:**

```javascript
// Fly to Eiffel Tower
mapFirst.flyMapTo(2.2945, 48.8584, 15);
```

---

### getState

Get a snapshot of the current SDK state. Useful for reading properties, search status, or filter values at any point in time.

```typescript
getState(): MapFirstState
```

**Example:**

```javascript
const state = mapFirst.getState();
console.log("Current properties:", state.properties);
console.log("Is searching:", state.isSearching);
```

---

### destroy

Clean up all resources — removes markers, detaches event listeners, and disconnects from the map. Always call this when you're done with the instance.

:::caution Memory leaks
Failing to call `destroy()` when removing a map (e.g., on page navigation) can lead to memory leaks, especially in single-page applications. In React, call it in your `useEffect` cleanup function.
:::

```typescript
destroy(): void
```

**Example:**

```javascript
mapFirst.destroy();
```

---

## Events / Callbacks

All callbacks are optional and passed in the `callbacks` object during initialization. They fire whenever the corresponding state changes.

### onPropertiesChange

Called when properties are updated.

```typescript
onPropertiesChange?: (properties: Property[]) => void
```

### onSelectedPropertyChange

Called when selection changes.

```typescript
onSelectedPropertyChange?: (id: number | null) => void
```

### onBoundsChange

Called when map bounds change.

```typescript
onBoundsChange?: (bounds: MapBounds | null) => void
```

### onSearchingStateChange

Called when search state changes.

```typescript
onSearchingStateChange?: (isSearching: boolean) => void
```

### onFirstCallDoneChange

Called when the first search completes. Useful for showing/hiding loading states or triggering map animations after initial data loads.

```typescript
onFirstCallDoneChange?: (firstCallDone: boolean) => void
```

### onIsFlyToAnimatingChange

Called when a fly-to animation starts or finishes.

```typescript
onIsFlyToAnimatingChange?: (animating: boolean) => void
```

### onError

Called when an error occurs.

```typescript
onError?: (error: Error) => void
```

---

## Types

These TypeScript interfaces describe the data structures used throughout the SDK. All types are exported from `@mapfirst.ai/core`.

### Property

Represents a property (accommodation, restaurant, or attraction) returned from search results. This is the main data object you'll work with.

```typescript
interface Property {
  tripadvisor_id: number; // Unique Tripadvisor ID
  name: string; // Property name
  rating: number; // Tripadvisor rating (0-5)
  reviews: number; // Number of reviews
  location?: {
    // Geographic coordinates
    lat: number;
    lon: number;
  };
  type: PropertyType; // "Accommodation" | "Eat & Drink" | "Attraction"
  awards?: PropertyAward[]; // Tripadvisor awards (e.g., Travelers' Choice)
  pricing?: HotelPricingAPIResults; // Hotel pricing data when available
  url?: string; // Property URL
  secondaries: string[]; // Related property IDs
  price_level?: PriceLevel; // "Mid Range" | "Fine Dining" | "Cheap Eats"
  city?: string; // City name
  country?: string; // Country name
}
```

**Example:**

```typescript
const property = {
  tripadvisor_id: 123456,
  name: "Hotel Example",
  rating: 4.5,
  reviews: 1250,
  location: { lat: 48.8566, lon: 2.3522 },
  type: "Accommodation",
  awards: [
    {
      name: "Travelers Choice Best of the Best",
      image: { key: "logo", url: "https://..." },
      type: "1",
    },
  ],
  price_level: "Mid Range",
  city: "Paris",
  country: "France",
};
```

### PropertyType

```typescript
type PropertyType = "Accommodation" | "Eat & Drink" | "Attraction";
```

### PropertyAward

```typescript
type PropertyAward = {
  name: string; // Award name
  image: PropertyAwardImage; // Award badge image
  type: "0" | "1"; // Award category
};

type PropertyAwardImage = {
  key: string; // Image type (e.g., "logo")
  url: string; // Image URL
};
```

---

### PriceLevel

Price level indicator shown as a string.

```typescript
type PriceLevel = "Mid Range" | "Fine Dining" | "Cheap Eats";
```

---

### MapBounds

Represents a rectangular geographic area defined by its southwest and northeast corners.

```typescript
interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}
```

---

## Next Steps

- **[useMapFirst Hook](./use-mapfirst)** — React wrapper that manages a `MapFirstCore` instance for you.
- **[HTML/JavaScript Setup](../getting-started/html)** — Step-by-step guide for using `MapFirstCore` in vanilla JS.
- **[Searching Guide](../guides/searching)** — Learn all three search methods in depth.
- **[Customizing Markers](../guides/customizing-markers)** — Style the markers that `MapFirstCore` renders.
- **[Examples](../examples/basic-map)** — Complete, copy-paste examples.
