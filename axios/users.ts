import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const updateProfile = async (data: FormData) => {
  const response = await axiosInstance.put("users/profile/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
