export type GalleryItem = { src: string; alt: string; caption: string };

/**
 * Component D — gallery. Eight tap-to-open modules, in order; caption and
 * alt are the same spec string.
 *
 * Winter photos from the Massanutten source page at their largest exported
 * size (the source strip's 520px thumbnails are too small for the lightbox).
 * Alt text is the source's own where it has one.
 */
const item = (src: string, text: string): GalleryItem => ({ src, alt: text, caption: text });

export const GALLERY_ITEMS: GalleryItem[] = [
  item("/images/massanutten/skier-powder.webp", "Skier carving through fresh powder"),
  item("/images/massanutten/resort-lodge-snow.webp", "Resort lodge building with snowy grounds and covered patio areas in winter"),
  item("/images/massanutten/guestroom-king.webp", "Massanutten Resort hotel room with a king bed, desk, TV, and two windows"),
  item("/images/massanutten/indoor-waterpark-dome.webp", "Guests swimming and floating on tubes in the Massanutten indoor WaterPark under a glass dome"),
  item("/images/massanutten/snow-tubing-lane.webp", "Guests snow tubing down a Massanutten tubing lane"),
  item("/images/massanutten/suite-fireplace.webp", "Cozy resort room with stone fireplace and comfortable seating"),
  item("/images/massanutten/skier-sunset.webp", "Skier on a groomed slope at sunset"),
  item("/images/massanutten/snowboarder-mountain-view.webp", "Snowboarder taking in snowy mountain views from the top of a Massanutten slope"),
];
