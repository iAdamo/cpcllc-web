import { ApiClientSingleton } from "@/axios/conf";

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
