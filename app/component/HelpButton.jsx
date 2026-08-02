"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "../context/context";
import { helpForPath } from "../utils/pageHelp";

/**
 * "?" button in the header. Explains, in plain language, what the page the
 * villager is currently looking at is for and how to use it.
 */
export default function HelpButton() {
  const { language } = useGlobalContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const en = language == "english";
  const help = helpForPath(pathname, language);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the panel when moving to another page, so it never shows help for
  // the page you just left.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-sm font-semibold text-ink transition-colors hover:bg-mist"
        aria-label={en ? "Help for this page" : "इस पृष्ठ की मदद"}
        title={en ? "How to use this page" : "इस पृष्ठ का उपयोग कैसे करें"}
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[970] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-card border border-line bg-paper shadow-pop sm:rounded-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={help.title}
          >
            <div className="sticky top-0 flex items-start gap-3 border-b border-line bg-paper px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {en ? "How to use this page" : "इस पृष्ठ का उपयोग कैसे करें"}
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-ink">{help.title}</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist"
                aria-label={en ? "Close" : "बंद करें"}
              >
                ×
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-[15px] leading-7 text-ink">{help.what}</p>

              <ol className="mt-5 space-y-3">
                {help.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-6 text-ink">{step}</span>
                  </li>
                ))}
              </ol>

              {help.note && (
                <p className="mt-5 rounded-lg border border-line bg-cream px-4 py-3 text-sm leading-6 text-muted">
                  {help.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
