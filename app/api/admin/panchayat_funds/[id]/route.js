import Funds from "@/app/modals/Funds";
import { connectToDB } from "@/app/utils/connection";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const data = await Funds.findOne({ _id: params.id });
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(req,{params}) {
    try {
      await connectToDB();
  
      const {
        scheme,
        component,
        expected_funds,
        actual_funds,
        reverted_funds,
        actual_expenditure,
        email,
      } = await req.json();
      await Funds.updateOne(
        { _id: params.id },
        {
          scheme,
          component,
          expected_funds,
          actual_funds,
          reverted_funds,
          actual_expenditure,
          email,
        }
      );
      return NextResponse.json(
        { message: "Funds Update Successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const data = await Funds.deleteOne({ _id: params.id });
    return NextResponse.json(
      { message: "Delete Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
