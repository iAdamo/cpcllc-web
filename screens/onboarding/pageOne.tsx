import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { Button, ButtonText } from "@/components/ui/button";
import { spirals } from "@/public/assets/icons";

const PageOne = () => {
  return (
    <VStack className="w-full bg-[#F2F7F2] h-full relative">
      <Image
        className="object-cover w-full h-full top-0 left-0 rounded-lg"
        src={spirals}
        alt="spirals"
        width={3264}
        height={2448}
      />
      <VStack className="absolute inset-0">
        <VStack  className="bg-white h-full mx-32 my-20 p-10 gap-10">
          <Heading size="3xl" className="text-center">
            Join us for free
          </Heading>
          <HStack className="justify-between h-96 w-full">
            <Button className="w-96 h-full bg-blue-500 shadow-lg hover:shadow-none hover:bg-text-primary group">
              <ButtonText className="text-2xl text-[#00000070] group-hover:text-white">
                Service Provider
              </ButtonText>
            </Button>
            <Button className="w-96 h-full bg-yellow-500 shadow-lg hover:shadow-none hover:bg-text-primary group">
              <ButtonText className="text-2xl text-[#00000070] group-hover:text-white">
                Service Provider
              </ButtonText>
            </Button>
          </HStack>
          <Button className="w-96 h-12 mx-auto rounded-full bg-brand-secondary group">
            <ButtonText className="text-[#00000070] group-hover:text-white">
              Continue
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default PageOne;
