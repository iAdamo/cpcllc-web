import { ApiClientSingleton } from "./conf";
import { ReviewData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const createReview = async (
  companyId: string,
  review: FormData
): Promise<ReviewData> => {
  const response = await axiosInstance.post(`reviews/${companyId}`, review, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateReview = async (
  reviewId: string,
  review: string
): Promise<ReviewData> => {
  const response = await axiosInstance.put(`reviews/${reviewId}`, { review });
  return response.data;
};

export const getReviews = async (companyId: string): Promise<ReviewData[]> => {
  const response = await axiosInstance.get(`reviews/${companyId}`);
  return response.data;
};
