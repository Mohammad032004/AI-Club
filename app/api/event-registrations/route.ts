export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EventRegistration } from "@/models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { eventId, name, email } = body;
    if (!eventId || !name || !email)
      return NextResponse.json({ error: "eventId, name, email required" }, { status: 400 });
    const reg = new EventRegistration(body);
    await reg.save();
    return NextResponse.json({ success: true, id: reg._id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const query = eventId ? { eventId } : {};
    const registrations = await EventRegistration.find(query).sort({ registeredAt: -1 }).lean();
    return NextResponse.json({ registrations, total: registrations.length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
