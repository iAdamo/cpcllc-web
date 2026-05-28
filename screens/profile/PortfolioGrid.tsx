"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Play, Heart, MessageSquare, Bookmark, X, Plus } from "lucide-react";
import { MediaItem } from "@/types";
import { resolveUrl } from "./helpers";

interface Props {
  items: unknown[];
  isCurrentUser: boolean;
}

export default function PortfolioGrid({ items, isCurrentUser }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Camera size={22} className="text-blue-400" />
        </div>
        <p className="text-gray-600 font-semibold">No portfolio items yet</p>
        <p className="text-gray-400 text-sm mt-1">Portfolio showcases will appear here</p>
        {isCurrentUser && (
          <button
            type="button"
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl mx-auto hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} /> Add portfolio
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {items.map((item, i) => {
          const isVideo = (item as MediaItem)?.type === "video";
          const src = resolveUrl(item);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => setLightbox(src)}
            >
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt={`Portfolio ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Like" className="flex items-center gap-1 text-white text-xs">
                      <Heart size={12} /> 24
                    </button>
                    <button type="button" aria-label="Comment" className="flex items-center gap-1 text-white text-xs">
                      <MessageSquare size={12} /> 6
                    </button>
                    <button type="button" aria-label="Save" className="flex items-center gap-1 text-white text-xs ml-auto">
                      <Bookmark size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close lightbox"
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[80vh] w-full h-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightbox} alt="Preview" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
