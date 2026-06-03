"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Shield, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import UniversalSearch from "@/components/UniversalSearch";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: easeOut },
  }),
};

const trustBadges = [
  { Icon: Shield, label: "Background Checked" },
  { Icon: CheckCircle, label: "Licensed & Insured" },
  { Icon: Clock, label: "Fast Response" },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.04] hero-grid" />

      {/* Gradient blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 w-full pt-28 md:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Content ── */}
          <div>
            {/* Trust badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full mb-8 w-fit"
            >
              <motion.div
                className="w-2 h-2 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-white/85 text-sm font-medium">
                Your&apos;s #1 Home Service Network
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="text-5xl md:text-[68px] font-black text-white leading-[1.02] tracking-tight mb-6"
            >
              Find Trusted
              <br />
              Home Service
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Pros Near You.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.3}
              className="text-white/55 text-lg max-w-lg leading-relaxed mb-10"
            >
              Connect with 500+ background-checked professionals across your location.
              Fast quotes, real reviews, verified credentials.
            </motion.p>

            {/* Universal search — hero variant (includes popular tags) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
            >
              <UniversalSearch variant="hero" />
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.6}
              className="flex flex-wrap items-center gap-5 mt-9"
            >
              {trustBadges.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Icon size={13} className="text-emerald-400" />
                  </div>
                  <span className="text-white/55 text-sm font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Browse CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.7}
              className="mt-8"
            >
              <button
                type="button"
                onClick={() => router.push("/providers")}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors group"
              >
                Browse all providers
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Map Preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
            className="hidden lg:block h-[560px] relative"
          >
            <MapPreview />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
    </section>
  );
}
