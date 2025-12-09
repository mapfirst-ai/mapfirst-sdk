import { MapAdapter, type LngLat, type MapBounds } from "../index";
import {
  GoogleMapsMarkerManager,
  type GoogleMapsNamespace,
} from "./markermanager";
import type { Property } from "../../types";

export class GoogleMapsAdapter extends MapAdapter {
  private overlayView: any;
  private markerManager?: GoogleMapsMarkerManager;
  private cleanupFns: Array<() => void> = [];

  constructor(map: any) {
    super(map);
    this.initializeOverlayView();
  }

  initialize(options: {
    google: GoogleMapsNamespace;
    onMarkerClick?: (marker: Property) => void;
    onRefresh?: () => void;
    onMapMoveEnd?: (bounds: MapBounds) => void;
  }) {
    this.markerManager = new GoogleMapsMarkerManager({
      mapInstance: this.map,
      google: options.google,
      onMarkerClick: options.onMarkerClick,
    });

    if (options.onRefresh) {
      this.attachEventListeners(options.onRefresh);
    }

    if (options.onMapMoveEnd) {
      this.attachBoundsTracking(options.onMapMoveEnd, options.google);
    }

    return this.markerManager;
  }

  private attachBoundsTracking(
    onMapMoveEnd: (bounds: MapBounds) => void,
    google: GoogleMapsNamespace
  ) {
    if (!this.map) {
      return;
    }

    const handleIdle = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };

    // Set initial bounds
    handleIdle();

    const listener = google.event.addListener(this.map, "idle", handleIdle);
    this.cleanupFns.push(() => {
      google.event.removeListener(listener);
    });
  }

  private attachEventListeners(onRefresh: () => void) {
    const events = [
      "center_changed",
      "zoom_changed",
      "drag",
      "heading_changed",
      "tilt_changed",
    ];
    const listeners: any[] = [];

    events.forEach((eventName) => {
      const listener = this.map.addListener(eventName, onRefresh);
      listeners.push(listener);
    });

    this.cleanupFns.push(() => {
      listeners.forEach((listener) => {
        try {
          listener.remove();
        } catch {
          // ignore
        }
      });
    });
  }

  getMarkerManager() {
    return this.markerManager;
  }

  getContainer(): HTMLElement | null {
    return this.map?.getDiv?.() || null;
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

  private initializeOverlayView() {
    const googleMaps = (globalThis as any).google?.maps;
    if (!googleMaps) return;

    // Create a custom overlay to access the projection
    const OverlayView = googleMaps.OverlayView;
    if (!OverlayView) return;

    this.overlayView = new OverlayView();
    this.overlayView.draw = function () {}; // Required method
    this.overlayView.setMap(this.map);
  }

  getMap(): any {
    return this.map;
  }

  getCenter(): LngLat {
    const center = this.map.getCenter();
    if (!center) {
      return { lng: 0, lat: 0 };
    }
    return { lng: center.lng(), lat: center.lat() };
  }

  getZoom(): number {
    return this.map.getZoom() ?? 0;
  }

  getBearing(): number {
    return this.map.getHeading() ?? 0;
  }

  getPitch(): number {
    return this.map.getTilt() ?? 0;
  }

  getMapBounds(): MapBounds {
    const bounds = this.map.getBounds();
    if (!bounds) {
      return {
        sw: { lat: 0, lng: 0 },
        ne: { lat: 0, lng: 0 },
      };
    }
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      sw: { lat: sw.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() },
    };
  }

  project(lngLat: [number, number]): { x: number; y: number } {
    if (!this.overlayView) {
      return { x: 0, y: 0 };
    }

    const projection = this.overlayView.getProjection();
    if (!projection) {
      return { x: 0, y: 0 };
    }

    const googleMaps = (globalThis as any).google?.maps;
    if (!googleMaps) {
      return { x: 0, y: 0 };
    }

    const latLng = new googleMaps.LatLng(lngLat[1], lngLat[0]);
    const point = projection.fromLatLngToContainerPixel(latLng);

    if (!point) {
      return { x: 0, y: 0 };
    }

    return {
      x: point.x,
      y: point.y,
    };
  }

  on(event: string, handler: (...args: any[]) => void): void {
    this.map.addListener(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    const googleMaps = (globalThis as any).google?.maps;
    if (googleMaps?.event) {
      googleMaps.event.clearListeners(this.map, event);
    }
  }

  resize(): void {
    const googleMaps = (globalThis as any).google?.maps;
    if (googleMaps?.event) {
      googleMaps.event.trigger(this.map, "resize");
    }
  }

  remove(): void {
    this.cleanup();
    // Clean up overlay view
    if (this.overlayView) {
      this.overlayView.setMap(null);
      this.overlayView = null;
    }
    // Google Maps doesn't have a remove method
    // Users should handle cleanup themselves
  }
}
