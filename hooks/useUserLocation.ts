import { useMapContext } from "@/context/MapContext";

export const useUserLocation = () => {
  const { setUserLocation, setLoading, setError } = useMapContext();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      if (setError) {
        setError("Geolocation is not supported by your browser");
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        if (setError) {
          setError(error.message);
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 67000,
      }
    );
  };

  return { getCurrentLocation };
};
