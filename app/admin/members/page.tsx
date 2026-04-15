"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, RefreshCw, Search } from "lucide-react";
import { membersApi, type Member } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

function MemberModal({ member, onClose, onSave }: { member?: Member|null; onClose:()=>void; onSave:(d:Partial<Member>,id?:string)=>Promise<void> }) {
  const [form,setForm]=useState({ name:member?.name||"", email:member?.email||"", phone:member?.phone||"", branch:member?.branch||"", year:member?.year||"", role:member?.role||"member", status:member?.status||"active", github:member?.github||"", linkedin:member?.linkedin||"", bio:member?.bio||"" });
  const [saving,setSaving]=useState(false);
  const [errs,setErrs]=useState<Record<string,string>>({});

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.name.trim())e.name="Required";
    if(!form.email.trim())e.email="Required";
    else if(!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))e.email="Valid email required";
    setErrs(e);return Object.keys(e).length===0;
  };
  const save=async()=>{
    if(!validate())return;
    setSaving(true);
    try{await onSave(form,member?._id);onClose();}
    catch{}finally{setSaving(false);}
  };

  const inp=(k:keyof typeof form,l:string,t="text",opts?:string[])=>(
    <div style={{ marginBottom:"1rem" }}>
      <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{l}</label>
      {opts?(
        <select value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
          style={{ width:"100%",background:"var(--bg2)",border:`1px solid ${errs[k]?"#f87171":"var(--border2)"}`,color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none" }}>
          {opts.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ):(
        <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
          style={{ width:"100%",background:"var(--bg2)",border:`1px solid ${errs[k]?"#f87171":"var(--border2)"}`,color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
      )}
      {errs[k]&&<span style={{ color:"#f87171",fontSize:".7rem",fontFamily:"'JetBrains Mono',monospace" }}>{errs[k]}</span>}
    </div>
  );

  return(
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>{member?"Edit Member":"Add Member"}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={18}/></button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
          <div>{inp("name","Full Name *")}</div>
          <div>{inp("email","Email *","email")}</div>
          <div>{inp("phone","Phone","tel")}</div>
          <div>{inp("branch","Branch")}</div>
          <div>{inp("year","Year","text",["1st Year","2nd Year","3rd Year","4th Year"])}</div>
          <div>{inp("role","Role","text",["member","core","admin"])}</div>
          <div>{inp("status","Status","text",["active","inactive","alumni"])}</div>
          <div>{inp("github","GitHub")}</div>
        </div>
        {inp("linkedin","LinkedIn")}
        <div style={{ marginBottom:"1rem" }}>
          <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Bio</label>
          <textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={3}
            style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex",gap:".75rem" }}>
          <button onClick={onClose} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".7rem",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex:2,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".7rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            {saving?<><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite" }}/>Saving...</>:(member?"Save Changes":"Add Member")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMembersPage() {
  const [members,setMembers]=useState<Member[]>([]);
  const [loading,setLoading]=useState(true);
  const [editTarget,setEditTarget]=useState<Member|null|undefined>(undefined);
  const [busyId,setBusyId]=useState<string|null>(null);
  const [search,setSearch]=useState("");

  const load=useCallback(async()=>{
    setLoading(true);
    try{const {members}=await membersApi.list();setMembers(members);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const handleSave=async(data:Partial<Member>,id?:string)=>{
    try{
      if(id){const {member}=await membersApi.update(id,data);setMembers(prev=>prev.map(m=>m._id===id?member:m));toast.success("Member updated");}
      else{const {member}=await membersApi.create(data);setMembers(prev=>[member,...prev]);toast.success("Member added");}
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Save failed");throw e;}
  };

  const handleDelete=async(id:string,name:string)=>{
    if(!confirm(`Remove "${name}"?`))return;
    setBusyId(id);
    try{await membersApi.delete(id);setMembers(prev=>prev.filter(m=>m._id!==id));toast.success("Removed");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const filtered=members.filter(m=>`${m.name} ${m.email} ${m.branch||""} ${m.role}`.toLowerCase().includes(search.toLowerCase()));
  const initials=(name:string)=>name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const GRADS=["linear-gradient(135deg,#3b8bfd,#6d28d9)","linear-gradient(135deg,#34d399,#22d3ee)","linear-gradient(135deg,#fbbf24,#f87171)","linear-gradient(135deg,#a78bfa,#ec4899)"];

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Members</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem" }}>{members.length} total members</p>
        </div>
        <div style={{ display:"flex",gap:".65rem" }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/>
          </button>
          <button onClick={()=>setEditTarget(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>
            <Plus size={13}/> Add Member
          </button>
        </div>
      </div>

      <div style={{ position:"relative",maxWidth:340,marginBottom:"1.25rem" }}>
        <Search size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#8b949e" }}/>
        <input className="input-field" style={{ paddingLeft:36 }} placeholder="Search members..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
        {loading?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...
          </div>
        ):filtered.length===0?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>👥</div>
            <p>{search?"No members match your search.":"No members yet. Add your first member!"}</p>
          </div>
        ):(
          <table className="tbl">
            <thead><tr>{["Member","Branch / Year","Role","Status","Joined","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((m,i)=>(
                <tr key={m._id} style={{ opacity:busyId===m._id?.5:1 }}>
                  <td>
                    <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                      <div style={{ width:36,height:36,borderRadius:"50%",background:GRADS[i%GRADS.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".8rem",color:"white",flexShrink:0 }}>{initials(m.name)}</div>
                      <div>
                        <div style={{ fontWeight:600,fontSize:".875rem" }}>{m.name}</div>
                        <div style={{ fontSize:".72rem",color:"#8b949e",fontFamily:"'JetBrains Mono',monospace" }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:"#8b949e",fontSize:".82rem" }}>{m.branch||"—"}{m.year&&` · ${m.year}`}</td>
                  <td><span style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace",textTransform:"capitalize" }}>{m.role}</span></td>
                  <td><StatusPill status={m.status}/></td>
                  <td style={{ color:"#8b949e",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace" }}>{new Date(m.joinedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
                  <td>
                    <div style={{ display:"flex",gap:4 }}>
                      <button onClick={()=>setEditTarget(m)} style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Edit size={12}/></button>
                      <button onClick={()=>handleDelete(m._id,m.name)} style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editTarget!==undefined&&<MemberModal member={editTarget} onClose={()=>setEditTarget(undefined)} onSave={handleSave}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
