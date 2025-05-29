// utils/google-maps/config.ts
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined");
}

export const googleMapsConfig = {
  apiKey: API_KEY,
  libraries: ["places", "geometry", "drawing", "visualization"] as const,
  defaultCenter: { lat: 40.7128, lng: -74.006 }, // Default to NYC
  defaultZoom: 12,
};
