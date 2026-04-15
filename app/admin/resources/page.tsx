"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, RefreshCw } from "lucide-react";
import { resourcesApi, type Resource } from "@/lib/api";
import { toast } from "@/lib/toast";

function ResourceModal({ resource, onClose, onSave }: { resource?:Resource|null; onClose:()=>void; onSave:(d:Partial<Resource>,id?:string)=>Promise<void> }) {
  const [form,setForm]=useState({ title:resource?.title||"", description:resource?.description||"", category:resource?.category||"ai_ml", type:resource?.type||"pdf", url:resource?.url||"", fileSize:resource?.fileSize||"", access:resource?.access||"members" });
  const [saving,setSaving]=useState(false);
  const save=async()=>{
    if(!form.title){toast.error("Title required");return;}
    setSaving(true);
    try{await onSave(form,resource?._id);onClose();}
    catch{}finally{setSaving(false);}
  };
  const inp=(k:keyof typeof form,l:string,opts?:string[])=>(
    <div style={{ marginBottom:"1rem" }}>
      <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{l}</label>
      {opts?<select value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none" }}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :<input value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>}
    </div>
  );
  return(
    <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
        <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>{resource?"Edit Resource":"Add Resource"}</h3>
        <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={18}/></button>
      </div>
      {inp("title","Title *")}{inp("url","URL")}{inp("fileSize","File Size")}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
        <div>{inp("category","Category",["ai_ml","web_dev","cybersecurity","research","career"])}</div>
        <div>{inp("type","Type",["pdf","video","guide","notebook","link"])}</div>
        <div>{inp("access","Access",["public","members"])}</div>
      </div>
      <div style={{ marginBottom:"1.25rem" }}>
        <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Description</label>
        <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box" }}/>
      </div>
      <div style={{ display:"flex",gap:".75rem" }}>
        <button onClick={onClose} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".7rem",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
        <button onClick={save} disabled={saving} style={{ flex:2,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".7rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em" }}>{saving?"Saving...":(resource?"Save Changes":"Add Resource")}</button>
      </div>
    </div></div>
  );
}

export default function AdminResourcesPage() {
  const [resources,setResources]=useState<Resource[]>([]);
  const [loading,setLoading]=useState(true);
  const [editTarget,setEditTarget]=useState<Resource|null|undefined>(undefined);
  const load=useCallback(async()=>{setLoading(true);try{const {resources}=await resourcesApi.list();setResources(resources);}catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}finally{setLoading(false);};},[]);
  useEffect(()=>{load();},[load]);
  const handleSave=async(data:Partial<Resource>,id?:string)=>{
    try{if(id){const {resource}=await resourcesApi.update(id,data);setResources(prev=>prev.map(r=>r._id===id?resource:r));toast.success("Updated");}else{await resourcesApi.create(data);toast.success("Created");await load();}}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");throw e;}
  };
  const del=async(id:string,title:string)=>{
    if(!confirm(`Delete "${title}"?`))return;
    try{await resourcesApi.delete(id);setResources(prev=>prev.filter(r=>r._id!==id));toast.success("Deleted");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
  };
  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div><h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Resources</h1><p style={{ color:"#8b949e",fontSize:".875rem" }}>{resources.length} total resources</p></div>
        <div style={{ display:"flex",gap:".65rem" }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}><RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/></button>
          <button onClick={()=>setEditTarget(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}><Plus size={13}/> Add Resource</button>
        </div>
      </div>
      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
        {loading?<div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}><div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...</div>
        :resources.length===0?<div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}><div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>📚</div><p>No resources yet.</p></div>
        :<table className="tbl"><thead><tr>{["Title","Category","Type","Access","Downloads","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>
          {resources.map(r=>(
            <tr key={r._id}>
              <td><div style={{ fontWeight:600,color:"#f0f6fc",fontSize:".875rem" }}>{r.title}</div></td>
              <td><span style={{ background:"rgba(59,139,253,.1)",color:"#90c8ff",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{r.category}</span></td>
              <td style={{ color:"#8b949e",fontSize:".82rem" }}>{r.type}</td>
              <td><span style={{ background:r.access==="public"?"rgba(52,211,153,.1)":"rgba(251,191,36,.1)",color:r.access==="public"?"#34d399":"#fbbf24",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100 }}>{r.access}</span></td>
              <td style={{ color:"#8b949e",fontSize:".82rem",fontFamily:"'JetBrains Mono',monospace" }}>{r.downloads}</td>
              <td><div style={{ display:"flex",gap:4 }}>
                <button onClick={()=>setEditTarget(r)} style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Edit size={12}/></button>
                <button onClick={()=>del(r._id,r.title)} style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
              </div></td>
            </tr>
          ))}
        </tbody></table>}
      </div>
      {editTarget!==undefined&&<ResourceModal resource={editTarget} onClose={()=>setEditTarget(undefined)} onSave={handleSave}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
