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

