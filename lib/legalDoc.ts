/**
 * A legal document kept as Markdown (app/privacy-policy/policy.md,
 * app/terms-of-service/terms.md). Its first line states when it was last
 * updated, once:
 *
 *   **Last Updated:** October 8, 2026
 *
 * The page header shows that date and the body starts after it, so the date
 * lives in one place, next to the text it describes.
 */
const LAST_UPDATED = /^\*\*Last Updated:\*\*\s*(.+?)\s*$/;

export interface LegalDoc {
  lastUpdated?: string;
  body: string;
}

export function readLegalDoc(source: string): LegalDoc {
  const text = source.replace(/\r\n/g, "\n").replace(/^﻿/, "");
  const [first, ...rest] = text.split("\n");
  const m = LAST_UPDATED.exec(first ?? "");
  if (!m) return { body: text };
  return { lastUpdated: m[1], body: rest.join("\n").replace(/^\n+/, "") };
}
