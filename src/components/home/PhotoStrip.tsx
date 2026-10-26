"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { GALLERY_ITEMS } from "@/lib/gallery";
import { srcSetFor } from "@/lib/image-variants";
import { useModals } from "./ModalContext";

const DESKTOP_TILE_WIDTH = 400;
const MOBILE_QUERY = "(max-width: 763px)";
/** Rendered photo width: tiles crop landscape photos to cover, so a full-width phone tile shows ~1.25x its width. */
const TILE_SIZES = "(max-width: 763px) 125vw, 320px";

/** Horizontal photo strip with arrows + position dots; each tile opens the gallery lightbox. */
export default function PhotoStrip() {
  const { galleryRef } = useModals();
  const items = GALLERY_ITEMS;
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const count = items.length;

  const isMobileStrip = () => window.matchMedia(MOBILE_QUERY).matches;
  const slideWidth = () => stripRef.current?.clientWidth || 1;

  const currentIndex = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return 0;
    if (!isMobileStrip()) return Math.round(strip.scrollLeft / DESKTOP_TILE_WIDTH);
    return Math.round(strip.scrollLeft / slideWidth());
  }, []);

  const updateDots = useCallback(() => {
    let index = currentIndex();
    const max = count - 1;
    if (index < 0) index = 0;
    if (index > max) index = max;
    setActiveDot(index);
  }, [count, currentIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      const strip = stripRef.current;
      if (!strip) return;
      const max = count - 1;
      if (index < 0) index = 0;
      if (index > max) index = max;
      const amount = isMobileStrip() ? slideWidth() : DESKTOP_TILE_WIDTH;
      strip.scrollTo({ left: index * amount, behavior: "smooth" });
      updateDots();
    },
    [count, updateDots],
  );

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onScroll = () => {
      window.requestAnimationFrame(updateDots);
    };
    const onResize = () => {
      if (isMobileStrip()) goToSlide(currentIndex());
      updateDots();
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    strip.scrollLeft = 0;
    updateDots();
    return () => {
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [currentIndex, goToSlide, updateDots]);

  const openTile = (index: number, tile: HTMLElement) => galleryRef.current?.openAt(index, tile);
  const onTileClick = (index: number) => (e: MouseEvent<HTMLDivElement>) => openTile(index, e.currentTarget);
  const onTileKeyDown = (index: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    openTile(index, e.currentTarget);
  };

  return (
    <div className="photostrip-3 photostrip">
      <div className="herophotosrow-2" ref={stripRef}>
        {items.map((item, i) => (
          <div
            key={item.src}
            className="herolightboxstrip-4"
            role="button"
            tabIndex={0}
            aria-label={item.alt || "View larger image"}
            onClick={onTileClick(i)}
            onKeyDown={onTileKeyDown(i)}
          >
            <img width="600" alt={item.alt} src={item.src} srcSet={srcSetFor(item.src)} loading="lazy" sizes={TILE_SIZES} className="herostripphoto-3" />
          </div>
        ))}
      </div>
      <button type="button" className="arrow-right" aria-label="Next photo" onClick={() => goToSlide(currentIndex() + 1)}><ChevronRight aria-hidden="true" style={{ color: "#FFFFFF", width: "28px", height: "28px" }} /></button>
      <button type="button" className="arrow-left" aria-label="Previous photo" onClick={() => goToSlide(currentIndex() - 1)}><ChevronLeft aria-hidden="true" style={{ color: "#FFFFFF", width: "28px", height: "28px" }} /></button>
      <div className="photostrip-dots" role="group" aria-label="Photo gallery position">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={"photostrip-dot" + (i === activeDot ? " is-active" : "")}
            aria-label={`Photo ${i + 1} of ${count}`}
            aria-current={i === activeDot ? "true" : undefined}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}
