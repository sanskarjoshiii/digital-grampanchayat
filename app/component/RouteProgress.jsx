"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// A thin top progress bar that gives instant feedback on tab/link clicks and
// completes when the new route has rendered — so navigation never feels dead.
export default function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState("idle"); // idle | loading | done
  const firstRender = useRef(true);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Start the bar as soon as an internal link to a different path is clicked.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (a.target === "_blank") return;
      let dest;
      try {
        dest = new URL(a.href);
      } catch {
        return;
      }
      if (dest.origin !== window.location.origin) return;
      if (dest.pathname === window.location.pathname) return;
      clearTimers();
      setState("loading");
      // Safety: never leave the bar stuck if a navigation stalls.
      timers.current.push(setTimeout(() => setState("idle"), 12000));
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  // When the path actually changes, finish the bar.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    clearTimers();
    setState("done");
    timers.current.push(setTimeout(() => setState("idle"), 350));
  }, [pathname]);

  const width = state === "loading" ? "85%" : state === "done" ? "100%" : "0%";
  const opacity = state === "idle" ? 0 : 1;
  const transition =
    state === "loading"
      ? "width 8s cubic-bezier(0.1,0.6,0.25,1)"
      : "width 0.2s ease, opacity 0.35s ease 0.15s";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "#1f1f1f",
          width,
          opacity,
          transition,
          boxShadow: "0 0 8px rgba(31,31,31,0.4)",
        }}
      />
    </div>
  );
}
