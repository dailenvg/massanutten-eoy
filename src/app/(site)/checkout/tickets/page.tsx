import type { Metadata } from "next";

import TopBar from "@/components/home/TopBar";
import Footer from "@/components/home/Footer";
import FlowLayout from "@/components/checkout/FlowLayout";
import StepTickets from "@/components/checkout/StepTickets";

import SeasonMarker from "@/components/shared/SeasonMarker";
import { resolveSeason } from "@/lib/season";

export { generateSeasonViewport as generateViewport } from "@/lib/season-viewport";

type PageProps = { searchParams: Promise<{ season?: string }> };

export const metadata: Metadata = {
  title: "Add Tickets | Massanutten Resort & Ski Getaway Package",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: PageProps) {
  const { season } = await searchParams;
  const resolved = resolveSeason(season);

  return (
    <>
      <SeasonMarker season={resolved.key} />
      <TopBar />
      <FlowLayout variant="summary" offering="tickets">
        <StepTickets />
      </FlowLayout>
      <Footer />
    </>
  );
}
