import { ApiClientSingleton } from "./conf";
import { CompanyData, UserData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateCompanyProfile = async (
  data: FormData
): Promise<CompanyData> => {
  const response = await axiosInstance.patch("users/company", data, {
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
    `users/company?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const setUserFavourites = async (
  companyId: string
): Promise<CompanyData> => {
  const response = await axiosInstance.patch(`users/${companyId}/favorite`);
  return response.data;
};

export const searchCompanies = async (
  searchInput?: string,
  lat?: string,
  long?: string,
  address?: string
): Promise<CompanyData[]> => {
  const params: Record<string, any> = {};
  if (searchInput) params.searchInput = searchInput;
  if (lat) params.lat = lat;
  if (long) params.long = long;
  if (address) params.address = address;

  const response = await axiosInstance.get("users/search", { params });
  return response.data;
};
