"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  MapPin,
  X,
  Loader2,
  Navigation,
  Building2,
  Star,
  Briefcase,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { ProviderData } from "@/types";
import { globalSearch } from "@/axios/search";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SearchVariant = "hero" | "providers" | "jobs";

export interface UniversalSearchProps {
  variant: SearchVariant;
  /** Hero only: initial values */
  initialQuery?: string;
  initialLocation?: string;
  /** Hero only: called on submit instead of navigating (used when already on /providers) */
  onSearch?: (query: string, location: string) => void;
  /** Providers page: list to filter client-side when "What" input changes */
  providers?: ProviderData[];
  /** Providers page: called when location changes (triggers API re-fetch via store) */
  onLocationChange?: (location: string) => void;
}

// ── Hero variant ───────────────────────────────────────────────────────────────
// Full two-panel search box for the home page hero section.
// Navigates to /providers on submit and shows live provider suggestions.

export function HeroSearch({
  initialQuery = "",
  initialLocation = "",
  onSearch,
}: Pick<UniversalSearchProps, "initialQuery" | "initialLocation" | "onSearch">) {
  const router = useRouter();
  const { currentLocation, getCurrentLocation } = useGlobalStore();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<ProviderData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    const l = location.trim();
    if (!q && !l) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsFetching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await globalSearch({
          model: "providers",
          page: 1,
          limit: 8,
          engine: true,
          searchInput: q || "pass",
          address: l || undefined,
          country: currentLocation?.country || "United States",
        });
        const list = res.data.providers ?? [];
        setSuggestions(list);
        setShowSuggestions(list.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsFetching(false);
      }
    }, 320);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, location]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const submit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query, location);
    } else {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (location) p.set("location", location);
      router.push(`/providers?${p.toString()}`);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const useMyLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      if (loc?.formattedAddress) setLocation(loc.formattedAddress);
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl relative">
      <div className="bg-white rounded-2xl overflow-visible shadow-xl shadow-black/5">
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
                aria-label="Clear"
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
                  onClick={() => setLocation("")}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                aria-label="Use my location"
                onClick={useMyLocation}
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

          {/* Button */}
          <div className="p-2.5">
            <button
              type="button"
              onClick={submit}
              className="w-full sm:w-auto h-full px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg shadow-blue-500/30"
            >
              {isFetching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {suggestions.map((p) => (
              <button
                key={p._id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowSuggestions(false);
                  router.push(`/providers/${p._id}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 size={16} className="text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {p.providerName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {p.providerTagline || p.subcategories?.[0]?.name || ""}
                  </p>
                </div>
                {p.averageRating > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-600">
                      {p.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </button>
            ))}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                submit();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Search size={13} />
              View all results
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Providers page search ──────────────────────────────────────────────────────
// Hero-style two-panel layout (no dropdown).
// "What" progressively filters the loaded provider list client-side.
// "Where" + Search button triggers a fresh API fetch via executeSearch.

export function ProvidersSearch({
  providers = [],
  onLocationChange,
}: Pick<UniversalSearchProps, "providers" | "onLocationChange">) {
  const {
    setFilteredProviders,
    executeSearch,
    setSearchFilters,
    searchFilters,
    getCurrentLocation,
  } = useGlobalStore();

  const [query, setQuery] = useState(searchFilters.query ?? "");
  const [location, setLocation] = useState(searchFilters.location ?? "");
  const [locLoading, setLocLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const providersRef = useRef(providers);
  providersRef.current = providers;

  // "What" → client-side filter as user types (no API call)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredProviders([]);
      return;
    }
    setFilteredProviders(
      providersRef.current.filter(
        (p) =>
          p.providerName?.toLowerCase().includes(q) ||
          p.providerTagline?.toLowerCase().includes(q) ||
          p.subcategories?.some((s) => s.name?.toLowerCase().includes(q))
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // "Where" debounced → API re-fetch
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const l = location.trim();
    if (!l) return;
    debounceRef.current = setTimeout(() => {
      setFilteredProviders([]);
      setSearchFilters({ location: l });
      executeSearch({ model: "providers", location: l });
      onLocationChange?.(l);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFilteredProviders([]);
    setSearchFilters({ query: query || undefined, location: location || undefined });
    executeSearch({ model: "providers", query: query || undefined, location: location || undefined });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  const useMyLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      if (loc?.formattedAddress) {
        setLocation(loc.formattedAddress);
        setSearchFilters({ location: loc.formattedAddress, lat: loc.coords?.latitude, long: loc.coords?.longitude });
        executeSearch({ model: "providers", location: loc.formattedAddress });
      }
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/5">
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
                aria-label="Clear"
                onClick={() => { setQuery(""); setFilteredProviders([]); }}
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
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    setLocation("");
                    setSearchFilters({ location: undefined, lat: undefined, long: undefined });
                    // Re-search by GPS — executeSearch auto-requests location if no coords
                    executeSearch({ model: "providers", location: undefined });
                  }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                aria-label="Use my location"
                onClick={useMyLocation}
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
              onClick={submit}
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

// ── Jobs header search ─────────────────────────────────────────────────────────
// Compact task-focused bar for the /jobs page — different visual language.
// Dispatches to executeSearch with model: "jobs".

export function JobsSearch() {
  const {
    setSearchFilters,
    executeSearch,
    searchFilters,
    currentLocation,
    getCurrentLocation,
  } = useGlobalStore();

  const [query, setQuery] = useState(searchFilters.query ?? "");
  const [location, setLocation] = useState(searchFilters.location ?? "");
  const [locLoading, setLocLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  // Debounced search on query change
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchFilters({ query: query || undefined });
      executeSearch({ model: "jobs", query: query || undefined });
    }, 380);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchFilters({
      query: query || undefined,
      location: location || undefined,
    });
    executeSearch({
      model: "jobs",
      query: query || undefined,
      location: location || undefined,
    });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  const useMyLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      if (loc?.formattedAddress) {
        setLocation(loc.formattedAddress);
        setSearchFilters({
          location: loc.formattedAddress,
          lat: loc.coords?.latitude,
          long: loc.coords?.longitude,
        });
        executeSearch({ model: "jobs", location: loc.formattedAddress });
      }
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center gap-1.5 bg-gray-900 dark:bg-gray-800 border border-gray-700 rounded-2xl px-1 py-1 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
      {/* Task indicator pill */}
      <div className="flex-shrink-0 flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl">
        <Briefcase size={11} />
        <span className="hidden sm:inline">Tasks</span>
      </div>

      {/* Task search input */}
      <div className="flex items-center flex-1 min-w-0 px-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search tasks, skills…"
          className="flex-1 text-sm font-medium text-white placeholder-gray-400 bg-transparent outline-none min-w-0"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="ml-1.5 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-700 flex-shrink-0" />

      {/* Location */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 min-w-0 max-w-[140px]">
        <MapPin size={12} className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={onKey}
          placeholder="Location"
          className="flex-1 text-sm text-gray-300 placeholder-gray-500 bg-transparent outline-none min-w-0 w-full"
        />
        <button
          type="button"
          aria-label="Use my location"
          onClick={useMyLocation}
          className="text-gray-500 hover:text-blue-400 transition-colors flex-shrink-0"
        >
          {locLoading ? (
            <Loader2 size={12} className="animate-spin text-blue-400" />
          ) : (
            <Navigation size={12} />
          )}
        </button>
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={submit}
        className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl transition-all text-sm"
        aria-label="Search tasks"
      >
        <Search size={13} />
        <span className="hidden md:inline">Search</span>
      </button>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
// Auto-selects the right variant based on the `variant` prop.
// The NavBar uses pathname to decide which variant to render.

export default function UniversalSearch(props: UniversalSearchProps) {
  const {
    variant,
    initialQuery,
    initialLocation,
    providers,
    onLocationChange,
  } = props;

  if (variant === "hero") {
    return (
      <HeroSearch
        initialQuery={initialQuery}
        initialLocation={initialLocation}
        onSearch={props.onSearch}
      />
    );
  }
  if (variant === "jobs") {
    return <JobsSearch />;
  }
  return (
    <ProvidersSearch
      providers={providers}
      onLocationChange={onLocationChange}
    />
  );
}
