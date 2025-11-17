import type { ClusterDisplayItem } from "../../index";
import type { Property } from "../../types";
import { createDotMarkerElement } from "../../dotmarket";
import { createPrimaryMarkerElement } from "../../marker";

export type GoogleMapsMarkerHandle = any; // google.maps.marker.AdvancedMarkerElement

export type GoogleMapsNamespace = any; // typeof google.maps

type GoogleMapsMarkerManagerOptions = {
  mapInstance: any; // google.maps.Map
  google: GoogleMapsNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type MarkerEntry = {
  key: string;
  marker: GoogleMapsMarkerHandle;
  kind: "primary" | "dot";
  parentId?: number;
};

export class GoogleMapsMarkerManager {
  private readonly mapInstance: any; // google.maps.Map
  private readonly google: GoogleMapsNamespace;
  private readonly onMarkerClick?: (marker: Property) => void;
  private markerCache = new Map<string, MarkerEntry>();

  constructor(options: GoogleMapsMarkerManagerOptions) {
    this.mapInstance = options.mapInstance;
    this.google = options.google;
    this.onMarkerClick = options.onMarkerClick;
  }

  render(items: ClusterDisplayItem[]) {
    if (!this.google?.marker?.AdvancedMarkerElement) {
      console.warn("AdvancedMarkerElement not available");
      return;
    }

    // Create a set of keys for the new items
    const newKeys = new Set(items.map((item) => item.key));

    // Remove markers that are no longer needed
    for (const [key, entry] of this.markerCache.entries()) {
      if (!newKeys.has(key)) {
        try {
          entry.marker.map = null;
        } catch (error) {
          console.error("Error removing marker", error);
        }
        this.markerCache.delete(key);
      }
    }

    // Add or update markers
    for (const item of items) {
      const coords = safeLatLon(item.marker.location);
      if (!coords) continue;

      const existing = this.markerCache.get(item.key);

      if (existing) {
        // Update existing marker position if needed
        try {
          existing.marker.position = { lat: coords.lat, lng: coords.lon };
        } catch {
          // If update fails, remove and recreate
          try {
            existing.marker.map = null;
          } catch (error) {
            console.error("Error removing marker", error);
          }
          this.markerCache.delete(item.key);
          this.createAndAddMarker(item, coords);
        }
      } else {
        // Create new marker
        this.createAndAddMarker(item, coords);
      }
    }
  }

  destroy() {
    for (const entry of this.markerCache.values()) {
      try {
        entry.marker.map = null;
      } catch (error) {
        console.error("Error removing marker", error);
      }
    }
    this.markerCache.clear();
  }

  private createAndAddMarker(
    item: ClusterDisplayItem,
    coords: { lon: number; lat: number }
  ) {
    if (!this.google?.marker?.AdvancedMarkerElement) return;

    const element =
      item.kind === "primary"
        ? createPrimaryMarkerElement(item, this.onMarkerClick)
        : createDotMarkerElement(item, this.onMarkerClick);

    if (!element) return;

    try {
      const marker = new this.google.marker.AdvancedMarkerElement({
        map: this.mapInstance,
        position: { lat: coords.lat, lng: coords.lon },
        content: element,
        zIndex: item.kind === "primary" ? 20 : 10,
      });

      this.markerCache.set(item.key, {
        key: item.key,
        marker,
        kind: item.kind,
        parentId: item.kind === "dot" ? item.parentId : undefined,
      });
    } catch (error) {
      console.error("Error creating marker", error);
    }
  }
}

function safeLatLon(location?: { lon?: number; lat?: number }) {
  if (typeof location?.lon !== "number" || typeof location?.lat !== "number") {
    return null;
  }
  if (Number.isNaN(location.lon) || Number.isNaN(location.lat)) {
    return null;
  }
  return { lon: location.lon, lat: location.lat };
}
