import {
  LuCross,
  LuPill,
  LuGraduationCap,
  LuBaby,
  LuLandmark,
  LuChurch,
  LuBanknote,
  LuCreditCard,
  LuShield,
  LuDroplets,
  LuBus,
  LuBath,
  LuLibrary,
  LuBuilding2,
  LuMapPin,
} from "react-icons/lu";

// Shared category config used by markers, legend, filters and search.
// `key` matches Service.category in the DB. `Icon` is a minimal Lucide
// line icon rendered monochrome to match the app's professional theme —
// no per-category colors, differentiation is by glyph only.
export const CATEGORIES = [
  { key: "hospital", label: "Hospital", Icon: LuCross },
  { key: "medical_store", label: "Medical Store", Icon: LuPill },
  { key: "school", label: "School", Icon: LuGraduationCap },
  { key: "anganwadi", label: "Anganwadi", Icon: LuBaby },
  { key: "panchayat", label: "Gram Panchayat", Icon: LuLandmark },
  { key: "temple", label: "Temple", Icon: LuChurch },
  { key: "bank", label: "Bank", Icon: LuBanknote },
  { key: "atm", label: "ATM", Icon: LuCreditCard },
  { key: "police", label: "Police Station", Icon: LuShield },
  { key: "water", label: "Water Tank", Icon: LuDroplets },
  { key: "bus_stop", label: "Bus Stop", Icon: LuBus },
  { key: "toilet", label: "Public Washroom", Icon: LuBath },
  { key: "library", label: "Library", Icon: LuLibrary },
  { key: "community_hall", label: "Community Hall", Icon: LuBuilding2 },
];

// Fast lookup by key with a safe fallback for unknown categories.
const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.key] = c;
  return acc;
}, {});

export const getCategory = (key) =>
  CATEGORY_MAP[key] || { key, label: key, Icon: LuMapPin };

// Default map view — centred on the real Chandgaon boundary polygon
// (see public/geojson/chandgaon.geojson). The map also fits to the boundary
// on load, so this is just the initial view before that runs.
export const VILLAGE_CENTER = [19.95625, 74.704446];
export const DEFAULT_ZOOM = 16;
