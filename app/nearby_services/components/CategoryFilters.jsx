"use client";

import { CATEGORIES } from "../categories";

// Centered, toggleable category chips. `active` is a Set of selected keys;
// an empty set means "All". Selected chips use a black outline + black text,
// unselected chips are muted.
export default function CategoryFilters({ active, onToggle, onReset, availableKeys }) {
  // Only show categories that actually have services on the map.
  const shown = CATEGORIES.filter((c) => availableKeys.has(c.key));
  const allOn = active.size === 0;

  const chip = (isOn) =>
    `ds-pill transition-colors ${
      isOn ? "border-ink text-ink" : "border-line text-muted hover:text-ink hover:border-ink/40"
    }`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={onReset} className={chip(allOn)}>
        All
      </button>
      {shown.map(({ key, label, Icon }) => {
        const isOn = active.has(key);
        return (
          <button key={key} type="button" onClick={() => onToggle(key)} className={chip(isOn)}>
            <Icon size={13} strokeWidth={2.1} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
