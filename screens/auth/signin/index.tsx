import { useState } from "react";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/components/forms/AuthFormSchema";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Toast, useToast, ToastTitle } from "@/components/ui/toast";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import Link from "next/link";
// import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import ForgotPasswordModal from "@/screens/auth/ForgetPassword";
import { useSession } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

type ControllerRenderType = {
  field: {
    onChange: (value: string) => void;
    onBlur: () => void;
    value: string;
  };
};

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToSignUp: () => void;
}

interface ValidatedState {
  emailValid: boolean;
  passwordValid: boolean;
}

interface RenderProps {
  id: string;
}

const SignInModal: React.FC<SignInModalProps> = (props) => {
  const { isOpen, onClose, switchToSignUp } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const { login } = useSession();
  const toast = useToast();

  // handle form submission
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(
      FormSchema.omit({ confirmPassword: true, code: true })
    ),
  });

  // handle form validation
  const [validated, setValidated] = useState<ValidatedState>({
    emailValid: true,
    passwordValid: true,
  });

  // handle form submission
  const onSubmit = async (data: FormSchemaType) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      await login(data);
      reset();
      onClose();
      setIsLoading(false);
    } catch (error) {
      setValidated({ emailValid: false, passwordValid: false });
      toast.show({
        placement: "top",
        duration: 5000,
        render: ({ id }: RenderProps) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>
                {(error as any).response?.data?.message ||
                  "An unexpected error occurred"}
              </ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // handle password visibility
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  // handle form submission on enter key press
  const handleKeyPress = () => {
    handleSubmit(onSubmit)();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
        }}
        className="fixed inset-0 backdrop-blur-sm overflow-hidden "
      >
        <ModalBackdrop />
        <VStack className="md:w-9/12 md:h-[90%] w-11/12">
          <VStack className="md:flex-row h-full w-full md:rounded-2xl">
            <VStack className="hidden md:flex w-1/2 justify-center items-center rounded-l-2xl bg-brand-primary">
              <Image
                className="object-cover w-full rounded-lg"
                src="/assets/logo-color.png"
                alt="home_header"
                width={3264}
                height={2448}
              />
            </VStack>
            <ModalContent className="md:w-1/2 w-full h-full md:border-none">
              <ModalHeader>
                <Heading size="lg" className="md:text-3xl">
                  Sign In
                </Heading>
              </ModalHeader>
              <ModalBody>
                <VStack className="gap-6 items-center md:pt-14 pt-6 justify-center w-full h-full">
                  {/** Email */}
                  <FormControl
                    className="md:w-10/12 w-full"
                    isInvalid={!!errors?.email || !validated.emailValid}
                  >
                    <Controller
                      defaultValue=""
                      name="email"
                      control={control}
                      rules={{
                        validate: async (value: string) => {
                          try {
                            await FormSchema.parseAsync({ email: value });
                            return true;
                          } catch (error: any) {
                            return error.message;
                          }
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                      }: ControllerRenderType) => (
                        <Input className="h-12">
                          <InputField
                            placeholder="Email"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            onSubmitEditing={handleKeyPress}
                            returnKeyType="done"
                            className=""
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText className="md:text-sm text-xs">
                        {errors?.email?.message || !validated.emailValid}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/** Password */}
                  <FormControl
                    className="md:w-10/12 w-full"
                    isInvalid={!!errors.password || !validated.passwordValid}
                  >
                    <Controller
                      defaultValue=""
                      name="password"
                      control={control}
                      rules={{
                        validate: async (value) => {
                          try {
                            await FormSchema.parseAsync({ password: value });
                            return true;
                          } catch (error: any) {
                            return error.message;
                          }
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                      }: ControllerRenderType) => (
                        <Input className="h-12">
                          <InputField
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            onSubmitEditing={handleKeyPress}
                            returnKeyType="done"
                            className=""
                          />
                          <InputSlot onPress={handleState} className="pr-3">
                            <InputIcon
                              as={showPassword ? EyeIcon : EyeOffIcon}
                            />
                          </InputSlot>
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText className="md:text-sm text-xs">
                        {errors?.password?.message || !validated.passwordValid}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  <VStack className="gap-2 w-full md:px-10">
                    <Button
                      variant="link"
                      onPress={() => setShowForgotPasswordModal(true)}
                      className="ml-auto"
                    >
                      <ButtonText className="text-md text-text-secondary text-end underline hover:text-brand-primary">
                        Forget Password
                      </ButtonText>
                    </Button>
                    <Button
                      isDisabled={isLoading}
                      className="w-full h-12 bg-btn-primary hover:bg-btn-secondary active:bg-brand-primary"
                      onPress={handleSubmit(onSubmit)}
                    >
                      <ButtonText>
                        {isLoading ? <Spinner /> : "Sign in"}
                      </ButtonText>
                    </Button>
                  </VStack>
                  <Text size="sm" className="md:text-md text-text-secondary">
                    Don&apos;t have an account yet?
                    <Button
                      onPress={switchToSignUp}
                      variant="link"
                      className="inline"
                    >
                      <ButtonText
                        size="sm"
                        className="md:text-md ml-2 text-brand-primary underline hover:text-brand-secondary"
                      >
                        Sign Up Here
                      </ButtonText>
                    </Button>
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter className="">
                <Text size="xs" className="md:text-md">
                  By joining, you agree to the
                  <Link
                    href="#"
                    className="text-blue-600 mx-1 inline underline hover:no-underline"
                  >
                    CPCLLC
                  </Link>
                  Terms of Service and to occasionally receive emails from us.
                  Please read our
                  <Link
                    href="#"
                    className="text-blue-600 mx-1 inline underline hover:no-underline"
                  >
                    Privacy
                  </Link>
                </Text>
              </ModalFooter>
            </ModalContent>
          </VStack>
        </VStack>
      </Modal>
      {/** Forgot password modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
    </>
  );
};

export default SignInModal;
