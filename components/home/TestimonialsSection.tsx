"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Rodriguez",
    location: "Tampa, FL",
    service: "Plumbing",
    rating: 5,
    text: "Found an amazing plumber within minutes! He showed up on time, fixed the issue quickly, and the price was very fair. I'll never use anyone else again.",
    initials: "MR",
    color: "from-blue-600 to-blue-700",
  },
  {
    name: "James Thompson",
    location: "Clearwater, FL",
    service: "HVAC",
    rating: 5,
    text: "Our AC went out on a 95-degree day. Found a tech through CompaniesCenterLLC who came out same afternoon. Professional, fast, and reasonably priced. Lifesaver!",
    initials: "JT",
    color: "from-violet-600 to-violet-700",
  },
  {
    name: "Sarah Chen",
    location: "St. Petersburg, FL",
    service: "Cleaning",
    rating: 5,
    text: "The cleaning service I found is absolutely top-notch. Background checked, very professional, and my home has never looked better. Highly recommend!",
    initials: "SC",
    color: "from-emerald-600 to-emerald-700",
  },
  {
    name: "David Martinez",
    location: "Orlando, FL",
    service: "Electrical",
    rating: 5,
    text: "Needed some electrical work done urgently. The electrician was licensed, did perfect work, and explained everything clearly. Outstanding service platform.",
    initials: "DM",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Lisa Johnson",
    location: "Sarasota, FL",
    service: "Roofing",
    rating: 5,
    text: "After the storm, I needed roof repairs quickly. Found a verified contractor who came the next morning and did excellent work. The verification system gave me total peace of mind.",
    initials: "LJ",
    color: "from-rose-600 to-rose-700",
  },
  {
    name: "Michael Brown",
    location: "Fort Lauderdale, FL",
    service: "Painting",
    rating: 5,
    text: "Completely transformed our home exterior. The painters were on time, neat, and the quality exceeded my expectations. Will absolutely use CompaniesCenterLLC again.",
    initials: "MB",
    color: "from-indigo-600 to-indigo-700",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const goTo = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const prev = () => goTo((current - 1 + testimonials.length) % testimonials.length, -1);
  const next = () => goTo((current + 1) % testimonials.length, 1);

  useEffect(() => {
    timerRef.current = setTimeout(next, 5000);
    return () => clearTimeout(timerRef.current);
  }, [current]);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">
            Loved by Thousands
            <br />
            <span className="text-gray-400 dark:text-gray-500">Across Florida</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visible.map((t, i) => (
              <motion.div
                key={`${t.name}-${current}-${i}`}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`relative p-7 rounded-3xl border transition-all duration-200 ${
                  i === 0
                    ? "bg-gray-900 dark:bg-white border-transparent shadow-2xl"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm"
                }`}
              >
                <Quote
                  size={28}
                  className={`mb-5 ${i === 0 ? "text-white/20" : "text-blue-100 dark:text-blue-900"}`}
                  fill="currentColor"
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p className={`text-sm leading-relaxed mb-6 ${i === 0 ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-black">{t.initials}</span>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${i === 0 ? "text-white" : "text-gray-900 dark:text-white"}`}>{t.name}</p>
                    <p className={`text-xs ${i === 0 ? "text-white/50" : "text-gray-400 dark:text-gray-500"}`}>
                      {t.location} · {t.service}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2.5 bg-blue-600" : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
