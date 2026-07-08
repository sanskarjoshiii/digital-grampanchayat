# Ownership Migration Checklist

Goal: replace every credential/service that belonged to the ex-teammate (`smartcoder0852`) with your own, so the whole project runs entirely on accounts **you** own. Work top to bottom; check each box as you go.

> The GitHub repo and git author identity are already yours — nothing to change there.
> Only three external services need migrating: **MongoDB**, **EdgeStore**, and **Gmail/SMTP**.

---

## 0. Before you start
- [ ] Have the app running locally once (`npm install` then `npm run dev`) so you can test after each swap.
- [ ] Open `.env.local` — this is the single file where all secrets live (it is git-ignored, never commit it).

Current values in `.env.local` that must ALL be replaced:
| Variable | Belongs to teammate? | Action |
|----------|----------------------|--------|
| `EMAIL_USER` / `EMAIL_PASS` | ✅ his Gmail | New Gmail + app password |
| `DB_URL` | ✅ his MongoDB Atlas | New Atlas cluster + user |
| `EDGE_STORE_ACCESS_KEY` / `EDGE_STORE_SECRET_KEY` | ✅ his EdgeStore | New EdgeStore project |
| `NEXT_PUBLIC_URL` | neutral | Keep `http://localhost:3000` |

---

## 1. MongoDB (database)

The DB connection string (`DB_URL`) currently points to his Atlas cluster (`cluster0.lfofxmp`, user `smartcoder0852`). Create your own.

- [ ] Sign in / sign up at **https://cloud.mongodb.com** with **your** email.
- [ ] Create a new **free (M0)** cluster.
- [ ] **Database Access** → Add a new database user (your own username + a strong password). Save the password.
- [ ] **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) for development.
- [ ] Click **Connect → Drivers** and copy the connection string. It looks like:
      `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/`
- [ ] Paste it into `.env.local` as `DB_URL` (keep the trailing `/` — the code appends the DB name `meripanchayat` automatically, see [app/utils/connection.js](app/utils/connection.js)).
- [ ] Restart `npm run dev` and sign up / log in — data should now save to **your** cluster.
- [ ] (Optional) In his cluster, later delete the data or revoke the `smartcoder0852` DB user so he no longer has access.

---

## 2. EdgeStore (file / document uploads)

`EDGE_STORE_ACCESS_KEY` and `EDGE_STORE_SECRET_KEY` are from his EdgeStore project. Documents and profile photos upload here (see [lib/edgestore.js](lib/edgestore.js) and [app/api/edgestore/[...edgestore]/route.js](app/api/edgestore/%5B...edgestore%5D/route.js)).

- [ ] Go to **https://edgestore.dev** and sign in with **your** account (GitHub login works).
- [ ] Create a **new project**.
- [ ] Copy the project's **Access Key** and **Secret Key**.
- [ ] Put them in `.env.local` as `EDGE_STORE_ACCESS_KEY` and `EDGE_STORE_SECRET_KEY`.
- [ ] Restart the dev server and test **Documents → Upload** and **profile photo** to confirm uploads land in your project.

---

## 3. Gmail / SMTP (OTP emails)

OTP emails are sent from his Gmail (`smartcoder0852@gmail.com`) via a Google **App Password**. All OTP email (both signup and password reset) goes through a single route — [app/api/user/otp/route.js](app/api/user/otp/route.js) — so this is the only file that sends mail. It already reads `process.env.EMAIL_USER` / `EMAIL_PASS`, so you only need to update `.env.local`.

- [ ] Decide which Gmail account to send from (your own, or a new dedicated one).
- [ ] On that Google account, enable **2-Step Verification** (required for app passwords): https://myaccount.google.com/security
- [ ] Create an **App Password**: https://myaccount.google.com/apppasswords → pick "Mail" → copy the 16-character password.
- [ ] In `.env.local` set:
      - `EMAIL_USER=your-address@gmail.com`
      - `EMAIL_PASS=your-16-char-app-password`
- [ ] Restart and test: go through **Sign up** and confirm the OTP email arrives from **your** address.
- [ ] Also test **Forgot password** — it uses the same OTP route, so it should now send from your account too.

---

## 4. Revoke his access (do AFTER yours works)

Once every flow works on your credentials, cut off the old ones so they can't be used:

- [ ] **Gmail:** revoke the old app password `iuyk wfjm wswv ejyq` at https://myaccount.google.com/apppasswords (his account) — or simply stop using that account.
- [ ] **MongoDB:** delete the `smartcoder0852` database user (and/or the old cluster) in his Atlas project.
- [ ] **EdgeStore:** delete or stop using his old project.

---

## 5. Final verification

- [ ] `.env.local` contains **only your** values — no `smartcoder0852` anywhere.
- [ ] Search the codebase for leftover hard-coded secrets: run `git grep -i smartcoder` — it should return **nothing**.
- [ ] Full smoke test on a fresh signup:
      - [ ] Sign up → OTP email received → account created
      - [ ] Log in
      - [ ] Upload a document (admin) → appears in list
      - [ ] Add a fund record (admin) → shows in yearly summary
      - [ ] Forgot password → reset works
- [ ] Confirm `.env.local` is still git-ignored: `git status` should NOT list it.

---

## Quick reference — final `.env.local` shape

```env
EMAIL_USER=your-address@gmail.com
EMAIL_PASS=your-16-char-app-password
NEXT_PUBLIC_URL=http://localhost:3000
DB_URL=mongodb+srv://<your-user>:<your-pass>@<your-cluster>.mongodb.net/
EDGE_STORE_ACCESS_KEY=your-edgestore-access-key
EDGE_STORE_SECRET_KEY=your-edgestore-secret-key
```
