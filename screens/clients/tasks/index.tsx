"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Calendar,
  Zap,
  Eye,
  Shield,
  User,
  Star,
  MessageCircle,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit3,
  Package,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { getJobsByUser, getProposalsByJob, updateProposalStatus, deleteJob } from "@/axios/service";
import { JobData, ProposalData, MediaItem } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function daysUntil(d: string | Date): number {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getLogoUrl(provider: any): string | null {
  return (provider?.providerLogo as MediaItem)?.url ?? null;
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "In Progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Completed: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  Expired: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

const URGENCY_STYLES: Record<string, string> = {
  Immediate: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  Urgent: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Normal: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
};

// ── Seed data so UI never looks empty ─────────────────────────────────────────

const SEED_JOBS: JobData[] = [
  {
    _id: "seed-1", id: "seed-1",
    title: "Fix kitchen plumbing leak",
    description: "Water is leaking from the pipe under my kitchen sink. Need someone to fix it quickly. The leak has been going on for 2 days and is getting worse.",
    budget: 25000, negotiable: true, urgency: "Urgent",
    status: "Active", proposalsCount: 8, applicants: [], proposals: [],
    visibility: "Public", anonymous: false, isActive: true,
    deadline: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString() as unknown as Date,
    updatedAt: new Date().toISOString(),
    subcategoryId: { _id: "s1", name: "Plumbing", description: "", categoryId: { _id: "c1", name: "Home Services", description: "" } },
    location: { coordinates: [], address: { city: "Tampa", state: "FL" } },
    media: [], userId: {} as any, providerId: {} as any,
  },
  {
    _id: "seed-2", id: "seed-2",
    title: "Install ceiling lights in living room",
    description: "I need 3 hanging lights installed in my living room. I already have the materials — just need a licensed electrician to handle the wiring.",
    budget: 35000, negotiable: false, urgency: "Normal",
    status: "In Progress", proposalsCount: 5, applicants: [], proposals: [],
    visibility: "Verified", anonymous: false, isActive: true,
    deadline: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString() as unknown as Date,
    updatedAt: new Date().toISOString(),
    subcategoryId: { _id: "s2", name: "Electrical", description: "", categoryId: { _id: "c2", name: "Home Services", description: "" } },
    location: { coordinates: [], address: { city: "Orlando", state: "FL" } },
    media: [], userId: {} as any, providerId: {} as any,
  },
  {
    _id: "seed-3", id: "seed-3",
    title: "Paint 2-bedroom apartment",
    description: "Looking for a painter to paint the living room and 2 bedrooms with emulsion paint. Walls only, ceilings already done.",
    budget: 120000, negotiable: true, urgency: "Normal",
    status: "Completed", proposalsCount: 12, applicants: [], proposals: [],
    visibility: "Public", anonymous: false, isActive: false,
    deadline: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86_400_000).toISOString() as unknown as Date,
    updatedAt: new Date().toISOString(),
    subcategoryId: { _id: "s3", name: "Painting", description: "", categoryId: { _id: "c3", name: "Home Services", description: "" } },
    location: { coordinates: [], address: { city: "Miami", state: "FL" } },
    media: [], userId: {} as any, providerId: {} as any,
  },
  {
    _id: "seed-4", id: "seed-4",
    title: "Washing machine not spinning",
    description: "My washing machine drains but doesn't spin. It's a Samsung front-loader, about 3 years old. Needs diagnosis and repair.",
    budget: 15000, negotiable: true, urgency: "Immediate",
    status: "Active", proposalsCount: 3, applicants: [], proposals: [],
    visibility: "Public", anonymous: true, isActive: true,
    deadline: new Date(Date.now() + 1 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 86_400_000).toISOString() as unknown as Date,
    updatedAt: new Date().toISOString(),
    subcategoryId: { _id: "s4", name: "Appliance Repair", description: "", categoryId: { _id: "c4", name: "Home Services", description: "" } },
    location: { coordinates: [], address: { city: "Jacksonville", state: "FL" } },
    media: [], userId: {} as any, providerId: {} as any,
  },
];

const SEED_PROPOSALS: Record<string, ProposalData[]> = {
  "seed-1": [
    {
      _id: "p1", id: "p1", message: "I have 8 years of plumbing experience and can fix this today. I carry all standard pipe fittings in my van. Will provide a warranty on the repair.",
      proposedPrice: 18000, estimatedDuration: "2 hours", viewedByClient: true, attachments: [],
      createdAt: new Date(Date.now() - 3 * 3_600_000).toISOString(), updatedAt: new Date().toISOString(),
      jobId: {} as any,
      providerId: { _id: "pr1", providerName: "TundePlumbing Co.", providerTagline: "Certified plumbing specialist", averageRating: 4.8, reviewCount: 129, isVerified: true, isOnline: true, subcategories: [{ _id: "s1", name: "Plumbing" } as any] } as any,
    },
    {
      _id: "p2", id: "p2", message: "Licensed plumber here. I can come by this afternoon and assess the leak. My quote might change slightly depending on pipe condition.",
      proposedPrice: 22000, estimatedDuration: "3 hours", viewedByClient: false, attachments: [],
      createdAt: new Date(Date.now() - 5 * 3_600_000).toISOString(), updatedAt: new Date().toISOString(),
      jobId: {} as any,
      providerId: { _id: "pr2", providerName: "Bright Plumbers LLC", providerTagline: "Fast & reliable home repairs", averageRating: 4.5, reviewCount: 87, isVerified: true, isOnline: false, subcategories: [{ _id: "s1", name: "Plumbing" } as any] } as any,
    },
    {
      _id: "p3", id: "p3", message: "Available now. I specialize in kitchen plumbing — sink traps, supply lines, drain pipes. Can fix and test same day.",
      proposedPrice: 15000, estimatedDuration: "1.5 hours", viewedByClient: true, attachments: [],
      createdAt: new Date(Date.now() - 8 * 3_600_000).toISOString(), updatedAt: new Date().toISOString(),
      jobId: {} as any,
      providerId: { _id: "pr3", providerName: "QuickFix Pro", providerTagline: "Same-day emergency repairs", averageRating: 4.2, reviewCount: 54, isVerified: false, isOnline: true, subcategories: [{ _id: "s1", name: "Plumbing" } as any] } as any,
    },
  ],
  "seed-2": [
    {
      _id: "p4", id: "p4", message: "Electrician with 10+ years. Happy to install the 3 pendant lights. I'll handle all wiring safely and ensure everything is up to code.",
      proposedPrice: 28000, estimatedDuration: "4 hours", viewedByClient: true, attachments: [],
      createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(), updatedAt: new Date().toISOString(),
      jobId: {} as any,
      providerId: { _id: "pr4", providerName: "Bright Electricals", providerTagline: "Certified electrical expert", averageRating: 4.9, reviewCount: 98, isVerified: true, isOnline: true, subcategories: [{ _id: "s2", name: "Electrical" } as any] } as any,
    },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TaskListCard({
  job,
  isSelected,
  onClick,
}: {
  job: JobData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const days = job.deadline ? daysUntil(job.deadline) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-l-2 transition-all ${
        isSelected
          ? "border-l-blue-600 bg-blue-50 dark:bg-blue-950/30"
          : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={`text-sm font-bold leading-snug line-clamp-1 ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
          {job.title}
        </p>
        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[job.status] ?? STATUS_STYLES.Active}`}>
          {job.status}
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="font-bold text-gray-700 dark:text-gray-300">{formatBudget(job.budget)}</span>
        <span className="flex items-center gap-0.5">
          <Users size={10} />
          {job.proposalsCount} proposals
        </span>
        {days !== null && (
          <span className={`flex items-center gap-0.5 ${days < 0 ? "text-red-500" : days <= 2 ? "text-amber-500" : ""}`}>
            <Clock size={10} />
            {days < 0 ? "Expired" : `${days}d left`}
          </span>
        )}
      </div>

      {job.urgency && job.urgency !== "Normal" && (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-full ${URGENCY_STYLES[job.urgency]}`}>
          <Zap size={8} />
          {job.urgency}
        </span>
      )}
    </button>
  );
}

function ProposalCard({
  proposal,
  onAccept,
  onDecline,
  isActioning,
}: {
  proposal: ProposalData;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  isActioning: string | null;
}) {
  const provider = proposal.providerId as any;
  const logoUrl = getLogoUrl(provider);
  const acting = isActioning === proposal._id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-3"
    >
      {/* Provider row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden">
          {logoUrl
            ? <img src={logoUrl} alt={provider?.providerName} className="w-full h-full object-cover" />
            : <span className="text-white font-bold text-sm">{provider?.providerName?.charAt(0) ?? "P"}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{provider?.providerName ?? "Provider"}</p>
            {provider?.isVerified && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                <CheckCircle size={9} />
                Verified
              </span>
            )}
            {provider?.isOnline && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {provider?.averageRating > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-semibold">
                <Star size={10} className="fill-amber-500" />
                {provider.averageRating.toFixed(1)}
                <span className="text-gray-400 font-normal">({provider.reviewCount})</span>
              </span>
            )}
            <span className="text-[11px] text-gray-400">{timeAgo(proposal.createdAt)}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-black text-gray-900 dark:text-white">{formatBudget(proposal.proposedPrice)}</p>
          <p className="text-[11px] text-gray-400">{proposal.estimatedDuration}</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
        {proposal.message}
      </p>

      {/* Attachments */}
      {proposal.attachments?.length > 0 && (
        <div className="flex gap-2">
          {proposal.attachments.slice(0, 3).map((a, i) => (
            <div key={i} className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <img src={a.url} alt="attachment" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onAccept(proposal._id)}
          disabled={acting}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          {acting
            ? <Loader2 size={13} className="animate-spin" />
            : <ThumbsUp size={13} />
          }
          Accept
        </button>
        <button
          type="button"
          onClick={() => onDecline(proposal._id)}
          disabled={acting}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          <ThumbsDown size={13} />
          Decline
        </button>
        <Link
          href={`/providers/${provider?._id}`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 text-sm font-bold rounded-xl transition-all"
        >
          <User size={13} />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </div>

      {/* Unread badge */}
      {!proposal.viewedByClient && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          New proposal
        </div>
      )}
    </motion.div>
  );
}

function TaskDetail({
  job,
  proposals,
  loadingProposals,
  onAccept,
  onDecline,
  onDelete,
  isActioning,
  isDeleting,
}: {
  job: JobData;
  proposals: ProposalData[];
  loadingProposals: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onDelete: (id: string) => void;
  isActioning: string | null;
  isDeleting: boolean;
}) {
  const [tab, setTab] = useState<"proposals" | "details">("proposals");
  const [menuOpen, setMenuOpen] = useState(false);
  const days = job.deadline ? daysUntil(job.deadline) : null;
  const address = job.location?.address;
  const city = address?.city ?? address?.state ?? "";
  const mediaItems = (job.media ?? []) as MediaItem[];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status] ?? STATUS_STYLES.Active}`}>
                {job.status}
              </span>
              {job.urgency && job.urgency !== "Normal" && (
                <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${URGENCY_STYLES[job.urgency]}`}>
                  <Zap size={9} />
                  {job.urgency}
                </span>
              )}
              {job.negotiable && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  Negotiable
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white leading-snug">{job.title}</h2>
          </div>

          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  <Link
                    href={`/tasks/${job._id}/edit`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Edit3 size={13} /> Edit task
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onDelete(job._id); }}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    Delete task
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white text-sm">
            <DollarSign size={13} className="text-blue-500" />
            {formatBudget(job.budget)}
          </span>
          {days !== null && (
            <span className={`flex items-center gap-1 ${days < 0 ? "text-red-500" : days <= 2 ? "text-amber-500" : ""}`}>
              <Calendar size={11} />
              {days < 0 ? "Deadline passed" : `${days} days left`}
            </span>
          )}
          {city && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {city}
            </span>
          )}
          <span className="flex items-center gap-1">
            {job.visibility === "Public" ? <Eye size={11} /> : job.visibility === "Verified" ? <Shield size={11} /> : <User size={11} />}
            {job.visibility}
          </span>
          {job.anonymous && <span className="flex items-center gap-1"><User size={11} />Anonymous</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex border-b border-gray-100 dark:border-gray-800 px-5">
        {(["proposals", "details"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`py-3 px-1 mr-5 text-sm font-bold border-b-2 transition-colors capitalize ${
              tab === t
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {t === "proposals" ? `Proposals (${proposals.length})` : "Details"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {tab === "proposals" ? (
          loadingProposals ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Package size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">No proposals yet</p>
              <p className="text-xs text-gray-400 max-w-xs">Providers will submit proposals here. Check back soon.</p>
            </div>
          ) : (
            <AnimatePresence>
              {proposals.map((p) => (
                <ProposalCard
                  key={p._id}
                  proposal={p}
                  onAccept={onAccept}
                  onDecline={onDecline}
                  isActioning={isActioning}
                />
              ))}
            </AnimatePresence>
          )
        ) : (
          /* Details tab */
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {mediaItems.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Attachments</p>
                <div className="grid grid-cols-3 gap-2">
                  {mediaItems.map((m, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img src={m.url} alt={`media-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Budget", value: formatBudget(job.budget), icon: DollarSign },
                { label: "Category", value: job.subcategoryId?.name ?? "—", icon: Briefcase },
                { label: "Visibility", value: job.visibility, icon: Eye },
                { label: "Proposals", value: String(job.proposalsCount), icon: Users },
                { label: "Posted", value: timeAgo(job.createdAt as string), icon: Clock },
                { label: "Location", value: city || "—", icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon size={11} className="text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type StatusFilter = "All" | "Active" | "In Progress" | "Completed" | "Cancelled";

const STATUS_FILTERS: StatusFilter[] = ["All", "Active", "In Progress", "Completed", "Cancelled"];

export default function ClientTasksPage() {
  const [jobs, setJobs] = useState<JobData[]>(SEED_JOBS);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(SEED_JOBS[0]);
  const [proposals, setProposals] = useState<ProposalData[]>(SEED_PROPOSALS["seed-1"] ?? []);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isActioning, setIsActioning] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Load real jobs
  useEffect(() => {
    setLoading(true);
    getJobsByUser()
      .then((data) => {
        if (data?.length) {
          setJobs(data);
          setSelectedJob(data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load proposals when selected job changes
  useEffect(() => {
    if (!selectedJob) { setProposals([]); return; }

    // Use seed data if available
    const seed = SEED_PROPOSALS[selectedJob._id];
    if (seed) { setProposals(seed); return; }

    setLoadingProposals(true);
    getProposalsByJob(selectedJob._id)
      .then((data) => setProposals(data ?? []))
      .catch(() => setProposals([]))
      .finally(() => setLoadingProposals(false));
  }, [selectedJob?._id]);

  const filteredJobs = useMemo(() =>
    statusFilter === "All" ? jobs : jobs.filter((j) => j.status === statusFilter),
    [jobs, statusFilter]
  );

  const stats = useMemo(() => ({
    total: jobs.length,
    open: jobs.filter((j) => j.status === "Active").length,
    inProgress: jobs.filter((j) => j.status === "In Progress").length,
    completed: jobs.filter((j) => j.status === "Completed").length,
    totalProposals: jobs.reduce((s, j) => s + (j.proposalsCount ?? 0), 0),
  }), [jobs]);

  const handleSelectJob = useCallback((job: JobData) => {
    setSelectedJob(job);
    setMobilePanelOpen(true);
  }, []);

  const handleAccept = useCallback(async (proposalId: string) => {
    setIsActioning(proposalId);
    try {
      await updateProposalStatus(proposalId, "Accepted");
      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
      setJobs((prev) => prev.map((j) =>
        j._id === selectedJob?._id ? { ...j, status: "In Progress" as const } : j
      ));
      if (selectedJob) setSelectedJob((s) => s ? { ...s, status: "In Progress" as const } : s);
    } catch {
      setError("Failed to accept proposal. Please try again.");
    } finally {
      setIsActioning(null);
    }
  }, [selectedJob]);

  const handleDecline = useCallback(async (proposalId: string) => {
    setIsActioning(proposalId);
    try {
      await updateProposalStatus(proposalId, "Declined");
      setProposals((prev) => prev.filter((p) => p._id !== proposalId));
    } catch {
      setError("Failed to decline proposal. Please try again.");
    } finally {
      setIsActioning(null);
    }
  }, []);

  const handleDelete = useCallback(async (jobId: string) => {
    setIsDeleting(true);
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setSelectedJob(null);
    } catch {
      setError("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl"
          >
            <AlertCircle size={14} />
            {error}
            <button type="button" onClick={() => setError(null)} className="ml-1 opacity-70 hover:opacity-100">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex overflow-hidden">
        {/* ── Left panel: task list ────────────────────────────── */}
        <aside className={`flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 ${mobilePanelOpen ? "hidden" : "flex"} md:flex w-full md:w-80 xl:w-96`}>
          {/* Stats */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-base font-black text-gray-900 dark:text-white">My Tasks</h1>
              <Link
                href="/tasks/create"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Plus size={13} />
                Post Task
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total", value: stats.total, color: "text-gray-900 dark:text-white" },
                { label: "Open", value: stats.open, color: "text-green-600 dark:text-green-400" },
                { label: "Active", value: stats.inProgress, color: "text-blue-600 dark:text-blue-400" },
                { label: "Props", value: stats.totalProposals, color: "text-violet-600 dark:text-violet-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
                  <p className={`text-lg font-black leading-none ${color}`}>{value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="flex-shrink-0 px-4 py-2.5 border-b border-gray-50 dark:border-gray-800/50 overflow-x-auto">
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-full transition-all ${
                    statusFilter === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-4 py-3.5 animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full w-40" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
                </div>
              ))
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Briefcase size={28} className="text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">No tasks yet</p>
                <p className="text-xs text-gray-400 mb-4">Post your first task to get proposals from providers.</p>
                <Link
                  href="/tasks/create"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl"
                >
                  <Plus size={13} /> Post a task
                </Link>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <TaskListCard
                  key={job._id}
                  job={job}
                  isSelected={selectedJob?._id === job._id}
                  onClick={() => handleSelectJob(job)}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Right panel: task detail ─────────────────────────── */}
        <main className={`flex-1 min-w-0 flex flex-col ${!mobilePanelOpen ? "hidden md:flex" : "flex"}`}>
          {/* Mobile back */}
          {mobilePanelOpen && (
            <div className="md:hidden flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setMobilePanelOpen(false)}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400"
              >
                ← Back to tasks
              </button>
            </div>
          )}

          {!selectedJob ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
                <Briefcase size={36} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Select a task</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Choose a task from the list to view its details and manage proposals.
              </p>
            </div>
          ) : (
            <TaskDetail
              job={selectedJob}
              proposals={proposals}
              loadingProposals={loadingProposals}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onDelete={handleDelete}
              isActioning={isActioning}
              isDeleting={isDeleting}
            />
          )}
        </main>
      </div>
    </div>
  );
}
