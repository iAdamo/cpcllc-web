import React from "react";
import { z } from "zod";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
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
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";

import { Link, LinkText } from "@/components/ui/link";

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
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
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
            className="w-full bg-SteelBlue data-[hover=true]:bg-SteelBlue-600 data-[active=true]:bg-SteelBlue-700"
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText>Submit</ButtonText>
          </Button>
          {extraText && (
            <Text size="sm" className="">
              {extraText}
              <Link onPress={onSubmit_2} className="">
                <LinkText
                  size="xs"
                  className="text-typography-700 font-semibold"
                >
                  Click to resend
                </LinkText>
              </Link>
            </Text>
          )}
          <HStack space="xs" className="items-center">
            <Button
              className="gap-1"
              variant="link"
              size="sm"
              onPress={onClose}
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Back</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
