export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resource } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
<<<<<<< HEAD
    const adminView = searchParams.get("admin") === "true";
    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    // FIX: public site shows all resources; admin view shows all
    // Previously was restricting to "public" only which hid most resources
    const resources = await Resource.find(query).sort({ createdAt: -1 }).lean();
=======
    const access = searchParams.get("access"); // "public" or "all" (for logged-in members)
    const query: Record<string, unknown> = {};
    if (category && category !== "all") query.category = category;
    if (access !== "all") query.access = "public"; // only show public if not authenticated
    const resources = await Resource.find(query).sort({ createdAt: -1 });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
<<<<<<< HEAD
    if (!body.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const resource = new Resource(body);
    await resource.save();
    return NextResponse.json({ success: true, id: resource._id, resource }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
=======
    const resource = new Resource(body);
    await resource.save();
    return NextResponse.json({ success: true, id: resource._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
  }
}
