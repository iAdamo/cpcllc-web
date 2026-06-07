"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Briefcase, Star, ShieldCheck, ShieldX } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import {
  ADMIN_PROVIDERS_QUERY,
  ADMIN_PROVIDER_QUERY,
  ADMIN_PROVIDER_STATS_QUERY,
  APPROVE_PROVIDER_KYC_MUTATION,
  REJECT_PROVIDER_KYC_MUTATION,
  SET_PROVIDER_BOOKABLE_MUTATION,
  SET_PROVIDER_FEATURED_MUTATION,
} from "@/graphql/admin";

export function ProvidersView() {
  const [search, setSearch] = useState("");
  const [isVerified, setIsVerified] = useState<string>("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: statsData } = useQuery(ADMIN_PROVIDER_STATS_QUERY);
  const stats = statsData?.adminProviderStats;

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (search) filter.search = search;
  if (isVerified) filter.isVerified = isVerified === "true";

  const { data, loading, refetch } = useQuery(ADMIN_PROVIDERS_QUERY, {
    variables: { filter },
  });

  const list = data?.adminProviders;
  const items: any[] = list?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <Briefcase size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Provider Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Service providers and their KYC status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total" value={stats?.total ?? "—"} tone="blue" />
        <KpiCard label="Verified" value={stats?.verified ?? "—"} tone="green" />
        <KpiCard label="Featured" value={stats?.featured ?? "—"} tone="purple" />
        <KpiCard label="Pending KYC" value={stats?.pendingKyc ?? "—"} tone="orange" />
        <KpiCard label="New (30d)" value={stats?.newLast30Days ?? "—"} tone="blue" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Providers ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search providers"
              placeholder="Search providers…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
            />
            <select
              aria-label="Filter by verification"
              value={isVerified}
              onChange={(e) => {
                setPage(1);
                setIsVerified(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Provider</th>
              <th className="px-5 py-2.5 font-medium">Owner</th>
              <th className="px-5 py-2.5 font-medium">Rating</th>
              <th className="px-5 py-2.5 font-medium">Followers</th>
              <th className="px-5 py-2.5 font-medium">KYC</th>
              <th className="px-5 py-2.5 font-medium">Flags</th>
              <th className="px-5 py-2.5 font-medium">Joined</th>
              <th className="px-5 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={8}>
                  Loading providers…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={8}>
                  No providers found.
                </td>
              </tr>
            )}
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {p.providerName}
                  <div className="text-[11px] text-slate-500 font-normal">
                    {p.providerEmail ?? "—"}
                  </div>
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {p.owner ? `${p.owner.firstName ?? ""} ${p.owner.lastName ?? ""}`.trim() : "—"}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    {p.averageRating?.toFixed?.(1) ?? "0.0"} ({p.reviewCount ?? 0})
                  </span>
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">
                  {p.followersCount ?? 0}
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill
                    label={p.isVerified ? "Verified" : "Pending"}
                    tone={p.isVerified ? "green" : "orange"}
                  />
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex gap-1">
                    {p.isFeatured && <StatusPill label="Featured" tone="purple" />}
                    {!p.isBookable && <StatusPill label="Off" tone="rose" />}
                  </div>
                </td>
                <td className="px-5 py-2.5 text-slate-500 text-xs">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-2.5 text-right">
                  <button
                    onClick={() => setOpenId(p._id)}
                    className="text-xs text-blue-600 dark:text-blue-300 font-medium hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list?.totalPages > 1 && (
          <Pager
            page={list.page}
            totalPages={list.totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        )}
      </div>

      <ProviderDetailDrawer
        id={openId}
        onClose={() => setOpenId(null)}
        onMutated={() => refetch()}
      />
    </div>
  );
}

function ProviderDetailDrawer({
  id,
  onClose,
  onMutated,
}: {
  id: string | null;
  onClose: () => void;
  onMutated: () => void;
}) {
  const { data, loading, refetch } = useQuery(ADMIN_PROVIDER_QUERY, {
    variables: { id },
    skip: !id,
  });
  const [approve] = useMutation(APPROVE_PROVIDER_KYC_MUTATION);
  const [reject] = useMutation(REJECT_PROVIDER_KYC_MUTATION);
  const [setFeatured] = useMutation(SET_PROVIDER_FEATURED_MUTATION);
  const [setBookable] = useMutation(SET_PROVIDER_BOOKABLE_MUTATION);

  const p = data?.adminProvider;

  const run = async (fn: () => Promise<unknown>) => {
    await fn();
    await refetch();
    onMutated();
  };

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={p?.providerName || (loading ? "Loading…" : "Provider")}
      subtitle={p?.providerEmail ?? undefined}
      footer={
        p && (
          <div className="flex flex-wrap gap-2">
            {p.isVerified ? (
              <button
                onClick={() => run(() => reject({ variables: { id } }))}
                className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1"
              >
                <ShieldX size={14} /> Revoke KYC
              </button>
            ) : (
              <button
                onClick={() => run(() => approve({ variables: { id } }))}
                className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
              >
                <ShieldCheck size={14} /> Approve KYC
              </button>
            )}
            <button
              onClick={() =>
                run(() => setFeatured({ variables: { id, featured: !p.isFeatured } }))
              }
              className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {p.isFeatured ? "Unfeature" : "Feature"}
            </button>
            <button
              onClick={() =>
                run(() => setBookable({ variables: { id, bookable: !p.isBookable } }))
              }
              className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {p.isBookable ? "Disable bookings" : "Enable bookings"}
            </button>
          </div>
        )
      }
    >
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {p && (
        <div className="space-y-4 text-sm">
          <Row label="ID" value={p._id} />
          <Row label="Description" value={p.providerDescription ?? "—"} />
          <Row label="Email" value={p.providerEmail ?? "—"} />
          <Row label="Phone" value={p.providerPhoneNumber ?? "—"} />
          <Row label="Verified" value={p.isVerified ? "Yes" : "No"} />
          <Row label="Featured" value={p.isFeatured ? "Yes" : "No"} />
          <Row label="Bookable" value={p.isBookable ? "Yes" : "No"} />
          <Row label="Live trackable" value={p.isLiveTrackable ? "Yes" : "No"} />
          <Row label="Rating" value={`${p.stats?.rating ?? 0} (${p.reviewCount ?? 0} reviews)`} />
          <Row label="Followers" value={p.followersCount ?? 0} />
          <Row label="Tasks taken" value={p.stats?.tasksTaken ?? 0} />
          <Row label="Tasks completed" value={p.stats?.tasksCompleted ?? 0} />
          <Row label="Joined" value={p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"} />
          {p.owner && (
            <div className="mt-4 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Owner</p>
              <p className="text-xs text-slate-500 mt-1">
                {p.owner.firstName} {p.owner.lastName} — {p.owner.email}
              </p>
              <p className="text-[11px] text-slate-400">{p.owner.phoneNumber}</p>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Pager({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 dark:text-white text-right break-all">{String(value)}</span>
    </div>
  );
}
