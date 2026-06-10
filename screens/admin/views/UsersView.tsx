"use client";

import { useState } from "react";
import {
  Users,
  MailCheck,
  PhoneCall,
  UserX,
  UserCheck,
  ShieldCheck,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Drawer } from "@/components/admin/Drawer";
import {
  reactivateAdminUser,
  suspendAdminUser,
  verifyAdminUserEmail,
  verifyAdminUserPhone,
} from "@/axios/admin";
import {
  useAdminUsersView,
  useAdminUserDetail,
} from "@/hooks/admin/useAdminQueries";

export function UsersView() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filter: Record<string, unknown> = { page, limit: 25 };
  if (search) filter.search = search;
  if (role) filter.role = role;

  // Reads from Zustand. First load fetches; subsequent loads use the slice.
  const { data, loading, refresh } = useAdminUsersView(filter);
  const onlineUserIds = useGlobalStore((s) => s.adminOnlineUserIds);

  const stats = data?.stats;
  const list = data?.page;
  const items: any[] = list?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">All marketplace users</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total" value={stats?.total ?? "—"} tone="blue" />
        <KpiCard label="Active" value={stats?.active ?? "—"} tone="green" />
        <KpiCard label="Suspended" value={stats?.suspended ?? "—"} tone="rose" />
        <KpiCard label="Unverified" value={stats?.unverified ?? "—"} tone="orange" />
        <KpiCard label="New (30d)" value={stats?.newLast30Days ?? "—"} tone="purple" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Users ({list?.total ?? 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Search users"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
            />
            <select
              aria-label="Filter by role"
              value={role}
              onChange={(e) => {
                setPage(1);
                setRole(e.target.value);
              }}
              className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5"
            >
              <option value="">All roles</option>
              <option value="Client">Client</option>
              <option value="Provider">Provider</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-2.5 font-medium">Name</th>
              <th className="px-5 py-2.5 font-medium">Email</th>
              <th className="px-5 py-2.5 font-medium">Phone</th>
              <th className="px-5 py-2.5 font-medium">Role</th>
              <th className="px-5 py-2.5 font-medium">Provider</th>
              <th className="px-5 py-2.5 font-medium">Verified</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium">Joined</th>
              <th className="px-5 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={9}>
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={9}>
                  No users found.
                </td>
              </tr>
            )}
            {items.map((u) => (
              <tr key={String(u._id)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        onlineUserIds[String(u._id)]
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                      title={
                        onlineUserIds[String(u._id)] ? "Online" : "Offline"
                      }
                    />
                    {u.firstName || u.lastName
                      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`
                      : "—"}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{u.phoneNumber}</td>
                <td className="px-5 py-2.5">
                  <StatusPill label={u.activeRole} tone="blue" />
                </td>
                <td className="px-5 py-2.5">
                  {u.provider ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Briefcase size={12} className="text-slate-400" />
                      <span className="truncate max-w-[160px] text-slate-700 dark:text-slate-200">
                        {u.provider.providerName}
                      </span>
                      {u.provider.isVerified && (
                        <ShieldCheck size={12} className="text-emerald-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex gap-1">
                    {u.isEmailVerified && <MailCheck size={14} className="text-emerald-500" />}
                    {u.isPhoneVerified && <PhoneCall size={14} className="text-emerald-500" />}
                  </div>
                </td>
                <td className="px-5 py-2.5">
                  <StatusPill
                    label={u.isActive ? "Active" : "Suspended"}
                    tone={u.isActive ? "green" : "rose"}
                  />
                </td>
                <td className="px-5 py-2.5 text-slate-500 text-xs">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-2.5 text-right">
                  <button
                    onClick={() => setOpenId(u._id)}
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

      <UserDetailDrawer
        id={openId}
        onClose={() => setOpenId(null)}
        onMutated={() => void refresh()}
      />
    </div>
  );
}

function UserDetailDrawer({
  id,
  onClose,
  onMutated,
}: {
  id: string | null;
  onClose: () => void;
  onMutated: () => void;
}) {
  const { data: u, loading, refresh: refetch } = useAdminUserDetail(id);

  const onSuspend = async () => {
    if (!id) return;
    const reason = window.prompt("Reason for suspension?");
    if (!reason) return;
    await suspendAdminUser(id, reason);
    await refetch();
    onMutated();
  };

  const onReactivate = async () => {
    if (!id) return;
    await reactivateAdminUser(id);
    await refetch();
    onMutated();
  };

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={u ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "User" : "Loading…"}
      subtitle={u?.email}
      footer={
        u && (
          <div className="flex flex-wrap gap-2">
            {u.isActive ? (
              <button
                onClick={onSuspend}
                className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1"
              >
                <UserX size={14} /> Suspend
              </button>
            ) : (
              <button
                onClick={onReactivate}
                className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
              >
                <UserCheck size={14} /> Reactivate
              </button>
            )}
            {!u.isEmailVerified && (
              <button
                onClick={async () => {
                  if (!id) return;
                  await verifyAdminUserEmail(id);
                  await refetch();
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Force-verify email
              </button>
            )}
            {!u.isPhoneVerified && (
              <button
                onClick={async () => {
                  if (!id) return;
                  await verifyAdminUserPhone(id);
                  await refetch();
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Force-verify phone
              </button>
            )}
          </div>
        )
      }
    >
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {u && <UserDetailBody user={u} />}
    </Drawer>
  );
}

function UserDetailBody({ user: u }: { user: any }) {
  return (
    <div className="space-y-4 text-sm">
      <Row label="ID" value={u._id} />
      <Row label="Role" value={u.activeRole} />
      <Row label="Status" value={u.isActive ? "Active" : "Suspended"} />
      <Row label="Email" value={`${u.email} ${u.isEmailVerified ? "(verified)" : "(unverified)"}`} />
      <Row
        label="Phone"
        value={`${u.phoneNumber ?? "—"} ${u.isPhoneVerified ? "(verified)" : "(unverified)"}`}
      />
      <Row label="Language" value={u.language ?? "—"} />
      <Row label="Address" value={u.address ?? "—"} />
      <Row label="Average rating" value={u.averageRating ?? 0} />
      <Row label="Reviews" value={u.reviewCount ?? 0} />
      <Row label="Tasks posted" value={u.stats?.tasksPosted ?? 0} />
      <Row label="Tasks completed" value={u.stats?.tasksCompleted ?? 0} />
      <Row label="Joined" value={u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"} />
      <Row label="Last login" value={u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "—"} />
      {u.deactivation?.reason && (
        <div className="mt-4 p-3 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900">
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">Suspended</p>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            {u.deactivation.reason}
          </p>
          <p className="text-[11px] text-rose-500 mt-1">
            By {u.deactivation.initiatedBy} on{" "}
            {u.deactivation.date ? new Date(u.deactivation.date).toLocaleDateString() : "—"}
          </p>
        </div>
      )}
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
