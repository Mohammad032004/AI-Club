"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, Card, Badge, GradientButton, OutlineButton } from "@/components/ui";
import { Calendar, MapPin, Users, Clock, ArrowRight, RefreshCw } from "lucide-react";

interface ClubEvent {
  _id: string;
  title: string;
  type: string;
  description?: string;
  date?: string;
  location?: string;
  maxAttendees?: number;
  status: "upcoming"|"ongoing"|"past"|"cancelled";
  registrationOpen: boolean;
  tags?: string[];
}

const STATIC_EVENTS = [
  { _id:"s1",type:"Workshop",status:"upcoming" as const,title:"Intro to LLM Fine-Tuning",date:"2025-04-20",time:"2:00 PM – 5:00 PM",location:"Lab 3, Block C",attendees:34,maxAttendees:40,description:"Hands-on session covering LoRA, QLoRA, and PEFT techniques for fine-tuning large language models. Bring your laptop.",tags:["LLMs","PyTorch","HuggingFace"],registrationOpen:true},
  { _id:"s2",type:"Hackathon",status:"upcoming" as const,title:"AIthon 2025",date:"2025-05-03",time:"Starts 10:00 AM",location:"Main Auditorium",attendees:87,maxAttendees:120,description:"36-hour hackathon with NLP, Computer Vision & RL tracks. Form teams of 2–4. ₹1 Lakh prize pool. Food provided.",tags:["NLP","CV","RL","Prizes"],registrationOpen:true},
  { _id:"s3",type:"Guest Talk",status:"upcoming" as const,title:"AI in Production: Real World ML",date:"2025-04-28",time:"4:00 PM – 5:30 PM",location:"Online — Zoom",attendees:52,maxAttendees:200,description:"Senior ML engineer from a top AI company shares lessons from deploying models at scale.",tags:["MLOps","Production"],registrationOpen:true},
  { _id:"s4",type:"Hackathon",status:"past" as const,title:"MLHack Winter 2024",date:"2024-12-14",time:"36 hours",location:"Main Auditorium",attendees:108,maxAttendees:120,description:"Our largest hackathon. 27 teams competed. NexusAI team won 2nd place nationally.",tags:["CV","MediaPipe","Winners"],registrationOpen:false},
];

type TFilter = "all"|"Workshop"|"Hackathon"|"Guest Talk";
type SFilter = "all"|"upcoming"|"past";

