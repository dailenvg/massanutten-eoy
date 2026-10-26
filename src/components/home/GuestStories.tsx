"use client";

import { PlaySolid } from "@/lib/icons";
import { GUEST_STORIES } from "@/lib/guest-stories";
import { useModals } from "./ModalContext";

/** Component J, part 2: Stories From Recent Guests (copy spec §12). */
export default function GuestStories() {
  const { videoRef } = useModals();

  return (
    <section className="gs" id="guest-stories" aria-labelledby="gs-heading">
      <h2 className="gs-heading" id="gs-heading">Stories From Recent Guests</h2>
      <div className="gs-track" role="list">
        {GUEST_STORIES.map((story, i) => (
          <button
            key={story.id}
            type="button"
            role="listitem"
            className="gs-card"
            onClick={(e) => videoRef.current?.open(i, e.currentTarget)}
            aria-label={`Play ${story.name}'s video review`}
          >
            <img src={story.poster} alt="" width="640" height="800" loading="lazy" decoding="async" />
            <span className="gs-play" aria-hidden="true"><PlaySolid /></span>
            <span className="gs-meta">
              <span className="gs-name">{story.name}</span>
              <span className="gs-loc">{story.place}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
