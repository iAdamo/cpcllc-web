import { ApiClientSingleton } from "./conf";
import { ServiceData, Category } from "@/types";

const { axiosInstance } = ApiClientSingleton.getInstance();

export const createService = async (data: FormData): Promise<ServiceData> => {
  const response = await axiosInstance.post("services", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateService = async (
  id: string,
  data: FormData,
): Promise<ServiceData> => {
  const response = await axiosInstance.patch(`services/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteService = async (id: string): Promise<ServiceData[]> => {
  const response = await axiosInstance.delete(`services/${id}`);
  return response.data;
};

export const getAllCategoriesWithSubcategories = async (): Promise<
  Category[]
> => {
  const response = await axiosInstance.get("services/categories");
  return response.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("services/category");
  return response.data;
};

export const getServiceById = async (id: string): Promise<ServiceData> => {
  const response = await axiosInstance.get(`services/${id}`);

  return response.data;
};

export const getServicesByProvider = async (
  id: string,
): Promise<ServiceData[]> => {
  const response = await axiosInstance.get(`services/provider/${id}`);

  return response.data;
};

export const getServices = async (
  page: number,
  limit: number,
): Promise<{ services: ServiceData[]; totalPages: number }> => {
  const response = await axiosInstance.get(
    `services?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const updateProposal = async (
  jobId: string,
  proposalId: string,
  data: FormData,
): Promise<void> => {
  await axiosInstance.patch(
    `services/jobs/${jobId}/proposals/${proposalId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const updateProposalStatus = async (
  proposalId: string,
  status: string,
): Promise<any> => {
  const response = await axiosInstance.patch(
    `services/jobs/proposals/${proposalId}`,
    { status },
  );
  return response.data;
};
