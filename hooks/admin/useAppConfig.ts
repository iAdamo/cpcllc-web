"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import { getAdminAppConfig, updateSocialLinks } from "@/axios/appConfig";

export function useAdminAppConfig() {
  return useQuery({ queryKey: adminKeys.appConfig, queryFn: getAdminAppConfig });
}

/** Save the social links; the footer picks them up on its next fetch. */
export function useSaveSocialLinks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSocialLinks,
    onSuccess: (config) => {
      qc.setQueryData(adminKeys.appConfig, config);
      qc.invalidateQueries({ queryKey: ["public-app-config"] });
    },
  });
}
