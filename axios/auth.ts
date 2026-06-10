import { ApiClientSingleton } from "./conf";
import {
  LoginUser,
  UserData,
  RegisterUser,
  DeactivateAccountData,
  LoginResult,
} from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const register = async (data: RegisterUser): Promise<UserData> => {
  const response = await axiosInstance.post("auth/register", data, {});
  return response.data;
};

// export const login = async (data: LoginUser): Promise<UserData> => {
//   const response = await axiosInstance.post("auth/login/", data);
//   return response.data;
// };

export const logout = async () => {
  await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
};

export const sendCode = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/send-code", data);
  return response.data;
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  const response = await axiosInstance.post("/auth/verify-email", data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  password: string;
  code?: string;
}) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const deactivateUser = async (data: DeactivateAccountData) => {
  const response = await axiosInstance.post("account/deactivate", data);
  return response.data;
};

/* ─── Current user profile (for the AuthGate) ─── */

export interface CurrentUserProfile {
  _id: string;
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  activeRole?: string;
  isActive?: boolean;
}

/**
 * Returns the current authenticated user's profile, or `null` if not signed in
 * (401). Used by AuthGate to enforce email verification and route gating.
 */
export async function getCurrentUser(): Promise<CurrentUserProfile | null> {
  try {
    const r = await axiosInstance.get<CurrentUserProfile>("users/profile");
    return r.data;
  } catch (err: any) {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return null;
    }
    throw err;
  }
}

/* ─── MFA-aware login + helpers (used by the page-based auth flow) ─── */

/**
 * Sign in. If the server requires MFA, returns `{ ok: false, mfaRequired: true }`
 * instead of throwing — callers should navigate to the MFA-verify page and
 * call this again with `mfaToken` set.
 */
export const login = async(payload: LoginUser): Promise<LoginResult> => {
  try {
    const response = await axiosInstance.post("auth/login", payload);
    return { ok: true, data: response.data };
  } catch (err: any) {
    const data = err?.response?.data;
    const code = data?.code ?? data?.message?.code;
    if (code === "MFA_REQUIRED") {
      return { ok: false, mfaRequired: true, message: "MFA code required" };
    }
    throw err;
  }
}

/* ─── MFA admin endpoints ─── */

export interface MfaStatus {
  mfaEnabled: boolean;
  mfaEnrolledAt?: string;
}

export interface MfaEnrollment {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
  recoveryCodes: string[];
}

export async function getMfaStatus(): Promise<MfaStatus> {
  const r = await axiosInstance.get("admin/mfa/status");
  return r.data;
}

export async function enrollMfa(): Promise<MfaEnrollment> {
  const r = await axiosInstance.post("admin/mfa/enroll");
  return r.data;
}

export async function confirmMfa(token: string) {
  const r = await axiosInstance.post("admin/mfa/confirm", { token });
  return r.data as { ok: boolean };
}

export async function disableMfa(token: string) {
  const r = await axiosInstance.post("admin/mfa/disable", { token });
  return r.data as { ok: boolean };
}
