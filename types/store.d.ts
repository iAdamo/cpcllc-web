import {
  MetricsResponse,
  MetricsRequest,
  TimeSeriesData,
  DashboardView,
} from "./admin";

export interface DashboardState {
  // UI State
  activeView: DashboardView;
  sidebarOpen: boolean;

  // Selection State
  granularity: TimeGranularity;
  selectedYear: number;
  selectedMonth: number | null;

  // Data
  metricsData: MetricsResponse | null;

  // Status
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
  setGranularity: (granularity: TimeGranularity) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number | null) => void;
  fetchMetrics: () => Promise<void>;


  users: UserData[];
  metricsSummary: MetricsSummary | null;
  timeSeries: TimeSeriesData[];

  fetchUsers: () => Promise<void>;
  fetchMetrics: (params: MetricsRequest) => Promise<void>;
}

export type GlobalStore = DashboardState;
