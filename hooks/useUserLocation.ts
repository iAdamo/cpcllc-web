// hooks/useUserLocation.ts
import { useEffect } from "react";
import { useMapContext } from "@/context/MapContext";

export const useUserLocation = () => {
  const { setUserLocation, setLoading, setError } = useMapContext();

  useEffect(() => {
    if (!navigator.geolocation) {
      if (setError) {
        setError("Geolocation is not supported by your browser");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const watchId = navigator.geolocation.watchPosition(
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
        timeout: 27000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setUserLocation, setLoading, setError]);
};
