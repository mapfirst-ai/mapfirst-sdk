import type { Property } from "../../types";
import { createDotMarkerElement } from "../../dotmarket";
import { createPrimaryMarkerElement } from "../../marker";
import { ClusterDisplayItem } from "../../utils/clustering";

export type MapLibreMarkerHandle = {
  setLngLat(lngLat: [number, number]): MapLibreMarkerHandle;
  addTo(map: any): MapLibreMarkerHandle;
  remove(): void;
  getElement(): HTMLElement;
};

export type MapLibreNamespace = {
  Marker: new (options?: {
    element?: HTMLElement;
    anchor?: string;
  }) => MapLibreMarkerHandle;
};

type MapLibreMarkerManagerOptions = {
  mapInstance: any;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type MarkerEntry = {
  key: string;
  marker: MapLibreMarkerHandle;
  kind: "primary" | "dot";
  parentId?: number;
};

export class MapLibreMarkerManager {
  private readonly mapInstance: any;
  private readonly MarkerCtor?: MapLibreNamespace["Marker"];
  private readonly onMarkerClick?: (marker: Property) => void;
  private markerCache = new Map<string, MarkerEntry>();
  private primaryType: string = "Accommodation";

  constructor(options: MapLibreMarkerManagerOptions) {
    this.mapInstance = options.mapInstance;
    this.MarkerCtor = options.maplibregl?.Marker;
    this.onMarkerClick = options.onMarkerClick;
  }

  render(items: ClusterDisplayItem[], primaryType?: string) {
    if (primaryType) {
      this.primaryType = primaryType;
    }
    if (!this.MarkerCtor) {
      return;
    }

    // Create a set of keys for the new items
    const newKeys = new Set(items.map((item) => item.key));

    // Remove markers that are no longer needed
    for (const [key, entry] of this.markerCache.entries()) {
      if (!newKeys.has(key)) {
        try {
          entry.marker.remove();
        } catch {
          // swallow removal errors
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
          existing.marker.setLngLat([coords.lon, coords.lat]);
        } catch {
          // If update fails, remove and recreate
          try {
            existing.marker.remove();
          } catch {
            // swallow
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
        entry.marker.remove();
      } catch {
        // swallow removal errors
      }
    }
    this.markerCache.clear();
  }

  private createAndAddMarker(
    item: ClusterDisplayItem,
    coords: { lon: number; lat: number }
  ) {
    if (!this.MarkerCtor) return;

    const element =
      item.kind === "primary"
        ? createPrimaryMarkerElement(item, this.primaryType, this.onMarkerClick)
        : createDotMarkerElement(item, this.primaryType, this.onMarkerClick);

    if (!element) return;

    try {
      const marker = new this.MarkerCtor({
        element,
        anchor: item.kind === "primary" ? "bottom" : "center",
      })
        .setLngLat([coords.lon, coords.lat])
        .addTo(this.mapInstance);

      this.markerCache.set(item.key, {
        key: item.key,
        marker,
        kind: item.kind,
        parentId: item.kind === "dot" ? item.parentId : undefined,
      });
    } catch {
      // swallow marker creation errors
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
