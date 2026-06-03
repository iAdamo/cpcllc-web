import { StateCreator } from "zustand";
import { GlobalStore, AuthState, RegisterUser, LoginUser } from "@/types";
import {
  register,
  login,
  // forgotPassword,
  // verifyEmail,
  // verifyPhoneNumber,
  // resetPassword,
  // sendCode,
  // changePassword,
} from "@/axios/auth";
import { deactivateUser, logout } from "@/axios/auth";
// import { socketService } from "@/services/socketService";

export const authState: StateCreator<GlobalStore, [], [], AuthState> = (
  set
  // get
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
      if (response) {
        console.log({ response });
        set({
          // currentLocation: null,
          user: { ...response, accessToken: "" },
          switchRole: response.activeRole,
          isAuthenticated: true,
          isLoading: false,
        });
        // await registerForPushNotifications();
        // get().getCurrentLocation();
      }
    } catch (error: any) {
      console.log(
        error?.response?.data?.message || error?.message || "Login failed"
      );
      set({
        error:
          error?.response?.data?.message || error?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // forgotPassword: async (email: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     await forgotPassword({ email });
  //     set({ isLoading: false });
  //   } catch (error: any) {
  //     set({
  //       error: error?.response?.data?.message || "Forgot password failed",
  //       isLoading: false,
  //     });
  //   }
  // },

  // verifyPhone: async (code: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     await verifyPhoneNumber({ code });
  //     set({ isLoading: false, success: "Phone number verified successfully" });
  //   } catch (error: any) {
  //     set({
  //       error:
  //         error?.response?.data?.message || "Phone number verification failed",
  //       isLoading: false,
  //     });
  //     // throw error;
  //   }
  // },

  // verifyEmail: async (code: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     await verifyEmail({ code });
  //     set({ isLoading: false });
  //   } catch (error: any) {
  //     set({
  //       isLoading: false,
  //       error: error?.response?.data?.message || "Email verification failed",
  //     });
  //     throw error;
  //   }
  // },

  // sendCode: async (email: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     if (!email) {
  //       set({ error: "Email not found", isLoading: false });
  //       return;
  //     }
  //     await sendCode({ email });
  //     set({ isLoading: false });
  //   } catch (error: any) {
  //     set({
  //       error:
  //         error?.response?.data?.message || "Failed to send verification code",
  //       isLoading: false,
  //     });
  //     throw error;
  //   }
  // },

  // resetPassword: async (password: string, email?: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     if (
  //       await resetPassword({ email: email || get().user!.email, password })
  //     ) {
  //       set({ isLoading: false });
  //     }
  //   } catch (error: any) {
  //     set({
  //       error: error?.response?.data?.message || "Reset password failed",
  //       isLoading: false,
  //     });
  //     throw error;
  //   }
  // },

  // changePassword: async (currentPassword: string, password: string) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await changePassword({ currentPassword, password });
  //     if (response) {
  //       set({ isLoading: false, success: "Password Change successfull!" });
  //     }
  //   } catch (error: any) {
  //     set({
  //       error: error?.response?.data?.message || "Password change failed",
  //       isLoading: false,
  //     });
  //   }
  // },

  logout: async (data) => {
    if (data) {
      await deactivateUser(data);
    }
    await logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      // chatError: null,
      // currentStep: 1,
      // currentView: "Home",
      // displayStyle: "Grid",
      // selectedFiles: [],
      // draftJobs: [], // test purpose
      // savedProviders: [],
      // currentLocation: null,
      paramsFrom: null,
      // selectedChat: null,
      // messages: [],
      // groupedMessages: [],
      // hasMoreMessages: true,
      // chats: null,
      // chatLoading: false,
      isLoading: false,
      // isChecking: true,
      // notifications: null,
      availability: {},
    });

    // if (await SecureStore.getItemAsync("accessToken")) await disablePushToken();
    // socketService.emitEvent(PresenceEvents.UPDATE_STATUS, {
    //   status: "offline",
    //   customStatus: "offline",
    //   lastSeen: Date.now(),
    // });
    // socketService.disconnect();
    // await SecureStore.deleteItemAsync("accessToken");
    // await SecureStore.deleteItemAsync("sessionId");
  },
});
