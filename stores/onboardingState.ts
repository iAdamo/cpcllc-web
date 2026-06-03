import { StateCreator } from "zustand";
import { GlobalStore } from "@/types";
import { createProviderProfile, updateUserProfile } from "@/axios/user";

export interface OnboardingData {
  role?: "Client" | "Provider";
  // Personal
  firstName?: string;
  lastName?: string;
  // Files are not persisted — user must re-select on refresh
  profilePictureFile?: File | null;
  // Company (provider only)
  providerName?: string;
  providerTagline?: string;
  providerDescription?: string;
  providerLogoFile?: File | null;
  providerEmail?: string;
  providerPhoneNumber?: string;
  phoneCountry?: string;
  subcategories?: Array<{
    _id: string;
    name: string;
    categoryId: string;
    categoryName: string;
  }>;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  providerImageFiles?: File[];
}

export interface OnboardingState {
  onboardingStep: number;
  onboardingData: OnboardingData;
  setOnboardingStep: (step: number) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  submitOnboarding: () => Promise<boolean>;
}

export const onboardingSlice: StateCreator<
  GlobalStore,
  [],
  [],
  OnboardingState
> = (set, get) => ({
  onboardingStep: 0,
  onboardingData: {},

  setOnboardingStep: (step) => set({ onboardingStep: step }),

  nextOnboardingStep: () =>
    set((state) => ({ onboardingStep: state.onboardingStep + 1 })),

  prevOnboardingStep: () =>
    set((state) => ({
      onboardingStep: Math.max(0, state.onboardingStep - 1),
    })),

  updateOnboardingData: (data) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...data },
    })),

  resetOnboarding: () => set({ onboardingStep: 0, onboardingData: {} }),

  submitOnboarding: async () => {
    const { onboardingData } = get();
    try {
      get().setLoading(true);

      // Always update personal profile
      const profileFd = new FormData();
      if (onboardingData.firstName)
        profileFd.append("firstName", onboardingData.firstName);
      if (onboardingData.lastName)
        profileFd.append("lastName", onboardingData.lastName);
      if (onboardingData.profilePictureFile)
        profileFd.append("profilePicture", onboardingData.profilePictureFile);

      await updateUserProfile(profileFd);

      if (onboardingData.role === "Provider") {
        const fd = new FormData();
        if (onboardingData.providerName)
          fd.append("providerName", onboardingData.providerName);
        // if (onboardingData.providerTagline)
        //   fd.append("providerTagline", onboardingData.providerTagline);
        if (onboardingData.providerDescription)
          fd.append("providerDescription", onboardingData.providerDescription);
        if (onboardingData.providerEmail)
          fd.append("providerEmail", onboardingData.providerEmail);
        if (onboardingData.providerPhoneNumber)
          fd.append("providerPhoneNumber", onboardingData.providerPhoneNumber);
        if (onboardingData.providerLogoFile)
          fd.append("providerLogo", onboardingData.providerLogoFile);

        // Subcategories
        onboardingData.subcategories?.forEach((sub, i) => {
          fd.append(`categories[]`, sub.categoryId);
          fd.append(`subcategories[]`, sub._id);
        });

        // Location (nested structure matching companiescenterllc)
        const loc = onboardingData.location;
        if (loc) {
          if (loc.address)
            fd.append("location[primary][address][address]", loc.address);
          if (loc.city) fd.append("location[primary][address][city]", loc.city);
          if (loc.state)
            fd.append("location[primary][address][state]", loc.state);
          if (loc.zip) fd.append("location[primary][address][zip]", loc.zip);
          if (loc.country)
            fd.append("location[primary][address][country]", loc.country);
          if (loc.longitude != null)
            fd.append(
              "location[primary][coordinates][0]",
              loc.longitude.toString()
            );
          if (loc.latitude != null)
            fd.append(
              "location[primary][coordinates][1]",
              loc.latitude.toString()
            );
        }

        // Gallery images
        onboardingData.providerImageFiles?.forEach((file) => {
          fd.append("providerImages", file);
        });

        const data = await createProviderProfile(fd);
        set({ user: { ...data }, switchRole: data.activeRole });
      }

      return true;
    } catch (err: any) {
      get().setError(
        err?.response?.data?.message || "Something went wrong. Please retry."
      );
      return false;
    } finally {
      get().setLoading(false);
    }
  },
});
