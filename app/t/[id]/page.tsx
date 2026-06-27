/**
 * Public task share landing.
 *
 *   https://companiescenter.com/t/<id>
 *
 * Behaviour:
 *   - **iOS / Android (Universal Link / App Link)**: OS intercepts and
 *     opens the app directly. Web content is the fallback.
 *   - **Web preview**: only when `visibility === "Public"` AND `isActive`.
 *     Private / archived tasks return `null` from the backend, which we
 *     render as a gated "Open in App" CTA without revealing details.
 *
 * Backend gate: `GET /services/jobs/public/:id` returns the lean task
 * only if it's publicly shareable. Anything else (including not-found)
 * gets `null` here.
 */
import type { Metadata } from "next";
import { getPublicTaskById } from "@/axios/public";
import { OpenInAppButton } from "@/components/share/OpenInAppButton";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://companiescenter.com";

// Next.js 15 — `params` is a Promise. Await before accessing properties.
type Params = Promise<{ id: string }>;

function formatBudget(n?: number): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const task = await getPublicTaskById(id);
  const canonical = `${APP_URL}/t/${id}`;

  if (!task) {
    return {
      title: "Task on CompaniesCenter",
      description: "Open in the CompaniesCenter app to view this task.",
      alternates: { canonical },
    };
  }

  const title = task.title as string;
  const description = (task.description ?? "").slice(0, 180);

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
    other: {
      "apple-itunes-app": `app-id=0000000000, app-argument=${canonical}`,
    },
  };
}

export default async function TaskShareLanding({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const task = await getPublicTaskById(id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {task ? (
              <>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  {task.status ?? "Open"}
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatBudget(task.budget)}
                  </span>
                  {task.subcategoryId?.name && (
                    <span>{task.subcategoryId.name}</span>
                  )}
                  {task.urgency && task.urgency !== "Normal" && (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {task.urgency}
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {task.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Task on CompaniesCenter
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  This task isn't publicly shareable. Sign in to the
                  CompaniesCenter app to view it.
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <OpenInAppButton path={`/t/${id}`} />
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
