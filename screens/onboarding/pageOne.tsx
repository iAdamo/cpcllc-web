import { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { useOnboarding } from "@/context/OnboardingContext";
import AuthModalManager from "@/screens/auth/AuthModalManager";
import { useSession } from "@/context/AuthContext";

import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";

const PageOne = () => {
  const { nextStep, setData, data } = useOnboarding();
  const [values, setValues] = useState(data.role); // Get from context
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setValues(data.role);
  }, [data.role]);

  const handleSubmit = () => {
    if (values === "Client") {
      router.push("/service");
    } else if (values === "Company") {
      setData({ role: values });
      nextStep();
    }
  };
  return (
    <VStack className="w-full h-full">
      <Button
        variant="link"
        className="m-4 w-52 bg-transparent"
        onPress={() => router.push("/")}
      >
        <ButtonText
          size="xl"
          className="data-[hover=true]:no-underline data-[hover=true]:text-btn-primary"
        >
          CompanyCenterLLC
        </ButtonText>
      </Button>
      <VStack className="h-full rounded-3xl mx-96 px-6 mt-14 py-10 gap-10">
        <Heading size="2xl" className="text-center font-medium">
          Join as a Client or service provider
        </Heading>
        <FormControl>
          <RadioGroup value={values} onChange={setValues}>
            <HStack className="justify-between h-40 w-full">
              <Pressable
                className="w-64 p-2 h-full border-2 border-[#D9D9D9] hover:border-black hover:border-2 rounded-xl"
                onPress={() => {
                  setValues("Client");
                  if (!session) setIsAuthModalOpen(true);
                }}
              >
                <Radio value="Client" className="ml-auto">
                  <RadioIndicator>
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-brand-secondary text-brand-secondary"
                    />
                  </RadioIndicator>
                </Radio>
                <Text className="text-xl font-semibold text-center my-auto">
                  Client
                </Text>
              </Pressable>
              <Pressable
                className="w-64 p-2 h-full border-2 border-[#D9D9D9] hover:border-black hover:border-2 rounded-xl"
                onPress={() => {
                  setValues("Company");
                  if (!session) setIsAuthModalOpen(true);
                }}
              >
                <Radio value="Company" className="ml-auto">
                  <RadioIndicator>
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-brand-secondary text-brand-secondary"
                    />
                  </RadioIndicator>
                </Radio>
                <Text className="text-xl font-semibold text-center my-auto">
                  Service Provider
                </Text>
              </Pressable>
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
            values === "Client"
              ? "as Client"
              : values === "Company"
              ? "as Service Provider"
              : ""
          }`}</ButtonText>
        </Button>
      </VStack>
      <AuthModalManager
        isModalOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </VStack>
  );
};

export default PageOne;
