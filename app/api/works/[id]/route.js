import Work from "@/app/modals/Work";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

function normalize(body) {
  const status = ["pending", "ongoing", "completed"].includes(body.status)
    ? body.status
    : "pending";
  const num = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };
  const receivedAmount = num(body.receivedAmount);
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
    sanctionedAmount: num(body.sanctionedAmount),
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
    resultMedia:
      status === "completed" && Array.isArray(body.resultMedia)
        ? body.resultMedia
        : [],
  };
}

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const data = await Work.findById(params.id);
    if (!data) {
      return NextResponse.json({ message: "Work not found" }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const body = await req.json();
    const doc = normalize(body);

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

    // Uniqueness of Work ID across other records.
    const clash = await Work.findOne({
      workId: doc.workId,
      _id: { $ne: params.id },
    });
    if (clash) {
      return NextResponse.json(
        { message: `Work ID "${doc.workId}" already exists` },
        { status: 409 }
      );
    }

    await Work.updateOne({ _id: params.id }, doc);
    return NextResponse.json(
      { message: "Work updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    await Work.deleteOne({ _id: params.id });
    return NextResponse.json(
      { message: "Work deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
