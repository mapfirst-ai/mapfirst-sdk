---
sidebar_position: 1
---

# useMapFirst Hook

The unified React hook for MapFirst SDK that provides all functionality in one place.

## Import

```typescript
import { useMapFirst } from '@mapfirst/react';
```

## Usage

```typescript
const {
  instance,
  state,
  setPrimaryType,
  setSelectedMarker,
  propertiesSearch,
  smartFilterSearch,
  boundsSearch,
  attachMapLibre,
  attachGoogle,
  attachMapbox,
} = useMapFirst(config);
```

## Parameters

### config

Configuration object for initializing MapFirst.

```typescript
interface MapFirstConfig {
  adapter: any | null;
  initialLocationData?: {
    city?: string;
    country?: string;
    currency?: string;
  };
  environment?: 'dev' | 'prod';
  callbacks?: {
    onPropertiesChange?: (properties: Property[]) => void;
    onSelectedPropertyChange?: (id: number | null) => void;
    onBoundsChange?: (bounds: Bounds) => void;
    onSearchingStateChange?: (isSearching: boolean) => void;
    onError?: (error: Error) => void;
  };
}
```

## Return Values

### instance

The underlying MapFirstCore instance. Use this for advanced operations not covered by other methods.

```typescript
instance: MapFirstCore | null
```

### state

Current state of the MapFirst SDK.

```typescript
interface MapFirstState {
  properties: Property[];
  selectedProperty: number | null;
  isSearching: boolean;
  bounds: Bounds | null;
  primaryType: 'Accommodation' | 'Restaurant' | 'Attraction';
}
```

### setPrimaryType

Set the primary property type filter.

```typescript
setPrimaryType: (type: 'Accommodation' | 'Restaurant' | 'Attraction') => void
```

**Example:**
```typescript
setPrimaryType('Restaurant');
```

### setSelectedMarker

Select or deselect a property marker.

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

### propertiesSearch

Search for properties by location and filters.

```typescript
propertiesSearch: (params: SearchParams) => Promise<void>
```

**Parameters:**
```typescript
interface SearchParams {
  body: {
    city: string;
    country: string;
    filters?: {
      checkIn?: string;      // ISO date format
      checkOut?: string;     // ISO date format
      numAdults?: number;
      numChildren?: number;
      numRooms?: number;
      currency?: string;
      minPrice?: number;
      maxPrice?: number;
    };
  };
}
```

**Example:**
```typescript
await propertiesSearch({
  body: {
    city: 'Paris',
    country: 'France',
    filters: {
      checkIn: '2024-06-01',
      checkOut: '2024-06-07',
      numAdults: 2,
      currency: 'EUR'
    }
  }
});
```

### smartFilterSearch

Natural language search powered by AI.

```typescript
smartFilterSearch: (params: SmartSearchParams) => Promise<void>
```

**Parameters:**
```typescript
interface SmartSearchParams {
  query: string;
  city?: string;
  country?: string;
}
```

**Example:**
```typescript
await smartFilterSearch({
  query: 'hotels near eiffel tower with pool',
  city: 'Paris',
  country: 'France'
});
```

### boundsSearch

Search properties within current map bounds.

```typescript
boundsSearch: () => Promise<void>
```

**Example:**
```typescript
// Search visible area
await boundsSearch();
```

### attachMapLibre

Attach a MapLibre GL JS map.

```typescript
attachMapLibre: (map: maplibregl.Map, options: AttachOptions) => void
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
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [2.3522, 48.8566],
  zoom: 12
});

map.on('load', () => {
  attachMapLibre(map, {
    onMarkerClick: (property) => {
      console.log('Clicked:', property.name);
    }
  });
});
```

### attachGoogle

Attach a Google Maps instance.

```typescript
attachGoogle: (map: google.maps.Map, options: AttachOptions) => void
```

**Example:**
```typescript
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 48.8566, lng: 2.3522 },
  zoom: 12,
  mapId: 'YOUR_MAP_ID'
});

attachGoogle(map, {
  onMarkerClick: (property) => {
    console.log('Clicked:', property.name);
  }
});
```

### attachMapbox

Attach a Mapbox GL JS map.

```typescript
attachMapbox: (map: mapboxgl.Map, options: AttachOptions) => void
```

**Example:**
```typescript
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [2.3522, 48.8566],
  zoom: 12
});

map.on('load', () => {
  attachMapbox(map, {
    onMarkerClick: (property) => {
      console.log('Clicked:', property.name);
    }
  });
});
```

## Property Object

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
  type: 'Accommodation' | 'Restaurant' | 'Attraction';
  address?: string;
  photos?: string[];
  amenities?: string[];
}
```

## See Also

- [MapFirstCore API](./core)
- [React Guide](../getting-started/react)
- [Search Examples](../examples/searching)
