import type { Property } from "../../types";
import {
  BaseMapGLMarkerManager,
  type MapGLMarkerHandle,
} from "../mapgl/markermanager";
import type { ClusterDisplayItem } from "../../utils/clustering";

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
  markerOptions?: { showLabel?: boolean; hideBadge?: boolean; showTail?: boolean };
};

const LABEL_SOURCE_ID = "mapfirst-labels-source";
const LABEL_LAYER_ID = "mapfirst-labels-layer";

export class MapLibreMarkerManager extends BaseMapGLMarkerManager<
  MapLibreMarkerHandle,
  MapLibreNamespace
> {
  private labelLayerReady = false;
  private pendingLabelData: any = null;

  constructor(options: MapLibreMarkerManagerOptions) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.maplibregl,
      onMarkerClick: options.onMarkerClick,
      markerOptions: options.markerOptions,
    });

    if (options.markerOptions?.showLabel) {
      if (options.mapInstance.isStyleLoaded()) {
        this.initLabelLayer();
      } else {
        options.mapInstance.once("style.load", () => this.initLabelLayer());
      }
    }
  }

  override render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null,
  ) {
    super.render(items, primaryType, selectedMarkerId);
    if (this.markerOptions?.showLabel) {
      this.syncLabelLayer(items);
    }
  }

  override destroy() {
    super.destroy();
    this.removeLabelLayer();
  }

  /** Suppress DOM labels — symbol layer renders them instead */
  protected override getEffectiveMarkerOptions() {
    if (this.markerOptions?.showLabel) {
      return { ...this.markerOptions, showLabel: false };
    }
    return this.markerOptions;
  }

  private initLabelLayer() {
    const map = this.mapInstance;
    try {
      if (map.getSource(LABEL_SOURCE_ID)) return;

      const empty = {
        type: "FeatureCollection" as const,
        features: [] as any[],
      };

      map.addSource(LABEL_SOURCE_ID, { type: "geojson", data: empty });
      map.addLayer({
        id: LABEL_LAYER_ID,
        type: "symbol",
        source: LABEL_SOURCE_ID,
        layout: {
          // Show "Name\nRating (reviews)" or just "Name"
          "text-field": [
            "case",
            ["!=", ["get", "rating"], ""],
            ["concat", ["get", "name"], "\n", ["get", "rating"]],
            ["get", "name"],
          ],
          "text-anchor": "left",
          // Offset right of pill: ~3.5em horizontal, ~2.3em up from tail tip
          "text-offset": [3.5, -2.3],
          "text-size": 13,
          "text-max-width": 8,
          // Native collision detection — overlapping labels auto-hide
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "rgba(0,0,0,0.85)",
          "text-halo-width": 1.5,
        },
      });

      this.labelLayerReady = true;
      if (this.pendingLabelData) {
        (map.getSource(LABEL_SOURCE_ID) as any).setData(this.pendingLabelData);
        this.pendingLabelData = null;
      }
    } catch {
      // Style doesn't support this layer (e.g. no glyphs) — fail silently
    }
  }

  private syncLabelLayer(items: ClusterDisplayItem[]) {
    const features = items
      .filter(
        (item) =>
          item.kind === "primary" && item.marker.type === this.primaryType,
      )
      .map((item) => {
        const loc = item.marker.location as { lon: number; lat: number };
        const rating =
          item.marker.rating != null && item.marker.reviews
            ? `${item.marker.rating} (${item.marker.reviews})`
            : item.marker.rating != null
              ? String(item.marker.rating)
              : "";
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [loc.lon, loc.lat],
          },
          properties: {
            name: item.marker.name ?? "",
            rating,
          },
        };
      });

    const geojson = {
      type: "FeatureCollection",
      features,
    };

    if (this.labelLayerReady) {
      try {
        (this.mapInstance.getSource(LABEL_SOURCE_ID) as any).setData(geojson);
      } catch {
        // swallow
      }
    } else {
      this.pendingLabelData = geojson;
    }
  }

  private removeLabelLayer() {
    const map = this.mapInstance;
    try {
      if (map.getLayer(LABEL_LAYER_ID)) map.removeLayer(LABEL_LAYER_ID);
      if (map.getSource(LABEL_SOURCE_ID)) map.removeSource(LABEL_SOURCE_ID);
    } catch {
      // swallow
    }
  }
}
