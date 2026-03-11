import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    connectToDB();
    const userData =await User.findOne({ email });
    if (userData) {
      return NextResponse.json(
        { message: "Account With this mail exist" },
        { status: 201 }
      );
    }
    await User.create({ email, password, name, userType: "admin" });
    return NextResponse.json(
      { message: "Account Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
