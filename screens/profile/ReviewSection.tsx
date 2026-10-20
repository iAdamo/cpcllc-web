"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { getProviderReviews } from "@/axios/reviews";
import { MediaItem, ReviewData } from "@/types";

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: ReviewData; index: number }) {
  const [showReply, setShowReply] = useState(false);
  const name = review.creator
    ? `${(review.creator as any).firstName ?? ""} ${
        (review.creator as any).lastName ?? ""
      }`.trim() || "Anonymous"
    : "Anonymous";
  const avatar = review.creator.profilePicture?.thumbnail ?? null;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 border-b border-gray-50 last:border-0"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <span className="text-white text-xs font-black">{initials}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars rating={review.rating} size={11} />
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>
            {review.status === "approved" && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                Verified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            {review.description}
          </p>

          {/* Tags */}
          {(review.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Helpful votes */}
          <div className="flex items-center gap-3 mt-2.5">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-brand-700 transition-colors"
            >
              <ThumbsUp size={11} />
              Helpful ({review.helpfulVotes?.length ?? 0})
            </button>
            {replyOf(review) && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-brand-700 transition-colors"
              >
                <MessageSquare size={11} />
                Reply
                <ChevronDown
                  size={10}
                  className={`transition-transform ${
                    showReply ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Provider reply */}
          <AnimatePresence>
            {showReply && replyOf(review) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-brand-800 mb-1">
                    Provider replied
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {replyOf(review)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface ReviewSectionProps {
  /** The business's id (reviews are stored against it, not its owner). */
  providerId: string;
}

/** The business's reply: `reply.text` now, `providerReply` on older reviews. */
function replyOf(review: ReviewData): string | undefined {
  return review.reply?.text || review.providerReply || undefined;
}

export default function ReviewSection({ providerId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!providerId) return;
    setLoading(true);
    setError(false);
    getProviderReviews(providerId)
      .then(setReviews)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [providerId]);

  const allReviews = reviews;

  return (
    <div>
      {/* Count, and where reviews come from: customers, in the app, after a
          completed job. The website only shows them. */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-sm font-black text-gray-900 dark:text-white">
          {allReviews.length} Review{allReviews.length !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Customers leave reviews in the Companies Center app after a completed
          job.
        </p>
      </div>

      {/* Review list */}
      {loading ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-10 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load reviews</p>
        </div>
      ) : allReviews.length === 0 ? (
        <div className="p-14 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star size={22} className="text-amber-400" />
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">No reviews yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Reviews appear here after customers complete a job with this
            business.
          </p>
        </div>
      ) : (
        <div>
          {allReviews.map((review, i) => (
            <ReviewCard key={review._id ?? i} review={review} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
