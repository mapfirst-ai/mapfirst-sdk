import { MapAdapter, type LngLat, type MapBounds } from "./index";

export class MapLibreAdapter extends MapAdapter {
  constructor(map: any) {
    super(map);
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

  project(lngLat: [number, number]): { x: number; y: number } {
    const point = this.map.project(lngLat);
    return { x: point.x, y: point.y };
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
    this.map.remove();
  }
}
