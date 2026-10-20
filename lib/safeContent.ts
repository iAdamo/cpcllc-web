/**
 * Showing what people and staff typed, safely (2026-10-20 security pass).
 * React escapes text, but three things on the site went around it: links
 * built from what a business typed, SVG category icons set as HTML, and the
 * "basic HTML" broadcast body. These turn each into something that can only
 * be shown, never run.
 */

/**
 * A link someone typed (a business's website or social page, dispute
 * evidence) as one that is safe to open: http(s) only. "instagram.com/acme"
 * gets https://; anything else (a bare handle, javascript:, data:, a
 * relative path) is null, and the caller shows no link.
 */
export function safeExternalUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let v = value.trim();
  if (!v || /\s/.test(v)) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) {
    // No scheme: only a bare domain with a path ("x.com/acme", "www.acme.co").
    if (!/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i.test(v)) return null;
    v = `https://${v}`;
  }
  try {
    const url = new URL(v);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Whether a category icon is SVG text (the seeded ones are); an icon name
 *  or anything else falls back to the default icon. */
export function isSvgIcon(icon: unknown): icon is string {
  return typeof icon === "string" && /^\s*<svg[\s>]/i.test(icon);
}

/**
 * An SVG icon as a CSS mask image. A mask is only ever painted: an onload or
 * onerror attribute in the text can't run, and nothing it points at loads.
 * (Set as HTML on the home page, it would have run for every visitor.)
 */
export function svgMaskUrl(icon: unknown): string | null {
  if (!isSvgIcon(icon)) return null;
  let svg = icon.trim();
  if (!/^<svg[^>]*\sxmlns=/i.test(svg)) {
    svg = svg.replace(/^<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

/**
 * Broadcast text as people get it: the API sends pushes and the app shows
 * text only, so the admin preview shows the same (it was set as HTML, where
 * one staff member's body could run in the reviewer's console).
 */
export function plainText(html: unknown): string {
  if (typeof html !== "string") return "";
  return html
    .replace(/<(br|\/p|\/div|\/li)\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}
