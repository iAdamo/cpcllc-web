import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { SearchIcon } from "@/components/ui/icon";

const SearchEngine = () => {
  const [isFirstDropdownVisible, setIsFirstDropdownVisible] = useState(false);
  const [isSecondDropdownVisible, setIsSecondDropdownVisible] = useState(false);

  const handleFirstFocus = () => {
    setIsFirstDropdownVisible(true);
  };
  const handleSecondFocus = () => {
    setIsSecondDropdownVisible(true);
  };

  const handleBlur = () => {
    // Add a slight delay to allow clicks on dropdown items before hiding
    setIsFirstDropdownVisible(false);
    setIsSecondDropdownVisible(false);
  };

  return (
    <VStack className="hidden md:flex md:flex-row shadow-lg h-full">
      <FormControl>
        <Input className="h-14 w-full bg-white border-none rounded-none">
          <InputField
            type="text"
            placeholder="services, companies, jobs..."
            className="bg-transparent w-2/5 font-bold text-lg"
            onFocus={handleFirstFocus}
            onBlur={handleBlur}
          />
        </Input>
        {isFirstDropdownVisible && (
          <VStack className="absolute top-16 left-0 w-full bg-white border border-gray-300 shadow-lg z-10">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">New York</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              Los Angeles
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Chicago</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Houston</div>
          </VStack>
        )}
      </FormControl>
      <Divider orientation="vertical" className="" />
      <FormControl>
        <Input className="h-14 w-full border-0 bg-white rounded-none">
          <InputField
            type="text"
            placeholder="location"
            className="bg-transparent font-bold text-lg"
            onFocus={handleSecondFocus}
            onBlur={handleBlur}
          />
          <InputSlot className="h-full">
            <InputIcon as={SearchIcon} className="" />
          </InputSlot>
        </Input>
        {isSecondDropdownVisible && (
          <VStack className="absolute top-16 left-0 w-4/5 bg-white border border-gray-300 shadow-lg z-10">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">New York</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              Los Angeles
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Chicago</div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer">Houston</div>
          </VStack>
        )}
      </FormControl>
    </VStack>
  );
};

export default SearchEngine;
