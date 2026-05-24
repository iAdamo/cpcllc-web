"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  X,
  Navigation,
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProviderData, MediaItem } from "@/types";

interface MapPanelProps {
  providers: ProviderData[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  className?: string;
}

function getImageUrl(provider: ProviderData): string {
  const first = provider.providerImages?.[0];
  if (first && typeof first === "object" && "thumbnail" in first) {
    return (first as MediaItem).thumbnail || "/assets/men.jpg";
  }
  return "/assets/men.jpg";
}

function seedRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getProviderPin(provider: ProviderData, index: number) {
  const seed1 = index * 13 + 7;
  const seed2 = index * 17 + 3;
  const x = 8 + seedRandom(seed1) * 84;
  const y = 8 + seedRandom(seed2) * 75;
  return { x: `${x}%`, y: `${y}%` };
}

const PinColors = [
  { bg: "bg-blue-600", text: "text-white", ring: "ring-blue-300" },
  { bg: "bg-violet-600", text: "text-white", ring: "ring-violet-300" },
  { bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-300" },
  { bg: "bg-orange-500", text: "text-white", ring: "ring-orange-300" },
  { bg: "bg-rose-600", text: "text-white", ring: "ring-rose-300" },
];

export default function MapPanel({
  providers,
  hoveredId,
  onHover,
  className = "",
}: MapPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const selectedProvider = useMemo(
    () => providers.find((p) => p._id === selectedId),
    [providers, selectedId]
  );

  const pins = useMemo(
    () =>
      providers.slice(0, 30).map((p, i) => ({
        provider: p,
        pos: getProviderPin(p, i),
        color: PinColors[i % PinColors.length],
      })),
    [providers]
  );

  const handlePinClick = useCallback(
    (id: string) => {
      setSelectedId(id === selectedId ? null : id);
    },
    [selectedId]
  );

  return (
    <div className={`relative h-full min-h-[400px] rounded-2xl overflow-hidden ${className}`}>
      {/* ── Map base ── */}
      <div className="absolute inset-0 bg-[#e8ecf0]">
        {/* SVG road grid  */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Water body */}
          <ellipse cx="75%" cy="85%" rx="30%" ry="20%" fill="#b3d4e8" opacity="0.6" />
          <ellipse cx="5%" cy="70%" rx="10%" ry="15%" fill="#b3d4e8" opacity="0.4" />

          {/* Parks / green */}
          <rect x="10%" y="20%" width="15%" height="12%" rx="4" fill="#c8e6c9" opacity="0.7" />
          <rect x="55%" y="40%" width="10%" height="8%" rx="4" fill="#c8e6c9" opacity="0.6" />
          <rect x="30%" y="65%" width="12%" height="10%" rx="4" fill="#c8e6c9" opacity="0.6" />

          {/* Major roads */}
          <line x1="0" y1="25%" x2="100%" y2="28%" stroke="#ffffff" strokeWidth="12" />
          <line x1="0" y1="52%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="10" />
          <line x1="0" y1="75%" x2="100%" y2="73%" stroke="#ffffff" strokeWidth="8" />
          <line x1="18%" y1="0" x2="20%" y2="100%" stroke="#ffffff" strokeWidth="12" />
          <line x1="45%" y1="0" x2="47%" y2="100%" stroke="#ffffff" strokeWidth="10" />
          <line x1="72%" y1="0" x2="70%" y2="100%" stroke="#ffffff" strokeWidth="8" />

          {/* Minor roads */}
          <line x1="0" y1="38%" x2="44%" y2="40%" stroke="#f0f0f0" strokeWidth="5" />
          <line x1="48%" y1="40%" x2="100%" y2="37%" stroke="#f0f0f0" strokeWidth="5" />
          <line x1="0" y1="62%" x2="100%" y2="61%" stroke="#f0f0f0" strokeWidth="5" />
          <line x1="33%" y1="0" x2="33%" y2="49%" stroke="#f0f0f0" strokeWidth="5" />
          <line x1="60%" y1="52%" x2="60%" y2="100%" stroke="#f0f0f0" strokeWidth="5" />

          {/* Road center lines */}
          <line x1="0" y1="25%" x2="100%" y2="28%" stroke="#f5a623" strokeWidth="1.5" strokeDasharray="20 14" opacity="0.5" />
          <line x1="45%" y1="0" x2="47%" y2="100%" stroke="#f5a623" strokeWidth="1.5" strokeDasharray="20 14" opacity="0.5" />

          {/* City blocks */}
          <rect x="21%" y="0" width="11%" height="24%" rx="2" fill="#d8d8d8" opacity="0.6" />
          <rect x="21%" y="29%" width="11%" height="22%" rx="2" fill="#d8d8d8" opacity="0.6" />
          <rect x="34%" y="0" width="10%" height="24%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="48%" y="0" width="21%" height="24%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="48%" y="29%" width="10%" height="20%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="61%" y="29%" width="8%" height="20%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="73%" y="0" width="27%" height="48%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="0" y="30%" width="17%" height="20%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="21%" y="53%" width="11%" height="20%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="0" y="53%" width="17%" height="20%" rx="2" fill="#d8d8d8" opacity="0.5" />
          <rect x="34%" y="53%" width="10%" height="20%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="48%" y="53%" width="10%" height="20%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="0" y="76%" width="17%" height="24%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="21%" y="76%" width="11%" height="24%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="34%" y="76%" width="10%" height="24%" rx="2" fill="#d8d8d8" opacity="0.4" />
          <rect x="48%" y="76%" width="10%" height="14%" rx="2" fill="#d8d8d8" opacity="0.4" />
        </svg>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
      </div>

      {/* ── Provider Pins ── */}
      {pins.map(({ provider, pos, color }) => {
        const isHovered = hoveredId === provider._id;
        const isSelected = selectedId === provider._id;
        const active = isHovered || isSelected;
        const rating = provider.averageRating ?? 0;

        return (
          <motion.button
            key={provider._id}
            type="button"
            style={{ left: pos.x, top: pos.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            animate={{
              scale: active ? 1.25 : 1,
              zIndex: active ? 20 : 10,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => handlePinClick(provider._id)}
            onMouseEnter={() => onHover(provider._id)}
            onMouseLeave={() => !isSelected && onHover(null)}
            aria-label={provider.providerName}
          >
            {/* Pulse ring */}
            {active && (
              <motion.div
                className={`absolute inset-0 -m-2 rounded-full ${color.bg} opacity-20`}
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            <div
              className={`relative flex flex-col items-center ${active ? "filter drop-shadow-xl" : ""}`}
            >
              {/* Pin bubble */}
              <div
                className={`${color.bg} ${color.text} rounded-xl px-2.5 py-1.5 text-[11px] font-black shadow-md flex items-center gap-1 whitespace-nowrap max-w-[120px]`}
              >
                <span className="truncate">{provider.providerName.split(" ")[0]}</span>
                {rating > 0 && (
                  <span className="flex items-center gap-0.5 ml-1 flex-shrink-0">
                    <Star size={8} fill="currentColor" />
                    {rating.toFixed(1)}
                  </span>
                )}
              </div>
              {/* Arrow */}
              <div
                className={`w-2.5 h-2.5 ${color.bg} rotate-45 -mt-1.5 rounded-sm shadow-sm`}
              />
            </div>
          </motion.button>
        );
      })}

      {/* ── Selected provider preview card ── */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            key={selectedProvider._id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-3 right-3 z-30"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={getImageUrl(selectedProvider)}
                    alt={selectedProvider.providerName}
                    fill
                    className="object-cover"
                  />
                  {selectedProvider.isVerified && (
                    <div className="absolute top-1 left-1">
                      <CheckCircle size={12} className="text-emerald-500 drop-shadow" fill="white" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 p-3 min-w-0">
                  <p className="font-black text-gray-900 text-sm line-clamp-1">
                    {selectedProvider.providerName}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 mb-1.5">
                    <Star size={10} fill="#f59e0b" color="#f59e0b" />
                    <span className="text-xs font-bold text-gray-800">
                      {selectedProvider.averageRating?.toFixed(1) ?? "New"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({selectedProvider.reviewCount ?? 0})
                    </span>
                  </div>
                  {selectedProvider.subcategories?.[0] && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {selectedProvider.subcategories[0].name}
                    </span>
                  )}
                  <Link
                    href={`/providers/${selectedProvider._id}`}
                    className="mt-2 flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg w-full hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Map controls ── */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          aria-label="Layers"
        >
          <Layers size={16} />
        </button>
        <button
          type="button"
          className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-gray-100 transition-colors"
          aria-label="My location"
        >
          <Navigation size={16} />
        </button>
      </div>

      {/* ── Search this area button ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-600 hover:text-white text-gray-800 text-xs font-bold rounded-full shadow-xl border border-gray-200 hover:border-blue-600 transition-all"
        >
          <Search size={12} />
          Search this area
        </motion.button>
      </div>

      {/* ── Provider count badge ── */}
      {providers.length > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-md border border-gray-100 text-xs font-bold text-gray-700">
            <MapPin size={10} className="inline text-blue-500 mr-1" />
            {providers.length} providers
          </div>
        </div>
      )}
    </div>
  );
}
