"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MessagesSquare,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  CalendarClock,
  Star,
  FileCheck2,
} from "lucide-react";
import { getFeaturedReviews, type FeaturedReview } from "@/axios/stats";

// Honest launch content. This section shows REAL verified reviews (from the
// reviews API, each tied to a completed job) as soon as at least three exist.
// Until then it falls back to these commitment cards — never fabricated named
// testimonials (FTC 16 CFR Part 465).
const commitments = [
  {
    Icon: BadgeCheck,
    title: "Verified before they're visible",
    text: "Every provider on the platform goes through identity and business verification before their profile can accept work. What you see is who shows up.",
    color: "from-blue-600 to-blue-700",
  },
  {
    Icon: Star,
    title: "Reviews tied to real jobs",
    text: "Ratings can only be left by clients on jobs completed through the platform. No imported reviews, no anonymous scores, no exceptions.",
    color: "from-amber-500 to-orange-600",
  },
  {
    Icon: MessagesSquare,
    title: "Talk directly, decide freely",
    text: "Message providers in real time, compare offers side by side, and hire on your terms. We never insert ourselves into your negotiation.",
    color: "from-violet-600 to-violet-700",
  },
  {
    Icon: CalendarClock,
    title: "Post a task, get responses",
    text: "Describe what you need once. Available providers near you see it instantly and reply with proposals — no phone tag.",
    color: "from-emerald-600 to-emerald-700",
  },
  {
    Icon: ShieldCheck,
    title: "Your data stays yours",
    text: "We don't sell contact details or auction your job to lead brokers. Providers only see what you choose to share.",
    color: "from-rose-600 to-rose-700",
  },
  {
    Icon: FileCheck2,
    title: "Clear records, no surprises",
    text: "Proposals, agreements and conversations live in one place, so both sides always know what was promised.",
    color: "from-indigo-600 to-indigo-700",
  },
];

const REVIEW_COLORS = [
  "from-blue-600 to-blue-700",
  "from-amber-500 to-orange-600",
  "from-violet-600 to-violet-700",
  "from-emerald-600 to-emerald-700",
  "from-rose-600 to-rose-700",
  "from-indigo-600 to-indigo-700",
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Show real reviews once there are enough to fill the carousel; else fall
  // back to the honest commitment cards.
  useEffect(() => {
    let cancelled = false;
    getFeaturedReviews()
      .then((r) => !cancelled && setReviews(r))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const useReviews = reviews.length >= 3;
  const count = useReviews ? reviews.length : commitments.length;

  const goTo = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const prev = () => goTo((current - 1 + count) % count, -1);
  const next = () => goTo((current + 1) % count, 1);

  useEffect(() => {
    timerRef.current = setTimeout(next, 5000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, count]);

  // Keep the index in range if the data source flips (commitments <-> reviews).
  useEffect(() => {
    if (current >= count) setCurrent(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const visibleIdx = [current, (current + 1) % count, (current + 2) % count];

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
            {useReviews ? "What Clients Say" : "Our Commitments"}
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">
            {useReviews ? (
              <>
                Real Reviews From
                <br />
                <span className="text-gray-400 dark:text-gray-500">
                  Completed Jobs
                </span>
              </>
            ) : (
              <>
                What You Can Expect
                <br />
                <span className="text-gray-400 dark:text-gray-500">
                  From Every Hire
                </span>
              </>
            )}
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visibleIdx.map((idx, i) => {
              const highlight = i === 0;
              const cardClass = `relative p-7 rounded-3xl border transition-all duration-200 ${
                highlight
                  ? "bg-gray-900 dark:bg-white border-transparent shadow-2xl"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm"
              }`;
              const titleClass = `font-black text-lg mb-3 ${
                highlight ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white"
              }`;
              const bodyClass = `text-sm leading-relaxed ${
                highlight ? "text-white/80 dark:text-gray-600" : "text-gray-600 dark:text-gray-300"
              }`;

              const motionProps = {
                initial: { opacity: 0, x: direction * 40 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
                className: cardClass,
              };

              if (useReviews) {
                const r = reviews[idx];
                return (
                  <motion.div key={`${r.id}-${i}`} {...motionProps}>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s < r.rating
                              ? "text-amber-400 fill-amber-400"
                              : highlight
                              ? "text-white/25 dark:text-gray-300"
                              : "text-gray-200 dark:text-gray-700"
                          }
                        />
                      ))}
                    </div>
                    <p className={`${bodyClass} mb-5 line-clamp-5`}>“{r.text}”</p>
                    <p className={titleClass.replace("text-lg mb-3", "text-sm mb-0")}>
                      {r.reviewerName}
                      {r.providerName ? (
                        <span
                          className={highlight ? "text-white/60 dark:text-gray-500" : "text-gray-400"}
                        >
                          {" "}
                          · {r.providerName}
                        </span>
                      ) : null}
                    </p>
                  </motion.div>
                );
              }

              const c = commitments[idx];
              return (
                <motion.div key={`${c.title}-${i}`} {...motionProps}>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-5`}
                  >
                    <c.Icon size={22} className="text-white" />
                  </div>
                  <p className={titleClass}>{c.title}</p>
                  <p className={bodyClass}>{c.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to card ${i + 1}`}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-blue-600"
                      : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
