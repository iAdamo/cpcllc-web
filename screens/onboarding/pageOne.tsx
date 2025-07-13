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
    if (values === "Client" && session) {
      router.replace("/companies");
    } else if (values === "Client" && !session) {
      setIsAuthModalOpen(true);
    } else if (values === "Company") {
      setData({ role: values });
      nextStep();
    }
  };
  return (
    <VStack className="w-full h-full">
      <Button
        variant="link"
        className="hidden md:flex m-4 w-52 bg-transparent"
        onPress={() => router.replace("/")}
      >
        <ButtonText
          size="lg"
          className="text-black data-[hover=true]:no-underline"
        >
          CompanyCenterLLC
        </ButtonText>
      </Button>
      <VStack className="h-full rounded-3xl justify-center items-center mt-14 py-1 gap-10">
        <Heading size="lg" className="md:text-2xl text-center font-medium">
          Join as a Client or service provider
        </Heading>
        <FormControl>
          <RadioGroup value={values} onChange={setValues}>
            <VStack className="md:flex-row md:gap-10 gap-6 md:h-40 w-full">
              <Pressable
                className="w-64 p-4 md:h-full h-40 hover:bg-[#F6F6F6] border-2 border-[#D9D9D9] hover:border-black hover:border-2 rounded-xl"
                onPress={() => {
                  setValues("Client");
                  if (!session) setIsAuthModalOpen(true);
                }}
              >
                <Radio value="Client" className="ml-auto">
                  <RadioIndicator className="w-6 h-6">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-brand-secondary w-6 h-6 text-brand-secondary"
                    />
                  </RadioIndicator>
                </Radio>
                <Text
                  size="lg"
                  className="md:text-xl md:text-left text-center text-black font-semibold my-auto"
                >
                  I&apos;m a Client, hiring for a project
                </Text>
              </Pressable>
              <Pressable
                className="w-64 p-4 md:h-full h-40 hover:bg-[#F6F6F6] border-2 border-[#D9D9D9] hover:border-black hover:border-2 rounded-xl"
                onPress={() => {
                  setValues("Company");
                  if (!session) setIsAuthModalOpen(true);
                }}
              >
                <Radio value="Company" className="ml-auto">
                  <RadioIndicator className="w-6 h-6">
                    <RadioIcon
                      as={CircleIcon}
                      className="fill-brand-secondary w-6 h-6 text-brand-secondary"
                    />
                  </RadioIndicator>
                </Radio>
                <Text
                  size="lg"
                  className="md:text-xl md:text-left text-center text-black font-semibold my-auto"
                >
                  I&apos;m a Service Provider, ready to render my services
                </Text>
              </Pressable>
            </VStack>
          </RadioGroup>
        </FormControl>
        <Button
          className={`w-auto mx-auto rounded-lg  bg-text-primary ${
            values && "bg-blue-500 data-[hover=true]:bg-blue-400"
          }`}
          onPress={handleSubmit}
          isDisabled={!values || !session}
        >
          <ButtonText
            className={`text-text-secondary data-[hover=true]:text-white ${
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
      <HStack className={`${session && "hidden"} w-full justify-center mt-8`}>
        <Text size="xs" className="md:text-lg text-black font-semibold">
          Already have an account?
        </Text>
        <Button
          variant="link"
          size="md"
          className="ml-2 items-start"
          onPress={() => {
            setValues("");
            setIsAuthModalOpen(true);
          }}
        >
          <ButtonText size="sm" className="md:text-lg text-blue-600 m-0 data-[hover=true]:no-underline">
            Sign In
          </ButtonText>
        </Button>
      </HStack>
      <AuthModalManager
        isModalOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={values !== "" ? "signUp" : "signIn"}
      />
    </VStack>
  );
};

export default PageOne;
