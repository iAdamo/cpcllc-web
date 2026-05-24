"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, Heart, CheckCircle } from "lucide-react";
import { globalSearch } from "@/axios/search";
import { CompanyData } from "@/types";
import { useTranslation } from "@/context/TranslationContext";

const filters = ["All", "Top Rated", "Verified", "Open Now"] as const;
type Filter = (typeof filters)[number];

async function fetchProviders() {
  const { data } = await globalSearch({ model: "providers", page: 1, limit: 8, engine: false });
  return data.providers as unknown as CompanyData[];
}

const ProviderCard = ({ provider, index }: { provider: CompanyData; index: number }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/providers/${provider._id}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={provider?.providerImages?.[0] || "/assets/men.jpg"}
              alt={provider?.providerName || "Provider"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            {/* Save button */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setSaved((v) => !v); }}
              className="absolute top-3 left-3 w-8 h-8 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90"
              aria-label="Save provider"
            >
              <Heart size={14} fill={saved ? "#ef4444" : "none"} color={saved ? "#ef4444" : "#6b7280"} />
            </button>

            {/* Rating badge */}
            {(provider?.averageRating ?? 0) > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white dark:bg-gray-900 shadow-md px-2.5 py-1 rounded-full">
                <Star size={10} fill="#f59e0b" color="#f59e0b" />
                <span className="text-xs font-black text-gray-900 dark:text-white">
                  {provider.averageRating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Verified badge */}
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full">
                <CheckCircle size={9} className="text-white" />
                <span className="text-[9px] font-black text-white uppercase tracking-wide">Verified</span>
              </div>
            </div>

            {/* Name over image */}
            <div className="absolute bottom-3 right-3 left-20">
              <h3 className="text-white font-black text-base leading-tight line-clamp-1 drop-shadow-lg">
                {provider?.providerName}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 pb-5">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-3">
              <MapPin size={12} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {provider?.location?.primary?.address?.address ?? "Location not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(provider?.averageRating ?? 0) ? "#f59e0b" : "#e5e7eb"}
                    color={i < Math.floor(provider?.averageRating ?? 0) ? "#f59e0b" : "#e5e7eb"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {provider?.reviewCount
                  ? `${provider.reviewCount} review${provider.reviewCount !== 1 ? "s" : ""}`
                  : "No reviews yet"}
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

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["homepage-providers"],
    queryFn: fetchProviders,
    staleTime: 5 * 60 * 1000,
  });

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
              Top Rated
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
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : providers.map((p, i) => <ProviderCard key={p._id ?? i} provider={p} index={i} />)}
        </div>

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
