"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, Star, MapPin } from "lucide-react";
import { getPlatformStats, type PublicStatItem } from "@/axios/stats";

// How each real stat is labelled + formatted when it clears the display floor.
const STAT_META: Record<
  PublicStatItem["key"],
  { label: string; format: (v: number) => string }
> = {
  verifiedProviders: { label: "Verified providers", format: (v) => `${v.toLocaleString()}+` },
  servicesCompleted: { label: "Services completed", format: (v) => `${v.toLocaleString()}+` },
  reviews: { label: "Verified reviews", format: (v) => `${v.toLocaleString()}+` },
  avgRating: { label: "Average rating", format: (v) => v.toFixed(1) },
  countriesCovered: { label: "Countries served", format: (v) => String(v) },
};

// Honest-by-construction trust tiles. Do NOT put usage numbers here until
// they're real — fabricated "jobs completed" counters are FTC territory.
// When real metrics exist, reintroduce the animated counters from git
// history (StatsSection pre-2026-07 revision).
const pillars = [
  {
    Icon: ShieldCheck,
    label: "Verified Providers",
    line: "Every company is identity-checked before it can take jobs.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    Icon: Star,
    label: "Reviews You Can Trust",
    line: "Ratings come only from clients on completed jobs.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    Icon: MessageSquare,
    label: "Direct Messaging",
    line: "Chat with providers in real time — no middlemen, no fees.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    Icon: MapPin,
    label: "Local First",
    line: "Search by neighborhood and hire professionals near you.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function StatsSection() {
  // Real, floor-filtered platform numbers. Empty until they're worth showing.
  const [stats, setStats] = useState<PublicStatItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPlatformStats()
      .then((s) => !cancelled && setStats(s.meaningful ?? []))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 bg-[#040c24] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">
            Why Companies Center
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            A Service Network
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Built on Trust
            </span>
          </h2>
        </motion.div>

        {/* Real numbers — shown only when they clear the display floor. */}
        {stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-14">
            {stats.map((s) => (
              <div key={s.key} className="text-center">
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {STAT_META[s.key].format(s.value)}
                </p>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mt-1">
                  {STAT_META[s.key].label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pillars.map(({ Icon, label, line, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
            >
              <div
                className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
              >
                <Icon size={22} className={color} />
              </div>
              <p className="text-white font-black text-lg mb-1.5">{label}</p>
              <p className="text-white/50 text-sm leading-relaxed">{line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
