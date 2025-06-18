"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: Array<"places"> = ["places"];

export interface ParsedAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  parsedAddress?: ParsedAddress;
}

const parseAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[]
): ParsedAddress => {
  const parsedData: ParsedAddress = {};

  addressComponents.forEach((component) => {
    if (
      component.types.includes("street_address") ||
      component.types.includes("route")
    ) {
      parsedData.street = component.long_name;
    } else if (component.types.includes("locality")) {
      parsedData.city = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      parsedData.state = component.long_name;
    } else if (component.types.includes("country")) {
      parsedData.country = component.long_name;
    } else if (component.types.includes("postal_code")) {
      parsedData.zip = component.long_name;
    }
  });

  return parsedData;
};

export const useLocationAutocomplete = (
  apiKey: string,
  initialAddress = ""
) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    region: "NG",
  });

  const [locationData, setLocationData] = useState<LocationData>({
    address: initialAddress,
  });
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [inputValue, setInputValue] = useState(initialAddress);

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser. Please search for your location manually."
      );
      return;
    }

    setIsLoadingGeolocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (isLoaded && window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder();
          try {
            const { results } = await geocoder.geocode({
              location: { lat: latitude, lng: longitude },
            });
            if (results?.[0]) {
              const address = results[0];
              const parsedAddress = parseAddressComponents(
                address.address_components
              );

              setInputValue(address.formatted_address || "");
              setLocationData({
                address: address.formatted_address || "",
                latitude,
                longitude,
                parsedAddress,
              });
            } else {
              setInputValue(
                `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
              );
              setLocationData({
                address: "",
                latitude,
                longitude,
              });
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setInputValue(
              `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
            );
            setLocationData({
              address: "",
              latitude,
              longitude,
            });
            alert(
              "Location detected, but couldn't get a full address. Please verify."
            );
          }
        } else {
          setInputValue(
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          );
          setLocationData({
            address: "",
            latitude,
            longitude,
          });
        }

        setIsLoadingGeolocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage +=
            " Please enable location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += " Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage += " The request to get user location timed out.";
        }
        alert(errorMessage + " Please try again or search manually.");
        setIsLoadingGeolocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [isLoaded]);

  useEffect(() => {
    if (
      isLoaded &&
      autocompleteRef.current &&
      window.google?.maps &&
      !autocompleteInstance.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: [
            "geometry",
            "formatted_address",
            "name",
            "address_components",
          ],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || "";
          const parsedAddress = place.address_components
            ? parseAddressComponents(place.address_components)
            : undefined;

          setInputValue(address);
          setLocationData({
            address,
            latitude: lat,
            longitude: lng,
            parsedAddress,
          });
        } else {
          console.warn("Place selected has no geometry or address:", place);
        }
      });

      autocompleteInstance.current = autocomplete;
    }

    return () => {
      autocompleteInstance.current = null;
    };
  }, [isLoaded, autocompleteRef]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (!e.target.value) {
        setLocationData({
          address: "",
          latitude: undefined,
          longitude: undefined,
          parsedAddress: undefined,
        });
      }
    },
    []
  );

  return {
    isLoaded,
    loadError,
    isLoadingGeolocation,
    inputValue,
    locationData,
    autocompleteRef,
    handleInputChange,
    handleGeolocation,
    setInputValue,
    setLocationData,
  };
};
