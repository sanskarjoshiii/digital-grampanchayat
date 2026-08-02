import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { NextResponse } from "next/server";

/**
 * Who the signed cookie says this browser is.
 *
 * The client keeps an email in localStorage, which survives long after the
 * session cookie has gone — after it expires, or for anyone who was already
 * logged in before sessions existed. That mismatch made the browser look signed
 * in while uploads were rejected as anonymous, so the app treats this route as
 * the source of truth instead.
 */
export async function GET() {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({
      authenticated: true,
      user: {
        name: user.name || "",
        username: user.username || "",
        email: user.email,
        phoneNo: user.phoneNo || "",
        profile: user.profile || "",
        userType: user.userType || "user",
        village: user.village || "",
        district: user.district || "",
        state: user.state || "",
      },
    });
  } catch (error) {
    // A database hiccup must not look like "signed out" and wipe local state.
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 503 });
  }
}
