import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface PublicStatItem {
  key:
    | "verifiedProviders"
    | "servicesCompleted"
    | "reviews"
    | "avgRating"
    | "countriesCovered";
  value: number;
}

export interface PlatformStats {
  verifiedProviders: number;
  servicesCompleted: number;
  reviews: number;
  avgRating: number;
  countriesCovered: number;
  /** The subset of stats worth showing (already floor-filtered by the API). */
  meaningful: PublicStatItem[];
}

export const getPlatformStats = async (): Promise<PlatformStats> =>
  (await axiosInstance.get("stats/platform")).data;

export interface FeaturedReview {
  id: string;
  text: string;
  rating: number;
  reviewerName: string;
  providerName?: string;
  date?: string;
}

/** Real verified testimonials for the homepage. Empty array when there are none. */
export const getFeaturedReviews = async (): Promise<FeaturedReview[]> =>
  (await axiosInstance.get("reviews/featured")).data ?? [];
