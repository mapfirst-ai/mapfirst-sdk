# Customizing Marker Styling

MapFirst SDK renders interactive map markers automatically when properties are loaded. Every marker element is styled with CSS classes that you can override to match your brand, design system, or theme — no JavaScript required.

:::tip No custom rendering needed
You don't need to create your own marker elements. The SDK handles all marker rendering internally. This guide is about **styling** the markers that the SDK creates for you, using plain CSS overrides.
:::

---

## Marker Types

The SDK renders two types of markers:

1. **Primary Markers** - Pill-shaped markers displaying property information (prices, icons)
2. **Dot Markers** - Compact circular markers for secondary or clustered properties

## Built-in CSS Classes

The SDK applies well-named CSS classes to every marker element. Target these in your own stylesheet to change colors, sizes, shadows, and animations:

### Primary Marker Classes

| Class                              | Description                           |
| ---------------------------------- | ------------------------------------- |
| `.mapfirst-marker-root`            | Root container for primary markers    |
| `.mapfirst-marker-pill`            | The pill-shaped marker element        |
| `.mapfirst-marker-pill-pending`    | Applied when pricing data is loading  |
| `.mapfirst-marker-pill-active`     | Applied when marker is interactive    |
| `.mapfirst-marker-non-primary`     | Applied to non-primary property types |
| `.mapfirst-marker-selected`        | Applied when marker is selected       |
| `.mapfirst-marker-badge`           | Container for rating/award badges     |
| `.mapfirst-marker-rating-badge`    | Rating score badge                    |
| `.mapfirst-marker-award-container` | Award icon container                  |
| `.mapfirst-marker-content`         | Content area (price or icon)          |

### Dot Marker Classes

| Class                                 | Description                           |
| ------------------------------------- | ------------------------------------- |
| `.mapfirst-dot-marker-container`      | Root container for dot markers        |
| `.mapfirst-dot-marker-button`         | The circular dot element              |
| `.mapfirst-dot-marker-button-pending` | Applied when data is loading          |
| `.mapfirst-dot-marker-button-active`  | Applied when marker is interactive    |
| `.mapfirst-dot-marker-non-primary`    | Applied to non-primary property types |
| `.mapfirst-dot-marker-selected`       | Applied when marker is selected       |

---

## Customization Examples

### Change Primary Marker Colors

Override the default colors to match your brand. These three rules cover the most common use case:

```css
/* Active markers */
.mapfirst-marker-pill-active {
  background: #1a73e8; /* Google Blue */
  border-color: #ffffff;
  color: #ffffff;
}

/* Selected marker */
.mapfirst-marker-pill-active.mapfirst-marker-selected {
  background: #ffffff;
  border-color: #1a73e8;
  color: #1a73e8;
  transform: scale(1.2);
}

/* Non-primary property types */
.mapfirst-marker-pill-active.mapfirst-marker-non-primary {
  background: rgba(26, 115, 232, 0.1);
  border-color: rgba(26, 115, 232, 0.5);
  color: rgba(26, 115, 232, 0.8);
}
```

---

### Customize Marker Shape and Size

Adjust padding, border-radius, and font-size to change how markers look at every zoom level:

```css
/* Make markers more rounded */
.mapfirst-marker-pill {
  border-radius: 12px; /* Less rounded than default */
  padding: 6px 12px; /* Smaller padding */
  font-size: 14px; /* Smaller text */
}

/* Increase hover scale effect */
.mapfirst-marker-pill-active:hover {
  transform: scale(1.3);
}
```

---

### Style Dot Markers

Dot markers are used for secondary or clustered properties. They're simpler but still fully customizable:

```css
/* Larger dots */
.mapfirst-dot-marker-button {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

/* Custom colors */
.mapfirst-dot-marker-button-active {
  background: #ff6b6b; /* Coral red */
  border-color: #ffffff;
}

/* Selected dot style */
.mapfirst-dot-marker-button-active.mapfirst-dot-marker-selected {
  background: #ffffff;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.2);
}
```

---

### Customize Rating Badges

Rating badges appear above markers for highly-rated properties. Style them to stand out:

```css
.mapfirst-marker-rating-badge {
  background: #ff9500; /* Orange */
  color: #ffffff;
  font-size: 11px;
  padding: 3px 7px;
  border-width: 1px;
  font-weight: 600;
}
```

---

### Adjust Marker Shadows

Shadows help markers stand out against the map. Tune them for your preferred level of depth:

```css
/* Softer shadow */
.mapfirst-marker-pill {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Stronger shadow for selected markers */
.mapfirst-marker-pill-active.mapfirst-marker-selected {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

---

### Dark Mode Support

Use `prefers-color-scheme` to automatically switch marker colors in dark mode:

```css
@media (prefers-color-scheme: dark) {
  .mapfirst-marker-pill-active {
    background: #2d3748;
    border-color: #4a5568;
    color: #ffffff;
  }

  .mapfirst-marker-pill-active.mapfirst-marker-selected {
    background: #4a5568;
    border-color: #63b3ed;
    color: #63b3ed;
  }

  .mapfirst-dot-marker-button-active {
    background: #2d3748;
    border-color: #4a5568;
  }
}
```

---

## Complete Example

Here's a complete example showing a React component with a custom purple marker theme. The CSS file is loaded alongside the component:

```tsx
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./custom-markers.css"; // Your custom styles

