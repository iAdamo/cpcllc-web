/* ─────────────────────────  Admin Analytics  ───────────────────────── */

export interface AdminMetrics {
  summary: MetricsSummary;
  timeSeries: TimeSeriesData[];
}

export interface MetricsSummary {
  users: number;
  clients: number;
  providers: number;
  activeProviders: number;
  newUsers: number;
  newClients: number;
  newProviders: number;
  growthRate: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  clients: number;
  providers: number;
  activeProviders: number;
}

export type TimeGranularity = "daily" | "monthly";

export interface MetricsRequest {
  granularity: TimeGranularity;
  year: number;
  month?: number | null;
}

export interface TimeSeriesDataPoint {
  date: string;
  label: string;
  users: number;
  clients: number;
  providers: number;
  activeProviders: number;
  newUsers: number;
  cumulativeUsers: number;
}

export interface MetricsResponse {
  summary: MetricsSummary;
  timeSeries: TimeSeriesDataPoint[];
  comparison: PeriodComparison;
  insights: Insight[];
}

export interface PeriodComparison {
  usersChange: number;
  clientsChange: number;
  providersChange: number;
  activeProvidersChange: number;
  newUsersChange: number;
  percentageChange: number;
}

export interface Insight {
  type: "positive" | "negative" | "neutral";
  message: string;
  metric: string;
  value: number;
}

/* ─────────────────────────  Sidebar / Views  ───────────────────────── */

export type AdminView =
  | "dashboard"
  | "users"
  | "providers"
  | "clients"
  | "tasks"
  | "bookings"
  | "projects"
  | "messages"
  | "payments"
  | "wallets"
  | "withdrawals"
  | "escrow"
  | "disputes"
  | "reviews"
  | "reports"
  | "moderation"
  | "support"
  | "notifications"
  | "marketing"
  | "analytics"
  | "fraud"
  | "compliance"
  | "system_health"
  | "feature_flags"
  | "cms"
  | "settings"
  | "roles"
  | "audit"
  | "api"
  | "integrations"
  | "subscriptions"
  | "logout";

// Back-compat with old DashboardView usages
export type DashboardView = AdminView;
export type TimeRange = "1d" | "7d" | "30d" | "90d" | "1y";

/* ─────────────────────────  Enterprise admin entities  ───────────────────────── */

export interface DashboardOverviewKpis {
  totalUsers: number;
  activeUsers24h: number;
  newUsersLast30: number;
  providers: number;
  clients: number;
  tasksPosted: number;
  tasksCompleted: number;
  openTasks: number;
  avgRating: number | null;
}

export interface DashboardOverview {
  kpis: DashboardOverviewKpis;
  taskStatusBreakdown: { status: string; count: number }[];
}

export interface RecentActivities {
  recentUsers: any[];
  recentTasks: any[];
  recentProviders: any[];
}

export interface SystemHealthSnapshot {
  generatedAt: string;
  services: Record<
    string,
    { status: string; latencyMs?: number | null; error?: string }
  >;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
    externalMb: number;
  };
  uptime: { seconds: number; formatted: string };
}

export interface AdminUserMe {
  _id: string;
  user: string;
  role: string;
  extraPermissions: string[];
  deniedPermissions: string[];
  department?: string;
  isActive: boolean;
  permissions: string[];
}

export interface TicketStats {
  openTickets: number;
  waitingUser: number;
  escalated: number;
  resolved: number;
  slaBreached: number;
  avgFirstResponseMinutes: number | null;
  csatScore: number | null;
  csatResponses: number;
}

export interface DisputeStats {
  open: number;
  underReview: number;
  escalated: number;
  resolved: number;
  awaitingEvidence: number;
}

export interface FraudStats {
  openAlerts: number;
  highRisk: number;
  criticalRisk: number;
  last24h: number;
}

export interface SubscriptionStats {
  activeSubscriptions: number;
  trialing: number;
  pastDue: number;
  cancelledThisMonth: number;
  mrrCents: number;
}
