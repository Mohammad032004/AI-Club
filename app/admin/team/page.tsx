"use client";
import { useState, useEffect, useCallback } from "react";
<<<<<<< HEAD
import { Plus, Edit, Trash2, X, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "@/lib/toast";

interface TeamMember { _id: string; name: string; role: string; tier: string; department?: string; course?: string; bio?: string; email?: string; github?: string; linkedin?: string; visible: boolean; order: number; }

function TeamModal({ member, onClose, onSave }: { member?: TeamMember | null; onClose: () => void; onSave: (data: Partial<TeamMember>, id?: string) => Promise<void> }) {
  const [form, setForm] = useState({ name: member?.name || "", role: member?.role || "", tier: member?.tier || "member", department: member?.department || "", course: member?.course || "", bio: member?.bio || "", email: member?.email || "", github: member?.github || "", linkedin: member?.linkedin || "", visible: member?.visible ?? true, order: member?.order?.toString() || "0" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.name || !form.role || !form.tier) { toast.error("Name, role and tier required"); return; }
    setSaving(true);
    try { await onSave({ ...form, order: parseInt(form.order) || 0 }, member?._id); onClose(); }
    catch {} finally { setSaving(false); }
  };
  const inp = (k: keyof typeof form, l: string, t = "text", opts?: string[]) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".4rem" }}>{l}</label>
      {opts ? <select value={form[k] as string} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none" }}>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
      : <input type={t} value={form[k] as string} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}/>}
    </div>
  );
  return (
    <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>{member ? "Edit Team Member" : "Add Team Member"}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer" }}><X size={18}/></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <div>{inp("name", "Full Name *")}</div>
        <div>{inp("role", "Role *")}</div>
        <div>{inp("tier", "Tier *", "text", ["faculty", "leadership", "core", "member"])}</div>
        <div>{inp("order", "Display Order", "number")}</div>
        <div>{inp("department", "Department")}</div>
        <div>{inp("course", "Course / Year")}</div>
        <div>{inp("email", "Email", "email")}</div>
        <div>{inp("github", "GitHub URL")}</div>
      </div>
      {inp("linkedin", "LinkedIn URL")}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: ".66rem", fontWeight: 600, color: "#8b949e", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: ".4rem" }}>Bio</label>
        <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text1)", padding: ".65rem 1rem", borderRadius: 8, fontSize: ".875rem", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}/>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer", fontSize: ".875rem", color: "#8b949e", marginBottom: "1.25rem" }}>
        <input type="checkbox" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))} style={{ accentColor: "#3b8bfd" }}/> Visible on website
      </label>
      <div style={{ display: "flex", gap: ".75rem" }}>
        <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".7rem", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={save} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg,#3b8bfd,#6d28d9)", color: "white", border: "none", padding: ".7rem", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".05em" }}>
          {saving ? "Saving..." : (member ? "Save Changes" : "Add Member")}
        </button>
      </div>
    </div></div>
  );
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<TeamMember | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch("/api/team?admin=true"); const d = await r.json(); setTeam(d.team || []); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Partial<TeamMember>, id?: string) => {
    try {
      if (id) {
        const r = await fetch(`/api/team/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setTeam(prev => prev.map(m => m._id === id ? d.member : m));
        toast.success("Updated");
      } else {
        const r = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        toast.success("Added — visible on About page");
        await load();
      }
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); throw e; }
  };

  const toggleVisible = async (m: TeamMember) => {
    try {
      const r = await fetch(`/api/team/${m._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visible: !m.visible }) });
      const d = await r.json();
      setTeam(prev => prev.map(t => t._id === m._id ? d.member : t));
      toast.success(d.member.visible ? "Now visible on website" : "Hidden from website");
    } catch { toast.error("Failed"); }
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return;
    try { await fetch(`/api/team/${id}`, { method: "DELETE" }); setTeam(prev => prev.filter(m => m._id !== id)); toast.success("Removed"); }
    catch { toast.error("Failed"); }
  };

  const GRADS = ["linear-gradient(135deg,#3b8bfd,#6d28d9)", "linear-gradient(135deg,#34d399,#22d3ee)", "linear-gradient(135deg,#a78bfa,#ec4899)", "linear-gradient(135deg,#fbbf24,#f87171)"];
  const TIER_COLORS: Record<string, string> = { faculty: "#fbbf24", leadership: "#60a8ff", core: "#34d399", member: "#8b949e" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.75rem", marginBottom: ".25rem" }}>Team</h1>
          <p style={{ color: "#8b949e", fontSize: ".875rem" }}>{team.length} members · {team.filter(m => m.visible).length} visible on About page</p>
        </div>
        <div style={{ display: "flex", gap: ".65rem" }}>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".48rem .9rem", borderRadius: 8, fontSize: ".8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
          </button>
          <button onClick={() => setEditTarget(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#3b8bfd,#6d28d9)", border: "none", color: "white", padding: ".48rem 1rem", borderRadius: 8, fontSize: ".82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif", letterSpacing: ".04em" }}>
            <Plus size={13}/> Add Member
          </button>
        </div>
      </div>

      {/* Table view */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
            <div style={{ width: 26, height: 26, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>Loading...
          </div>
        ) : team.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#8b949e" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>👥</div>
            <p>No team members yet. Add members and they'll appear on the About page.</p>
          </div>
        ) : (
          <table className="tbl">
            <thead><tr>{["Member", "Tier", "Dept · Course", "Order", "Visible", "Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {team.map((m, i) => (
                <tr key={m._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GRADS[i % GRADS.length], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".8rem", color: "white", flexShrink: 0 }}>
                        {m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: ".875rem" }}>{m.name}</div>
                        <div style={{ fontSize: ".72rem", color: "#60a8ff", fontWeight: 600 }}>{m.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: `${TIER_COLORS[m.tier] || "#8b949e"}18`, color: TIER_COLORS[m.tier] || "#8b949e", fontSize: ".68rem", fontWeight: 700, padding: ".18rem .55rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", textTransform: "capitalize" }}>{m.tier}</span>
                  </td>
                  <td style={{ color: "#8b949e", fontSize: ".82rem" }}>{m.department || "—"}{m.course ? ` · ${m.course}` : ""}</td>
                  <td style={{ color: "#8b949e", fontSize: ".82rem", fontFamily: "'JetBrains Mono',monospace" }}>{m.order}</td>
                  <td>
                    <button onClick={() => toggleVisible(m)} style={{ background: m.visible ? "rgba(52,211,153,.1)" : "rgba(255,255,255,.04)", border: `1px solid ${m.visible ? "rgba(52,211,153,.25)" : "var(--border2)"}`, color: m.visible ? "#34d399" : "#8b949e", padding: ".25rem .6rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: ".72rem", fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>
                      {m.visible ? <Eye size={11}/> : <EyeOff size={11}/>}{m.visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setEditTarget(m)} style={{ background: "rgba(59,139,253,.08)", border: "1px solid rgba(59,139,253,.2)", color: "#90c8ff", padding: ".3rem .55rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}><Edit size={12}/></button>
                      <button onClick={() => del(m._id, m.name)} style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", color: "#f87171", padding: ".3rem .55rem", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editTarget !== undefined && <TeamModal member={editTarget} onClose={() => setEditTarget(undefined)} onSave={handleSave}/>}
=======
import { Plus, Edit, Trash2, X, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

interface TeamMember { _id:string; name:string; role:string; tier:string; department?:string; course?:string; bio?:string; visible:boolean; order:number; }

export default function AdminTeamPage() {
  const [team,setTeam]=useState<TeamMember[]>([]);
  const [loading,setLoading]=useState(true);
  const [editTarget,setEditTarget]=useState<TeamMember|null|undefined>(undefined);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const r=await fetch("/api/team");const d=await r.json();setTeam(d.team||[]);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const del=async(id:string,name:string)=>{
    if(!confirm(`Remove "${name}"?`))return;
    try{await fetch(`/api/team/${id}`,{method:"DELETE"});setTeam(prev=>prev.filter(m=>m._id!==id));toast.success("Removed");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
  };

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div><h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Team</h1><p style={{ color:"#8b949e",fontSize:".875rem" }}>{team.length} team members</p></div>
        <div style={{ display:"flex",gap:".65rem" }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}><RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/></button>
          <button onClick={()=>setEditTarget(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}><Plus size={13}/> Add Member</button>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1.25rem" }}>
        {team.map((m,i)=>{
          const GRADS=["linear-gradient(135deg,#3b8bfd,#6d28d9)","linear-gradient(135deg,#34d399,#22d3ee)","linear-gradient(135deg,#a78bfa,#ec4899)","linear-gradient(135deg,#fbbf24,#f87171)"];
          return(
            <div key={m._id} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"1.5rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1rem" }}>
                <div style={{ width:44,height:44,borderRadius:"50%",background:GRADS[i%GRADS.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".9rem",color:"white",flexShrink:0 }}>
                  {m.name.split(" ").map((w:string)=>w[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontWeight:700,fontSize:".9rem" }}>{m.name}</div>
                  <div style={{ fontSize:".75rem",color:"#60a8ff",fontWeight:600 }}>{m.role}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:".45rem",marginBottom:"1rem",flexWrap:"wrap" }}>
                <span style={{ background:"rgba(59,139,253,.1)",color:"#90c8ff",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace",textTransform:"capitalize" }}>{m.tier}</span>
                {m.department&&<span style={{ background:"rgba(255,255,255,.05)",color:"#8b949e",fontSize:".68rem",padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{m.department}</span>}
              </div>
              {m.bio&&<p style={{ fontSize:".8rem",color:"#8b949e",lineHeight:1.6,marginBottom:"1rem" }}>{m.bio}</p>}
              <div style={{ display:"flex",gap:4 }}>
                <button onClick={()=>setEditTarget(m)} style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .65rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:".78rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:600 }}><Edit size={12}/> Edit</button>
                <button onClick={()=>del(m._id,m.name)} style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .65rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:".78rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:600 }}><Trash2 size={12}/> Remove</button>
              </div>
            </div>
          );
        })}
        {!loading&&team.length===0&&(
          <div style={{ gridColumn:"1/-1",padding:"3rem",textAlign:"center",color:"#8b949e",background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14 }}>
            <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>👥</div><p>No team members yet.</p>
          </div>
        )}
      </div>
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
