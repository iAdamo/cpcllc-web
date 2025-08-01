"use client";

import AiChat from "@/components/AiChatFab";
import CompaniesSection from "./CompaniesSection";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompanyView from "@/screens/companies/CompanyView";
import { CompanyData } from "@/types";
import { useParams } from "next/navigation";
import { useStorageState } from "@/utils/StorageState";
import { UserData } from "@/types";
import { userProfile } from "@/axios/users";
import OpenInApp from "@/components/OpenInApp";

export const Companies = () => {
  return (
    <main className="flex-1 bg-[#F6F6F6] dark:bg-gray-900">
      <CompaniesSection />
      <AiChat />
      <OpenInApp />
    </main>
  );
};

export const ServiceProviderPage = () => {
  const [company, setCompany] = useState<CompanyData>();
  const [[, usersData], setUsersData] = useStorageState<UserData>("users");

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push("/companies");
      return;
    }
    let user: UserData | null = null;
    const fetchServices = async () => {
      if (typeof id === "string") {
        user = await userProfile(id);
        setCompany(user.activeRoleId as CompanyData);
      }
      if (usersData?.id) {
        setUsersData(user);
      }
    };
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-32 bg-[#F6F6F6]">
      <CompanyView {...company} />
    </div>
  );
};
