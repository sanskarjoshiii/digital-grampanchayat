import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { clearUploadContext, sessionCookie, signSession } from "@/app/utils/session";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDB();
    const username = new URL(req.url).searchParams.get("username")?.trim().toLowerCase();
    if (!username) return NextResponse.json({ message: "Username is required" }, { status: 400 });
    const exists = await User.exists({ username });
    return NextResponse.json({ available: !exists });
  } catch (error) {
    return NextResponse.json({ message: "Could not verify username" }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const data = await User.findOne({ email });
    if (!data) throw new Error("User Not Found");
    return NextResponse.json(
      {
        name: data.name,
        username: data.username || "",
        email: data.email,
        phoneNo: data.phoneNo,
        profile: data.profile || "",
        userType: data.userType,
        village: data.village || "",
        district: data.district || "",
        state: data.state || "",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Invalid User", error: error.message }, { status: 404 });
  }
}

/**
 * Update the signed-in account.
 *
 * Identified from the session cookie rather than a posted email — otherwise
 * anyone could rewrite another villager's profile by naming them. Changing the
 * email address moves the account the session points at, so a fresh cookie is
 * issued in the same response; without it the next request would look signed
 * out.
 */
export async function PUT(req) {
  try {
    await connectToDB();
    const me = await currentUser();
    if (!me) return NextResponse.json({ message: "Please log in again" }, { status: 401 });

    const body = await req.json();
    const update = {};

    if (typeof body.name === "string") update.name = body.name.trim().slice(0, 80);
    if (typeof body.phoneNo === "string") update.phoneNo = body.phoneNo.replace(/\D/g, "").slice(0, 15);
    if (typeof body.profile === "string") update.profile = body.profile.trim();

    if (typeof body.username === "string") {
      const username = body.username.trim().toLowerCase();
      if (!/^[a-z0-9_]{3,20}$/.test(username))
        return NextResponse.json(
          { message: "Username must be 3–20 lowercase letters, numbers or underscores" },
          { status: 400 }
        );
      if (username !== me.username && (await User.exists({ username })))
        return NextResponse.json({ message: "This username is already taken" }, { status: 409 });
      update.username = username;
    }

    let emailChanged = false;
    if (typeof body.email === "string" && body.email.trim() !== me.email) {
      const email = body.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
      if (await User.exists({ email }))
        return NextResponse.json(
          { message: "An account already uses that email" },
          { status: 409 }
        );
      update.email = email;
      emailChanged = true;
    }

    await User.updateOne({ email: me.email }, update);
    const saved = await User.findOne({ email: update.email || me.email })
      .select("email name username phoneNo profile userType village district state")
      .lean();

    const response = NextResponse.json({
      message: "Profile updated",
      user: {
        name: saved.name || "",
        username: saved.username || "",
        email: saved.email,
        phoneNo: saved.phoneNo || "",
        profile: saved.profile || "",
        userType: saved.userType || "user",
        village: saved.village || "",
        district: saved.district || "",
        state: saved.state || "",
      },
      emailChanged,
    });

    if (emailChanged) {
      const token = signSession(saved.email);
      if (token) response.cookies.set(sessionCookie(token));
      clearUploadContext(response);
    }
    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message || "Could not update profile" }, { status: 400 });
  }
}
