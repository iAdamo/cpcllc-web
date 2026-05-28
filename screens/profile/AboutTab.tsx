"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3, Shield, Globe, Clock, MapPin, ExternalLink,
  CheckCircle, ChevronDown, Link2,
} from "lucide-react";
import { ProviderData } from "@/types";

interface Props {
  provider: ProviderData;
  isCurrentUser: boolean;
  editingBio: boolean;
  bioValue: string;
  onBioEdit(): void;
  onBioCancel(): void;
  onBioChange(v: string): void;
  onBioSave(): void;
}

const TIMELINE = [
  { year: "2022", role: "Senior Plumber", company: "AquaTech Services", current: true },
  { year: "2019", role: "Plumbing Technician", company: "HomeServ Ltd." },
  { year: "2016", role: "Junior Plumber", company: "Lagos Water Works" },
];

const FAQS = [
  { q: "What areas do you cover?", a: "I cover Lagos, Abuja, and Port Harcourt. Travel fees may apply for distant locations." },
  { q: "How quickly can you respond?", a: "I typically respond within 15 minutes and can be on-site within 2 hours for emergencies." },
  { q: "Do you offer warranties?", a: "Yes, all my work comes with a 30-day workmanship guarantee." },
];

export default function AboutTab({
  provider, isCurrentUser, editingBio, bioValue,
  onBioEdit, onBioCancel, onBioChange, onBioSave,
}: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const addr = provider.location?.primary?.address;
  const sm = provider.providerSocialMedia;

  return (
    <div className="space-y-4">
      {/* Bio */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-gray-900">About Me</h2>
          {isCurrentUser && !editingBio && (
            <button type="button" onClick={onBioEdit}
              className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline">
              <Edit3 size={13} /> Edit
            </button>
          )}
        </div>
        {editingBio ? (
          <div>
            <textarea
              value={bioValue}
              onChange={(e) => onBioChange(e.target.value)}
              rows={5}
              aria-label="Bio"
              placeholder="Tell clients about yourself…"
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={onBioSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                Save
              </button>
              <button type="button" onClick={onBioCancel}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            {provider.providerDescription || "No bio added yet. Professional service provider ready to help you."}
          </p>
        )}
      </div>

      {/* Skills */}
      {(provider.subcategories?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-gray-900 mb-3">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {provider.subcategories.map((sub) => (
              <span key={sub._id}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors cursor-default">
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-black text-gray-900 mb-4">Experience</h2>
        <div className="relative pl-5 space-y-5">
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-200" />
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative">
              <div className={`absolute -left-4 w-3 h-3 rounded-full border-2 border-white ring-2 ${item.current ? "bg-blue-600 ring-blue-300" : "bg-gray-300 ring-gray-200"}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.role}</p>
                  <p className="text-xs text-gray-500">{item.company}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.current && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Current
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-black text-gray-900 mb-3">Credentials</h2>
        <div className="divide-y divide-gray-100">
          {[
            {
              icon: Shield, label: "Verification",
              value: provider.isVerified
                ? <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs"><CheckCircle size={12} /> Verified ID</span>
                : <span className="text-xs text-gray-400">Not verified</span>,
            },
            { icon: Globe, label: "Languages", value: <span className="text-xs font-medium text-gray-700">English, Yoruba</span> },
            { icon: Clock, label: "Working hours", value: <span className="text-xs font-medium text-gray-700">Mon–Sat, 8am–6pm</span> },
            ...(addr?.city ? [{
              icon: MapPin, label: "Location",
              value: <span className="text-xs font-medium text-gray-700">{[addr.city, addr.country].filter(Boolean).join(", ")}</span>,
            }] : []),
            ...(sm?.website ? [{
              icon: Globe, label: "Website",
              value: <a href={sm.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Visit <ExternalLink size={10} /></a>,
            }] : []),
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <row.icon size={13} className="text-blue-500" />
                {row.label}
              </span>
              {row.value}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-black text-gray-900 mb-3">FAQ</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      {sm && Object.values(sm).some(Boolean) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-gray-900 mb-3">Social Links</h2>
          <div className="flex flex-wrap gap-2.5">
            {([
              sm.instagram && { label: "Instagram", url: sm.instagram, bg: "bg-gradient-to-br from-pink-500 to-purple-600" },
              sm.twitter && { label: "Twitter / X", url: sm.twitter, bg: "bg-sky-500" },
              sm.linkedin && { label: "LinkedIn", url: sm.linkedin, bg: "bg-blue-700" },
              sm.facebook && { label: "Facebook", url: sm.facebook, bg: "bg-blue-600" },
              sm.website && { label: "Website", url: sm.website, bg: "bg-gray-800" },
            ].filter(Boolean) as { label: string; url: string; bg: string }[]).map((item) => (
              <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 ${item.bg} text-white text-xs font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-sm`}>
                <Link2 size={11} />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
