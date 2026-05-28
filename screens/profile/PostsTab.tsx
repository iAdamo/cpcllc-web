"use client";

import { motion } from "framer-motion";
import {
  Play, Eye, Flame, Heart, MessageSquare, Share2, Plus,
} from "lucide-react";

const HIGHLIGHTS = ["Emergency", "Projects", "Tips", "Before/After", "Reviews"];
const EMOJIS = ["🔧", "🏠", "💡", "✨", "⭐"];

const POSTS = [
  { id: 1, caption: "Just finished a major pipe replacement project in Victoria Island 🔧", views: "2.4k", likes: 48, comments: 12, isVideo: true, trending: true },
  { id: 2, caption: "Before & after bathroom renovation — client was thrilled! 💪", views: "1.1k", likes: 31, comments: 7, isVideo: false },
  { id: 3, caption: "Pro tip: Always check for hidden leaks behind walls before finishing 🏠", views: "890", likes: 22, comments: 4, isVideo: true },
  { id: 4, caption: "New water heater installation — done in under 2 hours ⚡", views: "3.2k", likes: 65, comments: 19, isVideo: false, trending: true },
];

export default function PostsTab() {
  return (
    <div className="space-y-4">
      {/* Stories highlights */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {HIGHLIGHTS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
              <div className={`w-14 h-14 rounded-full p-0.5 ${i === 0 ? "bg-gradient-to-br from-blue-500 to-violet-600" : "bg-gradient-to-br from-gray-200 to-gray-300"}`}>
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white">
                  <span className="text-lg">{EMOJIS[i]}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">{label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-blue-300 transition-colors">
              <Plus size={18} className="text-gray-400" />
            </div>
            <span className="text-[10px] font-semibold text-gray-400">New</span>
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-2 gap-3">
        {POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all"
          >
            <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/60 flex items-center justify-center">
                {post.isVideo && (
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Play size={18} className="text-white ml-1" fill="white" />
                  </div>
                )}
              </div>
              {post.trending && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  <Flame size={8} /> Trending
                </div>
              )}
              <div className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye size={9} /> {post.views}
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{post.caption}</p>
              <div className="flex items-center gap-3 mt-2">
                <button type="button" aria-label="Like" className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs">
                  <Heart size={12} /> {post.likes}
                </button>
                <button type="button" aria-label="Comment" className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors text-xs">
                  <MessageSquare size={12} /> {post.comments}
                </button>
                <button type="button" aria-label="Share" className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors text-xs ml-auto">
                  <Share2 size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
