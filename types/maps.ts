// types/mapTypes.ts
export interface Company {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Add other company properties as needed
}

export interface MapProps {
  companies: Company[];
  apiKey: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}
