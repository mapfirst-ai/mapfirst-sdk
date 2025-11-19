export {
  MapLibreMarkerManager,
  type MapLibreMarkerHandle,
  type MapLibreNamespace,
} from "./maplibre/markermanager";

export {
  GoogleMapsMarkerManager,
  type GoogleMapsMarkerHandle,
  type GoogleMapsNamespace,
} from "./google/markermanager";

export {
  MapboxMarkerManager,
  type MapboxMarkerHandle,
  type MapboxNamespace,
} from "./mapbox/markermanager";

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
   * Initialize the adapter with platform-specific configuration
   * @param {any} options Platform-specific initialization options
   * @returns {any} The marker manager instance
   */
  abstract initialize(options: any): any;

  /**
   * Get the marker manager instance
   * @returns {any} The marker manager
   */
  abstract getMarkerManager(): any;

  /**
   * Clean up event listeners and resources
   */
  abstract cleanup(): void;

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
