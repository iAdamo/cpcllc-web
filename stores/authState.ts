import { StateCreator } from "zustand";
import { GlobalStore, AuthState, RegisterUser, LoginUser } from "@/types";
import { register, login, deactivateUser, logout } from "@/axios/auth";
import { queryClient } from "@/lib/queryClient";

export const authState: StateCreator<GlobalStore, [], [], AuthState> = (
  set
) => ({
  user: null,
  isAuthenticated: false,

  signUp: async (userData: RegisterUser) => {
    set({ isLoading: true, error: null });
    try {
      const response = await register(userData);
      if (response) {
        set({
          user: response,
          success: "Account created successfully!",
          isAuthenticated: true,
          switchRole: "Client",
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || error?.message || "Signup failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (credentials: LoginUser) => {
    set({ isLoading: true, error: null });
    try {
      const response = await login(credentials);
      if (response.ok && response.data) {
        set({
          user: { ...response.data, accessToken: "" },
          switchRole: response.data.activeRole,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      if (response.mfaRequired) {
        set({ error: response.message, isLoading: false });
      }
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || error?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  logout: async (data) => {
    if (data) {
      await deactivateUser(data);
    }
    await logout();
    // Server cache must not survive sign-out — the next session may be a
    // different user (or a non-admin). One clear() drops everything:
    // admin views, search results, profiles, metrics.
    queryClient.clear();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      onboardingStep: null,
      onboardingData: null,
      switchRole: "Client",
      savedProviders: null,
      currentLocation: null,
      paramsFrom: null,
      isLoading: false,
      availability: {},
      adminOnlineUserIds: {},
    });
  },
});
