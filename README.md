# PanchayatX — Digital Gram Panchayat

> **Mission:** Bring the Gram Panchayat office into every villager's phone — making local governance transparent, accessible, and paperless, in the villager's own language.

A web platform that digitizes the day-to-day information and financial transparency of an Indian **Gram Panchayat** (village-level local self-government). It gives every villager a single, multilingual window into how public money flows into and out of their Panchayat, access to official documents, and a directory of nearby public services — while giving Panchayat administrators a simple back office to publish and maintain that information.

This is a **government-sponsored e-governance initiative**, built for the **betterment of rural citizens** — helping villagers access government information and services without repeated trips to a Panchayat office, and holding local governance accountable through public financial transparency.

---

## Table of Contents

1. [Objectives](#objectives)
2. [What the Project Does](#what-the-project-does)
3. [User Roles](#user-roles)
4. [Feature Walkthrough](#feature-walkthrough)
5. [Tech Stack](#tech-stack)
6. [Architecture & How It Works](#architecture--how-it-works)
7. [Data Models](#data-models)
8. [API Reference](#api-reference)
9. [Project Structure](#project-structure)
10. [Getting Started](#getting-started)
11. [Environment Variables](#environment-variables)
12. [Known Limitations & Security Notes](#known-limitations--security-notes)
13. [Roadmap — Planned Features](#roadmap--planned-features)

---

## Objectives

The core problem this project addresses is the **lack of transparency and easy access to Gram Panchayat information** for ordinary citizens. Fund allocations, expenditures, and official records are often locked away in offices and paperwork.

The project rests on three pillars:

- **Transparency** — public visibility of how government funds flow into and out of the Panchayat.
- **Access** — documents, services, and information without visiting an office.
- **Inclusion** — a multilingual interface so non-English speakers can use it.

Concretely, PanchayatX aims to:

- **Bring financial transparency** to village governance by publishing scheme-wise fund inflow and expenditure that any resident can inspect.
- **Provide a single digital touchpoint** for a village — funds, documents, and service listings in one place.
- **Break language barriers** by offering the interface in more than one language so it is usable by non-English speakers.
- **Give the Panchayat office a lightweight admin tool** to publish records without needing technical expertise.
- **Digitize official documents** so residents can view/download circulars and records online instead of visiting an office.

---

## What the Project Does

At a high level, the application has two sides:

- **Citizen side** — Any resident can create an account (email + OTP verification), log in, and browse:
  - Yearly summaries of Panchayat funds.
  - Detailed scheme-wise income and expenditure records.
  - Official documents (view / download).
  - A directory of nearby public services (schools, banks, ATMs, police stations, etc.).
  - Their own profile (name, phone, photo).

- **Admin side** — A Panchayat administrator can additionally:
  - Add, edit, and delete fund records (per scheme / component / year).
  - Upload and delete official documents.

The interface is available in **English** and a second Indian language (surfaced as "Hindi" / Marathi text in the UI), toggled from the header.

---

## User Roles

| Role  | How created | Capabilities |
|-------|-------------|--------------|
| **User** (citizen) | Self sign-up with email OTP verification | View funds, documents, nearby services; edit own profile |
| **Admin** | Created via the admin create-account endpoint | Everything a user can do **plus** create/edit/delete fund records and upload/delete documents |

The role is stored on the user record as `userType` (`"user"` or `"admin"`). The UI conditionally shows admin controls (e.g. the "add funds" button) when `userData.userType == "admin"`.

---

## Feature Walkthrough

### 1. Authentication & Onboarding
- **Sign up** with email → a 4-digit OTP is emailed via Nodemailer → OTP is verified (valid for 5 minutes) → account created.
- **Login** with email + password.
- **Forgot password** → OTP emailed → verified → password reset.
- Session is tracked client-side using the user's email stored in `localStorage`; routes redirect to `/login` when it's missing.

### 2. Panchayat Funds (Yearly Summary)
- `/panchayat_funds` lists funds grouped **by year**, aggregating totals across all records for each year:
  - Total expected funds
  - Total actual funds received
  - Total reverted funds
  - Total actual expenditure

### 3. Income / Expenditure Detail
- `/panchayat_funds/income_funds` and `/panchayat_funds/[year]` drill into individual scheme/component records for a given year.

### 4. Documents
- `/documents` lists uploaded official documents, each with a title and a file URL (stored via EdgeStore).
- Admins can upload new documents (`/documents/upload`) and delete existing ones.

### 5. Nearby Services
- `/nearby_services` displays an icon grid of common village amenities: Toilets, Parkings, Schools, Anganwadis, Common Service Center, ATMs, Police Station, Banks, Petrol Pump, Railway Station, Bus Stand. (Currently a static informational listing.)

### 6. Profile Management
- `/edit` lets a logged-in user update their name, phone number, and profile photo.

### 7. Multilingual UI
- A language selector in the header switches all key labels between English and the second language. Language state is held in global React context.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 14** (App Router) |
| Language | JavaScript (React 18) |
| Styling | **Tailwind CSS** |
| Database | **MongoDB** via **Mongoose** |
| File storage | **EdgeStore** (`@edgestore/react`, `@edgestore/server`) for document/image uploads |
| Email / OTP | **Nodemailer** (Gmail SMTP) |
| Validation | **Zod** |
| Password hashing | **bcrypt** (dependency present) |
| Notifications | **react-hot-toast** |
| Icons | **react-icons** + Icons8 CDN images |
| i18n | **next-i18next** (dependency) + a custom context-based language toggle |

---

## Architecture & How It Works

PanchayatX is a **full-stack Next.js App Router application** — both the UI and the backend live in the same project.

```
Browser (React client components)
   │
   │  fetch()  →  /api/**  (Next.js Route Handlers)
   ▼
Route Handlers  ──connectToDB()──►  MongoDB Atlas (Mongoose models)
   │                                      ▲
   │  Nodemailer ──► Gmail SMTP (OTP)      │
   │  EdgeStore  ──► file storage ─────────┘ (URLs saved as documents)
```

**Frontend**
- Client components (`"use client"`) render pages and call the internal API using the browser `fetch` API.
- Global state (current user, language, sidebar open/close, loader) is managed by a React Context provider in [app/context/context.js](app/context/context.js).
- `app/Provider.jsx` wraps pages with the header, sidebar, loader, and the EdgeStore provider — hiding the header on auth pages.

**Backend**
- Every backend endpoint is a **Next.js Route Handler** under [app/api/](app/api/), split into `user` and `admin` namespaces.
- [app/utils/connection.js](app/utils/connection.js) manages a cached MongoDB connection (connects once, reuses it across requests). It fails fast (~10s) with a clear message if the cluster is unreachable — e.g. the current IP is not whitelisted in Atlas — instead of hanging on a confusing buffering timeout.
- [app/utils/env.js](app/utils/env.js) exposes `requireEnv(name)`, used across the DB, email, and file-storage code so a missing environment variable throws a clear, named error at startup instead of failing silently later.
- Mongoose schemas in [app/modals/](app/modals/) define the data shape (note: the folder is spelled "modals" but contains data **models**).

**Auth flow**
- OTP records are persisted with a 5-minute expiry and deleted after successful verification.
- After login, the client stores the user's email in `localStorage` and fetches full user data (including `userType`) via `POST /api/user`.

---

## Data Models

Defined with Mongoose in [app/modals/](app/modals/):

### User — [app/modals/User.js](app/modals/User.js)
| Field | Type | Notes |
|-------|------|-------|
| `email` | String | Login identifier |
| `password` | String | Stored as-is (see security notes) |
| `userType` | String | `"user"` (default) or `"admin"` |
| `name` | String | Display name |
| `profile` | String | Profile image URL |
| `phoneNo` | String | Contact number |

### Funds — [app/modals/Funds.js](app/modals/Funds.js)
| Field | Type | Notes |
|-------|------|-------|
| `scheme` | String | Government scheme name |
| `component` | String | Sub-component of the scheme |
| `expected_funds` | Number | Amount expected |
| `actual_funds` | Number | Amount actually received |
| `reverted_funds` | Number | Amount returned/reverted |
| `actual_expenditure` | Number | Amount spent |
| `date` | Date | Used to group records by year |
| `email` | String | Admin who created the record |

### Document — [app/modals/Document.js](app/modals/Document.js)
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Document title |
| `url` | String | File URL (EdgeStore) |
| `createdAt` | Date | Upload date |

### Otp — [app/modals/Otp.js](app/modals/Otp.js)
| Field | Type | Notes |
|-------|------|-------|
| `email` | String | Recipient |
| `otp` | Number | 4-digit code |
| `expireTime` | Date | 5-minute validity window |

---

## API Reference

All endpoints are Next.js Route Handlers under `/api`.

### User & Auth
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/user/otp` | Generate + email a 4-digit OTP (5 min expiry) |
| `POST` | `/api/user/signup` | Verify OTP and create a citizen account |
| `POST` | `/api/user/login` | Authenticate with email + password |
| `POST` | `/api/user/forgetpassword` | Verify OTP and reset password |
| `POST` | `/api/user` | Fetch current user profile by email |
| `PUT`  | `/api/user` | Update profile (name, phone, photo) |

### Funds (Citizen — read only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/user/panchayat_funds` | Funds aggregated **by year** (totals) |
| `GET` | `/api/user/panchayat_funds/[year]` | All fund records for a specific year |

### Funds (Admin — read/write)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/api/admin/panchayat_funds` | List all fund records |
| `POST` | `/api/admin/panchayat_funds` | Create a fund record |
| `GET`  | `/api/admin/panchayat_funds/[id]` | Get a single record |
| `PUT`  | `/api/admin/panchayat_funds/[id]` | Update a record |
| `DELETE` | `/api/admin/panchayat_funds/[id]` | Delete a record |

### Documents & Admin
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/api/admin/document` | List all documents |
| `POST` | `/api/admin/document` | Add a document (title + URL) |
| `DELETE` | `/api/admin/document` | Delete a document by id |
| `POST` | `/api/admin/createaccount` | Create an **admin** account |
| `*`    | `/api/edgestore/[...edgestore]` | EdgeStore file upload handler |

---

## Project Structure

```
meripanchayat-main/
├── app/
│   ├── api/                      # Backend route handlers
│   │   ├── admin/                #   admin: funds, documents, create account
│   │   ├── user/                 #   user: auth, otp, profile, funds
│   │   └── edgestore/            #   file-upload handler
│   ├── component/                # Reusable UI (Header, Sidebar, Cards, Loader…)
│   ├── context/                  # Global React context (user, language, UI state)
│   ├── modals/                   # Mongoose data models (User, Funds, Document, Otp)
│   ├── reducers/                 # Reducer(s)
│   ├── utils/connection.js       # Cached MongoDB connection (fails fast on error)
│   ├── utils/env.js              # requireEnv() — validates required env vars
│   ├── translation/              # i18n translation JSON
│   ├── about/                    # Page routes ↓
│   ├── admin/                    #   admin fund add/edit pages
│   ├── documents/                #   document list + upload
│   ├── login/  signup/           #   auth pages (+ forgot password)
│   ├── panchayat_funds/          #   funds summary + per-year + income
│   ├── nearby_services/          #   services directory
│   ├── edit/                     #   profile edit
│   ├── layout.js                 # Root layout (providers, fonts, toaster)
│   ├── Provider.jsx              # Header/Sidebar/EdgeStore wrapper
│   └── page.js                   # Landing / welcome page
├── lib/edgestore.js              # EdgeStore React provider setup
├── public/                       # Static assets (logo, images)
├── .env.example                  # Template for .env.local (no secrets)
├── MIGRATION_CHECKLIST.md        # Steps to move services to your own accounts
├── tailwind.config.js
├── next.config.mjs
└── package.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB connection string, an EdgeStore project, and Gmail SMTP (app password) for OTP email.

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (see below) and fill in your credentials

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Scripts**
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Copy `.env.example` to `.env.local` (which is git-ignored) and fill in real values:

```env
EMAIL_USER=<smtp-username>                          # server-side; used by the OTP email route
EMAIL_PASS=<smtp-app-password>                       # server-side; e.g. a Gmail app password
NEXT_PUBLIC_URL=http://localhost:3000
DB_URL=<your-mongodb-connection-string>             # database "meripanchayat" is appended in code
EDGE_STORE_ACCESS_KEY=<edgestore-access-key>
EDGE_STORE_SECRET_KEY=<edgestore-secret-key>
```

> ⚠️ SMTP credentials are read from server-side env vars (`EMAIL_USER` / `EMAIL_PASS`) — never hard-code them and never use `NEXT_PUBLIC_` for secrets, since that exposes them to the browser. `.env.local` is git-ignored; keep it that way.

---

## Known Limitations & Security Notes

These are worth being aware of (and fixing before production use):

- **Passwords are stored and compared in plain text** in the auth routes, even though `bcrypt` is a dependency. Passwords should be hashed on signup and compared with `bcrypt.compare`.
- **Sessions are not real sessions** — auth state is just the email in `localStorage`. There is no signed token/JWT/cookie, so API routes are not actually protected; admin endpoints are reachable without server-side role checks.
- **Secrets** — SMTP credentials are now read from server-side env vars (`EMAIL_USER` / `EMAIL_PASS`) instead of being hard-coded, and `.env.local` is git-ignored. Since the old Gmail app password was previously present in source, **rotate it** (and the MongoDB / EdgeStore keys) as a precaution.
- **No server-side authorization** — the admin/user split is enforced only in the UI. Backend routes should verify the caller's role.
- **`reverted_funds` / `actual_expenditure`** are Numbers in the schema but sometimes parsed as floats from strings — input types should be normalized.
- The models folder is named `modals` (a common typo for "models").

---

## Roadmap — Planned Features

The following roadmap deepens the project's three pillars (transparency, access, inclusion) and turns it from an information portal into a full rural e-governance platform. Ordered by priority.

### Tier 0 — Foundation (security & trust)
- **Security hardening** — hash passwords with `bcrypt` (already a dependency), issue JWT / HTTP-only-cookie sessions, and enforce real server-side role checks (RBAC) on all admin routes.
- **Admin audit log** — record who changed which fund/document record and when, for accountability.

### Tier 1 — Signature features
- **AI Citizen Assistant** — a chatbot that answers villagers' questions ("how do I apply for a birth certificate?", "how much was spent on roads?") in the local language, grounded in the Panchayat's own data.
- **Government Scheme Eligibility Checker** — villagers enter basic details and see which welfare schemes (PM-Kisan, Ayushman Bharat, pensions, scholarships) they qualify for, with how-to-apply steps.
- **Grievance / Complaint System** — file a complaint with a photo (via EdgeStore), get a tracking ID, and follow its status (Pending → In Progress → Resolved); admin dashboard to manage.

### Tier 2 — Core e-governance services
- **Certificate requests** (birth, death, income, residence, caste) — apply online, admin issues, download as PDF.
- **Online tax / bill payments** (property, water) via a UPI / Razorpay payment gateway.
- **Development works tracker** — ongoing projects (roads, drainage) with budget vs actual spend, progress %, and photos.

### Tier 3 — Transparency, visualized
- **Fund Analytics Dashboard** — turn the existing funds data into charts (scheme-wise, year-over-year, expected vs actual vs reverted) with a library such as Recharts. *(High impact, low effort — recommended first build.)*

### Tier 4 — Communication & engagement
- **Announcements + SMS / WhatsApp notifications** (Twilio / MSG91) so citizens without smartphones still receive notices.
- **Gram Sabha module** — meeting schedules, minutes, and online voting on resolutions.
- **Community polls & surveys** for participatory decision-making.

### Tier 5 — Accessibility & reach
- **PWA / offline-first** support for areas with poor connectivity.
- **Voice input + text-to-speech** in the local language for low-literacy users.
- **Real "Nearby Services" map** (Leaflet + OpenStreetMap) replacing the current static grid.

### Engineering hygiene (ongoing)
- Complete `next-i18next` integration for full translation coverage beyond hardcoded label switches.
- Add input validation everywhere using the already-included `zod`.
- Add automated tests and CI.

---

*PanchayatX — making village governance transparent, accessible, and digital.*
