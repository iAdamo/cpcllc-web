"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Smartphone, Monitor } from "lucide-react";
import { LEGAL_PAGES } from "@/lib/legalPages";
import { AppStoreButtons, useStoreLinks } from "@/components/AppStoreButtons";
import { SHARE_PAGES } from "@/lib/sharePages";

// Pages that work normally on mobile (public / no-login required)
const PUBLIC_PATHS = [
  "/",
  ...LEGAL_PAGES,
  "/providers",
  "/clients",
  "/onboarding",
  ...SHARE_PAGES,
  "/settings/account-control/deletion",
  "/admin",
  "/auth/signin",
  "/auth/reset-password",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/auth/terms",
  "/admin/mfa/verify",
  "/i",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export default function MobileGate() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { appStore, googlePlay } = useStoreLinks();

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
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-50 to-brand-50 dark:from-gray-950 dark:to-gray-900"
      style={{ pointerEvents: "all" }}
    >
      {/* App icon */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center shadow-xl mb-6">
        <Smartphone size={36} className="text-white" />
      </div>

      <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
        Better on the app
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed max-w-xs mb-8">
        This page is optimised for desktop. Download the Companies Center app
        for the best mobile experience.
      </p>

      {/* Store buttons only for stores the app is live in (Admin > Settings >
          App release). Regression: both buttons linked to "#". */}
      {appStore || googlePlay ? (
        <AppStoreButtons className="flex-col w-full max-w-xs mb-8 [&>a]:h-14" />
      ) : (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center mb-8">
          The app is coming soon to the App Store and Google Play.
        </p>
      )}

      {/* Desktop hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <Monitor size={13} />
        <span>Switch to desktop to continue here</span>
      </div>
    </div>
  );
}
