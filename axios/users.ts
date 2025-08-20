import { ApiClientSingleton } from "./conf";
import { CompanyData, UserData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateCompanyProfile = async (
  data: FormData
): Promise<CompanyData> => {
  const response = await axiosInstance.patch("company", data, {
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
  const response = await axiosInstance.post(`company/${id}`, data, {
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

export const getUsers = async (
  page: number,
  limit: number
): Promise<{ users: UserData[]; totalPages: number }> => {
  const response = await axiosInstance.get(`users?page=${page}&limit=${limit}`);
  return response.data;
};

export const getCompanies = async (
  page: number,
  limit: number
): Promise<{ companies: CompanyData[]; totalPages: number }> => {
  const response = await axiosInstance.get(
    `company?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const setUserFavourites = async (
  companyId: string
): Promise<CompanyData> => {
  const response = await axiosInstance.patch(`company/${companyId}/favorite`);
  return response.data;
};
