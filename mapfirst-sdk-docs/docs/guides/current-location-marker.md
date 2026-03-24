---
sidebar_position: 4
---

# Current Location Marker

Display a blue dot marker showing the user's current geographic location on the map.

## Overview

The `currentLocationMarker` option enables the SDK to display a blue dot marker on the map representing the user's current geographic location.

Permission flow is **client-driven**:

- Your app requests geolocation permission (for example, from an "Enable Location" button).
- Your app then notifies SDK by calling `onLocationPermissionResult(true | false)`.
- SDK reads coordinates (without prompting) and updates the marker state.

## Features

- **Permission-aware**: Respects browser geolocation permissions
- **Client-controlled prompting**: SDK does not own the permission prompt UX
- **Non-blocking**: Won't display an error if permission is denied
- **Startup check**: Automatically shows marker on map attach if permission is already granted
- **Blue dot styling**: Distinctive marker with pulse animation
- **State management**: Integrates with the MapState for reactive updates

## React Example (Client Prompts, SDK Syncs)

```typescript
import { useEffect, useRef, useState, useCallback } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapWithUserLocation() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Location permission not requested");

  const { attachMapLibre, instance: mapFirst, state } = useMapFirst({
    apiKey: "your-api-key",
    currentLocationMarker: true,
    initialLocationData: {
      city: "New York",
      country: "United States",
      currency: "USD",
    },
  });

  const syncCurrentLocation = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      return false;
    }

    return await new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          mapFirst.setUserLocation({ lat, lng });
          if (map) {
            mapFirst.flyMapTo(lng, lat, 13);
          }
          resolve(true);
        },
        () => {
          resolve(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
      );
    });
  }, [mapFirst, map]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
      attachMapLibre(mapInstance, maplibregl);
    });

    return () => mapInstance.remove();
  }, [attachMapLibre]);

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported in this browser");
      return;
    }

    setIsRequesting(true);
    setLocationStatus("Requesting location permission...");

    void (async () => {
      const synced = await syncCurrentLocation();
      setLocationStatus(synced ? "Location permission granted" : "Location temporarily unavailable");
      if (!synced) {
        mapFirst.setUserLocation(null);
      }
      setIsRequesting(false);
    })();
  };

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={requestLocationPermission}
          disabled={isRequesting}
          style={{ marginRight: "10px", padding: "8px 12px" }}
        >
          {isRequesting ? "Requesting..." : "Enable Location"}
        </button>
        <span style={{ fontSize: "14px", color: "#555" }}>
          {locationStatus}
        </span>
      </div>

      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "600px", marginBottom: "20px" }}
      />
      {state.userLocation && (
        <div
          style={{
            padding: "12px",
            background: "#f0f9ff",
            borderRadius: "4px",
            border: "1px solid #3b82f6",
          }}
        >
          <p style={{ margin: 0 }}>
            Your location: {state.userLocation.lat.toFixed(4)}, {state.userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}

export default MapWithUserLocation;
```

## Recommended Approach: Direct Location Sync

The simplest pattern is to use `setUserLocation` directly after obtaining coordinates:

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    mapFirst.setUserLocation({ lat, lng });
    // Optionally center the map on the user location
    mapFirst.flyMapTo(lng, lat, 13);
  },
  () => {
    // Handle permission denied or error
    mapFirst.setUserLocation(null);
  },
  { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
);
```

This approach:
- Directly sets user location when coordinates are obtained
- No need to check permission state separately
- Automatically triggers marker render
- Centers the map so the blue dot is visible

## Advanced: Permission-Only Sync (Legacy)

For cases where you need to sync permission state separately, `onLocationPermissionResult` is available but not recommended for typical use:

```typescript
await mapFirst.onLocationPermissionResult(true); // permission granted
await mapFirst.onLocationPermissionResult(false); // permission denied
```

This method returns `boolean` indicating whether coordinates were successfully resolved.

## With Location Change Callback

Listen for location updates using the `onUserLocationChange` callback:

```typescript
const { instance } = useMapFirst({
  apiKey: "your-api-key",
  currentLocationMarker: true,
  callbacks: {
    onUserLocationChange: (location) => {
      if (location) {
        console.log(`User location updated: ${location.lat}, ${location.lng}`);
      } else {
        console.log("User location unavailable");
      }
    },
  },
});
```

## Manual Location Handling

If you need more control over geolocation handling, use the exported utility functions:

```typescript
import { getLocationWhenGranted, getCurrentLocation } from "@mapfirst.ai/core";

// Option 1: Wait for permission grant
try {
  const position = await getLocationWhenGranted();
  console.log("Location:", position.coords.latitude, position.coords.longitude);
} catch (error) {
  console.error("Could not get location:", error);
}