// Registration Modal
function RegModal({ event, onClose }: { event: ClubEvent|null; onClose: ()=>void }) {
  const [form,setForm]=useState({name:"",email:"",phone:"",branch:"",year:""});
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e: Record<string,string>={};
    if(!form.name.trim()) e.name="Name is required";
    if(!form.email.trim()) e.email="Email is required";
    else if(!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email="Valid email required";
    if(!form.branch.trim()) e.branch="Branch is required";
    if(!form.year) e.year="Year is required";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const submit=async()=>{
    if(!validate()) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1000));
    setLoading(false);
    setDone(true);
  };

  if(!event) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{ maxWidth:480 }}>
        {done ? (
          <div style={{ textAlign:"center",padding:"2rem 1rem" }}>
            <div style={{ fontSize:"3rem",marginBottom:"1rem" }}>✅</div>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.4rem",marginBottom:".75rem" }}>You're Registered!</h3>
            <p style={{ color:"#8b949e",lineHeight:1.7,marginBottom:".5rem" }}>Thanks, <strong style={{ color:"#f0f6fc" }}>{form.name}</strong>!</p>
            <p style={{ color:"#8b949e",fontSize:".875rem",marginBottom:"1.75rem" }}>A confirmation will be sent to <strong style={{ color:"#90c8ff" }}>{form.email}</strong>.</p>
            <GradientButton onClick={onClose}>Close</GradientButton>
          </div>
        ) : (
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
              <div>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>Register for Event</h3>
                <p style={{ color:"#8b949e",fontSize:".82rem",marginTop:".2rem" }}>{event.title}</p>
              </div>
              <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer",fontSize:"1.25rem",lineHeight:1 }}>✕</button>
            </div>
            {[
              {k:"name",l:"Full Name",ph:"Rahul Sharma",req:true},
              {k:"email",l:"Email Address",ph:"rahul@college.edu.in",req:true},
              {k:"phone",l:"Phone Number",ph:"+91 9876543210",req:false},
              {k:"branch",l:"Branch / Program",ph:"B.Tech CSE (AI/ML)",req:true},
            ].map(f=>(
              <div key={f.k} className="form-group">
                <label className="form-label">{f.l}{f.req&&<span style={{ color:"#f87171",marginLeft:2 }}>*</span>}</label>
                <input className="input-field" value={(form as Record<string,string>)[f.k]} placeholder={f.ph}
                  onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                  style={{ borderColor:errors[f.k]?"#f87171":undefined }}/>
                {errors[f.k]&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors[f.k]}</span>}
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Year <span style={{ color:"#f87171" }}>*</span></label>
              <select className="input-field" value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))}
                style={{ borderColor:errors.year?"#f87171":undefined }}>
                <option value="">Select year</option>
                <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
              </select>
              {errors.year&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.year}</span>}
            </div>
            <GradientButton fullWidth onClick={submit} disabled={loading}>
              {loading?<><div style={{ width:15,height:15,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite" }}/> Registering...</>:<>Confirm Registration <ArrowRight size={14}/></>}
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [typeFilter,setTypeFilter]=useState<TFilter>("all");
  const [statusFilter,setStatusFilter]=useState<SFilter>("all");
  const [dbEvents,setDbEvents]=useState<ClubEvent[]>([]);
  const [loadingDB,setLoadingDB]=useState(true);
  const [regTarget,setRegTarget]=useState<ClubEvent|null>(null);

  const loadDB=useCallback(async()=>{
    setLoadingDB(true);
    try{
      const r=await fetch("/api/events");
      if(r.ok){const d=await r.json();setDbEvents(d.events||[]);}
    }catch{}
    finally{setLoadingDB(false);}
  },[]);

  useEffect(()=>{loadDB();},[loadDB]);

  // Merge DB events with static ones (DB takes priority if any exist)
  const allEvents: (ClubEvent&{time?:string;attendees?:number})[] = 
    dbEvents.length>0 ? dbEvents : STATIC_EVENTS;

  const filtered=allEvents.filter(e=>
    (typeFilter==="all"||e.type===typeFilter||e.type.toLowerCase()===typeFilter.toLowerCase())&&
    (statusFilter==="all"||e.status===statusFilter)
  );

  const typeColor: Record<string,string>={"Workshop":"blue","Hackathon":"teal","Guest Talk":"green","workshop":"blue","hackathon":"teal","talk":"green"};

  return (
    <>
      <section style={{ padding:"8rem 1.5rem 4rem",maxWidth:1200,margin:"0 auto" }}>
        <SectionHeader tag="Events" title="Workshops, Hackathons & Talks" subtitle="From beginner workshops to national hackathons — there's always something happening at AI-Club."/>

        {/* Stats */}
        <div style={{ display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"3rem" }}>
          {[
            {label:"Total Events",value:"20+",color:"#3b8bfd"},
            {label:"Upcoming",value:allEvents.filter(e=>e.status==="upcoming").length,color:"#34d399"},
            {label:"Past Events",value:allEvents.filter(e=>e.status==="past").length,color:"#a78bfa"},
            {label:"Total Attendees",value:"500+",color:"#22d3ee"},
          ].map(s=>(
            <div key={s.label} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:12,padding:"1.1rem 1.75rem",textAlign:"center",minWidth:120 }}>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",color:s.color }}>{s.value}</div>
              <div style={{ fontSize:".72rem",color:"#8b949e",fontFamily:"'JetBrains Mono',monospace",marginTop:.25*16+"px",letterSpacing:".05em",textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex",gap:".65rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2.5rem",alignItems:"center" }}>
          {(["all","upcoming","past"] as SFilter[]).map(f=>(
            <button key={f} onClick={()=>setStatusFilter(f)}
              style={{ background:statusFilter===f?"linear-gradient(135deg,#3b8bfd,#6d28d9)":"rgba(255,255,255,.03)",border:"1px solid",borderColor:statusFilter===f?"transparent":"var(--border2)",color:statusFilter===f?"#fff":"#8b949e",padding:".42rem 1.05rem",borderRadius:100,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em",textTransform:"capitalize" }}>
              {f==="all"?"All Events":f}
            </button>
          ))}
          <div style={{ width:1,height:22,background:"var(--border2)" }}/>
          {(["all","Workshop","Hackathon","Guest Talk"] as TFilter[]).map(f=>(
            <button key={f} onClick={()=>setTypeFilter(f)}
              style={{ background:typeFilter===f?"rgba(59,139,253,.12)":"rgba(255,255,255,.03)",border:"1px solid",borderColor:typeFilter===f?"rgba(59,139,253,.35)":"var(--border2)",color:typeFilter===f?"#90c8ff":"#8b949e",padding:".42rem 1.05rem",borderRadius:100,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif" }}>
              {f==="all"?"All Types":f}
            </button>
          ))}
          <button onClick={loadDB} style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".42rem .8rem",borderRadius:100,cursor:"pointer",display:"flex",alignItems:"center" }}>
            <RefreshCw size={13} style={{ animation:loadingDB?"spin 1s linear infinite":"none" }}/>
          </button>
        </div>

        {/* Events Grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"1.5rem" }}>
          {filtered.map(e=>{
            const pct=e.maxAttendees?(((e as {attendees?:number}).attendees||0)/e.maxAttendees*100):50;
            const color=(typeColor[e.type]||"blue") as "blue"|"teal"|"green";
            const grad=color==="blue"?"linear-gradient(135deg,rgba(59,139,253,.3),rgba(109,40,217,.3))":color==="teal"?"linear-gradient(135deg,rgba(34,211,238,.3),rgba(59,139,253,.3))":"linear-gradient(135deg,rgba(52,211,153,.3),rgba(34,211,238,.3))";
            return (
              <Card key={e._id} style={{ overflow:"hidden" }}>
                <div style={{ height:110,background:grad,padding:"1rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
                  <Badge color={color}>{e.type}</Badge>
                  {e.status==="past"
                    ?<span style={{ background:"rgba(0,0,0,.4)",color:"#8b949e",fontSize:".68rem",padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>Past</span>
                    :<span style={{ background:"rgba(52,211,153,.2)",color:"#34d399",fontSize:".68rem",padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>Upcoming</span>
                  }
                </div>
                <div style={{ padding:"1.5rem" }}>
                  <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.05rem",marginBottom:".875rem" }}>{e.title}</h3>
                  <div style={{ display:"flex",flexDirection:"column",gap:".38rem",marginBottom:"1rem" }}>
                    {e.date&&<div style={{ display:"flex",alignItems:"center",gap:6,fontSize:".78rem",color:"#8b949e" }}><Calendar size={12}/>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>}
                    {(e as {time?:string}).time&&<div style={{ display:"flex",alignItems:"center",gap:6,fontSize:".78rem",color:"#8b949e" }}><Clock size={12}/>{(e as {time?:string}).time}</div>}
                    {e.location&&<div style={{ display:"flex",alignItems:"center",gap:6,fontSize:".78rem",color:"#8b949e" }}><MapPin size={12}/>{e.location}</div>}
                    {e.maxAttendees&&<div style={{ display:"flex",alignItems:"center",gap:6,fontSize:".78rem",color:"#8b949e" }}><Users size={12}/>{(e as {attendees?:number}).attendees||"—"}/{e.maxAttendees} registered</div>}
                  </div>
                  {e.description&&<p style={{ color:"#8b949e",fontSize:".85rem",lineHeight:1.65,marginBottom:"1.1rem" }}>{e.description}</p>}
                  {e.tags&&e.tags.length>0&&(
                    <div style={{ display:"flex",gap:".45rem",flexWrap:"wrap",marginBottom:"1.1rem" }}>
                      {e.tags.map(t=>(<span key={t} style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",fontSize:".68rem",padding:".18rem .5rem",borderRadius:6,fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>))}
                    </div>
                  )}
                  {e.maxAttendees&&(
                    <div style={{ marginBottom:"1.1rem" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:".7rem",color:"#8b949e",marginBottom:".3rem",fontFamily:"'JetBrains Mono',monospace" }}>
                        <span>Spots filled</span><span>{Math.round(pct)}%</span>
                      </div>
                      <div style={{ background:"rgba(255,255,255,.05)",borderRadius:100,height:4,overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`,height:"100%",background:e.status==="upcoming"?"linear-gradient(90deg,#3b8bfd,#6d28d9)":"rgba(255,255,255,.12)",borderRadius:100,transition:"width .3s" }}/>
                      </div>
                    </div>
                  )}
                  {e.status==="upcoming"&&e.registrationOpen
                    ?<GradientButton size="sm" onClick={()=>setRegTarget(e)}>Register Now <ArrowRight size={12}/></GradientButton>
                    :<OutlineButton>View Details</OutlineButton>
                  }
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length===0&&(
          <div style={{ textAlign:"center",padding:"4rem",color:"#8b949e" }}>
            <div style={{ fontSize:"2.5rem",marginBottom:"1rem" }}>🔍</div>
            <p>No events match your current filters.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:600,margin:"0 auto",textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"2rem",marginBottom:"1rem" }}>Have an idea for an event?</h2>
          <p style={{ color:"#8b949e",lineHeight:1.75,marginBottom:"2rem" }}>Members can propose workshops, talks, or competitions. Reach out and we'll make it happen.</p>
          <GradientButton>Propose an Event</GradientButton>
        </div>
      </section>

      {regTarget&&<RegModal event={regTarget} onClose={()=>setRegTarget(null)}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
