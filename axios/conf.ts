import axios, { InternalAxiosRequestConfig } from "axios";

const createClient = () => {
  const apiClient = axios.create({
    baseURL:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "https://9qc99pwv-3333.uks1.devtunnels.ms/",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {


      console.log(config.url);
      // if (config.url?.startsWith("auth"))

      // if (config.url?.startsWith("auth")) {
      //   config.headers["x-device-id"] = await getDeviceId();
      //   config.headers["x-session-id"] = await getSessionId();
      // }

      return config;
    },
    (error) => Promise.reject(error)
  );



  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("API error:", error?.response?.data);
      if (error.response?.status === 403) {
        window.location.href = "/";
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
