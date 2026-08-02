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

const cleanDocuments = (documents) =>
  (Array.isArray(documents) ? documents : [])
    .filter((doc) => typeof doc?.url === "string" && doc.url.startsWith("https://"))
    .slice(0, 10)
    .map((doc) => ({ title: String(doc.title || "").slice(0, 200), url: doc.url }));

const money = (value) => Math.max(0, Math.round(Number(value) || 0));

const shape = (body) => ({
  financialYear: String(body.financialYear || "").trim(),
  source: SOURCE_VALUES.includes(body.source) ? body.source : "goi",
  scheme: String(body.scheme || "").trim().slice(0, 200),
  component: String(body.component || "").trim().slice(0, 200),
  expectedFund: money(body.expectedFund),
  actualFundReceived: money(body.actualFundReceived),
  previousYearBalance: money(body.previousYearBalance),
  revertedFund: money(body.revertedFund),
  actualExpenditure: money(body.actualExpenditure),
  description: String(body.description || "").trim().slice(0, 3000),
  progress: Math.min(100, Math.max(0, Math.round(Number(body.progress) || 0))),
  documents: cleanDocuments(body.documents),
});

/** Public: fund records, optionally narrowed to one year and funding source. */
export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const source = searchParams.get("source");

    const query = {};
    if (isFinancialYear(year)) query.financialYear = year;
    if (SOURCE_VALUES.includes(source)) query.source = source;

    const funds = await Funds.find(query).sort({ financialYear: -1, scheme: 1 }).lean();
    // Every year that has data, so the picker only offers real options.
    const years = await Funds.distinct("financialYear");

    return NextResponse.json({
      funds,
      years: years.sort().reverse(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Could not load fund records" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const denied = await requireAdmin();
    if (denied) return NextResponse.json({ message: denied.message }, { status: denied.status });

    const body = shape(await request.json());
    if (!isFinancialYear(body.financialYear))
      return NextResponse.json(
        { message: "Choose a financial year, for example 2025-2026" },
        { status: 400 }
      );
    if (!body.scheme)
      return NextResponse.json({ message: "The scheme name is required" }, { status: 400 });

    const user = await currentUser();
    const fund = await Funds.create({ ...body, email: user.email });
    return NextResponse.json({ message: "Fund record added", fund }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
