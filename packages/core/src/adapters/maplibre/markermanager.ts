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
  markerOptions?: {
    showLabel?: boolean;
    hideBadge?: boolean;
    showTail?: boolean;
    hideNonPrimary?: boolean;
  };
};

type Box = { x: number; y: number; w: number; h: number };

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

  override render(
    items: ClusterDisplayItem[],
    primaryType?: string,
    selectedMarkerId?: number | null,
  ) {
    super.render(items, primaryType, selectedMarkerId);
    if (this.markerOptions?.showLabel) {
      // Only primary-type markers participate in label collision
      const primaryItems = items.filter(
        (item) => item.marker.type === this.primaryType,
      );
      this.hideOverlappingLabels(primaryItems);
    }
  }

  /**
   * Hide labels that overlap with pills, dots, or other labels.
   * Uses projected map coordinates + approximate bounding boxes.
   */
  private hideOverlappingLabels(items: ClusterDisplayItem[]) {
    const map = this.mapInstance;
    const markerBoxes: { key: string; box: Box }[] = [];
    const labelInfo: { key: string; el: HTMLElement; box: Box }[] = [];

    for (const item of items) {
      const loc = item.marker.location as { lon?: number; lat?: number };
      if (typeof loc?.lon !== "number" || typeof loc?.lat !== "number") continue;

      let pt: { x: number; y: number };
      try {
        pt = map.project([loc.lon, loc.lat]);
      } catch {
        continue;
      }

      if (item.kind === "primary") {
        // Pill: anchor "bottom", tail adds 10px below pill.
        // Pill height ~40px, center ~30px above coordinate.
        const pillW = 80;
        const pillH = 40;
        const pillCY = pt.y - 30;

        markerBoxes.push({
          key: item.key,
          box: {
            x: pt.x - pillW / 2,
            y: pillCY - pillH / 2,
            w: pillW,
            h: pillH,
          },
        });

        // Collect label elements for primary-type markers
        if (item.marker.type === this.primaryType) {
          const entry = this.markerCache.get(item.key);
          const root = entry ? this.getMarkerElement(entry.marker) : null;
          const label = root?.querySelector(
            ".mapfirst-marker-label",
          ) as HTMLElement | null;
          if (label) {
            const labelX = pt.x + pillW / 2 + 8;
            const labelW = 150;
            const labelH = 44;
            labelInfo.push({
              key: item.key,
              el: label,
              box: {
                x: labelX,
                y: pillCY - labelH / 2,
                w: labelW,
                h: labelH,
              },
            });
          }
        }
      } else {
        // Dot: center anchor, ~20x20
        markerBoxes.push({
          key: item.key,
          box: { x: pt.x - 10, y: pt.y - 10, w: 20, h: 20 },
        });
      }
    }

    // Collision detection: hide labels that overlap other markers or shown labels.
    const shownLabelBoxes: Box[] = [];
    for (const { key, el, box } of labelInfo) {
      let overlaps = false;

      // Check vs pills/dots (skip own pill)
      for (const mb of markerBoxes) {
        if (mb.key === key) continue;
        if (boxesOverlap(box, mb.box)) {
          overlaps = true;
          break;
        }
      }

      // Check vs already-shown labels
      if (!overlaps) {
        for (const sb of shownLabelBoxes) {
          if (boxesOverlap(box, sb)) {
            overlaps = true;
            break;
          }
        }
      }

      el.style.visibility = overlaps ? "hidden" : "visible";
      if (!overlaps) shownLabelBoxes.push(box);
    }
  }
}

function boxesOverlap(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}
