import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { SearchIcon } from "@/components/ui/icon";
import { useRouter, usePathname } from "next/navigation";

export const SearchEngine = () => {
  const [isFirstDropdownVisible, setIsFirstDropdownVisible] = useState(false);
  const [isSecondDropdownVisible, setIsSecondDropdownVisible] = useState(false);

  const router = useRouter();
  const currentPath = usePathname();

  const handleFirstFocus = () => {
    setIsFirstDropdownVisible(true);
  };
  const handleSecondFocus = () => {
    setIsSecondDropdownVisible(true);
  };

  const handleBlur = (event) => {
    // Add a slight delay to allow clicks on dropdown items before hiding
    setTimeout(() => {
      setIsFirstDropdownVisible(false);
      setIsSecondDropdownVisible(false);
    }, 150);
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
            className="bg-transparent placeholder:text-md"
            onFocus={handleFirstFocus}
            onBlur={handleBlur}
          />

          <Divider orientation="vertical" className="h-4/5 w-1" />
          <InputField
            type="text"
            placeholder="location"
            className="bg-transparent placeholder:text-md"
            onFocus={handleSecondFocus}
            onBlur={handleBlur}
          />
          <Button className="h-full bg-blue-600 w-14 ">
            <ButtonIcon as={SearchIcon} className="w-8 h-8" />
          </Button>
        </Input>
      </FormControl>
      {isFirstDropdownVisible && (
        <VStack className="absolute top-14 left-0 w-[45%] bg-white border border-gray-300 shadow-lg z-10">
          <div className="p-2 hover:bg-gray-100 cursor-pointer">New York</div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">
            Los Angeles
          </div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Chicago</div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Houston</div>
        </VStack>
      )}
      {isSecondDropdownVisible && (
        <VStack className="absolute top-14 right-14 w-[45%] bg-white border border-gray-300 shadow-lg z-10">
          <button
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("User's Location:", { latitude, longitude });
                    // You can now use latitude and longitude in your app
                  },
                  (error) => {
                    console.error("Error getting location:", error.message);
                    alert(
                      "Unable to retrieve your location. Please try again."
                    );
                  }
                );
              } else {
                alert("Geolocation is not supported by your browser.");
              }
            }}
          >
            Use Current Location
          </button>{" "}
          <div className="p-2 hover:bg-gray-100 cursor-pointer">
            Los Angeles
          </div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Chicago</div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Houston</div>
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
