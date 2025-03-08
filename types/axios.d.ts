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

export interface ServiceData {
  title: string;
  description: string;
  price: number;
  category: string;
  ratings: number;
  location: {
    first: {
      country: string;
    };
  };
  media: {
    image: {
      primary: string;
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