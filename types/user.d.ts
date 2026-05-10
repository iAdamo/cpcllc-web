import { SubcategoryData } from "./subcategory";
import { FileType, MediaItem } from "./media";


export type ActiveRole = "Client" | "Provider";

export interface UserData {
  id: string;
  _id: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  activeRole: ActiveRole;
  email: string;
  isOnboardingComplete: boolean;
  homeAddress: string;
  language: string;
  emailEditCount: number;
  phoneNumber: string;
  // followingCount: number;
  // followedProviders: ProviderData[];
  reviewCount: number;
  averageRating: number;
  phoneEditCount: number;
  profilePicture?: MediaItem;
  purchasedServices: any[];
  createdAt: string;
  updatedAt: string;
  activeRoleId?: Partial<ProviderData>;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  termsAcceptances: TermsAcceptances[];
  termsInvalidatedAt: Date;
  clients: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
  }[];
  hiredCompanies: ProviderData[];
  owner: string;
}

export interface ProviderData {
  _id: string;
  // id: string;
  providerName: string;
  providerLogo?: MediaItem | FileType;
  isVerified?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  isOnline?: boolean;
  availability: "Online" | "Busy" | "Offline";
  providerTagline?: string;
  providerDescription: string;
  providerEmail: string;
  providerPhoneNumber: string;
  subcategories: SubcategoryData[];
  providerSocialMedia: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
  reviewCount: number;
  averageRating: number;
  providerImages: MediaItem[] | FileType[];
  services: any[];
  clients: any[];
  latitude: number;
  longitude: number;
  owner: string;
  isLiveTrackable: boolean;
  favoritedBy: string[];
  favoriteCount: number;
  followersCount: number;
  // followedBy: UserData[];
  ratings: number;
  createdAt: string;
  updatedAt: string;
  location: {
    primary?: {
      coordinates?: number[];

      address?: {
        zip?: string;
        city?: string;
        state?: string;
        country?: string;
        address?: string;
      };
    };
    secondary?: {
      coordinates?: number[];

      address?: {
        zip?: string;
        city?: string;
        state?: string;
        country?: string;
        address?: string;
      };
    };
    tertiary?: {
      coordinates?: number[];

      address?: {
        zip?: string;
        city?: string;
        state?: string;
        country?: string;
        address?: string;
      };
    };
  };
}
