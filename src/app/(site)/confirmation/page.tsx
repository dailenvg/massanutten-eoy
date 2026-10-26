import type { Metadata } from "next";

import TopBar from "@/components/home/TopBar";
import Footer from "@/components/home/Footer";
import Confirmation from "@/components/checkout/Confirmation";

import SeasonMarker from "@/components/shared/SeasonMarker";
import { HERO_IMAGES, resolveSeason } from "@/lib/season";

export { generateSeasonViewport as generateViewport } from "@/lib/season-viewport";

type PageProps = { searchParams: Promise<{ season?: string }> };

/** Receipt — Figma node 4093:4380. Reached after the payment step. */
export const metadata: Metadata = {
  title: "You're All Set | Massanutten Resort & Ski Getaway Package",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { season } = await searchParams;
  const resolved = resolveSeason(season);

  return (
    <>
      <SeasonMarker season={resolved.key} />
      <TopBar />
      <Confirmation heroImage={HERO_IMAGES[resolved.key].desktop} />
      <Footer />
    </>
  );
}
