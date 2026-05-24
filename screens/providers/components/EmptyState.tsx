"use client";

import { motion } from "framer-motion";
import { SearchX, WifiOff, Building2, RefreshCw } from "lucide-react";
import Link from "next/link";

type Variant = "no-results" | "error" | "initial";

interface EmptyStateProps {
  variant: Variant;
  query?: string;
  onReset?: () => void;
  onRetry?: () => void;
}

const configs = {
  "no-results": {
    Icon: SearchX,
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "No providers found",
    desc: "Try adjusting your filters or search a different area.",
    suggestions: ["Plumbing", "HVAC", "Electrical", "Cleaning"],
  },
  error: {
    Icon: WifiOff,
    bg: "bg-red-50",
    iconColor: "text-red-500",
    title: "Something went wrong",
    desc: "We couldn't load providers. Check your connection and try again.",
    suggestions: [],
  },
  initial: {
    Icon: Building2,
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
    title: "Discover providers",
    desc: "Search for a service or browse by category to find the best professionals near you.",
    suggestions: ["Plumbing", "HVAC", "Electrical", "Cleaning", "Roofing"],
  },
};

export default function EmptyState({ variant, query, onReset, onRetry }: EmptyStateProps) {
  const { Icon, bg, iconColor, title, desc, suggestions } = configs[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className={`w-20 h-20 ${bg} rounded-3xl flex items-center justify-center mb-5`}>
        <Icon size={34} className={iconColor} />
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-2">
        {title}
        {query && (
          <span className="text-blue-600 font-black"> &ldquo;{query}&rdquo;</span>
        )}
      </h3>
      <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed">{desc}</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Clear all filters
          </button>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-3 font-medium">Popular searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <Link
                key={s}
                href={`/providers?q=${encodeURIComponent(s)}`}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 text-sm font-medium rounded-full transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
