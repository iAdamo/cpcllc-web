"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bookmark,
  Star,
  MapPin,
  X,
  Briefcase,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { ProviderData, JobData, MediaItem } from "@/types";

type Tab = "providers" | "tasks";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBudget(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function formatDeadline(deadline: string | Date): string {
  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86400000
  );
  if (days < 0) return "Expired";
  return `${days}d left`;
}

function getProviderLogoUrl(provider: ProviderData): string | null {
  const logo = provider.providerLogo;
  if (!logo) return null;
  if (typeof logo === "object" && "thumbnail" in logo) {
    return (logo as MediaItem).thumbnail || null;
  }
  return null;
}

function getProviderCity(provider: ProviderData): string {
  return (
    provider.location?.primary?.address?.city ||
    provider.location?.primary?.address?.state ||
    ""
  );
}

const STATUS_COLOR: Record<string, string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "In Progress":
    "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  Expired: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const URGENCY_COLOR: Record<string, string> = {
  Immediate:
    "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  Urgent:
    "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
};

// ── Provider Card ─────────────────────────────────────────────────────────────

function SavedProviderCard({
  provider,
  onRemove,
}: {
  provider: ProviderData;
  onRemove: () => void;
}) {
  const logoUrl = getProviderLogoUrl(provider);
  const city = getProviderCity(provider);
  const rating = provider.averageRating ?? 0;
  const category = provider.subcategories?.[0]?.name ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={provider.providerName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-black text-white">
            {provider.providerName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug truncate">
            {provider.providerName}
          </h3>
          {category && (
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full flex-shrink-0">
              {category}
            </span>
          )}
        </div>
        {provider.providerTagline && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
            {provider.providerTagline}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {rating > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              {rating.toFixed(1)}
            </span>
          )}
          {city && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              <MapPin size={9} />
              {city}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/providers/${provider._id}`}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          View
        </Link>
        <button
          type="button"
          aria-label="Remove from favorites"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Task Card ─────────────────────────────────────────────────────────────────

function SavedTaskCard({
  job,
  onRemove,
}: {
  job: JobData;
  onRemove: () => void;
}) {
  const deadline = formatDeadline(job.deadline);
  const isExpired = deadline === "Expired";
  const budget = formatBudget(job.budget);
  const statusColor = STATUS_COLOR[job.status] ?? STATUS_COLOR["Expired"];
  const urgencyColor = URGENCY_COLOR[job.urgency ?? ""];
  const city =
    job.location?.address?.city || job.location?.address?.state || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 flex items-center justify-center">
        <Briefcase size={20} className="text-blue-500 dark:text-blue-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
            {job.title}
          </h3>
          {job.urgency && job.urgency !== "Normal" && urgencyColor && (
            <span
              className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${urgencyColor}`}
            >
              <Zap size={8} />
              {job.urgency}
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
            {job.description}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-black text-gray-900 dark:text-white">
            {budget}
          </span>
          <span
            className={`flex items-center gap-0.5 text-[11px] font-semibold ${
              isExpired ? "text-red-500" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <Calendar size={9} />
            {deadline}
          </span>
          {city && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              <MapPin size={9} />
              {city}
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}
          >
            {job.status}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/tasks/${job._id}`}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          View
        </Link>
        <button
          type="button"
          aria-label="Remove from favorites"
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  message,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 flex items-center justify-center mb-4">
        <Icon size={28} className="text-blue-300 dark:text-blue-600" />
      </div>
      <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed mb-5">
        {message}
      </p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
      >
        {ctaLabel}
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  const { savedProviders, savedJobs, setSavedProviders, setSavedJobs } =
    useGlobalStore();

  const [activeTab, setActiveTab] = useState<Tab>("providers");

  const totalCount = savedProviders.length + savedJobs.length;

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] =
    [
      {
        id: "providers",
        label: "Saved Providers",
        icon: Heart,
        count: savedProviders.length,
      },
      {
        id: "tasks",
        label: "Saved Tasks",
        icon: Bookmark,
        count: savedJobs.length,
      },
    ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Your Favorites
            </h1>
            {totalCount > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black">
                {totalCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Providers and tasks you&apos;ve saved for later
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-1.5">
          {tabs.map(({ id, label, icon: Icon, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {id === "providers" ? "Providers" : "Tasks"}
                </span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "providers" && (
            <motion.div
              key="providers"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              {savedProviders.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="No saved providers yet"
                  message="Bookmark providers you like to find them quickly later. Browse our network to get started."
                  ctaLabel="Explore Providers"
                  ctaHref="/providers"
                />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {savedProviders.map((provider: ProviderData) => (
                      <SavedProviderCard
                        key={provider._id}
                        provider={provider}
                        onRemove={() => setSavedProviders(provider._id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              {savedJobs.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title="No saved tasks yet"
                  message="Save tasks you want to revisit or apply to later. Explore available tasks now."
                  ctaLabel="Browse Tasks"
                  ctaHref="/tasks"
                />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {savedJobs.map((job: JobData) => (
                      <SavedTaskCard
                        key={job._id}
                        job={job}
                        onRemove={() => setSavedJobs(job)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
