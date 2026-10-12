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

/**
 * Start Stripe Checkout for a plan: the API returns the hosted page's `url`
 * to send the browser to, and the `reference` the callback page checks.
 */
export const startCheckout = async (
  planId: string,
): Promise<{ reference: string; url?: string }> =>
  (await axiosInstance.post("billing/checkout", { planId })).data;
