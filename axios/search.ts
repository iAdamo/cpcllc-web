import { ApiClientSingleton } from "./conf";
import { CompanyData, ServiceData } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const globalSearch = async ({
  model,
  page,
  limit,
  engine,
  searchInput,
  lat,
  long,
  address,
  sortBy,
  categories,
  featured,
  city,
  state,
  country,
  radius,
}: {
  model: "providers" | "services" | "jobs";
  page: number;
  limit: number;
  engine: boolean;
  searchInput?: string;
  lat?: string;
  long?: string;
  address?: string;
  sortBy?: string;
  categories?: string[];
  featured?: boolean;
  city?: string;
  state?: string;
  country?: string;
  radius?: string;
}): Promise<{
  type?: "suggestions" | "providers" | "jobs" | "services";
  data: {
    suggestions?: any[];
    providers: CompanyData[];
    services?: ServiceData[];
    jobs?: any[];
    page: number;
  };
  page: number;
  totalPages: number;
  featuredRatio?: number;
}> => {
  const params: Record<string, any> = {};
  if (model) params.model = model;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (engine) params.engine = engine;
  if (searchInput) params.searchInput = searchInput;
  if (lat) params.lat = lat;
  if (long) params.long = long;
  if (address) params.address = address;
  if (sortBy) params.sortBy = sortBy;
  if (categories && categories.length > 0) {
    params.subcategories = categories.join(",");
  }
  if (featured !== undefined) params.featured = featured;
  if (city) params.city = city;
  if (state) params.state = state;
  if (country) params.country = country;
  if (radius) params.radius = radius;

  console.log("Executing search with params:", params);

  const response = await axiosInstance.get("search", { params });
  return response.data;
};
