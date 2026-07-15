"use client";

import { LuSearch, LuX } from "react-icons/lu";
import { getCategory } from "../categories";

// Search box + live result dropdown. Selecting a result focuses the map.
export default function SearchBar({ query, setQuery, results, onSelect }) {
  return (
    <div className="relative">
      <div className="relative">
        <LuSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, category or address..."
          className="ds-input pl-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            aria-label="Clear search"
          >
            <LuX size={16} />
          </button>
        )}
      </div>

      {query && results.length > 0 && (
        <ul className="absolute z-[1000] mt-1 w-full max-h-64 overflow-auto ds-card p-1 no-scrollbar">
          {results.map((s) => {
            const id = s._id || `${s.name}-${s.latitude}`;
            const { Icon } = getCategory(s.category);
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(s)}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-lg hover:bg-mist transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-mist border border-line text-ink shrink-0">
                    <Icon size={14} strokeWidth={2.1} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">
                      {s.name}
                    </span>
                    {s.address && (
                      <span className="block text-xs text-muted truncate">{s.address}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {query && results.length === 0 && (
        <div className="absolute z-[1000] mt-1 w-full ds-card px-3 py-2 text-sm text-muted">
          No matching services found.
        </div>
      )}
    </div>
  );
}
