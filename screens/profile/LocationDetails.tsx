"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VStack } from "../../components/ui/vstack";
import { HStack } from "../../components/ui/hstack";
import { Link } from "../../components/ui/link";
import { Card } from "../../components/ui/card";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";
import { Button, ButtonIcon } from "../../components/ui/button";
import { FormControl } from "../../components/ui/form-control";
import { Input, InputField } from "../../components/ui/input";
import { useToast, Toast, ToastTitle } from "../../components/ui/toast";
import { Icon, EditIcon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { MapIcon, MapPinIcon, Loader2 } from "lucide-react";
import { UserData, CompanyData } from "@/types";
import { updateCompanyProfile } from "@/axios/users";

declare global {
  interface Window {
    google: any;
  }
}

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
  isSaving: boolean;
  handleSave: () => void;
  handleCancelEdit: () => void;
  fetchUserProfile: () => Promise<void>;
}

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
  const [addressInput, setAddressInput] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const addressInputRef = useRef<any>(null);
  const toast = useToast();

  const locationTypes = ["primary", "secondary", "tertiary"] as const;

  // Load Google Maps script
  useEffect(() => {
    if (!isEditable || window.google) {
      setIsMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env
      .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [isEditable]);

  const handleEditStart = useCallback((fields: Record<string, any>) => {
    setEditingFields((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const handleCancelEdit = () => {
    setEditingFields({});
  };

  const handleSave = async () => {
    if (Object.keys(editingFields).length === 0) return;

    setIsSaving(true);

    try {
      const formData = new FormData();
      const locationKey = Object.keys(editingFields)[0].split(".")[1];
      console.log(editingFields[`location.${locationKey}`].address.address);
      if (editingFields[`location.${locationKey}`].address) {
        formData.append(
          `location.${locationKey}.address.address`,
          editingFields[`location.${locationKey}`].address.address || ""
        );
        formData.append(
          `location.${locationKey}.address.city`,
          editingFields[`location.${locationKey}`].address.city || ""
        );
        formData.append(
          `location.${locationKey}.address.state`,
          editingFields[`location.${locationKey}`].address.state || ""
        );
        formData.append(
          `location.${locationKey}.address.zip`,
          editingFields[`location.${locationKey}`].address.zip || ""
        );
        formData.append(
          `location.${locationKey}.address.country`,
          editingFields[`location.${locationKey}`].address.country || ""
        );
      }
      if (editingFields[`location.${locationKey}`].coordinates) {
        formData.append(
          `location.${locationKey}.coordinates.lat`,
          editingFields[`location.${locationKey}`].coordinates.lat || ""
        );
        formData.append(
          `location.${locationKey}.coordinates.long`,
          editingFields[`location.${locationKey}`].coordinates.long || ""
        );
      }
      await updateCompanyProfile(formData);
      await fetchUserProfile();

      setEditingFields({});

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Location updated successfully</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Error updating location:", error);
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

  const processPlaceResult = useCallback(
    (place: any) => {
      const address = place.formatted_address;
      setAddressInput(address);

      // Extract address components
      const addressComponents: Record<string, string> = {};
      place.address_components.forEach((component: any) => {
        component.types.forEach((type: string) => {
          addressComponents[type] = component.long_name;
        });
      });

      // Update the form fields with complete address data
      handleEditStart({
        [`location.${editingLocation}`]: {
          coordinates: {
            lat: place.geometry.location.lat(),
            long: place.geometry.location.lng(),
          },
          address: {
            address: address,
            city:
              addressComponents.locality ||
              addressComponents.postal_town ||
              addressComponents.neighborhood ||
              "",
            state: addressComponents.administrative_area_level_1 || "",
            zip: addressComponents.postal_code || "",
            country: addressComponents.country || "",
          },
        },
      });
    },
    [editingLocation, handleEditStart]
  );

  // Initialize autocomplete when editing starts
  useEffect(() => {
    if (
      editingLocation &&
      isMapsLoaded &&
      window.google &&
      addressInputRef.current
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["address_components", "geometry", "formatted_address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) {
          toast.show({
            placement: "top",
            render: ({ id }) => (
              <Toast nativeID={id} variant="outline" action="error">
                <ToastTitle>No details available for this address</ToastTitle>
              </Toast>
            ),
          });
          return;
        }

        processPlaceResult(place);
      });
    }

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [editingLocation, isMapsLoaded, processPlaceResult, toast]);

  const handleLocationEditStart = (locationType: string) => {
    setEditingLocation(locationType);
    const currentLocation = activeRoleId?.location?.[locationType];
    setAddressInput(currentLocation?.address?.address || "");

    // Initialize with current location or empty structure
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

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>
              Geolocation is not supported by your browser
            </ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setIsGeolocating(true);

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

      if (!isMapsLoaded || !window.google) {
        throw new Error("Google Maps API not loaded");
      }

      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results: any[], status: string) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(new Error(status));
            }
          }
        );
      });

      if (results && results[0]) {
        processPlaceResult(results[0]);
      } else {
        throw new Error("No results found");
      }
    } catch (error: any) {
      let errorMessage = "Failed to get current location";
      if (error.message === "User denied Geolocation") {
        errorMessage = "Location access was denied";
      } else if (error.message === "Timeout expired") {
        errorMessage = "Location request timed out";
      }

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>{errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsGeolocating(false);
    }
  };

  const renderLocationCard = (locationType: string) => {
    const location = activeRoleId?.location?.[locationType];
    const isEditing = editingLocation === locationType;

    return (
      <VStack key={locationType}>
        <Heading size="xs" className="capitalize mb-2">
          {locationType} Location
        </Heading>
        <Card variant="filled" className="mb-2">
          {isEditing ? (
            <>
              <FormControl className="mb-4">
                <Text size="xs" className="mb-1">
                  Address
                </Text>
                <VStack className="relative">
                  <Input className="h-8">
                    <InputField
                      ref={addressInputRef}
                      value={addressInput}
                      onChangeText={setAddressInput}
                      placeholder="Search for an address or use current location"
                      className=""
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={getCurrentLocation}
                      className="border-none"
                      disabled={isGeolocating}
                    >
                      {isGeolocating ? (
                        <Loader2 className="h-4 w-4 text-red-500 animate-spin" />
                      ) : (
                        <MapPinIcon className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </Input>
                </VStack>
              </FormControl>
              <HStack className="gap-2 self-end mt-2">
                <Button
                  size="sm"
                  variant="link"
                  onPress={() => {
                    handleSave();
                    setEditingLocation(null);
                  }}
                  disabled={isSaving}
                >
                  <ButtonIcon as={CheckIcon} />
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  onPress={() => {
                    handleCancelEdit();
                    setEditingLocation(null);
                  }}
                >
                  <ButtonIcon as={CloseIcon} />
                </Button>
              </HStack>
            </>
          ) : (
            <>
              {isEditable && !isEditing ? (
                <HStack className="justify-between gap-4">
                  {location ? (
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
                        <Icon as={MapIcon}  />
                      </Link>
                    )}
                  </VStack>
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

  return (
    <VStack className="mt-4">
      {!isMapsLoaded && (
        <div className="flex items-center justify-center text-gray-500">
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          Loading map services...
        </div>
      )}
      {locationTypes.map(renderLocationCard)}
    </VStack>
  );
};

export default LocationDetails;
