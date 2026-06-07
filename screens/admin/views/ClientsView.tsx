"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { UserSquare2 } from "lucide-react";
import { StatusPill } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import {
  ADMIN_CLIENTS_QUERY,
  ADMIN_CLIENT_QUERY,
} from "@/graphql/admin";

export function ClientsView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (search) filter.search = search;

  const { data, loading } = useQuery(ADMIN_CLIENTS_QUERY, {
    variables: { filter },
  });

  const list = data?.adminClients;
  const items: any[] = list?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
          <UserSquare2 size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Clients</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Marketplace users posting tasks ({list?.total ?? 0})
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Clients ({list?.total ?? 0})
          </h3>
          <input
            type="text"
            aria-label="Search clients"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Name</th>
              <th className="px-5 py-2.5 font-medium">Email</th>
              <th className="px-5 py-2.5 font-medium">Phone</th>
              <th className="px-5 py-2.5 font-medium">Email Verified</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Joined</th>
              <th className="px-5 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                  Loading clients…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                  No clients found.
                </td>
              </tr>
            )}
            {items.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {c.firstName || c.lastName
                    ? `${c.firstName ?? ""} ${c.lastName ?? ""}`
                    : "—"}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{c.email}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{c.phoneNumber}</td>
                <td className="px-5 py-2.5">
                  <StatusPill
                    label={c.isEmailVerified ? "Yes" : "No"}
                    tone={c.isEmailVerified ? "green" : "orange"}
                  />
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill
                    label={c.isActive ? "Active" : "Suspended"}
                    tone={c.isActive ? "green" : "rose"}
                  />
                </td>
                <td className="px-5 py-2.5 text-slate-500 text-xs">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-2.5 text-right">
                  <button
                    onClick={() => setOpenId(c._id)}
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
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {list.page} of {list.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= list.totalPages}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ClientDetailDrawer id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function ClientDetailDrawer({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) {
  const { data, loading } = useQuery(ADMIN_CLIENT_QUERY, {
    variables: { id },
    skip: !id,
  });
  const c = data?.adminClient;

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={c ? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || c.email || "Client" : "Loading…"}
      subtitle={c?.email}
    >
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {c && (
        <div className="space-y-4 text-sm">
          <Row label="ID" value={c._id} />
          <Row label="Email" value={`${c.email} ${c.isEmailVerified ? "(verified)" : ""}`} />
          <Row label="Phone" value={`${c.phoneNumber ?? "—"} ${c.isPhoneVerified ? "(verified)" : ""}`} />
          <Row label="Status" value={c.isActive ? "Active" : "Suspended"} />
          <Row label="Average rating" value={c.averageRating ?? 0} />
          <Row label="Reviews" value={c.reviewCount ?? 0} />
          <Row label="Tasks posted" value={c.stats?.tasksPosted ?? 0} />
          <Row label="Tasks completed" value={c.stats?.tasksCompleted ?? 0} />
          <Row label="Joined" value={c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"} />
        </div>
      )}
    </Drawer>
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
