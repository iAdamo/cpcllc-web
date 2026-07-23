import {
  AuthState,
  UserData,
  ActiveRole,
  RegisterUser,
  LoginUser,
  DeactivateAccountData,
  ServiceData,
  ServiceCategory,
  Subcategory,
  SearchResultData,
  MetricsResponse,
  MetricsRequest,
  TimeSeriesData,
  DashboardView,
  ProviderData,
  JobData,
} from "@/types";

// ── Unified search filters ─────────────────────────────────────────────────────
export interface SearchFilters {
  query?: string;
  location?: string;
  country?: string;
  lat?: number;
  long?: number;
  sortBy?: string;
  // Provider-specific
  categoryIds?: string[];
  verifiedOnly?: boolean;
  minRating?: number;
  radius?: string;
  topRated?: boolean;
  openNow?: boolean;
  // Jobs-specific
  category?: string;
  urgency?: string;
}

// ── Search state (client side only — results live in TanStack Query) ─────────
export interface SearchState {
  searchModel: "providers" | "tasks";
  setSearchModel: (model: "providers" | "tasks") => void;

  searchFilters: SearchFilters;
  setSearchFilters: (f: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;

  filteredProviders: ProviderData[];
  filteredJobs: JobData[];
  setFilteredProviders: (p: ProviderData[]) => void;
  setFilteredJobs: (j: JobData[]) => void;
  clearFiltered: () => void;
}

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
// ── Dashboard UI state (metrics data lives in hooks/admin/useMetrics.ts) ─────
export interface DashboardState {
  activeView: DashboardView;
  sidebarOpen: boolean;

  granularity: TimeGranularity;
  selectedYear: number;
  selectedMonth: number | null;

  setActiveView: (view: DashboardView) => void;
  toggleSidebar: () => void;
  setGranularity: (granularity: TimeGranularity) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number | null) => void;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  signUp: (userData: RegisterUser) => Promise<void>;
  login: (credentials: LoginUser) => Promise<void>;
  logout: (data?: DeactivateAccountData) => Promise<void>;
}

// ── Session identity + live presence (profiles: hooks/useUserProfile.ts) ─────
export interface UserState {
  availability: Record<string, PresenceResponse>;
  setAvailability: (data: Partial<PresenceResponse>) => void;
  updateProfile: (updates: Partial<UserData>) => void;
  updateUserProfile: (role: ActiveRole, data?: FormData) => Promise<void>;
}

// ── Selection + bookmarks (categories: useCategories; results: useGlobalSearch)
export interface ProviderState {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  selectedSubcategories: Subcategory[];
  setSelectedSubcategories: (subs: Subcategory[]) => void;
  toggleSubcategory: (sub: Subcategory) => void;
  clearSelectedSubcategories: () => void;
  savedProviders: ProviderData[];
  savedJobs: JobData[];
  setSavedJobs: (job: JobData) => void;
  setSavedProviders: (providerId: string) => Promise<ProviderData[] | void>;
}

export interface LocationState {
  currentLocation: (LocationObject & LocationGeocodedAddress) | null;
  liveLocation: LocationObject | null;
  isTracking: boolean;
  watchId: LocationSubscription | null;
  places: Place[];
  locationError: string | null;
  clearLocationError: () => void;
  selectedPlace: PlaceDetails | null;
  getCurrentLocation: () => Promise<
    (LocationObject & LocationGeocodedAddress) | undefined
  >;
  startLiveTracking: () => Promise<void>;
  stopLiveTracking: () => void;
  setSelectedPlace: (place: PlaceDetails) => void;
  searchPlaces: (query: string) => Promise<void>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | undefined>;
}

export interface OnboardingData {
  role?: "Client" | "Provider";
  firstName?: string;
  lastName?: string;
  homeAddress?: string;
  profilePictureFile?: File | null;
  providerName?: string;
  providerTagline?: string;
  providerDescription?: string;
  providerLogoFile?: File | null;
  providerEmail?: string;
  providerPhoneNumber?: string;
  phoneCountry?: string;
  subcategories?: Array<{
    _id: string;
    name: string;
    categoryId: string;
    categoryName: string;
  }>;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  providerImageFiles?: File[];
}

export interface OnboardingState {
  onboardingStep: number;
  onboardingData: OnboardingData;
  setOnboardingStep: (step: number) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  submitOnboarding: () => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
}

import type { AdminPresenceState } from "@/stores/adminPresenceState";

export type GlobalStore = GlobalState &
  DashboardState &
  AuthState &
  UserState &
  ProviderState &
  LocationState &
  OnboardingState &
  SearchState &
  AdminPresenceState;
