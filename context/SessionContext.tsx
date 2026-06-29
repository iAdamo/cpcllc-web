"use client";

import {
  createContext,
  use,
  useContext,
  useEffect,
  useRef,
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
  "/admin",
  "/auth/signin",
  "/auth/forgot-password",
  "/auth/reset-password",
  // "/auth/verify-email",
  "/admin/mfa/verify",
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

  /**
   * Returns the canonical "home" page for a given activeRole.
   * Clients land on /providers (browse providers to hire).
   * Providers land on /tasks (browse client-posted tasks to bid on).
   * Admins land on /admin.
   */
  const homeForRole = (role?: string): string | null => {
    if (role === "Admin") return "/admin";
    if (role === "Provider") return "/tasks";
    if (role === "Client") return "/providers";
    return null;
  };

  /**
   * Redirect unauthenticated users away from protected routes,
   * and immediately bounce a signed-in user to their role's home page
   * whenever they're on the "wrong" role's page or on `/`.
   */
  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      const home = homeForRole(user?.activeRole);
      // Mismatched-role pages → kick to own home
      if (user?.activeRole === "Provider" && pathname === "/providers") {
        router.replace("/tasks");
        return;
      }
      if (user?.activeRole === "Client" && pathname === "/tasks") {
        // Client viewing /tasks is fine — that's their own task list.
      }
      if (
        user?.activeRole === "Admin" &&
        pathname !== "/admin" &&
        !isPublic(pathname)
      ) {
        router.replace("/admin");
        return;
      }
      // Landing at "/" → send to role home
      if (pathname === "/" && home) {
        router.replace(home);
        return;
      }
    }
    if (!isAuthenticated && !isPublic(pathname)) {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, pathname, router, user]);

  /**
   * Whenever activeRole flips mid-session (e.g. ProfileMenu's
   * "Switch to Provider"), immediately bounce them to that role's canonical
   * home. Initial role hydration does NOT count as a flip — landing-page
   * routing is handled by the main effect above.
   */
  const activeRole = user?.activeRole;
  const prevRoleRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    const prev = prevRoleRef.current;
    prevRoleRef.current = activeRole;
    if (prev === undefined || prev === activeRole) return;
    const home = homeForRole(activeRole);
    if (home) router.replace(home);
  }, [activeRole, hydrated, isAuthenticated, router]);

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
