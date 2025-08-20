import { ApiClientSingleton } from "./conf";
import { CompanyData, ServiceData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const globalSearch = async (
  page: number,
  limit: number,
  engine: boolean,
  searchInput?: string,
  lat?: string,
  long?: string,
  address?: string
): Promise<{
  companies: CompanyData[];
  services?: ServiceData[];
  totalPages: number;
}> => {
  const params: Record<string, any> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (engine) params.engine = engine;
  if (searchInput) params.searchInput = searchInput;
  if (lat) params.lat = lat;
  if (long) params.long = long;
  if (address) params.address = address;

  const response = await axiosInstance.get("search/companies", { params });
  return response.data;
};
