import React, { useState, useEffect } from "react";
import { FormSchema, FormSchemaType } from "@/components/forms/AuthFormSchema";
import FormModal from "./AuthFormModal";
import { sendCode, verifyEmail } from "@/axios/auth";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { Keyboard } from "react-native";
import { useRouter, usePathname } from "next/navigation";

interface VerifyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const VerifyCodeModal: React.FC<VerifyCodeModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleSendCode = async () => {
    try {
      const response = await sendCode({ email });
      if (response) {
        toast.show({
          placement: "top",
          duration: 10000,
          render: ({ id }) => (
            <Toast nativeID={id} variant="outline" action="success">
              <ToastTitle>Code sent, Check your inbox</ToastTitle>
            </Toast>
          ),
        });
        Keyboard.dismiss();
      }
    } catch (error) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>{(error as any).response?.data?.message}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const handleVerifyEmail = async (data: FormSchemaType) => {
    try {
      const response = await verifyEmail({
        email,
        code: data.code,
      });
      if (response) {
        if (pathname === "/") {
          router.replace("/service");
        }
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }) => (
            <Toast nativeID={id} variant="outline" action="success">
              <ToastTitle>Email Verified</ToastTitle>
            </Toast>
          ),
        });
        Keyboard.dismiss();
        setShowModal(false);
        onClose();
      }
    } catch (error) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>{(error as any).response?.data?.message}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <FormModal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        onClose();
      }}
      title="Verify Email"
      description="A verification code has been sent to you. Enter code below."
      extraText="Didn't receive the code?"
      onSubmit_2={handleSendCode}
      fields={[
        {
          name: "code",
          label: "Verification code",
          placeholder: "Enter verification code",
          type: "text",
        },
      ]}
      onSubmit={handleVerifyEmail}
      schema={FormSchema.omit({
        email: true,
        password: true,
        confirmPassword: true,
      })}
    />
  );
};

export default VerifyCodeModal;
