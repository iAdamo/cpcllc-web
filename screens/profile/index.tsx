"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  CheckCircle,
  Award,
  Share2,
  MessageCircle,
  Phone,
  Calendar,
  Edit3,
  Camera,
  Play,
  Eye,
  Shield,
  Briefcase,
  TrendingUp,
  Zap,
  Heart,
  Search,
  Filter,
  ChevronDown,
  BadgeCheck,
  Timer,
  Sparkles,
} from "lucide-react";
import useGlobalStore from "@/stores";
import {
  getUserProfile,
  updateProviderProfile,
  getFollowers,
} from "@/axios/user";
import { MediaItem, ProviderData, UserData } from "@/types";

import ProfileSkeleton from "./ProfileSkeleton";
import Stars from "./Stars";
import PortfolioGrid from "./PortfolioGrid";
import AboutTab from "./AboutTab";
import PostsTab from "./PostsTab";
import AvailabilityTab from "./AvailabilityTab";
import CertificationsTab from "./CertificationsTab";
import PerformanceCard from "./PerformanceCard";
import ReviewSection from "./ReviewSection";
import ServiceSection from "./ServiceSection";
import { resolveUrl, fmtNum, fmtDate } from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab =
  | "services"
  | "portfolio"
  | "reviews"
  | "about"
  | "posts"
  | "availability"
  | "certifications";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "services", label: "Services", icon: Briefcase },
  { id: "portfolio", label: "Portfolio", icon: Eye },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "about", label: "About", icon: Zap },
  { id: "posts", label: "Posts", icon: Play },
  { id: "availability", label: "Availability", icon: Calendar },
  { id: "certifications", label: "Certifications", icon: BadgeCheck },
];

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, otherUser, fetchUserProfile } = useGlobalStore();
  const currentUser = user;

  const [data, setData] = useState<UserData | null>(null);
  const [subData, setSubData] = useState<{
    followersCount: number;
    isFollowing: boolean;
  }>();
  const [provider, setProvider] = useState<ProviderData | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [newReviews, setNewReviews] = useState<never[]>([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCurrentUser = !!(
    currentUser && (currentUser.activeRoleId as ProviderData)?.slug === slug
  );

  const fetchData = useCallback(async () => {
    if (!slug) return;
    try {
      if (
        (user?.activeRoleId as ProviderData).slug === slug &&
        user?.activeRoleId
      ) {
        setData(user);
      } else {
        const res = await getUserProfile(slug);
        setData(res);
        setProvider(res.activeRoleId as ProviderData);
        console.log(res);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }, [slug, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Load followers ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!provider?.owner) return;
    getFollowers(provider.owner).then((res) => {
      setSubData({
        followersCount: res.followersCount,
        isFollowing: res.followers.some((f: any) => f.user._id === user?._id),
      });
    });
  }, [provider, user]);

  useEffect(() => {
    if (provider?.providerDescription)
      setBioValue(provider.providerDescription);
  }, [provider?.providerDescription]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      !file ||
      !VALID_IMAGE_TYPES.includes(file.type) ||
      file.size > MAX_FILE_SIZE
    )
      return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("providerLogo", file, "providerLogo");
      await updateProviderProfile(formData);
      await fetchData();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBioSave = async () => {
    try {
      const formData = new FormData();
      formData.append("providerDescription", bioValue);
      await updateProviderProfile(formData);
      await fetchData();
      setEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!provider) return <ProfileSkeleton />;

  const logoUrl = resolveUrl(provider.providerLogo);
  const allImages = (provider.providerImages ?? []) as unknown[];
  const coverUrl = (allImages[0] as MediaItem).url;
  const portfolioItems = allImages.slice(1);

  const addr = provider.location?.primary?.address;
  const locationStr =
    [addr?.city, addr?.country].filter(Boolean).join(", ") || "Lagos, Nigeria";
  const memberSince = provider.createdAt
    ? fmtDate(provider.createdAt)
    : "Jan 2022";
  const rating = provider.averageRating ?? 0;
  const reviewCount = provider.reviewCount ?? 0;

  const STATS = [
    // { label: "Orders", value: fmtNum((provider as any).clients?.length ?? 120) },
    { label: "Reviews", value: fmtNum(reviewCount) },
    { label: "Followers", value: fmtNum(subData?.followersCount) },
    // { label: "Following", value: fmtNum(subData.isFollowing) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      {/* ── Cover ──────────────────────────────────────────── */}
      <div className="relative h-44 lg:h-56 w-full overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
        {coverUrl !== "/assets/men.jpg" && (
          <Image
            src={coverUrl}
            alt="Cover"
            fill
            className="object-cover mix-blend-overlay opacity-50"
          />
        )}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        {isCurrentUser && (
          <button
            type="button"
            aria-label="Change cover photo"
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            <Camera size={12} /> Edit cover
          </button>
        )}
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="lg:flex gap-5 lg:items-start">
          {/* ══ LEFT SIDEBAR ══════════════════════════════════ */}
          <aside className="lg:w-72 xl:w-80 lg:sticky lg:top-24 flex-shrink-0 -mt-12 lg:-mt-14 relative z-10 space-y-3">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              {/* Avatar */}
              <div className="flex justify-center pt-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
                    {isUploading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <Camera size={20} className="text-gray-400" />
                      </div>
                    ) : (
                      <Image
                        src={logoUrl}
                        alt={provider.providerName ?? ""}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    )}
                  </div>
                  <span
                    className={`absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      provider.isOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                  {isCurrentUser && (
                    <button
                      type="button"
                      aria-label="Change profile photo"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <Camera size={11} className="text-white" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    aria-label="Upload photo"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="px-5 pt-3 pb-5">
                {/* Name */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <h1 className="text-lg font-black text-gray-900">
                      {provider.providerName}
                    </h1>
                    {provider.isVerified && (
                      <CheckCircle size={17} className="text-blue-600" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    @
                    {provider.providerName?.toLowerCase().replace(/\s+/g, "") ||
                      "provider"}
                  </p>
                  {(provider.subcategories?.length ?? 0) > 0 && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {provider.subcategories[0]?.name}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                    {provider.isPremium && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-200">
                        <Award size={8} /> Top Rated
                      </span>
                    )}
                    {provider.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-full border border-violet-200">
                        <TrendingUp size={8} /> Trending
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-200">
                      <Sparkles size={8} /> AI Pick
                    </span>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full ${
                        provider.isOnline
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          provider.isOnline ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      {provider.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mt-2.5">
                    <Stars rating={rating} size={13} />
                    <span className="text-sm font-black text-gray-900 ml-1">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({reviewCount})
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3.5 space-y-1.5">
                  {[
                    { icon: MapPin, text: locationStr },
                    { icon: Calendar, text: `Member since ${memberSince}` },
                    { icon: Timer, text: "Response time ~15 mins" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <Icon size={12} className="text-blue-500 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-0.5 mt-4 py-3.5 border-t border-b border-gray-100">
                  {STATS.map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-sm font-black text-gray-900">
                        {value}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="mt-3.5 grid grid-cols-3 gap-1.5">
                  {[
                    {
                      icon: Shield,
                      label: "Verified ID",
                      color: "text-blue-600",
                      bg: "bg-blue-50 border-blue-100",
                    },
                    {
                      icon: Award,
                      label: "Top Rated",
                      color: "text-amber-600",
                      bg: "bg-amber-50 border-amber-100",
                    },
                    {
                      icon: Timer,
                      label: "Fast Reply",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50 border-emerald-100",
                    },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <div
                      key={label}
                      className={`flex flex-col items-center gap-1 py-2 rounded-xl border ${bg}`}
                    >
                      <Icon size={14} className={color} />
                      <span className={`text-[9px] font-bold ${color}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {!isCurrentUser ? (
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all active:scale-95 shadow-md shadow-blue-200 text-sm flex items-center justify-center gap-2"
                    >
                      <Briefcase size={14} /> Hire Now
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2.5 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <MessageCircle size={13} /> Message
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2.5 border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Phone size={13} /> Call
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Share2 size={12} /> Share
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSaved(!isSaved)}
                        aria-label={isSaved ? "Unsave" : "Save"}
                        className={`flex-1 py-2.5 border font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isSaved
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-gray-200 hover:bg-gray-50 text-gray-500"
                        }`}
                      >
                        <Heart
                          size={12}
                          className={isSaved ? "fill-red-500" : ""}
                        />
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full py-2.5 border-2 border-blue-200 hover:bg-blue-50 text-blue-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit3 size={13} /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            <PerformanceCard reviewCount={reviewCount} />

            {/* Mini availability */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-gray-700">This week</p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    provider.isOnline
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {provider.isOnline ? "Available" : "Busy"}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[9px] font-bold ${
                      [0, 1, 3, 4].includes(i)
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ══ RIGHT CONTENT ═════════════════════════════════ */}
          <main className="flex-1 min-w-0 mt-4 lg:mt-5">
            {/* Tab bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
              <div className="flex overflow-x-auto no-scrollbar">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 min-w-max flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-bold whitespace-nowrap transition-colors ${
                        active
                          ? "text-blue-600"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      <Icon size={13} />
                      {tab.label}
                      {active && (
                        <motion.div
                          layoutId="tab-line"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "services" && provider._id && (
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Search
                          size={13}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Search services…"
                          aria-label="Search services"
                          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                      >
                        <Filter size={12} /> Filter
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-300 transition-all"
                      >
                        Sort <ChevronDown size={11} />
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <ServiceSection
                        provider={provider}
                        isCurrentUser={isCurrentUser}
                        isProfilePage
                      />
                    </div>
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <PortfolioGrid
                    items={portfolioItems}
                    isCurrentUser={isCurrentUser}
                  />
                )}

                {activeTab === "reviews" && provider._id && (
                  <div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 mb-4 flex gap-6">
                      <div className="text-center flex-shrink-0">
                        <p className="text-5xl font-black text-gray-900">
                          {rating.toFixed(1)}
                        </p>
                        <Stars rating={rating} size={14} />
                        <p className="text-xs text-gray-400 mt-1">
                          ({reviewCount} reviews)
                        </p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[
                          { label: "5", pct: 72 },
                          { label: "4", pct: 17 },
                          { label: "3", pct: 6 },
                          { label: "2", pct: 3 },
                          { label: "1", pct: 2 },
                        ].map(({ label, pct }) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-2">
                              {label}
                            </span>
                            <Star
                              size={10}
                              className="text-amber-400 fill-amber-400 flex-shrink-0"
                            />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.1 * Number(label),
                                }}
                                className="h-full bg-blue-500 rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-6 text-right">
                              {pct}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <ReviewSection
                        providerId={provider.owner}
                        newReviews={newReviews}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "about" && (
                  <AboutTab
                    provider={provider}
                    isCurrentUser={isCurrentUser}
                    editingBio={editingBio}
                    bioValue={bioValue}
                    onBioEdit={() => setEditingBio(true)}
                    onBioCancel={() => {
                      setEditingBio(false);
                      setBioValue(provider.providerDescription ?? "");
                    }}
                    onBioChange={setBioValue}
                    onBioSave={handleBioSave}
                  />
                )}

                {activeTab === "posts" && <PostsTab />}

                {activeTab === "availability" && (
                  <AvailabilityTab isOnline={!!provider.isOnline} />
                )}

                {activeTab === "certifications" && <CertificationsTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Mobile sticky bar ──────────────────────────────── */}
      {!isCurrentUser && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3">
            <div className="flex gap-2 max-w-sm mx-auto">
              <button
                type="button"
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 active:scale-95 transition-all"
              >
                <Briefcase size={14} /> Hire Now
              </button>
              {[
                { icon: MessageCircle, label: "Message" },
                { icon: Phone, label: "Call" },
                { icon: Share2, label: "Share" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-12 h-12 border-2 border-gray-200 hover:border-blue-300 rounded-2xl flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
