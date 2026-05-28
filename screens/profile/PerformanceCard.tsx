"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const METRICS = [
  { label: "Completion", value: 98, color: "bg-blue-500" },
  { label: "Response", value: 94, color: "bg-emerald-500" },
  { label: "On-time", value: 91, color: "bg-violet-500" },
];

export default function PerformanceCard({ reviewCount }: { reviewCount: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-black text-gray-700">Performance</p>
        <span className="text-[10px] bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full border border-blue-200">
          Top {reviewCount > 50 ? "3%" : "10%"}
        </span>
      </div>
      <div className="space-y-2.5">
        {METRICS.map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-gray-500">{label}</span>
              <span className="font-black text-gray-700">{value}%</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-2">
        <Sparkles size={12} className="text-violet-500" />
        <p className="text-[10px] text-gray-500 font-medium">
          <span className="text-violet-600 font-bold">AI Match Score:</span> 96% for your needs
        </p>
      </div>
    </div>
  );
}
