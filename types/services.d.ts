export interface Subcategory {
  _id: string;
  name: string;
  description: string;
}

export interface ServiceCategory {
  _id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}
