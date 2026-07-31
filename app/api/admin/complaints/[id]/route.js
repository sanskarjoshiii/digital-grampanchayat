import Complaint from "@/app/modals/Complaint";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { requiresNote, STATUS_VALUES } from "@/app/utils/complaints";
import { NextResponse } from "next/server";

/** Move a complaint along its lifecycle and record who did it. */
export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please log in again" }, { status: 401 });
    if (user.userType !== "admin")
      return NextResponse.json(
        { message: "Only the Panchayat office can change a complaint's status" },
        { status: 403 }
      );

    const { status, note = "" } = await request.json();
    if (!STATUS_VALUES.includes(status))
      return NextResponse.json({ message: "Unknown status" }, { status: 400 });

    // Closing a complaint without action has to say why — the villager sees it.
    if (requiresNote(status) && !note.trim())
      return NextResponse.json(
        { message: "Add a short reason so the villager knows why it was rejected" },
        { status: 400 }
      );

    const complaint = await Complaint.findById(params.id);
    if (!complaint) return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    if (complaint.status === status)
      return NextResponse.json({ message: "That is already the current status" }, { status: 400 });

    complaint.status = status;
    // Append rather than replace, so the trail of who did what survives.
    complaint.history.push({
      status,
      note: note.trim().slice(0, 500),
      byEmail: user.email,
      at: new Date(),
    });
    await complaint.save();

    return NextResponse.json({ message: "Status updated", complaint });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
