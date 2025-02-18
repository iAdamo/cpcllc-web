import axios from "axios";
import { ApiClientSingleton } from "./conf";
import { RegisterUser, LoginUser, AuthResponse } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const register = async (data: RegisterUser): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginUser): Promise<AuthResponse> => {
  const response = await axios.post("/auth/login", data);
  return response.data;
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
