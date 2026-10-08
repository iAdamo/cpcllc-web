/**
 * Companies Center's social media links: edited in Admin > Settings, shown in
 * the footer. Mirrors the API's rules (modules/app-config/social-links.ts) so
 * the form can say what's wrong before saving; the API checks again.
 */
export const SOCIAL_PLATFORMS = ["facebook", "instagram", "linkedin", "x", "youtube", "tiktok"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialLinks = Partial<Record<SocialPlatform, string>>;

export const SOCIAL_META: Record<SocialPlatform, { label: string; hosts: string[]; example: string }> = {
  facebook: { label: "Facebook", hosts: ["facebook.com", "fb.com"], example: "https://www.facebook.com/companiescenter" },
  instagram: { label: "Instagram", hosts: ["instagram.com"], example: "https://www.instagram.com/companiescenter" },
  linkedin: { label: "LinkedIn", hosts: ["linkedin.com"], example: "https://www.linkedin.com/company/companiescenter" },
  x: { label: "X", hosts: ["x.com", "twitter.com"], example: "https://x.com/companiescenter" },
  youtube: { label: "YouTube", hosts: ["youtube.com", "youtu.be"], example: "https://www.youtube.com/@companiescenter" },
  tiktok: { label: "TikTok", hosts: ["tiktok.com"], example: "https://www.tiktok.com/@companiescenter" },
};

/** Why `url` can't be the link for `platform`, or null when it can. Empty
 *  means "no link". */
export function socialLinkProblem(platform: SocialPlatform, url: string): string | null {
  const value = url.trim();
  if (!value) return null;
  const { label, hosts } = SOCIAL_META[platform];
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return `Enter the full address, starting with https://`;
  }
  const host = parsed.hostname.toLowerCase();
  if (parsed.protocol !== "https:" || !hosts.some((h) => host === h || host.endsWith(`.${h}`))) {
    return `Use an https:// address on ${hosts.join(" or ")} for ${label}.`;
  }
  return null;
}

/** The links to show, in platform order, skipping the empty ones. */
export function shownSocialLinks(links: SocialLinks | undefined | null): { platform: SocialPlatform; url: string }[] {
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const url = links?.[platform]?.trim();
    return url ? [{ platform, url }] : [];
  });
}
