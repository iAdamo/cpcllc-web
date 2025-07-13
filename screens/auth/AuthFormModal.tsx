import React from "react";
import { z } from "zod";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchemaType } from "@/components/forms/AuthFormSchema";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  fields: {
    name: keyof FormSchemaType;
    label: string;
    placeholder: string;
    type: any;
  }[];
  onSubmit: (data: any) => void;
  onSubmit_2?: (data: any) => void;
  extraText?: string;
  schema: z.ZodSchema<any>;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  fields,
  onSubmit,
  onSubmit_2 = () => {},
  extraText,
  schema,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0.5">
          <Heading>{title}</Heading>
          <Text>{description}</Text>
        </ModalHeader>
        <ModalBody className="mb-4">
          {fields.map(({ name, placeholder, type }) => (
            <FormControl isInvalid={!!errors[name]} key={name}>
              <Controller
                defaultValue=""
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="h-12">
                    <InputField
                      placeholder={placeholder}
                      type={type}
                      onSubmitEditing={handleKeyPress}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              {errors[name] && (
                <FormControlError>
                  <FormControlErrorText className="md:text-sm text-xs">
                    {errors[name]?.message?.toString()}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          ))}
        </ModalBody>
        <ModalFooter className="flex-col items-start">
          <Button
            variant="solid"
            onPress={handleSubmit(onSubmit)}
            className="w-full bg-blue-500 data-[hover=true]:bg-blue-600"
          >
            <ButtonText>Submit</ButtonText>
          </Button>
          <HStack className="justify-between w-full">
            <Button
              className="gap-1"
              variant="link"
              size="sm"
              onPress={onClose}
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Back</ButtonText>
            </Button>
            {extraText && (
              <Text size="sm" className="font-bold text-red-400">
                {extraText}
                <Button
                  size="md"
                  onPress={onSubmit_2}
                  className="bg-green-200 ml-auto data-[hover=true]:bg-green-300"
                  isDisabled={onSubmit_2 === undefined}
                >
                  <ButtonText size="xs" className="text-typography-700">
                    Click to resend
                  </ButtonText>
                </Button>
              </Text>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
