import { ApiClientSingleton } from "./conf";
import { CompanyData, UserData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateProfile = async (id: string, data: FormData) => {
  const response = await axiosInstance.patch(`users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const registerCompany = async (
  data: FormData,
  id: string
): Promise<CompanyData> => {
  const response = await axiosInstance.post(`users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const userProfile = async (id: string): Promise<UserData> => {
  const response = await axiosInstance.get(`users/${id}`);
  return response.data;
};
