import mongoose, { Schema, model, models } from "mongoose";

// ─── USER (Admin/Core) ───
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "core", "member"], default: "member" },
  createdAt: { type: Date, default: Date.now },
});
export const User = models.User || model("User", UserSchema);

// ─── MEMBER ───
const MemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  branch: String,
  year: String,
  role: { type: String, enum: ["admin", "core", "member"], default: "member" },
  status: { type: String, enum: ["active", "inactive", "alumni"], default: "active" },
  github: String,
  linkedin: String,
  joinedAt: { type: Date, default: Date.now },
  avatar: String,
  bio: String,
  skills: [String],
  domains: [String],
  points: { type: Number, default: 0 }, // Leaderboard
});
export const Member = models.Member || model("Member", MemberSchema);

// ─── TEAM MEMBER ───
const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  tier: { type: String, enum: ["faculty", "leadership", "core", "member"], required: true },
  department: String,
  course: String,
  bio: String,
  photo: String,
  email: String,
  linkedin: String,
  github: String,
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});
export const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);

// ─── APPLICATION ───
const ApplicationSchema = new Schema({
  // Personal
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  gender: String,
  github: String,
  linkedin: String,
  // Academics
  college: String,
  branch: String,
  year: String,
  cgpa: Number,
  certifications: String,
  // Skills
  skills: [String],
  domains: [String],
  experience: String,
  projectDesc: String,
  // SOP
  whyJoin: String,
  contribution: String,
  goals: String,
  // Meta
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  batch: String,
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: String,
  reviewedAt: Date,
  reviewNote: String,
});
export const Application = models.Application || model("Application", ApplicationSchema);

// ─── EVENT ───
const EventSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["workshop", "hackathon", "talk", "meetup", "competition"], required: true },
  description: String,
  date: Date,
  endDate: Date,
  location: String,
  isOnline: { type: Boolean, default: false },
  maxAttendees: Number,
  status: { type: String, enum: ["upcoming", "ongoing", "past", "cancelled"], default: "upcoming" },
  bannerGradient: String,
  tags: [String],
  registrationOpen: { type: Boolean, default: true },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});
export const Event = models.Event || model("Event", EventSchema);

// ─── EVENT REGISTRATION ───
const EventRegistrationSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  branch: String,
  year: String,
  teamName: String,
  teamSize: Number,
  registeredAt: { type: Date, default: Date.now },
  attended: { type: Boolean, default: false },
});
export const EventRegistration = models.EventRegistration || model("EventRegistration", EventRegistrationSchema);

// ─── PROJECT ───
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  github: String,
  liveDemo: String,
  builtBy: [String],
  year: Number,
  featured: { type: Boolean, default: false },
  award: String,
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
export const Project = models.Project || model("Project", ProjectSchema);

// ─── RESOURCE ───
const ResourceSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["ai_ml", "web_dev", "cybersecurity", "research", "career"], required: true },
  type: { type: String, enum: ["pdf", "video", "guide", "notebook", "link"], required: true },
  url: String,
  fileSize: String,
  access: { type: String, enum: ["public", "members"], default: "members" },
  uploadedBy: String,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
export const Resource = models.Resource || model("Resource", ResourceSchema);

// ─── MESSAGE ───
const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  repliedAt: Date,
  createdAt: { type: Date, default: Date.now },
});
export const Message = models.Message || model("Message", MessageSchema);
