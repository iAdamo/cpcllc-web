import fs from "fs";
import path from "path";
import { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import Markdown from "@/components/legal/Markdown";

export const metadata: Metadata = {
  title: "Privacy Policy | CompaniesCenter",
  description:
    "How Companies Center collects, uses, shares, and protects your information across the marketplace mobile app and website.",
};

// The policy lives as Markdown alongside this route so the legal text is edited
// in one place (and matches the reviewed source), then rendered here.
const policy = fs.readFileSync(
  path.join(process.cwd(), "app/privacy-policy/policy.md"),
  "utf8",
);

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Companies Center LLC — Privacy Policy"
      effectiveDate="Upon Publication"
    >
      <Markdown source={policy} />
    </LegalLayout>
  );
}
