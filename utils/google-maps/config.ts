const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  if (process.env.NODE_ENV === "development") {
    console.error(
      "NEXT_PUBLIC_Maps_API_KEY is not defined. Please ensure it's set in your .env.local file. Google Maps will not function without it."
    );
    throw new Error("Missing Google Maps API Key in development.");
  } else {
    console.error(
      "CRITICAL: NEXT_PUBLIC_Maps_API_KEY is missing in production environment!"
    );
    throw new Error("Google Maps API Key is missing.");
  }
}

export const googleMapsConfig = {
  apiKey: API_KEY,
  libraries: ["places", "geometry", "drawing", "visualization"] as const,
  defaultCenter: { lat: 6.5244, lng: 3.3792 },
  defaultZoom: 12,
};

export type GoogleMapsConfig = typeof googleMapsConfig;
