import type { Property } from "../../types";
import type { MarkerOptions } from "../../marker";
import { BaseMarkerManager } from "../markermanager";
import type { ClusterDisplayItem } from "../../utils/clustering";
import {
  getDotMarkerZIndex,
  getPrimaryMarkerZIndex,
} from "../../marker-style-utils";

// Minimal types for the Leaflet namespace passed in at runtime.
// We accept `any` for the full L namespace so consumers don't need @types/leaflet.
export type LeafletNamespace = any;

export type LeafletMarkerHandle = {
  setLatLng(latlng: [number, number]): LeafletMarkerHandle;
  addTo(map: any): LeafletMarkerHandle;
  remove(): void;
  setZIndexOffset(offset: number): LeafletMarkerHandle;
  getElement(): HTMLElement | undefined;
};

type LeafletMarkerManagerOptions = {
  mapInstance: any;
  leaflet: LeafletNamespace;
  onMarkerClick?: (marker: Property) => void;
  markerOptions?: MarkerOptions;
};

export class LeafletMarkerManager extends BaseMarkerManager<LeafletMarkerHandle> {
  private readonly L: LeafletNamespace;

  constructor(options: LeafletMarkerManagerOptions) {
    super(options.mapInstance, options.onMarkerClick, options.markerOptions);
    this.L = options.leaflet;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null,
  ) {
    if (!this.L?.DivIcon) {
      console.warn("Leaflet DivIcon not available");
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }

  protected createMarker(
    element: HTMLElement,
    coords: { lon: number; lat: number },
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean,
  ): LeafletMarkerHandle | null {
    if (!this.L?.marker || !this.L?.DivIcon) return null;

    const anchor: [number, number] =
      item.kind === "primary"
        ? [element.offsetWidth / 2 || 20, element.offsetHeight || 40]
        : [element.offsetWidth / 2 || 10, element.offsetHeight / 2 || 10];

    const icon = new this.L.DivIcon({
      html: element.outerHTML,
      className: "",
      iconAnchor: anchor,
    });

    const zOffset =
      item.kind === "primary"
        ? getPrimaryMarkerZIndex(isPrimaryType, isSelected) * 100
        : getDotMarkerZIndex(isPrimaryType, isSelected) * 100;

    const m: LeafletMarkerHandle = this.L.marker([coords.lat, coords.lon], {
      icon,
    })
      .setZIndexOffset(zOffset)
      .addTo(this.mapInstance);

    // Wire up click on the actual DOM element after it is added to the map
    const el = m.getElement();
    if (el && this.onMarkerClick) {
      const prop = item.marker as Property;
      el.style.cursor = "pointer";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onMarkerClick!(prop);
      });
    }

    return m;
  }

  protected removeMarkerFromMap(marker: LeafletMarkerHandle): void {
    try {
      marker.remove();
    } catch {
      // swallow
    }
  }

  protected updateMarkerPosition(
    marker: LeafletMarkerHandle,
    coords: { lon: number; lat: number },
  ): void {
    marker.setLatLng([coords.lat, coords.lon]);
  }

  protected getMarkerElement(marker: LeafletMarkerHandle): HTMLElement | null {
    return marker.getElement() ?? null;
  }

  protected updateMarkerZIndex(
    marker: LeafletMarkerHandle,
    item: ClusterDisplayItem,
    isPrimaryType: boolean,
    isSelected: boolean,
  ): void {
    const zOffset =
      item.kind === "primary"
        ? getPrimaryMarkerZIndex(isPrimaryType, isSelected) * 100
        : getDotMarkerZIndex(isPrimaryType, isSelected) * 100;
    marker.setZIndexOffset(zOffset);
  }
}
