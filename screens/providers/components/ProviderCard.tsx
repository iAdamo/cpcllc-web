"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Heart, CheckCircle, Award, Zap, Phone } from "lucide-react";
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
  const rating = provider.averageRating ?? 0;
  const reviewCount = provider.reviewCount ?? 0;
  const address = provider.location?.primary?.address?.address ?? "Location not specified";
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
    <div
      onMouseEnter={() => onHover?.(provider._id)}
      onMouseLeave={() => onHover?.(null)}
      className={`relative bg-white border rounded-xl transition-all duration-150 cursor-pointer group ${
        isHovered
          ? "border-blue-400 shadow-md shadow-blue-100/60"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="relative w-40 h-28 flex-shrink-0 rounded-l-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={provider.providerName}
            fill
            sizes="200px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isOnline && (
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-emerald-400 rounded-full border border-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 gap-1">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            {isVerified && (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                <CheckCircle size={9} /> Verified
              </span>
            )}
            {isFeatured && (
              <span className="inline-flex items-center gap-0.5 text-amber-600 text-[10px] font-bold">
                <Award size={9} /> Featured
              </span>
            )}
            {rating >= 4.8 && (
              <span className="inline-flex items-center gap-0.5 text-blue-600 text-[10px] font-bold">
                <Zap size={9} /> Top Rated
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
            {provider.providerName}
          </h3>

          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex gap-px">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={9}
                  fill={i < Math.floor(rating) ? "#f59e0b" : "#e5e7eb"}
                  color={i < Math.floor(rating) ? "#f59e0b" : "#e5e7eb"}
                />
              ))}
            </div>
            {rating > 0 && (
              <span className="text-[11px] font-bold text-gray-800">{rating.toFixed(1)}</span>
            )}
            <span className="text-[10px] text-gray-400">({reviewCount})</span>
          </div>
          <p className="text-xs text-gray-700 line-clamp-2" >{provider.providerDescription}</p>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {provider.subcategories?.length > 0 && (
              <span className="text-[10px] text-gray-500 font-medium">
                {provider.subcategories.slice(0, 2).map((s) => s.name).join(" · ")}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <MapPin size={8} className="text-blue-400 flex-shrink-0" />
              <span className="line-clamp-1 max-w-[110px]">{address}</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-1 mr-3">
          <button
            type="button"
            onClick={handleSave}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              savePending ? "opacity-40" : "hover:bg-red-50"
            }`}
            aria-label="Save"
          >
            <Heart
              size={13}
              fill={isSaved ? "#ef4444" : "none"}
              color={isSaved ? "#ef4444" : "#9ca3af"}
            />
          </button>
          <Link
            href={`/providers/${provider._id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            View Profile
          </Link>
          {provider.providerPhoneNumber && (
            <a
              href={`tel:${provider.providerPhoneNumber}`}
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 bg-gray-100 hover:bg-green-50 hover:text-green-600 rounded-lg flex items-center justify-center text-gray-400 transition-colors"
              aria-label="Call"
            >
              <Phone size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProviderCard;

export const ProviderCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
        <div className="h-3.5 w-36 bg-gray-200 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded-full" />
        <div className="h-2 w-28 bg-gray-200 rounded-full" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="w-7 h-7 bg-gray-200 rounded-full" />
        <div className="w-20 h-6 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);
