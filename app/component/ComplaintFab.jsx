"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalContext } from "../context/context";
import ComplaintForm from "./ComplaintForm";

// Pages where a floating button would be in the way or meaningless.
const HIDDEN_ON = ["/login", "/signup", "/login/forget_password"];

/**
 * Floating "raise a complaint" button, mounted once in the app shell so it is
 * present on every page. Villagers only — the office answers complaints from
 * the dashboard rather than filing them.
 */
export default function ComplaintFab() {
  const { userData, language } = useGlobalContext();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const en = language == "english";

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Keep the page behind the dialog from scrolling on mobile.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (HIDDEN_ON.includes(pathname)) return null;
  if (userData?.userType === "admin") return null;
  if (pathname === "/complaints") return null;

  const isLoggedIn = Boolean(userData?.email);

  return (
    <>
      <button
        onClick={() => (isLoggedIn ? setOpen(true) : router.push("/login"))}
        className="fixed bottom-5 right-5 z-[900] flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white shadow-pop transition-transform hover:scale-105 active:scale-95 sm:bottom-7 sm:right-7"
        aria-label={en ? "Raise a complaint" : "शिकायत दर्ज करें"}
        title={isLoggedIn ? undefined : en ? "Log in to raise a complaint" : "शिकायत दर्ज करने के लिए लॉग इन करें"}
      >
        <img
          src="https://img.icons8.com/ios-filled/50/ffffff/complaint.png"
          width={20}
          height={20}
          alt=""
        />
        <span className="hidden sm:inline">{en ? "Raise a complaint" : "शिकायत दर्ज करें"}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[950] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-card border border-line bg-paper shadow-pop sm:rounded-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={en ? "Raise a complaint" : "शिकायत दर्ज करें"}
          >
            <div className="sticky top-0 flex items-start gap-3 border-b border-line bg-paper px-5 py-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink">
                  {en ? "Raise a complaint" : "शिकायत दर्ज करें"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {en
                    ? "You will get a complaint number to track it with."
                    : "आपको इसे ट्रैक करने के लिए एक शिकायत क्रमांक मिलेगा।"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-5">
              <ComplaintForm
                onCancel={() => setOpen(false)}
                onDone={() => {
                  setOpen(false);
                  router.push("/complaints");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
