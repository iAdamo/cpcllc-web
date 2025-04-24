import { ServiceData } from "@/types";
import { ServiceData } from "@/types";
export interface UserData {
  id: string;
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  activeRole: "Client" | "Company";
  email: string;
  profilePicture?: string;
  purchasedServices: any[];
  hiredCompanies: any[];
  admins: any[];
  createdAt: string;
  activeRoleId?: CompanyData;
  clients: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
  }[];
  services: ServiceData[];
  purchasedServices: ServiceData[];
  hiredCompanies: CompanyData[];
  owner: string;
}

export interface CompanyData {
  _id: string;
  id: string;
  companyName: string;
  companyDescription: string;
  companyEmail: string;
  phoneNumber: string;
  companyLogo: string;
  createdServices: any[];
  clients: any[];
  latitude: number;
  longitude: number;
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
  companyLogo: File | null;
  zip: string;
  city: string;
  latitude: number;
  longitude: number;
  state: string;
  country: string;
  addresses?: string[];
}

export interface OnboardingContextType {
  step: number;
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitData: () => void;
}
