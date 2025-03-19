import { ApiClientSingleton } from "./conf";
import { LoginUser, AuthResponse } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const register = async (
  data: FormData,
  id?: string
): Promise<AuthResponse> => {
  const url = id ? `users/${id}` : `users`;
  console.log("data", data);
  const response = await axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const login = async (data: LoginUser): Promise<AuthResponse> => {
  const response = await axiosInstance.post("auth/login/", data);
  return response.data.user;
};

export const logout = async () => {
  await axiosInstance.post("/auth/logout");
};

export const sendCode = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/send-code", data);
  return response.data;
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await axiosInstance.post("/auth/verify-email", data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: { email: string; code: string }) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

import { useSession } from "@/context/AuthContext";

export const useSignOut = () => {
  const { logout } = useSession();
  const signOut = async () => {
    try {
      logout();
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  return signOut;
};
