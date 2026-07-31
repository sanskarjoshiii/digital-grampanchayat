import Complaint from "@/app/modals/Complaint";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { isEditableByOwner } from "@/app/utils/complaints";
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

/** Load a complaint and confirm this session owns it. */
const ownedComplaint = async (id) => {
  const user = await currentUser();
  if (!user) return { error: "Please log in again", status: 401 };

  const complaint = await Complaint.findById(id);
  if (!complaint) return { error: "Complaint not found", status: 404 };
  // Ownership is checked against the session, so passing someone else's
  // complaint id gets a 403 rather than access to their record.
  if (complaint.raisedBy !== user.email)
    return { error: "This complaint belongs to another villager", status: 403 };

  return { user, complaint };
};

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { user, complaint, error, status } = await ownedComplaint(params.id);
    if (error) return NextResponse.json({ message: error }, { status });

    if (!isEditableByOwner(complaint.status))
      return NextResponse.json(
        {
          message:
            "The office has already started on this complaint, so it can no longer be edited. Add a new complaint instead.",
        },
        { status: 409 }
      );

    const { title, description, media } = await request.json();
    if (!title?.trim() || !description?.trim())
      return NextResponse.json(
        { message: "Both a title and a description are required" },
        { status: 400 }
      );

    complaint.title = title.trim();
    complaint.description = description.trim();
    complaint.media = sanitiseMedia(media);
    await complaint.save();

    return NextResponse.json({ message: "Complaint updated", complaint });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const { complaint, error, status } = await ownedComplaint(params.id);
    if (error) return NextResponse.json({ message: error }, { status });

    if (!isEditableByOwner(complaint.status))
      return NextResponse.json(
        {
          message:
            "The office has already started on this complaint, so it can no longer be withdrawn.",
        },
        { status: 409 }
      );

    await complaint.deleteOne();
    return NextResponse.json({ message: "Complaint withdrawn" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
