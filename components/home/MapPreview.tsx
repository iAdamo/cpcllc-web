"use client";

import { motion } from "framer-motion";
import { MapPin, Star, CheckCircle } from "lucide-react";

const pins = [
  { x: "22%", y: "38%", name: "Pro Plumbing", rating: 4.9, delay: 0 },
  { x: "55%", y: "25%", name: "Elite Electric", rating: 4.8, delay: 0.15 },
  { x: "70%", y: "55%", name: "Cool Air HVAC", rating: 4.9, delay: 0.3 },
  { x: "35%", y: "65%", name: "CleanPro", rating: 5.0, delay: 0.45 },
  { x: "78%", y: "30%", name: "SunSolar", rating: 4.7, delay: 0.6 },
];

const floatingCards = [
  {
    name: "Tampa Plumbers",
    service: "Plumbing",
    rating: 4.9,
    reviews: 312,
    badge: "Top Rated",
    x: "-left-4 md:-left-8",
    y: "top-8",
    delay: 0.4,
  },
  {
    name: "Elite Electrical",
    service: "Electrical",
    rating: 4.8,
    reviews: 189,
    badge: "Verified",
    x: "-right-4 md:-right-8",
    y: "bottom-16",
    delay: 0.6,
  },
];

export default function MapPreview() {
  return (
    <div className="relative w-full h-full min-h-[480px] select-none">
      {/* Map background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Dark map base */}
        <div className="absolute inset-0 bg-[#0f172a]" />

        {/* Road grid SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal roads */}
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#1e293b" strokeWidth="14" />
          <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#1e293b" strokeWidth="8" />
          <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#1e293b" strokeWidth="6" />
          {/* Vertical roads */}
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#1e293b" strokeWidth="12" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e293b" strokeWidth="8" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#1e293b" strokeWidth="6" />
          {/* Road center lines */}
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#1e40af" strokeWidth="1" strokeDasharray="12 8" opacity="0.4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e40af" strokeWidth="1" strokeDasharray="12 8" opacity="0.4" />

          {/* Blocks / buildings */}
          <rect x="22%" y="32%" width="26%" height="21%" rx="4" fill="#1a2744" />
          <rect x="52%" y="32%" width="21%" height="21%" rx="4" fill="#1a2744" />
          <rect x="22%" y="57%" width="26%" height="16%" rx="4" fill="#1a2744" />
          <rect x="52%" y="57%" width="21%" height="16%" rx="4" fill="#1a2744" />
          <rect x="0" y="0" width="18%" height="28%" rx="4" fill="#1a2744" />
          <rect x="76%" y="32%" width="24%" height="21%" rx="4" fill="#1a2744" />
          <rect x="0" y="57%" width="18%" height="16%" rx="4" fill="#1a2744" />
        </svg>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0f172a]/40" />

        {/* Pins */}
        {pins.map((pin, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: pin.x, top: pin.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: pin.delay, type: "spring", stiffness: 200 }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 -m-3 rounded-full bg-blue-500/20"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: pin.delay }}
            />
            <div className="relative group cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 border-2 border-white">
                <MapPin size={14} className="text-white" fill="white" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-white rounded-xl px-3 py-2 shadow-xl text-xs whitespace-nowrap">
                  <p className="font-bold text-gray-900">{pin.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} fill="#f59e0b" color="#f59e0b" />
                    <span className="text-gray-600">{pin.rating}</span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 shadow" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Search this area button */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            type="button"
            className="px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 border border-gray-200"
          >
            <MapPin size={12} />
            Search this area
          </button>
        </motion.div>
      </div>

      {/* Floating company cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className={`absolute ${card.x} ${card.y} z-20`}
          initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: card.delay, duration: 0.5 },
            x: { delay: card.delay, duration: 0.5 },
            y: { delay: card.delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 shadow-2xl border border-gray-100 w-44">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wide">
                {card.badge}
              </span>
            </div>
            <p className="text-xs font-black text-gray-900 leading-tight">{card.name}</p>
            <p className="text-[10px] text-gray-400 mb-1.5">{card.service}</p>
            <div className="flex items-center gap-1">
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              <span className="text-[11px] font-bold text-gray-900">{card.rating}</span>
              <span className="text-[10px] text-gray-400">({card.reviews})</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
