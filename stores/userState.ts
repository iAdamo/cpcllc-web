import { UserData, ActiveRole } from "@/types";
import {
  updateUserProfile,
  updateProviderProfile,
  createProviderProfile,
} from "@/axios/user";
import { StateCreator } from "zustand";
import { GlobalStore, UserState } from "@/types";
import { queryClient } from "@/lib/queryClient";

/**
 * Session identity + live presence. Viewing profiles (own or other users')
 * is server data — hooks/useUserProfile.ts. Mutations here also refresh the
 * matching TanStack Query entries so profile views never show stale data.
 */
export const userState: StateCreator<GlobalStore, [], [], UserState> = (
  set,
  get
) => ({
  // Live presence map fed by websocket heartbeats — client state.
  availability: {},

  setAvailability: (data) => {
    if (!data.userId) return;
    set((state) => ({
      availability: {
        ...state.availability,
        [data.userId!]: {
          ...state.availability[data.userId!],
          ...data,
        },
      },
    }));
  },

  // Direct session patch (no API call).
  updateProfile: (updates: Partial<UserData>) => {
    set((state) => ({
      user: { ...state.user, ...updates } as GlobalStore["user"],
    }));
  },

  // Profile mutation — updates the session and invalidates the profile query.
  updateUserProfile: async (role: ActiveRole, data?: FormData) => {
    set({ isLoading: true, error: null });
    try {
      let response;

      if (data) {
        response =
          role === "Client"
            ? await updateUserProfile(data)
            : await updateProviderProfile(data);
      } else {
        const { user } = get();
        if (user) {
          const formData = new FormData();
          response =
            role === "Client"
              ? await updateUserProfile(formData)
              : await createProviderProfile(formData);
        }
      }

      if (response) {
        set({
          user: { ...response },
          switchRole: response.activeRole,
          isLoading: false,
          success: role === "Client" ? "" : "Profile updated successfully!",
        });
        void queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      }
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Profile update failed",
        isLoading: false,
      });
      throw error;
    }
  },
});
