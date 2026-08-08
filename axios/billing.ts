import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface BillingPlan {
  _id: string;
  code: string;
  name: string;
  description?: string;
  priceCents: number;
  currency: string;
  interval: "month" | "quarter" | "year";
  features?: string[];
}

/** Provider-facing plans available to subscribe to (auth required). */
export const getProviderPlans = async (): Promise<BillingPlan[]> =>
  (await axiosInstance.get("billing/plans")).data;

/** Start hosted checkout for a plan; returns the URL to redirect the buyer to. */
export const startCheckout = async (
  planId: string,
): Promise<{ url: string; reference: string }> =>
  (await axiosInstance.post("billing/checkout", { planId })).data;
