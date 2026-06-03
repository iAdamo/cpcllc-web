import type { Metadata } from "next";
import { Suspense } from "react";
import ServiceProviderPage from "@/screens/providers";

export const metadata: Metadata = {
  title: " Service Provider | CompaniesCenterLLC",
  description: " Find the Best Companies in Your Area",
};

export default function Page() {
  return (
    <Suspense>
      <ServiceProviderPage />
    </Suspense>
  );
}
