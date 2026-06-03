import { StateCreator } from "zustand";
import { GlobalStore, LocationState, Place, PlaceDetails, LocationObjectCoords } from "@/types";

const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

function toCoords(c: GeolocationCoordinates): LocationObjectCoords {
  return {
    latitude: c.latitude,
    longitude: c.longitude,
    accuracy: c.accuracy,
    altitude: c.altitude,
    altitudeAccuracy: c.altitudeAccuracy,
    heading: c.heading,
    speed: c.speed,
  };
}

function getPositionAsync(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  });
}

async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(`${GEOCODING_URL}?latlng=${lat},${lng}&key=${MAPS_KEY}`);
  const data = await res.json();
  if (data.status !== "OK" || !data.results.length) return null;

  const result = data.results[0];
  const components: { types: string[]; long_name: string; short_name: string }[] =
    result.address_components;
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? null;

  return {
    city: get("locality") ?? get("administrative_area_level_2"),
    district: get("sublocality") ?? get("sublocality_level_1"),
    streetNumber: get("street_number"),
    street: get("route"),
    region: get("administrative_area_level_1"),
    subregion: get("administrative_area_level_2"),
    country: get("country"),
    postalCode: get("postal_code"),
    name: result.formatted_address as string,
    isoCountryCode:
      components.find((c) => c.types.includes("country"))?.short_name ?? null,
    timezone: null,
    formattedAddress: result.formatted_address as string,
  };
}

export const locationSlice: StateCreator<GlobalStore, [], [], LocationState> = (
  set,
  get
) => ({
  currentLocation: null,
  liveLocation: null,
  isTracking: false,
  watchId: null,
  places: [],
  locationError: null,
  selectedPlace: null,

  clearLocationError: () => set({ locationError: null }),

  getCurrentLocation: async () => {
    if (get().currentLocation) return get().currentLocation!;

    try {
      set({ isLoading: true, locationError: null });
      const pos = await getPositionAsync();
      const coords = toCoords(pos.coords);
      const loc = { coords, timestamp: pos.timestamp, mocked: false };
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      const result = { ...loc, ...(address ?? {}) };
      set({ currentLocation: result, isLoading: false, locationError: null });
      return result;
    } catch (error) {
      set({
        isLoading: false,
        locationError: (error as Error).message || "Failed to get current location",
      });
    }
  },

  startLiveTracking: async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set({ locationError: "Geolocation is not supported by this browser" });
      return;
    }
    if (get().isTracking) return;

    const id = navigator.geolocation.watchPosition(
      (pos) =>
        set({
          liveLocation: { coords: toCoords(pos.coords), timestamp: pos.timestamp },
          locationError: null,
        }),
      (err) => set({ locationError: err.message }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    set({
      watchId: { remove: () => navigator.geolocation.clearWatch(id) },
      isTracking: true,
      locationError: null,
    });
  },

  stopLiveTracking: () => {
    const { watchId } = get();
    if (watchId) {
      watchId.remove();
      set({ watchId: null, isTracking: false, liveLocation: null, locationError: null });
    }
  },

  setSelectedPlace: (place: PlaceDetails) => set({ selectedPlace: place }),

  searchPlaces: async (query: string) => {
    if (!query) {
      set({ places: [] });
      return;
    }
    try {
      const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Places search failed");
      const results: Place[] = await res.json();
      set({ places: results, locationError: null });
    } catch (err) {
      set({ locationError: (err as Error).message || "Failed to search places" });
    }
  },

  getPlaceDetails: async (placeId: string) => {
    try {
      const res = await fetch(`/api/places/details?place_id=${encodeURIComponent(placeId)}`);
      if (!res.ok) throw new Error("Failed to fetch place details");
      const details: PlaceDetails = await res.json();
      set({ selectedPlace: details, locationError: null });
      return details;
    } catch (error) {
      set({ locationError: (error as Error).message || "Failed to get place details" });
    }
  },
});
