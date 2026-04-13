"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, RefreshCw, Eye, EyeOff } from "lucide-react";
import { projectsApi, type Project } from "@/lib/api";
import { toast } from "@/lib/toast";

function ProjectModal({ project, onClose, onSave }: { project?:Project|null; onClose:()=>void; onSave:(d:Partial<Project>,id?:string)=>Promise<void> }) {
  const [form,setForm]=useState({ title:project?.title||"", description:project?.description||"", category:project?.category||"Machine Learning", tags:project?.tags?.join(", ")||"", github:project?.github||"", liveDemo:project?.liveDemo||"", builtBy:project?.builtBy?.join(", ")||"", year:project?.year?.toString()||new Date().getFullYear().toString(), featured:project?.featured||false, visible:project?.visible??true });
  const [saving,setSaving]=useState(false);
  const save=async()=>{
    if(!form.title||!form.description){toast.error("Title and description required");return;}
    setSaving(true);
    try{
      await onSave({...form,tags:form.tags?form.tags.split(",").map(t=>t.trim()).filter(Boolean):[],builtBy:form.builtBy?form.builtBy.split(",").map(t=>t.trim()).filter(Boolean):[],year:parseInt(form.year)||new Date().getFullYear()},project?._id);
      onClose();
    }catch{}finally{setSaving(false);}
  };

  return(
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>{project?"Edit Project":"Add Project"}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={18}/></button>
        </div>
        {[{k:"title",l:"Title *"},{k:"github",l:"GitHub URL"},{k:"liveDemo",l:"Live Demo URL"},{k:"builtBy",l:"Built By (comma-sep)"},{k:"tags",l:"Tags (comma-sep)"}].map(f=>(
          <div key={f.k} style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{f.l}</label>
            <input value={form[f.k as keyof typeof form] as string} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
              style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
          </div>
        ))}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem" }}>
          <div>
            <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Category</label>
            <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
              style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none" }}>
              {["Machine Learning","Deep Learning","NLP","Computer Vision","Cybersecurity","Web Development","Reinforcement Learning","Data Science"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Year</label>
            <input type="number" value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))}
              style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
          </div>
        </div>
        <div style={{ marginBottom:"1.25rem" }}>
          <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Description *</label>
          <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3}
            style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex",gap:"1.5rem",marginBottom:"1.25rem" }}>
          <label style={{ display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",fontSize:".875rem",color:"#8b949e" }}>
            <input type="checkbox" checked={form.visible} onChange={e=>setForm(p=>({...p,visible:e.target.checked}))} style={{ accentColor:"#3b8bfd" }}/>Visible on site
          </label>
          <label style={{ display:"flex",alignItems:"center",gap:".5rem",cursor:"pointer",fontSize:".875rem",color:"#8b949e" }}>
            <input type="checkbox" checked={form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))} style={{ accentColor:"#3b8bfd" }}/>Featured
          </label>
        </div>
        <div style={{ display:"flex",gap:".75rem" }}>
          <button onClick={onClose} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".7rem",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex:2,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".7rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em" }}>
            {saving?"Saving...":(project?"Save Changes":"Add Project")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects,setProjects]=useState<Project[]>([]);
  const [loading,setLoading]=useState(true);
  const [editTarget,setEditTarget]=useState<Project|null|undefined>(undefined);
  const [busyId,setBusyId]=useState<string|null>(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const {projects}=await projectsApi.list();setProjects(projects);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const handleSave=async(data:Partial<Project>,id?:string)=>{
    try{
      if(id){const {project}=await projectsApi.update(id,data);setProjects(prev=>prev.map(p=>p._id===id?project:p));toast.success("Updated");}
      else{await projectsApi.create(data);toast.success("Created");await load();}
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");throw e;}
  };

  const toggleVisible=async(p:Project)=>{
    setBusyId(p._id);
    try{const {project}=await projectsApi.update(p._id,{visible:!p.visible});setProjects(prev=>prev.map(x=>x._id===p._id?project:x));toast.success(project.visible?"Now visible":"Hidden from site");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const del=async(id:string,title:string)=>{
    if(!confirm(`Delete "${title}"?`))return;
    setBusyId(id);
    try{await projectsApi.delete(id);setProjects(prev=>prev.filter(p=>p._id!==id));toast.success("Deleted");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Projects</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem" }}>{projects.filter(p=>p.visible).length} visible · {projects.length} total</p>
        </div>
        <div style={{ display:"flex",gap:".65rem" }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/>
          </button>
          <button onClick={()=>setEditTarget(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>
            <Plus size={13}/> Add Project
          </button>
        </div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
        {loading?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...
          </div>
        ):projects.length===0?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>🧪</div><p>No projects yet. Add your first project!</p>
          </div>
        ):(
          <table className="tbl">
            <thead><tr>{["Project","Category","Tags","Year","Visible","Featured","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {projects.map(p=>(
                <tr key={p._id} style={{ opacity:busyId===p._id?.5:1 }}>
                  <td>
                    <div style={{ fontWeight:600,color:"#f0f6fc",fontSize:".875rem" }}>{p.title}</div>
                    <div style={{ fontSize:".75rem",color:"#8b949e",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.description}</div>
                  </td>
                  <td><span style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{p.category}</span></td>
                  <td style={{ color:"#8b949e",fontSize:".78rem" }}>{p.tags?.slice(0,3).join(", ")||"—"}</td>
                  <td style={{ color:"#8b949e",fontSize:".82rem",fontFamily:"'JetBrains Mono',monospace" }}>{p.year||"—"}</td>
                  <td>
                    <button onClick={()=>toggleVisible(p)} style={{ background:p.visible?"rgba(52,211,153,.1)":"rgba(255,255,255,.04)",border:`1px solid ${p.visible?"rgba(52,211,153,.25)":"var(--border2)"}`,color:p.visible?"#34d399":"#8b949e",padding:".25rem .6rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:".72rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:600 }}>
                      {p.visible?<Eye size={11}/>:<EyeOff size={11}/>}{p.visible?"Yes":"No"}
                    </button>
                  </td>
                  <td><span style={{ background:p.featured?"rgba(251,191,36,.1)":"rgba(255,255,255,.04)",color:p.featured?"#fbbf24":"#8b949e",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100 }}>{p.featured?"⭐ Yes":"No"}</span></td>
                  <td>
                    <div style={{ display:"flex",gap:4 }}>
                      <button onClick={()=>setEditTarget(p)} style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Edit size={12}/></button>
                      <button onClick={()=>del(p._id,p.title)} style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editTarget!==undefined&&<ProjectModal project={editTarget} onClose={()=>setEditTarget(undefined)} onSave={handleSave}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
