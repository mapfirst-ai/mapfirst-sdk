---
sidebar_position: 2
---

# Map Integration

Learn how to integrate MapFirst SDK with different mapping platforms.

## Supported Platforms

MapFirst SDK supports three major mapping platforms:

- **MapLibre GL JS** - Open-source, free
- **Mapbox GL JS** - Commercial, requires API token
- **Google Maps** - Commercial, requires API key

## MapLibre GL JS

### Installation

```bash
npm install maplibre-gl
```

### React Integration

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapLibreMap() {
  const mapContainerRef = useRef(null);
  const { attachMapLibre } = useMapFirst({
    adapter: null,
    initialLocationData: {
      city: "London",
      country: "UK",
    },
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [-0.1278, 51.5074],
      zoom: 12,
    });

    map.on("load", () => {
      attachMapLibre(map, {
        onMarkerClick: (property) => {
          console.log("Clicked:", property);
        },
      });
    });

    return () => map.remove();
  }, [attachMapLibre]);

  return <div ref={mapContainerRef} style={{ height: "100vh" }} />;
}
```

### Custom Styles

```typescript
const map = new maplibregl.Map({
  container: mapContainerRef.current,
  // Use your own style
  style: "https://api.maptiler.com/maps/basic/style.json?key=YOUR_KEY",
  // Or local style
  style: "/path/to/style.json",
  center: [lng, lat],
  zoom: 12,
});
```

## Mapbox GL JS

### Installation

```bash
npm install mapbox-gl
```

### React Integration

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

function MapboxMap() {
  const mapContainerRef = useRef(null);
  const { attachMapbox } = useMapFirst({
    adapter: null,
    initialLocationData: {
      city: "New York",
      country: "USA",
    },
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    map.on("load", () => {
      attachMapbox(map, {
        onMarkerClick: (property) => {
          new mapboxgl.Popup()
            .setHTML(`<h3>${property.name}</h3>`)
            .setLngLat([property.location.lng, property.location.lat])
            .addTo(map);
        },
      });
    });

    return () => map.remove();
  }, [attachMapbox]);

  return <div ref={mapContainerRef} style={{ height: "100vh" }} />;
}
```

### Available Styles

```typescript
// Mapbox built-in styles
"mapbox://styles/mapbox/streets-v12";
"mapbox://styles/mapbox/outdoors-v12";
"mapbox://styles/mapbox/light-v11";
"mapbox://styles/mapbox/dark-v11";
"mapbox://styles/mapbox/satellite-v9";
"mapbox://styles/mapbox/satellite-streets-v12";
```

## Google Maps

### Installation

```bash
npm install @googlemaps/js-api-loader
```

### React Integration

```typescript
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import { Loader } from "@googlemaps/js-api-loader";

function GoogleMapComponent() {
  const mapContainerRef = useRef(null);
  const { attachGoogle } = useMapFirst({
    adapter: null,
    initialLocationData: {
      city: "Tokyo",
      country: "Japan",
    },
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
      version: "weekly",
      libraries: ["marker"],
    });

    loader.load().then(() => {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 12,
        mapId: "YOUR_MAP_ID",
      });

      attachGoogle(map, {
        onMarkerClick: (property) => {
          const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${property.name}</h3>`,
          });
          infoWindow.setPosition({
            lat: property.location.lat,
            lng: property.location.lng,
          });
          infoWindow.open(map);
        },
      });
    });
  }, [attachGoogle]);

  return <div ref={mapContainerRef} style={{ height: "100vh" }} />;
}
```

## Map Controls

### Add Navigation Controls

**MapLibre/Mapbox:**

```typescript
map.addControl(new maplibregl.NavigationControl());
// or
map.addControl(new mapboxgl.NavigationControl());
```

**Google Maps:**

```typescript
const map = new google.maps.Map(container, {
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
});
```

### Add Geolocation

**MapLibre/Mapbox:**

```typescript
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);
```

**Google Maps:**

```typescript
navigator.geolocation.getCurrentPosition((position) => {
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  map.setCenter(pos);
});
```

## Handling Map Events

### MapLibre/Mapbox Events

```typescript
map.on("load", () => {
  console.log("Map loaded");
});

map.on("click", (e) => {
  console.log("Clicked:", e.lngLat);
});

map.on("moveend", () => {
  console.log("Movement ended");
});

map.on("zoom", () => {
  console.log("Zoom level:", map.getZoom());
});
```

### Google Maps Events

```typescript
map.addListener("click", (e) => {
  console.log("Clicked:", e.latLng.toJSON());
});

map.addListener("center_changed", () => {
  console.log("Center:", map.getCenter().toJSON());
});

map.addListener("zoom_changed", () => {
  console.log("Zoom:", map.getZoom());
});
```

## Custom Markers

MapFirst SDK manages markers automatically, but you can customize their appearance:

```typescript
attachMapLibre(map, {
  onMarkerClick: (property) => {
    console.log(property);
  },
  markerStyle: {
    color: "#FF0000",
    scale: 1.2,
  },
});
```

## Performance Tips

1. **Lazy load maps** - Only initialize when needed
2. **Cleanup on unmount** - Always call `map.remove()`
3. **Debounce events** - Avoid excessive updates on zoom/pan
4. **Limit visible markers** - Use clustering for many markers
5. **Optimize styles** - Use vector tiles instead of raster

## See Also

- [Getting Started - React](../getting-started/react)
- [Getting Started - HTML](../getting-started/html)
- [Examples](../examples/basic-map)
