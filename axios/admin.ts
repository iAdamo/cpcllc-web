import { ApiClientSingleton } from "@/axios/conf";
import { AdminMetrics } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const getMetrics = async (range: string): Promise<AdminMetrics> => {
  const response = await axiosInstance.get(`admin/metrics?range=${range}`);
  return response.data;
};
