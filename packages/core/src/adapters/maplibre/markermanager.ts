import type { Property } from "../../types";
import {
  BaseMapGLMarkerManager,
  type MapGLMarkerHandle,
} from "../mapgl/markermanager";

export type MapLibreMarkerHandle = MapGLMarkerHandle;

export type MapLibreNamespace = {
  Marker: new (options?: {
    element?: HTMLElement;
    [key: string]: any;
  }) => MapLibreMarkerHandle;
};

type MapLibreMarkerManagerOptions = {
  mapInstance: any;
  maplibregl: MapLibreNamespace;
  onMarkerClick?: (marker: Property) => void;
  markerOptions?: { showLabel?: boolean; hideBadge?: boolean };
};

export class MapLibreMarkerManager extends BaseMapGLMarkerManager<
  MapLibreMarkerHandle,
  MapLibreNamespace
> {
  constructor(options: MapLibreMarkerManagerOptions) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.maplibregl,
      onMarkerClick: options.onMarkerClick,
      markerOptions: options.markerOptions,
    });
  }
}
