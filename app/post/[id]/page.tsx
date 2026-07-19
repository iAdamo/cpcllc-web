/**
 * Public post share landing.
 *
 *   https://companiescenter.com/post/<id>
 *
 * Behaviour mirrors /t (task) and /c (provider):
 *   - iOS / Android with the app installed: the OS App/Universal Link
 *     intercepts and opens the post in-app (see mobile app.json
 *     intentFilters `/post/` + associatedDomains). Web is the fallback.
 *   - Web preview: active posts render a preview (author, caption, first
 *     image). Missing / removed posts render a gated "Open in App" CTA.
 *
 * Backend gate: `GET /posts/public/:id` returns the lean post (no viewer
 * state) only when active; otherwise `null`.
 */
import type { Metadata } from "next";
import Image from "next/image";
import { getPublicPostById } from "@/axios/public";
import { OpenInAppButton } from "@/components/share/OpenInAppButton";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://companiescenter.com";

type Params = Promise<{ id: string }>;

function firstImage(post: any): string | null {
  const m = (post?.media ?? [])[0];
  if (!m) return null;
  return m.url || m.thumbnail || null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublicPostById(id);
  const canonical = `${APP_URL}/post/${id}`;

  if (!post) {
    return {
      title: "Update on CompaniesCenter",
      description: "Open in the CompaniesCenter app to view this update.",
      alternates: { canonical },
    };
  }

  const author = post.providerId?.providerName ?? "A company";
  const title = `${author} on CompaniesCenter`;
  const description = (post.content ?? "Shared an update").slice(0, 180);
  const image = firstImage(post);

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
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostShareLanding({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const post = await getPublicPostById(id);
  const author = post?.providerId?.providerName ?? null;
  const logo =
    post?.providerId?.providerLogo?.thumbnail ||
    post?.providerId?.providerLogo?.url ||
    null;
  const image = firstImage(post);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {image && (
            <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800">
              <Image
                src={image}
                alt={author ? `${author}'s update` : "Update"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {post ? (
              <>
                <div className="flex items-center gap-3">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={author ?? "Provider"}
                      width={44}
                      height={44}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                      {author?.[0]?.toUpperCase() ?? "C"}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {author ?? "Provider"}
                    </p>
                    {post.providerId?.subcategories?.[0]?.name && (
                      <p className="text-xs text-slate-500">
                        {post.providerId.subcategories[0].name}
                      </p>
                    )}
                  </div>
                </div>
                {post.content && (
                  <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Update on CompaniesCenter
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  This update is no longer available here. Open the
                  CompaniesCenter app to browse the latest from local
                  companies.
                </p>
              </>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <OpenInAppButton path={`/post/${id}`} />
              <span className="text-xs text-slate-500 sm:ml-2">
                Don&apos;t have the app? It&apos;ll open in your browser.
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
