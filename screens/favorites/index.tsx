"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Star,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { ProviderData, MediaItem } from "@/types";
import { providerPath } from "@/lib/sharePages";

// ── Helpers ──────────────────────────────────────────────────────────────────

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
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-sm transition-all group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center">
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
            <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-full flex-shrink-0">
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
        {providerPath(provider) && (
          <Link
            href={providerPath(provider)!}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            View
          </Link>
        )}
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
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-50 dark:from-brand-950/40 dark:to-brand-950/40 flex items-center justify-center mb-4">
        <Icon size={28} className="text-brand-300 dark:text-brand-600" />
      </div>
      <h3 className="font-black text-gray-900 dark:text-white text-base mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed mb-5">
        {message}
      </p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          {ctaLabel}
          <ArrowRight size={14} />
        </Link>
      ) : null}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Providers the person saved (stored on their account). Saved jobs aren't here:
 * nothing on the website can save a job, and the app keeps its own list.
 */
export default function FavoritesPage() {
  const { savedProviders, setSavedProviders } = useGlobalStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Saved providers
            </h1>
            {savedProviders.length > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black">
                {savedProviders.length}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Providers you&apos;ve saved for later
          </p>
        </motion.div>

        {savedProviders.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved providers yet"
            message="Save providers you like to find them quickly later. Browse our network to get started."
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
      </div>
    </div>
  );
}
