export async function getCurrentLocation(): Promise<{
  lat: string;
  long: string;
} | null> {
  return new Promise((resolve, reject) => {
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

export async function getAddressFromCoords(
  lat: string,
  long: string
): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`
  );
  const data = await res.json();
  return data.display_name || `${lat}, ${long}`;
}
