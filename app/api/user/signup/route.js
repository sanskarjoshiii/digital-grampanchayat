import Otp from "@/app/modals/Otp";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, name, otp } = await req.json();
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

    const user = await User.create({ email, password, userType: "user", name });
    await Otp.findOneAndDelete({ email });
    return NextResponse.json(
      { message: "Account Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
