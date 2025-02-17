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
