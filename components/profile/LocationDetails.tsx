import { useState, useRef, useEffect } from "react";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Link } from "../ui/link";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Button, ButtonIcon } from "../ui/button";
import { FormControl } from "../ui/form-control";
import { Input, InputField } from "../ui/input";
import { useToast, Toast, ToastTitle } from "../ui/toast";
import { Icon, EditIcon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { MapIcon, MapPinIcon } from "lucide-react";
import { UserData, CompanyData } from "@/types";

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
}

const LocationDetails = ({
  activeRoleId,
  isEditable,
  isSaving,
  handleSave,
  handleCancelEdit,
}: LocationDetailsProps) => {
  const [editingFields, setEditingFields] = useState<
    Partial<Record<EditableFields, string>>
  >({});
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const addressInputRef = useRef<any>(null);
  const toast = useToast();

  const locationTypes = ["primary", "secondary", "tertiary"] as const;

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env
        .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize autocomplete when editing starts
  useEffect(() => {
    if (editingLocation && window.google && addressInputRef.current) {
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
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [editingLocation]);

  const handleEditStart = (fields: Record<string, any>) => {
    setEditingFields((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const processPlaceResult = (place: any) => {
    const address = place.formatted_address;
    setAddressInput(address);

    // Extract address components into a more usable format
    const addressComponents: Record<string, string> = {};
    place.address_components.forEach((component: any) => {
      component.types.forEach((type: string) => {
        addressComponents[type] = component.long_name;
      });
    });

    // Construct the full address object
    const addressObj = {
      address: address,
      city:
        addressComponents.locality ||
        addressComponents.postal_town ||
        addressComponents.neighborhood ||
        "",
      state: addressComponents.administrative_area_level_1 || "",
      zip: addressComponents.postal_code || "",
      country: addressComponents.country || "",
    };

    // Update the form fields
    handleEditStart({
      [`location.${editingLocation}`]: {
        coordinates: {
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        },
        address: addressObj,
      },
    });
  };

  const handleLocationEditStart = (locationType: string) => {
    setEditingLocation(locationType);
    const currentLocation = activeRoleId?.location?.[locationType];
    // alert(`[location.${locationType}]:` + currentLocation);
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

      if (!window.google) {
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

  const renderLocationField = (
    locationType: string,
    field: string,
    label: string
  ) => {
    const valuePath = `location.${locationType}.address.${field}`;
    const isEditing = editingLocation === locationType;

    return isEditing ? (
      <FormControl className="mb-2">
        <Text size="xs" className="mb-1">
          {label}
        </Text>
        <Input className="h-8">
          <InputField
            value={editingFields[valuePath] || ""}
            onChangeText={(text) => handleEditStart({ [valuePath]: text })}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </Input>
      </FormControl>
    ) : (
      <Text size="xs" className="mb-2">
        <Text className="font-semibold">{label}:</Text>{" "}
        {activeRoleId?.location?.[locationType]?.address?.[field] ||
          "Not specified"}
      </Text>
    );
  };

  const renderLocationCard = (locationType: string) => {
    const location = activeRoleId?.location?.[locationType];
    const isEditing = editingLocation === locationType;

    return (
      <VStack>
        <Heading size="xs" className="capitalize mb-2">
          {locationType} Location
        </Heading>
        <Card key={locationType} variant="filled" className="mb-2">
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
                    />
                    <Button
                      size="sm"
                      variant="link"
                      onPress={getCurrentLocation}
                      className=""
                      disabled={isGeolocating}
                    >
                      <ButtonIcon as={MapPinIcon} />
                    </Button>
                  </Input>
                </VStack>
              </FormControl>

              {renderLocationField(locationType, "city", "City")}
              {renderLocationField(locationType, "state", "State")}
              {renderLocationField(locationType, "zip", "ZIP Code")}
              {renderLocationField(locationType, "country", "Country")}

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
                        <Icon as={MapIcon} className="w-6 h-6" />
                      </Link>
                    )}
                  </VStack>
                </HStack>
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
    <VStack className="mt-4">{locationTypes.map(renderLocationCard)}</VStack>
  );
};

export default LocationDetails;
