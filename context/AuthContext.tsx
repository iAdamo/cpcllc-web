import {
  useContext,
  createContext,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useStorageState } from "@/utils/StorageState";
import { login, logout as logoutRequest } from "@/axios/auth";
import { useRouter, usePathname } from "next/navigation";
import type { AuthContextProps, UserData, CompanyData } from "@/types";
import { registerCompany, userProfile } from "@/axios/users";

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return context;
}

export function SessionProvider({ children }: PropsWithChildren<object>) {
  const [[isLoading, session], setSession] = useStorageState<string>("session");
  const [[loading, userData], setUserData] = useStorageState<UserData>("user");
  const [[loadingCompany, companyData], setCompanyData] =
    useStorageState<CompanyData>("company");

  const router = useRouter();
  const pathname = usePathname();

  // Memoized functions
  const loginHandler = useCallback(
    async (credentials: { email: string; password: string }) => {
      try {
        const response = await login(credentials);
        if (response) {
          setSession(response._id);
          const userData: UserData = { ...response, id: response._id };
          setUserData(userData);
        }
      } catch (e) {
        console.error("Error logging in:", e);
        throw e;
      }
    },
    [setSession, setUserData]
  );

  const logoutHandler = useCallback(async () => {
    setSession(null);
    setUserData(null);
    setCompanyData(null);
    await logoutRequest();
    router.replace("/");
  }, [setSession, setUserData, setCompanyData, router]);

  const registerCompanyHandler = useCallback(
    async (data: FormData) => {
      try {
        if (!userData) throw new Error("User data is not available.");
        if (!session) throw new Error("Session is not available.");
        const response = await registerCompany(data, session);
        if (response) {
          setCompanyData(response);
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
      }
    },
    [userData, session, setCompanyData]
  );

  const fetchUserProfileHandler = useCallback(async () => {
    if (!userData) return;
    if (!session) throw new Error("Session is not available.");
    try {
      const response = await userProfile(session);
      if (response) {
        setUserData({ ...response, id: response._id });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      throw err;
    }
  }, [userData, session, setUserData]);

  if (isLoading || loading || loadingCompany) return <div>Loading...</div>;

  // Route redirects
  if (session && pathname === "/") {
    if (userData?.activeRole === "Client") {
      router.replace("/service");
      return <div>Loading...</div>;
    } else if (userData?.activeRole === "Company") {
      router.replace("/dashboard");
      return <div>Loading...</div>;
    }
  }

  if (session && userData?.activeRole === "Company") {
    if (pathname.startsWith("/service")) {
      router.replace("/dashboard");
    } else if (pathname === "/cpc") {
      router.push("/cpc");
    }
  } else if (session && userData?.activeRole === "Client") {
    if (pathname === "/dashboard") {
      router.push("/service");
    }
  }
  return (
    <AuthContext.Provider
      value={{
        login: loginHandler,
        logout: logoutHandler,
        registerCompany: registerCompanyHandler,
        fetchUserProfile: fetchUserProfileHandler,
        userData,
        setUserData,
        companyData,
        session,
        isLoading,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
