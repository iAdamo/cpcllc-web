"use client";

import { Bookmark, BookmarkCheck, MapPin, Calendar, Users, ChevronRight, Zap } from "lucide-react";
import { JobData, MediaItem } from "@/types";
import useGlobalStore from "@/stores";

const URGENCY_COLOR: Record<string, string> = {
  Immediate: "bg-red-500 text-white",
  Urgent: "bg-amber-500 text-white",
  Normal: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

function formatDeadline(deadline: string | Date): string {
  const d = new Date(deadline);
  const diffDays = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1d left";
  if (diffDays <= 7) return `${diffDays}d left`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatBudget(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

interface JobCardProps {
  job: JobData;
  onSelect: (job: JobData) => void;
  onApply: (job: JobData) => void;
  isSelected?: boolean;
  hasApplied?: boolean;
}

export default function JobCard({ job, onSelect, onApply, isSelected, hasApplied }: JobCardProps) {
  const { savedJobs, setSavedJobs } = useGlobalStore();
  const isSaved = savedJobs.some((s) => s._id === job._id);

  const coverUrl = (job.media?.[0] as MediaItem)?.url ?? null;
  const urgencyColor = URGENCY_COLOR[job.urgency ?? ""] ?? URGENCY_COLOR["Normal"];
  const deadline = formatDeadline(job.deadline);
  const isExpired = deadline === "Expired";

  const clientName = job.anonymous
    ? "Anonymous Client"
    : `${job.userId?.firstName ?? ""} ${job.userId?.lastName ?? ""}`.trim() || "Client";

  const clientAvatar = job.anonymous ? null : (job.userId?.profilePicture as any)?.thumbnail ?? null;

  const city = job.location?.address?.city;
  const state = job.location?.address?.state;
  const locationStr = [city, state].filter(Boolean).join(", ");

  return (
    <div
      onClick={() => onSelect(job)}
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 ${
        isSelected
          ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20"
          : "border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md"
      }`}
    >
      {/* Cover image */}
      {coverUrl && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={coverUrl}
            alt={job.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {job.subcategoryId?.name && (
              <span className="text-[10px] font-bold bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {job.subcategoryId.name}
              </span>
            )}
          </div>
          {job.urgency && job.urgency !== "Normal" && (
            <span className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${urgencyColor}`}>
              <Zap size={9} />
              {job.urgency}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Badges row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {!coverUrl && job.subcategoryId?.name && (
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                {job.subcategoryId.name}
              </span>
            )}
            {!coverUrl && job.urgency && job.urgency !== "Normal" && (
              <span className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${urgencyColor}`}>
                <Zap size={9} />
                {job.urgency}
              </span>
            )}
            {job.status === "In Progress" && (
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={isSaved ? "Unsave" : "Save task"}
            onClick={(e) => { e.stopPropagation(); setSavedJobs(job); }}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
              isSaved
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                : "text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-500"
            }`}
          >
            {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-black text-gray-900 dark:text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {job.description}
        </p>

        {/* Budget */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-black text-gray-900 dark:text-white">{formatBudget(job.budget)}</span>
          {job.negotiable && (
            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Negotiable
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
          {locationStr && (
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {locationStr}
            </span>
          )}
          <span className={`flex items-center gap-1 ${isExpired ? "text-red-400" : ""}`}>
            <Calendar size={10} />
            {deadline}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} />
            {job.proposalsCount ?? 0} proposals
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            {clientAvatar ? (
              <img src={clientAvatar} alt={clientName} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-[9px] text-white font-black flex-shrink-0">
                {clientName.charAt(0)}
              </div>
            )}
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">{clientName}</span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onApply(job); }}
            disabled={hasApplied || isExpired || job.status !== "Active"}
            className={`flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-xl transition-all ${
              hasApplied
                ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 cursor-default"
                : isExpired || job.status !== "Active"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 active:scale-95"
            }`}
          >
            {hasApplied ? "Applied" : "Apply"}
            {!hasApplied && !isExpired && job.status === "Active" && <ChevronRight size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}
