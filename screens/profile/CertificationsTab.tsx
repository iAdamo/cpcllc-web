"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle, Calendar, Award } from "lucide-react";

export interface Certification {
  title: string;
  org: string;
  date?: string;
  verified?: boolean;
  id?: string;
}

/**
 * Renders a provider's certifications. Data must come from the provider
 * record — this component previously displayed three hard-coded fake
 * "verified" licenses on every profile, which is exactly the kind of
 * fabricated credential display that kills trust (and invites FTC
 * problems). No data means an honest empty state.
 */
export default function CertificationsTab({
  certifications = [],
}: {
  certifications?: Certification[];
}) {
  if (certifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Award size={28} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-black text-gray-900 mb-1">
          No certifications listed
        </h3>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          This provider hasn&apos;t added any certifications yet. Check their
          reviews and completed projects to evaluate their work.
        </p>
      </div>
    );
  }

  const verifiedCount = certifications.filter((c) => c.verified).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          {certifications.length} certification
          {certifications.length === 1 ? "" : "s"}
        </p>
        {verifiedCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle size={11} /> {verifiedCount} Verified
          </span>
        )}
      </div>

      {certifications.map((cert, i) => (
        <motion.div
          key={cert.id ?? `${cert.title}-${i}`}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                cert.verified
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200"
                  : "bg-gray-100"
              }`}
            >
              <BadgeCheck
                size={26}
                className={cert.verified ? "text-white" : "text-gray-400"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-black text-gray-900 leading-snug">
                  {cert.title}
                </h3>
                {cert.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-black bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    <CheckCircle size={9} /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{cert.org}</p>
              {cert.date && (
                <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-2.5">
                  <Calendar size={10} /> Issued {cert.date}
                </span>
              )}
              {cert.id && (
                <p className="text-[10px] text-gray-300 mt-1 font-mono">
                  {cert.id}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
