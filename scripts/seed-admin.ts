/**
 * Run once to seed the admin user:
 *   npx tsx scripts/seed-admin.ts
 *
 * Make sure MONGODB_URI is set in .env.local
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config(); // automatically loads .env

const uri = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  await mongoose.connect(uri);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const password = await bcrypt.hash("nexusai@admin2025", 10);

  await User.findOneAndUpdate(
    { email: "admin@nexusai.club" },
    { name: "Aryan Kumar", email: "admin@nexusai.club", password, role: "admin" },
    { upsert: true, new: true }
  );

  console.log("✅ Admin user seeded:");
  console.log("   Email:    admin@aiclub.com");
  console.log("   Password: ailab@admin");
  console.log("   ⚠️  Change these credentials immediately after first login!");

  await mongoose.disconnect();
}

seed().catch(console.error);
