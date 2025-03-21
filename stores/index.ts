import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, logout } from "@/axios/auth";
import { registerCompany } from "@/axios/users";
import type { UserData, CompanyData } from "@/types";
import { userProfile } from "@/axios/users";


interface AuthState {
  session: string | null;
  userData: UserData | null;
  companyData: CompanyData | null;
  isLoading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ error?: string }>;
  logout: () => void;
  registerCompany: (data: FormData) => Promise<{ error?: string }>;
  setCompanyData: (company: CompanyData) => void;
  setUserData: (user: UserData) => void;
  fetchUserProfile: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      userData: null,
      companyData: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await login(credentials);
          if (!response) throw new Error("Invalid credentials");

          set({
            session: response._id,
            userData: {
              id: response._id,
              firstName: response.firstName ?? "",
              lastName: response.lastName ?? "",
              activeRole: response.activeRole,
              email: response.email,
              profilePicture: response.profilePicture ?? "",
            },
            isLoading: false,
          });
          return {};
        } catch (error) {
          set({ isLoading: false });
          return {
            error: error instanceof Error ? error.message : "Login failed",
          };
        }
      },

      logout: () => {
        set({ session: null, userData: null, companyData: null });
        logout(); // Backend logout call
      },

      registerCompany: async (data) => {
        try {
          const { userData } = useAuthStore.getState();
          if (!userData) throw new Error("User data not available");

          const response = await registerCompany(data, userData.id);
          if (!response) throw new Error("Registration failed");

          set({ companyData: response });
          return {};
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? error.message
                : "Company registration failed",
          };
        }
      },
      fetchUserProfile: async (id: string) => {
        try {
          const response = await userProfile(id);
          set({ userData: response.data });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      },

      setCompanyData: (company) => set({ companyData: company }),
      setUserData: (user) => set({ userData: user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        session: state.session,
        userData: state.userData,
        companyData: state.companyData,
      }),
    }
  )
);
