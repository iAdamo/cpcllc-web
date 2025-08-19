"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VStack } from "../../components/ui/vstack";
import { HStack } from "../../components/ui/hstack";
import { Link } from "../../components/ui/link";
import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";
import { Button, ButtonIcon, ButtonText } from "../../components/ui/button";
import { useToast, Toast, ToastTitle } from "../../components/ui/toast";
import { Icon, EditIcon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { MapIcon, MapPin, Loader2 } from "lucide-react";
import { UserData, CompanyData } from "@/types";
import { updateCompanyProfile } from "@/axios/users";
import { useJsApiLoader } from "@react-google-maps/api";

declare global {
  interface Window {
    google: any;
  }
}

const libraries: Array<"places"> = ["places"];

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
      ? `${Prefix}${K & string}`
      : `${Prefix}${K & string}` | NestedKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type EditableFields = NonNullable<
  NestedKeys<NonNullable<CompanyData["location"]>>
>;

interface LocationDetailsProps {
  activeRoleId: UserData["activeRoleId"];
  isEditable: boolean;
  fetchUserProfile: () => Promise<void>;
}

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

const LocationDetails = ({
  activeRoleId,
  isEditable,
  fetchUserProfile,
}: LocationDetailsProps) => {
  const [editingFields, setEditingFields] = useState<
    Partial<Record<EditableFields, string>>
  >({});
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const googleAutocompleteInstance =
    useRef<google.maps.places.Autocomplete | null>(null);
  const toast = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
    region: "US",
  });

  const locationTypes = ["primary", "secondary", "tertiary"] as const;

  const handleEditStart = useCallback((fields: Record<string, any>) => {
    setEditingFields((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const handleCancelEdit = () => {
    setEditingFields({});
    setEditingLocation(null);
    setMapError(null);
  };

  const handleSave = async () => {
    if (!editingLocation || !editingFields[`location.${editingLocation}`])
      return;

    setIsSaving(true);

    try {
      const formData = new FormData();
      const locationData = editingFields[`location.${editingLocation}`];

      // Only allow saving if we have coordinates (meaning it came from a valid source)
      if (!locationData.coordinates?.lat || !locationData.coordinates?.long) {
        throw new Error("Invalid location data");
      }

      formData.append(
        `location.${editingLocation}.address.address`,
        locationData.address?.address || ""
      );
      formData.append(
        `location.${editingLocation}.address.city`,
        locationData.address?.city || ""
      );
      formData.append(
        `location.${editingLocation}.address.state`,
        locationData.address?.state || ""
      );
      formData.append(
        `location.${editingLocation}.address.zip`,
        locationData.address?.zip || ""
      );
      formData.append(
        `location.${editingLocation}.address.country`,
        locationData.address?.country || ""
      );
      formData.append(
        `location.${editingLocation}.coordinates.lat`,
        locationData.coordinates.lat.toString()
      );
      formData.append(
        `location.${editingLocation}.coordinates.long`,
        locationData.coordinates.long.toString()
      );

      await updateCompanyProfile(formData);
      await fetchUserProfile();

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Location updated successfully</ToastTitle>
          </Toast>
        ),
      });

      handleCancelEdit();
    } catch (error) {
      console.error("Error updating location:", error);
      setMapError(
        "Invalid location data. Please use the search or your current location."
      );
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>Error updating location</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser");
      return;
    }

    setIsGeolocating(true);
    setMapError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
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

          handleEditStart({
            [`location.${editingLocation}`]: {
              coordinates: {
                lat: latitude,
                long: longitude,
              },
              address: {
                address: formattedAddress,
                city: parsedAddress.city || "",
                state: parsedAddress.state || "",
                zip: parsedAddress.zip || "",
                country: parsedAddress.country || "",
              },
            },
          });
        } else {
          setMapError("Couldn't determine address from coordinates");
        }
      }
    } catch (error) {
      console.error("Location error:", error);
      setMapError(
        error instanceof GeolocationPositionError
          ? getGeolocationErrorMessage(error)
          : "Failed to get location, Try again!"
      );
    } finally {
      setIsGeolocating(false);
    }
  }, [isLoaded, editingLocation, handleEditStart]);

  // Initialize autocomplete
  useEffect(() => {
    if (
      isLoaded &&
      editingLocation &&
      autocompleteRef.current &&
      !googleAutocompleteInstance.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"],
          // componentRestrictions: { country: "us" },
          fields: ["address_components", "geometry", "formatted_address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || "";
          const parsedAddress = place.address_components
            ? parseAddressComponents(place.address_components)
            : {};

          handleEditStart({
            [`location.${editingLocation}`]: {
              coordinates: {
                lat,
                long: lng,
              },
              address: {
                address,
                city: parsedAddress.city || "",
                state: parsedAddress.state || "",
                zip: parsedAddress.zip || "",
                country: parsedAddress.country || "",
              },
            },
          });
          setMapError(null);
        } else {
          setMapError("Please select a valid address from the suggestions");
        }
      });

      googleAutocompleteInstance.current = autocomplete;
    }

    return () => {
      if (googleAutocompleteInstance.current) {
        window.google.maps.event.clearInstanceListeners(
          googleAutocompleteInstance.current
        );
      }
      googleAutocompleteInstance.current = null;
    };
  }, [isLoaded, editingLocation, handleEditStart]);

  const handleLocationEditStart = (locationType: string) => {
    setEditingLocation(locationType);
    const currentLocation = activeRoleId?.location?.[locationType];

    handleEditStart({
      [`location.${locationType}`]: currentLocation || {
        coordinates: { lat: 0, long: 0 },
        address: {
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      },
    });
  };

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

  const renderLocationCard = (locationType: string) => {
    const location = activeRoleId?.location?.[locationType];
    const isEditing = editingLocation === locationType;
    const currentAddress = isEditing
      ? editingFields[`location.${locationType}`]?.address?.address || ""
      : location?.address?.address || "";

    return (
      <VStack key={locationType}>
        <Heading size="xs" className="capitalize mb-2">
          {locationType} Location
        </Heading>
        <Card variant="filled" className="mb-2">
          {isEditing ? (
            <>
              <Text size="xs" className="mb-2 text-blue-600">
                If the detected address looks inaccurate, you can use the
                autocomplete search below to find and select the correct
                address.
              </Text>
              <div className="mb-4">
                <Text size="xs" className="mb-1">
                  Search for your company address
                </Text>
                <input
                  className="h-10 w-full pl-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  ref={autocompleteRef}
                  placeholder="E.g., 123 Main Street, New York, NY"
                  defaultValue={currentAddress}
                  disabled={isGeolocating}
                />
              </div>

              <Text className="text-gray-500 text-sm text-center mb-2">
                - OR -
              </Text>

              <Button
                onPress={handleGeolocation}
                disabled={isGeolocating}
                className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-200 mb-4"
              >
                {isGeolocating ? (
                  <HStack className="items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <ButtonText>Detecting Location...</ButtonText>
                  </HStack>
                ) : (
                  <HStack className="items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <ButtonText>Use Current Location</ButtonText>
                  </HStack>
                )}
              </Button>

              {mapError && (
                <Card variant="filled" className="bg-red-100 p-3 mb-4">
                  <Text className="text-red-700">{mapError}</Text>
                </Card>
              )}

              <HStack className="gap-2 self-end mt-2">
                <Button
                  size="sm"
                  variant="link"
                  onPress={handleSave}
                  disabled={
                    isSaving ||
                    !editingFields[`location.${editingLocation}`]?.coordinates
                  }
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <ButtonIcon as={CheckIcon} />
                  )}
                </Button>
                <Button size="sm" variant="link" onPress={handleCancelEdit}>
                  <ButtonIcon as={CloseIcon} />
                </Button>
              </HStack>
            </>
          ) : (
            <>
              {isEditable ? (
                <HStack className="justify-between gap-4">
                  {location ? (
                    <>
                      <Text size="sm" className="mb-2">
                        <Text size="sm" className="font-semibold">
                          Address:{" "}
                        </Text>
                        {location.address.address || "Not specified"}
                      </Text>
                      <VStack>
                        <Button
                          variant="link"
                          size="xs"
                          onPress={() => handleLocationEditStart(locationType)}
                          className="self-end p-0 h-4"
                        >
                          <ButtonIcon as={EditIcon} />
                        </Button>
                        {location?.coordinates && (
                          <Link
                            href={`https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.long}`}
                            className="flex-row mt-2 w-4 h-4"
                            isExternal
                          >
                            <Icon as={MapIcon} />
                          </Link>
                        )}
                      </VStack>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => handleLocationEditStart(locationType)}
                      className="w-full"
                    >
                      <ButtonText>Add {locationType} location</ButtonText>
                    </Button>
                  )}
                </HStack>
              ) : location ? (
                <Text size="sm" className="mb-2">
                  <Text size="sm" className="font-semibold">
                    Address:{" "}
                  </Text>
                  {location.address.address || "Not specified"}
                </Text>
              ) : (
                <Text size="xs" className="text-gray-500 italic">
                  No {locationType} location set
                </Text>
              )}
            </>
          )}
        </Card>
      </VStack>
    );
  };

  if (loadError) {
    return (
      <div className="flex justify-center items-center md:bg-transparent bg-red-100 p-2 md:text-lg text-sm text-red-600">
        Please check your internet connection.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
      </div>
    );
  }

  return (
    <VStack className="mt-4">{locationTypes.map(renderLocationCard)}</VStack>
  );
};

export default LocationDetails;
