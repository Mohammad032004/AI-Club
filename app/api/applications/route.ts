export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Application } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");
    const query = status && status !== "all" ? { status } : {};
    const [applications, total] = await Promise.all([
      Application.find(query).sort({ submittedAt: -1 }).limit(limit).lean(),
      Application.countDocuments(query),
    ]);
    return NextResponse.json({ applications, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const existing = await Application.findOne({ email, status: { $ne: "rejected" } });
    if (existing)
      return NextResponse.json({ error: "An active application with this email already exists." }, { status: 409 });
    const app = new Application({ ...body, batch: "2025" });
    await app.save();
    return NextResponse.json({ success: true, id: app._id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
