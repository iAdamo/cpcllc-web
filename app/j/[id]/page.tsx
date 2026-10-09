/**
 * Public job share landing.
 *
 *   https://companiescenter.com/j/<id>
 *
 * Behaviour:
 *   - **iOS / Android (Universal Link / App Link)**: OS intercepts and
 *     opens the app directly. Web content is the fallback.
 *   - **Web preview**: only an open job (status `open`) everyone can see
 *     (`visibility === "Public"`) that wasn't sent to one business. Anything
 *     else returns `null` from the backend, which we render as a gated
 *     "Open in App" CTA without revealing details.
 *
 * Backend gate: `GET /jobs/public/:id` returns the lean job
 * only if it's publicly shareable. Anything else (including not-found)
 * gets `null` here.
 */
import type { Metadata } from "next";
import { getPublicJobById } from "@/axios/public";
import { appStoreBannerMeta } from "@/axios/appConfig";
import { OpenInAppButton } from "@/components/share/OpenInAppButton";
import { PRICING_LABELS, budgetText, neededByText, statusLabel } from "@/lib/jobs";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://companiescenter.com";

// Next.js 15 — `params` is a Promise. Await before accessing properties.
type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublicJobById(id);
  const canonical = `${APP_URL}/j/${id}`;

  if (!job) {
    return {
      title: "Job on CompaniesCenter",
      description: "Open in the CompaniesCenter app to view this job.",
      alternates: { canonical },
    };
  }

  const title = job.title as string;
  const description = (job.description ?? "").slice(0, 180);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: "CompaniesCenter",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: await appStoreBannerMeta(canonical),
  };
}

export default async function JobShareLanding({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const job = await getPublicJobById(id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {job ? (
              <>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  {statusLabel(job.status ?? "open")}
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {job.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {budgetText(job)}
                    {typeof job.budget === "number" && job.budget > 0 && job.pricing && job.pricing !== "fixed"
                      ? ` · ${PRICING_LABELS[job.pricing]}`
                      : null}
                  </span>
                  {job.subcategoryId?.name && (
                    <span>{job.subcategoryId.name}</span>
                  )}
                  {job.neededBy && <span>Needed by {neededByText(job.neededBy)}</span>}
                </div>

                {job.description && (
                  <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Job on CompaniesCenter
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  This job isn't publicly shareable. Sign in to the
                  CompaniesCenter app to view it.
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <OpenInAppButton />
              <span className="text-xs text-slate-500 sm:ml-2">
                Don't have the app? It'll open in your browser.
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Powered by CompaniesCenter
        </p>
      </div>
    </div>
  );
}
