import { clearUploadContext, sessionCookie } from "@/app/utils/session";
import { NextResponse } from "next/server";

// Clearing localStorage only signs the browser out; this drops the httpOnly
// cookie too, so the account can no longer upload files after logging out.
export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(sessionCookie(""));
  clearUploadContext(response);
  return response;
}
