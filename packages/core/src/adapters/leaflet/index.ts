import { MapAdapter } from "../index";
import type { MapBounds } from "../index";
import { LeafletMarkerManager, type LeafletNamespace } from "./markermanager";
import type { Property } from "../../types";
import type { MarkerOptions } from "../../marker";

const LEAFLET_REFRESH_EVENTS = ["zoom", "move", "drag", "rotate"];

type LeafletAdapterOptions = {
  leaflet: LeafletNamespace;
  onMarkerClick?: (marker: Property) => void;
  onRefresh?: () => void;
  onMapMoveEnd?: (bounds: MapBounds) => void;
  markerOptions?: MarkerOptions;
};

export class LeafletAdapter extends MapAdapter {
  private markerManager?: LeafletMarkerManager;
  private cleanupFns: Array<() => void> = [];

  constructor(map: any) {
    super(map);
  }

  initialize(options: LeafletAdapterOptions): LeafletMarkerManager {
    this.markerManager = new LeafletMarkerManager({
      mapInstance: this.map,
      leaflet: options.leaflet,
      onMarkerClick: options.onMarkerClick,
      markerOptions: options.markerOptions,
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
    const handleMoveEnd = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };

    // Fire immediately (map is already ready when adapter is created)
    handleMoveEnd();

    this.map.on("moveend", handleMoveEnd);
    this.cleanupFns.push(() => this.map.off("moveend", handleMoveEnd));
  }

  private attachEventListeners(onRefresh: () => void) {
    LEAFLET_REFRESH_EVENTS.forEach((eventName) => {
      this.map.on(eventName, onRefresh);
      this.cleanupFns.push(() => this.map.off(eventName, onRefresh));
    });
  }

  getMarkerManager(): LeafletMarkerManager | undefined {
    return this.markerManager;
  }

  getContainer(): HTMLElement | null {
    return this.map?.getContainer?.() ?? null;
  }

  cleanup(): void {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];
    this.markerManager?.destroy();
  }

  getCenter(): { lng: number; lat: number } {
    const c = this.map.getCenter();
    return { lng: c.lng, lat: c.lat };
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  // Leaflet does not support bearing/pitch — return 0
  getBearing(): number {
    return 0;
  }

  getPitch(): number {
    return 0;
  }

  getMapBounds(): MapBounds {
    const b = this.map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    return {
      sw: { lat: sw.lat, lng: sw.lng },
      ne: { lat: ne.lat, lng: ne.lng },
    };
  }

  project(lngLat: [number, number]): { x: number; y: number } {
    const point = this.map.latLngToContainerPoint([lngLat[1], lngLat[0]]);
    return { x: point.x, y: point.y };
  }

  on(event: string, handler: (...args: any[]) => void): void {
    this.map.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.map.off(event, handler);
  }

  remove(): void {
    this.cleanup();
    this.map.remove();
  }
}
