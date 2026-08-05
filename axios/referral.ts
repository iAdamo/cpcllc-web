import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface MyReferral {
  code: string;
  link: string;
  invited: number;
  qualified: number;
  rewardDaysEarned: number;
  referrerRewardDays: number;
  inviteeRewardDays: number;
}

export type ReferralStatus = "joined" | "qualified" | "rewarded";

export interface ReferralRow {
  _id: string;
  status: ReferralStatus;
  referrerRewardDays: number;
  createdAt: string;
  invitee?: { firstName?: string; lastName?: string };
}

/** My referral code, share link, and running stats. */
export const getMyReferral = async (): Promise<MyReferral> =>
  (await axiosInstance.get("referrals/me")).data;

/** People I've referred, newest first. */
export const getMyReferrals = async (): Promise<ReferralRow[]> =>
  (await axiosInstance.get("referrals/mine")).data ?? [];

/** Redeem a code (new user, once). Throws on invalid/unknown/self/already-used. */
export const redeemReferral = async (code: string) =>
  (await axiosInstance.post("referrals/redeem", { code })).data;

/** Re-check qualification after finishing provider onboarding. Idempotent. */
export const qualifyReferral = async () =>
  (await axiosInstance.post("referrals/qualify")).data;

const PENDING_KEY = "pendingReferralCode";

/** Save a `?ref=CODE` from the current URL so a shared link survives signup and
 *  email verification, then gets redeemed once the user is authenticated. */
export function storeReferralCodeFromUrl() {
  if (typeof window === "undefined") return;
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (ref) localStorage.setItem(PENDING_KEY, ref.trim());
}

/** Best-effort redeem of a stored code once authenticated. Clears it on success
 *  or on a permanent rejection (invalid/unknown/self/already-used); keeps it for
 *  a later retry on any transient error (e.g. not yet authenticated). */
export async function redeemStoredReferralCode() {
  if (typeof window === "undefined") return;
  const code = localStorage.getItem(PENDING_KEY);
  if (!code) return;
  try {
    await redeemReferral(code);
    localStorage.removeItem(PENDING_KEY);
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 400 || status === 409) localStorage.removeItem(PENDING_KEY);
  }
}
