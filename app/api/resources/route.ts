export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resource } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const adminView = searchParams.get("admin") === "true";
    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    // FIX: public site shows all resources; admin view shows all
    // Previously was restricting to "public" only which hid most resources
    const resources = await Resource.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const resource = new Resource(body);
    await resource.save();
    return NextResponse.json({ success: true, id: resource._id, resource }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
