"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  Send,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { getReviews, createReview } from "@/axios/reviews";
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

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange(v: number): void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${s} star${s !== 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={
              s <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 fill-gray-100"
            }
          />
        </button>
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
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
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
              <p className="text-sm font-bold text-gray-900">{name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars rating={review.rating} size={11} />
                <span className="text-[10px] text-gray-400">
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

          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            {review.description}
          </p>

          {/* Tags */}
          {(review.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"
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
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ThumbsUp size={11} />
              Helpful ({review.helpfulVotes?.length ?? 0})
            </button>
            {review.providerReply && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
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
            {showReply && review.providerReply && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-blue-700 mb-1">
                    Provider replied
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {review.providerReply}
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
  providerId: string;
  newReviews?: ReviewData[];
}

export default function ReviewSection({
  providerId,
  newReviews = [],
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!providerId) return;
    setLoading(true);
    setError(false);
    getReviews(providerId)
      .then(setReviews)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [providerId]);

  const allReviews = [...newReviews, ...reviews];

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("description", text.trim());
      fd.append("rating", String(rating));
      const created = await createReview(providerId, fd);
      setReviews((prev) => [created, ...prev]);
      setText("");
      setRating(0);
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      // silently fail — user can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Write review CTA */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-gray-900">
            {allReviews.length} Review{allReviews.length !== 1 ? "s" : ""}
          </p>
          {submitted && (
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 animate-pulse">
              Review submitted — thank you!
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
        >
          <Star size={12} />
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-blue-50/60 border-b border-blue-100 space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">
                  Your rating
                </p>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700 mb-1.5">
                  Your review
                </p>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="Share your experience with this provider…"
                  aria-label="Review text"
                  className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!rating || !text.trim() || submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                {submitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review list */}
      {loading ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded w-full" />
                <div className="h-2.5 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-10 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Failed to load reviews</p>
        </div>
      ) : allReviews.length === 0 ? (
        <div className="p-14 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star size={22} className="text-amber-400" />
          </div>
          <p className="text-sm font-bold text-gray-700">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Be the first to leave a review
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
