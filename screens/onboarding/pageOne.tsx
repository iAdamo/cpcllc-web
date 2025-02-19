import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { Button, ButtonText } from "@/components/ui/button";

const PageOne = () => {
  return (
    <VStack className="w-full h-full">
      <VStack className="h-full rounded-3xl mx-96 mt-14 py-10 gap-10">
        <Heading size="xl" className="text-center font-light">
          Who are you registering as?
        </Heading>
        <HStack className="justify-between h-40 w-full">
          <Button variant="outline" className="w-64 h-full hover:border-2 rounded-xl">
            <ButtonText className="text-xl">Client</ButtonText>
          </Button>
          <Button variant="outline" className="w-64 h-full hover:border-2 rounded-xl">
            <ButtonText className="text-xl">Service Provider</ButtonText>
          </Button>
        </HStack>
        <Button variant="outline" className="w-36 mx-auto rounded-lg border-none bg-text-primary">
          <ButtonText className="text-text-secondary">
            Continue
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default PageOne;
