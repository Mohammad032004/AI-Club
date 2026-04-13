export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resource } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const access = searchParams.get("access"); // "public" or "all" (for logged-in members)
    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    if (access !== "all") query.access = "public"; // only show public if not authenticated
    const resources = await Resource.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const resource = new Resource(body);
    await resource.save();
    return NextResponse.json({ success: true, id: resource._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
