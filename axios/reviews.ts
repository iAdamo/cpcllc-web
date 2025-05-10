import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const createService = async (data: FormData) => {
  const response = await axiosInstance.post("reviews", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};