"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Briefcase,
  Bookmark,
  Send,
  BarChart2,
  ChevronRight,
  Zap,
  Menu,
  X,
  Star,
  TrendingUp,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { useCategories } from "@/hooks/useCategories";
import { getMyProposals } from "@/axios/service";
import { JobData, ProposalData } from "@/types";
import JobCard from "./JobCard";
import ProposalModal from "./ProposalModal";
import JobDetailPanel from "./JobDetailPanel";

type ViewId = "explore" | "proposals" | "saved" | "analytics";

const NAV: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "explore", label: "Explore Tasks", icon: Search },
  { id: "proposals", label: "My Proposals", icon: Send },
  { id: "saved", label: "Saved Tasks", icon: Bookmark },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

const SORT_OPTIONS = ["Newest", "Oldest", "Budget", "Relevance"];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <p className="text-2xl font-black leading-none">{value}</p>
      <p className="text-[11px] font-semibold mt-1 opacity-70">{label}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
      <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full w-24 mb-3" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full mb-1.5" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3 mb-4" />
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-xl w-20" />
    </div>
  );
}

export default function JobsPage() {
  const {
    user,
    savedJobs,
    jobResults,
    filteredJobs,
    switchRole,
    executeSearch,
    loadMore,
    setSearchModel,
    setSearchFilters,
    currentLocation,
    isSearching,
    isLoadingMore,
    searchPage,
    searchTotalPages,
    searchTotal,
  } = useGlobalStore();
  const isProvider = switchRole === "Provider";

  // UI
  const [activeView, setActiveView] = useState<ViewId>("explore");
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [proposalJob, setProposalJob] = useState<JobData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const hasMore = searchPage < searchTotalPages;
  const fetchingRef = useRef<boolean>(false);

  // Filters
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  // Proposals — seeded with sample data so the UI never looks empty
  const [myProposals, setMyProposals] = useState<ProposalData[]>([
    {
      _id: "demo-1", id: "demo-1",
      message: "I have 5 years of experience in this area and can deliver within your budget.",
      proposedPrice: 850, estimatedDuration: "3 days",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      jobId: { _id: "j1", title: "Fix kitchen plumbing leak" } as any,
      providerId: {} as any, viewedByClient: true, attachments: [],
    },
    {
      _id: "demo-2", id: "demo-2",
      message: "Ready to start immediately. Please review my profile for past work.",
      proposedPrice: 1200, estimatedDuration: "1 week",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      jobId: { _id: "j2", title: "Deep clean 3-bedroom apartment" } as any,
      providerId: {} as any, viewedByClient: false, attachments: [],
    },
    {
      _id: "demo-3", id: "demo-3",
      message: "Fully licensed electrician. Can handle all wiring and panel upgrades.",
      proposedPrice: 2400, estimatedDuration: "2 days",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      jobId: { _id: "j3", title: "Install outdoor lighting system" } as any,
      providerId: {} as any, viewedByClient: true, attachments: [],
    },
  ]);

  const { data: categoriesData } = useCategories();
  const categories = categoriesData ?? [];

  // Bootstrap: set model and kick off initial search
  useEffect(() => {
    setSearchModel("jobs");
    executeSearch({
      model: "jobs",
      sortBy,
      lat: currentLocation?.coords.latitude,
      long: currentLocation?.coords.longitude,
      country: currentLocation?.country || "United States",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-search when filters or location change
  useEffect(() => {
    setSearchFilters({
      sortBy,
      urgency: urgencyFilter,
      category: activeCategory,
    });
    executeSearch({
      model: "jobs",
      sortBy,
      lat: currentLocation?.coords.latitude,
      long: currentLocation?.coords.longitude,
      country: currentLocation?.country || "United States",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, sortBy, urgencyFilter, activeCategory]);

  const total = searchTotal;

  const appliedJobIds = useMemo(
    () =>
      new Set(
        myProposals.map((p) => ((p.jobId as any)?._id ?? p.jobId) as string)
      ),
    [myProposals]
  );

  const fetchProposals = useCallback(() => {
    const id = user?.activeRoleId?._id;
    if (!isProvider || !id) return;
    getMyProposals()
      .then((d) => setMyProposals(d as ProposalData[]))
      .catch(() => {});
  }, [isProvider, user?.activeRoleId?._id]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onEndReached = useCallback(() => {
    if (isLoadingMore || !hasMore || fetchingRef.current) return;
    fetchingRef.current = true;
    loadMore().finally(() => {
      fetchingRef.current = false;
    });
  }, [isLoadingMore, hasMore, loadMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isSearching && !isLoadingMore)
          onEndReached();
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, isSearching, isLoadingMore, onEndReached]);

  const handleApply = useCallback((job: JobData) => {
    setProposalJob(job);
  }, []);

  const displayedJobs = useMemo(() => {
    if (activeView === "saved") return savedJobs;
    if (activeView === "proposals")
      return myProposals
        .map((p) => p.jobId as unknown as JobData)
        .filter(Boolean);
    // Prefer client-side filtered results (from navbar search) over raw API results
    return filteredJobs.length > 0 ? filteredJobs : jobResults;
  }, [activeView, jobResults, filteredJobs, savedJobs, myProposals]);

  const viewTitle =
    activeView === "proposals"
      ? "My Proposals"
      : activeView === "saved"
      ? "Saved Tasks"
      : activeView === "analytics"
      ? "Analytics"
      : "Explore Tasks";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Left sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed top-20 bottom-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-gray-900 dark:text-white text-sm">
                Task Hub
              </h2>
              {isProvider && user?.activeRoleId?.providerName && (
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                  {user.activeRoleId.providerName}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => {
            const badge =
              id === "proposals"
                ? myProposals.length
                : id === "saved"
                ? savedJobs.length
                : 0;
            const active = activeView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveView(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  className={
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400"
                  }
                />
                <span className="flex-1 text-left">{label}</span>
                {badge > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="p-3 shrink-0">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} className="text-yellow-300" />
              <span className="text-xs font-black">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-blue-100/80 leading-relaxed mb-3">
              Early task access, proposal templates & detailed analytics.
            </p>
            <button
              type="button"
              className="w-full text-[11px] font-black bg-white/20 hover:bg-white/30 text-white rounded-xl py-2 transition-colors"
            >
              Learn More →
            </button>
          </div>
        </div>
      </aside>

      {/* ── Content wrapper ─────────────────────────────────────── */}
      <div className="lg:ml-64 xl:mr-80 min-h-[calc(100vh-5rem)]">
        {/* Sticky toolbar */}
        <div className="sticky top-20 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          {/* Search row */}
          <div className="px-4 py-3 flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <Menu size={16} />
            </button>
            <div className="ml-auto flex flex-row gap-4">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={`flex-shrink-0 flex gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border transition-all ${
                  showFilters
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                {(["list", "grid"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${
                      viewMode === m
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                        : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    aria-label={m === "list" ? "List view" : "Grid view"}
                  >
                    {m === "list" ? <List size={15} /> : <Grid3X3 size={15} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
              >
                <div className="px-4 py-3 flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      title="Sort by"
                      className="text-xs font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Urgency
                    </label>
                    <div className="flex gap-1.5">
                      {["", "Normal", "Urgent", "Immediate"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUrgencyFilter(u)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                            urgencyFilter === u
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {u || "All"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category chips */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-50 dark:border-gray-800/50 scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                activeCategory === ""
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Tasks
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() =>
                  setActiveCategory(activeCategory === cat.name ? "" : cat.name)
                }
                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                  activeCategory === cat.name
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content ──────────────────────────────────────── */}
        <main className="p-4">
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-base font-black text-gray-900 dark:text-white">
              {viewTitle}
            </h1>
            {activeView === "explore" && (
              <p className="text-xs text-gray-400 mt-0.5">
                {isSearching
                  ? "Loading tasks…"
                  : `${total.toLocaleString()} tasks available`}
              </p>
            )}
          </div>

          {/* Analytics view */}
          {activeView === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  label="Proposals Sent"
                  value={myProposals.length}
                  color="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                />
                <StatCard
                  label="Saved Tasks"
                  value={savedJobs.length}
                  color="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                />
                <StatCard
                  label="Proposals Viewed"
                  value={myProposals.filter((p) => p.viewedByClient).length}
                  color="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400"
                />
                <StatCard
                  label="Tasks Available"
                  value={total}
                  color="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                />
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center justify-center gap-3 text-center min-h-48">
                <BarChart2
                  size={32}
                  className="text-gray-200 dark:text-gray-700"
                />
                <p className="text-sm font-bold text-gray-400">
                  Detailed analytics coming soon
                </p>
                <p className="text-xs text-gray-400">
                  Upgrade to Pro to unlock earnings charts, win rate & more.
                </p>
              </div>
            </div>
          )}

          {/* Skeleton */}
          {activeView !== "analytics" && isSearching && (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {activeView !== "analytics" &&
            !isSearching &&
            displayedJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Briefcase
                    size={28}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white mb-1 text-sm">
                  No tasks found
                </h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  {activeView === "saved"
                    ? "Tasks you bookmark will appear here."
                    : activeView === "proposals"
                    ? "You haven't submitted any proposals yet."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            )}

          {/* Cards */}
          {activeView !== "analytics" &&
            !isSearching &&
            displayedJobs.length > 0 && (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {displayedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSelect={setSelectedJob}
                    onApply={handleApply}
                    isSelected={selectedJob?._id === job._id}
                    hasApplied={appliedJobIds.has(job._id)}
                  />
                ))}
              </div>
            )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-4 flex justify-center">
            {(isSearching || isLoadingMore) && (
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
            {!hasMore &&
              !isSearching &&
              !isLoadingMore &&
              activeView === "explore" &&
              displayedJobs.length > 0 && (
                <p className="text-xs text-gray-400">All tasks loaded</p>
              )}
          </div>
        </main>
      </div>

      {/* ── Right sidebar (desktop only) ─────────────────────── */}
      <aside className="hidden xl:flex fixed right-0 top-20 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 flex-col z-10 overflow-y-auto">
        {selectedJob ? null : (
          <div className="p-4 space-y-5">
            {/* Stats */}
            <div>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-3.5">
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
                    {myProposals.length}
                  </p>
                  <p className="text-[11px] text-blue-500 font-semibold mt-0.5">
                    Proposals
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-3.5">
                  <p className="text-2xl font-black text-green-700 dark:text-green-400">
                    {savedJobs.length}
                  </p>
                  <p className="text-[11px] text-green-500 font-semibold mt-0.5">
                    Saved
                  </p>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950/30 rounded-2xl p-3.5">
                  <p className="text-2xl font-black text-violet-700 dark:text-violet-400">
                    {myProposals.filter((p) => p.viewedByClient).length}
                  </p>
                  <p className="text-[11px] text-violet-500 font-semibold mt-0.5">
                    Viewed
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-3.5">
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-400">
                    {total}
                  </p>
                  <p className="text-[11px] text-amber-500 font-semibold mt-0.5">
                    Available
                  </p>
                </div>
              </div>
            </div>

            {/* Recent proposals */}
            {myProposals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Recent Proposals
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveView("proposals")}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {myProposals.slice(0, 3).map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                        <Send
                          size={13}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                          {(p.jobId as any)?.title ?? "Task"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ${p.proposedPrice?.toLocaleString()}
                        </p>
                      </div>
                      {p.viewedByClient && (
                        <span className="text-[9px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          Viewed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top categories */}
            {categories.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Top Categories
                </h3>
                <div className="space-y-1">
                  {categories.slice(0, 6).map((cat, i) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        setActiveView("explore");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 flex items-center justify-center text-[11px] font-black text-blue-700 dark:text-blue-400 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate transition-colors">
                        {cat.name}
                      </span>
                      <ChevronRight
                        size={12}
                        className="text-gray-300 dark:text-gray-600"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pro tip */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star size={13} className="text-yellow-400" />
                <span className="text-xs font-black">Pro Tip</span>
              </div>
              <p className="text-[11px] text-blue-200/80 leading-relaxed">
                Proposals with a clear cover letter and competitive price
                receive 3× more responses.
              </p>
            </div>

            {/* Trending indicator */}
            <div className="flex items-center gap-2 px-1">
              <TrendingUp size={13} className="text-blue-500" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Technology & IT
                </span>{" "}
                is trending today
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Job detail panel — slides in from right over right sidebar */}
      <JobDetailPanel
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
        hasApplied={selectedJob ? appliedJobIds.has(selectedJob._id) : false}
      />

      {/* Proposal modal */}
      <ProposalModal
        job={proposalJob}
        onClose={() => setProposalJob(null)}
        onSuccess={fetchProposals}
      />
    </div>
  );
}
