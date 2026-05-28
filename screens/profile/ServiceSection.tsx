"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, DollarSign, ChevronRight, Plus, Tag, Star,
  Loader2, AlertCircle, Package,
} from "lucide-react";
import { getServicesByProvider } from "@/axios/service";
import { ServiceData, ProviderData, MediaItem } from "@/types";

function resolveMedia(media: ServiceData["media"]): string | null {
  const first = (media ?? [])[0];
  if (!first) return null;
  if (typeof first === "string") return first;
  const m = first as MediaItem;
  return m.url || m.thumbnail || null;
}

function ServiceCard({
  service,
  index,
  isCurrentUser,
}: {
  service: ServiceData;
  index: number;
  isCurrentUser: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const imgSrc = resolveMedia(service.media);
  const hasPrice = service.minPrice || service.maxPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-100 transition-all duration-300"
    >
      <div className="flex gap-0">
        {/* Thumbnail */}
        {imgSrc && (
          <div className="relative w-24 sm:w-32 flex-shrink-0 bg-gray-100">
            <Image
              src={imgSrc}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {service.subcategoryId?.name && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1 border border-blue-100">
                  <Tag size={8} />
                  {service.subcategoryId.name}
                </span>
              )}
              <h3 className="text-sm font-black text-gray-900 leading-snug line-clamp-1">
                {service.title}
              </h3>
              <p className={`text-xs text-gray-500 leading-relaxed mt-0.5 ${expanded ? "" : "line-clamp-2"}`}>
                {service.description}
              </p>
              {service.description?.length > 100 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-[11px] text-blue-600 font-semibold mt-0.5 hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {isCurrentUser && (
              <button
                type="button"
                className="flex-shrink-0 text-[10px] font-bold text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-2 py-1 rounded-lg transition-all"
              >
                Edit
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            {hasPrice && (
              <span className="flex items-center gap-1 text-xs font-black text-gray-900">
                <DollarSign size={11} className="text-emerald-500" />
                {service.minPrice === service.maxPrice
                  ? `$${service.minPrice}`
                  : `$${service.minPrice}–$${service.maxPrice}`}
              </span>
            )}
            {service.duration > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <Clock size={11} className="text-blue-400" />
                {service.duration} hr{service.duration !== 1 ? "s" : ""}
              </span>
            )}
            {!service.isActive && (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                Inactive
              </span>
            )}
            <button
              type="button"
              className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            >
              Book <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ServiceSectionProps {
  provider: ProviderData;
  isCurrentUser: boolean;
  isProfilePage?: boolean;
}

export default function ServiceSection({
  provider,
  isCurrentUser,
}: ServiceSectionProps) {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!provider._id) return;
    setLoading(true);
    setError(false);
    getServicesByProvider(provider._id)
      .then(setServices)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [provider._id]);

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <AlertCircle size={28} className="text-red-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 font-semibold">Failed to load services</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="p-14 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Package size={22} className="text-blue-400" />
        </div>
        <p className="text-sm font-bold text-gray-700">No services listed yet</p>
        <p className="text-xs text-gray-400 mt-1">Services offered will appear here</p>
        {isCurrentUser && (
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus size={13} /> Add service
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {isCurrentUser && (
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs text-gray-400 font-medium">{services.length} service{services.length !== 1 ? "s" : ""}</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
          >
            <Plus size={12} /> Add service
          </button>
        </div>
      )}
      {services.map((svc, i) => (
        <ServiceCard
          key={svc._id}
          service={svc}
          index={i}
          isCurrentUser={isCurrentUser}
        />
      ))}
    </div>
  );
}
