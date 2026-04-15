export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    // In production: set an httpOnly cookie / JWT here
    return NextResponse.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
<<<<<<< HEAD

=======
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
