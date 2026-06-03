"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, X, Loader2, Navigation, Building2, Star } from "lucide-react";
import useGlobalStore from "@/stores";
import { ProviderData } from "@/types";
import { globalSearch } from "@/axios/search";

interface BaseSearchProps {
  initialQuery?: string;
  initialLocation?: string;
  /**
   * Providers page: when provided, "What" input filters this list client-side.
   * "Where" input still triggers onSearch for a fresh API fetch.
   */
  providers?: ProviderData[];
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
  const { variant, initialQuery = "", initialLocation = "", onSearch, providers } = props;

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<ProviderData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const { currentLocation, getCurrentLocation, setFilteredProviders } = useGlobalStore();

  // Scroll handler for header variant
  useEffect(() => {
    if (variant !== "header") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  // ── "What" input: client-side filter of already-fetched providers ─────────
  // Only runs on the providers page (onSearch + providers both present).
  // Does NOT call the backend — progressively filters the existing list.
  useEffect(() => {
    if (!onSearch || !providers) return;

    const q = query.trim().toLowerCase();

    if (q.length === 0) {
      setFilteredProviders([]);
      return;
    }

    setFilteredProviders(
      providers.filter(
        (p) =>
          p.providerName?.toLowerCase().includes(q) ||
          p.providerTagline?.toLowerCase().includes(q) ||
          p.subcategories?.some((s) => s.name?.toLowerCase().includes(q))
      )
    );
  }, [query, providers]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── "Where" input (providers page): triggers a fresh backend search ───────
  // Also clears the client-side filter so the full API result is shown.
  useEffect(() => {
    if (!onSearch) return;

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const l = location.trim();
    if (!l) return;

    debounceRef.current = setTimeout(() => {
      // Clear client-side filter — location change triggers a fresh backend fetch.
      // Do NOT pass query here: "What" only drives client-side filtering,
      // never an implicit backend call. Use Search button to combine both.
      setFilteredProviders([]);
      onSearch("", location);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hero standalone: fetch providers from backend → show dropdown ─────────
  useEffect(() => {
    if (onSearch) return; // Handled above

    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    const l = location.trim();
    const hasInput = q.length >= 2 || l.length >= 2;

    if (!hasInput) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await globalSearch({
          model: "providers",
          page: 1,
          limit: 8,
          engine: true,
          searchInput: q || "pass",
          address: l || undefined,
          country: currentLocation?.country || "Nigeria",
        });
        const fetched = result.data.providers ?? [];
        setSuggestions(fetched);
        setShowSuggestions(fetched.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, location]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowSuggestions(false);
    if (onSearch) {
      setFilteredProviders([]); // Clear client-side filter; let API results take over
      onSearch(query, location);
    } else {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (location) p.set("location", location);
      router.push(`/providers?${p.toString()}`);
    }
  }, [query, location, onSearch, router, setFilteredProviders]);

  const handleProviderSelect = useCallback(
    (provider: ProviderData) => {
      setShowSuggestions(false);
      router.push(`/providers/${provider._id}`);
    },
    [router]
  );

  const handleUseMyLocation = useCallback(async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      if (loc?.formattedAddress) {
        setLocation(loc.formattedAddress);
        if (onSearch) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          setFilteredProviders([]);
          onSearch(query, loc.formattedAddress);
        }
      }
    } finally {
      setLocLoading(false);
    }
  }, [getCurrentLocation, query, onSearch, setFilteredProviders]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  // ── Hero variant ──────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div ref={containerRef} className="w-full max-w-2xl relative">
        <div className="bg-white rounded-2xl overflow-visible">
          <div className="flex flex-col sm:flex-row">
            {/* What */}
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
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="ml-2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Where */}
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
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {location && (
                  <button
                    type="button"
                    aria-label="Clear location"
                    onClick={() => {
                      setLocation("");
                      setShowSuggestions(false);
                    }}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Use my location"
                  onClick={handleUseMyLocation}
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  {locLoading ? (
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                  ) : (
                    <Navigation size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* Search button */}
            <div className="p-2.5">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto h-full px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg shadow-blue-500/30"
              >
                {isSearching ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Search size={15} />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Provider suggestions dropdown — hero page only */}
        {!onSearch && (
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                {suggestions.map((provider) => (
                  <button
                    key={provider._id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleProviderSelect(provider);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {provider.providerName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {provider.providerTagline ||
                          provider.subcategories?.[0]?.name ||
                          provider.location.primary?.address?.city ||
                          ""}
                      </p>
                    </div>
                    {provider.averageRating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-600">
                          {provider.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Search size={13} />
                  View all results
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
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
    <div ref={containerRef} className={wrapperClass}>
      <div className="px-3 sm:px-4 md:px-5 py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: dual-input bar */}
          <div className="hidden md:flex flex-1 items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-visible hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="flex items-center flex-1 px-4 py-3 min-w-0">
              <Search size={15} className="text-blue-500 mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">
                  Service
                </span>
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
                    onClick={() => {
                      setQuery("");
                      setFilteredProviders([]);
                    }}
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
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.12em]">
                  Location
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Tampa, Florida"
                  className="text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                <AnimatePresence>
                  {location && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setLocation("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={13} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  aria-label="Use my location"
                  onClick={handleUseMyLocation}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {locLoading ? (
                    <Loader2 size={13} className="animate-spin text-blue-500" />
                  ) : (
                    <Navigation size={13} />
                  )}
                </button>
              </div>
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
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setFilteredProviders([]);
                }}
                className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

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
