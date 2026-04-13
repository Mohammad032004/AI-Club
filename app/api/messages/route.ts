export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Message } from "@/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const read = searchParams.get("read");
    const query: Record<string, unknown> = {};
    if (read === "false") query.read = false;
    else if (read === "true") query.read = true;
    const [messages, total] = await Promise.all([
      Message.find(query).sort({ createdAt: -1 }).lean(),
      Message.countDocuments(query),
    ]);
    return NextResponse.json({ messages, total });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    const msg = new Message({ name, email, subject, message });
    await msg.save();
    return NextResponse.json({ success: true, id: msg._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
