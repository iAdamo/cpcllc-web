"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Calendar, Users, Zap, Send, CheckCircle,
  AlertCircle, Shield, Bookmark, BookmarkCheck,
} from "lucide-react";
import { JobData, MediaItem } from "@/types";
import useGlobalStore from "@/stores";

function formatDeadline(deadline: string | Date): string {
  const d = new Date(deadline);
  const diffDays = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1 day left";
  if (diffDays <= 7) return `${diffDays} days left`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function formatBudget(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const URGENCY_BADGE: Record<string, string> = {
  Immediate: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Urgent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Normal: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-gray-100 text-gray-500 dark:bg-gray-800",
  Cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  Expired: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

interface JobDetailPanelProps {
  job: JobData | null;
  onClose: () => void;
  onApply: (job: JobData) => void;
  hasApplied?: boolean;
}

export default function JobDetailPanel({ job, onClose, onApply, hasApplied }: JobDetailPanelProps) {
  const { savedJobs, setSavedJobs } = useGlobalStore();
  const isSaved = job ? savedJobs.some((s) => s._id === job._id) : false;

  const allImages = job
    ? (job.media ?? []).map((m) => (m as MediaItem)?.url ?? "").filter(Boolean)
    : [];

  const deadline = job ? formatDeadline(job.deadline) : "";
  const isExpired = deadline === "Expired";

  const clientName = job?.anonymous
    ? "Anonymous Client"
    : `${job?.userId?.firstName ?? ""} ${job?.userId?.lastName ?? ""}`.trim() || "Client";

  const clientAvatar = job?.anonymous ? null : (job?.userId?.profilePicture as any)?.thumbnail ?? null;

  const locationStr = [
    job?.location?.address?.city,
    job?.location?.address?.state,
    job?.location?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const canApply = !hasApplied && !isExpired && job?.status === "Active";

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-30 xl:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm xl:top-20 xl:w-80 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 flex flex-col z-40 shadow-2xl overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <button
                type="button"
                aria-label="Close panel"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={15} />
              </button>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex-1">Task Details</span>
              <button
                type="button"
                aria-label={isSaved ? "Unsave" : "Save task"}
                onClick={() => setSavedJobs(job)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isSaved
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Cover image */}
              {allImages[0] && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <img src={allImages[0]} alt={job.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {job.urgency && job.urgency !== "Normal" && (
                    <span className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${
                      job.urgency === "Immediate" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                    }`}>
                      <Zap size={9} />
                      {job.urgency}
                    </span>
                  )}
                </div>
              )}

              <div className="p-4 space-y-4">
                {/* Category + title */}
                <div>
                  {job.subcategoryId?.name && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {job.subcategoryId.name}
                    </span>
                  )}
                  <h2 className="mt-1 text-base font-black text-gray-900 dark:text-white leading-snug">
                    {job.title}
                  </h2>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-3 text-center">
                    <p className="text-lg font-black text-blue-700 dark:text-blue-400 leading-none">
                      {formatBudget(job.budget)}
                    </p>
                    <p className="text-[10px] text-blue-500 mt-1 font-semibold">
                      {job.negotiable ? "Negotiable" : "Fixed"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-center">
                    <p className={`text-xs font-black leading-none ${isExpired ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                      {deadline}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-semibold">Deadline</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-black text-gray-900 dark:text-white leading-none">
                      {job.proposalsCount ?? 0}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-semibold">Proposals</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {job.urgency && (
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${URGENCY_BADGE[job.urgency] ?? URGENCY_BADGE["Normal"]}`}>
                      <Zap size={10} />
                      {job.urgency}
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${STATUS_BADGE[job.status] ?? ""}`}>
                    {job.status}
                  </span>
                  {job.visibility !== "Public" && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      <Shield size={10} />
                      {job.visibility}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Location */}
                {locationStr && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={13} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{locationStr}</p>
                    </div>
                  </div>
                )}

                {/* Client info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  {clientAvatar ? (
                    <img
                      src={clientAvatar}
                      alt={clientName}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-[13px] text-white font-black flex-shrink-0">
                      {clientName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">{clientName}</p>
                    <p className="text-[10px] text-gray-400">Client</p>
                  </div>
                  {job.anonymous && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                      Anonymous
                    </span>
                  )}
                </div>

                {/* Media gallery */}
                {allImages.length > 1 && (
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      Attachments
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Attachment ${i + 1}`}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100 dark:border-gray-800"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky apply footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
              <button
                type="button"
                onClick={() => onApply(job)}
                disabled={!canApply}
                className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-black rounded-2xl transition-all ${
                  hasApplied
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 cursor-default"
                    : isExpired
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : job.status !== "Active"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md shadow-blue-500/25"
                }`}
              >
                {hasApplied ? (
                  <><CheckCircle size={16} /> Proposal Submitted</>
                ) : isExpired ? (
                  <><AlertCircle size={16} /> Task Expired</>
                ) : job.status !== "Active" ? (
                  `Task ${job.status}`
                ) : (
                  <><Send size={15} /> Submit Proposal</>
                )}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
