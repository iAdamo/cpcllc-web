import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { ProviderData } from "@/types";
import { MapPinIcon, SearchIcon } from "lucide-react";

const SearchEngine = () => {
  return (
    <VStack className="w-full h-full">
      <VStack>
        <Heading size="2xl">{"Find trusted companies\nnear you"}</Heading>
        <Text>Quality services from verified professionals</Text>
      </VStack>
      <VStack className="md:flex-row border rounded-lg border-gray-300 w-full h-14 justify-center items-center gap-2 p-2">
        <Input className="flex-1 border-none rounded-none border-r-2 w-full focus:border-none focus:ring-0 data-[focus=true]:outline-none">
          <Icon className="text-gray-400" as={SearchIcon} />
          <InputField
            className="data-[active=true]:border-none active:border-none focus:border-none data-[focus=true]:outline-none"
            placeholder="Search for services, companies"
          />
        </Input>
        <Input className="flex-1 border-0 rounded-none border-l-2 w-full">
          <InputIcon size="md" className="mx-8 bg-red-500" as={MapPinIcon} />
          <InputField placeholder="Tampa, Florida" />
          <InputSlot className="hidden h-full md:flex flex-row justify-start gap-2 bg-brand-primary rounded-xl px-2">
            <InputIcon color="red" as={SearchIcon} />
            <Text className="text-white">Search</Text>
          </InputSlot>
        </Input>
      </VStack>
    </VStack>
  );
};

const ProvidersList = ({ providers }: { providers: ProviderData[] }) => {
  return (
    <VStack className="w-full h-full">
      <SearchEngine />
    </VStack>
  );
};

export default ProvidersList;
