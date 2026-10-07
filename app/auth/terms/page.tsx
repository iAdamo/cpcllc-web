import { Suspense } from "react";
import type { Metadata } from "next";
import TermsAcceptancePage from "@/screens/auth/TermsAcceptancePage";

export const metadata: Metadata = {
  title: "Review our policies — CompaniesCenter",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TermsAcceptancePage />
    </Suspense>
  );
}
