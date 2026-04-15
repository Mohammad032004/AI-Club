"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, X, Trash2, Eye, RefreshCw, Search, ChevronDown, ChevronRight } from "lucide-react";
import { applicationsApi, type Application } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { applications } = await applicationsApi.list(filter === "all" ? undefined : filter); setApps(applications); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  const action = async (id: string, status: "accepted" | "rejected") => {
    setBusyId(id + status);
    try {
      const { application } = await applicationsApi.updateStatus(id, status);
      setApps(prev => prev.map(a => a._id === id ? application : a));
      if (selected?._id === id) setSelected(application);
      toast.success(`Application ${status}`);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusyId(null); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    setBusyId(id + "del");
    try { await applicationsApi.delete(id); setApps(prev => prev.filter(a => a._id !== id)); if (selected?._id === id) setSelected(null); toast.success("Deleted"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusyId(null); }
  };

  const filtered = apps.filter(a => `${a.firstName} ${a.lastName} ${a.email} ${a.branch || ""} ${a.year || ""}`.toLowerCase().includes(search.toLowerCase()));

  const DetailRow = ({ label, value }: { label: string; value?: string | number | string[] | null }) => {
    if (!value && value !== 0) return null;
    const display = Array.isArray(value) ? value.join(", ") : String(value);
    return (
      <div style={{ marginBottom: ".7rem" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".62rem", color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".2rem" }}>{label}</div>
        <div style={{ fontSize: ".875rem", color: "#f0f6fc", lineHeight: 1.55, background: "rgba(255,255,255,.02)", padding: ".45rem .75rem", borderRadius: 7, border: "1px solid var(--border2)" }}>{display}</div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.75rem", marginBottom: ".25rem" }}>Applications</h1>
          <p style={{ color: "#8b949e", fontSize: ".875rem" }}>{apps.filter(a => a.status === "pending").length} pending review · {apps.length} total</p>
        </div>
        <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap" }}>
          {["all", "pending", "accepted", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? "linear-gradient(135deg,#3b8bfd,#6d28d9)" : "rgba(255,255,255,.04)", border: "1px solid", borderColor: filter === f ? "transparent" : "var(--border2)", color: filter === f ? "#fff" : "#8b949e", padding: ".4rem .9rem", borderRadius: 100, fontSize: ".78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em", textTransform: "capitalize" }}>
              {f === "all" ? "All" : f}
            </button>
          ))}
          <button onClick={load} style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".4rem .7rem", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
          </button>
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 340, marginBottom: "1.25rem" }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8b949e" }}/>
        <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search name, email, branch..." value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1.3fr 1fr" : "1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
              <div style={{ width: 26, height: 26, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>📋</div>
              <p>No applications found.</p>
            </div>
          ) : (
            <table className="tbl">
              <thead><tr>{["Applicant", "Branch · Year", "CGPA", "Skills", "Status", "Applied", "Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id} onClick={() => setSelected(selected?._id === a._id ? null : a)}
                    style={{ cursor: "pointer", background: selected?._id === a._id ? "rgba(59,139,253,.06)" : "transparent", opacity: busyId?.startsWith(a._id) ? .5 : 1 }}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#f0f6fc", fontSize: ".875rem" }}>{a.firstName} {a.lastName}</div>
                      <div style={{ color: "#8b949e", fontSize: ".72rem", fontFamily: "'JetBrains Mono',monospace" }}>{a.email}</div>
                    </td>
                    <td style={{ color: "#8b949e", fontSize: ".82rem" }}>{a.branch || "—"}{a.year ? ` · ${a.year}` : ""}</td>
                    <td style={{ color: "#8b949e", fontSize: ".82rem", fontFamily: "'JetBrains Mono',monospace" }}>{a.cgpa || "—"}</td>
                    <td style={{ maxWidth: 140 }}>
                      <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap" }}>
                        {a.skills?.slice(0, 3).map(s => <span key={s} style={{ background: "rgba(59,139,253,.1)", color: "#90c8ff", fontSize: ".62rem", padding: ".12rem .45rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>{s}</span>)}
                        {(a.skills?.length || 0) > 3 && <span style={{ color: "#8b949e", fontSize: ".72rem" }}>+{(a.skills?.length || 0) - 3}</span>}
                      </div>
                    </td>
                    <td><StatusPill status={a.status}/></td>
                    <td style={{ color: "#8b949e", fontSize: ".78rem", fontFamily: "'JetBrains Mono',monospace" }}>{new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td>
                      <div style={{ display: "flex", gap: 3 }} onClick={e => e.stopPropagation()}>
                        {a.status === "pending" && <>
                          <button onClick={() => action(a._id, "accepted")} title="Accept" style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)", color: "#34d399", padding: ".28rem .5rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}><Check size={12}/></button>
                          <button onClick={() => action(a._id, "rejected")} title="Reject" style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.25)", color: "#f87171", padding: ".28rem .5rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}><X size={12}/></button>
                        </>}
                        <button onClick={() => setSelected(selected?._id === a._id ? null : a)} title="View" style={{ background: "rgba(59,139,253,.08)", border: "1px solid rgba(59,139,253,.2)", color: "#90c8ff", padding: ".28rem .5rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}><Eye size={12}/></button>
                        <button onClick={() => del(a._id)} title="Delete" style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".28rem .5rem", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FIX #5: Full detail panel with all fields */}
        {selected && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.5rem", position: "sticky", top: "1.5rem", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{selected.firstName} {selected.lastName}</h3>
                <StatusPill status={selected.status}/>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer" }}><X size={16}/></button>
            </div>

            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#60a8ff", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem", paddingBottom: ".5rem", borderBottom: "1px solid var(--border2)" }}>Personal Info</div>
            <DetailRow label="Email" value={selected.email}/>
            <DetailRow label="Phone" value={selected.phone}/>
            <DetailRow label="Gender" value={(selected as {gender?: string}).gender}/>
            <DetailRow label="GitHub" value={selected.github}/>
            <DetailRow label="LinkedIn" value={selected.linkedin}/>

            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#60a8ff", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem", marginTop: "1rem", paddingBottom: ".5rem", borderBottom: "1px solid var(--border2)" }}>Academics</div>
            <DetailRow label="College" value={(selected as {college?: string}).college}/>
            <DetailRow label="Branch" value={selected.branch}/>
            <DetailRow label="Year" value={selected.year}/>
            <DetailRow label="CGPA" value={selected.cgpa}/>
            <DetailRow label="Certifications" value={(selected as {certifications?: string}).certifications}/>

            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#60a8ff", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem", marginTop: "1rem", paddingBottom: ".5rem", borderBottom: "1px solid var(--border2)" }}>Skills & Interests</div>
            <DetailRow label="Technical Skills" value={selected.skills}/>
            <DetailRow label="Domains" value={selected.domains}/>
            <DetailRow label="Experience Level" value={(selected as {experience?: string}).experience}/>
            <DetailRow label="Project Description" value={(selected as {projectDesc?: string}).projectDesc}/>

            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#60a8ff", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem", marginTop: "1rem", paddingBottom: ".5rem", borderBottom: "1px solid var(--border2)" }}>Statement of Purpose</div>
            <DetailRow label="Why Join" value={selected.whyJoin}/>
            <DetailRow label="Contribution" value={selected.contribution}/>
            <DetailRow label="Goals" value={(selected as {goals?: string}).goals}/>

            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".65rem", color: "#8b949e", textTransform: "uppercase", marginTop: "1rem", marginBottom: ".5rem" }}>Submitted: {new Date(selected.submittedAt).toLocaleString("en-IN")}</div>

            {selected.status === "pending" && (
              <div style={{ display: "flex", gap: ".65rem", marginTop: "1.25rem" }}>
                <button onClick={() => action(selected._id, "accepted")} disabled={!!busyId} style={{ flex: 1, background: "linear-gradient(135deg,#34d399,#22d3ee)", color: "#030712", border: "none", padding: ".6rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em" }}>Accept</button>
                <button onClick={() => action(selected._id, "rejected")} disabled={!!busyId} style={{ flex: 1, background: "rgba(248,113,113,.12)", color: "#f87171", border: "1px solid rgba(248,113,113,.25)", padding: ".6rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em" }}>Reject</button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
