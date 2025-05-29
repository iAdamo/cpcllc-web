// components/maps/GoogleMapsProvider.tsx
"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, useCallback, useState } from "react";
import { googleMapsConfig } from "@/utils/google-maps/config";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: googleMapsConfig.libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      {children}
      {/* You can render a default map here or leave it to child components */}
    </>
  );
};

export default GoogleMapsProvider;
