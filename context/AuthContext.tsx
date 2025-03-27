import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/utils/StorageState";
import { login, logout } from "@/axios/auth";
import { useRouter, usePathname } from "next/navigation";
import type { AuthContextProps, UserData, CompanyData } from "@/types";
import { registerCompany } from "@/axios/users";
import { userProfile } from "@/axios/users";

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
  const [[loading, userData], setUserData] = useStorageState<any>("user");
  const [[loadingCompany, companyData], setCompanyData] =
    useStorageState<CompanyData>("company");

  const router = useRouter();
  const pathname = usePathname();

  // Block rendering if session is being loaded
  if (isLoading || loading || loadingCompany) return <div>Loading...</div>;

  // Redirect before rendering the restricted page
  if (!session && pathname === "/dashboard") {
    router.replace("/");
    return null;
  }
  if (session && pathname === "/" && userData?.activeRole === "Client") {
    router.replace("/service");
    return <div>Loading...</div>;
  } else if (
    session &&
    userData?.activeRole === "Company" &&
    pathname !== "/dashboard"
  ) {
    router.replace("/dashboard");
    return <div>Loading...</div>;
  } else if (session && userData?.activeRole === "admin" && pathname === "/") {
    router.replace("/admin");
    return <div>Loading...</div>;
  } else if (
    session &&
    userData?.activeRole !== "Company" &&
    pathname === "/dashboard"
  ) {
    router.replace("/service");
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        login: async (credentials: { email: string; password: string }) => {
          try {
            const response = await login(credentials);
            if (response) {
              setSession(response._id);
              const userData: UserData = {
                id: response._id,
                firstName: response.firstName ?? "",
                lastName: response.lastName ?? "",
                activeRole: response.activeRole,
                email: response.email,
                profilePicture: response.profilePicture ?? "",
              };
              setUserData(userData);
              if (pathname === "/") {
                router.replace("/service");
              }
            }
          } catch (e) {
            console.error("Error logging in:", e);
            throw e;
          }
        },
        logout: () => {
          setSession(null);
          setUserData(null);
          logout();
          router.replace("/");
        },
        registerCompany: async (data: FormData) => {
          try {
            if (!userData) {
              throw new Error("User data is not available.");
            }
            const response = await registerCompany(data, userData.id);
            if (response) {
              setCompanyData(response);
            }
          } catch (err) {
            console.error("Error updating profile:", err);
            throw err;
          }
        },
        fetchUserProfile: async () => {
          if (!userData) {
            return;
          }
          try {
            const response = await userProfile(userData.id);
            if (response) {
              setUserData((response) => ({
                ...response,
                id: response._id,
              }));
            }
          } catch (err) {
            console.error("Error fetching user profile:", err);
            throw err;
          }
        },
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
