import { UserData, AdminUserMe } from "@types";

export interface RegisterUser {
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
  mfaToken?: string; // For MFA flow
}

export interface LoginResult {
  /** Normal successful login — JWT is set via cookie by the backend. */
  ok: boolean;
  /** Set when the server says we need an MFA code to finish login. */
  mfaRequired?: boolean;
  message?: string;
  data?: UserData;
}

export interface DeactivateAccountData {
  password: string;
  reason: string;
  shouldDeleteAfter30Days: boolean;
}


export interface AuthResponse {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicture?: string;
    activeRole: string;
    createdServices: any[];
    purchasedServices: any[];
    hiredCompanies: any[];
    admins: any[];
    createdAt: string;
  }

