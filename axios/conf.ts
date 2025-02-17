import axios, { InternalAxiosRequestConfig } from "axios";
import { useStorageState } from "@/hooks/useStorageState";


const createClient = () => {
  // const [[_, token], setToken] = useStorageState<string>("token");
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

      return config;
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 403) {
      } else if (error.message === "Network Error") {
        console.error("Network Error: Please check your internet connection.");
      } else if (!error.response) {
        console.error("Server is unavailable. Please try again later.");
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
