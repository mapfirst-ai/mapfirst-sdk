---
sidebar_position: 2
---

# MapFirstCore API

Core JavaScript API for MapFirst SDK. Works in both React and vanilla JavaScript environments.

## Import

```javascript
// ES Modules
import { MapFirstCore } from "@mapfirst/core";

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
  adapter: any | null;
  initialLocationData?: {
    city?: string;
    country?: string;
    currency?: string;
  };
  environment?: "dev" | "prod";
  callbacks?: {
    onPropertiesChange?: (properties: Property[]) => void;
    onSelectedPropertyChange?: (id: number | null) => void;
    onBoundsChange?: (bounds: Bounds) => void;
    onSearchingStateChange?: (isSearching: boolean) => void;
    onError?: (error: Error) => void;
  };
}
```

### Example

```javascript
const mapFirst = new MapFirstCore({
  adapter: null,
  initialLocationData: {
    city: "Paris",
    country: "France",
    currency: "EUR",
  },
  environment: "prod",
  callbacks: {
    onPropertiesChange: (properties) => {
      console.log("Properties updated:", properties);
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

```typescript
interface Property {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  price?: number;
  currency?: string;
  type: "Accommodation" | "Restaurant" | "Attraction";
  address?: string;
  photos?: string[];
  amenities?: string[];
}
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
