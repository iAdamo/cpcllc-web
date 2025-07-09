export interface Subcategory {
  id: string;
  name: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
}
