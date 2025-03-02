export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

export interface AuthContextProps {
  userData: UserProps | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  loading: boolean;
  logout: () => void;
}
