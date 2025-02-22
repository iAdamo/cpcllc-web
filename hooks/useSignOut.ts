import { useSession } from "@/context/AuthContext";

export const useSignOut = () => {
  const { logout } = useSession();
  const signOut = async () => {
    try {
      logout();
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  return signOut;
};
