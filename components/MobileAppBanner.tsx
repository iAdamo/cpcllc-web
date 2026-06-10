"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const DISMISSED_KEY = "app-banner-dismissed";

// Deep-link scheme for the native app
const APP_SCHEME = "companiescenter";

// Map web paths to native deep-link paths
function getDeepLink(pathname: string): string {
  if (pathname.startsWith("/providers/")) {
    const id = pathname.split("/providers/")[1];
    return `${APP_SCHEME}://provider/${id}`;
  }
  if (pathname === "/providers") return `${APP_SCHEME}://providers`;
  if (pathname === "/profile") return `${APP_SCHEME}://profile`;
  if (pathname === "/home") return `${APP_SCHEME}://home`;
  if (pathname === "/tasks") return `${APP_SCHEME}://tasks`;
  if (pathname === "/settings") return `${APP_SCHEME}://settings`;
  return `${APP_SCHEME}://home`;
}

// Pages where "Open in app" makes contextual sense
const DEEP_LINK_PAGES = ["/providers", "/profile", "/home", "/tasks", "/settings"];
function shouldShowDeepLink(pathname: string) {
  return DEEP_LINK_PAGES.some((p) => pathname === p || pathname.startsWith("/providers/"));
}

export default function MobileAppBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    if (window.innerWidth < 768) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  const showDeepLink = shouldShowDeepLink(pathname);
  const deepLink = getDeepLink(pathname);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
        >
          <div className="bg-white border-t border-gray-100 shadow-2xl">
            {/* Open in app — page-specific, shown only on relevant routes */}
            {showDeepLink && (
              <div className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-between gap-3">
                <p className="text-white text-xs font-semibold truncate">
                  View this page in the app for a better experience
                </p>
                <a
                  href={deepLink}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-white text-blue-700 text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap"
                >
                  <ExternalLink size={11} />
                  Open in app
                </a>
              </div>
            )}

            {/* Store badges row */}
            <div className="px-4 py-3 flex items-center gap-3">
              {/* App icon */}
              <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  src="/assets/logo-color.png"
                  alt="App icon"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  CompaniesCenterLLC
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Get the full experience on mobile
                </p>
              </div>

              {/* Store buttons */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <a
                  href="https://apps.apple.com/us/app/companiescenter/id6475066332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap"
                  aria-label="Download on App Store"
                >
                  {/* Apple glyph */}
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.companiescenterllc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded-lg whitespace-nowrap"
                  aria-label="Get it on Google Play"
                >
                  {/* Play glyph */}
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden="true">
                    <path d="M3 20.5v-17c0-.83 1-.97 1.45-.42l13 8.5c.4.26.4.58 0 .84l-13 8.5C3.97 21.47 3 21.33 3 20.5z" />
                  </svg>
                  Google Play
                </a>
              </div>

              {/* Dismiss */}
              <button
                type="button"
                aria-label="Dismiss banner"
                onClick={dismiss}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
