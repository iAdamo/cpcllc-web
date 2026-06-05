"use client";

import { Bookmark, BookmarkCheck, MapPin, Calendar, Users, ChevronRight, Zap, Briefcase } from "lucide-react";
import { JobData, MediaItem } from "@/types";
import useGlobalStore from "@/stores";
import Image from "next/image";

const URGENCY_COLOR: Record<string, string> = {
  Immediate: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  Urgent: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
};

const URGENCY_DOT: Record<string, string> = {
  Immediate: "bg-red-500",
  Urgent: "bg-amber-400",
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
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
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
  const deadline = formatDeadline(job.deadline);
  const isExpired = deadline === "Expired";

  const clientName = job.anonymous
    ? "Anonymous"
    : `${job.userId?.firstName ?? ""} ${job.userId?.lastName ?? ""}`.trim() || "Client";
  const clientAvatar = job.anonymous ? null : (job.userId?.profilePicture as any)?.thumbnail ?? null;

  const city = job.location?.address?.city;
  const locationStr = city || job.location?.address?.state || "";

  const urgencyColor = URGENCY_COLOR[job.urgency ?? ""];
  const urgencyDot = URGENCY_DOT[job.urgency ?? ""];
  const canApply = !hasApplied && !isExpired && job.status === "Active";

  return (
    <div
      onClick={() => onSelect(job)}
      className={`group relative bg-white dark:bg-gray-900 rounded-xl border cursor-pointer transition-all duration-150 overflow-hidden ${
        isSelected
          ? "border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20"
          : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
      }`}
    >
      {/* Urgency accent line */}
      {urgencyDot && (
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${urgencyDot}`} />
      )}

      <div className="flex gap-3 p-3 pl-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={job.title}
              width={64}
              height={64}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40">
              <Briefcase size={22} className="text-blue-300 dark:text-blue-700" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: badges + save */}
          <div className="flex items-center gap-1.5 mb-1">
            {job.subcategoryId?.name && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                {job.subcategoryId.name}
              </span>
            )}
            {job.urgency && job.urgency !== "Normal" && urgencyColor && (
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${urgencyColor}`}>
                <Zap size={8} />
                {job.urgency}
              </span>
            )}
            {job.status === "In Progress" && (
              <span className="text-[10px] font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full flex-shrink-0">
                In Progress
              </span>
            )}
            <button
              type="button"
              aria-label={isSaved ? "Unsave" : "Save task"}
              onClick={(e) => { e.stopPropagation(); setSavedJobs(job); }}
              className={`ml-auto flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                isSaved
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
              }`}
            >
              {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            </button>
          </div>

          {/* Row 2: title */}
          <h3 className="font-bold text-gray-900 dark:text-white text-[13px] leading-snug line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-0.5">
            {job.title}
          </h3>

          {/* Row 3: budget + meta + client + apply */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-gray-900 dark:text-white flex-shrink-0">
              {formatBudget(job.budget)}
              {job.negotiable && (
                <span className="ml-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 align-middle">NEG</span>
              )}
            </span>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 flex-1 min-w-0">
              <span className={`flex items-center gap-0.5 flex-shrink-0 ${isExpired ? "text-red-400" : ""}`}>
                <Calendar size={9} />
                {deadline}
              </span>
              {locationStr && (
                <span className="flex items-center gap-0.5 flex-shrink-0">
                  <MapPin size={9} />
                  {locationStr}
                </span>
              )}
              <span className="flex items-center gap-0.5 flex-shrink-0">
                <Users size={9} />
                {job.proposalsCount ?? 0}
              </span>
            </div>

            {/* Client */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {clientAvatar ? (
                <Image src={clientAvatar} alt={clientName} width={16} height={16} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-[7px] text-white font-black">
                  {clientName.charAt(0)}
                </div>
              )}
              <span className="text-[10px] text-gray-400 dark:text-gray-500 max-w-[48px] truncate hidden sm:block">
                {clientName}
              </span>
            </div>

            {/* Apply */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onApply(job); }}
              disabled={!canApply}
              className={`flex items-center gap-0.5 text-[11px] font-black px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                hasApplied
                  ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 cursor-default"
                  : !canApply
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95"
              }`}
            >
              {hasApplied ? "Applied" : "Apply"}
              {canApply && <ChevronRight size={10} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
