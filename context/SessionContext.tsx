"use client";

import {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useGlobalStore from "@/stores";
import { UserData } from "@/types";

// ─── Context ──────────────────────────────────────────────────────────────────

interface SessionContextValue {
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

// ─── Route guards ─────────────────────────────────────────────────────────────

const PUBLIC_EXACT = [
  "/",
  "/onboarding",
  "/privacy-policy",
  "/terms-of-service",
];
const PUBLIC_PREFIX = ["/providers", "/admin", "/cpc", "/profile"];

function isPublic(path: string) {
  if (PUBLIC_EXACT.includes(path)) return true;
  return PUBLIC_PREFIX.some((p) => path.startsWith(p));
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center select-none">
      {/* Top progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 0.6, 0.8, 1] }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-violet-500 to-indigo-600 origin-left"
      />

      {/* Brand orb */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-28 h-28 rounded-full bg-blue-400/30 blur-xl"
        />

        {/* Logo mark */}
        <motion.div
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-400/40 flex items-center justify-center"
        >
          <span className="text-white font-black text-[2rem] leading-none tracking-tighter select-none">
            C
          </span>
        </motion.div>

        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="absolute w-[6.5rem] h-[6.5rem]"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/60"
          />
        </motion.div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -9, 0], opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 0.85,
              repeat: Infinity,
              delay: i * 0.16,
              ease: "easeInOut",
            }}
            className="block w-2 h-2 rounded-full bg-blue-500"
          />
        ))}
      </div>

      <p className="mt-5 text-[11px] font-semibold text-gray-400 tracking-[0.22em] uppercase">
        Companies Center
      </p>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SessionProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated, onboardingStep, setOnboardingStep } =
    useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();

  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand persist to rehydrate from localStorage
  useEffect(() => {
    if (useGlobalStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useGlobalStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (pathname === "/" && onboardingStep > 0) {
      setOnboardingStep(0);
    }
  }, [pathname, onboardingStep, setOnboardingStep, hydrated]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!hydrated) return;
    if (user?.activeRole === "Provider" && pathname === "/providers") {
      router.replace("/jobs");
      return;
    } else if (user?.activeRole === "Client" && pathname === "/jobs") {
      router.replace("/providers");
      return;
    } else if (user?.activeRole === "Admin" && pathname !== "/admin") {
      router.replace("/admin");
      return;
    }
    if (isAuthenticated && pathname === "/") {
      if (user?.activeRole === "Admin") {
        router.replace("/admin");
        return;
      } else if (user?.activeRole === "Provider") {
        router.replace("/jobs");
        return;
      } else if (user?.activeRole === "Client") {
        router.replace("/providers");
      }
    }
    if (!isAuthenticated && !isPublic(pathname)) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, pathname, router, user]);

  // Synchronously derived — no async state, no stuck loader
  const needsRedirect = hydrated && !isAuthenticated && !isPublic(pathname);
  const showLoader = !hydrated || needsRedirect;

  return (
    <SessionContext.Provider value={{ isLoading: showLoader }}>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="session-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {!showLoader && children}
    </SessionContext.Provider>
  );
}
