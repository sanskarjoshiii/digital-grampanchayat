import Otp from "@/app/modals/Otp";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { clearUploadContext, sessionCookie, signSession } from "@/app/utils/session";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, name, username, profile = "", otp } = await req.json();
    // const user
  await  connectToDB();
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const currentTime = new Date();
    if (currentTime > record.expireTime) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    const userlogin = await User.findOne({ email: email });
    if (userlogin) {
      return NextResponse.json(
        { message: "Account already exist" },
        { status: 201 }
      );
    }

    const normalizedUsername = username?.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername || "")) {
      return NextResponse.json({ message: "Username must be 3–20 letters, numbers, or underscores" }, { status: 400 });
    }
    if (await User.exists({ username: normalizedUsername })) {
      return NextResponse.json({ message: "This username is already taken" }, { status: 409 });
    }
    const user = await User.create({ email, password, userType: "user", name, username: normalizedUsername, profile });
    await Otp.findOneAndDelete({ email });
    const response = NextResponse.json(
      { message: "Account Created Successfully" },
      { status: 200 }
    );
    const token = signSession(user.email);
    if (token) response.cookies.set(sessionCookie(token));
    clearUploadContext(response);
    return response;
  } catch (error) {
    if (error?.code === 11000) return NextResponse.json({ message: "This username is already taken" }, { status: 409 });
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