// Option 2: Get location with timeout
const location = await getCurrentLocation(5000); // 5 second timeout
if (location) {
  console.log(`Got location: ${location.lat}, ${location.lng}`);
} else {
  console.log("Could not get location");
}
```

## Manual Location Update

You can also manually update the user location:

```typescript
import { MapFirstCore } from "@mapfirst.ai/core";

const mapFirst = new MapFirstCore({
  apiKey: "your-api-key",
});

// Set user location manually
mapFirst.setUserLocation({ lat: 40.7128, lng: -74.006 });

// Clear user location
mapFirst.setUserLocation(null);
```

## State Management

The user location is stored in `MapState.userLocation`:

```typescript
const { state } = useMapFirst({
  currentLocationMarker: true,
  callbacks: {
    onUserLocationChange: (location) => {
      // location is { lat: number, lng: number } | null
    },
  },
});

// Access current state
console.log(state.userLocation); // { lat: 40.7128, lng: -74.006 } or null
```

## Permission Flow

### How It Works

The SDK behavior follows this contract:

1. **Startup Check (no prompt)**

- If `currentLocationMarker: true`, SDK checks whether permission is already granted.
- If granted, SDK fetches coordinates and renders the blue dot.

2. **Client Prompt**

- Your app prompts permission using `navigator.geolocation.getCurrentPosition(...)`.
- App calls `onLocationPermissionResult(true | false)`.

3. **SDK Sync**

- `true`: SDK reads coordinates and updates marker.
- `false`: SDK clears marker state.

### Browser Support

The feature uses:

- **Permissions API** (for checking permission status)
- **Geolocation API** (for getting location)

Both are supported in all modern browsers. For older browsers or those without support, the feature gracefully degrades and the marker simply won't appear.

## Styling

The blue dot marker includes:

- **Blue center dot**: `#3B82F6` color
- **Pulsing animation**: 2-second animation cycle
- **Drop shadow**: For visibility on all map backgrounds
- **Z-index**: 1000 (stays above property markers)

### CSS Classes

If you need to customize the marker styles:

```css
.mapfirst-user-location-marker-container {
  /* Main container for the user location marker */
}

.mapfirst-user-location-dot {
  /* Inner dot element with SVG */
}
```

## Performance Considerations

- Location fetch is only attempted when permission is already granted, or after client confirms permission.
- The marker updates reactively when `userLocation` state changes
- Marker removal is automatic when `userLocation` becomes null
- No continuous polling — location is fetched on relevant permission/location sync events

## Advanced Examples

### Center Map on User Location

Automatically center the map on the user's location when it's available:

```typescript
useEffect(() => {
  if (state.userLocation && map) {
    map.flyTo({
      center: [state.userLocation.lng, state.userLocation.lat],
      zoom: 15,
      duration: 1500,
    });
  }
}, [state.userLocation, map]);
```

### Show Distance to Properties

Calculate and display distance from user location to properties:

```typescript
function distanceToUser(
  property: Property,
  userLocation?: { lat: number; lng: number },
): number | null {
  if (!userLocation || !property.location) return null;

  const lat1 = userLocation.lat;
  const lon1 = userLocation.lng;
  const lat2 = property.location.lat;
  const lon2 = property.location.lon;

  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlon / 2) *
      Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}
```

### Filter Nearby Properties

Show only properties within a certain distance:

```typescript
function NearbyProperties() {
  const { state } = useMapFirst({ currentLocationMarker: true });
  const maxDistance = 10; // km

  const nearbyProperties = state.userLocation
    ? state.properties.filter((prop) => {
        const distance = distanceToUser(prop, state.userLocation);
        return distance !== null && distance <= maxDistance;
      })
    : [];

  return (
    <div>
      {state.userLocation ? (
        <p>
          Found {nearbyProperties.length} properties within {maxDistance}km
        </p>
      ) : (
        <p>Waiting for location permission...</p>
      )}
    </div>
  );
}
```

## Troubleshooting

### Marker Not Appearing

Check the following:

1. **HTTPS Required**: Geolocation API requires HTTPS in production (localhost is allowed for development)
2. **Permission Denied**: User may have denied location permission in browser settings
3. **Client Sync Missing**: After prompt, ensure app calls `onLocationPermissionResult(true)`
4. **Not Enabled**: Ensure `currentLocationMarker: true` is set in options

### Testing on Localhost

You can test geolocation on `http://localhost:3000` during development. In production, your site must be served over HTTPS.

### Permissions Management

Users can manage location permissions in their browser settings:

- **Chrome/Edge**: Settings > Privacy and security > Site Settings > Location
- **Firefox**: Preferences > Privacy & Security > Permissions > Location
- **Safari**: Preferences > Privacy > Location Services

Users can also reset permissions for your app and try again.

## Next Steps

- **[useMapFirst API](../api/use-mapfirst)** — Full hook reference with all parameters
- **[Map Integration Guide](./map-integration)** — Set up different map providers
- **[Searching Guide](./searching)** — Combine location marker with property search
- **[Basic Map Example](../examples/basic-map)** — Complete working example
