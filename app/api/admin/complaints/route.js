import Complaint from "@/app/modals/Complaint";
import User from "@/app/modals/User";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { STATUS_VALUES } from "@/app/utils/complaints";
import { NextResponse } from "next/server";

/**
 * Office dashboard feed: every complaint, with the contact details staff need
 * to follow one up. Admin only — a villager calling this gets a 403.
 */
export async function GET(request) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please log in again" }, { status: 401 });
    if (user.userType !== "admin")
      return NextResponse.json(
        { message: "Only the Panchayat office can view this page" },
        { status: 403 }
      );

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const search = (searchParams.get("q") || "").trim();
    const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

    const query = {};
    if (STATUS_VALUES.includes(status)) query.status = status;
    if (search) {
      // Escape the input so a stray "(" or "*" cannot break the regex.
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(safe, "i");
      query.$or = [{ complaintId: pattern }, { title: pattern }, { raisedBy: pattern }];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: sort }).lean();

    // Attach who raised each one. Villagers never receive these fields; this
    // route is already gated on the admin role above.
    const emails = [...new Set(complaints.map((complaint) => complaint.raisedBy))];
    const users = emails.length
      ? await User.find({ email: { $in: emails } })
          .select("email name username phoneNo profile")
          .lean()
      : [];
    const byEmail = new Map(users.map((entry) => [entry.email, entry]));

    const counts = await Complaint.aggregate([
      { $group: { _id: "$status", total: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      complaints: complaints.map((complaint) => {
        const raiser = byEmail.get(complaint.raisedBy);
        return {
          ...complaint,
          raiser: {
            name: raiser?.name || "Village resident",
            username: raiser?.username || "villager",
            email: complaint.raisedBy,
            phoneNo: raiser?.phoneNo || "",
            profile: raiser?.profile || "",
          },
        };
      }),
      stats: {
        // Counts are deliberately unfiltered, so the tiles keep showing the
        // whole workload while you are looking at one status.
        total: counts.reduce((sum, entry) => sum + entry.total, 0),
        matching: complaints.length,
        ...Object.fromEntries(counts.map((entry) => [entry._id, entry.total])),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not load complaints" },
      { status: 500 }
    );
  }
}
