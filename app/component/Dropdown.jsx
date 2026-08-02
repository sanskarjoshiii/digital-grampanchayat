"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom select styled like the module-search menu, used in place of the native
 * <select> so every menu in the app looks the same on every browser — the
 * native control is rendered by the operating system and ignores the design.
 *
 * options: [{ value, label, icon? }]
 */
export default function Dropdown({
  value,
  options,
  onChange,
  className = "",
  menuClassName = "",
  ariaLabel,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const onClickAway = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  // Open the menu with the current choice highlighted, not the first row.
  useEffect(() => {
    if (open) {
      const index = options.findIndex((option) => option.value === value);
      setActive(index >= 0 ? index : 0);
    }
  }, [open, value, options]);

  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") return setOpen(false);
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      return setOpen(true);
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current - 1 + options.length) % options.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`h-9 pl-3 pr-2 rounded-lg border bg-paper text-sm text-ink outline-none transition-colors flex items-center gap-2 ${
          open ? "border-ink" : "border-line hover:bg-mist"
        } ${className}`}
      >
        {selected?.icon && <img src={selected.icon} width={16} height={16} alt="" />}
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <span
          aria-hidden
          className={`ml-auto shrink-0 text-muted text-[10px] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-11 left-0 min-w-full w-max max-w-[80vw] max-h-72 overflow-y-auto bg-paper border border-line rounded-card shadow-pop py-1 z-50 ${menuClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                  index === active ? "bg-mist" : ""
                }`}
              >
                {option.icon && <img src={option.icon} width={16} height={16} alt="" />}
                <span className={isSelected ? "font-medium text-ink" : "text-ink"}>
                  {option.label}
                </span>
                {isSelected && (
                  <span aria-hidden className="ml-auto shrink-0 text-ink">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
