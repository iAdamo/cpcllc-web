export interface AdminMetrics {
  summary: MetricsSummary;
  timeSeries: TimeSeriesData[];
}

export interface MetricsSummary {
  users: number;
  clients: number;
  providers: number;
  activeProviders: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  clients: number;
  providers: number;
  activeProviders: number;
}


export type DashboardView = "dashboard" | "users" | "settings" | "analytics";
// export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";
export type TimeRange = "1d" | "7d" | "30d" | "90d" | "1y";