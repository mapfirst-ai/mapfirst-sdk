import {
  BaseMapGLAdapter,
  type BaseMapGLAdapterOptions,
} from "../mapgl/adapter";
import { MapboxMarkerManager, type MapboxNamespace } from "./markermanager";

type MapboxAdapterOptions = Omit<
  BaseMapGLAdapterOptions<MapboxNamespace>,
  "namespace"
> & {
  mapboxgl: MapboxNamespace;
};

export class MapboxAdapter extends BaseMapGLAdapter<
  MapboxMarkerManager,
  MapboxNamespace,
  MapboxAdapterOptions
> {
  constructor(map: any) {
    super(map, ({ mapInstance, namespace, onMarkerClick, markerOptions }) => {
      return new MapboxMarkerManager({
        mapInstance,
        mapboxgl: namespace,
        onMarkerClick,
        markerOptions,
      });
    });
  }

  protected override getNamespace(options: MapboxAdapterOptions) {
    return options.mapboxgl;
  }
}
