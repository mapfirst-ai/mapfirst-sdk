import type { Property } from "../../types";
import { BaseMarkerManager } from "../markermanager";
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

export class MapLibreMarkerManager extends BaseMarkerManager<MapLibreMarkerHandle> {
  private readonly MarkerCtor?: MapLibreNamespace["Marker"];

  constructor(options: MapLibreMarkerManagerOptions) {
    super(options.mapInstance, options.onMarkerClick);
    this.MarkerCtor = options.maplibregl?.Marker;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null
  ) {
    if (!this.MarkerCtor) {
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }

  protected createMarker(
    element: HTMLElement,
    coords: { lon: number; lat: number },
    item: ClusterDisplayItem
  ): MapLibreMarkerHandle | null {
    if (!this.MarkerCtor) return null;

    return new this.MarkerCtor({
      element,
      anchor: item.kind === "primary" ? "bottom" : "center",
    })
      .setLngLat([coords.lon, coords.lat])
      .addTo(this.mapInstance);
  }

  protected removeMarkerFromMap(marker: MapLibreMarkerHandle): void {
    try {
      marker.remove();
    } catch {
      // swallow removal errors
    }
  }

  protected updateMarkerPosition(
    marker: MapLibreMarkerHandle,
    coords: { lon: number; lat: number }
  ): void {
    marker.setLngLat([coords.lon, coords.lat]);
  }

  protected getMarkerElement(marker: MapLibreMarkerHandle): HTMLElement | null {
    return marker.getElement();
  }
}
