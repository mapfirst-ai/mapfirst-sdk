---
sidebar_position: 2
---

# MapFirstCore API

Core JavaScript API for MapFirst SDK. Works in both React and vanilla JavaScript environments.

## Import

```javascript
// ES Modules
import { MapFirstCore } from "@mapfirst.ai/core";

// Browser (CDN)
const { MapFirstCore } = window.MapFirstCore;
```

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
  };
}
```

### Example

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

## Methods

### attachMap

Attach a map instance to MapFirst.

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

### runPropertiesSearch

Search for properties by location.

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

### runSmartFilterSearch

AI-powered natural language search.

```typescript
runSmartFilterSearch(params: SmartSearchParams): Promise<void>
```

**Example:**

```javascript
await mapFirst.runSmartFilterSearch({
  query: "romantic restaurants with outdoor seating",
  city: "Rome",
  country: "Italy",
});
```

### performBoundsSearch

Search within current map bounds.

```typescript
performBoundsSearch(): Promise<void>
```

**Example:**

```javascript
await mapFirst.performBoundsSearch();
```

### setPrimaryType

Set the property type filter.

```typescript
setPrimaryType(type: 'Accommodation' | 'Restaurant' | 'Attraction'): void
```

**Example:**

```javascript
mapFirst.setPrimaryType("Attraction");
```

### setSelectedMarker

Select or deselect a property.

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

### flyMapTo

Animate map to a location.

```typescript
flyMapTo(lng: number, lat: number, zoom?: number): void
```

**Example:**

```javascript
// Fly to Eiffel Tower
mapFirst.flyMapTo(2.2945, 48.8584, 15);
```

### getState

Get current state snapshot.

```typescript
getState(): MapFirstState
```

**Example:**

```javascript
const state = mapFirst.getState();
console.log("Current properties:", state.properties);
console.log("Is searching:", state.isSearching);
```

### destroy

Clean up resources.

```typescript
destroy(): void
```

**Example:**

```javascript
mapFirst.destroy();
```

## Events / Callbacks

All callbacks are optional and passed during initialization.

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
onBoundsChange?: (bounds: Bounds) => void
```

### onSearchingStateChange

Called when search state changes.

```typescript
onSearchingStateChange?: (isSearching: boolean) => void
```

### onError

Called when an error occurs.

```typescript
onError?: (error: Error) => void
```

## Types

### Property

Represents a property (accommodation, restaurant, or attraction) returned from search results.

```typescript
interface Property {
  tripadvisor_id: number; // Unique TripAdvisor ID
  name: string; // Property name
  rating: number; // TripAdvisor rating (0-5)
  reviews: number; // Number of reviews
  location?: {
    // Geographic coordinates
    lat: number;
    lon: number;
  };
  type: PropertyType; // "Accommodation" | "Eat & Drink" | "Attraction"
  awards?: PropertyAward[]; // TripAdvisor awards (e.g., Travelers' Choice)
  pricing?: HotelPricingAPIResults; // Hotel pricing data when available
  url?: string; // Property URL
  secondaries: string[]; // Related property IDs
  price_level?: PriceLevel; // Price level indicator ($ to $$$$)
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
      award_type: "Travelers Choice Best of the Best",
      year: 2024,
      images: [{ key: "logo", url: "https://..." }],
    },
  ],
  price_level: "$$$",
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
interface PropertyAward {
  award_type: string; // Award name
  year: number; // Year awarded
  images: PropertyAwardImage[]; // Award badge images
}

interface PropertyAwardImage {
  key: string; // Image type (e.g., "logo")
  url: string; // Image URL
}
```

### PriceLevel

Price level indicator shown as dollar signs.

```typescript
type PriceLevel = "$" | "$$" | "$$$" | "$$$$";
```

### Bounds

```typescript
interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
```

## See Also

- [useMapFirst Hook](./use-mapfirst)
- [HTML Guide](../getting-started/html)
- [Examples](../examples/basic-map)
