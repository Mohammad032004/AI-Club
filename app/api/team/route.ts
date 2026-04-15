export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get("admin") === "true";
    const query = adminView ? {} : { visible: true };
    const team = await TeamMember.find(query).sort({ order: 1, _id: 1 }).lean();
    return NextResponse.json({ team });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.role || !body.tier)
      return NextResponse.json({ error: "Name, role, and tier are required" }, { status: 400 });
    const member = new TeamMember(body);
    await member.save();
    return NextResponse.json({ success: true, id: member._id, member }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
