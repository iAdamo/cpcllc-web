import { ApiClientSingleton } from "./conf";
import { CompanyData, UserData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateProviderProfile = async (
  data: FormData
): Promise<CompanyData> => {
  const response = await axiosInstance.patch("provider", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const createProviderProfile = async (
  data: FormData
): Promise<UserData> => {
  const response = await axiosInstance.post("provider", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateUserProfile = async (data: FormData): Promise<UserData> => {
  const response = await axiosInstance.patch("users/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const userProfile = async (id: string): Promise<UserData> => {
  const response = await axiosInstance.get(`users/profile/${id}`);
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
    `provider?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const setUserFavourites = async (
  providerId: string
): Promise<CompanyData> => {
  const response = await axiosInstance.patch(`provider/${providerId}/favorite`);
  return response.data;
};
