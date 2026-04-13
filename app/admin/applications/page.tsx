"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, X, Trash2, Eye, RefreshCw, Search } from "lucide-react";
import { applicationsApi, type Application } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

export default function AdminApplicationsPage() {
  const [apps,setApps]=useState<Application[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState<Application|null>(null);
  const [busyId,setBusyId]=useState<string|null>(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const {applications}=await applicationsApi.list(filter==="all"?undefined:filter);setApps(applications);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setLoading(false);}
  },[filter]);
  useEffect(()=>{load();},[load]);

  const action=async(id:string,status:"accepted"|"rejected")=>{
    setBusyId(id+status);
    try{
      const {application}=await applicationsApi.updateStatus(id,status);
      setApps(prev=>prev.map(a=>a._id===id?application:a));
      if(selected?._id===id)setSelected(application);
      toast.success(`Application ${status}`);
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const del=async(id:string)=>{
    if(!confirm("Delete this application?"))return;
    setBusyId(id+"del");
    try{await applicationsApi.delete(id);setApps(prev=>prev.filter(a=>a._id!==id));if(selected?._id===id)setSelected(null);toast.success("Deleted");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const filtered=apps.filter(a=>`${a.firstName} ${a.lastName} ${a.email} ${a.branch||""}`.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Applications</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem" }}>{apps.filter(a=>a.status==="pending").length} pending review</p>
        </div>
        <div style={{ display:"flex",gap:".65rem",flexWrap:"wrap" }}>
          {["all","pending","accepted","rejected"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ background:filter===f?"linear-gradient(135deg,#3b8bfd,#6d28d9)":"rgba(255,255,255,.04)",border:"1px solid",borderColor:filter===f?"transparent":"var(--border2)",color:filter===f?"#fff":"#8b949e",padding:".4rem .9rem",borderRadius:100,fontSize:".78rem",fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em",textTransform:"capitalize" }}>
              {f==="all"?"All":f}
            </button>
          ))}
          <button onClick={load} style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".4rem .7rem",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center" }}>
            <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/>
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position:"relative",maxWidth:340,marginBottom:"1.25rem" }}>
        <Search size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#8b949e" }}/>
        <input className="input-field" style={{ paddingLeft:36 }} placeholder="Search name, email, branch..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:selected?"1.4fr 1fr":"1fr",gap:"1.5rem",alignItems:"start" }}>
        {/* Table */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
          {loading?(
            <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...
            </div>
          ):filtered.length===0?(
            <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>📋</div>
              <p>No applications found.</p>
            </div>
          ):(
            <table className="tbl">
              <thead><tr>{["Applicant","Branch/Year","Status","Applied","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(a=>(
                  <tr key={a._id} onClick={()=>setSelected(selected?._id===a._id?null:a)} style={{ cursor:"pointer",background:selected?._id===a._id?"rgba(59,139,253,.06)":"transparent",opacity:busyId?.startsWith(a._id) ? .5:1 }}>
                    <td>
                      <div style={{ fontWeight:600,color:"#f0f6fc",fontSize:".875rem" }}>{a.firstName} {a.lastName}</div>
                      <div style={{ color:"#8b949e",fontSize:".75rem",fontFamily:"'JetBrains Mono',monospace" }}>{a.email}</div>
                    </td>
                    <td style={{ color:"#8b949e",fontSize:".82rem" }}>{a.branch||"—"} {a.year&&`· ${a.year}`}</td>
                    <td><StatusPill status={a.status}/></td>
                    <td style={{ color:"#8b949e",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace" }}>{new Date(a.submittedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</td>
                    <td>
                      <div style={{ display:"flex",gap:3 }} onClick={e=>e.stopPropagation()}>
                        {a.status==="pending"&&<>
                          <button onClick={()=>action(a._id,"accepted")} title="Accept" style={{ background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.25)",color:"#34d399",padding:".28rem .5rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><Check size={12}/></button>
                          <button onClick={()=>action(a._id,"rejected")} title="Reject" style={{ background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",color:"#f87171",padding:".28rem .5rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><X size={12}/></button>
                        </>}
                        <button onClick={()=>setSelected(selected?._id===a._id?null:a)} title="View" style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".28rem .5rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><Eye size={12}/></button>
                        <button onClick={()=>del(a._id)} title="Delete" style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".28rem .5rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected&&(
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"1.5rem",position:"sticky",top:"1.5rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem" }}>{selected.firstName} {selected.lastName}</h3>
              <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={16}/></button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:".875rem" }}>
              {[
                {l:"Email",v:selected.email},
                {l:"Phone",v:selected.phone||"—"},
                {l:"Branch",v:selected.branch||"—"},
                {l:"Year",v:selected.year||"—"},
                {l:"CGPA",v:selected.cgpa?.toString()||"—"},
                {l:"GitHub",v:selected.github||"—"},
                {l:"Skills",v:selected.skills?.join(", ")||"—"},
                {l:"Domains",v:selected.domains?.join(", ")||"—"},
              ].map(row=>(
                <div key={row.l}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".25rem" }}>{row.l}</div>
                  <div style={{ fontSize:".875rem",color:"#f0f6fc" }}>{row.v}</div>
                </div>
              ))}
              {selected.whyJoin&&(
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".35rem" }}>Why Join</div>
                  <p style={{ fontSize:".82rem",color:"#8b949e",lineHeight:1.65 }}>{selected.whyJoin}</p>
                </div>
              )}
            </div>
            {selected.status==="pending"&&(
              <div style={{ display:"flex",gap:".65rem",marginTop:"1.5rem" }}>
                <button onClick={()=>action(selected._id,"accepted")} disabled={!!busyId} style={{ flex:1,background:"linear-gradient(135deg,#34d399,#22d3ee)",color:"#fff",border:"none",padding:".6rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>Accept</button>
                <button onClick={()=>action(selected._id,"rejected")} disabled={!!busyId} style={{ flex:1,background:"rgba(248,113,113,.12)",color:"#f87171",border:"1px solid rgba(248,113,113,.25)",padding:".6rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>Reject</button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
