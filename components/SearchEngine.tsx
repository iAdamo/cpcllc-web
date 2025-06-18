import { useState, useEffect } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { SearchIcon } from "@/components/ui/icon";
import { useRouter, usePathname } from "next/navigation";
import { useCompanySearch } from "@/hooks/useCompanySearch";
import { getCurrentLocation } from "@/utils/GeoLocation";
import { getPlaceSuggestions } from "@/utils/GeoLocation";

export const SearchEngine = () => {
  const [isFirstDropdownVisible, setIsFirstDropdownVisible] = useState(false);
  const [isSecondDropdownVisible, setIsSecondDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [lat, setLat] = useState<string | undefined>(undefined);
  const [long, setLong] = useState<string | undefined>(undefined);
  const [useCurrent, setUseCurrent] = useState(false);
  // const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  // const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  // const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    if (!useCurrent) return;

    (async () => {
      const coords = await getCurrentLocation();
      if (coords) {
        setLat(coords.lat);
        setLong(coords.long);
      }
    })();
  }, [useCurrent]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (locationInput && !useCurrent) {
        const suggestions = await getPlaceSuggestions(locationInput);
        setLocationSuggestions(suggestions);
      }
    }, 300); // debounce to avoid flooding API

    return () => clearTimeout(timeout);
  }, [locationInput, useCurrent]);

  const { results } = useCompanySearch({
    searchInput,
    lat: useCurrent ? lat : undefined,
    long: useCurrent ? long : undefined,
    address: !useCurrent ? locationInput : undefined,
  });

  const handleFirstFocus = () => {
    setIsFirstDropdownVisible(true);
  };
  const handleSecondFocus = () => {
    setIsSecondDropdownVisible(true);
  };

  const handleFirstBlur = () => {
    setTimeout(() => setIsFirstDropdownVisible(false), 150);
  };

  const handleSecondBlur = () => {
    setTimeout(() => {
      setIsSecondDropdownVisible(false);
      setLocationSuggestions([]);
    }, 150);
  };

  const selectCurrentLocation = async () => {
    // setUseCurrentLocation(true);
    const coords = await getCurrentLocation();
    if (coords) {
      // console.log(coords);
      setLat(coords.lat);
      setLong(coords.long);
    }
  };
  const handleSearch = () => {
    if (results.length === 1) {
      const company = results[0];
      router.push(`/companies/${company._id}`);
    } else if (results.length > 1) {
      router.push(
        `/search?query=${encodeURIComponent(
          searchInput
        )}&location=${encodeURIComponent(locationInput)}`
      );
    }
  };

  return (
    <VStack className="hidden md:flex md:flex-row h-full">
      <FormControl
        className={`w-full ${currentPath !== "/" && "drop-shadow-xl"} flex-row`}
      >
        <Input className="h-14 w-full bg-white border-0 rounded-none">
          <InputField
            type="text"
            placeholder="services, companies, jobs..."
            value={searchInput}
            onChange={(e) => {
              const value = e.nativeEvent.text;
              setSearchInput(value);
              if (!value.trim()) {
                setIsFirstDropdownVisible(false);
              } else {
                setIsFirstDropdownVisible(true);
              }
            }}
            className="bg-transparent placeholder:text-md"
            onFocus={handleFirstFocus}
            onBlur={handleFirstBlur}
          />
          <Divider orientation="vertical" className="h-4/5 w-1" />
          <InputField
            type="text"
            placeholder="location"
            value={locationInput}
            onChange={(e) => {
              setUseCurrent(false);
              setLocationInput(e.nativeEvent.text);
            }}
            className="bg-transparent placeholder:text-md"
            onFocus={handleSecondFocus}
            onBlur={handleSecondBlur}
          />
          <Button onPress={handleSearch} className="h-full bg-blue-600 w-14">
            <ButtonIcon as={SearchIcon} className="w-8 h-8" />
          </Button>
        </Input>
      </FormControl>
      {(isFirstDropdownVisible || searchInput) && (
        <div className="absolute z-10 w-[45%] top-12 max-h-52 overflow-y-auto">
          {isFirstDropdownVisible && (
            <ul className="">
              {results.map((company) => (
                <li
                  key={company._id}
                  onMouseDown={(e) => e.preventDefault()}
                  className="bg-white p-4 rounded shadow cursor-pointer"
                  onClick={handleSearch}
                >
                  <h3 className="font-bold">{company.companyName}</h3>
                  <p className="text-sm text-gray-600">
                    {company.location?.primary?.address?.address ||
                      "No address"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {isSecondDropdownVisible && (
        <VStack className="absolute top-14 right-14 w-[45%] z-10">
          <div className="absolute z-10 bg-white w-full -mt-1 max-h-52 rounded overflow-y-auto">
            <div
              className="p-2 text-blue-600 hover:bg-gray-100 cursor-pointer font-semibold"
              onClick={selectCurrentLocation}
              onMouseDown={(e) => e.preventDefault()}
            >
              📍 Use my current location
            </div>

            {locationSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                onClick={() => {
                  setLocationInput(suggestion);
                  setLocationSuggestions([]);
                  setIsSecondDropdownVisible(false);
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </VStack>
      )}
    </VStack>
  );
};

export const MSearchEngine = () => {
  return (
    <FormControl className="w-full">
      <Input className="h-14 w-full bg-white rounded-none">
        <InputField
          type="text"
          placeholder="location"
          className="bg-transparent placeholder:text-md"
        />
        <InputSlot className="h-full bg-blue-500 w-12">
          <InputIcon as={SearchIcon} className="w-8 h-8" />
        </InputSlot>
      </Input>
    </FormControl>
  );
};
