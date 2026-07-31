import Complaint from "@/app/modals/Complaint";
import { nextSequence } from "@/app/modals/Counter";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { NextResponse } from "next/server";

const sanitiseMedia = (media) =>
  (Array.isArray(media) ? media : [])
    .filter((item) => typeof item?.url === "string" && item.url.startsWith("https://"))
    .slice(0, 10)
    .map((item) => ({
      url: item.url,
      type: item.type === "video" ? "video" : "image",
      title: String(item.title || "").slice(0, 200),
    }));

/** A villager's own complaints, newest first. Never returns anyone else's. */
export async function GET() {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please log in again" }, { status: 401 });

    const complaints = await Complaint.find({ raisedBy: user.email })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(complaints);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not load your complaints" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please log in again" }, { status: 401 });

    const { title, description, media } = await request.json();
    if (!title?.trim())
      return NextResponse.json({ message: "Give the complaint a short title" }, { status: 400 });
    if (!description?.trim())
      return NextResponse.json({ message: "Describe the problem" }, { status: 400 });

    // Year-scoped counter so numbering restarts each year: CMP-2026-000042.
    const year = new Date().getFullYear();
    const sequence = await nextSequence(`complaint-${year}`);
    const complaintId = `CMP-${year}-${String(sequence).padStart(6, "0")}`;

    const complaint = await Complaint.create({
      complaintId,
      title: title.trim(),
      description: description.trim(),
      media: sanitiseMedia(media),
      raisedBy: user.email,
      status: "submitted",
      history: [{ status: "submitted", byEmail: user.email, note: "Complaint raised" }],
    });

    return NextResponse.json(
      { message: `Complaint ${complaintId} registered`, complaint },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not register the complaint" },
      { status: 400 }
    );
  }
}
