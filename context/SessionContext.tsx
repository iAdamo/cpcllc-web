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
import { Spinner } from "@/components/ui/spinner";

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
  "/settings/account-control/deletion",
];
const PUBLIC_PREFIX = ["/providers", "/admin", "/profile"];

function isPublic(path: string) {
  if (PUBLIC_EXACT.includes(path)) return true;
  return PUBLIC_PREFIX.some((p) => path.startsWith(p));
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <Spinner
      size="small"
      className="h-fit p-4 justify-start items-start w-full"
    />
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
