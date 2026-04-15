"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Users, X, RefreshCw, Calendar, MapPin, Settings2, GripVertical } from "lucide-react";
import { eventsApi, type ClubEvent } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

interface FormField { id: string; label: string; type: string; required: boolean; options?: string[]; }

function FormBuilder({ fields, onChange }: { fields: FormField[]; onChange: (f: FormField[]) => void }) {
  const addField = () => {
    const newField: FormField = { id: `field_${Date.now()}`, label: "New Field", type: "text", required: false };
    onChange([...fields, newField]);
  };
  const removeField = (id: string) => onChange(fields.filter(f => f.id !== id));
  const updateField = (id: string, key: string, val: string | boolean | string[]) => onChange(fields.map(f => f.id === id ? { ...f, [key]: val } : f));

  return (
    <div style={{ background: "rgba(59,139,253,.04)", border: "1px solid rgba(59,139,253,.15)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Settings2 size={15} color="#60a8ff"/>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#60a8ff" }}>Registration Form Fields</span>
        </div>
        <button onClick={addField} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(59,139,253,.12)", border: "1px solid rgba(59,139,253,.25)", color: "#60a8ff", padding: ".3rem .7rem", borderRadius: 7, cursor: "pointer", fontSize: ".78rem", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>
          <Plus size={12}/> Add Field
        </button>
      </div>
      {fields.length === 0 ? (
        <p style={{ color: "#8b949e", fontSize: ".82rem", textAlign: "center", padding: ".75rem" }}>No custom fields. Default fields (Name, Email, Phone, Branch) will be used.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
          {fields.map(f => (
            <div key={f.id} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 9, padding: ".875rem 1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr .8fr .5fr auto", gap: ".5rem", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".3rem" }}>Label</label>
                  <input value={f.label} onChange={e => updateField(f.id, "label", e.target.value)}
                    style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".45rem .75rem", borderRadius: 7, fontSize: ".82rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}/>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".3rem" }}>Type</label>
                  <select value={f.type} onChange={e => updateField(f.id, "type", e.target.value)}
                    style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".45rem .75rem", borderRadius: 7, fontSize: ".82rem", fontFamily: "inherit", outline: "none" }}>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <div style={{ textAlign: "center" }}>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".3rem" }}>Required</label>
                  <input type="checkbox" checked={f.required} onChange={e => updateField(f.id, "required", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#3b8bfd", cursor: "pointer" }}/>
                </div>
                <button onClick={() => removeField(f.id)} style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.2)", color: "#f87171", padding: ".35rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1.1rem" }}>
                  <Trash2 size={12}/>
                </button>
              </div>
              {f.type === "select" && (
                <div style={{ marginTop: ".6rem" }}>
                  <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase" }}>Options (comma-separated)</label>
                  <input value={f.options?.join(", ") || ""} onChange={e => updateField(f.id, "options", e.target.value.split(",").map(s => s.trim()))}
                    style={{ display: "block", width: "100%", marginTop: ".3rem", background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".45rem .75rem", borderRadius: 7, fontSize: ".82rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    placeholder="e.g. CSE, IT, ECE, Mechanical"/>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventModal({ event, onClose, onSave }: { event?: ClubEvent | null; onClose: () => void; onSave: (data: Partial<ClubEvent>, id?: string) => Promise<void> }) {
  const [form, setForm] = useState({
    title: event?.title || "", type: event?.type || "workshop",
    description: event?.description || "", date: event?.date?.slice(0, 10) || "",
    location: event?.location || "", maxAttendees: event?.maxAttendees?.toString() || "",
    status: event?.status || "upcoming", registrationOpen: event?.registrationOpen ?? true,
    tags: event?.tags?.join(", ") || "", allowTeams: (event as {allowTeams?: boolean})?.allowTeams || false,
    maxTeamSize: ((event as {maxTeamSize?: number})?.maxTeamSize || 4).toString(),
  });
  const [formFields, setFormFields] = useState<FormField[]>((event as {formFields?: FormField[]})?.formFields || []);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.type) e.type = "Type is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const tagsArr = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      await onSave({ ...form, tags: tagsArr, maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined, maxTeamSize: parseInt(form.maxTeamSize) || 4, formFields }, event?._id);
      onClose();
    } catch {}
    finally { setSaving(false); }
  };

  const F = ({ k, l, t = "text", span = false, opts }: { k: keyof typeof form; l: string; t?: string; span?: boolean; opts?: string[] }) => (
    <div style={{ gridColumn: span ? "1/-1" : undefined, marginBottom: "1rem" }}>
      <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".4rem" }}>{l}</label>
      {opts ? (
        <select value={form[k] as string} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          style={{ width: "100%", background: "var(--bg2)", border: `1px solid ${errs[k] ? "#f87171" : "var(--border2)"}`, color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none" }}>
          {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
        </select>
      ) : (
        <input type={t} value={form[k] as string} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          style={{ width: "100%", background: "var(--bg2)", border: `1px solid ${errs[k] ? "#f87171" : "var(--border2)"}`, color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}/>
      )}
      {errs[k] && <span style={{ color: "#f87171", fontSize: ".7rem", fontFamily: "'JetBrains Mono',monospace" }}>{errs[k]}</span>}
    </div>
  );

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>{event ? "Edit Event" : "Create New Event"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer" }}><X size={18}/></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <F k="title" l="Title *" span/>
          <F k="date" l="Date" t="date"/>
          <F k="location" l="Location"/>
          <F k="maxAttendees" l="Max Attendees" t="number"/>
          <F k="type" l="Type *" opts={["workshop", "hackathon", "talk", "meetup", "competition"]}/>
          <F k="status" l="Status" opts={["upcoming", "ongoing", "past", "cancelled"]}/>
          <F k="tags" l="Tags (comma-separated)" span/>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".4rem" }}>Description</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}/>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer", fontSize: ".875rem", color: "#8b949e" }}>
            <input type="checkbox" checked={form.registrationOpen} onChange={e => setForm(p => ({ ...p, registrationOpen: e.target.checked }))} style={{ accentColor: "#3b8bfd" }}/> Registration Open
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer", fontSize: ".875rem", color: "#8b949e" }}>
            <input type="checkbox" checked={form.allowTeams} onChange={e => setForm(p => ({ ...p, allowTeams: e.target.checked }))} style={{ accentColor: "#3b8bfd" }}/> Allow Teams
          </label>
          {form.allowTeams && (
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ fontSize: ".82rem", color: "#8b949e" }}>Max size:</span>
              <input type="number" min="2" max="10" value={form.maxTeamSize} onChange={e => setForm(p => ({ ...p, maxTeamSize: e.target.value }))}
                style={{ width: 60, background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".35rem .5rem", borderRadius: 7, fontSize: ".82rem", fontFamily: "inherit", outline: "none", textAlign: "center" }}/>
            </div>
          )}
        </div>

        {/* Dynamic Form Builder */}
        <FormBuilder fields={formFields} onChange={setFormFields}/>

        <div style={{ display: "flex", gap: ".75rem" }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".7rem", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg,#3b8bfd,#6d28d9)", color: "white", border: "none", padding: ".7rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {saving ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }}/> Saving...</> : (event ? "Save Changes" : "Create Event")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<ClubEvent | null | undefined>(undefined);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { events } = await eventsApi.list(); setEvents(events); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Partial<ClubEvent>, id?: string) => {
    try {
      if (id) {
        const { event } = await eventsApi.update(id, data);
        setEvents(prev => prev.map(e => e._id === id ? event : e));
        toast.success("Event updated");
      } else {
        await eventsApi.create(data);
        toast.success("Event created — now visible on website");
        await load();
      }
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Save failed"); throw e; }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setBusyId(id);
    try { await eventsApi.delete(id); setEvents(prev => prev.filter(e => e._id !== id)); toast.success("Deleted"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
    finally { setBusyId(null); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.75rem", marginBottom: ".25rem" }}>Events</h1>
          <p style={{ color: "#8b949e", fontSize: ".875rem" }}>{events.length} total events — all visible on website instantly</p>
        </div>
        <div style={{ display: "flex", gap: ".65rem" }}>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".48rem .9rem", borderRadius: 8, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/> Refresh
          </button>
          <button onClick={() => setEditTarget(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#3b8bfd,#6d28d9)", border: "none", color: "white", padding: ".48rem 1rem", borderRadius: 8, fontSize: ".82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em" }}>
            <Plus size={13}/> Create Event
          </button>
        </div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
            <div style={{ width: 26, height: 26, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>Loading...
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>📅</div>
            <p>No events yet. Create your first event — it will appear on the website immediately!</p>
          </div>
        ) : (
          <table className="tbl">
            <thead><tr>{["Event", "Type", "Date", "Location", "Status", "Form", "Teams", "Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id} style={{ opacity: busyId === e._id ? .5 : 1, transition: "opacity .2s" }}>
                  <td style={{ fontWeight: 600, color: "#f0f6fc", maxWidth: 200 }}>
                    <div>{e.title}</div>
                    {e.description && <div style={{ fontSize: ".72rem", color: "#8b949e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{e.description}</div>}
                  </td>
                  <td><span style={{ background: "rgba(59,139,253,.1)", border: "1px solid rgba(59,139,253,.2)", color: "#90c8ff", fontSize: ".68rem", fontWeight: 700, padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>{e.type}</span></td>
                  <td style={{ color: "#8b949e", fontSize: ".82rem" }}>
                    {e.date ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12}/>{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div> : "—"}
                  </td>
                  <td style={{ color: "#8b949e", fontSize: ".82rem", maxWidth: 140 }}>
                    {e.location ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12}/>{e.location}</div> : "—"}
                  </td>
                  <td><StatusPill status={e.status}/></td>
                  <td>
                    <span style={{ background: (e as {formFields?: unknown[]}).formFields?.length ? "rgba(59,139,253,.1)" : "rgba(255,255,255,.04)", color: (e as {formFields?: unknown[]}).formFields?.length ? "#90c8ff" : "#8b949e", fontSize: ".68rem", fontWeight: 700, padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>
                      {(e as {formFields?: unknown[]}).formFields?.length ? `${(e as {formFields: unknown[]}).formFields.length} fields` : "default"}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: (e as {allowTeams?: boolean}).allowTeams ? "rgba(52,211,153,.1)" : "rgba(255,255,255,.04)", color: (e as {allowTeams?: boolean}).allowTeams ? "#34d399" : "#8b949e", fontSize: ".68rem", fontWeight: 700, padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>
                      {(e as {allowTeams?: boolean}).allowTeams ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setEditTarget(e)} title="Edit" style={{ background: "rgba(59,139,253,.08)", border: "1px solid rgba(59,139,253,.2)", color: "#90c8ff", padding: ".3rem .55rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}><Edit size={12}/></button>
                      <button title="Registrations" style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".3rem .55rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}><Users size={12}/></button>
                      <button onClick={() => handleDelete(e._id, e.title)} disabled={busyId === e._id} title="Delete" style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", color: "#f87171", padding: ".3rem .55rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editTarget !== undefined && <EventModal event={editTarget} onClose={() => setEditTarget(undefined)} onSave={handleSave}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
