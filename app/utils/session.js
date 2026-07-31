import crypto from "crypto";
import { requireEnv } from "./env";

/**
 * Minimal signed-session support.
 *
 * The app identifies users by an email kept in localStorage, which the browser
 * can set to anything — fine for deciding what to render, useless for deciding
 * what the server is allowed to do. This module issues a tamper-proof cookie at
 * login so server-side code (currently the file-upload gate) can trust who is
 * calling without a full auth rewrite.
 *
 * Token format: base64url(payload).base64url(hmac-sha256(payload, SESSION_SECRET))
 */

export const SESSION_COOKIE = "px_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const secret = () => process.env.SESSION_SECRET?.trim() || "";

const hmac = (body) => crypto.createHmac("sha256", secret()).update(body).digest("base64url");

/**
 * Build a signed token for this account.
 * Throws if SESSION_SECRET is unset, so a misconfigured deploy fails at login
 * with a clear message instead of silently issuing no cookie and leaving every
 * upload broken.
 */
export const signSession = (email) => {
  requireEnv("SESSION_SECRET", "a long random string, e.g. from `openssl rand -base64 32`");
  if (!email) return "";
  const body = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  return `${body}.${hmac(body)}`;
};

/** Return the payload if the token is authentic and unexpired, otherwise null. */
export const verifySession = (token) => {
  if (!token || !secret()) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(hmac(body));
  const received = Buffer.from(signature);
  // Constant-time compare; timingSafeEqual throws on a length mismatch.
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received))
    return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!payload?.email || !payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

/** Cookie options shared by the routes that set and clear the session. */
export const sessionCookie = (value) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true, // not readable by JavaScript, so XSS cannot steal it
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: value ? MAX_AGE_SECONDS : 0,
});

/**
 * Drop EdgeStore's cached upload context.
 *
 * EdgeStore resolves the upload context once and stores it in its own cookie
 * for 30 days. A browser that first loaded the site signed out therefore keeps
 * a "guest" context, and uploads stay rejected even after a correct login. So
 * whenever the identity changes — login, signup or logout — these are cleared
 * and EdgeStore re-initialises against the new session.
 */
export const clearUploadContext = (response) => {
  for (const name of ["edgestore-ctx", "edgestore-token"]) {
    response.cookies.set({ name, value: "", path: "/", maxAge: 0 });
  }
};
