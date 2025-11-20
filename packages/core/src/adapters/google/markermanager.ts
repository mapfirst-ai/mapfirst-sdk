import type { Property } from "../../types";
import { BaseMarkerManager } from "../markermanager";
import { ClusterDisplayItem } from "../../utils/clustering";

export type GoogleMapsMarkerHandle = any; // google.maps.marker.AdvancedMarkerElement

export type GoogleMapsNamespace = any; // typeof google.maps

type GoogleMapsMarkerManagerOptions = {
  mapInstance: any; // google.maps.Map
  google: GoogleMapsNamespace;
  onMarkerClick?: (marker: Property) => void;
};

export class GoogleMapsMarkerManager extends BaseMarkerManager<GoogleMapsMarkerHandle> {
  private readonly google: GoogleMapsNamespace;

  constructor(options: GoogleMapsMarkerManagerOptions) {
    super(options.mapInstance, options.onMarkerClick);
    this.google = options.google;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null
  ) {
    if (!this.google?.marker?.AdvancedMarkerElement) {
      console.warn("AdvancedMarkerElement not available");
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }

  protected createMarker(
    element: HTMLElement,
    coords: { lon: number; lat: number },
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean
  ): GoogleMapsMarkerHandle | null {
    if (!this.google?.marker?.AdvancedMarkerElement) return null;

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

    return new this.google.marker.AdvancedMarkerElement({
      map: this.mapInstance,
      position: { lat: coords.lat, lng: coords.lon },
      content: element,
      zIndex,
    });
  }

  protected removeMarkerFromMap(marker: GoogleMapsMarkerHandle): void {
    try {
      marker.map = null;
    } catch (error) {
      console.error("Error removing marker", error);
    }
  }

  protected updateMarkerPosition(
    marker: GoogleMapsMarkerHandle,
    coords: { lon: number; lat: number }
  ): void {
    marker.position = { lat: coords.lat, lng: coords.lon };
  }

  protected getMarkerElement(
    marker: GoogleMapsMarkerHandle
  ): HTMLElement | null {
    const element = marker.content;
    return element instanceof HTMLElement ? element : null;
  }

  protected updateMarkerZIndex(
    marker: GoogleMapsMarkerHandle,
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean
  ): void {
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
    marker.zIndex = zIndex;
  }
}
