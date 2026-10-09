/**
 * The link in a team invite email:
 *
 *   https://companiescenter.com/team-invite/<token>
 *
 * On a phone with the app, the OS opens the app at the same path (iOS
 * Universal Link via apple-app-site-association, Android App Link via the
 * app's intent filter), and the app accepts it. This page is the fallback:
 * Team Tasks lives in the app (the website is admin and marketing), so it
 * says how to get there. The token is never sent anywhere from here and the
 * page is kept out of search engines.
 */
import type { Metadata } from "next";
import { OpenInAppButton } from "@/components/share/OpenInAppButton";

export const metadata: Metadata = {
  title: "Team invite",
  description: "You've been invited to join a team on CompaniesCenter.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const STEPS = [
  "Get the CompaniesCenter app on your phone.",
  "Sign in, or create an account, with the email address this invite was sent to.",
  "Open this link again on your phone, or open the Team tab in the app. The invite is waiting there.",
];

export default function TeamInvitePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full">
              Team invite
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
              You&apos;ve been invited to join a team
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A business uses CompaniesCenter to give its people their tasks. Teams work in the
              CompaniesCenter app.
            </p>

            <ol className="mt-6 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <span
                    className="flex-none w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center tabular-nums"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-100">They will see</span> your
                name, profile photo, and the tasks you complete with your comments.
              </p>
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-100">They won&apos;t see</span> your
                messages, bookings, or anything else in your account. You can leave the team any time.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <OpenInAppButton />
              <span className="text-xs text-slate-500 sm:ml-2">
                The link works for 7 days, and only for the email address it was sent to.
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">Powered by CompaniesCenter</p>
      </div>
    </div>
  );
}
