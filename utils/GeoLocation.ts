export async function getCurrentLocation(): Promise<{
  lat: string;
  long: string;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toString();
        const long = pos.coords.longitude.toString();
        resolve({ lat, long });
      },
      () => resolve(null),
      { enableHighAccuracy: true }
    );
  });
}

export async function getnPlaceSuggestions(query: string): Promise<string[]> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.predictions.map((p: any) => p.description);
}

export async function getPlaceSuggestions(query: string): Promise<string[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=10`
    );
    const data = await response.json();
    return data.map((item: any) => item.display_name);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}
