# 📍 Nearby Services Module (Village Focus Map)

## Overview

The **Nearby Services** module is an interactive map that helps citizens locate important public services within the Gram Panchayat.

The map is designed to focus only on the selected village by:

- Highlighting the village boundary with a bold outline.
- Keeping the village area fully visible.
- Dimming the area outside the village.
- Displaying service locations using category-specific markers.
- Allowing users to search, filter, and navigate to services.

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Frontend |
| React Leaflet | Interactive maps |
| Leaflet | Map rendering |
| OpenStreetMap | Base map tiles |
| GeoJSON | Village boundary |
| MongoDB | Store nearby services |
| Tailwind CSS | UI Styling |

---

# Project Structure

```
app/
└── nearby-services/
    └── page.tsx

components/
├── VillageMap.tsx
├── ServiceMarker.tsx
├── SearchBar.tsx
├── CategoryFilters.tsx
└── MapLegend.tsx

public/
└── geojson/
    └── chandgaon.geojson

models/
└── Service.ts

app/api/
└── services/

lib/
└── mongodb.ts
```

---

# Village Boundary

The village boundary is stored as a GeoJSON polygon.

```
public/
    geojson/
        chandgaon.geojson
```

Example:

```json
{
  "type":"FeatureCollection",
  "features":[
      ...
  ]
}
```

This polygon defines the visible village area.

---

# Map Design

## Inside Village

- Normal OpenStreetMap theme
- Roads
- Buildings
- Landmarks
- Same appearance as Google Maps default style

## Outside Village

Everything outside the polygon should appear faded.

Example

```
████████████████████████████████

        Chandgaon Village

      🏥 Hospital

            🏫 School

                  🏛 GP Office

████████████████████████████████
```

The dimming effect helps users immediately identify the village area.

---

# Village Boundary Style

| Property | Value |
|----------|-------|
| Border Color | #16A34A |
| Border Width | 5px |
| Fill Color | #16A34A |
| Fill Opacity | 0.08 |

The boundary should remain clearly visible even while zooming.

---

# Outside Mask

A second polygon should cover the entire map except the village polygon.

Recommended style:

| Property | Value |
|----------|-------|
| Fill Color | Black |
| Fill Opacity | 0.45 |
| Border | None |

This creates a spotlight effect on the village.

---

# Base Map

Use OpenStreetMap tiles.

```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

This provides a clean map similar to the reference image.

---

# Nearby Services

Each service should be stored in MongoDB.

Example:

```ts
{
    name: "Primary Health Center",
    category: "hospital",

    latitude: 19.95651,
    longitude: 74.70481,

    phone: "9876543210",

    address: "Chandgaon",

    description: "...",

    workingHours: "9 AM - 5 PM",

    image: "...",

    verified: true
}
```

---

# Categories

Supported service types:

- Gram Panchayat
- School
- Hospital
- Medical Store
- Temple
- ATM
- Bank
- Bus Stop
- Water Tank
- Police Station
- Veterinary Hospital
- Fair Price Shop
- Milk Collection Center
- Agriculture Office
- Anganwadi
- Library
- Community Hall

---

# Custom Marker Icons

| Category | Icon |
|----------|------|
| Hospital | 🏥 |
| School | 🏫 |
| Panchayat | 🏛 |
| Temple | 🛕 |
| Bank | 🏦 |
| Police | 👮 |
| Water | 🚰 |
| Bus Stop | 🚏 |
| ATM | 💳 |

Each category should have a unique colored marker.

---

# Marker Popup

Clicking any marker opens a popup.

Example

```
🏥 Primary Health Center

Address
Chandgaon

Phone
9876543210

Open
9 AM - 5 PM

Description
Government Health Centre

[Get Directions]
```

---

# Navigation

The popup should include a button:

```
Get Directions
```

which opens Google Maps.

Example:

```
https://www.google.com/maps/dir/?api=1&destination=19.95651,74.70481
```

---

# Search

Users should be able to search by:

- Name
- Category
- Address

Example:

```
Search...

Hospital
Temple
School
```

---

# Category Filters

Example

```
☑ Hospitals

☑ Schools

☑ Panchayat

☑ Temple

☑ Bank

☑ Water Tank
```

Selecting a category displays only matching markers.

---

# Legend

```
🏥 Hospital

🏫 School

🏛 Panchayat

🏦 Bank

🛕 Temple
```

---

# Responsive Design

## Desktop

```
------------------------------------

Search

Filters

Map

Legend

------------------------------------
```

## Mobile

```
Search

Filters

Map

Bottom Sheet (Service Details)
```

---

# API

GET

```
/api/services
```

Returns all services.

Example response:

```json
[
  {
    "name":"Primary Health Center",
    "category":"hospital",
    "latitude":19.9565,
    "longitude":74.7048
  }
]
```

---

# Performance

- Load GeoJSON once.
- Lazy-load service markers.
- Cluster markers if the number exceeds 100.
- Use memoization for filters and search.

---

# Future Improvements

- Live traffic
- Offline map support
- Route inside village
- Nearest service finder
- Emergency services
- Voice navigation
- Dark mode
- Real-time event markers

---

# User Flow

```
Open Nearby Services

        │

        ▼

Load Village Boundary

        │

        ▼

Render OSM Map

        │

        ▼

Apply Village Highlight

        │

        ▼

Load Services

        │

        ▼

Display Markers

        │

        ▼

Search / Filter

        │

        ▼

Open Popup

        │

        ▼

Navigate using Google Maps
```

---

# Assets Required

```
public/

geojson/
    chandgaon.geojson

icons/
    hospital.png
    school.png
    bank.png
    temple.png
    panchayat.png
```

---

# Final UI Goals

✔ Clean Google Maps–like appearance (using OpenStreetMap tiles)

✔ Bold village boundary

✔ Dimmed area outside the village

✔ Interactive markers

✔ Category filters

✔ Search functionality

✔ Detailed popups

✔ Google Maps navigation

✔ Responsive design for desktop and mobile