// hooks/useGoogleMaps.ts
"use client";

import { useCallback, useState } from "react";
import { googleMapsConfig } from "@/utils/google-maps/config";

export const useGoogleMaps = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const panTo = useCallback(
    (location: google.maps.LatLngLiteral) => {
      if (map) {
        map.panTo(location);
        map.setZoom(15);
      }
    },
    [map]
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          panTo(location);
        },
        () => {
          // Handle error or fallback to default center
          panTo(googleMapsConfig.defaultCenter);
        }
      );
    }
  }, [panTo]);

  return {
    map,
    onLoad,
    onUnmount,
    selectedPlace,
    setSelectedPlace,
    currentLocation,
    getCurrentLocation,
    panTo,
  };
};
