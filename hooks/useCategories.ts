"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesWithSubcategories } from "@/axios/service";

export function useCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: getAllCategoriesWithSubcategories,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
