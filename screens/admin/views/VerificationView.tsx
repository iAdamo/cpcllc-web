"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ShieldCheck, ShieldX, FileText } from "lucide-react";
import {
  getVerificationQueue,
  approveProviderKyc,
  rejectProviderKyc,
  type VerificationQueueRow,
} from "@/axios/admin";
import { StatusPill } from "@/components/admin/StatusPill";

const STATUS_TABS = ["pending", "approved", "rejected", "all"] as const;

const statusTone = (s: VerificationQueueRow["kycStatus"]) =>
  s === "approved"
    ? "green"
    : s === "pending"
      ? "orange"
      : s === "rejected"
        ? "rose"
        : "slate";

export function VerificationView() {
  const [status, setStatus] = useState<string>("pending");
  const [rows, setRows] = useState<VerificationQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = (s: string) => {
    setLoading(true);
    getVerificationQueue({ status: s, limit: 50 })
      .then((res) => setRows(res.items ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(status);
  }, [status]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await approveProviderKyc(id);
      load(status);
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Reason for rejection (shown to the provider):");
    if (reason === null) return; // cancelled
    setBusyId(id);
    try {
      await rejectProviderKyc(id, reason.trim() || undefined);
      load(status);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
          <BadgeCheck size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Verification
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review provider KYC submissions. Approving grants the verified badge
            clients trust.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
              status === s
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && (
          <p className="px-5 py-8 text-center text-slate-400 text-sm">Loading…</p>
        )}
        {!loading && rows.length === 0 && (
          <p className="px-5 py-10 text-center text-slate-400 text-sm">
            Nothing here. No providers in “{status}”.
          </p>
        )}
        {rows.map((r) => (
          <div
            key={r._id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {r.providerName}
                  </p>
                  <StatusPill label={r.kycStatus} tone={statusTone(r.kycStatus)} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {r.providerEmail ?? "—"}
                  {r.kycSubmittedAt && (
                    <>
                      {" · submitted "}
                      {new Date(r.kycSubmittedAt).toLocaleDateString()}
                    </>
                  )}
                </p>
                {/* Documents */}
                {r.kycDocuments && r.kycDocuments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.kycDocuments.map((d, i) => (
                      <a
                        key={i}
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        <FileText size={12} /> {d.type || "document"}
                      </a>
                    ))}
                  </div>
                )}
                {r.kycStatus === "rejected" && r.kycRejectionReason && (
                  <p className="text-xs text-rose-500 mt-2">
                    Rejected: {r.kycRejectionReason}
                  </p>
                )}
              </div>

              {r.kycStatus === "pending" && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve(r._id)}
                    disabled={busyId === r._id}
                    className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    <ShieldCheck size={13} /> Approve
                  </button>
                  <button
                    onClick={() => reject(r._id)}
                    disabled={busyId === r._id}
                    className="text-xs px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    <ShieldX size={13} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
