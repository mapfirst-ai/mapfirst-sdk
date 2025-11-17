/**
 * Abstract base class for map adapters supporting different map libraries
 */
export abstract class MapAdapter {
  protected map: any;

  constructor(map: any) {
    this.map = map;
  }

  /**
   * Get the underlying map instance
   * @returns {any} The native map instance
   */
  getMap(): any {
    return this.map;
  }
  /**
   * Get the current center coordinates of the map
   * @returns {{ lng: number; lat: number }} [longitude, latitude]
   */
  abstract getCenter(): { lng: number; lat: number };

  /**
   * Get the current zoom level of the map
   * @returns {number} Current zoom level
   */
  abstract getZoom(): number;

  /**
   * Get the current bearing (rotation) of the map
   * @returns {number} Bearing in degrees
   */
  abstract getBearing(): number;

  /**
   * Get the current pitch (tilt) of the map
   * @returns {number} Pitch in degrees
   */
  abstract getPitch(): number;

  /**
   * Get the current bounds of the map viewport
   * @returns {MapBounds} Map bounds with southwest and northeast corners
   */
  abstract getMapBounds(): MapBounds;

  /**
   * Project a geographical coordinate to screen space
   * @param {[number, number]} lngLat [longitude, latitude]
   * @returns {{ x: number; y: number }} Screen coordinates
   */
  abstract project(lngLat: [number, number]): { x: number; y: number };
}

export type LngLat = { lng: number; lat: number };

export type MapBounds = {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
};
