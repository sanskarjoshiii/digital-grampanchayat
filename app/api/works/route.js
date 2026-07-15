import Work from "@/app/modals/Work";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

// Normalize + apply the status-based rules on the server so data stays consistent
// regardless of what the client sends.
function normalize(body) {
  const status = ["pending", "ongoing", "completed"].includes(body.status)
    ? body.status
    : "pending";

  const num = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  const sanctionedAmount = num(body.sanctionedAmount);
  const receivedAmount = num(body.receivedAmount);

  // Amount utilized only counts when work has started (ongoing/completed).
  let amountUtilized = status === "pending" ? 0 : num(body.amountUtilized);
  let progress =
    status === "completed"
      ? 100
      : status === "pending"
      ? 0
      : Math.max(0, Math.min(100, num(body.progress)));

  const remainingBalance =
    status === "pending" ? receivedAmount : receivedAmount - amountUtilized;

  return {
    workId: (body.workId || "").trim(),
    schemeName: (body.schemeName || "").trim(),
    address: (body.address || "").trim(),
    description: (body.description || "").trim(),
    workName: (body.workName || "").trim(),
    sanctionedAmount,
    receivedAmount,
    startDate: body.startDate || null,
    expectedCompletionDate: body.expectedCompletionDate || null,
    status,
    amountUtilized,
    remainingBalance,
    contractor: (body.contractor || "").trim(),
    engineer: (body.engineer || "").trim(),
    sarpanch: (body.sarpanch || "").trim(),
    progress,
    documents: Array.isArray(body.documents) ? body.documents : [],
    finalCompletionDate:
      status === "completed" ? body.finalCompletionDate || null : null,
    // Result media is only kept once the work is completed.
    resultMedia:
      status === "completed" && Array.isArray(body.resultMedia)
        ? body.resultMedia
        : [],
    email: body.email || "",
  };
}

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = {};
    if (status && status !== "all") query.status = status;
    const data = await Work.find(query).sort({ createdAt: -1 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const doc = normalize(body);

    // Rules: Work ID and Scheme Name are mandatory.
    if (!doc.workId) {
      return NextResponse.json(
        { message: "Work ID is required" },
        { status: 400 }
      );
    }
    if (!doc.schemeName) {
      return NextResponse.json(
        { message: "Scheme Name is required" },
        { status: 400 }
      );
    }
    if (!doc.address) {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }
    if (!doc.description) {
      return NextResponse.json(
        { message: "Description is required" },
        { status: 400 }
      );
    }

    // Rule: Work ID must be unique.
    const exists = await Work.findOne({ workId: doc.workId });
    if (exists) {
      return NextResponse.json(
        { message: `Work ID "${doc.workId}" already exists` },
        { status: 409 }
      );
    }

    await Work.create(doc);
    return NextResponse.json(
      { message: "Work added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
