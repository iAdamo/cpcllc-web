"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Heart,
  CheckCircle,
  Award,
  Zap,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ProviderData, MediaItem } from "@/types";
import useGlobalStore from "@/stores";

interface ProviderCardProps {
  provider: ProviderData;
  index?: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

function getImageUrl(provider: ProviderData): string {
  const first = provider.providerImages?.[0];
  if (!first) return "/assets/men.jpg";
  if (typeof first === "object" && "thumbnail" in first) {
    return (first as MediaItem).thumbnail || "/assets/men.jpg";
  }
  return "/assets/men.jpg";
}

function getLogoUrl(provider: ProviderData): string | null {
  const logo = provider.providerLogo;
  if (!logo) return null;
  if (typeof logo === "object" && "thumbnail" in logo) {
    return (logo as MediaItem).thumbnail || null;
  }
  return null;
}

const ProviderCard = memo(function ProviderCard({
  provider,
  index = 0,
  isHovered,
  onHover,
}: ProviderCardProps) {
  const { savedProviders, setSavedProviders } = useGlobalStore();
  const [savePending, setSavePending] = useState(false);

  const isSaved = savedProviders.some((p) => p._id === provider._id);
  const imageUrl = getImageUrl(provider);
  const logoUrl = getLogoUrl(provider);
  const rating = provider.averageRating ?? 0;
  const reviewCount = provider.reviewCount ?? 0;
  const address =
    provider.location?.primary?.address?.address ?? "Location not specified";
  const subcategory = provider.subcategories?.[0];
  const isVerified = provider.isVerified ?? false;
  const isFeatured = provider.isFeatured ?? false;
  const isOnline = provider.availability === "Online";

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (savePending) return;
    setSavePending(true);
    await setSavedProviders(provider._id);
    setSavePending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover?.(provider._id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative transition-all duration-200 ${isHovered ? "z-10" : ""}`}
    >
      <div
        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
          isHovered
            ? "border-blue-300 shadow-xl shadow-blue-100/50 -translate-y-1"
            : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
        }`}
      >
        <div className="flex">
          {/* Cover image */}
          <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={provider.providerName}
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

            {/* Logo */}
            {logoUrl && (
              <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <Image src={logoUrl} alt="logo" fill className="object-cover" />
              </div>
            )}

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-md transition-all active:scale-90 ${
                savePending ? "opacity-50" : ""
              }`}
              aria-label="Save provider"
            >
              <Heart
                size={13}
                fill={isSaved ? "#ef4444" : "none"}
                color={isSaved ? "#ef4444" : "#6b7280"}
              />
            </button>

            {/* Online dot */}
            {isOnline && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-white">Online</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
            <div>
              {/* Badges row */}
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {isVerified && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100">
                    <CheckCircle size={9} />
                    Verified
                  </span>
                )}
                {isFeatured && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100">
                    <Award size={9} />
                    Featured
                  </span>
                )}
                {rating >= 4.8 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100">
                    <Zap size={9} />
                    Top Rated
                  </span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-black text-gray-900 text-base leading-tight line-clamp-1 mb-1">
                {provider.providerName}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < Math.floor(rating) ? "#f59e0b" : "#e5e7eb"}
                      color={i < Math.floor(rating) ? "#f59e0b" : "#e5e7eb"}
                    />
                  ))}
                </div>
                {rating > 0 ? (
                  <span className="text-xs font-bold text-gray-800">
                    {rating.toFixed(1)}
                  </span>
                ) : null}
                <span className="text-xs text-gray-400">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>

              {/* Subcategory */}
              {subcategory && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-semibold rounded-full">
                    {subcategory.name}
                  </span>
                  {provider.subcategories.length > 1 && (
                    <span className="text-[11px] text-gray-400">
                      +{provider.subcategories.length - 1} more
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {provider.providerDescription && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2 hidden sm:block">
                  {provider.providerDescription}
                </p>
              )}

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={11} className="text-blue-400 flex-shrink-0" />
                <span className="text-xs line-clamp-1">{address}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <Link
                href={`/providers/${provider._id}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all group/btn"
              >
                View Profile
                <ExternalLink
                  size={11}
                  className="group-hover/btn:translate-x-0.5 transition-transform"
                />
              </Link>
              {provider.providerPhoneNumber && (
                <a
                  href={`tel:${provider.providerPhoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 bg-gray-100 hover:bg-green-50 hover:text-green-600 rounded-xl flex items-center justify-center text-gray-500 transition-colors"
                  aria-label="Call provider"
                >
                  <Phone size={13} />
                </a>
              )}
              <button
                type="button"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center text-gray-500 transition-colors"
                aria-label="Message provider"
              >
                <MessageCircle size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ProviderCard;

export const ProviderCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-36 sm:w-44 flex-shrink-0 bg-gray-200 h-40" />
      <div className="flex-1 p-4 space-y-3">
        <div className="flex gap-1.5">
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-24" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
        <div className="h-3 bg-gray-200 rounded-full w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded-xl w-24" />
          <div className="h-8 w-8 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
