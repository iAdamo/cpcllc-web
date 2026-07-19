/**
 * Public, unauthenticated REST methods used by the share-link pages
 * (`/p/<slug>` for providers, `/t/<id>` for tasks). Keeps the public
 * surface separate from the authenticated `admin.ts` / `user.ts` modules.
 */
import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

/**
 * Fetch a provider's public profile by slug. Returns `null` when the slug
 * is unknown so SSR pages can render their own 404 instead of throwing.
 */
export const getProviderBySlug = async (slug: string): Promise<any | null> => {
  try {
    const r = await axiosInstance.get(`provider/by-slug/${slug}`);
    return r.data ?? null;
  } catch {
    return null;
  }
};

/**
 * Featured providers for the homepage rail. Curated (isFeatured) first,
 * backfilled with verified/top-rated so the rail is never empty. Scoped to
 * the visitor's country — the marketplace never shows cross-border
 * providers. Public, cached 120s per country server-side.
 */
export const getFeaturedProviders = async (
  country?: string
): Promise<any[]> => {
  try {
    const r = await axiosInstance.get("provider/featured", {
      params: country ? { country } : undefined,
    });
    return Array.isArray(r.data) ? r.data : [];
  } catch {
    return [];
  }
};

/**
 * Fetch a task's public share preview by id. Returns `null` for private
 * (`visibility !== "Public"`) or archived tasks — the backend gates this.
 */
export const getPublicTaskById = async (id: string): Promise<any | null> => {
  try {
    const r = await axiosInstance.get(`services/jobs/public/${id}`);
    return r.data ?? null;
  } catch {
    return null;
  }
};

/**
 * Public provider feed post for the /post/<id> share landing. Returns null
 * for missing / soft-deleted posts (rendered as a gated "Open in App" CTA).
 */
export const getPublicPostById = async (id: string): Promise<any | null> => {
  try {
    const r = await axiosInstance.get(`posts/public/${id}`);
    return r.data ?? null;
  } catch {
    return null;
  }
};
