import {
  AuthState,
  UserData,
  ActiveRole,
  RegisterUser,
  LoginUser,
} from "@/types";
import {
  MetricsResponse,
  MetricsRequest,
  TimeSeriesData,
  DashboardView,
} from "./admin";

export interface GlobalState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  info: string | null;
  setInfo: (info: string | null) => void;
  setSuccess: (success: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  switchRole: ActiveRole;
  setSwitchRole: (role: ActiveRole) => Promise<void>;
  paramsFrom: string | null;
  setParamsFrom: (params: string | null) => void;
  clearInfo: () => void;
  clearSuccess: () => void;
  clearError: () => void;
  // progress: number;
  // setProgress: (progress: number) => void;
  networkError: boolean;
  // failedRequests: FailedRequest[];
  // setNetworkError: (status: boolean) => void;
  // addFailedRequest: (request: FailedRequest) => void;
  // clearFailedRequests: () => void;
  // needsAcceptance: boolean;
  // isChecking: boolean;
  // requiredTerms: RequiredTerms[];
  // markAsAccepted: () => Promise<void>;
  // resetAcceptance: () => void;
  // setRequiredTerms: (terms: RequiredTerms[]) => void;
  // finishChecking: () => void;
  // config: AppConfigRes | null;
  // versionState: VersionState;
  // appLoading: boolean;
  // setConfig: (config: AppConfigRes | null) => void;
  // setVersionState: (versionState: VersionState) => void;
  // setAppLoading: (loading: boolean) => void;
  // rateUsTracking: RateUsTrackingState;
  // incrementSession: () => void;
  // recordPromptShown: () => void;
  // markNeverShow: () => void;
  // resetRateUsTracking: () => void;
}
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

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  signUp: (userData: RegisterUser) => Promise<void>;
  login: (credentials: LoginUser) => Promise<void>;
  logout: (data?: DeactivateAccountData) => Promise<void>;
}

export interface UserState {
  availability: Record<string, PresenceResponse>; // otherAvailability: PresenceResponse | null;
  isFollowing: boolean;
  otherUser: UserData | null;
  setOtherUser: (user: UserData | null) => void;
  setAvailability: (data: Partial<PresenceResponse>) => void; // setOtherAvailability: (availability: PresenceResponse) => void;
  updateProfile: (updates: Partial<UserData>) => void;
  updateUserProfile: (role: ActiveRole, data?: FormData) => Promise<void>;
  fetchUserProfile: (userId?: string) => Promise<void>;
  toggleFollow: (providerId: string) => Promise<void>;
}

export interface ProviderState {
  isSearching: boolean;
  sortBy: sortByType;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedSubcategories: Subcategory[];
  setSelectedSubcategories: (subs: Subcategory[]) => void;
  toggleSubcategory: (sub: Subcategory) => void;
  clearSelectedSubcategories: () => void;
  setSortBy: (sortBy: SortBy) => void;
  searchResults: SearchResultData;
  filteredProviders: ProviderData[];
  setFilteredProviders: (providers: ProviderData[]) => void;
  savedProviders: ProviderData[];
  savedJobs: JobData[];
  filteredJobs: JobData[];
  setFilteredJobs: (jobs: JobData[]) => void;
  setSavedJobs: (job: JobData) => void;
  setSavedProviders: (providerId: string) => Promise<ProviderData[] | void>;
  setSearchResults: (results: SearchResultData) => void;
  executeSearch: (params: SearchParams) => Promise<void>;
  clearSearchResults: () => void;
}

export type GlobalStore = GlobalState &
  DashboardState &
  AuthState &
  UserState &
  ProviderState;
