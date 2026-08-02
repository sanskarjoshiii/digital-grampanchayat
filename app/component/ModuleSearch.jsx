"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/context";
import { navItemsFor, label } from "./navItems";

const ModuleSearch = () => {
  const { language, userData } = useGlobalContext();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);

  const results = navItemsFor(userData).filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.en.toLowerCase().includes(q) || (item.hi || "").includes(query.trim())
    );
  });

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (item) => {
    if (!item) return;
    setQuery("");
    setOpen(false);
    router.push(item.href);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      {/* h-9 to match the help button and language menu — at h-10 it stood
          taller than everything else in the bar. */}
      <div className="flex items-center gap-2 h-9 px-3 rounded-full bg-mist border border-line focus-within:border-ink transition-colors">
        <img
          width="15"
          height="15"
          src="https://img.icons8.com/ios/50/8a8a82/search--v1.png"
          alt=""
          className="shrink-0"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={language == "english" ? "Search…" : "खोजें…"}
          className="bg-transparent text-sm text-ink placeholder-muted outline-none w-full min-w-0"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-11 left-0 w-full min-w-[240px] bg-paper border border-line rounded-card shadow-pop py-1 z-50">
          {results.map((item, i) => (
            <button
              key={item.href}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                i === active ? "bg-mist" : ""
              }`}
            >
              <img src={item.img} width={16} height={16} alt="" />
              <span className="text-ink">{label(item, language)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleSearch;
