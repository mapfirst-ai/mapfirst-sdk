import { MapAdapter, type LngLat, type MapBounds } from "../index";
import { MapboxMarkerManager, type MapboxNamespace } from "./markermanager";
import type { Property } from "../../types";

export class MapboxAdapter extends MapAdapter {
  private markerManager?: MapboxMarkerManager;
  private cleanupFns: Array<() => void> = [];

  constructor(map: any) {
    super(map);
  }

  initialize(options: {
    mapboxgl: MapboxNamespace;
    onMarkerClick?: (marker: Property) => void;
    onRefresh?: () => void;
    onMapMoveEnd?: (bounds: MapBounds) => void;
  }) {
    this.markerManager = new MapboxMarkerManager({
      mapInstance: this.map,
      mapboxgl: options.mapboxgl,
      onMarkerClick: options.onMarkerClick,
    });

    if (options.onRefresh) {
      this.attachEventListeners(options.onRefresh);
    }

    if (options.onMapMoveEnd) {
      this.attachBoundsTracking(options.onMapMoveEnd);
    }

    return this.markerManager;
  }

  private attachBoundsTracking(onMapMoveEnd: (bounds: MapBounds) => void) {
    if (!this.map || typeof this.map.on !== "function") {
      return;
    }

    const handleMoveEnd = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };

    // Set initial bounds on load
    const handleLoad = () => {
      const bounds = this.getMapBounds();
      // Initialize tempBounds without triggering pendingBounds
      onMapMoveEnd(bounds);
    };

    if (this.map.loaded && this.map.loaded()) {
      handleLoad();
    } else {
      this.map.once("load", handleLoad);
      this.cleanupFns.push(() => {
        if (typeof this.map.off === "function") {
          this.map.off("load", handleLoad);
        }
      });
    }

    this.map.on("moveend", handleMoveEnd);
    this.cleanupFns.push(() => {
      if (typeof this.map.off === "function") {
        this.map.off("moveend", handleMoveEnd);
      }
    });
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

  getContainer(): HTMLElement | null {
    return this.map?.getContainer?.() || null;
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
