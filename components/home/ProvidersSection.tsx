"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, CheckCircle, Building2 } from "lucide-react";
import { getFeaturedProviders } from "@/axios/public";
import { MediaItem, ProviderData } from "@/types";
import { useTranslation } from "@/context/TranslationContext";
import useGlobalStore from "@/stores";

const filters = ["All", "Top Rated", "Verified"] as const;
type Filter = (typeof filters)[number];

/**
 * Visitor country without a geolocation permission prompt on the landing
 * page: device location when the user already granted it, otherwise the
 * browser locale's region ("en-US" → "United States"), otherwise the
 * launch market. Keeps the rail strictly local — no cross-border listings.
 */
function resolveVisitorCountry(
  currentLocation: { country?: string | null } | null
): string {
  if (currentLocation?.country) return currentLocation.country;
  try {
    const region = new Intl.Locale(navigator.language).region;
    if (region) {
      const name = new Intl.DisplayNames(["en"], { type: "region" }).of(region);
      if (name) return name;
    }
  } catch {
    /* older browsers — fall through */
  }
  return "United States";
}

/** First usable image for the card: gallery shot, else logo, else none. */
function cardImage(provider: ProviderData): string | null {
  const gallery = provider?.gallery?.[0] as MediaItem | undefined;
  if (gallery?.thumbnail) return gallery.thumbnail;
  if (gallery?.url) return gallery.url;
  const logo = provider?.providerLogo as unknown as MediaItem | undefined;
  if (typeof logo === "string") return logo;
  if (logo?.thumbnail) return logo.thumbnail;
  if (logo?.url) return logo.url;
  return null;
}

const ProviderCard = ({
  provider,
  index,
}: {
  provider: ProviderData;
  index: number;
}) => {
  const image = cardImage(provider);
  const rating = provider?.averageRating ?? 0;
  const location =
    provider?.location?.primary?.address?.city ||
    provider?.location?.primary?.address?.address ||
    "Location not specified";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/c/${provider.slug ?? provider._id}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
            {image ? (
              <Image
                src={image}
                alt={provider?.providerName || "Provider"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 size={44} className="text-white/25" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* Rating badge */}
            {rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white dark:bg-gray-900 shadow-md px-2.5 py-1 rounded-full">
                <Star size={10} fill="#f59e0b" color="#f59e0b" />
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Verified badge — only when actually verified */}
            {provider?.isVerified && (
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full">
                  <CheckCircle size={9} className="text-white" />
                  <span className="text-[9px] font-black text-white uppercase tracking-wide">
                    Verified
                  </span>
                </div>
              </div>
            )}

            {/* Name over image */}
            <div
              className={`absolute bottom-3 right-3 ${
                provider?.isVerified ? "left-20" : "left-3"
              }`}
            >
              <h3 className="text-white font-black text-base leading-tight line-clamp-1 drop-shadow-lg">
                {provider?.providerName}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 pb-5">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-3">
              <MapPin size={12} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                {(provider?.subcategories?.[0] as any)?.name ?? "Local services"}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                {provider?.reviewCount
                  ? `${provider.reviewCount} review${
                      provider.reviewCount !== 1 ? "s" : ""
                    }`
                  : "New on the platform"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="h-52 bg-gray-200 dark:bg-gray-800" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
      </div>
    </div>
  </div>
);

export default function ProvidersSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const { t } = useTranslation();
  const currentLocation = useGlobalStore((s) => s.currentLocation);
  const country = resolveVisitorCountry(currentLocation);

  const { data: providers = [], isLoading } = useQuery<ProviderData[]>({
    queryKey: ["homepage-providers", country],
    queryFn: () => getFeaturedProviders(country),
    staleTime: 5 * 60 * 1000,
  });

  const displayed = useMemo(() => {
    switch (activeFilter) {
      case "Top Rated":
        return providers.filter((p) => (p.averageRating ?? 0) >= 4);
      case "Verified":
        return providers.filter((p) => p.isVerified);
      default:
        return providers;
    }
  }, [providers, activeFilter]);

  // Nothing to show at all — hide the section rather than render an empty
  // shell on the landing page.
  if (!isLoading && providers.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">
              Featured Companies
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              {t("connectWithTopCompanies")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md text-base">
              {t("joinCompaniesCenter")}
            </p>
          </motion.div>

          <Link
            href="/providers"
            className="hidden md:flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline group flex-shrink-0"
          >
            {t("browseCompanies")}
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeFilter === f
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {displayed.length === 0 && !isLoading ? (
          <div className="py-14 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No companies match this filter yet —{" "}
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="text-blue-600 font-bold hover:underline"
              >
                show all
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : displayed.map((p, i) => (
                  <ProviderCard key={p._id ?? i} provider={p} index={i} />
                ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/providers"
            className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            {t("browseCompanies")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
