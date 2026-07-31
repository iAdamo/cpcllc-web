import axios, { InternalAxiosRequestConfig } from "axios";
import { getDeviceId, getSessionId } from "@/utils/Device";
import { AppErrorService } from "@/lib/errorService";
import { createSingleFlight } from "@/lib/singleFlight";

const PROD_FALLBACK_WARNING =
  "NEXT_PUBLIC_API_URL is not set — API requests will fail. Set it in the deployment environment.";

const resolveBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) console.error(PROD_FALLBACK_WARNING);
    return url;
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://9qc99pwv-3333.uks1.devtunnels.ms/"
  );
};

const createClient = () => {
  const apiClient = axios.create({
    baseURL: resolveBaseUrl(),
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.url?.startsWith("auth")) {
        config.headers["x-device-id"] = getDeviceId();
        config.headers["x-session-id"] = getSessionId();
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Trade the (httpOnly) refresh cookie for a fresh access cookie. Single-flight
  // so concurrent 401s fire it once.
  const runRefresh = createSingleFlight(() =>
    apiClient.post("/auth/refresh", {}, { withCredentials: true }),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const original = error.config;
      // Auth endpoints (login/register/refresh/logout/verify): a 401 is a real
      // credential/session error, not an expired access token — never refresh-retry.
      const isAuthCall = (original?.url ?? "").includes("/auth/");

      // Access token expired → refresh once and replay the original request.
      // A dead refresh token rejects here and falls through to the redirect.
      if (status === 401 && original && !original._retry && !isAuthCall) {
        original._retry = true;
        try {
          await runRefresh();
          return apiClient(original);
        } catch {
          // fall through — refresh failed, treat as a real session expiry
        }
      }

      // Normalize once, centrally. Callers read error.appError for the
      // specific backend message (no screen re-interprets status codes).
      const normalized = AppErrorService.fromApiError(error);
      error.appError = normalized;

      // Report server/network failures automatically. 4xx business errors are
      // reported by the caller's notify.error so we don't double-count expected
      // validation/permission responses. Never report the /errors/report call.
      const isReportCall = (error.config?.url ?? "").includes("errors/report");
      if (
        !isReportCall &&
        (normalized.category === "server" ||
          normalized.category === "network" ||
          normalized.severity === "critical")
      ) {
        AppErrorService.report(normalized);
      }

      // Session expired on a protected page — send the user to sign-in.
      // Public pages (home, search) may fire unauthenticated calls for
      // guests; those must never bounce the visitor to a login wall.
      if (status === 401 && typeof window !== "undefined") {
        const path = window.location.pathname;
        const protectedPrefixes = ["/admin", "/settings", "/favorites", "/tasks/create"];
        if (protectedPrefixes.some((p) => path.startsWith(p))) {
          window.location.href = `/auth/signin?next=${encodeURIComponent(path)}`;
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export class ApiClientSingleton {
  public axiosInstance: ReturnType<typeof createClient>;
  public static instance: ApiClientSingleton;

  private constructor() {
    this.axiosInstance = createClient();
  }

  public static getInstance(): ApiClientSingleton {
    if (!ApiClientSingleton.instance) {
      ApiClientSingleton.instance = new ApiClientSingleton();
      Object.freeze(ApiClientSingleton.instance);
    }
    return ApiClientSingleton.instance;
  }

  public getAxiosInstance() {
    return this.axiosInstance;
  }
}
