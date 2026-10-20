import { UserData } from "./user";
import { MediaItem } from "./media";

export interface ReviewData {
  _id: string;
  description: string;
  rating: number;
  images: MediaItem[];
  status: "pending" | "approved" | "rejected";
  helpfulVotes: string[];
  /** The business's reply (since the trust system). */
  reply?: { text: string; repliedAt?: string };
  /** Older reviews' reply. */
  providerReply?: string;
  tags: string[];
  isDeleted: boolean;
  creator: UserData;
  recipient: UserData;
  service: string;
  createdAt: string;
}
