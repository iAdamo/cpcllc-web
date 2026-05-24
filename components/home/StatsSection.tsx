"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Users, Briefcase, Star, MapPin } from "lucide-react";

const stats = [
  { Icon: Users, end: 500, suffix: "+", label: "Verified Providers", color: "text-blue-400", bg: "bg-blue-500/10" },
  { Icon: Briefcase, end: 10000, suffix: "+", label: "Jobs Completed", color: "text-violet-400", bg: "bg-violet-500/10" },
  { Icon: Star, end: 4.9, suffix: "★", label: "Average Rating", color: "text-amber-400", bg: "bg-amber-500/10", decimal: true },
  { Icon: MapPin, end: 50, suffix: "+", label: "Florida Cities", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

function Counter({ end, suffix, decimal }: { end: number; suffix: string; decimal?: boolean }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setValue(decimal ? parseFloat(v.toFixed(1)) : Math.floor(v)),
    });
    return controls.stop;
  }, [inView, end, decimal]);

  return (
    <span ref={ref}>
      {decimal ? value.toFixed(1) : value.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
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
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">By the Numbers</p>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Florida&apos;s Fastest-Growing
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Service Network
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ Icon, end, suffix, label, color, bg, decimal }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-7 rounded-3xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors group"
            >
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={color} />
              </div>
              <div className={`text-4xl md:text-5xl font-black ${color} mb-2`}>
                <Counter end={end} suffix={suffix} decimal={decimal} />
              </div>
              <p className="text-white/40 text-sm font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
