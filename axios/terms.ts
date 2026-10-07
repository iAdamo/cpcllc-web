import { ApiClientSingleton } from "@/axios/conf";
import type {
  CurrentTerms,
  RequiredTerms,
  ShownTermsType,
} from "@/lib/terms";

const { axiosInstance } = ApiClientSingleton.getInstance();

export type TermsType = "service" | "privacy" | "payments";

export interface AdminTerms {
  _id: string;
  termsType: TermsType;
  version: string;
  contentUrl: string;
  isActive: boolean;
  effectiveFrom?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublishTermsInput {
  termsType: TermsType;
  version: string;
  contentUrl: string;
}

/** Active terms, one per type. */
export async function getAdminTerms(): Promise<AdminTerms[]> {
  const { data } = await axiosInstance.get("admin/terms");
  return data as AdminTerms[];
}

/**
 * Publish a new version of a policy. This deactivates the current version,
 * activates the new one, and invalidates every user's acceptance so they are
 * re-prompted to accept on next app open.
 */
export async function publishTerms(
  input: PublishTermsInput,
): Promise<AdminTerms> {
  const { data } = await axiosInstance.post("admin/terms/publish", input);
  return data as AdminTerms;
}

// ── A person's own acceptance (hooks/useTerms) ──

/** The current version of each policy, for the sign-up Terms checkbox.
 *  Public. An API older than the checkbox answers 404. */
export async function getCurrentTerms(): Promise<CurrentTerms> {
  const { data } = await axiosInstance.get("terms/current");
  return data;
}

/** Which current policies this account still has to accept. */
export async function getTermsStatus(): Promise<{
  ok: boolean;
  requiredTerms?: RequiredTerms[];
}> {
  const { data } = await axiosInstance.get("terms/status");
  return data;
}

/** Record the person's decision on each policy, from the website. */
export async function decideTerms(
  items: Array<{ termsType: ShownTermsType; status: "accepted" | "declined" }>,
): Promise<unknown> {
  const { data } = await axiosInstance.post(
    "terms/decide",
    items.map((i) => ({ ...i, platform: "web" })),
  );
  return data;
}
