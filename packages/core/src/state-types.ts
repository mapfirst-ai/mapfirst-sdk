import type { Property, PropertyType } from "./types";

export interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export interface ViewState {
  center: [number, number]; // [lat, lng]
  zoom: number;
  bounds: MapBounds | null;
}

export interface ActiveLocation {
  city?: string;
  state?: string;
  country?: string;
  location_id: number | null;
  locationName: string;
  coordinates?: [number, number];
}

export interface FilterState {
  checkIn?: Date | string;
  checkOut?: Date | string;
  numAdults?: number;
  numRooms?: number;
  currency?: string;
  include_urls?: boolean;
  include_rankings?: boolean;
  include_phone_numbers?: boolean;
}

export interface MapState {
  // View state
  center: [number, number];
  zoom: number;
  bounds: MapBounds | null;
  pendingBounds: MapBounds | null;
  tempBounds: MapBounds | null;

  // Data state
  properties: Property[];
  primary: PropertyType;
  selectedPropertyId: number | null;

  // Loading state
  initialLoading: boolean;
  isSearching: boolean;
  firstCallDone: boolean;

  // Filter state
  filters: FilterState;
  activeLocation: ActiveLocation;

  // User location state (for currentLocationMarker feature)
  userLocation: { lat: number; lng: number } | null;

  // Animation state
  isFlyToAnimating: boolean;
}

export interface MapStateCallbacks {
  // View callbacks
  onCenterChange?: (center: [number, number], zoom: number) => void;
  onBoundsChange?: (bounds: MapBounds | null) => void;
  onPendingBoundsChange?: (bounds: MapBounds | null) => void;
  onZoomChange?: (zoom: number) => void;

  // Data callbacks
  onPropertiesChange?: (properties: Property[]) => void;
  onSelectedPropertyChange?: (propertyId: number | null) => void;
  onPrimaryTypeChange?: (type: PropertyType) => void;

  // Filter callbacks
  onFiltersChange?: (filters: FilterState) => void;
  onActiveLocationChange?: (location: ActiveLocation) => void;

  // User location callback
  onUserLocationChange?: (
    location: { lat: number; lng: number } | null,
  ) => void;

  // Loading callbacks
  onLoadingStateChange?: (loading: boolean) => void;
  onSearchingStateChange?: (searching: boolean) => void;
  onFirstCallDoneChange?: (firstCallDone: boolean) => void;
  onIsFlyToAnimatingChange?: (animating: boolean) => void;
  onPropertiesLoadError?: (error: unknown) => void;

  // Error callback
  onError?: (error: Error | string, context?: string) => void;
}

export type MapStateUpdate = Partial<MapState>;
