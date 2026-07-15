"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SearchBar from "./components/SearchBar";
import CategoryFilters from "./components/CategoryFilters";
import { DEFAULT_SERVICES } from "./defaultServices";

// Leaflet touches `window`, so the map must never render on the server.
const VillageMap = dynamic(() => import("./components/VillageMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-mist">
      <div className="loader" />
    </div>
  ),
});

export default function MapClient() {
  const [boundary, setBoundary] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  // Selected category keys. Empty set = "All" (show everything).
  const [active, setActive] = useState(new Set());
  const [focus, setFocus] = useState(null);
  const [busy, setBusy] = useState(false); // shows the loader on interactions
  const busyTimer = useRef(null);

  // Flash the app loader while a user action is applied, then clear it.
  const runBusy = (fn) => {
    setBusy(true);
    fn();
    if (busyTimer.current) clearTimeout(busyTimer.current);
    busyTimer.current = setTimeout(() => setBusy(false), 550);
  };

  useEffect(() => () => busyTimer.current && clearTimeout(busyTimer.current), []);

  // Load village boundary GeoJSON + services on mount.
  useEffect(() => {
    let cancelled = false;

    fetch("/geojson/chandgaon.geojson")
      .then((r) => r.json())
      .then((data) => !cancelled && setBoundary(data))
      .catch(() => {});

    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) && data.length ? data : DEFAULT_SERVICES;
        setServices(list);
      })
      .catch(() => {
        if (cancelled) return;
        setServices(DEFAULT_SERVICES);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  // Category keys that exist in the dataset (for the filter chips).
  const availableKeys = useMemo(
    () => new Set(services.map((s) => s.category)),
    [services]
  );

  // Markers shown = only the selected categories. Empty selection = show all.
  const visibleServices = useMemo(
    () =>
      active.size === 0
        ? services
        : services.filter((s) => active.has(s.category)),
    [services, active]
  );

  // Search across name / category / address (over all services).
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [services, query]);

  // Click a chip to select it; click again to unselect. Multiple can be on.
  const toggleCategory = (key) =>
    runBusy(() =>
      setActive((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      })
    );

  // "All" clears the selection so every service shows again.
  const resetCategories = () => runBusy(() => setActive(new Set()));

  const handleSelect = (service) =>
    runBusy(() => {
      // Ensure the picked service is visible (only when a filter is active).
      setActive((prev) => (prev.size === 0 ? prev : new Set(prev).add(service.category)));
      setFocus({ ...service, _ts: Date.now() }); // _ts forces re-fly on repeat selects
      setQuery("");
    });

  return (
    <div className="w-full min-h-[91vh] bg-paper py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-line pb-5 mb-5 text-center">
          <h1 className="text-2xl font-semibold text-ink">Nearby Services</h1>
          <p className="text-sm text-muted mt-1">
            Locate public services around Chandgaon village
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 mb-4">
          <SearchBar
            query={query}
            setQuery={setQuery}
            results={searchResults}
            onSelect={handleSelect}
          />
          <CategoryFilters
            active={active}
            onToggle={toggleCategory}
            onReset={resetCategories}
            availableKeys={availableKeys}
          />
        </div>

        {/* Map (full width) with a floating "showing" indicator */}
        <div className="ds-card overflow-hidden h-[64vh] min-h-[440px] relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-mist">
              <div className="loader" />
            </div>
          ) : (
            <VillageMap boundary={boundary} services={visibleServices} focus={focus} />
          )}

          {/* Showing X of Y — floating card, top-right of the map */}
          {!loading && (
            <div className="absolute top-3 right-3 z-[1000] ds-card px-3 py-2 shadow-pop">
              <span className="text-xs text-muted">Showing </span>
              <span className="text-sm font-semibold text-ink">
                {visibleServices.length}
              </span>
              <span className="text-xs text-muted"> of {services.length} services</span>
            </div>
          )}

          {/* App loader overlay shown while an interaction is processing */}
          {busy && !loading && (
            <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-paper/60 backdrop-blur-[1px]">
              <div className="loader" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
