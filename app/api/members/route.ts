export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Member } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const query: Record<string, unknown> = {};
    if (role && role !== "all") query.role = role;
    if (status && status !== "all") query.status = status;
    const [members, total] = await Promise.all([
      Member.find(query).sort({ joinedAt: -1 }).lean(),
      Member.countDocuments(query),
    ]);
    return NextResponse.json({ members, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.email)
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    const exists = await Member.findOne({ email: body.email });
    if (exists) return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    const member = new Member(body);
    await member.save();
    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
