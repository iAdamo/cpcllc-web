import { ProviderData } from "./provider";
import { UserData } from "./user";
import { FileType, MediaItem } from "./media";
import type { JobStatus } from "@/lib/jobs";
// export interface SubcategoryData {
//   _id: string;
//   id: string;
//   name: string;
//   description?: string;
//   category: {
//     _id: string;
//     id: string;
//     name: string;
//     description?: string;
//   };
// }

export interface SubcategoryData {
  _id: string;
  name: string;
  description?: string;
  icon?: any;
  iconColor?: string;
  categoryId: {
    _id: string;
    name: string;
    description?: string;
  };
}

export interface Subcategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  iconColor?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  subcategories: Subcategory[];
}

export interface ServiceData {
  _id: string;
  id: string;
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  duration: number;
  subcategoryId: SubcategoryData;
  // ratings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  location: string;
  media: MediaItem[] | FileType[];
  // tags: string[];
  // clients: [];
  providerId: ProviderData;
}

/** A marketplace job, as the API sends it (cpcllc-backend docs/job-cycle.md). */
export interface JobData {
  _id: string;
  id?: string;
  title: string;
  description: string;
  /** Absent when the client asked for estimates. */
  budget?: number | null;
  currency?: "USD" | "NGN";
  pricing?: "fixed" | "offers" | "estimates";
  /** Calendar day, "YYYY-MM-DD". */
  neededBy?: string | null;
  subcategoryId: SubcategoryData;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  location: {
    coordinates: number[];
    address?: {
      zip?: string;
      city?: string;
      state?: string;
      country?: string;
      address?: string;
    };
  };
  coordinates?: number[];
  media: MediaItem[] | FileType[];
  visibility: "Public" | "Verified_Only";
  proposals: ProposalData[];
  userId: UserData;
  providerId: ProviderData;
  status: JobStatus;
}

export interface ProposalData {
  _id: string;
  id: string;
  message: string;
  proposedPrice: number;
  /** Working days the business expects the job to take. */
  estimatedDays: number;
  note?: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  jobId: JobData;
  providerId: ProviderData;
  viewedByClient: boolean;
  attachments: MediaItem[];
}
