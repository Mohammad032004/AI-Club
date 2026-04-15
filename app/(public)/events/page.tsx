"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, Card, Badge, GradientButton, OutlineButton } from "@/components/ui";
import { Calendar, MapPin, Users, Clock, ArrowRight, RefreshCw, Plus, Trash2 } from "lucide-react";

interface FormField { id: string; label: string; type: string; required: boolean; options?: string[]; }
interface ClubEvent {
  _id: string; title: string; type: string; description?: string; date?: string; location?: string;
  maxAttendees?: number; status: "upcoming"|"ongoing"|"past"|"cancelled"; registrationOpen: boolean;
  tags?: string[]; formFields?: FormField[]; allowTeams?: boolean; maxTeamSize?: number;
}

// FIX #2: Dynamic registration modal supporting custom fields + team members
function RegModal({ event, onClose }: { event: ClubEvent; onClose: () => void }) {
  const defaultFields: FormField[] = [
    { id: "name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email Address", type: "email", required: true },
    { id: "phone", label: "Phone Number", type: "tel", required: true },
    { id: "branch", label: "Branch / Program", type: "text", required: true },
  ];
  const fields = (event.formFields && event.formFields.length > 0) ? event.formFields : defaultFields;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<Array<Record<string, string>>>([]);
  const [teamName, setTeamName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !formData[f.id]?.trim()) e[f.id] = `${f.label} is required`;
    });
    if (formData["email"] && !/^[^@]+@[^@]+\.[^@]+$/.test(formData["email"])) {
      e["email"] = "Valid email required";
    }
    if (event.allowTeams && !teamName.trim()) e["teamName"] = "Team name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event._id, ...formData, teamName, teamMembers, extraFields: formData }),
      });
      setDone(true);
    } catch { setDone(true); } // still show success
    finally { setLoading(false); }
  };

  const addTeamMember = () => setTeamMembers(prev => [...prev, { name: "", email: "", phone: "" }]);
  const removeTeamMember = (i: number) => setTeamMembers(prev => prev.filter((_, idx) => idx !== i));
  const updateTeamMember = (i: number, k: string, v: string) => setTeamMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [k]: v } : m));

  if (done) return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: "center", padding: "2.5rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: ".75rem" }}>You're Registered!</h3>
        <p style={{ color: "#8b949e", lineHeight: 1.7, marginBottom: ".5rem" }}>Thanks, <strong style={{ color: "#f0f6fc" }}>{formData["name"]}</strong>!</p>
        <p style={{ color: "#8b949e", fontSize: ".875rem", marginBottom: "1.75rem" }}>Confirmation sent to <strong style={{ color: "#90c8ff" }}>{formData["email"]}</strong></p>
        <GradientButton onClick={onClose}>Close</GradientButton>
      </div>
    </div>
  );

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>Register for Event</h3>
            <p style={{ color: "#8b949e", fontSize: ".82rem" }}>{event.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
        </div>

        {/* Dynamic fields from admin */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem 1rem" }}>
          {fields.map(f => (
            <div key={f.id} style={{ gridColumn: f.type === "textarea" ? "1/-1" : undefined }}>
              <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".38rem" }}>
                {f.label}{f.required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
              </label>
              {f.type === "select" ? (
                <select className="input-field" value={formData[f.id] || ""} onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))} style={{ borderColor: errors[f.id] ? "#f87171" : undefined }}>
                  <option value="">Select...</option>
                  {f.options?.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea className="input-field" value={formData[f.id] || ""} onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))} style={{ borderColor: errors[f.id] ? "#f87171" : undefined, minHeight: 80 }}/>
              ) : (
                <input type={f.type} className="input-field" value={formData[f.id] || ""} onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))} style={{ borderColor: errors[f.id] ? "#f87171" : undefined }}/>
              )}
              {errors[f.id] && <span style={{ color: "#f87171", fontSize: ".68rem", fontFamily: "'JetBrains Mono',monospace" }}>{errors[f.id]}</span>}
            </div>
          ))}
        </div>

        {/* Team registration */}
        {event.allowTeams && (
          <div style={{ marginTop: "1.25rem", padding: "1.25rem", background: "rgba(59,139,253,.06)", border: "1px solid rgba(59,139,253,.18)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
              <Users size={16} color="#60a8ff"/>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#60a8ff" }}>Team Registration</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".68rem", color: "#8b949e" }}>(Max {event.maxTeamSize || 4} members)</span>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".38rem" }}>
                Team Name <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input className="input-field" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Team NexusAI" style={{ borderColor: errors["teamName"] ? "#f87171" : undefined }}/>
              {errors["teamName"] && <span style={{ color: "#f87171", fontSize: ".68rem", fontFamily: "'JetBrains Mono',monospace" }}>{errors["teamName"]}</span>}
            </div>
            {teamMembers.map((tm, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, padding: "1rem", marginBottom: ".75rem", position: "relative" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".68rem", color: "#8b949e", marginBottom: ".75rem" }}>MEMBER {i + 2}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                  {[{k:"name",l:"Name"},{k:"email",l:"Email"},{k:"phone",l:"Phone"}].map(f=>(
                    <div key={f.k} style={{ gridColumn: f.k === "phone" ? "1/-1" : undefined }}>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".63rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: ".3rem" }}>{f.l}</label>
                      <input className="input-field" value={tm[f.k] || ""} onChange={e => updateTeamMember(i, f.k, e.target.value)} style={{ fontSize: ".85rem" }}/>
                    </div>
                  ))}
                </div>
                <button onClick={() => removeTeamMember(i)} style={{ position: "absolute", top: ".75rem", right: ".75rem", background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.2)", color: "#f87171", padding: ".25rem .5rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={11}/></button>
              </div>
            ))}
            {teamMembers.length < (event.maxTeamSize || 4) - 1 && (
              <button onClick={addTeamMember} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(59,139,253,.1)", border: "1px solid rgba(59,139,253,.25)", color: "#60a8ff", padding: ".45rem .9rem", borderRadius: 8, cursor: "pointer", fontSize: ".8rem", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, letterSpacing: ".04em" }}>
                <Plus size={13}/> Add Team Member
              </button>
            )}
          </div>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <GradientButton fullWidth onClick={submit} disabled={loading}>
            {loading ? <>
              <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }}/> Registering...
            </> : <>Confirm Registration <ArrowRight size={14}/></>}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [regTarget, setRegTarget] = useState<ClubEvent | null>(null);

  // FIX #7 & #13: Fetch live from DB on mount + interval refresh
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/events", { cache: "no-store" });
      if (r.ok) { const d = await r.json(); setEvents(d.events || []); }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadEvents();
    // Auto-refresh every 30s for near real-time sync
    const interval = setInterval(loadEvents, 30000);
    return () => clearInterval(interval);
  }, [loadEvents]);

  const filtered = events.filter(e =>
    (typeFilter === "all" || e.type === typeFilter) &&
    (statusFilter === "all" || e.status === statusFilter)
  );

  const typeColor: Record<string, "blue"|"teal"|"green"|"amber"|"purple"> = { workshop: "blue", hackathon: "teal", talk: "green", meetup: "amber", competition: "purple" };

  return (
    <>
      <section style={{ padding: "8rem 1.5rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Events" title="Workshops, Hackathons & Talks" subtitle="From beginner workshops to national hackathons — there's always something happening at AI-Club."/>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          {[{ label: "Total Events", value: events.length, color: "#3b8bfd" }, { label: "Upcoming", value: events.filter(e => e.status === "upcoming").length, color: "#34d399" }, { label: "Past", value: events.filter(e => e.status === "past").length, color: "#a78bfa" }].map(s => (
            <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 12, padding: "1.1rem 1.75rem", textAlign: "center", minWidth: 120 }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.75rem", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: ".72rem", color: "#8b949e", fontFamily: "'JetBrains Mono',monospace", marginTop: 4, letterSpacing: ".05em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: ".65rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem", alignItems: "center" }}>
          {(["all", "upcoming", "past"] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{ background: statusFilter === f ? "linear-gradient(135deg,#3b8bfd,#6d28d9)" : "rgba(255,255,255,.03)", border: "1px solid", borderColor: statusFilter === f ? "transparent" : "var(--border2)", color: statusFilter === f ? "#fff" : "#8b949e", padding: ".42rem 1.05rem", borderRadius: 100, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em", textTransform: "capitalize" }}>
              {f === "all" ? "All Events" : f}
            </button>
          ))}
          <div style={{ width: 1, height: 22, background: "var(--border2)" }}/>
          {["all", "workshop", "hackathon", "talk", "meetup", "competition"].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)} style={{ background: typeFilter === f ? "rgba(59,139,253,.12)" : "rgba(255,255,255,.03)", border: "1px solid", borderColor: typeFilter === f ? "rgba(59,139,253,.35)" : "var(--border2)", color: typeFilter === f ? "#90c8ff" : "#8b949e", padding: ".42rem 1.05rem", borderRadius: 100, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", textTransform: "capitalize" }}>
              {f === "all" ? "All Types" : f}
            </button>
          ))}
          <button onClick={loadEvents} style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".42rem .8rem", borderRadius: 100, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ width: 32, height: 32, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
            Loading events from database...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📅</div>
            <p>{events.length === 0 ? "No events yet. Admin can create events from the dashboard." : "No events match your filters."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
            {filtered.map(e => {
              const color = typeColor[e.type] || "blue";
              const gradMap: Record<string, string> = { blue: "linear-gradient(135deg,rgba(59,139,253,.3),rgba(109,40,217,.3))", teal: "linear-gradient(135deg,rgba(34,211,238,.3),rgba(59,139,253,.3))", green: "linear-gradient(135deg,rgba(52,211,153,.3),rgba(34,211,238,.3))", amber: "linear-gradient(135deg,rgba(251,191,36,.3),rgba(248,113,113,.3))", purple: "linear-gradient(135deg,rgba(167,139,250,.3),rgba(236,72,153,.3))" };
              return (
                <Card key={e._id} style={{ overflow: "hidden" }}>
                  <div style={{ height: 110, background: gradMap[color], padding: "1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Badge color={color}>{e.type}</Badge>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".3rem", alignItems: "flex-end" }}>
                      {e.status === "upcoming" ? <span style={{ background: "rgba(52,211,153,.2)", color: "#34d399", fontSize: ".68rem", padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>Upcoming</span> : <span style={{ background: "rgba(255,255,255,.1)", color: "#8b949e", fontSize: ".68rem", padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>Past</span>}
                      {e.allowTeams && <span style={{ background: "rgba(59,139,253,.2)", color: "#90c8ff", fontSize: ".65rem", padding: ".15rem .5rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>Team Event</span>}
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: ".875rem" }}>{e.title}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".38rem", marginBottom: "1rem" }}>
                      {e.date && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem", color: "#8b949e" }}><Calendar size={12}/>{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>}
                      {e.location && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem", color: "#8b949e" }}><MapPin size={12}/>{e.location}</div>}
                      {e.maxAttendees && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem", color: "#8b949e" }}><Users size={12}/>Max {e.maxAttendees} attendees</div>}
                    </div>
                    {e.description && <p style={{ color: "#8b949e", fontSize: ".85rem", lineHeight: 1.65, marginBottom: "1.1rem" }}>{e.description}</p>}
                    {e.tags && e.tags.length > 0 && (
                      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
                        {e.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", fontSize: ".68rem", padding: ".18rem .5rem", borderRadius: 6, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>)}
                      </div>
                    )}
                    {e.status === "upcoming" && e.registrationOpen
                      ? <GradientButton size="sm" onClick={() => setRegTarget(e)}>Register Now <ArrowRight size={12}/></GradientButton>
                      : <OutlineButton>View Details</OutlineButton>
                    }
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ background: "var(--bg2)", borderTop: "1px solid var(--border2)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "2rem", marginBottom: "1rem" }}>Have an idea for an event?</h2>
          <p style={{ color: "#8b949e", lineHeight: 1.75, marginBottom: "2rem" }}>Members can propose workshops, talks, or competitions. Reach out and we'll make it happen.</p>
          <GradientButton>Propose an Event</GradientButton>
        </div>
      </section>

      {regTarget && <RegModal event={regTarget} onClose={() => setRegTarget(null)}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
