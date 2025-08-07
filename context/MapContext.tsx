import React, { createContext, useContext, useState, useEffect } from "react";
import { UserLocation } from "@/types";

interface MapContextType {
  userLocation: UserLocation;
  loading: boolean;
  error: string | null;
  ready: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("User denied geolocation permission");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable");
          break;
        case error.TIMEOUT:
          setError("Location request timed out");
          break;
        default:
          setError("An unknown error occurred");
      }
      // Fallback to a default center (e.g., 0,0)
      setUserLocation({ lat: 0.0, lng: 0.0 });
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  return (
    <MapContext.Provider
      value={{
        userLocation: userLocation || { lat: 0.0, lng: 0.0 },
        loading,
        error,
        ready: !!userLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
