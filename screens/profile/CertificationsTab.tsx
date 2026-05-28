"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle, Calendar, Download } from "lucide-react";

const CERTS = [
  { title: "Master Plumber License", org: "Council for the Regulation of Engineering in Nigeria", date: "Jan 2021", verified: true, id: "COREN-PLB-2021-04821" },
  { title: "Electrical Safety Certification", org: "Lagos State Safety Commission", date: "Mar 2022", verified: true, id: "LSSC-ELEC-2022-00312" },
  { title: "Fire Safety & Prevention", org: "Nigeria Fire Safety Institute", date: "Aug 2020", verified: false, id: "NFSI-2020-07134" },
];

export default function CertificationsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">{CERTS.length} certifications</p>
        <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle size={11} /> {CERTS.filter((c) => c.verified).length} Verified
        </span>
      </div>

      {CERTS.map((cert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${cert.verified ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200" : "bg-gray-100"}`}>
              <BadgeCheck size={26} className={cert.verified ? "text-white" : "text-gray-400"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-black text-gray-900 leading-snug">{cert.title}</h3>
                {cert.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-black bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    <CheckCircle size={9} /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{cert.org}</p>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar size={10} /> Issued {cert.date}
                </span>
                <button type="button"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  <Download size={11} /> Download
                </button>
              </div>
              <p className="text-[10px] text-gray-300 mt-1 font-mono">{cert.id}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
