"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle, ArrowRight, Shield, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: easeOut } }),
};

const tags = ["Plumbing", "HVAC", "Electrical", "Cleaning", "Roofing", "Painting"];

const trustBadges = [
  { Icon: Shield, label: "Background Checked" },
  { Icon: CheckCircle, label: "Licensed & Insured" },
  { Icon: Clock, label: "Fast Response" },
];

export default function HeroSection() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const search = () => {
    const p = new URLSearchParams();
    if (service) p.set("q", service);
    if (location) p.set("location", location);
    router.push(`/providers?${p.toString()}`);
  };

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
                Florida&apos;s #1 Home Service Network
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
              Connect with 500+ background-checked professionals across Florida.
              Fast quotes, real reviews, verified credentials.
            </motion.p>

            {/* Search bar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="flex flex-col sm:flex-row max-w-xl bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden"
            >
              <div className="flex items-center flex-1 px-5 py-4 sm:border-r border-b sm:border-b-0 border-gray-100">
                <Search className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                    What
                  </span>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder="Plumbing, HVAC, Electrical…"
                    className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="flex items-center flex-1 px-5 py-4">
                <MapPin className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">
                    Where
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder="Tampa, Florida"
                    className="text-gray-900 placeholder-gray-300 font-medium text-sm bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="p-2.5">
                <button
                  type="button"
                  onClick={search}
                  className="w-full sm:w-auto h-full px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-lg shadow-blue-500/30"
                >
                  <Search size={15} />
                  Search
                </button>
              </div>
            </motion.div>

            {/* Popular tags */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.5}
              className="flex flex-wrap items-center gap-2 mt-5"
            >
              <span className="text-white/35 text-sm">Popular:</span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setService(tag); router.push(`/providers?q=${tag}`); }}
                  className="text-white/70 text-sm bg-white/8 hover:bg-white/15 px-3.5 py-1.5 rounded-full border border-white/12 transition-colors"
                >
                  {tag}
                </button>
              ))}
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
                  <span className="text-white/55 text-sm font-medium">{label}</span>
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
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Map Preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
