import { useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { SearchIcon } from "@/components/ui/icon";

export const SearchEngine = () => {
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
    <VStack className="hidden md:flex md:flex-row h-full bg-black">
      <FormControl className="w-full">
        <Input className="h-14 w-full bg-white rounded-none">
          <InputField
            type="text"
            placeholder="services, companies, jobs..."
            className="bg-transparent placeholder:text-md"
            onFocus={handleFirstFocus}
            onBlur={handleBlur}
          />

          <Divider orientation="vertical" className="h-full bg-gray-300" />
          <InputField
            type="text"
            placeholder="location"
            className="bg-transparent placeholder:text-md"
            onFocus={handleSecondFocus}
            onBlur={handleBlur}
          />

          <InputSlot className="h-full bg-blue-500 w-12">
            <InputIcon as={SearchIcon} className="w-8 h-8" />
          </InputSlot>
        </Input>
      </FormControl>
      {isFirstDropdownVisible && (
        <VStack className="absolute top-14 left-0 w-[46%] bg-white border border-gray-300 shadow-lg z-10">
          <div className="p-2 hover:bg-gray-100 cursor-pointer">New York</div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">
            Los Angeles
          </div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Chicago</div>
          <div className="p-2 hover:bg-gray-100 cursor-pointer">Houston</div>
        </VStack>
      )}
      {isSecondDropdownVisible && (
        <VStack className="absolute top-14 right-12 w-[46%] bg-white border border-gray-300 shadow-lg z-10">
          <div className="p-2 hover:bg-gray-100 cursor-pointer">New York</div>
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
