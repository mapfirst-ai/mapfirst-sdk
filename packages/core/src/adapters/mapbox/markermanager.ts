import type { Property } from "../../types";
import type { MarkerOptions } from "../../marker";
import {
  BaseMapGLMarkerManager,
  type MapGLMarkerHandle,
} from "../mapgl/markermanager";

export type MapboxMarkerHandle = MapGLMarkerHandle;

export type MapboxNamespace = {
  Marker: new (options?: {
    element?: HTMLElement;
    [key: string]: any;
  }) => MapboxMarkerHandle;
};

type MapboxMarkerManagerOptions = {
  mapInstance: any;
  mapboxgl: MapboxNamespace;
  onMarkerClick?: (marker: Property) => void;
  markerOptions?: MarkerOptions;
};

export class MapboxMarkerManager extends BaseMapGLMarkerManager<
  MapboxMarkerHandle,
  MapboxNamespace
> {
  constructor(options: MapboxMarkerManagerOptions) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.mapboxgl,
      onMarkerClick: options.onMarkerClick,
      markerOptions: options.markerOptions,
    });
  }
}
