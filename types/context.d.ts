import {
  Subcategory,
  SubcategoryData,
} from "@/types";

export interface UserData {
  id: string;
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  activeRole: "Client" | "Company" | "Admin";
  email: string;
  profilePicture?: string;
  purchasedServices: any[];
  hiredCompanies: any[];
  admins: any[];
  createdAt: string;
  activeRoleId?: CompanyData;
  verified: boolean;
  clients: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
  }[];
  hiredCompanies: CompanyData[];
  owner: string;
}

export interface CompanyData {
  _id: string;
  id: string;
  companyName: string;
  companyDescription: string;
  companyEmail: string;
  companyPhoneNumber: string;
  subcategories: SubcategoryData[];
  website: string;
  companySocialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    other?: string;
  };
  reviewCount: number;
  averageRating: number;
  companyImages: string[];
  services: any[];
  clients: any[];
  latitude: number;
  longitude: number;
  owner?: string;
  favoritedBy: string[];
  favoriteCount: number;
  ratings: number;
  createdAt: string;
  updatedAt: string;
  location: {
    primary: {
      coordinates: {
        lat: number;
        long: number;
      };
      address: {
        zip: string;
        city: string;
        state: string;
        country: string;
        address: string;
      };
    };
    secondary: {
      coordinates: {
        lat: number;
        long: number;
      };
      address: {
        zip: string;
        city: string;
        state: string;
        country: string;
        address: string;
      };
    };
    tertiary: {
      coordinates: {
        lat: number;
        long: number;
      };
      address: {
        zip: string;
        city: string;
        state: string;
        country: string;
        address: string;
      };
    };
  };
}

export interface AuthContextProps {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
  registerCompany: (data: FormData) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  companyData: CompanyData | null;
}

export interface OnboardingData {
  role: string;
  firstName: string;
  lastName: string;
  profilePicture: File | null;
  companyName: string;
  companyDescription: string;
  companyEmail: string;
  companyPhoneNumber: string;
  companyAddress: string;
  companyImages: File[] | null;
  zip: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy?: "exact" | "approximate" | "manual";
  state: string;
  country: string;
  address?: string;
  selectedServices?: {
    category: string;
    subcategories?: string[];
  };
  subcategories?: Subcategory[];
  availableCategories?: ServiceCategory[];
}

export interface OnboardingContextType {
  step: number;
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitData: () => void;
  categories: ServiceCategory[];
}
