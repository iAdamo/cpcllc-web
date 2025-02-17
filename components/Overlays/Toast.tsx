import { Toast, useToast, ToastTitle } from "@/components/ui/toast";

export interface IErrorToast {
  error: {
    response?: {
      data?: {
        message?: string;
      };
    };
  };
}

interface RenderProps {
  id: string;
}

export const ErrorToast = (error: IErrorToast) => {
  const toast = useToast();

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
};
