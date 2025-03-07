export interface RegisterUser {
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  role: string;
}
