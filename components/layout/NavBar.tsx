"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  Bell,
  Heart,
  Sun,
  Moon,
  MapPin,
  PlusCircle,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import useGlobalStore from "@/stores";
import AuthModalManager from "@/screens/auth/AuthModalManager";
import ProfileMenu from "@/components/ProfileMenu";
import { useTranslation } from "@/context/TranslationContext";

// ── Location chip (authenticated users only) ──────────────────────────────────

function LocationChip({ transparent = false }: { transparent?: boolean }) {
  const { currentLocation, isAuthenticated } = useGlobalStore();
  if (!isAuthenticated || !currentLocation) return null;

  const city =
    (currentLocation as any).city || (currentLocation as any).district || null;
  const country =
    (currentLocation as any).isoCountryCode ||
    (currentLocation as any).country?.slice(0, 2)?.toUpperCase() ||
    null;

  if (!city && !country) return null;

  return (
    <div
      className={`hidden lg:flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl whitespace-nowrap max-w-[140px] ${
        transparent
          ? "text-white/70 bg-white/10 border border-white/20"
          : "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      }`}
    >
      <MapPin
        size={10}
        className={
          transparent
            ? "text-white/80 flex-shrink-0"
            : "text-blue-500 flex-shrink-0"
        }
      />
      <span className="truncate">
        {[city, country].filter(Boolean).join(", ")}
      </span>
    </div>
  );
}

// ── Jobs nav search ───────────────────────────────────────────────────────────

function JobsNavSearch() {
  const {
    setSearchFilters,
    executeSearch,
    searchFilters,
    jobResults,
    setFilteredJobs,
  } = useGlobalStore();
  const [query, setQuery] = useState(searchFilters?.query ?? "");
  const mounted = useRef(false);
  const jobResultsRef = useRef(jobResults);
  jobResultsRef.current = jobResults;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const q = query.trim().toLowerCase();
    // Client-side filter only — API call happens on Enter via flush()
    if (!q) {
      setFilteredJobs([]);
    } else {
      setFilteredJobs(
        jobResultsRef.current.filter(
          (j) =>
            j.title?.toLowerCase().includes(q) ||
            j.description?.toLowerCase().includes(q) ||
            (j.subcategoryId as any)?.name?.toLowerCase().includes(q)
        )
      );
    }
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const flush = () => {
    setSearchFilters({ query: query || undefined });
    executeSearch({ model: "jobs", query: query || undefined });
  };

  return (
    <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all">
      <Search size={15} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") flush();
        }}
        placeholder="Search for services or tasks…"
        className="flex-1 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 bg-transparent outline-none min-w-0"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setFilteredJobs([]);
            setSearchFilters({ query: undefined });
            executeSearch({ model: "jobs" });
          }}
          aria-label="Clear search"
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

