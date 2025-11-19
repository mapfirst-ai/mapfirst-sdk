import type { Property } from "../../types";
import { createDotMarkerElement } from "../../dotmarket";
import { createPrimaryMarkerElement } from "../../marker";
import {
  updatePrimaryMarkerElement,
  updateDotMarkerElement,
  extractMarkerIdFromKey,
} from "../../marker-updater";
import { ClusterDisplayItem } from "../../utils/clustering";

export type MapboxMarkerHandle = {
  setLngLat(lngLat: [number, number]): MapboxMarkerHandle;
  addTo(map: any): MapboxMarkerHandle;
  remove(): void;
  getElement(): HTMLElement;
};

export type MapboxNamespace = {
  Marker: new (options?: {
    element?: HTMLElement;
    anchor?: string;
  }) => MapboxMarkerHandle;
};

type MapboxMarkerManagerOptions = {
  mapInstance: any;
  mapboxgl: MapboxNamespace;
  onMarkerClick?: (marker: Property) => void;
};

type MarkerEntry = {
  key: string;
  marker: MapboxMarkerHandle;
  kind: "primary" | "dot";
  parentId?: number;
};

export class MapboxMarkerManager {
  private readonly mapInstance: any;
  private readonly MarkerCtor?: MapboxNamespace["Marker"];
  private readonly onMarkerClick?: (marker: Property) => void;
  private markerCache = new Map<string, MarkerEntry>();
  private primaryType: string = "Accommodation";
  private selectedMarkerId: number | null = null;

  constructor(options: MapboxMarkerManagerOptions) {
    this.mapInstance = options.mapInstance;
    this.MarkerCtor = options.mapboxgl?.Marker;
    this.onMarkerClick = options.onMarkerClick;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null
  ) {
    if (primaryType && primaryType !== this.primaryType) {
      this.primaryType = primaryType;
    }
    if (selectedMarkerId !== undefined) {
      this.selectedMarkerId = selectedMarkerId;
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
        // Check if there's a marker for the same property with a different key (styling change)
        const markerId = item.marker.tripadvisor_id;
        let existingEntry: MarkerEntry | undefined;
        let existingKey: string | undefined;

        for (const [key, entry] of this.markerCache.entries()) {
          if (
            extractMarkerIdFromKey(key) === markerId &&
            entry.kind === item.kind
          ) {
            existingEntry = entry;
            existingKey = key;
            break;
          }
        }

        if (existingEntry && existingKey) {
          // Same marker, different state - update styles instead of recreating
          const isPrimaryType = item.marker.type === this.primaryType;
          const isSelected =
            this.selectedMarkerId === item.marker.tripadvisor_id;
          const isAccommodation = item.marker.type === "Accommodation";
          const isPending =
            item.kind === "primary"
              ? isAccommodation && !item.marker.pricing?.offer?.displayPrice
              : isAccommodation &&
                item.marker.pricing?.offer?.availability !== "available";

          const element = existingEntry.marker.getElement();
          if (element) {
            if (item.kind === "primary") {
              updatePrimaryMarkerElement(
                element,
                isPrimaryType,
                isSelected,
                isPending
              );
            } else {
              updateDotMarkerElement(
                element,
                isPrimaryType,
                isSelected,
                isPending
              );
            }
          }

          // Update cache with new key
          this.markerCache.delete(existingKey);
          this.markerCache.set(item.key, existingEntry);

          // Update position
          try {
            existingEntry.marker.setLngLat([coords.lon, coords.lat]);
          } catch {
            // If update fails, ignore
          }
        } else {
          // Create new marker
          this.createAndAddMarker(item, coords);
        }
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
        ? createPrimaryMarkerElement(
            item,
            this.primaryType,
            this.selectedMarkerId,
            this.onMarkerClick
          )
        : createDotMarkerElement(
            item,
            this.primaryType,
            this.selectedMarkerId,
            this.onMarkerClick
          );

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
