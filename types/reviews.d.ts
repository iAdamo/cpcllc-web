import { CompanyData } from '@/types';
import { UserData } from "./context";

export interface ReviewData {
  _id: string;
  description: string;
  rating: number; // Must be between 1 and 5
  images: string[]; // Array of image URLs
  status: "pending" | "approved" | "rejected";
  helpfulVotes: string[];
  providerReply?: string;
  tags: string[];
  isDeleted: boolean;
  user: UserData;
  provider: CompanyData;
  service: string;
  createdAt: string;
}
