"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How are providers verified?",
    a: "Every provider goes through a rigorous vetting process including background checks, license verification, insurance confirmation, and reference checks. Only those who pass all criteria are listed on our platform.",
  },
  {
    q: "Is there a fee to use CompaniesCenterLLC as a homeowner?",
    a: "No, it's completely free for homeowners to search, browse, and contact service providers. You only pay the provider directly for the work they perform.",
  },
  {
    q: "How do I become a listed provider?",
    a: "Click 'Get Started' and complete our onboarding process. You'll submit your credentials, undergo our verification process, and once approved, your profile goes live to thousands of potential clients.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve all major cities and surrounding areas throughout Florida, including Tampa, Orlando, Miami, Jacksonville, St. Petersburg, Clearwater, and more.",
  },
  {
    q: "How do I know the reviews are authentic?",
    a: "All reviews are tied to verified jobs completed through our platform. We use a combination of automated checks and manual review to ensure authenticity and prevent fake ratings.",
  },
  {
    q: "What if I'm not satisfied with a service?",
    a: "We have a satisfaction guarantee. If you're not happy with the service, contact our support team and we'll work to resolve the issue, including facilitating a return visit or connecting you with an alternative provider.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-[0.15em] mb-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base max-w-lg mx-auto">
            Everything you need to know about CompaniesCenterLLC.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i
                  ? "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 shadow-md"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className={`font-bold text-base ${open === i ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                  {q}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${
                  open === i ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
