# PanchayatX

A digital Gram Panchayat: one place where a villager can see how public money
was spent, get the papers they need, raise a complaint and follow it until it is
fixed — in English, Marathi or Hindi.

Built to work for any Gram Panchayat in India. It runs today for **Chandgaon
Gram Panchayat** (LGD code 170972, Ahilyanagar, Maharashtra).

---

## What it does

**Funds** — Scheme-wise fund receipt and expenditure, year by year, in the same
format the Panchayat reports to the Government, so anyone can hold the two side
by side. Filter by financial year and funding source (Govt. of India / State /
Other). A charts page shows the same figures as graphs.

**Complaints** — A button on every page lets a villager report a problem with a
description and photos or video, taken straight from the camera. Each complaint
gets a number like `CMP-2026-000043`, and they can watch it move through
Submitted → Acknowledged → In progress → Resolved, with the office's note at
each step. Staff work from a separate dashboard showing the complainant's name,
username and mobile number.

**Documents** — Step-by-step guides for the six documents villagers ask about
most: Aadhaar, ration card, voter ID, birth certificate, death certificate and
property tax receipt. Each lists the papers needed, the cost, how long it takes,
and links only to verified `.gov.in` sites. Separately, the office publishes its
own circulars with descriptions.

**Community** — Official announcements, with likes, comments and polls. Who
liked a post is never shown — only how many did.

**Nearby services** — A map of schools, banks, ATMs, the bus stand and other
public places around the village.

**About** — Who runs the Panchayat, drawn as a tree from Sarpanch down to the
members, with photographs of the office and the village amenities.

**Help** — A `?` button on every page explains, in plain language, what that
page is for and how to use it.

---

## Built with

| Area | What we used | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | UI and API in one project |
| Language | JavaScript, React 18 | — |
| Styling | **Tailwind CSS** | Design tokens live in `tailwind.config.js` |
| Database | **MongoDB Atlas** via **Mongoose** | Hosted; no database server to run |
| File storage | **EdgeStore** | Photos, videos and PDFs |
| Charts | **Recharts** | Fund graphs |
| Maps | **Leaflet** + React-Leaflet | Nearby services |
| Hero animation | **GSAP** | The looping product demo on the home page |
| Motion | **Framer Motion** | Nav tab indicator |
| Smooth scroll | **Lenis** | — |
| Email | **Nodemailer** | Signup and password-reset OTPs |
| Icons | **react-icons**, Icons8 | — |

---

## The database

One MongoDB Atlas cluster, database **`panchayatX`**. The name comes from
`DB_NAME`, so production can use a separate database without any code change.

| Collection | Holds |
|---|---|
| `users` | Accounts: name, username, email, mobile, photo, role, and the village / district / state they belong to |
| `funds` | One row per scheme per financial year — expected, received, previous balance, reverted, spent — plus description, progress and supporting documents |
| `complaints` | Complaint number, title, description, photos, status, and the full history of who changed it and when |
| `counters` | Hands out complaint numbers one at a time, so two people can never get the same one |
| `communityposts` | Official posts, media, likes, comments and polls |
| `documents` | Circulars the office publishes |
| `services` | Places shown on the nearby-services map |
| `otps` | Short-lived signup and password-reset codes |

Files are **not** stored in MongoDB. They are uploaded to EdgeStore and only the
resulting URL is saved.

---

## Accounts and access

Two roles: **villager** and **admin** (the Panchayat office).

Logging in issues a signed, `httpOnly` session cookie. Everything that writes —
adding a fund record, publishing a document, changing a complaint's status,
uploading a file — is checked against that cookie on the server. Reading is open
to everyone: no account is needed to see the funds, documents or map.

---

## Running it locally

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

`.env.local` is git-ignored and never deployed. Every variable in it must also
be set in your hosting dashboard — see [DEPLOYMENT.md](DEPLOYMENT.md).

### Scripts

```bash
# Create the first admin account
node scripts/seed-system-head.cjs <email> <password> "System Head"

# Load Chandgaon's published fund figures (2020-21 to 2026-27)
node scripts/seed-funds.cjs --replace

# Copy one database to another inside the same cluster
node scripts/rename-database.cjs <from> <to>
```

---

## Project layout

```
app/
  api/          server routes (funds, complaints, users, documents, uploads)
  component/    shared UI
  hooks/        GSAP hero animation
  utils/        language, funds, complaints, formatting, auth helpers
  config/       the Panchayat's own details
  modals/       Mongoose schemas
public/         logo, avatar placeholder, office photos, map data
scripts/        seeding and admin scripts
```

To point this at a different village, `app/config/panchayat.js` is the file to
edit: the members, the helpline, the office photographs and the default
village / district / state all come from there.

---

## Known gaps

Worth knowing before this serves real residents:

- **Passwords are stored in plain text** and login compares them directly. They
  should be hashed with `bcrypt` before real accounts exist.
- **Only file uploads check the session.** Several older API routes still trust
  an email sent by the browser, so someone who knows an admin's address could
  read commenters' phone numbers. Moving every route onto `currentUser()` in
  `app/utils/auth.js` closes this.
- **Deleting a record does not delete its file** from EdgeStore, so storage only
  grows.
