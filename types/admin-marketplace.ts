/**
 * Shared shapes for the admin marketplace + overview REST surface. These are
 * the response types served by `/admin/marketplace/*` and `/admin/overview`.
 * Kept in `types/` rather than `graphql/` because the data path is plain
 * REST — no GraphQL anywhere. Caching lives in TanStack Query under the
 * key builders in `hooks/admin/adminQueryKeys.ts`.
 */

import type { JobStatus } from "@/lib/jobs";

/** Admin invalidation scope — the keys the websocket bridge dispatches on.
 *  Mirrors the backend's `stats.invalidated` domain event payload. Phase 4
 *  of the WS upgrade moved this here from the now-deleted
 *  `hooks/useAdminLiveUpdates.ts`. */
export type AdminScope =
  | "tickets"
  | "disputes"
  | "fraud"
  | "moderation"
  | "users"
  | "providers"
  | "clients"
  | "jobs"
  | "dashboard";

export interface AdminConnection<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUserRow {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  activeRole?: string;
  /** Derived from the phone prefix (+1 → United States, +234 → Nigeria). */
  country?: "United States" | "Nigeria" | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isOnboardingComplete: boolean;
  isDeleted: boolean;
  averageRating: number;
  createdAt: string;
  provider?: {
    _id: string;
    providerName?: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    isBookable?: boolean;
    averageRating?: number;
  } | null;
}

export interface AdminUserDetail extends AdminUserRow {
  reviewCount: number;
  language?: string;
  address?: string;
  lastLoginAt?: string;
  updatedAt: string;
  deactivation?: {
    reason?: string;
    date?: string;
    initiatedBy?: string;
    /** Staff blocks: suspension | ban | deletion. */
    kind?: string;
    until?: string | null;
    reasonCode?: string;
  } | null;
  scheduledDeletionAt?: string | null;
  stats: { jobsPosted: number; jobsCompleted: number };
}

export interface AdminUserStatsShape {
  total: number;
  active: number;
  suspended: number;
  unverified: number;
  newLast30Days: number;
  byRole: { clients: number; providers: number; admins: number };
}

export interface AdminProviderRow {
  _id: string;
  providerName: string;
  providerEmail?: string;
  providerPhoneNumber?: string;
  isVerified: boolean;
  isFeatured: boolean;
  /** When a paid featured boost expires. Null/absent = manual/permanent feature. */
  featuredUntil?: string | null;
  isBookable: boolean;
  followersCount: number;
  reviewCount: number;
  averageRating: number;
  createdAt: string;
  owner?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface AdminProviderDetail extends AdminProviderRow {
  providerDescription?: string;
  isLiveTrackable: boolean;
  updatedAt: string;
  owner?: AdminProviderRow["owner"] & {
    phoneNumber?: string;
    isActive?: boolean;
  };
  stats: {
    jobsTaken: number;
    jobsCompleted: number;
    followers: number;
    rating: number;
  };
}

export interface AdminProviderStatsShape {
  total: number;
  verified: number;
  featured: number;
  bookable: number;
  newLast30Days: number;
  pendingKyc: number;
}

export interface AdminJobRow {
  _id: string;
  title: string;
  budget?: number | null;
  currency?: "USD" | "NGN";
  pricing?: "fixed" | "offers" | "estimates";
  /** The one job status (lib/jobs.ts). */
  status: JobStatus;
  /** Calendar day, "YYYY-MM-DD". */
  neededBy?: string | null;
  visibility?: "Public" | "Verified_Only";
  publishedAt?: string | null;
  createdAt: string;
  lifecycle?: { cancelledBy?: "client" | "provider" | "staff"; cancelledAt?: string } | null;
  userId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  providerId?: { _id: string; providerName?: string };
  subcategoryId?: { _id: string; name?: string };
}

export interface AdminJobDetail extends AdminJobRow {
  description: string;
  updatedAt: string;
  userId?: AdminJobRow["userId"] & { phoneNumber?: string };
  providerId?: AdminJobRow["providerId"] & { providerEmail?: string };
}

export interface AdminJobStatsShape {
  total: number;
  newLast30Days: number;
  /** Jobs per status, every status present (0 when none). */
  byStatus: Partial<Record<JobStatus, number>>;
}

export interface AdminUsersBundle {
  stats: AdminUserStatsShape;
  page: AdminConnection<AdminUserRow>;
}
export interface AdminProvidersBundle {
  stats: AdminProviderStatsShape;
  page: AdminConnection<AdminProviderRow>;
}
export interface AdminClientsBundle {
  page: AdminConnection<AdminUserRow>;
}
export interface AdminJobsBundle {
  stats: AdminJobStatsShape;
  page: AdminConnection<AdminJobRow>;
}

/* ─── Overview ────────────────────────────────────────────────────────── */

export interface AdminOverviewShape {
  overview: {
    kpis: {
      totalUsers?: number;
      activeUsers24h?: number;
      newUsersLast30?: number;
      providers?: number;
      clients?: number;
      jobsPosted?: number;
      jobsCompleted?: number;
      openJobs?: number;
      avgRating?: number;
    };
    /** Real 30-day growth rates (%), only for metrics with history. */
    deltas?: {
      totalUsers?: number;
      providers?: number;
      jobsPosted?: number;
    };
    /** Real cumulative daily totals for the Platform Overview chart. */
    series?: {
      date: string;
      users: number;
      jobs: number;
      providers: number;
    }[];
    jobStatusBreakdown: { status?: string; count: number }[];
  };
  ticketStats: {
    openTickets: number;
    waitingUser: number;
    escalated: number;
    resolved: number;
    slaBreached: number;
    avgFirstResponseMinutes?: number;
    avgResolutionMinutes?: number;
  };
  disputeStats: {
    open: number;
    underReview: number;
    escalated: number;
    resolved: number;
    awaiting: number;
  };
  fraudStats: {
    openAlerts: number;
    highRisk: number;
    criticalRisk: number;
    last24h: number;
  };
  moderationStats: {
    queued: number;
    reviewing: number;
    actioned: number;
    dismissed: number;
    escalated: number;
  };
  subscriptionStats: {
    active: number;
    trialing: number;
    pastDue: number;
    cancelled: number;
    mrrCents: number;
  };
  badges: {
    openTickets?: number;
    openDisputes?: number;
    fraudAlerts?: number;
    moderationQueue?: number;
    openJobs?: number;
  };
  recentActivities: {
    recentUsers: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      activeRole?: string;
      createdAt?: string;
    }[];
    recentJobs: {
      _id: string;
      title?: string;
      budget?: number;
      status?: string;
      createdAt?: string;
      clientName?: string;
      providerName?: string;
    }[];
    recentProviders: {
      _id: string;
      providerName?: string;
      isVerified?: boolean;
      isFeatured?: boolean;
      averageRating?: number;
      reviewCount?: number;
      createdAt?: string;
    }[];
  };
  topProviders: AdminOverviewShape["recentActivities"]["recentProviders"];
  recentJobs: AdminOverviewShape["recentActivities"]["recentJobs"];
  systemHealth?: any;
}
