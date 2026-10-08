import type { Metadata } from "next";
import Link from "next/link";
import LegalNoticeForms from "@/components/legal/LegalNoticeForms";
import { noticeTabFrom } from "@/lib/legalRequests";

export const metadata: Metadata = {
  title: "Legal Notices",
  description:
    "Send Companies Center a Notice of Dispute, opt out of arbitration, or send another legal notice, as described in the Terms of Service.",
};

/**
 * The legal notice functions the Terms of Service refer to: Section 39.2
 * (Notice of Dispute), 39.11 (arbitration opt-out) and 43 (legal notices).
 * Recorded and worked in the admin (API: modules/legal-requests).
 * ?form=dispute | opt-out | notice opens that form.
 */
export default async function LegalNoticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initial = noticeTabFrom((await searchParams).form);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-brand-900 dark:bg-brand-950 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-14">
          <p className="text-gold-400 text-xs font-black uppercase tracking-[0.15em] mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Legal notices</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Send a Notice of Dispute, opt out of arbitration, or send another legal notice to Companies Center LLC,
            as described in our{" "}
            <Link href="/terms-of-service" className="font-semibold text-gold-400 hover:underline">
              Terms of Service
            </Link>
            . Each notice is recorded with the date we receive it, and you get a copy by email.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <LegalNoticeForms initial={initial} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Looking for something else? For your personal information, see{" "}
          <Link href="/privacy-request" className="font-semibold text-brand-700 hover:underline dark:text-gold-400">
            Privacy requests
          </Link>
          . For copyright, see the{" "}
          <Link href="/dmca" className="font-semibold text-brand-700 hover:underline dark:text-gold-400">
            Copyright and DMCA Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
