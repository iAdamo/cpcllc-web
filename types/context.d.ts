export interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  activeRole: string;
  email: string;
  photo?: string;
}

export interface Address {
  companyAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export interface CompanyData {
  name: string;
  description: string;
  email: string;
  phoneNumber: string;
  logo: string;
  latitude: number;
  longitude: number;
  addresses?: Address[];
}

export interface AuthContextProps {
  userData: UserData | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
  registerCompany: (data: FormData) => Promise<void>;
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
