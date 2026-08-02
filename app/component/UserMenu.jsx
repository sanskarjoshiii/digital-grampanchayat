"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/context";
import { avatarSrc } from "../utils/avatar";
import { pick } from "../utils/language";

/**
 * Avatar button with a small menu, replacing a name pill plus a separate
 * Logout button. Those two took roughly 180px of the header row and were the
 * first things to be clipped once the eight nav modules were in place.
 */
export default function UserMenu() {
  const { userData, setUserData, language } = useGlobalContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  

  useEffect(() => {
    const onClickAway = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const logout = async () => {
    setOpen(false);
    localStorage.removeItem("email");
    // Drops the httpOnly session cookie as well; ignore failures so a network
    // hiccup can never trap someone in a signed-in state.
    await fetch("/api/user/logout", { method: "POST" }).catch(() => {});
    setUserData({ email: "", phoneNo: "", name: "", profile: "" });
    router.push("/login");
  };

  return (
    <div className="relative shrink-0" ref={boxRef}>
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={pick(language, { en: "Your account", mr: "तुमचे खाते", hi: "आपका खाता" })}
        className={`flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border transition-colors ${
          open ? "border-ink bg-mist" : "border-line hover:bg-mist"
        }`}
      >
        <img
          className="w-7 h-7 rounded-full object-cover border border-line shrink-0"
          src={avatarSrc(userData.profile)}
          alt=""
        />
        {/* Hidden on a phone, where the row has no spare width. Truncated
            tightly between xl and 2xl, where the eight nav modules leave
            roughly 80px to spare, then allowed to breathe above that. */}
        <span className="hidden sm:inline text-sm text-ink max-w-[80px] 2xl:max-w-[120px] truncate">
          {userData.name || pick(language, { en: "Profile", mr: "प्रोफाइल", hi: "प्रोफ़ाइल" })}
        </span>
        <span
          aria-hidden
          className={`hidden 2xl:inline shrink-0 text-[10px] text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-56 bg-paper border border-line rounded-card shadow-pop py-1 z-50"
        >
          <div className="px-3 py-2 border-b border-line">
            <p className="text-sm font-medium text-ink truncate">
              {userData.name || pick(language, { en: "Villager", mr: "गावकरी", hi: "ग्रामवासी" })}
            </p>
            <p className="text-xs text-muted truncate">{userData.email}</p>
          </div>
          <Link
            href="/edit"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink hover:bg-mist transition-colors"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/user--v1.png"
              width={16}
              height={16}
              alt=""
            />
            {pick(language, { en: "Profile", mr: "प्रोफाइल", hi: "प्रोफ़ाइल" })}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink hover:bg-mist transition-colors"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/exit--v1.png"
              width={16}
              height={16}
              alt=""
            />
            {pick(language, { en: "Logout", mr: "बाहेर पडा", hi: "लॉग आउट" })}
          </button>
        </div>
      )}
    </div>
  );
}
