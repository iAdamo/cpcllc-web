"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/stores";

export default function Completion() {
  const router = useRouter();
  const {
    onboardingData,
    submitOnboarding,
    resetOnboarding,
    isLoading,
    error,
  } = useGlobalStore();

  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  const isProvider = onboardingData.role === "Provider";
  const name = onboardingData.firstName || "there";

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const ok = await submitOnboarding();
      if (cancelled) return;
      if (ok) {
        setSubmitted(true);
        router.replace("/jobs");
      } else {
        setFailed(true);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToDashboard = () => {
    resetOnboarding();
    router.replace("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full">
        {/* Loading state */}
        {!submitted && !failed && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Loader2 size={32} className="text-blue-400 animate-spin" />
            </div>
            <div>
              <p className="text-white font-black text-2xl mb-2">
                Setting everything up…
              </p>
              <p className="text-blue-200/60 text-sm">
                Creating your profile, just a moment.
              </p>
            </div>
          </motion.div>
        )}

        {/* Success state */}
        {submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.1,
              }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CheckCircle size={44} className="text-white" strokeWidth={2} />
              </div>
              {/* Sparkle ring */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <motion.div
                  key={deg}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                  transition={{ delay: 0.3 + deg / 2000, duration: 0.8 }}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateY(-52px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                {isProvider ? "Provider Profile Created" : "Account Ready"}
              </p>
              <h1 className="text-4xl font-black text-white leading-tight mb-3">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {name}!
                </span>
              </h1>
              <p className="text-blue-200/70 text-sm leading-relaxed">
                {isProvider
                  ? "Your provider profile is live. Clients in your area can now find and book you."
                  : "Your account is all set. Browse verified professionals and book your first service."}
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full grid grid-cols-1 gap-2.5 mt-1"
            >
              {(isProvider
                ? [
                    "Your profile is searchable by local clients",
                    "Manage bookings from your dashboard",
                    "Respond to enquiries and grow your business",
                  ]
                : [
                    "Search 500+ verified professionals near you",
                    "Compare quotes, reviews, and availability",
                    "Book same-day appointments with ease",
                  ]
              ).map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <Sparkles size={14} className="text-blue-400 shrink-0" />
                  <span className="text-sm text-white/80 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.button
              type="button"
              onClick={handleGoToDashboard}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 w-full flex items-center justify-center gap-2 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 font-black text-sm rounded-2xl shadow-2xl shadow-black/20 transition-colors"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* Error state */}
        {failed && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
            <div>
              <p className="text-white font-black text-2xl mb-2">
                Something went wrong
              </p>
              <p className="text-blue-200/60 text-sm">
                {error ?? "We couldn't save your profile. Please try again."}
              </p>
            </div>
            <div className="flex flew-row gap-4">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="flex items-center gap-2 px-8 py-3.5 bg-gray-700 hover:bg-gray-600 text-white font-black text-sm rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={async () => {
                  setFailed(false);
                  const ok = await submitOnboarding();
                  if (ok) setSubmitted(true);
                  else setFailed(true);
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-black text-sm rounded-xl transition-colors disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  "Try Again"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
