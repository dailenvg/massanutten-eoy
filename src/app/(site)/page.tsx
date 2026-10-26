import type { Metadata } from "next";

import { HomeInteractive } from "@/components/home/ModalContext";
import TopBar from "@/components/home/TopBar";
import SeasonalTopBar from "@/components/home/SeasonalTopBar";
import Hero from "@/components/home/Hero";
import HeroSubmenu from "@/components/home/HeroSubmenu";
import PhotoStrip from "@/components/home/PhotoStrip";
import WhatYouGet from "@/components/home/WhatYouGet";
import SeasonalSaleBanner from "@/components/home/SeasonalSaleBanner";
import ResortDetails from "@/components/home/ResortDetails";
import EverythingIncluded from "@/components/home/EverythingIncluded";
import VectorCta from "@/components/home/VectorCta";
import AmenitiesAndAttractions from "@/components/home/AmenitiesAndAttractions";
import GuestReviews from "@/components/home/GuestReviews";
import GuestStories from "@/components/home/GuestStories";
import BonusCta from "@/components/home/BonusCta";
import Footer from "@/components/home/Footer";
import ResortVideoModal from "@/components/home/ResortVideoModal";
import MobileStickyCta from "@/components/home/MobileStickyCta";
import GalleryModal from "@/components/home/GalleryModal";
import VideoModal from "@/components/home/VideoModal";
import PhoneModal from "@/components/home/PhoneModal";
import LegalModal from "@/components/home/LegalModal";
import CheckoutRouter from "@/components/home/CheckoutRouter";
import WebflowScroll from "@/components/home/WebflowScroll";

import SeasonMarker from "@/components/shared/SeasonMarker";
import { resolveSeason } from "@/lib/season";
import { GUEST_STORIES } from "@/lib/guest-stories";
import { RESORT_VIDEO_SRC } from "@/lib/offer";
import { PAGE_DESCRIPTION, RESERVE_URL } from "@/lib/site";

export { generateSeasonViewport as generateViewport } from "@/lib/season-viewport";

type PageProps = { searchParams: Promise<{ season?: string }> };

/** Sections with no Massanutten content yet render nothing until their data exists (lib/guest-stories, lib/offer). */
const HAS_GUEST_STORIES = GUEST_STORIES.length > 0;

/** `?season=` is a QA override only; the live version is resolved from the clock. */
async function seasonForRequest(searchParams: PageProps["searchParams"]) {
  const { season } = await searchParams;
  return resolveSeason(season);
}

/** Meta title swaps with the season; the description does not. */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const season = await seasonForRequest(searchParams);
  return {
    title: season.metaTitle,
    openGraph: { title: season.metaTitle, description: PAGE_DESCRIPTION },
    twitter: { title: season.metaTitle, description: PAGE_DESCRIPTION },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const season = await seasonForRequest(searchParams);

  return (
    <HomeInteractive>
      <SeasonMarker season={season.key} />
      <h1 className="vv-visually-hidden">{season.h1}</h1>
      <TopBar sticky={false} />
      <SeasonalTopBar season={season} />
      <Hero season={season} />
      <HeroSubmenu />
      <PhotoStrip />
      <WhatYouGet />
      <SeasonalSaleBanner season={season} />
      <ResortDetails season={season} />
      <EverythingIncluded season={season} />
      <VectorCta />
      <AmenitiesAndAttractions season={season} />
      <GuestReviews />
      {HAS_GUEST_STORIES ? <GuestStories /> : null}
      <BonusCta />
      <Footer />

      {/* Overlays / behaviours (position: fixed, so DOM order only mirrors the original). */}
      {RESORT_VIDEO_SRC ? <ResortVideoModal src={RESORT_VIDEO_SRC} /> : null}
      <MobileStickyCta season={season} />
      <GalleryModal />
      {HAS_GUEST_STORIES ? <VideoModal /> : null}
      <PhoneModal season={season.key} />
      <LegalModal />
      <CheckoutRouter destination={RESERVE_URL} />
      <WebflowScroll />
    </HomeInteractive>
  );
}
