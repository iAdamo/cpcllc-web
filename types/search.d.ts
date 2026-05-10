import { ProviderData } from "./provider";
import { ServiceData } from "./service";
import { JobData } from "./service";

export type SortBy =
  | "Relevance"
  | "Newest"
  | "Oldest"
  | "Location"
  | "Top Rated"
  | "Most Reviewed";

export interface SearchParams {
  model: "providers" | "services" | "jobs";
  page: number;
  limit: number;
  engine: boolean;
  featured?: boolean;
  searchInput?: string;
  lat?: number;
  long?: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  sortBy?: string;
  categories?: string[];
}

export interface SearchResultData {
  providers?: ProviderData[];
  services?: ServiceData[];
  jobs?: JobData[];
  // pagination metadata returned by the backend
  page?: number;
  totalPages?: number;
}

export interface AddressSuggestion {
  providerId: string;
  address: string;
  city: string;
  state: string;
}

export interface MediaVideoItem {
  type: "video";
  video: {
    type: string;
    url: string;
    thumbnail?: string | null;
    index?: number;
    [key: string]: any;
  };
  provider: ProviderData;
}

export interface MediaAdItem {
  type: "ad";
  provider: ProviderData;
}

export type MediaFeedItem = MediaVideoItem | MediaAdItem;

export interface MediaFeedResponse {
  items: MediaFeedItem[];
  page: number;
  hasMore: boolean;
}
