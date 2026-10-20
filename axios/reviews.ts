import { ApiClientSingleton } from "./conf";
import { ReviewData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

/**
 * A business's published reviews, newest first, by the business's id
 * (GET reviews/provider/:providerId). Reviews are written in the app after a
 * completed job; the website only shows them. Before 2026-10-20 this asked
 * GET reviews/:id (one review, by the review's own id) with the owner's
 * account id, so a profile's reviews never loaded, and a "Write a review"
 * form posted to a route the API no longer has.
 */
export const getProviderReviews = async (
  providerId: string,
  page = 1,
  limit = 20,
): Promise<ReviewData[]> => {
  const response = await axiosInstance.get(`reviews/provider/${providerId}`, {
    params: { page, limit },
  });
  return response.data?.data ?? [];
};
