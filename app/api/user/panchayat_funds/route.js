import Funds from "@/app/modals/Funds";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let data = await Funds.find();

    // Group data by year and calculate totals
    let groupedData = {};

    data.forEach((item) => {
      let year = new Date(item.date).getFullYear();

      if (!groupedData.hasOwnProperty(year)) {
        groupedData[year] = {
          total_expected_funds: item.expected_funds || 0,
          total_actual_funds: item.actual_funds || 0,
          total_reverted_funds: parseFloat(item.reverted_funds) || 0,
          total_actual_expenditure: parseFloat(item.actual_expenditure) || 0,
        };
      } else {
        groupedData[year].total_expected_funds += item.expected_funds || 0;
        groupedData[year].total_actual_funds += item.actual_funds || 0;
        groupedData[year].total_reverted_funds += parseFloat(item.reverted_funds) || 0;
        groupedData[year].total_actual_expenditure += parseFloat(item.actual_expenditure) || 0;
      }
    });

    // Convert grouped data into an array of objects
    const result = Object.keys(groupedData).map((year) => ({
      year: parseInt(year),
      ...groupedData[year],
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
