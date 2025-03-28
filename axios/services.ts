import { ApiClientSingleton } from "./conf";
import { ServiceData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const createService = async (data: FormData) => {
  const response = await axiosInstance.post("services", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get("services/categories");

  return response.data;
};

export const getServices = async (
  page: number,
  limit: number
): Promise<{services: ServiceData[]; totalPages: number}> => {
  const response = await axiosInstance.get(
    `services/random?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getUserServices = async (id: string) => {
  const response = await axiosInstance.get(`services/user/${id}`);

  return response.data;
};
