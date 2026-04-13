export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/models";

export async function GET() {
  try {
    await connectDB();
    const team = await TeamMember.find({ visible: true }).sort({ order: 1 });
    return NextResponse.json({ team });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const member = new TeamMember(body);
    await member.save();
    return NextResponse.json({ success: true, id: member._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
