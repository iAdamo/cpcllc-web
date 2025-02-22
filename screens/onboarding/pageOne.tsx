import { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";

const PageOne = () => {
  const [values, setValues] = useState("");

  const handleSubmit = () => {
    return values;
  };
  return (
    <VStack className="w-full h-full">
      <Heading className="mt-5 ml-5">CompanyCenterLLC</Heading>
      <VStack className="h-full rounded-3xl mx-96 px-6 mt-14 py-10 gap-10">
        <Heading size="2xl" className="text-center font-medium">
          Join as a client or service provider
        </Heading>
        <FormControl>
          <RadioGroup value={values} onChange={setValues}>
            <HStack className="justify-between h-40 w-full">
              <Card
                variant="outline"
                className="w-64 h-full hover:border-black hover:border-2 rounded-xl"
              >
                <Radio value="client" className="ml-auto">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                </Radio>
                <Text className="text-xl font-semibold text-center my-auto">
                  Client
                </Text>
              </Card>
              <Card
                variant="outline"
                className="w-64 h-full hover:border-2 hover:border-black rounded-xl group"
              >
                <Radio value="company" className="ml-auto">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                </Radio>
                <Text className="text-xl font-semibold text-center my-auto">
                  Service Provider
                </Text>
              </Card>
            </HStack>
          </RadioGroup>
        </FormControl>
        <Button
          className={`w-auto mx-auto rounded-lg border-none bg-text-primary ${
            values && "bg-blue-500 data-[hover=true]:bg-blue-400"
          }`}
          onPress={handleSubmit}
          isDisabled={!values}
        >
          <ButtonText
            className={`text-text-secondary data-[hover=true]:text-text-secondary ${
              values && "text-white"
            }`}
          >{`Apply ${
            values === "client"
              ? "as Client"
              : values === "company"
              ? "as Service Provider"
              : ""
          }`}</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export default PageOne;
