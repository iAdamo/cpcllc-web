import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateProfile = async (id: string, data: FormData) => {
  const response = await axiosInstance.patch(`users/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