function MapComponent() {
  const { instance: mapFirst } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "USD",
    },
  });

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://api.mapfirst.ai/static/style.json",
      zoom: 12,
      center: [2.3522, 48.8566],
    });

    map.on("load", () => {
      mapFirst.attachMap(map, {
        platform: "maplibre",
        maplibregl: maplibregl,
      });
    });
  }, [mapFirst]);

  return <div id="map" style={{ height: "600px" }} />;
}
```

**custom-markers.css:**

```css
/* Primary markers - purple theme */
.mapfirst-marker-pill-active {
  background: #7c3aed;
  border-color: #ffffff;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.mapfirst-marker-pill-active.mapfirst-marker-selected {
  background: #ffffff;
  border-color: #7c3aed;
  color: #7c3aed;
  transform: scale(1.25);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.5);
}

.mapfirst-marker-pill-active:hover {
  transform: scale(1.25);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.5);
}

/* Non-primary properties - lighter purple */
.mapfirst-marker-pill-active.mapfirst-marker-non-primary {
  background: rgba(124, 58, 237, 0.15);
  border-color: rgba(124, 58, 237, 0.5);
  color: #7c3aed;
}

/* Rating badges */
.mapfirst-marker-rating-badge {
  background: #fbbf24;
  color: #000000;
  font-weight: 700;
}

/* Dot markers */
.mapfirst-dot-marker-button-active {
  background: #7c3aed;
  border-color: #ffffff;
}

.mapfirst-dot-marker-button-active.mapfirst-dot-marker-selected {
  background: #ffffff;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3);
}
```

---

## Best Practices

:::caution Accessibility matters
Markers are interactive UI elements. Always ensure sufficient color contrast, visible focus states, and distinct selected/hover states so all users can identify and interact with them.
:::

### 1. Maintain Contrast

Ensure sufficient contrast between marker colors and the map background:

```css
.mapfirst-marker-pill-active {
  /* Good contrast against light map styles */
  background: #1a202c;
  color: #ffffff;
}
```

### 2. Preserve Interactive States

Keep hover and selected states visually distinct:

```css
/* Default state */
.mapfirst-marker-pill-active {
  background: #3b82f6;
}

/* Hover state - brighter */
.mapfirst-marker-pill-active:hover {
  background: #60a5fa;
}

/* Selected state - inverted */
.mapfirst-marker-pill-active.mapfirst-marker-selected {
  background: #ffffff;
  color: #3b82f6;
}
```

### 3. Test Zoom Levels

Ensure markers remain visible and appropriately sized at different zoom levels:

```css
/* Adjust size based on zoom using JavaScript if needed */
/* Or use CSS transforms for consistent scaling */
.mapfirst-marker-pill {
  transform-origin: center bottom;
  transition: transform 0.2s ease;
}
```

### 4. Consider Performance

Keep animations GPU-accelerated and avoid expensive properties like `filter` or `clip-path` on markers:

```css
/* Use GPU-accelerated properties */
.mapfirst-marker-pill {
  transform: translateZ(0);
  will-change: transform;
  transition: transform 0.2s ease;
}
```

### 5. Match Your Design System

Coordinate marker styles with your application's overall design:

```css
/* Use CSS variables for consistency */
:root {
  --brand-primary: #0ea5e9;
  --brand-secondary: #64748b;
}

.mapfirst-marker-pill-active {
  background: var(--brand-primary);
}

.mapfirst-marker-pill-active.mapfirst-marker-non-primary {
  background: var(--brand-secondary);
}
```

---

## Advanced: Dynamic Styling

For styling that depends on property data (e.g., highlighting premium properties), you can access marker elements programmatically via callbacks:

```tsx
const { instance: mapFirst } = useMapFirst({
  apiKey: "your-api-key",
  callbacks: {
    onPropertiesChange: (properties) => {
      // Custom logic to style markers based on property data
      properties.forEach((property) => {
        const element = document.querySelector(`[title="${property.name}"]`);
        if (element && property.price_level > 3) {
          element.classList.add("premium-marker");
        }
      });
    },
  },
});
```

---

## Troubleshooting

### Styles Not Applying

:::info CSS load order matters
Your custom CSS must be loaded **after** the SDK's built-in styles. If you're using a CSS module or scoped styles, make sure the selectors are global (not scoped to a component).
:::

If your overrides still aren't working, increase CSS specificity:

```css
/* More specific selector */
.mapfirst-marker-root .mapfirst-marker-pill-active {
  background: #custom-color;
}
```

### Marker Performance Issues

If you experience performance issues with many markers:

1. Simplify animations and transitions
2. Reduce shadow complexity
3. Use `will-change` sparingly
4. Consider disabling hover effects on mobile

```css
@media (hover: none) {
  .mapfirst-marker-pill-active:hover {
    transform: none; /* Disable hover on touch devices */
  }
}
```

---

## Next Steps

- **[Map Integration Guide](./map-integration)** — Set up MapLibre, Mapbox, or Google Maps.
- **[Searching Guide](./searching)** — Learn all three search methods.
- **[Fetching Images](./fetching-images)** — Display property photos alongside your styled markers.
- **[API Reference](../api/core)** — Full SDK method and type documentation.
