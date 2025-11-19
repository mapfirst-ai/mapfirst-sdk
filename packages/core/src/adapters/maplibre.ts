import { MapAdapter, type LngLat, type MapBounds } from "./index";
import {
  MapLibreMarkerManager,
  type MapLibreNamespace,
} from "./maplibre/markermanager";
import type { Property } from "../types";

export class MapLibreAdapter extends MapAdapter {
  private markerManager?: MapLibreMarkerManager;
  private cleanupFns: Array<() => void> = [];

  constructor(map: any) {
    super(map);
  }

  initialize(options: {
    maplibregl: MapLibreNamespace;
    onMarkerClick?: (marker: Property) => void;
    onRefresh?: () => void;
  }) {
    this.markerManager = new MapLibreMarkerManager({
      mapInstance: this.map,
      maplibregl: options.maplibregl,
      onMarkerClick: options.onMarkerClick,
    });

    if (options.onRefresh) {
      this.attachEventListeners(options.onRefresh);
    }

    return this.markerManager;
  }

  private attachEventListeners(onRefresh: () => void) {
    if (!this.map || typeof this.map.on !== "function") {
      return;
    }
    const events = ["move", "zoom", "dragend", "pitch", "rotate"];
    events.forEach((eventName) => {
      this.map.on(eventName, onRefresh);
      this.cleanupFns.push(() => {
        if (typeof this.map.off === "function") {
          this.map.off(eventName, onRefresh);
        }
      });
    });
  }

  getMarkerManager() {
    return this.markerManager;
  }

  cleanup() {
    for (const cleanup of this.cleanupFns) {
      try {
        cleanup();
      } catch {
        // ignore
      }
    }
    this.cleanupFns.length = 0;
  }

  getMap(): any {
    return this.map;
  }

  getCenter(): LngLat {
    const center = this.map.getCenter();
    return { lng: center.lng, lat: center.lat };
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  getBearing(): number {
    return this.map.getBearing();
  }

  getPitch(): number {
    return this.map.getPitch();
  }

  getMapBounds(): MapBounds {
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      sw: { lat: sw.lat, lng: sw.lng },
      ne: { lat: ne.lat, lng: ne.lng },
    };
  }

  project(lngLat: [number, number]) {
    return this.map.project({ lng: lngLat[0], lat: lngLat[1] });
  }

  on(event: string, handler: (...args: any[]) => void): void {
    this.map.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.map.off(event, handler);
  }

  resize(): void {
    this.map.resize();
  }

  remove(): void {
    this.cleanup();
    this.map.remove();
  }
}
