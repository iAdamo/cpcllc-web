"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGlobalStore from "@/stores";
import { useRouter } from "next/navigation";

import Welcome from "./steps/Welcome";
import RoleSelect from "./steps/RoleSelect";
import ProfileBasics from "./steps/ProfileBasics";
import CompanyIdentity from "./steps/CompanyIdentity";
import Services from "./steps/Services";
import LocationContact from "./steps/LocationContact";
import Gallery from "./steps/Gallery";
import Completion from "./steps/Completion";

const PROVIDER_STEPS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const CLIENT_STEPS = [0, 1, 2, 7] as const;
type Step = (typeof PROVIDER_STEPS)[number];

function getNextStep(step: number, role?: string): number {
  const steps: readonly number[] =
    role === "Provider" ? PROVIDER_STEPS : CLIENT_STEPS;
  const idx = steps.indexOf(step);
  return idx !== -1 && idx < steps.length - 1 ? steps[idx + 1] : step;
}

function getPrevStep(step: number, role?: string): number {
  const steps: readonly number[] =
    role === "Provider" ? PROVIDER_STEPS : CLIENT_STEPS;
  const idx = steps.indexOf(step);
  return idx > 0 ? steps[idx - 1] : step;
}

function getProgressInfo(step: number, role?: string) {
  const inner = (role === "Provider" ? PROVIDER_STEPS : CLIENT_STEPS).filter(
    (s) => s !== 0 && s !== 7
  );
  const current = inner.indexOf(step as Step) + 1;
  return { current: Math.max(current, 0), total: inner.length };
}

const LEFT_CONTENT: Record<
  number,
  { headline: string; sub: string; badge?: string }
> = {
  1: {
    headline: "Join 500+ verified\nprofessionals.",
    sub: "Whether you're looking for help or ready to offer your skills, CompaniesCenterLLC connects the right people.",
    badge: "Trusted across many countries",
  },
  2: {
    headline: "Your profile is your\nfirst impression.",
    sub: "A complete profile gets up to 3× more enquiries. Take 60 seconds to make it count.",
    badge: "3× more client reach",
  },
  3: {
    headline: "Stand out from\nthe crowd.",
    sub: "Providers with a complete company profile are featured first in search results.",
    badge: "Featured placement",
  },
  4: {
    headline: "Reach clients\nwho need you.",
    sub: "The right service tags mean you show up in exactly the searches that matter to you.",
    badge: "Precision matching",
  },
  5: {
    headline: "Make it easy\nto find you.",
    sub: "Clients search by location. Accurate contact details turn searches into real calls.",
    badge: "Location-aware discovery",
  },
  6: {
    headline: "A picture is worth\na thousand words.",
    sub: "Providers with 4+ photos get significantly more enquiries. Show off your best work.",
    badge: "4× more engagement",
  },
};

export default function Onboarding() {
  const { onboardingStep, onboardingData, setOnboardingStep } =
    useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    // If user somehow got here without selecting a role, send them back to the start
    if (onboardingStep > 1 && !onboardingData.role) {
      setOnboardingStep(0);
    }
  }, [onboardingStep, onboardingData.role, setOnboardingStep]);

  const prevRef = useRef(onboardingStep);
  const direction = onboardingStep >= prevRef.current ? 1 : -1;
  useEffect(() => {
    prevRef.current = onboardingStep;
  }, [onboardingStep]);

  const role = onboardingData?.role;
  const goNext = () => {
    const r = useGlobalStore.getState().onboardingData.role;
    setOnboardingStep(getNextStep(onboardingStep, r));
  };
  const goBack = () => {
    const r = useGlobalStore.getState().onboardingData.role;
    setOnboardingStep(getPrevStep(onboardingStep, r));
  };

  const { current: progCurrent, total: progTotal } = getProgressInfo(
    onboardingStep,
    role
  );

  const isFullScreen = onboardingStep === 0 || onboardingStep === 7;
  const lc = LEFT_CONTENT[onboardingStep];

  const slideVariants = {
    enter: (d: number) => ({ x: d * 56, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -56, opacity: 0 }),
  };

  const panel = (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={onboardingStep}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full"
      >
        {onboardingStep === 0 && <Welcome onNext={goNext} />}
        {onboardingStep === 1 && <RoleSelect onNext={goNext} onBack={goBack} />}
        {onboardingStep === 2 && (
          <ProfileBasics onNext={goNext} onBack={goBack} />
        )}
        {onboardingStep === 3 && (
          <CompanyIdentity onNext={goNext} onBack={goBack} />
        )}
        {onboardingStep === 4 && <Services onNext={goNext} onBack={goBack} />}
        {onboardingStep === 5 && (
          <LocationContact onNext={goNext} onBack={goBack} />
        )}
        {onboardingStep === 6 && <Gallery onNext={goNext} onBack={goBack} />}
        {onboardingStep === 7 && <Completion />}
      </motion.div>
    </AnimatePresence>
  );

  if (isFullScreen) {
    return <div className="fixed inset-0 z-50 overflow-hidden">{panel}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-white">
      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[38%] flex-shrink-0 flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-10 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <button
          type="button"
          onClick={() => router.replace("/")}
          className="relative z-10 text-start text-white font-black text-xl tracking-tight"
        >
          Companies<span className="text-blue-400">Center</span>
        </button>

        {/* Contextual message */}
        <AnimatePresence mode="wait">
          {lc && (
            <motion.div
              key={onboardingStep}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 space-y-5"
            >
              <h2 className="text-[2rem] font-black text-white leading-tight whitespace-pre-line">
                {lc.headline}
              </h2>
              <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">
                {lc.sub}
              </p>
              {lc.badge && (
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-white/80 text-xs font-semibold">
                    {lc.badge}
                  </span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress pills */}
        <div className="relative z-10 flex items-center gap-1.5">
          {Array.from({ length: progTotal }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i < progCurrent
                  ? "w-6 h-1.5 bg-blue-400"
                  : i === progCurrent - 1
                  ? "w-8 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>
      </aside>

      {/* ── Right content panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <span className="font-black text-lg text-gray-900">
            Companies<span className="text-blue-600">Center</span>
          </span>
          {progTotal > 0 && (
            <span className="text-xs font-semibold text-gray-400 tabular-nums">
              {progCurrent} / {progTotal}
            </span>
          )}
        </div>

        {/* Mobile progress bar */}
        {progTotal > 0 && (
          <div className="lg:hidden h-0.5 bg-gray-100 shrink-0">
            <motion.div
              className="h-full bg-blue-600 origin-left"
              animate={{ scaleX: progCurrent / progTotal }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{panel}</div>
      </div>
    </div>
  );
}
