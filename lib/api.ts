/**
 * Typed API helpers — used across all admin pages.
 */

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data.error || "Request failed");
  return data as T;
}

// ── Applications ──────────────────────────────────────────────
export type AppStatus = "pending" | "accepted" | "rejected";
export interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  college?: string;
  certifications?: string;
  skills?: string[];
  domains?: string[];
  experience?: string;
  projectDesc?: string;
  whyJoin?: string;
  contribution?: string;
  goals?: string;
  github?: string;
  linkedin?: string;
  status: AppStatus;
  batch?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export const applicationsApi = {
  list: (status?: string) =>
    request<{ applications: Application[]; total: number }>(
      `/api/applications${status ? `?status=${status}` : ""}`
    ),
  updateStatus: (id: string, status: AppStatus) =>
    request<{ success: boolean; application: Application }>(`/api/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/applications/${id}`, { method: "DELETE" }),
};

// ── Members ───────────────────────────────────────────────────
export interface Member {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  branch?: string;
  year?: string;
  role: "admin" | "core" | "member";
  status: "active" | "inactive" | "alumni";
  github?: string;
  linkedin?: string;
  joinedAt: string;
  bio?: string;
  skills?: string[];
  showOnAbout?: boolean;
}

export const membersApi = {
  list: (params?: { role?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.role) q.set("role", params.role);
    if (params?.status) q.set("status", params.status);
    return request<{ members: Member[]; total: number }>(`/api/members?${q.toString()}`);
  },
  create: (data: Partial<Member>) =>
    request<{ success: boolean; member: Member }>("/api/members", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Member>) =>
    request<{ success: boolean; member: Member }>(`/api/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/members/${id}`, { method: "DELETE" }),
};

// ── Messages ──────────────────────────────────────────────────
export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  repliedAt?: string;
}

export const messagesApi = {
  list: (read?: boolean) => {
    const q = read !== undefined ? `?read=${read}` : "";
    return request<{ messages: Message[]; total: number }>(`/api/messages${q}`);
  },
  markRead: (id: string, read: boolean) =>
    request<{ success: boolean }>(`/api/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read }),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/messages/${id}`, { method: "DELETE" }),
};

// ── Events ────────────────────────────────────────────────────
export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface ClubEvent {
  _id: string;
  title: string;
  type: string;
  description?: string;
  date?: string;
  location?: string;
  maxAttendees?: number;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  registrationOpen: boolean;
  tags?: string[];
  formFields?: FormField[];
  allowTeams?: boolean;
  maxTeamSize?: number;
}

export const eventsApi = {
  list: (status?: string) =>
    request<{ events: ClubEvent[] }>(`/api/events${status ? `?status=${status}` : ""}`),
  create: (data: Partial<ClubEvent>) =>
    request<{ success: boolean; id: string }>("/api/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ClubEvent>) =>
    request<{ success: boolean; event: ClubEvent }>(`/api/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/events/${id}`, { method: "DELETE" }),
};

// ── Projects ──────────────────────────────────────────────────
export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  github?: string;
  liveDemo?: string;
  builtBy?: string[];
  year?: number;
  featured: boolean;
  visible: boolean;
  award?: string;
}

export const projectsApi = {
  list: () => request<{ projects: Project[] }>("/api/projects"),
  create: (data: Partial<Project>) =>
    request<{ success: boolean; id: string }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Project>) =>
    request<{ success: boolean; project: Project }>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" }),
};

// ── Resources ─────────────────────────────────────────────────
export interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  url?: string;
  fileSize?: string;
  access: "public" | "members";
  downloads: number;
  createdAt: string;
}

export const resourcesApi = {
  list: () => request<{ resources: Resource[] }>("/api/resources?access=all"),
  create: (data: Partial<Resource>) =>
    request<{ success: boolean; id: string }>("/api/resources", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Resource>) =>
    request<{ success: boolean; resource: Resource }>(`/api/resources/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/api/resources/${id}`, { method: "DELETE" }),
};
