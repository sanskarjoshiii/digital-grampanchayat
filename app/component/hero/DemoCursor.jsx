"use client";

import { forwardRef } from "react";

/**
 * The pointer that drives the hero demo.
 *
 * Purely presentational — every movement, hover and click is driven by the
 * timeline in useHeroTimeline. The ripple is a sibling rather than a child so
 * that scaling the cursor on click does not also scale the ripple.
 */
const DemoCursor = forwardRef(function DemoCursor({ rippleRef }, ref) {
  return (
    <>
      <span
        ref={rippleRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/25 bg-ink/10 opacity-0"
        style={{ willChange: "transform, opacity" }}
      />
      <span
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-40 opacity-0"
        style={{ willChange: "transform, opacity" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <defs>
            <filter id="demo-cursor-shadow" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#1f1f1f" floodOpacity="0.45" />
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#1f1f1f" floodOpacity="0.18" />
            </filter>
          </defs>
          <path
            d="M5 2.5 19.2 11.4a.62.62 0 0 1-.26 1.14l-5.72.87-2.6 5.3a.62.62 0 0 1-1.17-.2L5 2.5Z"
            fill="#ffffff"
            stroke="#1f1f1f"
            strokeWidth="1.05"
            strokeLinejoin="round"
            filter="url(#demo-cursor-shadow)"
          />
        </svg>
      </span>
    </>
  );
});

export default DemoCursor;
