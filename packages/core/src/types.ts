export const locales = ["en", "es", "de", "fr", "it", "pt"] as const;

export type Locale = (typeof locales)[number];

export type Price = {
  min: number;
  max: number;
};

export type PriceLevel = "Mid Range" | "Fine Dining" | "Cheap Eats";

export type FilterSchema = {
  amenities?: string[];
  hotelStyle?: string[];
  price?: Price | null;
  minRating?: number;
  starRating?: number;
  numAdults: number;
  numRooms: number;
  checkIn: string;
  checkOut: string;
  location?: {
    locationId: number | null;
    city: string | null;
    state: string | null;
    country: string | null;
    longitude: number | null;
    latitude: number | null;
  } | null;
  currency: string;
  limit?: number;
  language?: Locale;
  primary_type?: PropertyType;
  transformed_query?: string;
  selected_restaurant_price_levels?: PriceLevel[];
};

export type DatedFilterSchema = Omit<FilterSchema, "checkIn" | "checkOut"> & {
  checkIn: Date;
  checkOut: Date;
};

export type Offer = {
  availability: "available" | "unavailable" | "pending";
  providerId: number;
  displayName: string;
  displayPrice?: string;
  price?: number;
  logo: string;
  clickUrl: string;
  freeCancellationDate?: string;
  timeOfPayment?: string;
};

export type HotelPricingAPIResults = {
  availability: "pending" | "available" | "unavailable";
  strikeThroughDisplayPrice?: string;
  offer?: Offer;
};

export type HotelPricingAPIResponse = {
  success?: {
    isComplete: boolean;
    pollingLink?: string;
    results?: Property[];
  };
};

export type PropertyAwardImage = { key: string; url: string };

export type PropertyAward = {
  name: string;
  image: PropertyAwardImage;
  type: "0" | "1";
};

export type PropertyType = "Accommodation" | "Eat & Drink" | "Attraction";

export type PropertyUrls = {
  tripadvisor: {
    main: string;
  };
};

export type Property = {
  tripadvisor_id: number;
  name: string;
  rating: number;
  reviews: number;
  location?: { lat: number; lon: number };
  type: PropertyType;
  awards?: PropertyAward[];
  pricing?: HotelPricingAPIResults;
  url?: string;
  secondaries: string[];
  price_level?: PriceLevel;
  city?: string;
  country?: string;
};

export type AggregatedOffer = { id: string } & Property & Offer;

export type APIResponse = {
  location_id?: number;
  filters: FilterSchema;
  properties: Property[];
  isComplete: boolean | undefined;
  pollingLink: string | undefined;
  durationSeconds: number;
};

export type GeoMapping = {
  location_id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  path1_name: string;
  path2_name?: string;
  path3_name?: string;
  path4_name?: string;
  path5_name?: string;
  path6_name?: string;
  path7_name?: string;
  path8_name?: string;
  path9_name?: string;
};

export type InitialRequestBody = {
  initial?: boolean;
  query?: string;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
  filters?: FilterSchema;
  city?: string;
  country?: string;
  location_id?: number;
  // for non city and non country based searches
  longitude?: number;
  latitude?: number;
  radius?: number;
};

export type SmartFilter = {
  id: string;
  label: string;
  type:
    | "amenity"
    | "hotelStyle"
    | "priceRange"
    | "minRating"
    | "starRating"
    | "primary_type"
    | "transformed_query"
    | "selected_restaurant_price_levels";
  value: string;
  numericValue?: number;
  priceRange?: {
    min: number;
    max?: number;
  };
  propertyType?: PropertyType;
  priceLevels?: PriceLevel[];
};

export type PollOptions = {
  pollingLink: string;
  maxAttempts?: number;
  delayMs?: number;
  isCancelled?: () => boolean;
  price?: Price;
  limit?: number;
};

export type InitialLocationData = {
  city?: string;
  country?: string;
  query?: string;
  currency?: string;
};
