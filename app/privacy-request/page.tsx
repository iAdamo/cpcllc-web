import type { Metadata } from "next";
import Link from "next/link";
import PrivacyRequestForm from "@/components/legal/PrivacyRequestForm";

export const metadata: Metadata = {
  title: "Privacy Requests",
  description:
    "Ask Companies Center to show, copy, correct or delete your personal information, or appeal a decision on an earlier request.",
};

/**
 * The Privacy Request function the Privacy Policy points to (Sections 28,
 * 29 and 35): file a request or appeal a decision. Requests are recorded
 * and worked in the admin (API: modules/legal-requests).
 */
export default async function PrivacyRequestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const appeal = typeof params.appeal === "string" ? params.appeal.slice(0, 20) : undefined;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="bg-brand-900 dark:bg-brand-950 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-14">
          <p className="text-gold-400 text-xs font-black uppercase tracking-[0.15em] mb-3">Privacy</p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Privacy requests</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Ask us what personal information we hold about you, for a copy, to correct it or to delete it, or
            to stop using it in a certain way. You can also appeal a decision we made on an earlier request.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <PrivacyRequestForm appeal={appeal} />
        </div>

        <aside className="space-y-5 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">What happens next</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li>We email you a reference straight away.</li>
              <li>We confirm it is you (or that you are authorised), usually by asking you to sign in or reply from the account&apos;s email.</li>
              <li>We do what you asked, or explain why we can&apos;t, and email you the outcome.</li>
              <li>If you disagree, you can appeal with your reference.</li>
            </ol>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Faster ways for some requests</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Signed in, you can see and correct most of your details in the app.</li>
              <li>
                You can delete your account in the app (Settings, then Deactivation and deletion) or{" "}
                <Link
                  href="/settings/account-control/deletion"
                  className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
                >
                  on the website
                </Link>
                .
              </li>
              <li>You can turn off Announcements and offers in the app&apos;s notification preferences.</li>
            </ul>
          </div>
          <p>
            We will never ask for your password. How we handle your information is in our{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-700 hover:underline dark:text-gold-400">
              Privacy Policy
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
