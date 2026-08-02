import Funds from "@/app/modals/Funds";
import { connectToDB } from "@/app/utils/connection";
import { currentUser } from "@/app/utils/auth";
import { isFinancialYear, SOURCE_VALUES } from "@/app/utils/funds";
import { NextResponse } from "next/server";

const requireAdmin = async () => {
  const user = await currentUser();
  if (!user) return { message: "Please log in again", status: 401 };
  if (user.userType !== "admin")
    return { message: "Only the Panchayat office can manage fund records", status: 403 };
  return null;
};

const money = (value) => Math.max(0, Math.round(Number(value) || 0));

/** Public: one record, for the detail page. */
export async function GET(request, { params }) {
  try {
    await connectToDB();
    const fund = await Funds.findById(params.id).lean();
    if (!fund) return NextResponse.json({ message: "Fund record not found" }, { status: 404 });
    return NextResponse.json(fund);
  } catch (error) {
    return NextResponse.json({ message: "Fund record not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const denied = await requireAdmin();
    if (denied) return NextResponse.json({ message: denied.message }, { status: denied.status });

    const body = await request.json();
    if (!isFinancialYear(body.financialYear))
      return NextResponse.json(
        { message: "Choose a financial year, for example 2025-2026" },
        { status: 400 }
      );
    if (!String(body.scheme || "").trim())
      return NextResponse.json({ message: "The scheme name is required" }, { status: 400 });

    const fund = await Funds.findByIdAndUpdate(
      params.id,
      {
        financialYear: String(body.financialYear).trim(),
        source: SOURCE_VALUES.includes(body.source) ? body.source : "goi",
        scheme: String(body.scheme).trim().slice(0, 200),
        component: String(body.component || "").trim().slice(0, 200),
        expectedFund: money(body.expectedFund),
        actualFundReceived: money(body.actualFundReceived),
        previousYearBalance: money(body.previousYearBalance),
        revertedFund: money(body.revertedFund),
        actualExpenditure: money(body.actualExpenditure),
        description: String(body.description || "").trim().slice(0, 3000),
        progress: Math.min(100, Math.max(0, Math.round(Number(body.progress) || 0))),
        documents: (Array.isArray(body.documents) ? body.documents : [])
          .filter((doc) => typeof doc?.url === "string" && doc.url.startsWith("https://"))
          .slice(0, 10)
          .map((doc) => ({ title: String(doc.title || "").slice(0, 200), url: doc.url })),
      },
      { new: true }
    );
    if (!fund) return NextResponse.json({ message: "Fund record not found" }, { status: 404 });
    return NextResponse.json({ message: "Fund record updated", fund });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const denied = await requireAdmin();
    if (denied) return NextResponse.json({ message: denied.message }, { status: denied.status });

    const fund = await Funds.findByIdAndDelete(params.id);
    if (!fund) return NextResponse.json({ message: "Fund record not found" }, { status: 404 });
    return NextResponse.json({ message: "Fund record deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
