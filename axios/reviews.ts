import { ApiClientSingleton } from "./conf";
import { ReviewData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const createService = async (data: FormData) => {
  const response = await axiosInstance.post("reviews", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getReviews = async (companyId: string): Promise<ReviewData[]> => {
  const response = await axiosInstance.get(`reviews/${companyId}`);
  return response.data;
};
