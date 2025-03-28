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

export const getRandomServices = async (
  count: number
): Promise<ServiceData[]> => {
  const response = await axiosInstance.get(`services/random/${count}`);

  return response.data;
};

export const getUserServices = async (id: string) => {
  const response = await axiosInstance.get(`services/user/${id}`);

  return response.data;
};
