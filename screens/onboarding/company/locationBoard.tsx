"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { useOnboarding } from "@/context/OnboardingContext";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin, Search } from "lucide-react"; // Importing icons for better UX

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

// Define libraries as a constant outside the component
const libraries: Array<"places"> = ["places"];

const LocationBoard = () => {
  const { prevStep, nextStep, setData, data } = useOnboarding();
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [autocompleteInput, setAutocompleteInput] = useState(
    data.companyAddress || ""
  ); // State for input value

  const autocompleteRef = useRef<HTMLInputElement>(null); // Ref for the input element
  const googleAutocompleteInstance =
    useRef<google.maps.places.Autocomplete | null>(null); // Ref for the Google Autocomplete object

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    // Add a region for better suggestions, e.g., 'NG' for Nigeria
    region: "NG", // This will bias results towards Nigeria
  });

  // --- Geolocation Handler ---
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

        // Perform reverse geocoding to get a human-readable address
        if (isLoaded && window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder();
          try {
            const { results } = await geocoder.geocode({
              location: { lat: latitude, lng: longitude },
            });
            if (results && results[0]) {
              const address = results[0];
              const parsedAddress = parseAddressComponents(
                address.address_components
              );
              console.log(parsedAddress);

              setAutocompleteInput(address.formatted_address || ""); // Update input field with detected address
              setData({
                companyAddress: address.formatted_address || "",
                latitude,
                longitude,
                ...parsedAddress, // Spread parsed address fields into the onboarding data
              });
            } else {
              // If no address found, just set coordinates
              setData({ latitude, longitude, companyAddress: "" });
              setAutocompleteInput(
                `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
              );
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setData({ latitude, longitude, companyAddress: "" });
            setAutocompleteInput(
              `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
            );
            alert(
              "Location detected, but couldn't get a full address. Please verify."
            );
          }
        } else {
          // Fallback if Google Maps API isn't fully loaded for geocoding
          setData({ latitude, longitude, companyAddress: "" });
          setAutocompleteInput(
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          );
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Increased timeout
    );
  }, [isLoaded, setData]); // Added isLoaded to dependencies

  // --- Autocomplete Initialization and Listener ---
  useEffect(() => {
    // Only initialize if API is loaded and input ref is available
    if (
      isLoaded &&
      autocompleteRef.current &&
      window.google?.maps &&
      !googleAutocompleteInstance.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"], // Focus on addresses
          componentRestrictions: { country: "us" }, // Restrict to Nigeria for hyperlocal app
          fields: ["geometry", "formatted_address", "name"], // Specify required fields
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || "";
          setAutocompleteInput(address); // Update input field with selected place
          setData({
            companyAddress: address,
            latitude: lat,
            longitude: lng,
          });
        } else {
          console.warn("Place selected has no geometry or address:", place);
          setData({
            companyAddress: "", // Clear address if invalid place selected
            latitude: undefined, // Clear coordinates
            longitude: undefined,
          });
          setAutocompleteInput(""); // Clear input if invalid selection
          alert(
            "Invalid place selected. Please choose a valid address from the suggestions."
          );
        }
      });

      googleAutocompleteInstance.current = autocomplete; // Store instance in ref
    }

    // Cleanup function: remove listener if component unmounts
    return () => {
      if (googleAutocompleteInstance.current) {
        // While there's no direct "destroy" method for Autocomplete,
        // setting the ref to null helps with garbage collection and prevents
        // attempting to use a stale instance.
        googleAutocompleteInstance.current = null;
      }
    };
  }, [isLoaded, setData]); // Rerun effect if API loaded state changes

  // --- Handle manual input changes for Autocomplete ---
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAutocompleteInput(e.target.value);
      // Optionally clear data if user types and doesn't select from dropdown
      if (!e.target.value) {
        setData({
          companyAddress: "",
          latitude: undefined,
          longitude: undefined,
        });
      }
    },
    [setData]
  );

  // --- Initial loading states ---
  if (loadError)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error loading map services. Please check your internet connection.
      </div>
    );
  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading map
        services...
      </div>
    );

  // --- Rendered Component ---
  return (
    <VStack className="w-full p-4 sm:p-8 gap-6 sm:gap-8 min-h-screen justify-center">
      <VStack className="w-full gap-6 justify-center items-center flex-grow">
        <Card
          variant="filled"
          className="w-full max-w-xl p-4 sm:p-6 text-center shadow-md"
        >
          <Text className="text-gray-700 text-base leading-relaxed">
            Providing your company location helps us ensure accurate service
            delivery, compliance with local regulations, and better
            communication with your clients. This information will also help
            customers find and connect with your business more easily.
          </Text>
        </Card>

        <Card
          variant="outline"
          className="w-full max-w-xl p-4 sm:p-6 gap-4 shadow-lg"
        >
          {/* Autocomplete Input Field */}
          <VStack className="gap-2">
            <Text className="text-gray-700 text-sm font-medium">
              Search for your company address
            </Text>
            <Input className="h-12 border-gray-300 focus-within:border-blue-500 transition-colors duration-200">
              <InputField
                ref={autocompleteRef} // Attach ref to the input field
                id="place-autocomplete-input"
                placeholder="E.g., 123 Main Street, Victoria Island, Lagos"
                value={autocompleteInput}
                onChange={handleInputChange} // Handle manual typing
                disabled={isLoadingGeolocation}
                className="pl-10 pr-4" // Padding for icon
              />
              <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </Input>
          </VStack>

          <Text className="text-gray-500 text-sm text-center">- OR -</Text>

          {/* Geolocation Button */}
          <Button
            onPress={handleGeolocation}
            disabled={isLoadingGeolocation}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-200"
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

          {/* Navigation Buttons */}
          <HStack className="justify-between mt-auto pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onPress={prevStep}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ButtonText>Back</ButtonText>
            </Button>
            <Button
              onPress={nextStep}
              disabled={
                !data.latitude || !data.longitude || !data.companyAddress
              } // Disable if location not set
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
