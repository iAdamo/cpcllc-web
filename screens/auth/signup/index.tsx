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
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import Image from "next/image";
import { register, sendCode } from "@/axios/auth";
import VerifyCodeModal from "../VerifyCodeModal";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
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
  const { login } = useSession();

  const toast = useToast();
  const router = useRouter();

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
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);

        const response = await register(formData);
        if (response) {
          await sendCode({ email: data.email });
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
          setShowVerifyEmailModal(true);
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

  const { isOpen, onClose, switchToSignIn } = props;
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
          setShowVerifyEmailModal(false);
        }}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-hidden"
      >
        <ModalBackdrop />
        <VStack className="w-9/12 h-[90%]">
          <HStack className="h-full bg-white rounded-2xl">
            <VStack className="w-1/2 justify-center items-center rounded-l-2xl bg-brand-primary">
              <Image
                className="object-cover w-full rounded-lg"
                src="/assets/logo-color.png"
                alt="home_header"
                width={3264}
                height={2448}
              />
            </VStack>
            <ModalContent className="w-1/2 pt-2 pb-0 h-full border-none">
              <ModalHeader>
                <Heading size="xl">Sign Up</Heading>
              </ModalHeader>
              <ModalBody>
                <VStack className="gap-4 pt-8 items-center justify-center w-full h-full">
                  {/** Username */}
                  <FormControl isInvalid={!!errors?.username} className="w-96">
                    <FormControlLabel>
                      <FormControlLabelText>Username</FormControlLabelText>
                    </FormControlLabel>
                    <Controller
                      defaultValue=""
                      name="username"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value },
                      }: ControllerRenderType) => (
                        <Input className="h-12">
                          <InputField
                            placeholder="Username"
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
                      <FormControlErrorText>
                        {errors?.username?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/** Email */}
                  <FormControl
                    className="w-96"
                    isInvalid={!!errors?.email || !validated.emailValid}
                  >
                    <FormControlLabel>
                      <FormControlLabelText>Email</FormControlLabelText>
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
                      <FormControlErrorText>
                        {errors?.email?.message || !validated.emailValid}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/** Password */}
                  <FormControl
                    className=" w-96"
                    isInvalid={!!errors.password || !validated.passwordValid}
                  >
                    <FormControlLabel>
                      <FormControlLabelText>Password</FormControlLabelText>
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
                      <FormControlErrorText>
                        {errors?.password?.message || !validated.passwordValid}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/* ------------------------------------------ Confirm Password -------------------------------------------*/}
                  <FormControl
                    className="w-96"
                    isInvalid={!!errors.confirmPassword}
                  >
                    <FormControlLabel>
                      <FormControlLabelText>
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
                            className="text-sm"
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
                      <FormControlErrorText>
                        {errors?.confirmPassword?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/* ----------------------------------- Sign Up Button ------------------------------------------ */}
                  <VStack className="gap-2">
                    <Button
                      isDisabled={isLoading}
                      className="w-96 h-12 bg-btn-primary hover:bg-btn-secondary active:bg-brand-primary"
                      onPress={handleSubmit(onSubmit)}
                    >
                      <ButtonText>
                        {isLoading ? <Spinner /> : "Sign Up"}
                      </ButtonText>
                    </Button>
                  </VStack>
                  <Text className="text-md text-text-secondary">
                    Already have an account?
                    <Button
                      onPress={switchToSignIn}
                      variant="link"
                      className="inline"
                    >
                      <ButtonText className="text-md ml-2 text-brand-primary underline hover:text-brand-secondary">
                        Sign In Here
                      </ButtonText>
                    </Button>
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Text className="text-xs">
                  By joining, you agree to the
                  <Link
                    href="#"
                    className="text-xs mx-1 inline underline hover:no-underline"
                  >
                    CPCLLC
                  </Link>
                  Terms of Service and to occasionally receive emails from us.
                  Please read our
                  <Link
                    href="#"
                    className="text-xs mx-1 inline underline hover:no-underline"
                  >
                    Privacy
                  </Link>
                </Text>
              </ModalFooter>
            </ModalContent>
          </HStack>
        </VStack>
      </Modal>
      {showVerifyEmailModal && (
        <VerifyCodeModal
          isOpen={showVerifyEmailModal}
          onClose={() => setShowVerifyEmailModal(false)}
          email={getValues("email")}
          onVerified={async () => {
            await login({
              email: getValues("email"),
              password: getValues("password"),
            });
            router.push("/service");
          }}
        />
      )}
    </>
  );
};

export default SignUpModal;
