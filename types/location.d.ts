import { ProviderData } from "./provider";

export type LocationObjectCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

/**
 * Type representing the location object.
 */
export type LocationObject = {
  coords: LocationObjectCoords;
  timestamp: number;
  mocked?: boolean;
};

/**
 * Type representing a result of reverseGeocodeAsync.
 */
export type LocationGeocodedAddress = {
  city: string | null;
  district: string | null;
  streetNumber: string | null;
  street: string | null;
  region: string | null;
  subregion: string | null;
  country: string | null;
  postalCode: string | null;
  name: string | null;
  isoCountryCode: string | null;
  timezone: string | null;
  formattedAddress: string | null;
};

/**
 * Represents subscription object returned by methods watching for new locations or headings.
 */
export type LocationSubscription = {
  remove: () => void;
};


export interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  address_components: {
    types?: string[];
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface ProvidersMapProps {
  providers: ProviderData[];
  onProviderSelect: (provider: ProviderData) => void;
  showUserLocation?: boolean;
  enableLiveTracking?: boolean;
}

export interface ProviderMarkerProps {
  provider: ProviderData;
  isSelected: boolean;
  userLocation?: LocationObject | null;
}

export type MapType = "standard" | "satellite" | "terrain" | "hybrid";

export interface MapControlProps {
  isLiveTracking: boolean;
  onToggleLiveTracking: () => void;
  onMapTypeChange: (string) => void;
  mapType: MapType;
  onFocusUserLocation: () => void;
  // onFocusProvider: () => void;
}
