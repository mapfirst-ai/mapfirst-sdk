---
sidebar_position: 1
---

# Welcome to MapFirst SDK

MapFirst SDK is a powerful, open-source mapping toolkit that brings **AI-powered property search**, **smart filters**, and **multi-platform map support** to your web applications — whether you're using React or plain HTML/JavaScript.

:::tip Ready to jump in?
If you want to start coding right away, head to the [React Setup](./getting-started/react) or [HTML Setup](./getting-started/html) guide.
:::

---

## What is MapFirst SDK?

MapFirst SDK lets you embed interactive maps with intelligent property search into any website. It connects to the MapFirst API to fetch hotels, restaurants, and attractions — complete with ratings, reviews, pricing, and images from Tripadvisor — and renders them as markers on a map you control.

You can search by **city and country**, by **coordinates and radius**, by **map bounds**, or even by **natural language** using the built-in AI search engine. The SDK handles marker rendering, state management, and API communication so you can focus on building your product.

---

## Packages

MapFirst SDK is split into two packages. Use one or both depending on your setup:

### `@mapfirst.ai/core`

The framework-agnostic foundation. Includes the `MapFirstCore` class, map adapters for all three platforms, search methods, image fetching, and all TypeScript types.

```bash
npm install @mapfirst.ai/core
```

**Use this if** you're working with vanilla JavaScript, or building your own framework integration.

### `@mapfirst.ai/react`

React hooks and components built on top of `@mapfirst.ai/core`. Includes the `useMapFirst` hook, the `SmartFilter` component, and helper utilities for filter processing.

```bash
npm install @mapfirst.ai/react
```

**Use this if** you're building a React, Next.js, or Remix application.

:::info Both packages together
The React package depends on Core, so you only need to install `@mapfirst.ai/react` — it will pull in Core automatically.
:::

---

## Supported Map Platforms

MapFirst SDK works with all three major web mapping libraries. Choose whichever fits your project:

| Platform           | Type                       | Best For                                       |
| ------------------ | -------------------------- | ---------------------------------------------- |
| **MapLibre GL JS** | Open-source, free          | Projects that want zero licensing costs        |
| **Mapbox GL JS**   | Commercial, token required | Premium cartography and design tools           |
| **Google Maps**    | Commercial, key required   | Teams already invested in the Google ecosystem |

You can switch between platforms with minimal code changes — the SDK abstracts away the differences.

---

## Key Features

- **🤖 AI-Powered Search** — Search with natural language queries like _"romantic hotels near the beach with a pool"_ and get smart, filterable results.
- **🗺️ Multi-Platform** — One API surface for MapLibre, Mapbox, and Google Maps. Write once, deploy anywhere.
- **⚛️ React Hooks** — The `useMapFirst` hook manages state, markers, and API calls. No boilerplate needed.
- **🏷️ Smart Filters** — Interactive filter chips generated from AI search results. Users can toggle and refine in real time.
- **📍 Rich Property Data** — Ratings, reviews, pricing, awards, and images from Tripadvisor for every property.
- **🔍 Flexible Search** — Search by city, coordinates, bounds, or natural language. Combine with price, rating, and type filters.
- **📱 Responsive & Accessible** — Mobile-first components with keyboard navigation and ARIA support out of the box.
- **🔒 Type-Safe** — Full TypeScript definitions for every function, hook, component, and data type.

---

## Quick Start

Here's the fastest way to get a working map on screen with React:

```tsx
import { useEffect, useRef } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { attachMapLibre, state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    map.on("load", () => {
      attachMapLibre(map, maplibregl, {
        onMarkerClick: (property) => console.log(property.name),
      });
    });

    return () => map.remove();
  }, [attachMapLibre]);

  return <div ref={mapRef} style={{ width: "100%", height: "600px" }} />;
}
```

:::tip Try it live
Open the [Playground](/playground) to experiment with the SDK in your browser — no setup required.
:::

---

## Where to Go Next

Pick the path that matches your project:

- **[React Setup](./getting-started/react)** — Step-by-step guide for React, Next.js, and Remix projects.
- **[HTML/JavaScript Setup](./getting-started/html)** — Drop-in `<script>` tag integration for any website.
- **[Map Integration Guide](./guides/map-integration)** — Detailed setup for MapLibre, Mapbox, and Google Maps.
- **[Searching Guide](./guides/searching)** — Learn properties search, smart search, and bounds search.
- **[SmartFilter Component](./components/smart-filter)** — Add AI-generated filter chips to your UI.
- **[API Reference](./api/use-mapfirst)** — Full hook and class documentation with TypeScript types.
- **[Examples](./examples/basic-map)** — Complete, copy-paste examples for common use cases.

---

## Getting Help

- **[GitHub Issues](https://github.com/mapfirst-ai/mapfirst-sdk/issues)** — Report bugs or request features.
- **[GitHub Discussions](https://github.com/mapfirst-ai/mapfirst-sdk/discussions)** — Ask questions and share ideas.
- **[Example Repository](https://github.com/mapfirst-ai/mapfirst-sdk-example)** — Full working projects you can clone and run.
