import {
  useContext,
  createContext,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useStorageState } from "@/utils/StorageState";
import { register, login, logout as logoutRequest } from "@/axios/auth";
import { useRouter, usePathname } from "next/navigation";
import type { AuthContextProps, UserData, CompanyData } from "@/types";
import { updateCompanyProfile, userProfile } from "@/axios/users";
import { Spinner } from "@/components/ui/spinner";
// import { Heading } from "@/components/ui/heading";
// import { Center } from "@/components/ui/center";

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
  const [[loadingCompany, providerData], setCompanyData] =
    useStorageState<CompanyData>("provider");

  const router = useRouter();
  const pathname = usePathname();

  // Memoized functions
  const registerHandler = useCallback(
    async (data: { email: string; phoneNumber: string; password: string }) => {
      try {
        const response = await register(data);
        if (response) {
          if (response) {
            setSession(response._id);
            const userData: UserData = { ...response, id: response._id };
            setUserData(userData);
          }
        }
      } catch (e) {
        console.error("Error registering:", e);
        throw e;
      }
    },
    [setSession, setUserData]
  );

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
  }, [router, setSession, setUserData, setCompanyData]);

  const updateCompanyProfileHandler = useCallback(
    async (data: FormData) => {
      try {
        if (!userData) throw new Error("User data is not available.");
        if (!session) throw new Error("Session is not available.");
        const response = await updateCompanyProfile(data);
        if (response) {
          const providerData: CompanyData = {
            ...response,
            id: response._id,
          };
          setCompanyData(providerData);
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
      }
    },
    [userData, session, setCompanyData]
  );

  const fetchUserProfileHandler = useCallback(async () => {
    if (!userData) await logoutHandler();
    if (!session) return;

    try {
      const response = await userProfile(session);
      if (response) {
        setUserData({ ...response, id: response._id });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      throw err;
    }
  }, [userData, session, setUserData, logoutHandler]);

  if (isLoading || loading || loadingCompany)
    return (
      <Spinner
        size="small"
        className="h-fit p-4 justify-start items-start w-full"
      />
    );

  if (
    !session &&
    pathname !== "/" &&
    pathname !== "/admin" &&
    !pathname.startsWith("/providers") &&
    pathname !== "/onboarding"
  ) {
    router.replace("/");
  } else if (session && pathname === "/") {
    if (userData?.activeRole === "Client") {
      router.replace("/providers");
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    } else if (userData?.activeRole === "Provider") {
      router.replace(`/cpc/${userData.id}`);
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    } else if (userData?.activeRole === "Admin") {
      router.replace("/admin");
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    }
  } else if (session && userData?.activeRole === "Provider") {
    if (pathname.startsWith("/providers")) {
      router.replace(`/cpc/${userData.id}`);
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    } else if (pathname === "/cpc") {
      router.push("/cpc");
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    }
  } else if (session && userData?.activeRole === "Client") {
    if (pathname === `/cpc/${userData?.id}`) {
      router.push("/providers");
      return (
        <Spinner
          size="small"
          className="h-fit p-4 justify-start items-start w-full"
        />
      );
    }
  }

  return (
    <AuthContext.Provider
      value={{
        register: registerHandler,
        login: loginHandler,
        logout: logoutHandler,
        updateCompanyProfile: updateCompanyProfileHandler,
        fetchUserProfile: fetchUserProfileHandler,
        userData,
        setUserData,
        providerData,
        session,
        isLoading,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
