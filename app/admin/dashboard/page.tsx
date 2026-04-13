"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ClipboardList, Calendar, FlaskConical, MessageSquare, TrendingUp, RefreshCw, Check, X, ChevronRight } from "lucide-react";
import { applicationsApi, membersApi, messagesApi, eventsApi, projectsApi, type Application, type Message } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

export default function AdminDashboard() {
  const [loading,setLoading]=useState(true);
  const [stats,setStats]=useState({members:0,pendingApps:0,totalApps:0,events:0,projects:0,unreadMsgs:0});
  const [recentApps,setRecentApps]=useState<Application[]>([]);
  const [recentMsgs,setRecentMsgs]=useState<Message[]>([]);
  const [busyId,setBusyId]=useState<string|null>(null);

  const load=async()=>{
    setLoading(true);
    try{
      const [appD,memD,msgD,evtD,prjD]=await Promise.allSettled([
        applicationsApi.list(),membersApi.list(),messagesApi.list(false),eventsApi.list("upcoming"),projectsApi.list(),
      ]);
      const apps=appD.status==="fulfilled"?appD.value:{applications:[],total:0};
      const mem=memD.status==="fulfilled"?memD.value:{members:[],total:0};
      const msgs=msgD.status==="fulfilled"?msgD.value:{messages:[],total:0};
      const evts=evtD.status==="fulfilled"?evtD.value:{events:[]};
      const prjs=prjD.status==="fulfilled"?prjD.value:{projects:[]};
      setStats({members:mem.total,pendingApps:apps.applications.filter((a:Application)=>a.status==="pending").length,totalApps:apps.total,events:evts.events.length,projects:prjs.projects.length,unreadMsgs:msgs.total});
      setRecentApps(apps.applications.slice(0,6));
      setRecentMsgs(msgs.messages.slice(0,4));
    }catch{toast.error("Failed to load dashboard");}
    finally{setLoading(false);}
  };
  useEffect(()=>{load();},[]);

  const handleAppStatus=async(id:string,status:"accepted"|"rejected")=>{
    setBusyId(id+status);
    try{
      const {application}=await applicationsApi.updateStatus(id,status);
      setRecentApps(prev=>prev.map(a=>a._id===id?application:a));
      setStats(prev=>({...prev,pendingApps:Math.max(0,prev.pendingApps-1)}));
      toast.success(`Application ${status}`);
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const statCards=[
    {label:"Total Members",value:stats.members,sub:`Active members`,icon:Users,color:"#3b8bfd",bg:"rgba(59,139,253,.1)",href:"/admin/members"},
    {label:"Applications",value:stats.totalApps,sub:`${stats.pendingApps} pending review`,icon:ClipboardList,color:"#fbbf24",bg:"rgba(251,191,36,.1)",href:"/admin/applications"},
    {label:"Upcoming Events",value:stats.events,sub:"Registered events",icon:Calendar,color:"#34d399",bg:"rgba(52,211,153,.1)",href:"/admin/events"},
    {label:"Projects",value:stats.projects,sub:"Published projects",icon:FlaskConical,color:"#a78bfa",bg:"rgba(167,139,250,.1)",href:"/admin/projects"},
    {label:"Unread Messages",value:stats.unreadMsgs,sub:"Needs response",icon:MessageSquare,color:"#f87171",bg:"rgba(248,113,113,.1)",href:"/admin/messages"},
    {label:"Pending Review",value:stats.pendingApps,sub:"Applications waiting",icon:TrendingUp,color:"#22d3ee",bg:"rgba(34,211,238,.1)",href:"/admin/applications"},
  ];

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Dashboard</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem",fontFamily:"'JetBrains Mono',monospace" }}>Live data · AI-Club Admin Panel</p>
        </div>
        <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>
          <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:"1rem",marginBottom:"2rem" }}>
        {statCards.map(s=>(
          <Link key={s.label} href={s.href} style={{ textDecoration:"none" }}>
            <div style={{ background:s.bg,border:`1px solid ${s.color}22`,borderRadius:14,padding:"1.25rem 1.4rem",cursor:"pointer",transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow=`0 0 20px ${s.color}20`;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="none";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".75rem" }}>
                <div style={{ width:38,height:38,borderRadius:10,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <s.icon size={18} color={s.color}/>
                </div>
                <ChevronRight size={14} color="#6e7681"/>
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.9rem",color:s.color,lineHeight:1 }}>
                {loading?"—":s.value}
              </div>
              <div style={{ fontSize:".78rem",color:"#8b949e",marginTop:".35rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,letterSpacing:".02em" }}>{s.label}</div>
              <div style={{ fontSize:".7rem",color:"#6e7681",marginTop:".2rem",fontFamily:"'JetBrains Mono',monospace" }}>{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"1.5rem" }}>
        {/* Recent Applications */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 1.4rem",borderBottom:"1px solid var(--border2)" }}>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem" }}>Recent Applications</h3>
            <Link href="/admin/applications" style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",color:"#60a8ff",textDecoration:"none" }}>View all →</Link>
          </div>
          {loading?(
            <div style={{ padding:"2rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ width:22,height:22,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto" }}/>
            </div>
          ):recentApps.length===0?(
            <div style={{ padding:"2rem",textAlign:"center",color:"#8b949e",fontSize:".875rem" }}>No applications yet</div>
          ):(
            <div>
              {recentApps.map(a=>(
                <div key={a._id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:".875rem 1.4rem",borderBottom:"1px solid rgba(59,139,253,.04)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:".75rem" }}>
                    <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".78rem",color:"white",flexShrink:0 }}>
                      {a.firstName[0]}{a.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight:600,fontSize:".875rem" }}>{a.firstName} {a.lastName}</div>
                      <div style={{ fontSize:".72rem",color:"#8b949e",fontFamily:"'JetBrains Mono',monospace" }}>{a.branch||"—"}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:".6rem" }}>
                    <StatusPill status={a.status}/>
                    {a.status==="pending"&&(
                      <div style={{ display:"flex",gap:3 }}>
                        <button onClick={()=>handleAppStatus(a._id,"accepted")} disabled={!!busyId} style={{ background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.25)",color:"#34d399",padding:".25rem .45rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><Check size={11}/></button>
                        <button onClick={()=>handleAppStatus(a._id,"rejected")} disabled={!!busyId} style={{ background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",color:"#f87171",padding:".25rem .45rem",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center" }}><X size={11}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 1.4rem",borderBottom:"1px solid var(--border2)" }}>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem" }}>Unread Messages</h3>
            <Link href="/admin/messages" style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",color:"#60a8ff",textDecoration:"none" }}>View all →</Link>
          </div>
          {loading?(
            <div style={{ padding:"2rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ width:22,height:22,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto" }}/>
            </div>
          ):recentMsgs.length===0?(
            <div style={{ padding:"2rem",textAlign:"center",color:"#8b949e",fontSize:".875rem" }}>
              <div style={{ fontSize:"2rem",marginBottom:".5rem" }}>✉️</div>No unread messages
            </div>
          ):(
            <div>
              {recentMsgs.map(m=>(
                <div key={m._id} style={{ padding:".875rem 1.4rem",borderBottom:"1px solid rgba(59,139,253,.04)" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".3rem" }}>
                    <div style={{ fontWeight:600,fontSize:".875rem" }}>{m.name}</div>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#6e7681" }}>{new Date(m.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                  </div>
                  <div style={{ fontSize:".78rem",color:"#60a8ff",marginBottom:".25rem",fontWeight:600 }}>{m.subject}</div>
                  <p style={{ fontSize:".78rem",color:"#8b949e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
