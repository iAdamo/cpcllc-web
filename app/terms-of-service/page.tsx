import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import Markdown from "@/components/legal/Markdown";
import { readLegalDoc } from "@/lib/legalDoc";

export const metadata: Metadata = {
  title: "Terms of Service | Companies Center",
  description:
    "The agreement between you and Companies Center LLC for using the Companies Center mobile applications and website.",
};

// The Terms live as Markdown alongside this route, like the Privacy Policy,
// so the legal text is edited in one place and its date sits at its top.
const terms = readLegalDoc(
  fs.readFileSync(
    path.join(process.cwd(), "app/terms-of-service/terms.md"),
    "utf8",
  ),
);

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Companies Center Terms of Service"
      lastUpdated={terms.lastUpdated}
    >
      <Markdown source={terms.body} />
    </LegalLayout>
  );
}
