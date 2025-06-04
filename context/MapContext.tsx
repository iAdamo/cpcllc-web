// context/MapContext.tsx
import React, { createContext, useContext, useState } from "react";
import { UserLocation } from "@/types";

interface MapContextType {
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  error: string | null;
  setError?: (error: string | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <MapContext.Provider
      value={{
        userLocation,
        setUserLocation,
        setLoading,
        loading,
        error,
        setError: setError || (() => {}), // Provide a no-op function if setError is not passed
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
