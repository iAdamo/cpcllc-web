export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

export interface AuthContextProps {
  userData: UserProps | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
}
import { Dispatch, SetStateAction } from "react";

interface OnboardingData {
  userType: string;
  firstName: string;
  lastName: string;
  profilePicture: File | null;
}

interface OnboardingContextType {
  step: number;
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitData: () => void;
}
