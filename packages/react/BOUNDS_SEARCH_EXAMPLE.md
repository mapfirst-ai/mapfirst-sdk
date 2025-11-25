# Bounds Search Example

This example demonstrates how to use the `performBoundsSearch` functionality to allow users to search properties within the visible map bounds.

## Basic Usage

```tsx
import React from "react";
import { useMapFirstCore, useMapFirstBoundsSearch } from "@mapfirst.ai/react";

function MapWithBoundsSearch() {
  const { mapFirst, state } = useMapFirstCore({
    mfid: "your-mfid",
    environment: "prod",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  const { performBoundsSearch, isSearching } =
    useMapFirstBoundsSearch(mapFirst);

  return (
    <div>
      {/* Map component */}
      <div id="map" style={{ width: "100%", height: "500px" }}>
        {/* Your map rendering here */}
      </div>

      {/* Show search button when user has moved the map */}
      {state.pendingBounds && !isSearching && (
        <button
          onClick={() => performBoundsSearch()}
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Search this area
        </button>
      )}

      {/* Loading indicator */}
      {isSearching && (
        <div style={{ padding: "10px", textAlign: "center" }}>Searching...</div>
      )}

      {/* Properties list */}
      <div>
        <h3>Properties ({state.properties.length})</h3>
        <ul>
          {state.properties.map((property) => (
            <li key={property.tripadvisor_id}>
              {property.name} - {property.type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MapWithBoundsSearch;
```

## Advanced Usage with Map Integration

Here's a complete example integrating with Mapbox GL JS:

```tsx
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import {
  useMapFirstCore,
  useMapFirstBoundsSearch,
  useMapFirstAttachMapbox,
} from "@mapfirst.ai/react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "your-mapbox-token";

function MapboxBoundsSearchExample() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const { mapFirst, state } = useMapFirstCore({
    mfid: "your-mfid",
    environment: "prod",
    platform: "mapbox",
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const { performBoundsSearch, isSearching } =
    useMapFirstBoundsSearch(mapFirst);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.006, 40.7128], // NYC
      zoom: 12,
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Attach MapFirst to the map
  useMapFirstAttachMapbox(mapFirst, mapRef.current, mapboxgl, {
    onMarkerClick: (property) => {
      console.log("Clicked property:", property);
    },
  });

  // Update pendingBounds when map moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapFirst) return;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const mapBounds = {
        sw: { lat: sw.lat, lng: sw.lng },
        ne: { lat: ne.lat, lng: ne.lng },
      };

      // Check if bounds changed significantly
      const currentBounds = state.bounds;
      if (!currentBounds || boundsChanged(currentBounds, mapBounds)) {
        mapFirst.setPendingBounds(mapBounds);
      }
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [mapFirst, state.bounds]);

  const handleSearchClick = async () => {
    const result = await performBoundsSearch();
    if (result) {
      console.log("Search completed:", result);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {/* Search this area button */}
      {state.pendingBounds && !state.isSearching && (
        <button
          onClick={handleSearchClick}
          disabled={isSearching}
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            background: "white",
            border: "2px solid #2c3e50",
            borderRadius: "24px",
            cursor: isSearching ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
            zIndex: 1000,
          }}
        >
          {isSearching ? "Searching..." : "Search this area"}
        </button>
      )}

      {/* Properties panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          maxHeight: "200px",
          overflowY: "auto",
          padding: "16px",
          borderTop: "1px solid #ddd",
          zIndex: 1000,
        }}
      >
        <h3>Properties ({state.properties.length})</h3>
        {state.properties.length === 0 ? (
          <p>No properties found. Try moving the map or adjusting filters.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {state.properties.slice(0, 10).map((property) => (
              <li
                key={property.tripadvisor_id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (mapFirst) {
                    mapFirst.setSelectedMarker(property.tripadvisor_id);
                    if (property.location) {
                      mapFirst.flyMapTo(
                        property.location.lon,
                        property.location.lat,
                        14
                      );
                    }
                  }
                }}
              >
                <strong>{property.name}</strong>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {property.type} • Rating: {property.rating || "N/A"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Helper function to check if bounds changed significantly
function boundsChanged(
  bounds1: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  },
  bounds2: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  }
): boolean {
  const delta = 0.01; // Minimum change threshold
  return (
    Math.abs(bounds1.sw.lat - bounds2.sw.lat) > delta ||
    Math.abs(bounds1.sw.lng - bounds2.sw.lng) > delta ||
    Math.abs(bounds1.ne.lat - bounds2.ne.lat) > delta ||
    Math.abs(bounds1.ne.lng - bounds2.ne.lng) > delta
  );
}

export default MapboxBoundsSearchExample;
```

## How It Works

### 1. Bounds Tracking

The SDK automatically tracks three types of bounds:

- **`bounds`**: The last bounds that were successfully searched
- **`pendingBounds`**: New bounds detected when the user moves the map
- **`tempBounds`**: Temporary bounds during animations

### 2. Triggering a Search

When `pendingBounds` is set (map has moved), you can call `performBoundsSearch()` to:

1. Search for properties within the new bounds
2. Update the properties list
3. Set `bounds` to the current `pendingBounds`
4. Clear `pendingBounds`

### 3. State Flow

```
User moves map
    ↓
setPendingBounds() called
    ↓
UI shows "Search this area" button
    ↓
User clicks button
    ↓
performBoundsSearch() called
    ↓
API request with bounds
    ↓
Properties updated
    ↓
bounds = pendingBounds
    ↓
pendingBounds = null
```

## API Reference

### `useMapFirstBoundsSearch(mapFirst)`

Returns:

```typescript
{
  performBoundsSearch: () => Promise<APIResponse | null>;
  isSearching: boolean;
  error: Error | null;
}
```

### Core Methods

```typescript
// Set pending bounds when map moves
mapFirst.setPendingBounds(bounds: MapBounds | null);

// Get current state
const state = mapFirst.getState();
// state.pendingBounds - New bounds to search
// state.bounds - Last searched bounds
// state.tempBounds - Temporary bounds during animation

// Manually trigger bounds search
await mapFirst.performBoundsSearch();
```

## Best Practices

1. **Debounce map movements**: Avoid setting `pendingBounds` on every tiny map movement
2. **Show visual feedback**: Display a button or banner when `pendingBounds` exists
3. **Handle errors**: Use the `error` state from the hook
4. **Loading states**: Use `isSearching` to disable the button during searches
5. **Clear on cancel**: Allow users to dismiss the pending bounds without searching

## See Also

- [Core SDK Documentation](../core/README.md)
- [React Hooks Documentation](./README.md)
- [SmartFilter Example](./SMARTFILTER.md)
