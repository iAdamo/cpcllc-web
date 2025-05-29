// components/maps/PlacesAutocomplete.tsx
"use client";

import { Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface PlacesAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
}

export const PlacesAutocomplete = ({
  onPlaceSelected,
  placeholder = "Search for a location...",
}: PlacesAutocompleteProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      setIsLoading(true);
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelected(place);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        fields={["geometry", "name", "formatted_address", "place_id"]}
        types={["establishment", "geocode"]}
      >
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-full"
          disabled={isLoading}
        />
      </Autocomplete>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SearchIcon className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </div>
  );
};
