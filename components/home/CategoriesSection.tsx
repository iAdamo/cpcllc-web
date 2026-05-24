"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  cleaning, electrical, hvac, painting, pestcontrol,
  plumbing, roofing, poolservice, solar, moving,
  security, appliance_repair, capentry, flooring, handyman,
} from "@/public/assets/icons";

const categories = [
  { title: "Plumbing", image: plumbing, bg: "bg-blue-50", accent: "group-hover:bg-blue-600", count: "120+" },
  { title: "Electrical", image: electrical, bg: "bg-yellow-50", accent: "group-hover:bg-yellow-500", count: "95+" },
  { title: "Cleaning", image: cleaning, bg: "bg-green-50", accent: "group-hover:bg-green-600", count: "200+" },
  { title: "HVAC", image: hvac, bg: "bg-cyan-50", accent: "group-hover:bg-cyan-600", count: "80+" },
  { title: "Painting", image: painting, bg: "bg-purple-50", accent: "group-hover:bg-purple-600", count: "60+" },
  { title: "Pest Control", image: pestcontrol, bg: "bg-red-50", accent: "group-hover:bg-red-500", count: "45+" },
  { title: "Roofing", image: roofing, bg: "bg-orange-50", accent: "group-hover:bg-orange-500", count: "70+" },
  { title: "Pool Service", image: poolservice, bg: "bg-sky-50", accent: "group-hover:bg-sky-500", count: "55+" },
  { title: "Solar", image: solar, bg: "bg-amber-50", accent: "group-hover:bg-amber-500", count: "30+" },
  { title: "Moving", image: moving, bg: "bg-indigo-50", accent: "group-hover:bg-indigo-600", count: "85+" },
  { title: "Security", image: security, bg: "bg-slate-50", accent: "group-hover:bg-slate-700", count: "40+" },
  { title: "Appliance Repair", image: appliance_repair, bg: "bg-teal-50", accent: "group-hover:bg-teal-600", count: "65+" },
  { title: "Carpentry", image: capentry, bg: "bg-stone-50", accent: "group-hover:bg-stone-600", count: "50+" },
  { title: "Flooring", image: flooring, bg: "bg-lime-50", accent: "group-hover:bg-lime-600", count: "55+" },
  { title: "Handyman", image: handyman, bg: "bg-rose-50", accent: "group-hover:bg-rose-500", count: "110+" },
];

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export default function CategoriesSection() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">
              Browse by Category
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              What do you need
              <br className="hidden md:block" /> help with?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/companies/home-services")}
            className="hidden md:flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline group"
          >
            View all
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3"
        >
          {categories.map(({ title, image, bg, count }) => (
            <motion.button
              key={title}
              variants={itemVariants}
              type="button"
              onClick={() => router.push(`/providers?category=${encodeURIComponent(title)}`)}
              className="group flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-250 cursor-pointer"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 ${bg} rounded-xl flex items-center justify-center transition-colors duration-200`}>
                <Image src={image} alt={title} width={32} height={32} className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 text-center leading-tight">
                {title}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">{count}</span>
            </motion.button>
          ))}

          {/* More button */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => router.push("/companies/home-services")}
            className="group flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <ArrowRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-white">More</span>
            <span className="text-[9px] text-white/60 font-medium">50+</span>
          </motion.button>
        </motion.div>

        {/* Mobile see all */}
        <div className="mt-8 flex justify-center md:hidden">
          <button
            type="button"
            onClick={() => router.push("/companies/home-services")}
            className="flex items-center gap-2 px-7 py-3 border border-blue-600 text-blue-600 font-bold rounded-xl text-sm"
          >
            View all categories <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
