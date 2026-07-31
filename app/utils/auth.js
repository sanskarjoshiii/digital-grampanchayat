import { cookies } from "next/headers";
import User from "@/app/modals/User";
import { SESSION_COOKIE, verifySession } from "./session";

/**
 * Identify the caller from the signed session cookie.
 *
 * Older routes in this app trust an email posted by the browser, which anyone
 * can change. New routes use this instead: the cookie is httpOnly and HMAC
 * signed, so the account it names cannot be forged from the client.
 *
 * Returns null when there is no valid session.
 */
export const currentUser = async () => {
  const session = verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!session?.email) return null;
  return User.findOne({ email: session.email })
    .select("email name username phoneNo profile userType")
    .lean();
};

/** Standard shape for "you are not signed in" across the complaint routes. */
export const signedOut = () => ({
  message: "Please log in again to continue",
  status: 401,
});
