"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, X } from "lucide-react";

interface BaseSearchProps {
  initialQuery?: string;
  initialLocation?: string;
  onSearch?: (query: string, location: string) => void;
}

interface HeroSearchProps extends BaseSearchProps {
  variant: "hero";
}

interface HeaderSearchProps extends BaseSearchProps {
  variant: "header";
  stickyHeader?: boolean;
}

export type UniversalSearchProps = HeroSearchProps | HeaderSearchProps;

export default function UniversalSearch(props: UniversalSearchProps) {
  const { variant, initialQuery = "", initialLocation = "", onSearch } = props;

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (variant !== "header") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(query, location);
    } else {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (location) p.set("location", location);
      router.push(`/providers?${p.toString()}`);
    }
  }, [query, location, onSearch, router]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // ── Hero variant ──────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Service */}
            <div className="flex items-center flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Search className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                  What
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Plumbing, HVAC, Electrical…"
                  className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              {query && (
                <button type="button" onClick={() => setQuery("")} className="ml-2 text-gray-300 hover:text-gray-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center flex-1 px-5 py-4 border-b sm:border-b-0 border-gray-100">
              <MapPin className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                  Where
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tampa, Florida"
                  className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              {location && (
                <button type="button" onClick={() => setLocation("")} className="ml-2 text-gray-300 hover:text-gray-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search button */}
            <div className="p-2.5">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto h-full px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg shadow-blue-500/30"
              >
                <Search size={15} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Header variant ────────────────────────────────────────────────────────
  const { stickyHeader = true } = props as HeaderSearchProps;

  const wrapperClass = stickyHeader
    ? `sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`
    : "bg-transparent border-b border-white/20";

  return (
    <div className={wrapperClass}>
      <div className="px-3 sm:px-4 md:px-5 py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Desktop: dual-input bar */}
          <div className="hidden md:flex flex-1 items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="flex items-center flex-1 px-4 py-3 min-w-0">
              <Search size={15} className="text-blue-500 mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">Service</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Plumbing, HVAC, Electrical..."
                  className="text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

            <div className="flex items-center flex-1 px-4 py-3 min-w-0">
              <MapPin size={15} className="text-blue-500 mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">Location</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tampa, Florida"
                  className="text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              <AnimatePresence>
                {location && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLocation("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="pr-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleSearch}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Search size={14} />
                Search
              </button>
            </div>
          </div>

          {/* Mobile: single input */}
          <div className="md:hidden flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Search services or companies..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mobile search button */}
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="md:hidden flex-shrink-0 px-3 py-2.5 bg-blue-600 text-white rounded-xl"
          >
            <Search size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
