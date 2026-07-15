import Service from "@/app/modals/Service";
import { connectToDB } from "@/app/utils/connection";
import { DEFAULT_SERVICES } from "@/app/nearby_services/defaultServices";
import { NextResponse } from "next/server";

// GET /api/services
// Returns all nearby services. On first run (empty collection) the default
// seed set is inserted. If the database is unreachable we still return the
// default services so the map remains usable.
export async function GET() {
  try {
    await connectToDB();

    let data = await Service.find().lean();

    // Seed defaults the first time the collection is empty.
    if (!data || data.length === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      data = await Service.find().lean();
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // DB unavailable — fall back to the in-memory defaults so the UI works.
    console.error("GET /api/services failed, using fallback:", error.message);
    return NextResponse.json(DEFAULT_SERVICES, { status: 200 });
  }
}

// POST /api/services — add a new service.
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const created = await Service.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
