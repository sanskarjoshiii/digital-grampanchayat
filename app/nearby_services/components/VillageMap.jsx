"use client";

import { useEffect, useMemo, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, GeoJSON, Polygon, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LuNavigation } from "react-icons/lu";
import { getCategory, VILLAGE_CENTER, DEFAULT_ZOOM } from "../categories";

// Build a minimal monochrome teardrop divIcon holding the category's line icon.
const iconCache = {};
const markerIcon = (categoryKey) => {
  if (iconCache[categoryKey]) return iconCache[categoryKey];
  const { Icon } = getCategory(categoryKey);
  const svg = renderToStaticMarkup(<Icon size={15} color="#ffffff" strokeWidth={2.1} />);
  const icon = L.divIcon({
    className: "village-marker",
    html: `<div class="vm-pin"><span>${svg}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  iconCache[categoryKey] = icon;
  return icon;
};

// Convert a GeoJSON Polygon ([lng, lat]) ring to Leaflet ([lat, lng]).
const ringToLatLng = (ring) => ring.map(([lng, lat]) => [lat, lng]);

// Fits the map to the village boundary once, and flies to a focused service.
function MapController({ boundaryLatLng, focus }) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!fittedRef.current && boundaryLatLng && boundaryLatLng.length) {
      map.fitBounds(boundaryLatLng, { padding: [30, 30] });
      fittedRef.current = true;
    }
  }, [map, boundaryLatLng]);

  useEffect(() => {
    if (focus) {
      map.flyTo([focus.latitude, focus.longitude], 17, { duration: 0.8 });
    }
  }, [map, focus]);

  return null;
}

export default function VillageMap({ boundary, services, focus }) {
  // Extract the boundary ring (first feature, outer ring) as [lat,lng].
  const boundaryLatLng = useMemo(() => {
    try {
      const coords = boundary?.features?.[0]?.geometry?.coordinates?.[0];
      return coords ? ringToLatLng(coords) : null;
    } catch {
      return null;
    }
  }, [boundary]);

  // Spotlight mask: a world-covering polygon with the village cut out as a hole.
  const worldRing = [
    [-90, -180],
    [90, -180],
    [90, 180],
    [-90, 180],
  ];

  // Monochrome, on-theme boundary.
  const boundaryStyle = {
    color: "#1f1f1f",
    weight: 3,
    fillColor: "#1f1f1f",
    fillOpacity: 0.04,
  };

  return (
    <MapContainer
      center={VILLAGE_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dim everything outside the village (spotlight effect) */}
      {boundaryLatLng && (
        <Polygon
          positions={[worldRing, boundaryLatLng]}
          pathOptions={{
            fillColor: "#1f1f1f",
            fillOpacity: 0.4,
            stroke: false,
            interactive: false,
          }}
        />
      )}

      {/* Village boundary */}
      {boundary && <GeoJSON data={boundary} style={boundaryStyle} />}

      {/* Service markers */}
      {services.map((s) => {
        const { Icon } = getCategory(s.category);
        const id = s._id || `${s.name}-${s.latitude}-${s.longitude}`;
        const directions = `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
        return (
          <Marker key={id} position={[s.latitude, s.longitude]} icon={markerIcon(s.category)}>
            <Popup>
              <div className="vm-popup-title">
                <span className="vm-popup-ic">
                  <Icon size={14} strokeWidth={2.1} />
                </span>
                <span>{s.name}</span>
              </div>
              {s.address && (
                <div className="vm-popup-row">
                  <b>Address</b> · {s.address}
                </div>
              )}
              {s.phone && (
                <div className="vm-popup-row">
                  <b>Phone</b> · {s.phone}
                </div>
              )}
              {s.workingHours && (
                <div className="vm-popup-row">
                  <b>Open</b> · {s.workingHours}
                </div>
              )}
              {s.description && (
                <div className="vm-popup-row">
                  <b>About</b> · {s.description}
                </div>
              )}
              <a className="vm-popup-btn" href={directions} target="_blank" rel="noopener noreferrer">
                <LuNavigation size={13} /> Get Directions
              </a>
            </Popup>
          </Marker>
        );
      })}

      <MapController boundaryLatLng={boundaryLatLng} focus={focus} />
    </MapContainer>
  );
}
