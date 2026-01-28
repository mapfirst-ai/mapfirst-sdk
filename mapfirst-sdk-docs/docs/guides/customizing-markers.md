# Customizing Marker Styling

MapFirst SDK provides highly customizable map markers with built-in styles that can be overridden to match your application's design system.

## Marker Types

The SDK renders two types of markers:

1. **Primary Markers** - Pill-shaped markers displaying property information (prices, icons)
2. **Dot Markers** - Compact circular markers for secondary or clustered properties

## Built-in CSS Classes

The SDK automatically applies CSS classes to marker elements that you can target for customization:

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

## Customization Examples

### Change Primary Marker Colors

Override the default colors to match your brand:

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

### Customize Marker Shape and Size

Change the marker appearance:

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

### Style Dot Markers

Customize the appearance of dot markers:

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

### Customize Rating Badges

Style the rating score badges:

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

### Adjust Marker Shadows

Modify shadow effects for better visibility:

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

### Dark Mode Support

Create dark mode-friendly markers:

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

## Complete Example

Here's a complete example with custom styling:

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

## Best Practices

### 1. Maintain Contrast

Ensure sufficient contrast between marker colors and the map background for accessibility:

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

Keep animations and effects performant:

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

## Advanced: Dynamic Styling

For more complex styling needs, you can access marker elements programmatically:

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

## Troubleshooting

### Styles Not Applying

1. Ensure your custom CSS is loaded **after** the SDK's CSS
2. Check CSS specificity - you may need to increase specificity:

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

## Next Steps

- [Map Integration Guide](./map-integration.md) - Learn about map setup
- [Property Search](./searching.md) - Discover search capabilities
- [API Reference](/docs/api/core) - Explore SDK methods and options
