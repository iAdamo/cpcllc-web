import type { ReactNode } from "react";

/**
 * Shared shell for legal documents (privacy policy, terms of service). Gives
 * both pages the same navy/gold brand hero and a themed article card, and turns
 * on `.legal-prose` (see globals.css) so their long hardcoded markup themes for
 * light + dark without per-element dark: variants.
 */
export default function LegalLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Brand hero */}
      <section className="bg-brand-900 dark:bg-brand-950 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-14">
          <p className="text-gold-400 text-xs font-black uppercase tracking-[0.15em] mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {title}
          </h1>
          {effectiveDate ? (
            <p className="text-white/60 mt-3 text-sm">
              Effective Date: {effectiveDate}
            </p>
          ) : null}
        </div>
      </section>

      {/* Document body */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
        <article className="legal-prose rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-10">
          {children}
        </article>
      </div>
    </main>
  );
}
