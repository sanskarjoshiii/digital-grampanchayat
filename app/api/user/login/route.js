import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { clearUploadContext, sessionCookie, signSession } from "@/app/utils/session";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { email, password } = await req.json();
    // const user
    const userlogin = await User.findOne({ email: email });
    if (!userlogin) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 201 }
      );
    }
    if (userlogin.password == password) {
      const response = NextResponse.json(
        { message: "Login Sucessfully" },
        { status: 200 }
      );
      // Signed, httpOnly cookie so the server can verify this account later
      // (file uploads). The client keeps using localStorage as before.
      const token = signSession(userlogin.email);
      if (token) response.cookies.set(sessionCookie(token));
      // Otherwise a context cached while signed out keeps uploads rejected.
      clearUploadContext(response);
      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Password" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:error.message},{status:400});
  }
}
