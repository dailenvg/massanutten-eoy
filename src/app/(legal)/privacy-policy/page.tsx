import type { Metadata } from "next";
import PrivacyContent from "@/components/legal/PrivacyContent";

export const metadata: Metadata = { title: "Privacy Policy | VacationVIP" };

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
