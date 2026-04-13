"use client";
import { useState, useEffect, useCallback } from "react";
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
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
