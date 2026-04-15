export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/models";

<<<<<<< HEAD
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get("admin") === "true";
    const query = adminView ? {} : { visible: true };
    const team = await TeamMember.find(query).sort({ order: 1, _id: 1 }).lean();
=======
export async function GET() {
  try {
    await connectDB();
    const team = await TeamMember.find({ visible: true }).sort({ order: 1 });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
    return NextResponse.json({ team });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
<<<<<<< HEAD
    if (!body.name || !body.role || !body.tier)
      return NextResponse.json({ error: "Name, role, and tier are required" }, { status: 400 });
    const member = new TeamMember(body);
    await member.save();
    return NextResponse.json({ success: true, id: member._id, member }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
=======
    const member = new TeamMember(body);
    await member.save();
    return NextResponse.json({ success: true, id: member._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
  }
}
