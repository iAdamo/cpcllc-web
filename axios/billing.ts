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

export type PaymentProvider = "stripe" | "paystack";

/** Provider-facing plans available to subscribe to (auth required). */
export const getProviderPlans = async (): Promise<BillingPlan[]> =>
  (await axiosInstance.get("billing/plans")).data;

/** Processors that are configured/available to pay with. */
export const getPaymentProviders = async (): Promise<PaymentProvider[]> =>
  (await axiosInstance.get("billing/providers")).data?.providers ?? [];

/**
 * Start checkout for a plan on the chosen processor. Stripe returns a hosted
 * `url` (redirect); Paystack returns an `accessCode` for the in-page Inline
 * popup. `reference` and `provider` come back either way.
 */
export const startCheckout = async (
  planId: string,
  provider?: PaymentProvider,
): Promise<{
  accessCode?: string;
  reference: string;
  url?: string;
  provider: PaymentProvider;
}> => (await axiosInstance.post("billing/checkout", { planId, provider })).data;
