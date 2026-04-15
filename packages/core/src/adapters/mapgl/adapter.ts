import { MapAdapter, type LngLat, type MapBounds } from "../index";
import type { Property } from "../../types";

const MAP_GL_REFRESH_EVENTS = ["move", "zoom", "dragend", "pitch", "rotate"];

type MarkerManagerFactory<TMarkerManager, TNamespace> = (options: {
  mapInstance: any;
  namespace: TNamespace;
  onMarkerClick?: (marker: Property) => void;
  markerOptions?: { showLabel?: boolean; hideBadge?: boolean };
}) => TMarkerManager;

type BaseMapGLAdapterSharedOptions = {
  onMarkerClick?: (marker: Property) => void;
  onRefresh?: () => void;
  onMapMoveEnd?: (bounds: MapBounds) => void;
  markerOptions?: { showLabel?: boolean; hideBadge?: boolean };
};

export type BaseMapGLAdapterOptions<TNamespace> =
  BaseMapGLAdapterSharedOptions & {
    namespace: TNamespace;
  };

export abstract class BaseMapGLAdapter<
  TMarkerManager,
  TNamespace,
  TOptions extends BaseMapGLAdapterSharedOptions =
    BaseMapGLAdapterOptions<TNamespace>,
> extends MapAdapter {
  private markerManager?: TMarkerManager;
  private cleanupFns: Array<() => void> = [];

  constructor(
    map: any,
    private readonly markerManagerFactory: MarkerManagerFactory<
      TMarkerManager,
      TNamespace
    >,
  ) {
    super(map);
  }

  initialize(options: TOptions) {
    this.markerManager = this.markerManagerFactory({
      mapInstance: this.map,
      namespace: this.getNamespace(options),
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

  protected abstract getNamespace(options: TOptions): TNamespace;

  private attachBoundsTracking(onMapMoveEnd: (bounds: MapBounds) => void) {
    if (!this.map || typeof this.map.on !== "function") {
      return;
    }

    const handleMoveEnd = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };

    const handleLoad = () => {
      const bounds = this.getMapBounds();
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
    MAP_GL_REFRESH_EVENTS.forEach((eventName) => {
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
