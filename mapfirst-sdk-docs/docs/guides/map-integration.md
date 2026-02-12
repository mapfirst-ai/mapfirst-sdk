---
sidebar_position: 2
---

# Map Integration

MapFirst SDK works with all three major web mapping libraries. This guide shows you how to set up each one, add controls, handle events, and optimize performance.

:::tip Which platform should I choose?
- **MapLibre GL JS** — Free, open-source, no API key required for the map itself. Best default choice.
- **Mapbox GL JS** — Premium cartography with a generous free tier. Requires an access token.
- **Google Maps** — Industry standard with the largest user base. Requires an API key and Map ID.

You can switch between platforms later with minimal code changes — the MapFirst SDK abstracts away the differences.
:::

---

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
    apiKey: "your-api-key",
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

:::caution Don't forget the CSS import
MapLibre (and Mapbox) require their CSS file to render correctly. Without it, the map canvas will appear but tiles and controls will be broken.
:::

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

---

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
    apiKey: "your-api-key",
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

:::info Mapbox access token
You need a Mapbox access token to use Mapbox GL JS. Get one for free at [account.mapbox.com](https://account.mapbox.com). The token is set globally via `mapboxgl.accessToken`.
:::

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

---

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
    apiKey: "your-api-key",
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

:::info Google Maps Map ID
Google Maps requires a **Map ID** when using Advanced Markers (which MapFirst uses for rendering). Create one in the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/studio/maps).
:::

---

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
  }),
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

---

## Handling Map Events

You can listen to native map events alongside MapFirst SDK events. This is useful for building custom UI that responds to user interactions.

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

---

## Custom Markers

MapFirst SDK manages markers automatically, but you can customize their appearance. For full marker styling options, see the [Customizing Markers guide](./customizing-markers).

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

---

## Performance Tips

:::tip Keep your maps fast
Follow these guidelines to ensure smooth rendering, especially on mobile devices and pages with many markers.
:::

1. **Lazy load maps** — Only initialize the map when it scrolls into view or when the user navigates to the map page.
2. **Clean up on unmount** — Always call `map.remove()` in your React `useEffect` cleanup to free GPU memory and event listeners.
3. **Debounce events** — Avoid excessive API calls on zoom/pan by debouncing `moveend` events (300–500ms works well).
4. **Limit visible markers** — The SDK handles this internally, but if you add your own markers, consider clustering for large datasets.
5. **Use vector tiles** — Vector tile styles (like MapLibre's default) render faster and use less bandwidth than raster tiles.

---

## Next Steps

- **[Getting Started — React](../getting-started/react)** — Full React integration guide.
- **[Getting Started — HTML](../getting-started/html)** — Vanilla JavaScript setup.
- **[Customizing Markers](./customizing-markers)** — Style markers to match your brand.
- **[Searching Guide](./searching)** — Learn all three search methods.
- **[Examples](../examples/basic-map)** — Complete, runnable examples.
