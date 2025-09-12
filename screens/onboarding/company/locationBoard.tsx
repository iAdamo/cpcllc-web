"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useOnboarding } from "@/context/OnboardingContext";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

const parseAddressComponents = (
  addressComponents: google.maps.GeocoderAddressComponent[]
) => {
  const parsedData: Partial<{
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }> = {};

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

const libraries: Array<"places"> = ["places"];

const LocationBoard = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [autocompleteInput, setAutocompleteInput] = useState(
    data.address || ""
  );
  const [mapError, setMapError] = useState<string | null>(null);

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const googleAutocompleteInstance =
    useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    region: "US",
  });

  // Handle geolocation with error boundaries
  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingGeolocation(true);
    setMapError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 100000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      if (isLoaded && window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({
          location: { lat: latitude, lng: longitude },
        });

        if (results?.[0]) {
          const address = results[0];
          const parsedAddress = parseAddressComponents(
            address.address_components
          );
          const formattedAddress = address.formatted_address || "";

          setAutocompleteInput(formattedAddress);
          setData({
            address: formattedAddress,
            latitude,
            longitude,
            ...parsedAddress,
          });
        } else {
          setData({ latitude, longitude });
          setAutocompleteInput(
            `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
          setMapError("Couldn't determine address from coordinates");
        }
      } else {
        setData({ latitude, longitude });
        setAutocompleteInput(
          `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        );
      }
    } catch (error) {
      console.error("Location error:", error);
      setMapError(
        error instanceof GeolocationPositionError
          ? getGeolocationErrorMessage(error)
          : "Failed to get location"
      );
    } finally {
      setIsLoadingGeolocation(false);
    }
  }, [isLoaded, setData]);

  // Initialize autocomplete
  useEffect(() => {
    if (
      isLoaded &&
      autocompleteRef.current &&
      !googleAutocompleteInstance.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: [
            "address_components",
            "geometry",
            "formatted_address",
            "name",
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
            : {};

          setAutocompleteInput(address);
          setData({
            address: address,
            latitude: lat,
            longitude: lng,
            ...parsedAddress,
          });
          setMapError(null);
        }
      });

      googleAutocompleteInstance.current = autocomplete;
    }

    return () => {
      if (googleAutocompleteInstance.current) {
        google.maps.event.clearInstanceListeners(
          googleAutocompleteInstance.current
        );
      }
      googleAutocompleteInstance.current = null;
    };
  }, [isLoaded, setData]);

  // Helper function for geolocation errors
  const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was denied. Please enable permissions.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "Error getting location.";
    }
  };

  if (loadError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error loading map services. Please check your internet connection.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading map
        services...
      </div>
    );
  }

  return (
    <VStack className="w-full p-4 sm:p-8 gap-6 sm:gap-8 md:min-h-screen justify-center">
      <VStack className="w-full gap-6 justify-center items-center flex-grow">
        <Card
          variant="filled"
          className="w-full max-w-xl md:p-4 p-6 text-center md:shadow-md"
        >
          <Text size="sm" className="text-gray-700 md:text-base md:leading-relaxed">
            Providing your company location helps us ensure accurate service
            delivery and better communication with your clients.
          </Text>
        </Card>

        <Card
          variant="outline"
          className="w-full max-w-xl md:p-4 p-6 gap-4 md:shadow-lg"
        >
          <VStack className="gap-2">
            <Text size="xs" className="text-gray-700 md:text-sm font-medium">
              Search for your company address
            </Text>
            <input
              className="md:h-12 h-10 pl-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 w-full"
              ref={autocompleteRef}
              placeholder="E.g., 123 Main Street, New York, NY"
              value={autocompleteInput}
              onChange={(e) => setAutocompleteInput(e.target.value)}
              disabled={isLoadingGeolocation}
            />
          </VStack>

          <Text size="xs" className="text-gray-500 md:text-sm text-center">- OR -</Text>

          <Button
            onPress={handleGeolocation}
            isDisabled={isLoadingGeolocation}
            className="md:w-full w-fit self-center bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-200"
          >
            {isLoadingGeolocation ? (
              <HStack className="items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <ButtonText>Detecting Location...</ButtonText>
              </HStack>
            ) : (
              <HStack className="items-center gap-2">
                <MapPin className="h-5 w-5" />
                <ButtonText>Use Current Location</ButtonText>
              </HStack>
            )}
          </Button>

          {/* Error Display */}
          {mapError && (
            <Card variant="filled" className="bg-red-100 p-3">
              <Text className="text-red-700">{mapError}</Text>
            </Card>
          )}

          {/* Navigation Buttons */}
          <HStack className="justify-between mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onPress={prevStep}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ButtonText>Back</ButtonText>
            </Button>
            <Button
              onPress={nextStep}
              isDisabled={!data.address}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
            >
              <ButtonText>Continue</ButtonText>
            </Button>
          </HStack>
        </Card>
      </VStack>
    </VStack>
  );
};

export default LocationBoard;
