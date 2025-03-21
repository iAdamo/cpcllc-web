import { ApiClientSingleton } from "./conf";
import { CompanyData } from "@/types";

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

export const userProfile = async (id: string) => {
  const response = await axiosInstance.get(`users/${id}`);
  return response.data;
};
