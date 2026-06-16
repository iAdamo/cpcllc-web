/**
 * Shared shapes for the admin marketplace + overview REST surface. These are
 * the response types served by `/admin/marketplace/*` and `/admin/overview`.
 * Kept in `types/` rather than `graphql/` because the data path is plain
 * REST + Zustand — no GraphQL anywhere.
 */

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
  | "tasks";

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
  } | null;
  stats: { tasksPosted: number; tasksCompleted: number };
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
    tasksTaken: number;
    tasksCompleted: number;
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

export interface AdminTaskRow {
  _id: string;
  title: string;
  budget: number;
  status: string;
  urgency?: string;
  visibility?: string;
  isActive: boolean;
  createdAt: string;
  userId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  providerId?: { _id: string; providerName?: string };
  subcategoryId?: { _id: string; name?: string };
}

export interface AdminTaskDetail extends AdminTaskRow {
  description: string;
  negotiable: boolean;
  deadline?: string;
  contactPreference: string[];
  tags: string[];
  anonymous: boolean;
  updatedAt: string;
  userId?: AdminTaskRow["userId"] & { phoneNumber?: string };
  providerId?: AdminTaskRow["providerId"] & { providerEmail?: string };
}

export interface AdminTaskStatsShape {
  total: number;
  newLast30Days: number;
  byStatus: {
    active: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
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
export interface AdminTasksBundle {
  stats: AdminTaskStatsShape;
  page: AdminConnection<AdminTaskRow>;
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
      tasksPosted?: number;
      tasksCompleted?: number;
      openTasks?: number;
      avgRating?: number;
    };
    taskStatusBreakdown: { status?: string; count: number }[];
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
    openTasks?: number;
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
    recentTasks: {
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
  recentTasks: AdminOverviewShape["recentActivities"]["recentTasks"];
  systemHealth?: any;
}
