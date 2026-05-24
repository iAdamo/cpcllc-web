"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, TrendingUp, Users, Star, DollarSign } from "lucide-react";
import { HomeCompany } from "@/public/assets/homepage";
import { useTranslation } from "@/context/TranslationContext";

const perks = [
  { Icon: TrendingUp, label: "Grow your client base instantly" },
  { Icon: Users, label: "Access thousands of homeowners" },
  { Icon: Star, label: "Build your verified reputation" },
  { Icon: DollarSign, label: "No commission on jobs" },
];

const dashboardStats = [
  { label: "New Leads", value: "24", trend: "+12%", color: "text-blue-600" },
  { label: "Rating", value: "4.9★", trend: "+0.2", color: "text-amber-500" },
  { label: "Revenue", value: "$8.4k", trend: "+18%", color: "text-emerald-600" },
];

export default function ForBusinessSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-0 md:min-h-[640px] flex items-center bg-[#03071a]">
      {/* Background image */}
      <Image src={HomeCompany} alt="For Companies" fill className="object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03071a]/98 via-[#0C1445]/95 to-[#0C1445]/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-4">
              {t("for_companies")}
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Grow Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Business
              </span>
              <br />
              With Us.
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-md">
              {t("for_companies_paragraph")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {perks.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 bg-white/5 rounded-xl border border-white/8">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <span className="text-white/75 text-sm font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 bg-white hover:bg-blue-50 text-[#0C1445] font-black text-base rounded-2xl transition-all hover:-translate-y-0.5 shadow-xl group"
              >
                {t("find_opportunities")}
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-white/8 hover:bg-white/15 text-white font-bold text-base rounded-2xl border border-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-xs font-medium">Provider Dashboard</p>
                  <p className="text-white font-black text-lg">Tampa Pro Plumbing</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold">Active</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dashboardStats.map(({ label, value, trend, color }) => (
                  <div key={label} className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className={`text-2xl font-black ${color} mb-0.5`}>{value}</p>
                    <p className="text-white/40 text-[10px] font-medium mb-1">{label}</p>
                    <p className="text-emerald-400 text-[10px] font-bold">{trend}</p>
                  </div>
                ))}
              </div>

              {/* Recent leads */}
              <div className="space-y-2.5">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.1em] mb-3">Recent Leads</p>
                {[
                  { name: "Sarah M.", service: "Pipe repair", time: "2 min ago", status: "New" },
                  { name: "James R.", service: "Water heater", time: "15 min ago", status: "Viewed" },
                  { name: "Lisa K.", service: "Drain cleaning", time: "1 hr ago", status: "Quoted" },
                ].map((lead) => (
                  <div key={lead.name} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-blue-600/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 text-[10px] font-black">{lead.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">{lead.name}</p>
                        <p className="text-white/40 text-[10px]">{lead.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                        lead.status === "Quoted" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-white/10 text-white/50"
                      }`}>{lead.status}</span>
                      <p className="text-white/30 text-[9px] mt-0.5">{lead.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
