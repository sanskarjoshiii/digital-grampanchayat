import Document from "@/app/modals/Document";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { NextResponse } from "next/server";

// Publishing and removing official records had no access check at all: any
// visitor could POST a document or DELETE every one of them. Both now require
// an admin session. Reading stays open, since villagers must be able to browse.
const requireAdmin = async () => {
  const user = await currentUser();
  if (!user) return { message: "Please log in again", status: 401 };
  if (user.userType !== "admin")
    return { message: "Only the Panchayat office can manage documents", status: 403 };
  return null;
};

export async function GET(req) {
  try {
    await connectToDB();
    const data = await Document.find().sort({ createdAt: -1 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const denied = await requireAdmin();
    if (denied) return NextResponse.json({ message: denied.message }, { status: denied.status });

    const { title, description = "", url, createdAt } = await req.json();
    if (!title?.trim() || !url?.trim())
      return NextResponse.json({ message: "A title and a file are required" }, { status: 400 });

    await Document.create({
      title: title.trim(),
      description: String(description).trim().slice(0, 1000),
      url,
      createdAt,
    });
    return NextResponse.json("Document Uploaded", { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const denied = await requireAdmin();
    if (denied) return NextResponse.json({ message: denied.message }, { status: denied.status });

    const { id } = await req.json();
    await Document.findOneAndDelete({ _id: id });
    return NextResponse.json("Document Deleted", { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
