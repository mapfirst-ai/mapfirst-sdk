import type { Property } from "../../types";
import {
  BaseMapGLMarkerManager,
  type MapGLMarkerHandle,
} from "../mapgl/markermanager";

export type MapLibreMarkerHandle = MapGLMarkerHandle;

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

export class MapLibreMarkerManager extends BaseMapGLMarkerManager<
  MapLibreMarkerHandle,
  MapLibreNamespace
> {
  constructor(options: MapLibreMarkerManagerOptions) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.maplibregl,
      onMarkerClick: options.onMarkerClick,
    });
  }
}
