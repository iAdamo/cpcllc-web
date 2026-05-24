"use client";

import { useState, useEffect, useRef } from "react";
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
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Bug,
  Home,
  Waves,
  SunMedium,
  Package,
  ShieldCheck,
  Settings,
  Hammer,
} from "lucide-react";
import { useTheme } from "next-themes";
import useGlobalStore from "@/stores";
import AuthModalManager from "@/screens/auth/AuthModalManager";
import ProfileMenu from "@/components/ProfileMenu";
import { useTranslation } from "@/context/TranslationContext";

const categories = [
  { label: "Plumbing", Icon: Droplets, href: "/providers?category=Plumbing", color: "text-blue-500 bg-blue-50" },
  { label: "Electrical", Icon: Zap, href: "/providers?category=Electrical", color: "text-yellow-500 bg-yellow-50" },
  { label: "HVAC", Icon: Wind, href: "/providers?category=HVAC", color: "text-cyan-500 bg-cyan-50" },
  { label: "Cleaning", Icon: Waves, href: "/providers?category=Cleaning", color: "text-green-500 bg-green-50" },
  { label: "Painting", Icon: Paintbrush, href: "/providers?category=Painting", color: "text-purple-500 bg-purple-50" },
  { label: "Pest Control", Icon: Bug, href: "/providers?category=Pest+Control", color: "text-red-500 bg-red-50" },
  { label: "Roofing", Icon: Home, href: "/providers?category=Roofing", color: "text-orange-500 bg-orange-50" },
  { label: "Solar", Icon: SunMedium, href: "/providers?category=Solar", color: "text-amber-500 bg-amber-50" },
  { label: "Moving", Icon: Package, href: "/providers?category=Moving", color: "text-indigo-500 bg-indigo-50" },
  { label: "Security", Icon: ShieldCheck, href: "/providers?category=Security", color: "text-slate-500 bg-slate-50" },
  { label: "Handyman", Icon: Wrench, href: "/providers?category=Handyman", color: "text-rose-500 bg-rose-50" },
  { label: "Appliances", Icon: Settings, href: "/providers?category=Appliance+Repair", color: "text-teal-500 bg-teal-50" },
  { label: "Carpentry", Icon: Hammer, href: "/providers?category=Carpentry", color: "text-stone-500 bg-stone-50" },
];

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const { user, logout, setSwitchRole } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
    setCatOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const transparent = isHome && !scrolled && !mobileOpen;

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("companies"), href: "/providers" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : "bg-white/96 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:bg-gray-950/96 dark:border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex flex-row gap-2 items-end">
              <Image
                src={transparent ? "/assets/logo-white.png" : "/assets/logo-color.png"}
                alt="CompaniesCenterLLC"
                width={60}
                height={60}
                priority
              />
              {/* <h1 className={`${transparent ? "text-white" : "text-brand-primary"} font-bold text-lg`} >CompaniesCenter</h1> */}
            </Link>

            {/* Desktop center links */}
            <div className="hidden md:flex items-center gap-1">
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

              {/* Categories mega dropdown */}
              <div ref={catRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCatOpen((v) => !v)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    transparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  } ${catOpen && !transparent ? "text-blue-600 bg-blue-50" : ""}`}
                >
                  Services
                  <motion.span animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-2 w-[480px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-30 p-4"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3 px-1">
                        Browse by Service
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {categories.map(({ label, Icon, href, color }) => (
                          <Link
                            key={label}
                            href={href}
                            onClick={() => setCatOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                              <Icon size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                              {label}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3">
                        <Link
                          href="/companies/home-services"
                          onClick={() => setCatOpen(false)}
                          className="flex items-center justify-center gap-2 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          View all categories →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-1.5">
              {/* Theme toggle */}
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    transparent
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}

              {/* Favorites */}
              {user && (
                <button
                  type="button"
                  onClick={() => router.push("/favorites")}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    transparent
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-label="Favorites"
                >
                  <Heart size={16} />
                </button>
              )}

              {/* Notifications */}
              {user && (
                <button
                  type="button"
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    transparent
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`}
                  aria-label="Notifications"
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
                          onClick={() => { setLanguage(lang); setLangOpen(false); }}
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

              {/* Divider */}
              <div className={`w-px h-5 mx-1 ${transparent ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700"}`} />

              {user ? (
                <ProfileMenu
                  options={[
                    ...(user?.activeRoleId
                      ? [
                          {
                            name: t("profile"),
                            onPress: () => {
                              setSwitchRole(user?.activeRole === "Client" ? "Provider" : "Client");
                              router.replace("/profile");
                            },
                          },
                          { name: t("membership"), onPress: () => router.replace("/profile") },
                        ]
                      : []),
                    { name: t("settings"), onPress: () => router.replace("/settings") },
                  ]}
                  offset={30}
                />
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
              className={`md:hidden p-2 rounded-lg transition-colors ${
                transparent
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

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

                {/* Mobile categories */}
                <div className="py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3">
                    Services
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {categories.slice(0, 9).map(({ label, Icon, href, color }) => (
                      <Link
                        key={label}
                        href={href}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-center"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                          <Icon size={15} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <button
                        type="button"
                        onClick={() => { router.push("/profile"); setMobileOpen(false); }}
                        className="w-full py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        {t("profile")}
                      </button>
                      <button
                        type="button"
                        onClick={async () => { await logout(); router.replace("/"); setMobileOpen(false); }}
                        className="w-full py-3.5 text-center font-semibold text-red-600 border border-red-100 rounded-xl"
                      >
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                        className="w-full py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl"
                      >
                        {t("logIn")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { router.push("/onboarding"); setMobileOpen(false); }}
                        className="w-full py-3.5 text-center font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl"
                      >
                        {t("getStarted")}
                      </button>
                    </>
                  )}

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
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
                        aria-label="Toggle theme"
                      >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
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
