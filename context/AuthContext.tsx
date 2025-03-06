import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/utils/StorageState";
import { login, logout } from "@/axios/auth";
import { useRouter, usePathname } from "next/navigation";
import type { AuthContextProps } from "@/types";

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
  const router = useRouter();
  const pathname = usePathname();

  // Block rendering if session is being loaded
  if (isLoading || loading) return <div>Loading...</div>;

  // Redirect before rendering the restricted page
  if (!session && pathname !== "/") {
    router.replace("/");
    return null;
  }
  if (session && pathname === "/") {
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
              setSession(response.id);
              setUserData(response);
              router.replace("/service");
            }
          } catch (e) {
            console.error("Error logging in:", e);
            throw e;
          }
        },
        logout: () => {
          logout();
          setSession(null);
          setUserData(null);
        },
        userData,
        session,
        isLoading,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
