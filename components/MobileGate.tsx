"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Smartphone, Monitor } from "lucide-react";

// Pages that work normally on mobile (public / no-login required)
const PUBLIC_PATHS = [
  "/",
  "/privacy-policy",
  "/terms-of-service",
  "/providers",
  "/jobs",
  "/settings/account-control/deletion",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default function MobileGate() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted || !isMobile || isPublic(pathname)) return null;

  return (
    <div
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900"
      style={{ pointerEvents: "all" }}
    >
      {/* App icon */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl mb-6">
        <Smartphone size={36} className="text-white" />
      </div>

      <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
        Better on the app
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed max-w-xs mb-8">
        This page is optimised for desktop. Download the Companies Center app
        for the best mobile experience.
      </p>

      {/* App store badges */}
      <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
        <a
          href="#"
          className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm shadow-lg active:scale-[0.97] transition-transform"
          aria-label="Download on the App Store"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.35 2.77M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Download on App Store
        </a>

        <a
          href="#"
          className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm shadow-lg active:scale-[0.97] transition-transform"
          aria-label="Get it on Google Play"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
            <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
          </svg>
          Get it on Google Play
        </a>
      </div>

      {/* Desktop hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <Monitor size={13} />
        <span>Switch to desktop to continue here</span>
      </div>
    </div>
  );
}
