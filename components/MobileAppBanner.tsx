"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { APP_HOME, appLink } from "@/lib/sharePages";
import { AppStoreButtons, useStoreLinks } from "@/components/AppStoreButtons";

const DISMISSED_KEY = "app-banner-dismissed";

/**
 * "Get the app" on phones (the providers list). Shown only once the app is
 * live in a store (Admin > Settings > App release): before that its buttons
 * led to store pages that don't exist. "Open in app" opens the app's home
 * through the app's own scheme. Regression: it built links by hand with the
 * wrong scheme (companiescenter://) and app paths that don't exist.
 */
export default function MobileAppBanner() {
  const [visible, setVisible] = useState(false);
  const { appStore, googlePlay } = useStoreLinks();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // storage blocked: show it, dismissal just won't stick
    }
    if (window.innerWidth < 768) setVisible(true);
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // storage blocked
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (appStore || googlePlay) && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
        >
          <div className="bg-white border-t border-gray-100 shadow-2xl">
            <div className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-600 flex items-center justify-between gap-3">
              <p className="text-white text-xs font-semibold truncate">Already have the app?</p>
              <a
                href={appLink(APP_HOME)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-white text-brand-700 text-xs font-black px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                <ExternalLink size={11} aria-hidden />
                Open in app
              </a>
            </div>

            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  src="/assets/logo-color.png"
                  alt=""
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900 leading-tight">CompaniesCenterLLC</p>
                <p className="text-xs text-gray-400 mt-0.5">Get the full experience on mobile</p>
              </div>
              <AppStoreButtons size="sm" className="flex-col flex-shrink-0" />
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
