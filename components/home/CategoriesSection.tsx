"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getAllCategoriesWithSubcategories } from "@/axios/service";
import { getCategoryIcon, CATEGORY_TONES } from "@/lib/categoryIcon";

// Shown only if the API returns nothing (or errors), so the section never
// renders empty. These mirror the platform's core taxonomy.
const FALLBACK_CATEGORIES = [
  "Plumbing", "Electrical", "Cleaning", "HVAC", "Painting", "Pest Control",
  "Roofing", "Pool Service", "Solar", "Moving", "Security", "Appliance Repair",
  "Carpentry", "Flooring", "Handyman",
];

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];
const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export default function CategoriesSection() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);

  // Real categories from the (now public) backend catalogue. Falls back to the
  // static list on empty/error so the homepage is never blank.
  useEffect(() => {
    let cancelled = false;
    getAllCategoriesWithSubcategories()
      .then((cats) => {
        const names = (cats ?? [])
          .map((c) => c?.name)
          .filter((n): n is string => !!n);
        if (!cancelled && names.length) setCategories(names);
      })
      .catch(() => {
        /* keep the fallback list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = categories.slice(0, 15);

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
            onClick={() => router.push("/providers")}
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
          {shown.map((title, i) => {
            const Icon = getCategoryIcon(title);
            const tone = CATEGORY_TONES[i % CATEGORY_TONES.length];
            return (
              <motion.button
                key={title}
                variants={itemVariants}
                type="button"
                onClick={() => router.push(`/providers?q=${encodeURIComponent(title)}`)}
                className="group flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-250 cursor-pointer"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 ${tone} dark:bg-gray-800 rounded-xl flex items-center justify-center transition-colors duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {title}
                </span>
              </motion.button>
            );
          })}

          {/* More button */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => router.push("/providers")}
            className="group flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-2xl transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <ArrowRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-white">More</span>
          </motion.button>
        </motion.div>

        {/* Mobile see all */}
        <div className="mt-8 flex justify-center md:hidden">
          <button
            type="button"
            onClick={() => router.push("/providers")}
            className="flex items-center gap-2 px-7 py-3 border border-blue-600 text-blue-600 font-bold rounded-xl text-sm"
          >
            View all categories <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
