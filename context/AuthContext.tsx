import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/utils/StorageState";
import { login, logout } from "@/axios/auth";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  userData?: any;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
}

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
