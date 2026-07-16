"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  CheckCircle,
  Share2,
  MessageCircle,
  Phone,
  Calendar,
  Edit3,
  Camera,
  Eye,
  Shield,
  Briefcase,
  TrendingUp,
  Zap,
  Heart,
  BadgeCheck,
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
import CertificationsTab from "./CertificationsTab";
import ReviewSection from "./ReviewSection";
import ServiceSection from "./ServiceSection";
import { resolveUrl, fmtNum, fmtDate } from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "services" | "gallery" | "reviews" | "about" | "certifications";

// Services = the provider's actual work offerings (from the services API).
// Gallery = provider.gallery, the media showcase the provider uploaded —
// never present gallery shots as portfolio work.
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "services", label: "Services", icon: Briefcase },
  { id: "gallery", label: "Gallery", icon: Eye },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "about", label: "About", icon: Zap },
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
  const router = useRouter();
  const { user, savedProviders, setSavedProviders, isAuthenticated } =
    useGlobalStore();
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
  const [shareCopied, setShareCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCurrentUser = !!(
    currentUser && (currentUser.activeRoleId as ProviderData)?.slug === slug
  );

  const fetchData = useCallback(async () => {
    if (!slug) return;
    try {
      if (
        user?.activeRoleId &&
        (user.activeRoleId as ProviderData).slug === slug
      ) {
        setData(user);
        setProvider(user.activeRoleId as ProviderData);
      } else {
        const res = await getUserProfile(slug);
        setData(res);
        setProvider(res.activeRoleId as ProviderData);
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

  const isSaved = useMemo(
    () => !!provider && savedProviders.some((p) => p._id === provider._id),
    [savedProviders, provider]
  );

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

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: provider?.providerName ?? "Companies Center",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const handleSave = () => {
    if (!provider) return;
    if (!isAuthenticated) {
      router.push(`/auth/signin?next=/c/${slug}`);
      return;
    }
    void setSavedProviders(provider._id);
  };

  const handleHire = () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?next=/tasks/create`);
      return;
    }
    router.push("/tasks/create");
  };

  if (!provider) return <ProfileSkeleton />;

  const logoUrl = resolveUrl(provider.providerLogo);
  // First gallery shot doubles as the cover; the page must survive a
  // provider with an empty gallery (previously crashed here).
  const gallery = (provider.gallery ?? []) as unknown as MediaItem[];
  const coverUrl = gallery[0]?.url ?? gallery[0]?.thumbnail ?? null;

  const addr = provider.location?.primary?.address;
  const locationStr =
    [addr?.city, addr?.state, addr?.country].filter(Boolean).join(", ") ||
    "Location not set";
  const memberSince = provider.createdAt ? fmtDate(provider.createdAt) : null;
  const rating = provider.averageRating ?? 0;
  const reviewCount = provider.reviewCount ?? 0;

  const providerEmail = (provider as any).providerEmail as string | undefined;
  const providerPhone = (provider as any).providerPhoneNumber as
    | string
    | undefined;

  const STATS = [
    { label: "Reviews", value: fmtNum(reviewCount) },
    { label: "Followers", value: fmtNum(subData?.followersCount) },
    { label: "Services", value: fmtNum((provider as any).servicesCount) },
  ].filter((s) => s.value !== undefined && s.value !== null);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      {/* ── Cover ──────────────────────────────────────────── */}
      <div className="relative h-44 lg:h-56 w-full overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900" />
        {coverUrl && (
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
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-gray-100">
                    {isUploading ? (
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <Camera size={20} className="text-gray-400" />
                      </div>
                    ) : logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={provider.providerName ?? ""}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-2xl font-black">
                        {provider.providerName?.[0]?.toUpperCase() ?? "C"}
                      </div>
                    )}
                  </div>
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
                  {(provider.subcategories?.length ?? 0) > 0 && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      {provider.subcategories[0]?.name}
                    </p>
                  )}

                  {/* Badges — every one of these is earned, not decorative */}
                  <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                    {provider.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-200">
                        <Shield size={8} /> Verified
                      </span>
                    )}
                    {provider.isFeatured && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-full border border-violet-200">
                        <TrendingUp size={8} /> Featured
                      </span>
                    )}
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
                  {reviewCount > 0 ? (
                    <div className="flex items-center justify-center gap-1 mt-2.5">
                      <Stars rating={rating} size={13} />
                      <span className="text-sm font-black text-gray-900 ml-1">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({reviewCount})
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2.5">
                      No reviews yet
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-blue-500 flex-shrink-0" />
                    {locationStr}
                  </div>
                  {memberSince && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar
                        size={12}
                        className="text-blue-500 flex-shrink-0"
                      />
                      Member since {memberSince}
                    </div>
                  )}
                </div>

                {/* Stats */}
                {STATS.length > 0 && (
                  <div
                    className={`grid gap-0.5 mt-4 py-3.5 border-t border-b border-gray-100 ${
                      STATS.length === 3 ? "grid-cols-3" : "grid-cols-2"
                    }`}
                  >
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
                )}

                {/* Actions */}
                {!isCurrentUser ? (
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={handleHire}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all active:scale-95 shadow-md shadow-blue-200 text-sm flex items-center justify-center gap-2"
                    >
                      <Briefcase size={14} /> Post a Task
                    </button>
                    <div className="flex gap-2">
                      {providerEmail && (
                        <a
                          href={`mailto:${providerEmail}`}
                          className="flex-1 py-2.5 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageCircle size={13} /> Message
                        </a>
                      )}
                      {providerPhone && (
                        <a
                          href={`tel:${providerPhone}`}
                          className="flex-1 py-2.5 border-2 border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Phone size={13} /> Call
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Share2 size={12} />
                        {shareCopied ? "Link copied!" : "Share"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
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
                      onClick={() => router.push("/settings")}
                      className="w-full py-2.5 border-2 border-blue-200 hover:bg-blue-50 text-blue-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit3 size={13} /> Edit Profile
                    </button>
                  </div>
                )}
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
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <ServiceSection
                      provider={provider}
                      isCurrentUser={isCurrentUser}
                      isProfilePage
                    />
                  </div>
                )}

                {activeTab === "gallery" && (
                  <PortfolioGrid
                    items={gallery}
                    isCurrentUser={isCurrentUser}
                  />
                )}

                {activeTab === "reviews" && provider._id && (
                  <div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 mb-4 flex items-center gap-5">
                      <div className="text-center flex-shrink-0">
                        <p className="text-5xl font-black text-gray-900">
                          {reviewCount > 0 ? rating.toFixed(1) : "—"}
                        </p>
                        <Stars rating={rating} size={14} />
                        <p className="text-xs text-gray-400 mt-1">
                          {reviewCount > 0
                            ? `${reviewCount} review${
                                reviewCount !== 1 ? "s" : ""
                              }`
                            : "No reviews yet"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Reviews come only from clients on jobs completed
                        through Companies Center — no imported or anonymous
                        ratings.
                      </p>
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

                {activeTab === "certifications" && (
                  <CertificationsTab
                    certifications={(provider as any).certifications ?? []}
                  />
                )}
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
                onClick={handleHire}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 active:scale-95 transition-all"
              >
                <Briefcase size={14} /> Post a Task
              </button>
              {providerPhone && (
                <a
                  href={`tel:${providerPhone}`}
                  aria-label="Call"
                  className="w-12 h-12 border-2 border-gray-200 hover:border-blue-300 rounded-2xl flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone size={17} />
                </a>
              )}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share"
                className="w-12 h-12 border-2 border-gray-200 hover:border-blue-300 rounded-2xl flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Share2 size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
