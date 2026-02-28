import {
  BaseMapGLAdapter,
  type BaseMapGLAdapterOptions,
} from "../mapgl/adapter";
import {
  MapLibreMarkerManager,
  type MapLibreNamespace,
} from "./markermanager";

type MapLibreAdapterOptions = Omit<
  BaseMapGLAdapterOptions<MapLibreNamespace>,
  "namespace"
> & {
  maplibregl: MapLibreNamespace;
};

export class MapLibreAdapter extends BaseMapGLAdapter<
  MapLibreMarkerManager,
  MapLibreNamespace,
  MapLibreAdapterOptions
> {
  constructor(map: any) {
    super(map, ({ mapInstance, namespace, onMarkerClick }) => {
      return new MapLibreMarkerManager({
        mapInstance,
        maplibregl: namespace,
        onMarkerClick,
      });
    });
  }

  protected override getNamespace(options: MapLibreAdapterOptions) {
    return options.maplibregl;
  }
}
