import type { Property } from "../types";
import { createDotMarkerElement } from "../dotmarker";
import { createPrimaryMarkerElement } from "../marker";
import {
  updatePrimaryMarkerElement,
  updateDotMarkerElement,
  extractMarkerIdFromKey,
} from "../marker-updater";
import { ClusterDisplayItem } from "../utils/clustering";

export type MarkerEntry<T = any> = {
  key: string;
  marker: T;
  kind: "primary" | "dot";
  parentId?: number;
};

export abstract class BaseMarkerManager<TMarker = any> {
  protected readonly mapInstance: any;
  protected readonly onMarkerClick?: (marker: Property) => void;
  protected markerCache = new Map<string, MarkerEntry<TMarker>>();
  protected primaryType: string = "Accommodation";
  protected selectedMarkerId: number | null = null;

  constructor(mapInstance: any, onMarkerClick?: (marker: Property) => void) {
    this.mapInstance = mapInstance;
    this.onMarkerClick = onMarkerClick;
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

    // Create a set of keys for the new items
    const newKeys = new Set(items.map((item) => item.key));

    // Remove markers that are no longer needed
    for (const [key, entry] of this.markerCache.entries()) {
      if (!newKeys.has(key)) {
        this.removeMarkerFromMap(entry.marker);
        this.markerCache.delete(key);
      }
    }

    // Add or update markers
    for (const item of items) {
      const coords = safeLatLon(item.marker.location);
      if (!coords) continue;

      const existing = this.markerCache.get(item.key);

      if (existing) {
        // Update existing marker position and content
        const isPrimaryType = item.marker.type === this.primaryType;
        const isSelected = this.selectedMarkerId === item.marker.tripadvisor_id;
        const isAccommodation = item.marker.type === "Accommodation";
        const isPending =
          item.kind === "primary"
            ? isAccommodation && !item.marker.pricing?.offer?.displayPrice
            : isAccommodation &&
              item.marker.pricing?.offer?.availability !== "available";

        const element = this.getMarkerElement(existing.marker);
        if (element) {
          if (item.kind === "primary") {
            updatePrimaryMarkerElement(
              element,
              isPrimaryType,
              isSelected,
              isPending,
              item.marker
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

        try {
          this.updateMarkerPosition(existing.marker, coords);
        } catch {
          // If update fails, remove and recreate
          this.removeMarkerFromMap(existing.marker);
          this.markerCache.delete(item.key);
          this.createAndAddMarker(item, coords);
        }
      } else {
        // Check if there's a marker for the same property with a different key (styling change)
        const markerId = item.marker.tripadvisor_id;
        let existingEntry: MarkerEntry<TMarker> | undefined;
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

          const element = this.getMarkerElement(existingEntry.marker);
          if (element) {
            if (item.kind === "primary") {
              updatePrimaryMarkerElement(
                element,
                isPrimaryType,
                isSelected,
                isPending,
                item.marker
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

          // Update zIndex if supported
          this.updateMarkerZIndex(
            existingEntry.marker,
            item,
            isPrimaryType,
            isSelected
          );

          // Update cache with new key
          this.markerCache.delete(existingKey);
          this.markerCache.set(item.key, existingEntry);

          // Update position
          try {
            this.updateMarkerPosition(existingEntry.marker, coords);
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
      this.removeMarkerFromMap(entry.marker);
    }
    this.markerCache.clear();
  }

  protected createAndAddMarker(
    item: ClusterDisplayItem,
    coords: { lon: number; lat: number }
  ) {
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

    try {
      const marker = this.createMarker(
        element,
        coords,
        item,
        isPrimaryType,
        isSelected
      );
      if (marker) {
        this.markerCache.set(item.key, {
          key: item.key,
          marker,
          kind: item.kind,
          parentId: item.kind === "dot" ? item.parentId : undefined,
        });
      }
    } catch (error) {
      console.error("Error creating marker", error);
    }
  }

  // Abstract methods to be implemented by subclasses
  protected abstract createMarker(
    element: HTMLElement,
    coords: { lon: number; lat: number },
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean
  ): TMarker | null;

  protected abstract removeMarkerFromMap(marker: TMarker): void;

  protected abstract updateMarkerPosition(
    marker: TMarker,
    coords: { lon: number; lat: number }
  ): void;

  protected abstract getMarkerElement(marker: TMarker): HTMLElement | null;

  protected updateMarkerZIndex(
    marker: TMarker,
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean
  ): void {
    // Default implementation does nothing (override in subclasses that support zIndex)
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
