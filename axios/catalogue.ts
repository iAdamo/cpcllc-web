import { ApiClientSingleton } from "@/axios/conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface AdminSubcategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  tags?: string[];
  categoryId?: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  description?: string;
  subcategories: AdminSubcategory[];
  createdAt?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
}

export interface SubcategoryInput {
  name: string;
  categoryId: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  tags?: string[];
}

const base = "admin/catalogue";

export const listCatalogue = async (): Promise<AdminCategory[]> =>
  (await axiosInstance.get(`${base}/categories`)).data ?? [];

export const createCategory = async (input: CategoryInput) =>
  (await axiosInstance.post(`${base}/categories`, input)).data;

export const updateCategory = async (id: string, input: Partial<CategoryInput>) =>
  (await axiosInstance.patch(`${base}/categories/${id}`, input)).data;

export const deleteCategory = async (id: string) =>
  (await axiosInstance.delete(`${base}/categories/${id}`)).data;

export const createSubcategory = async (input: SubcategoryInput) =>
  (await axiosInstance.post(`${base}/subcategories`, input)).data;

export const updateSubcategory = async (
  id: string,
  input: Partial<SubcategoryInput>,
) => (await axiosInstance.patch(`${base}/subcategories/${id}`, input)).data;

export const deleteSubcategory = async (id: string) =>
  (await axiosInstance.delete(`${base}/subcategories/${id}`)).data;
