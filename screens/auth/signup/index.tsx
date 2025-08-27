import { useState } from "react";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/components/forms/AuthFormSchema";
import { Toast, useToast, ToastTitle } from "@/components/ui/toast";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import Link from "next/link";
// import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { register } from "@/axios/auth";
import VerifyCodeModal from "../VerifyCodeModal";

// import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type ControllerRenderType = {
  field: {
    onChange: (value: string) => void;
    onBlur: () => void;
    value: string;
  };
};

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToSignIn: () => void;
}

interface ValidatedState {
  emailValid: boolean;
  passwordValid: boolean;
}

interface RenderProps {
  id: string;
}

const SignUpModal: React.FC<SignUpModalProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);

  const { isOpen, onClose, switchToSignIn } = props;

  const toast = useToast();

  // handle form submission
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema.omit({ code: true })),
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
    if (data.password !== data.confirmPassword) {
      toast.show({
        placement: "top",
        duration: 1000,
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>Passwords do not match</ToastTitle>
            </Toast>
          );
        },
      });
      setIsLoading(false);
      return;
    } else {
      try {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        const response = await register(formData);
        if (response) {
          setShowVerifyEmailModal(true);
          toast.show({
            placement: "top",
            duration: 3000,
            render: ({ id }: { id: string }) => {
              return (
                <Toast nativeID={id} variant="outline" action="success">
                  <ToastTitle>Account created successfully</ToastTitle>
                </Toast>
              );
            },
          });
        }
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
    }
  };

  // handle password visibility
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleConfirmPasswordState = () => {
    setShowConfirmPassword((showState) => {
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
          reset();
          setShowVerifyEmailModal(false);
          onClose();
        }}
        className="fixed inset-0 backdrop-blur-sm overflow-hidden"
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
                  Sign Up
                </Heading>
              </ModalHeader>
              <ModalBody>
                <VStack className="md:gap-6 gap-4 items-center md:pt-14 justify-center w-full h-full">
                  {/** Email */}
                  <FormControl
                    className="md:w-96 w-full"
                    isInvalid={!!errors?.email || !validated.emailValid}
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="md:text-lg text-sm">
                        Email
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      defaultValue=""
                      name="email"
                      control={control}
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
                    className="md:w-96 w-full"
                    isInvalid={!!errors.password || !validated.passwordValid}
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="md:text-lg text-sm">
                        Password
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      defaultValue=""
                      name="password"
                      control={control}
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
                  {/* ------------------------------------------ Confirm Password -------------------------------------------*/}
                  <FormControl
                    className="md:w-96 w-full"
                    isInvalid={!!errors.confirmPassword}
                  >
                    <FormControlLabel>
                      <FormControlLabelText className="md:text-lg text-sm">
                        Confirm Password
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      defaultValue=""
                      name="confirmPassword"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input className="h-12">
                          <InputField
                            className=""
                            placeholder="Confirm Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            onSubmitEditing={handleKeyPress}
                            returnKeyType="done"
                            type={showConfirmPassword ? "text" : "password"}
                          />

                          <InputSlot
                            onPress={handleConfirmPasswordState}
                            className="pr-3"
                          >
                            <InputIcon
                              as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                            />
                          </InputSlot>
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText className="md:text-sm text-xs">
                        {errors?.confirmPassword?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/* ----------------------------------- Sign Up Button ------------------------------------------ */}
                  <VStack className="gap-2 w-full md:px-8">
                    <Button
                      isDisabled={isLoading}
                      className="w-full h-12 bg-btn-primary hover:bg-btn-secondary active:bg-brand-primary"
                      onPress={handleSubmit(onSubmit)}
                    >
                      <ButtonText>
                        {isLoading ? <Spinner /> : "Sign Up"}
                      </ButtonText>
                    </Button>
                  </VStack>
                  <Text className="md:text-md text-sm text-text-secondary">
                    Already have an account?
                    <Button
                      onPress={switchToSignIn}
                      variant="link"
                      className="inline"
                    >
                      <ButtonText className="md:text-md text-sm ml-2 text-brand-primary underline hover:text-brand-secondary">
                        Sign In Here
                      </ButtonText>
                    </Button>
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Text className="md:text-md text-xs">
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
      {showVerifyEmailModal && (
        <VerifyCodeModal
          isOpen={showVerifyEmailModal}
          onClose={() => setShowVerifyEmailModal(false)}
          email={getValues("email")}
          onVerified={async () => {
            reset();
            setShowVerifyEmailModal(false);
            onClose();
          }}
          isEmailVerified={true}
        />
      )}
    </>
  );
};

export default SignUpModal;
