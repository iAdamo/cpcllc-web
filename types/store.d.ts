export interface DashboardState {
  activeView: DashboardView;
  sidebarOpen: boolean;
  timeRange: TimeRange;

  users: UserData[];
  metricsSummary: MetricsSummary | null;
  timeSeries: TimeSeriesData[];

  isLoading: boolean;
  error: string | null;

  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
  setTimeRange: (range: TimeRange) => void;

  fetchUsers: () => Promise<void>;
  fetchMetrics: (range: TimeRange) => Promise<void>;
}


export type GlobalStore = DashboardState;
