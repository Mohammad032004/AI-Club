<<<<<<< HEAD
import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Force string type (VERY IMPORTANT)
const MONGODB_URI = process.env.MONGODB_URI as string;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

// ✅ Debug (remove later)
console.log("ENV CHECK:");
console.log("MONGODB_URI:", MONGODB_URI);
console.log("ADMIN_EMAIL:", ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", ADMIN_PASSWORD);

// ✅ Validate ENV
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
console.error("❌ Missing environment variables!");
process.exit(1);
}

// Schema
const UserSchema = new mongoose.Schema(
{
name: { type: String, required: true, default: "Admin User" },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, default: "admin" },
},
{ timestamps: true }
);

const User =
mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
try {
console.log("🔌 Connecting...");
await mongoose.connect(MONGODB_URI);


const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

const user = await User.findOneAndUpdate(
  { email: ADMIN_EMAIL },
  {
    name: "Irfan Ansari",
    email: ADMIN_EMAIL,
    password: hashedPassword,
  },
  { upsert: true, new: true }
);

console.log("🎉 SUCCESS:", user._id);


} catch (err) {
console.error("❌ ERROR:", err);
} finally {
await mongoose.disconnect();
process.exit(0);
}
}

seedAdmin();
=======
/**
 * Run once to seed the admin user:
 *   npx tsx scripts/seed-admin.ts
 *
 * Make sure MONGODB_URI is set in .env
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const User =
      mongoose.models.User || mongoose.model("User", UserSchema);

    // ✅ FINAL CREDENTIALS (use these to login)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: "Aryan Kumar",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, returnDocument: "after" } // ✅ fixed deprecation
    );

    console.log("\n🎉 Admin user ready:");
    console.log("   Email:   ", ADMIN_EMAIL);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   User ID: ", user._id);
    console.log("⚠️  Change password after first login!\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seed();
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
