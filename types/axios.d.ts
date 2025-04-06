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

export interface ServiceData {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  ratings: number;
  location: {
    primary: {
      coordinates: {
        lat: number;
        long: number;
      };
      zip: string;
      city: string;
      state: string;
      country: string;
      address: string;
    };
    secondary: {
      coordinates: {
        lat: number;
        long: number;
      };
      zip: string;
      city: string;
      state: string;
      country: string;
      address: string;
    };
    tertiary: {
      coordinates: {
        lat: number;
        long: number;
      };
      zip: string;
      city: string;
      state: string;
      country: string;
      address: string;
    };
  };
  media: {
    image: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    video: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  link: string;
  company: string;
  clients: [];
}

export interface ServiceCategory {
  title: string;
  description: string;
  price: number;
  category: string;
  company: string;
  clients: [];
}
