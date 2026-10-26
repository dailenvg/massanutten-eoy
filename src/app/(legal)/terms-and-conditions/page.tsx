import type { Metadata } from "next";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = { title: "Terms & Conditions | VacationVIP" };

export default function TermsAndConditionsPage() {
  return <TermsContent />;
}
