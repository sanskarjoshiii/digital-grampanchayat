"use client";

import { useEffect, useState } from "react";
import { statusMeta } from "../utils/complaints";

export function StatusBadge({ status }) {
  const meta = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium ${meta.className}`}
      title={meta.description}
    >
      {meta.label}
    </span>
  );
}

/** Thumbnails that open full size, so evidence can actually be inspected. */
export function MediaStrip({ media = [], onOpen }) {
  if (!media.length) return <span className="text-xs text-muted">None</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {media.map((item, index) => (
        <button
          key={`${item.url}-${index}`}
          type="button"
          onClick={() => onOpen(item)}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-mist transition-opacity hover:opacity-80"
          aria-label={`Open attachment ${index + 1}`}
        >
          {item.type === "video" ? (
            <>
              <video src={item.url} className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[10px] text-white">
                ▶
              </span>
            </>
          ) : (
            <img src={item.url} alt="" className="h-full w-full object-cover" />
          )}
        </button>
      ))}
    </div>
  );
}

/** Lightbox for a single attachment. */
export function MediaViewer({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-[960] flex items-center justify-center bg-ink/80 p-4"
      onClick={onClose}
      role="presentation"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-xl text-ink"
        aria-label="Close"
      >
        ×
      </button>
      {item.type === "video" ? (
        <video
          src={item.url}
          controls
          autoPlay
          className="max-h-full max-w-full rounded-lg"
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <img
          src={item.url}
          alt={item.title || "Complaint attachment"}
          className="max-h-full max-w-full rounded-lg object-contain"
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
}

/** Expand/collapse for long descriptions inside a table cell. */
export function Clamped({ text, lines = 2 }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (text || "").length > 140;
  return (
    <div className="min-w-0">
      <p
        className={`whitespace-pre-wrap break-words text-sm text-ink ${
          expanded || !isLong ? "" : `line-clamp-${lines}`
        }`}
        style={expanded || !isLong ? undefined : { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 text-xs font-medium text-muted hover:text-ink hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
