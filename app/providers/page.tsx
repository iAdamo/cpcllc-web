import type { Metadata } from "next";
import { Suspense } from "react";
import ServiceProviderPage from "@/screens/providers";

export const metadata: Metadata = {
  title: "Service Providers",
  description: "Find local service businesses near you and compare their profiles and reviews.",
};

export default function Page() {
  return (
    <Suspense>
      <ServiceProviderPage />
    </Suspense>
  );
}
