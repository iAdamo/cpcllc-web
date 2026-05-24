"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-[0.05]" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Stay in the Loop
          </h2>
          <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Get the latest home service tips, exclusive provider deals, and seasonal maintenance reminders — straight to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-8 py-5 max-w-md mx-auto"
            >
              <CheckCircle size={22} className="text-emerald-400" />
              <p className="text-white font-bold text-lg">You&apos;re on the list!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 shadow-xl">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 py-4 text-gray-900 placeholder-gray-400 font-medium text-sm bg-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-white hover:bg-gray-100 disabled:opacity-70 text-blue-700 font-black rounded-2xl transition-all hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-white/35 text-xs mt-5">
            No spam, ever. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
