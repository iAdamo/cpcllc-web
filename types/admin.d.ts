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

// types/index.ts
export type TimeGranularity = 'daily' | 'monthly';

export interface MetricsRequest {
  granularity: TimeGranularity;
  year: number;
  month?: number | null;
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

// types/index.ts (updated)
export interface MetricsResponse {
  summary: MetricsSummary;
  timeSeries: TimeSeriesDataPoint[];
  comparison: PeriodComparison; // Single comparison, not nested
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

export interface YearOverYearComparison {
  usersGrowth: number;
  clientsGrowth: number;
  providersGrowth: number;
}

export interface Insight {
  type: 'positive' | 'negative' | 'neutral';
  message: string;
  metric: string;
  value: number;
}

// export interface MetricsResponse {
//   summary: MetricsSummary;
//   timeSeries: TimeSeriesDataPoint[];
//   comparisons: {
//     previousPeriod: PeriodComparison;
//     yearOverYear: YearOverYearComparison;
//   };
//   insights: Insight[];
// }
