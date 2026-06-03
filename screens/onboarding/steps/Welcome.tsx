"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/stores";

const FEATURES = [
  { icon: ShieldCheck, label: "Background-checked professionals" },
  { icon: Star, label: "Real reviews & verified ratings" },
  { icon: Zap, label: "Fast local matches, same day" },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Welcome({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const { isAuthenticated, resetOnboarding } = useGlobalStore();

  const handleStart = () => {
    resetOnboarding();
    onNext();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden px-6">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] bg-blue-900/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-lg w-full text-center space-y-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 text-xs font-semibold">
              Your #1 Home Service Network
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Build your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              presence.
            </span>
            <br />
            Find the{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              best.
            </span>
          </h1>

          <p className="text-white/50 text-lg leading-relaxed max-w-sm mx-auto pt-2">
            Connect with verified service professionals across Florida — fast,
            local, and trusted.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-white/8 border border-white/12 px-4 py-2.5 rounded-xl"
            >
              <Icon size={14} className="text-blue-400 shrink-0" />
              <span className="text-white/70 text-xs font-medium whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="space-y-4"
        >
          <button
            type="button"
            onClick={handleStart}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black rounded-2xl text-base transition-all duration-200 shadow-2xl shadow-blue-600/40"
          >
            Get Started
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {!isAuthenticated && (
            <p className="text-white/40 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-2 hover:underline transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
