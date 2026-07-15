import axios, { InternalAxiosRequestConfig } from "axios";
import { getDeviceId, getSessionId } from "@/utils/Device";

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

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

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

      // 403 means signed in but not allowed (RBAC, terms) — surface the
      // error to the caller instead of yanking the user to the homepage.
      if (error.message === "Network Error") {
        console.warn("Network error — check the internet connection.");
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
