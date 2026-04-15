import type { Property } from "../../types";
import { BaseMarkerManager } from "../markermanager";
import type { MarkerOptions } from "../../marker";
import type { ClusterDisplayItem } from "../../utils/clustering";

export type MapGLMarkerHandle = {
  setLngLat(lngLat: [number, number]): MapGLMarkerHandle;
  addTo(map: any): MapGLMarkerHandle;
  remove(): void;
  getElement(): HTMLElement;
};

type MarkerConstructor<TMarker extends MapGLMarkerHandle> = new (options?: {
  element?: HTMLElement;
  anchor?: string;
}) => TMarker;

export type MapGLNamespace<TMarker extends MapGLMarkerHandle> = {
  Marker?: MarkerConstructor<TMarker>;
};

type BaseMapGLMarkerManagerOptions<
  TMarker extends MapGLMarkerHandle,
  TNamespace extends MapGLNamespace<TMarker>,
> = {
  mapInstance: any;
  namespace: TNamespace;
  onMarkerClick?: (marker: Property) => void;
  markerOptions?: MarkerOptions;
};

export class BaseMapGLMarkerManager<
  TMarker extends MapGLMarkerHandle,
  TNamespace extends MapGLNamespace<TMarker>,
> extends BaseMarkerManager<TMarker> {
  private readonly MarkerCtor?: TNamespace["Marker"];

  constructor(options: BaseMapGLMarkerManagerOptions<TMarker, TNamespace>) {
    super(options.mapInstance, options.onMarkerClick, options.markerOptions);
    this.MarkerCtor = options.namespace?.Marker;
  }

  render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null,
  ) {
    if (!this.MarkerCtor) {
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }

  protected createMarker(
    element: HTMLElement,
    coords: { lon: number; lat: number },
    item: ClusterDisplayItem,
  ): TMarker | null {
    if (!this.MarkerCtor) return null;

    return new this.MarkerCtor({
      element,
      anchor: item.kind === "primary" ? "bottom" : "center",
    })
      .setLngLat([coords.lon, coords.lat])
      .addTo(this.mapInstance) as TMarker;
  }

  protected removeMarkerFromMap(marker: TMarker): void {
    try {
      marker.remove();
    } catch {
      // swallow removal errors
    }
  }

  protected updateMarkerPosition(
    marker: TMarker,
    coords: { lon: number; lat: number },
  ): void {
    marker.setLngLat([coords.lon, coords.lat]);
  }

  protected getMarkerElement(marker: TMarker): HTMLElement | null {
    return marker.getElement();
  }
}
