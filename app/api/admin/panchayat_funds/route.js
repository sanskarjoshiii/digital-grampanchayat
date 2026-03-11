import Funds from "@/app/modals/Funds";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const data = await Funds.find();
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
export async function POST(req) {
  try {
    await connectToDB();

    const {
      scheme,
      component,
      expected_funds,
      actual_funds,
      reverted_funds,
      actual_expenditure,
      date,
      email,
    } = await req.json();
    await Funds.create({
      scheme,
      component,
      expected_funds,
      actual_funds,
      reverted_funds,
      actual_expenditure,
      date,
      email,
    });
    return NextResponse.json(
      { message: "Funds Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}


