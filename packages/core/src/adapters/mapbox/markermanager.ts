import type { Property } from "../../types";
import { BaseMarkerManager } from "../markermanager";
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

export class MapboxMarkerManager extends BaseMarkerManager<MapboxMarkerHandle> {
  private readonly MarkerCtor?: MapboxNamespace["Marker"];

  constructor(options: MapboxMarkerManagerOptions) {
    super(options.mapInstance, options.onMarkerClick);
    this.MarkerCtor = options.mapboxgl?.Marker;
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
  ): MapboxMarkerHandle | null {
    if (!this.MarkerCtor) return null;

    return new this.MarkerCtor({
      element,
      anchor: item.kind === "primary" ? "bottom" : "center",
    })
      .setLngLat([coords.lon, coords.lat])
      .addTo(this.mapInstance);
  }

  protected removeMarkerFromMap(marker: MapboxMarkerHandle): void {
    try {
      marker.remove();
    } catch {
      // swallow removal errors
    }
  }

  protected updateMarkerPosition(
    marker: MapboxMarkerHandle,
    coords: { lon: number; lat: number }
  ): void {
    marker.setLngLat([coords.lon, coords.lat]);
  }

  protected getMarkerElement(marker: MapboxMarkerHandle): HTMLElement | null {
    return marker.getElement();
  }
}
