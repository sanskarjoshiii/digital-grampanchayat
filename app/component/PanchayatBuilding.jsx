"use client";

import { useState } from "react";
import { useGlobalContext } from "../context/context";
import { PANCHAYAT_PHOTOS, PANCHAYAT_PHOTO_META } from "../config/panchayat";

/**
 * Photographs of the Panchayat office building.
 *
 * A tile removes itself if its file is not in `public/panchayat/`, so the
 * section shrinks quietly rather than showing a broken image, and disappears
 * altogether when no photographs have been added yet.
 */
const PanchayatBuilding = () => {
  const { language } = useGlobalContext();
  const en = language == "english";
  const [broken, setBroken] = useState([]);
  const [preview, setPreview] = useState(null);

  const markBroken = (src) =>
    setBroken((current) => (current.includes(src) ? current : [...current, src]));

  /**
   * The server sends the <img> tags, so the browser starts fetching them before
   * React hydrates. A file that 404s in that window fires its error event with
   * no listener attached — and error events on <img> do not bubble, so React's
   * delegated handler never sees it. Checking the element on mount catches
   * those: an image that has finished loading but has no width has failed.
   */
  const checkOnMount = (src) => (node) => {
    if (node && node.complete && node.naturalWidth === 0) markBroken(src);
  };

  const photos = PANCHAYAT_PHOTOS.filter((photo) => !broken.includes(photo.src));
  if (photos.length === 0) return null;

  const takenOn = new Date(PANCHAYAT_PHOTO_META.takenOn).toLocaleDateString(
    en ? "en-IN" : "hi-IN",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <p className="text-xs uppercase tracking-wide text-muted mb-3">
        {en ? "The Panchayat office" : "पंचायत कार्यालय"}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setPreview(photo)}
            className="group overflow-hidden rounded-card border border-line bg-mist"
            aria-label={en ? photo.alt_en : photo.alt_hi}
          >
            <img
              ref={checkOnMount(photo.src)}
              src={photo.src}
              alt={en ? photo.alt_en : photo.alt_hi}
              loading="lazy"
              onError={() => markBroken(photo.src)}
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-40"
            />
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-muted">
        {en ? "Photographed on " : "छायाचित्र दिनांक "}
        {takenOn} · {PANCHAYAT_PHOTO_META.place} ({PANCHAYAT_PHOTO_META.lat},{" "}
        {PANCHAYAT_PHOTO_META.lng})
      </p>

      {preview && (
        <div
          className="fixed inset-0 z-[960] flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setPreview(null)}
          role="presentation"
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-xl text-ink"
            aria-label={en ? "Close" : "बंद करें"}
          >
            ×
          </button>
          <img
            src={preview.src}
            alt={en ? preview.alt_en : preview.alt_hi}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default PanchayatBuilding;
