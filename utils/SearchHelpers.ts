export async function getPlaceSuggestions(query: string): Promise<string[]> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.predictions.map((p: any) => p.description);
}

export function getCurrentCoords(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        resolve({ lat, lng });
      },
      (err) => reject(err)
    );
  });
}
