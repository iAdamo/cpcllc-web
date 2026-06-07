"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { StatusPill } from "@/components/admin/StatusPill";

interface UserRow {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  activeRole: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export function UsersView() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { ApiClientSingleton } = await import("@/axios/conf");
        const { axiosInstance } = ApiClientSingleton.getInstance();
        const res = await axiosInstance.get(`admin/metrics`).catch(() => null);
        // Use existing users list endpoint
        const r = await axiosInstance.get(`users`, { params: { page: 1, limit: 25 } }).catch(() => ({ data: { users: [] } }));
        if (mounted) {
          setUsers((r.data?.users ?? r.data?.items ?? []) as UserRow[]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = users.filter((u) => {
    const matchesRole = !roleFilter || u.activeRole === roleFilter;
    const matchesSearch =
      !search ||
      `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {filtered.length} {filtered.length === 1 ? "user" : "users"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-md px-3 py-1.5"
          >
            <option value="">All roles</option>
            <option value="Client">Client</option>
            <option value="Provider">Provider</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={7}>
                  No users found.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="px-5 py-2.5 text-slate-600 dark:text-slate-300">{u.phoneNumber}</td>
                <td className="px-5 py-2.5">
                  <StatusPill label={u.activeRole} tone="blue" />
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
                  <button className="text-xs text-blue-600 dark:text-blue-300 font-medium hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
