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
  onVerified: () => void;
}

const VerifyCodeModal: React.FC<VerifyCodeModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerified,
}) => {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendCode = async () => {
    if (cooldown > 0) return;

    try {
      const response = await sendCode({ email });
      if (response) {
        toast.show({
          placement: "top",
          duration: 10000,
          render: ({ id }) => (
            <Toast nativeID={id} variant="outline" action="success">
              <ToastTitle>Code sent, check your inbox</ToastTitle>
            </Toast>
          ),
        });
        Keyboard.dismiss();
        setCooldown(30); // start 30-second cooldown
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>
              {error?.response?.data?.message || "Error sending code"}
            </ToastTitle>
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
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }) => (
            <Toast nativeID={id} variant="outline" action="success">
              <ToastTitle>Email verified</ToastTitle>
            </Toast>
          ),
        });

        Keyboard.dismiss();
        onVerified();
        onClose();

        if (pathname === "/") {
          router.replace("/service");
        }
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} variant="outline" action="error">
            <ToastTitle>
              {error?.response?.data?.message || "Verification failed"}
            </ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Email"
      description="A verification code has been sent to you. Enter it below."
      extraText={
        cooldown > 0
          ? `You can resend code in ${cooldown}s`
          : "Didn't receive the code?"
      }
      onSubmit_2={handleSendCode}
      fields={[
        {
          name: "code",
          label: "Verification Code",
          placeholder: "Enter verification code",
          type: "text",
        },
      ]}
      onSubmit={handleVerifyEmail}
      schema={FormSchema.omit({
        email: true,
        password: true,
        confirmPassword: true,
        username: true,
      })}
    />
  );
};

export default VerifyCodeModal;
