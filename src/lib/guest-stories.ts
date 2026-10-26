/**
 * Component J, part 2: Stories From Recent Guests.
 *
 * Empty until Massanutten guest videos exist: the template's stories were
 * Gatlinburg testimonials and the source page has none. With no stories the
 * section and its video modal render nothing. Each entry needs an H.264 +
 * faststart MP4 in /videos and a 640x800 poster.
 */
export type GuestStory = {
  id: string;
  name: string;
  /** Short line under the name on the card. */
  place: string;
  /** Shown in the video modal under the name. */
  description: string;
  src: string;
  poster: string;
};

export const GUEST_STORIES: readonly GuestStory[] = [];
