"use client";

import { motion } from "framer-motion";
import { Search, Star, CheckCircle, MessageCircle } from "lucide-react";

const steps = [
  {
    Icon: Search,
    step: "01",
    title: "Search & Discover",
    desc: "Enter your service type and city to instantly browse hundreds of verified professionals in your area.",
    color: "from-blue-600 to-blue-700",
    glow: "shadow-blue-500/30",
  },
  {
    Icon: Star,
    step: "02",
    title: "Compare & Choose",
    desc: "Read real reviews, compare ratings, view portfolios, and check credentials to find your perfect match.",
    color: "from-violet-600 to-violet-700",
    glow: "shadow-violet-500/30",
  },
  {
    Icon: MessageCircle,
    step: "03",
    title: "Connect Directly",
    desc: "Contact your chosen provider directly through our platform. No middlemen, no hidden fees.",
    color: "from-emerald-600 to-emerald-700",
    glow: "shadow-emerald-500/30",
  },
  {
    Icon: CheckCircle,
    step: "04",
    title: "Job Done Right",
    desc: "Get the job done with confidence. Every provider is background-checked and quality-guaranteed.",
    color: "from-orange-500 to-orange-600",
    glow: "shadow-orange-500/30",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#03071a] relative overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      {/* Glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/8 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-20"
        >
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-3">
            How It Works
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Simple. Fast. Reliable.
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-lg mx-auto">
            Four easy steps to connect with the right professional for any home service.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+48px)] right-[calc(12.5%+48px)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-violet-600 via-emerald-600 to-orange-500 opacity-30" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-violet-400 via-emerald-400 to-orange-400"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {steps.map(({ Icon, step, title, desc, color, glow }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center md:items-start text-center md:text-left p-8 bg-white/[0.04] hover:bg-white/[0.07] border border-white/8 rounded-3xl transition-all duration-200 group"
            >
              {/* Step icon */}
              <div className="relative mb-7 flex-shrink-0">
                <div className={`w-[72px] h-[72px] bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-xl ${glow} group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={28} className="text-white" />
                </div>
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[11px] font-black text-white/60">
                  {step}
                </div>
              </div>

              <h3 className="text-white font-black text-xl mb-3">{title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
