# Deploying PanchayatX to Vercel

Follow these in order. The whole thing takes about twenty minutes, and every
step is free on the starter plans.

You will need three things open: your **GitHub** repo, your **MongoDB Atlas**
dashboard, and your **EdgeStore** dashboard.

---

## 1. Get the database ready

The app talks to one MongoDB Atlas cluster and uses the database named by
`DB_NAME` — currently **`panchayatX`**.

### 1a. Let Vercel reach the cluster

By default Atlas only accepts connections from IP addresses you have listed,
which is probably just your laptop. Vercel runs on servers with no fixed IP, so
it will be refused and the site will show a database error.

Atlas → **Network Access** → **Add IP Address** → **Allow access from anywhere**
(`0.0.0.0/0`) → Confirm.

That sounds alarming but is the normal setup for serverless hosting: the cluster
is still protected by its username and password. Which is why the next step
matters.

### 1b. Use a strong database password

Atlas → **Database Access** → edit your database user → **Edit Password** →
*Autogenerate Secure Password* → **Update User**. Copy it somewhere safe.

Then build the connection string:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
```

If the password contains any of `@ : / ? # [ ] %`, percent-encode it —
`@` becomes `%40`. A raw `@` silently breaks the string and produces a confusing
authentication error.

---

## 2. Push the code to GitHub

```bash
git add -A
git commit -m "Prepare for deployment"
git push origin main
```

`.env.local` is git-ignored, so your passwords and keys are **not** pushed. That
is why every value has to be entered in Vercel by hand in step 4.

---

## 3. Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Find your repository and click **Import**.
3. Leave every build setting alone — Vercel detects Next.js on its own.
4. **Do not click Deploy yet.** Add the environment variables first (step 4),
   otherwise the first build fails and you have to redeploy.

---

## 4. Add the environment variables

On the import screen, open **Environment Variables** and add each of these. Tick
all three environments (Production, Preview, Development) for every one.

| Name | Value |
|---|---|
| `DB_URL` | Your Atlas connection string, with the new password |
| `DB_NAME` | `panchayatX` |
| `SESSION_SECRET` | A fresh random string — see below |
| `NEXT_PUBLIC_URL` | Your Vercel URL, e.g. `https://panchayatx.vercel.app` |
| `EMAIL_USER` | The Gmail address that sends OTPs |
| `EMAIL_PASS` | That account's Gmail **app password**, not the login password |
| `EDGE_STORE_ACCESS_KEY` | From your EdgeStore project |
| `EDGE_STORE_SECRET_KEY` | From your EdgeStore project |

Generate the session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use a **different** secret from your local one. Changing it later logs everybody
out, which is also how you force a global logout if it ever leaks.

`NEXT_PUBLIC_URL` is a guess until the first deploy finishes. Deploy, copy the
real URL, come back and correct it, then redeploy.

---

## 5. Deploy

Click **Deploy** and wait two or three minutes. Vercel builds and gives you a
URL like `https://panchayatx.vercel.app`.

Every push to `main` from now on deploys automatically. Pushes to other branches
get their own preview URL.

---

## 6. Check it worked

Open the site and walk through this list:

- [ ] Home page loads and the hero animation plays
- [ ] **Funds** shows all 20 records across 7 years — this proves Atlas Network
      Access is right
- [ ] **Documents → guides** open, and the official links work
- [ ] **Nearby services** map draws
- [ ] Sign up with a real email and the OTP arrives — this proves the Gmail
      app password is right
- [ ] Log in, and DevTools → Application → Cookies shows a `px_session` cookie
- [ ] Upload a profile photo — this proves the EdgeStore keys are right
- [ ] Raise a complaint with a photo, then check it appears under My Complaints
- [ ] Log out, and confirm a signed-out visitor **cannot** upload

If the funds page is empty, it is almost always step 1a.

---

## 7. A custom domain (optional)

Vercel → your project → **Settings → Domains** → add your domain, then create
the DNS records it shows you at your registrar. Once it is live, update
`NEXT_PUBLIC_URL` to the new address and redeploy.

---

## Common problems

**Site loads but every page shows a database error.** Atlas Network Access —
step 1a.

**Build fails with `Missing required environment variable "X"`.** That variable
was not added in step 4, or was added to only one environment. Add it and
redeploy.

**OTP emails never arrive.** `EMAIL_PASS` must be a Gmail *app password*
(Google Account → Security → 2-Step Verification → App passwords), not the
normal account password.

**Uploads fail for a logged-in user.** Log out and back in once. Uploads are
authorised by the session cookie, and a browser signed in before the cookie
existed does not have one.

**Everyone is logged out after a deploy.** `SESSION_SECRET` changed. Keep it
constant between deploys.

---

## Before real villagers use it

Two things in [README.md](README.md#known-gaps) should be fixed first — most
importantly that **passwords are stored in plain text**, and that several API
routes still trust an email supplied by the browser rather than the session
cookie. Neither blocks a demo, both matter once real accounts and real phone
numbers exist.
