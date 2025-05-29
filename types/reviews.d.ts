import { UserData } from "./context";

export interface ReviewData {
  title: string;
  description: string;
  rating: number; // Must be between 1 and 5
  images: string[]; // Array of image URLs
  status: "pending" | "approved" | "rejected";
  helpfulVotes: string[];
  companyReply?: string;
  tags: string[];
  isDeleted: boolean;
  user: UserData;
  company: string;
  service: string;
}
