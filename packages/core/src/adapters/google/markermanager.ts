import type { Property } from "../../types";
import { createDotMarkerElement } from "../../dotmarket";
import { createPrimaryMarkerElement } from "../../marker";
import {
  updatePrimaryMarkerElement,
  updateDotMarkerElement,
  extractMarkerIdFromKey,
} from "../../marker-updater";
import { ClusterDisplayItem } from "../../utils/clustering";

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
  private primaryType: string = "Accommodation";
  private selectedMarkerId: number | null = null;

  constructor(options: GoogleMapsMarkerManagerOptions) {
    this.mapInstance = options.mapInstance;
    this.google = options.google;
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

          const element = existingEntry.marker.content;
          if (element instanceof HTMLElement) {
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

          // Update zIndex
          const zIndex =
            item.kind === "primary"
              ? isSelected
                ? 20
                : isPrimaryType
                ? 12
                : 11
              : isSelected
              ? 20
              : isPrimaryType
              ? 3
              : 1;
          existingEntry.marker.zIndex = zIndex;

          // Update cache with new key
          this.markerCache.delete(existingKey);
          this.markerCache.set(item.key, existingEntry);

          // Update position
          try {
            existingEntry.marker.position = {
              lat: coords.lat,
              lng: coords.lon,
            };
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

    const isPrimaryType = item.marker.type === this.primaryType;
    const isSelected = this.selectedMarkerId === item.marker.tripadvisor_id;
    const zIndex =
      item.kind === "primary"
        ? isSelected
          ? 20
          : isPrimaryType
          ? 12
          : 11
        : isSelected
        ? 20
        : isPrimaryType
        ? 3
        : 1;

    try {
      const marker = new this.google.marker.AdvancedMarkerElement({
        map: this.mapInstance,
        position: { lat: coords.lat, lng: coords.lon },
        content: element,
        zIndex,
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