// ── NavBar ─────────────────────────────────────────────────────────────────────

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { user, logout, isAuthenticated } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === "/";
  const isProviders = pathname === "/providers";
  const isJobs = pathname === "/jobs";

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled && !mobileOpen;

  const navLinks = useMemo(
    () =>
      [
        { label: t("home"), href: "/", show: !isAuthenticated },
        {
          label: t("service_providers"),
          href: "/providers",
          show: !isProviders && user?.activeRole === "Client",
        },
        {
          label: "My Tasks",
          href: "/tasks",
          show: user?.activeRole === "Client" && pathname !== "/tasks",
        },
        {
          label: t("jobs"),
          href: "/jobs",
          show: isAuthenticated && !isJobs && user?.activeRole === "Provider",
        },
        {
          label: "Register your business",
          href: "/onboarding",
          show: !user?.activeRoleId?._id && !isJobs,
        },
        {
          label: t("how_it_works"),
          href: "/how-it-works",
          show: !isAuthenticated || pathname !== "/how-it-works",
        },
      ].filter((l) => l.show),
    [t, isAuthenticated, pathname, user, isProviders, isJobs]
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : "bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:bg-gray-950/96 dark:border-gray-800"
        }`}
      >
        <div className="flex flex-row justify-between gap-12 h-16 md:h-20 w-full items-center px-5 md:px-10">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-end gap-2">
            <Image
              src={
                transparent
                  ? "/assets/logo-white.png"
                  : "/assets/logo-color.png"
              }
              alt="CompaniesCenter"
              width={56}
              height={56}
              priority
            />
          </Link>
          {/* <div className="flex w-full gap-3 h-16 md:h-20 justify-between bg-red-500"> */}
          {/* Location chip — left side, authenticated only */}
          <LocationChip transparent={transparent} />

          {/* Center: search on /jobs, nav links elsewhere */}
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 px-4">
            {isJobs ? (
              <JobsNavSearch />
            ) : (
              <div className="flex items-center gap-1">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-colors ${
                      transparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                    } ${
                      pathname === href
                        ? transparent
                          ? "!text-white bg-white/10"
                          : "!text-blue-600 bg-blue-50 dark:!text-blue-400 dark:bg-blue-950"
                        : ""
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            {/* Theme toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  transparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Favorites */}
            {user && (
              <button
                type="button"
                onClick={() => router.push("/favorites")}
                aria-label="Favorites"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  transparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Heart size={16} />
              </button>
            )}

            {/* Notifications */}
            {user && (
              <button
                type="button"
                aria-label="Notifications"
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  transparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            )}

            {/* Language */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  transparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Globe size={14} />
                <span>{language === "en" ? "EN" : "ES"}</span>
                <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20"
                  >
                    {(["en", "es"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 ${
                          language === lang
                            ? "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/50"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {lang === "en" ? "🇺🇸 English" : "🇪🇸 Español"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post a Task — clients only */}
            {user?.activeRole === "Client" && (
              <button
                type="button"
                onClick={() => router.push("/tasks/create")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  transparent
                    ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                <PlusCircle size={14} />
                Post a Task
              </button>
            )}

            <div
              className={`w-px h-5 mx-1 ${
                transparent ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />

            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    transparent
                      ? "text-white border border-white/30 hover:bg-white/10"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {t("logIn")}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/25 active:scale-95"
                >
                  {t("getStarted")}
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden ml-auto p-2 rounded-lg transition-colors ${
              transparent
                ? "text-white hover:bg-white/10"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile: search bar on /jobs */}
        {isJobs && (
          <div className="md:hidden px-4 pb-3">
            <JobsNavSearch />
          </div>
        )}

        {/* Mobile dropdown panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center py-3.5 text-gray-800 dark:text-gray-100 font-semibold border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      {user.activeRole === "Client" && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/tasks/create");
                            setMobileOpen(false);
                          }}
                          className="w-full py-3.5 text-center font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2"
                        >
                          <PlusCircle size={16} />
                          Post a Task
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          router.push("/profile");
                          setMobileOpen(false);
                        }}
                        className="w-full py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        {t("profile")}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await logout();
                          router.replace("/");
                          setMobileOpen(false);
                        }}
                        className="w-full py-3.5 text-center font-semibold text-red-600 border border-red-100 rounded-xl"
                      >
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthOpen(true);
                          setMobileOpen(false);
                        }}
                        className="w-full py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        {t("logIn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          router.push("/onboarding");
                          setMobileOpen(false);
                        }}
                        className="w-full py-3.5 text-center font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl"
                      >
                        {t("getStarted")}
                      </button>
                    </>
                  )}

                  {/* Terms & Privacy */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-50 dark:border-gray-800 mt-2">
                    <Link
                      href="/terms-of-service"
                      className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      Terms of Use
                    </Link>
                    <Link
                      href="/privacy-policy"
                      className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800 mt-2">
                    <div className="flex gap-2">
                      {(["en", "es"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          className={`px-4 py-2 text-sm rounded-xl font-semibold transition-colors ${
                            language === lang
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {lang === "en" ? "EN 🇺🇸" : "ES 🇪🇸"}
                        </button>
                      ))}
                    </div>
                    {mounted && (
                      <button
                        type="button"
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        aria-label="Toggle theme"
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
                      >
                        {theme === "dark" ? (
                          <Sun size={16} />
                        ) : (
                          <Moon size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModalManager
        isModalOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView="signIn"
      />
    </>
  );
};

export default NavBar;
