import { ApiClientSingleton } from "@/axios/conf";
// import { Metric } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const getMetrics = async (range: string) => {
  const response = await axiosInstance.get(`admin/metrics?range=${range}`);
  return response.data;
};
