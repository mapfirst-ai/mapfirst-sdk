import type { Property } from "../types";
import { createDotMarkerElement } from "../dotmarker";
import { createPrimaryMarkerElement, type MarkerOptions } from "../marker";
import { createUserLocationMarkerElement } from "../user-location-marker";
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

type MarkerDisplayState = {
  isPrimaryType: boolean;
  isSelected: boolean;
  isPending: boolean;
};

export abstract class BaseMarkerManager<TMarker = any> {
  protected readonly mapInstance: any;
  protected readonly onMarkerClick?: (marker: Property) => void;
  protected markerCache = new Map<string, MarkerEntry<TMarker>>();
  protected primaryType: string = "Accommodation";
  protected selectedMarkerId: number | null = null;
  protected readonly markerOptions?: MarkerOptions;

  constructor(
    mapInstance: any,
    onMarkerClick?: (marker: Property) => void,
    markerOptions?: MarkerOptions,
  ) {
    this.mapInstance = mapInstance;
    this.onMarkerClick = onMarkerClick;
    this.markerOptions = markerOptions;
  }

  /** Override in subclasses to change effective options passed to marker elements */
  protected getEffectiveMarkerOptions() {
    return this.markerOptions;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null,
  ) {
    if (primaryType && primaryType !== this.primaryType) {
      this.primaryType = primaryType;
    }
    if (selectedMarkerId !== undefined) {
      this.selectedMarkerId = selectedMarkerId;
    }

    // Filter out non-primary markers if hideNonPrimary is set
    const effectiveItems = this.markerOptions?.hideNonPrimary
      ? items.filter((item) => item.marker.type === this.primaryType)
      : items;

    // Create a set of keys for the new items
    const newKeys = new Set(effectiveItems.map((item) => item.key));

    // Remove markers that are no longer needed
    for (const [key, entry] of this.markerCache.entries()) {
      if (!newKeys.has(key)) {
        this.removeMarkerFromMap(entry.marker);
        this.markerCache.delete(key);
      }
    }

    // Add or update markers
    for (const item of effectiveItems) {
      const coords = safeLatLon(item.marker.location);
      if (!coords) continue;

      const existing = this.markerCache.get(item.key);

      if (existing) {
        // Update existing marker position and content
        const displayState = this.getDisplayState(item);
        this.updateMarkerElement(existing.marker, item, displayState);

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
        const existingMatch = this.findMatchingMarkerEntry(item);
        const existingEntry = existingMatch?.entry;
        const existingKey = existingMatch?.key;

        if (existingEntry && existingKey) {
          // Same marker, different state - update styles instead of recreating
          const displayState = this.getDisplayState(item);
          this.updateMarkerElement(existingEntry.marker, item, displayState);

          // Update zIndex if supported
          this.updateMarkerZIndex(
            existingEntry.marker,
            item,
            displayState.isPrimaryType,
            displayState.isSelected,
          );

          // Update cache with new key
          this.markerCache.delete(existingKey);
          this.markerCache.set(item.key, {
            ...existingEntry,
            key: item.key,
            parentId: item.kind === "dot" ? item.parentId : undefined,
          });

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
    coords: { lon: number; lat: number },
  ) {
    const element =
      item.kind === "primary"
        ? createPrimaryMarkerElement(
            item,
            this.primaryType,
            this.selectedMarkerId,
            this.onMarkerClick,
            this.getEffectiveMarkerOptions(),
          )
        : createDotMarkerElement(
            item,
            this.primaryType,
            this.selectedMarkerId,
            this.onMarkerClick,
          );

    if (!element) return;

    const displayState = this.getDisplayState(item);

    try {
      const marker = this.createMarker(
        element,
        coords,
        item,
        displayState.isPrimaryType,
        displayState.isSelected,
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
    isSelected: boolean,
  ): TMarker | null;

  protected abstract removeMarkerFromMap(marker: TMarker): void;

  protected abstract updateMarkerPosition(
    marker: TMarker,
    coords: { lon: number; lat: number },
  ): void;

  protected abstract getMarkerElement(marker: TMarker): HTMLElement | null;

  protected updateMarkerZIndex(
    marker: TMarker,
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean,
  ): void {
    // Default implementation does nothing (override in subclasses that support zIndex)
  }

  private getDisplayState(item: ClusterDisplayItem): MarkerDisplayState {
    const isPrimaryType = item.marker.type === this.primaryType;
    const isSelected = this.selectedMarkerId === item.marker.tripadvisor_id;
    const isAccommodation = item.marker.type === "Accommodation";
    const isPending =
      item.kind === "primary"
        ? isAccommodation && !item.marker.pricing?.offer?.displayPrice
        : isAccommodation &&
          item.marker.pricing?.offer?.availability !== "available";
    return { isPrimaryType, isSelected, isPending };
  }

  private updateMarkerElement(
    marker: TMarker,
    item: ClusterDisplayItem,
    displayState: MarkerDisplayState,
  ) {
    const element = this.getMarkerElement(marker);
    if (!element) {
      return;
    }

    if (item.kind === "primary") {
      updatePrimaryMarkerElement(
        element,
        displayState.isPrimaryType,
        displayState.isSelected,
        displayState.isPending,
        item.marker,
      );
      return;
    }

    updateDotMarkerElement(
      element,
      displayState.isPrimaryType,
      displayState.isSelected,
      displayState.isPending,
    );
  }

  private findMatchingMarkerEntry(item: ClusterDisplayItem) {
    const markerId = item.marker.tripadvisor_id;
    for (const [key, entry] of this.markerCache.entries()) {
      if (
        extractMarkerIdFromKey(key) === markerId &&
        entry.kind === item.kind
      ) {
        return { key, entry };
      }
    }
    return null;
  }

  /**
   * Update user location marker rendering
   */
  renderUserLocation(userLocation: { lat: number; lng: number } | null): void {
    // Remove existing user location marker if present
    const existingKey = "__user-location__";
    const existing = this.markerCache.get(existingKey);
    if (existing) {
      this.removeMarkerFromMap(existing.marker);
      this.markerCache.delete(existingKey);
    }

    // If no user location provided, we're done
    if (!userLocation) {
      return;
    }

    // Create and add new user location marker
    const element = createUserLocationMarkerElement();

    if (element) {
      try {
        const marker = this.createMarker(
          element,
          { lon: userLocation.lng, lat: userLocation.lat },
          {
            kind: "dot",
            key: existingKey,
            marker: {
              tripadvisor_id: -1, // Special ID for user location
              type: "Attraction",
              name: "Your Location",
              location: { lat: userLocation.lat, lon: userLocation.lng },
            },
          } as any,
          false,
          false,
        );

        if (marker) {
          this.markerCache.set(existingKey, {
            key: existingKey,
            marker,
            kind: "dot",
          });
        }
      } catch (error) {
        console.error("Error creating user location marker", error);
      }
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
