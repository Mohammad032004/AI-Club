export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TeamMember } from "@/models";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

<<<<<<< HEAD
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    await connectDB();
    const member = await TeamMember.findById(id);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ member });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const body = await req.json();
    await connectDB();
    const updated = await TeamMember.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
=======
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const body = await req.json();
    await connectDB();
    const updated = await TeamMember.findByIdAndUpdate(id, { $set: body }, { new: true });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, member: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
<<<<<<< HEAD
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
=======
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
    await connectDB();
    await TeamMember.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
