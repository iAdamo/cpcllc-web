import type { Metadata } from "next";
import MfaVerifyPage from "@/screens/auth/MfaVerifyPage";

export const metadata: Metadata = {
  title: "Verify your code",
  robots: { index: false, follow: false },
};

export default MfaVerifyPage;
