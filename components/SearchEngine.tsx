import { FormControl } from "@/components/ui/form-control";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { HStack } from "@/components/ui/hstack/index.web";

export const SearchEngine = () => {
  return (
    <VStack className="gap-4">
      <VStack>
        <Heading size="2xl">{"Find trusted companies\nnear you"}</Heading>
        <Text>Quality services from verified professionals</Text>
      </VStack>
      <VStack className="bg-white md:flex-row border rounded-lg border-gray-300 w-full h-14 justify-center items-center gap-2 p-2">
        <HStack className="flex-1 border-0 border-r-2 justify-center items-center">
          <SearchIcon className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for services, companies"
            className="flex-1 bg-white rounded-none h-12 w-full focus:outline-none px-4"
          />
        </HStack>
        <HStack className="flex-1 border-0 border-l-2 justify-center items-center px-2">
          <MapPinIcon className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tampa, Florida"
            className="flex-1 bg-white rounded-none border-none h-12 w-full focus:outline-none px-4"
          />
        </HStack>
        <Button size="md" className="bg-blue-600">
          <ButtonIcon
            className="text-white"
            color="white"
            width={20}
            height={20}
            as={SearchIcon}
          />
          <ButtonText>Search</ButtonText>
        </Button>
      </VStack>
      <VStack className="gap-1">
          <Text className="text-bold">Popular Searches:</Text>
        <Text size="xs">{"Can't find what you're looking for?"}</Text>
        <Text size="2xs">
          Contact us for personalized assistance and recommendations
        </Text>
      </VStack>
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
