"use client";
import { useState, useEffect } from "react";
import { SectionHeader, Card } from "@/components/ui";
import { Users, Search, ExternalLink } from "lucide-react";

interface Member { _id: string; name: string; role: string; branch?: string; year?: string; bio?: string; github?: string; linkedin?: string; skills?: string[]; showOnAbout?: boolean; }
interface TeamMember { _id: string; name: string; role: string; tier: string; department?: string; course?: string; bio?: string; }

const teamHierarchy = [
  { level: "Faculty Head", members: [{ name: "Dr. R. Verma", role: "Faculty Head", dept: "Computer Science & Engineering", course: "Ph.D. AI/ML", bio: "Guiding innovation with 15+ years of research experience.", grad: "linear-gradient(135deg,#3b8bfd,#6d28d9)" }] },
  { level: "Leadership", members: [
    { name: "Aryan Kumar", role: "Club Head", dept: "CSE (AI/ML)", course: "B.Tech · 3rd Year", bio: "ML engineer passionate about building real-world AI systems. Won 3 national hackathons.", grad: "linear-gradient(135deg,#6d28d9,#ec4899)" },
    { name: "Priya Sharma", role: "Co-Head", dept: "Data Science", course: "B.Tech · 3rd Year", bio: "Data scientist specializing in NLP and large-scale model fine-tuning.", grad: "linear-gradient(135deg,#22d3ee,#3b8bfd)" },
  ]},
  { level: "Core Members", members: [
    { name: "Sneha Rao", role: "NLP Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "HuggingFace contributor. Specializes in multilingual NLP.", grad: "linear-gradient(135deg,#34d399,#22d3ee)" },
    { name: "Vikram Agarwal", role: "Cybersecurity Lead", dept: "IT", course: "B.Tech · 3rd Year", bio: "CTF champion. Focuses on adversarial ML and network security.", grad: "linear-gradient(135deg,#fbbf24,#f87171)" },
    { name: "Riya Mehta", role: "Events Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "Organizes workshops, hackathons. 500+ event attendees managed.", grad: "linear-gradient(135deg,#6d28d9,#22d3ee)" },
    { name: "Kavya Pillai", role: "Design Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "Full-stack developer and UI designer. Builds all club platforms.", grad: "linear-gradient(135deg,#ec4899,#6d28d9)" },
  ]},
];

const GRADS = ["linear-gradient(135deg,#3b8bfd,#6d28d9)","linear-gradient(135deg,#34d399,#22d3ee)","linear-gradient(135deg,#fbbf24,#f87171)","linear-gradient(135deg,#a78bfa,#ec4899)","linear-gradient(135deg,#22d3ee,#3b8bfd)","linear-gradient(135deg,#f87171,#6d28d9)"];

export default function AboutPage() {
  const [dbMembers, setDbMembers] = useState<Member[]>([]);
  const [dbTeam, setDbTeam] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [memberSearch, setMemberSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // FIX #6 & #10: Fetch members and team from DB
    Promise.all([
      fetch("/api/members?status=active").then(r => r.json()).catch(() => ({ members: [] })),
      fetch("/api/team").then(r => r.json()).catch(() => ({ team: [] })),
    ]).then(([mData, tData]) => {
      setDbMembers((mData.members || []).filter((m: Member) => m.showOnAbout !== false));
      setDbTeam(tData.team || []);
    }).finally(() => setLoadingMembers(false));
  }, []);

  const initials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Merge DB team with static fallback
  const displayTeam = dbTeam.length > 0 ? dbTeam : teamHierarchy.flatMap(t =>
    t.members.map(m => ({ _id: m.name, name: m.name, role: m.role, tier: t.level.toLowerCase().replace(" ", "_"), department: m.dept, course: m.course, bio: m.bio }))
  );

  // Group DB team by tier
  const grouped: Record<string, typeof displayTeam> = {};
  displayTeam.forEach(m => {
    const key = m.tier || "member";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  const TIER_ORDER = ["faculty", "leadership", "core", "member"];
  const TIER_LABELS: Record<string, string> = { faculty: "Faculty Head", leadership: "Leadership", core: "Core Members", member: "Members" };

  const filteredMembers = dbMembers.filter(m => {
    const matchSearch = `${m.name} ${m.role} ${m.branch || ""} ${m.skills?.join(" ") || ""}`.toLowerCase().includes(memberSearch.toLowerCase());
    const matchFilter = activeFilter === "all" || m.role === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Hero */}
      <section style={{ minHeight:"55vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"7rem 1.5rem 4rem",textAlign:"center" }}>
        <div style={{ position:"absolute",width:600,height:600,borderRadius:"50%",background:"#3b8bfd",top:-200,left:"50%",transform:"translateX(-50%)",filter:"blur(130px)",opacity:.06 }}/>
        <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(59,139,253,.06) 1px,transparent 1px)",backgroundSize:"36px 36px" }}/>
        <div style={{ position:"relative",zIndex:1,maxWidth:700 }}>
          <span style={{ display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"#60a8ff",background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.22)",padding:".28rem .85rem",borderRadius:100,marginBottom:"1.25rem" }}>
            <span style={{ width:14,height:1,background:"#60a8ff",display:"inline-block" }}/>About Us
          </span>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2.5rem,6vw,4rem)",marginBottom:"1rem",lineHeight:1.1 }}>
            We are <span style={{ background:"linear-gradient(135deg,#60a8ff,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>AI-CLUB</span>
          </h1>
          <p style={{ color:"#8b949e",fontSize:"1rem",lineHeight:1.75,maxWidth:540,margin:"0 auto 1.5rem" }}>
            Founded in 2022, AI-Club is the premier AI student community at LPCPS — where research meets real-world impact.
          </p>
          {/* FIX #1: Navigation guide */}
          <div style={{ background:"rgba(59,139,253,.07)",border:"1px solid rgba(59,139,253,.18)",borderRadius:12,padding:"1rem 1.5rem",maxWidth:560,margin:"0 auto",textAlign:"left" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#60a8ff",letterSpacing:".08em",textTransform:"uppercase",marginBottom:".6rem" }}>🗂 How to navigate this page</div>
            <div style={{ display:"flex",flexDirection:"column",gap:".35rem" }}>
              {[
                { icon:"🔍", text:"Use the search bar below to find specific members by name, role, or skill" },
                { icon:"⚙️", text:"Use role filters (Core / Member / Alumni) to browse by team tier" },
                { icon:"👤", text:"Members → Member List → click any card to see their profile, skills & links" },
                { icon:"🏛", text:"Scroll down for Club Hierarchy: Faculty Head → Leadership → Core Team" },
              ].map((g,i) => (
                <div key={i} style={{ display:"flex",gap:".5rem",alignItems:"flex-start",fontSize:".8rem",color:"#8b949e" }}>
                  <span style={{ flexShrink:0 }}>{g.icon}</span><span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section style={{ padding:"4rem 1.5rem",background:"var(--bg2)",borderTop:"1px solid var(--border2)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1.25rem" }}>
          {[{icon:"🎯",title:"Our Vision",text:"Leading student AI innovation hub producing engineers and researchers."},{icon:"🚀",title:"Our Mission",text:"Democratizing AI through hands-on projects, mentorship, and collaboration."},{icon:"💡",title:"Our Values",text:"Open learning, radical collaboration, intellectual curiosity."}].map(v=>(
            <div key={v.title} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"1.75rem",textAlign:"center",transition:"all .3s" }}>
              <div style={{ fontSize:"2rem",marginBottom:".75rem" }}>{v.icon}</div>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.05rem",marginBottom:".5rem" }}>{v.title}</h3>
              <p style={{ color:"#8b949e",fontSize:".875rem",lineHeight:1.65 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FIX #6: Members section - synced from DB */}
      <section style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <SectionHeader tag="Our Members" title="Meet the Community" subtitle="Active members building, learning, and competing together."/>

          {/* Search & Filter */}
          <div style={{ display:"flex",gap:"1rem",marginBottom:"2rem",flexWrap:"wrap",alignItems:"center" }}>
            <div style={{ position:"relative",flex:"1 1 260px",maxWidth:340 }}>
              <Search size={14} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#8b949e" }}/>
              <input className="input-field" style={{ paddingLeft:36 }} placeholder="Search by name, role, skill..." value={memberSearch} onChange={e=>setMemberSearch(e.target.value)}/>
            </div>
            <div style={{ display:"flex",gap:".5rem",flexWrap:"wrap" }}>
              {["all","core","admin","member"].map(f=>(
                <button key={f} onClick={()=>setActiveFilter(f)}
                  style={{ background:activeFilter===f?"rgba(59,139,253,.15)":"rgba(255,255,255,.04)",border:`1px solid ${activeFilter===f?"rgba(59,139,253,.35)":"var(--border2)"}`,color:activeFilter===f?"#90c8ff":"#8b949e",padding:".38rem .9rem",borderRadius:100,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",textTransform:"capitalize" }}>
                  {f==="all"?"All Roles":f}
                </button>
              ))}
            </div>
          </div>

          {loadingMembers ? (
            <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ width:28,height:28,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div style={{ textAlign:"center",padding:"3rem",color:"#8b949e" }}>
              <Users size={40} style={{ margin:"0 auto 1rem",opacity:.4 }}/>
              <p style={{ fontSize:".95rem" }}>{dbMembers.length === 0 ? "No members added yet. Admins can add members from the dashboard." : "No members match your search."}</p>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.25rem" }}>
              {filteredMembers.map((m,i)=>(
                <Card key={m._id} style={{ padding:"1.5rem",textAlign:"center" }}>
                  <div style={{ width:56,height:56,borderRadius:"50%",background:GRADS[i%GRADS.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",color:"white",margin:"0 auto .875rem" }}>
                    {initials(m.name)}
                  </div>
                  <h4 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".95rem",marginBottom:".25rem" }}>{m.name}</h4>
                  <div style={{ fontSize:".75rem",color:"#60a8ff",fontWeight:600,marginBottom:".3rem",textTransform:"capitalize" }}>{m.role}</div>
                  {m.branch && <div style={{ fontSize:".72rem",color:"#8b949e",fontFamily:"'JetBrains Mono',monospace",marginBottom:".6rem" }}>{m.branch}{m.year && ` · ${m.year}`}</div>}
                  {m.bio && <p style={{ fontSize:".78rem",color:"#8b949e",lineHeight:1.55,marginBottom:".75rem" }}>{m.bio}</p>}
                  {m.skills && m.skills.length > 0 && (
                    <div style={{ display:"flex",gap:".3rem",flexWrap:"wrap",justifyContent:"center",marginBottom:".75rem" }}>
                      {m.skills.slice(0,3).map(s=><span key={s} style={{ background:"rgba(59,139,253,.1)",color:"#90c8ff",fontSize:".65rem",padding:".15rem .5rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{s}</span>)}
                    </div>
                  )}
                  {(m.github || m.linkedin) && (
                    <div style={{ display:"flex",gap:".4rem",justifyContent:"center" }}>
                      {m.github && <a href={m.github} target="_blank" rel="noopener noreferrer" style={{ background:"rgba(255,255,255,.06)",border:"1px solid var(--border2)",color:"#8b949e",padding:".28rem .6rem",borderRadius:6,fontSize:".72rem",textDecoration:"none",display:"flex",alignItems:"center",gap:3 }}><ExternalLink size={10}/> GitHub</a>}
                      {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".28rem .6rem",borderRadius:6,fontSize:".72rem",textDecoration:"none",display:"flex",alignItems:"center",gap:3 }}><ExternalLink size={10}/> LinkedIn</a>}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What We Cover */}
      <section style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",borderBottom:"1px solid var(--border2)",padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <SectionHeader tag="Domains" title="What We Cover" subtitle="From foundational AI to competitive hacking."/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"1rem" }}>
            {[{emoji:"🤖",label:"Machine Learning",desc:"Classical ML, regression, classification, clustering"},{emoji:"🧠",label:"Deep Learning",desc:"CNNs, RNNs, Transformers, GANs, Diffusion"},{emoji:"💬",label:"NLP & LLMs",desc:"BERT, GPT, RAG, fine-tuning, prompt engineering"},{emoji:"👁",label:"Computer Vision",desc:"Object detection, segmentation, pose estimation"},{emoji:"🔐",label:"Cybersecurity",desc:"CTF, pentesting, adversarial ML, network security"},{emoji:"⚡",label:"DevOps / MLOps",desc:"Docker, FastAPI, cloud, CI/CD for ML"},{emoji:"🌐",label:"Web Development",desc:"React, Next.js, Node.js, full-stack apps"},{emoji:"📱",label:"App Development",desc:"Mobile apps, PWAs, cross-platform development"},{emoji:"⚙️",label:"System Design",desc:"Scalable architectures, distributed systems"},{emoji:"📡",label:"IoT & Edge AI",desc:"Raspberry Pi, Arduino, edge inference"}].map(d=>(
              <div key={d.label} style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:12,padding:"1.5rem",transition:"border-color .3s" }}>
                <div style={{ fontSize:"1.75rem",marginBottom:".65rem" }}>{d.emoji}</div>
                <h4 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".95rem",marginBottom:".35rem" }}>{d.label}</h4>
                <p style={{ color:"#8b949e",fontSize:".8rem",lineHeight:1.55 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Hierarchy - uses DB team if available */}
      <section style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <SectionHeader tag="The Team" title="Club Hierarchy" subtitle="From faculty guidance to core operations — meet the people who run AI-Club."/>
          {dbTeam.length > 0 ? (
            // Render DB team grouped by tier
            TIER_ORDER.filter(tier => grouped[tier]?.length > 0).map(tier => (
              <div key={tier} style={{ marginBottom:"3rem" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem" }}>
                  <span style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:".28rem .85rem",borderRadius:100 }}>{TIER_LABELS[tier]}</span>
                  <div style={{ flex:1,height:1,background:"var(--border2)" }}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.25rem" }}>
                  {grouped[tier].map((m, i) => (
                    <Card key={m._id} style={{ padding:"1.75rem",display:"flex",gap:"1.25rem",alignItems:"flex-start" }}>
                      <div style={{ width:54,height:54,borderRadius:"50%",background:GRADS[i%GRADS.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",color:"white",flexShrink:0 }}>{initials(m.name)}</div>
                      <div>
                        <h4 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",marginBottom:".22rem" }}>{m.name}</h4>
                        <div style={{ fontSize:".78rem",color:"#3b8bfd",fontWeight:600,marginBottom:".18rem" }}>{m.role}</div>
                        {m.department && <div style={{ fontSize:".75rem",color:"#8b949e",marginBottom:".65rem" }}>{m.department}{(m as {course?: string}).course && ` · ${(m as {course?: string}).course}`}</div>}
                        {m.bio && <p style={{ color:"#8b949e",fontSize:".82rem",lineHeight:1.6 }}>{m.bio}</p>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Static fallback
            teamHierarchy.map(tier => (
              <div key={tier.level} style={{ marginBottom:"3rem" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem" }}>
                  <span style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:".28rem .85rem",borderRadius:100 }}>{tier.level}</span>
                  <div style={{ flex:1,height:1,background:"var(--border2)" }}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.25rem" }}>
                  {tier.members.map(m => (
                    <Card key={m.name} style={{ padding:"1.75rem",display:"flex",gap:"1.25rem",alignItems:"flex-start" }}>
                      <div style={{ width:54,height:54,borderRadius:"50%",background:m.grad,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",color:"white",flexShrink:0 }}>{initials(m.name)}</div>
                      <div>
                        <h4 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",marginBottom:".22rem" }}>{m.name}</h4>
                        <div style={{ fontSize:".78rem",color:"#3b8bfd",fontWeight:600,marginBottom:".18rem" }}>{m.role}</div>
                        <div style={{ fontSize:".75rem",color:"#8b949e",marginBottom:".65rem" }}>{m.dept} · {m.course}</div>
                        <p style={{ color:"#8b949e",fontSize:".82rem",lineHeight:1.6 }}>{m.bio}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Club History */}
      <section style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:800,margin:"0 auto" }}>
          <SectionHeader tag="Our Journey" title="Club History"/>
          {[{year:"2022",title:"AI-Club Founded",desc:"Started with 12 founding members and a single workshop on Python & ML basics."},{year:"2023",title:"First Hackathon Win",desc:"Won 1st place at State-level ML hackathon. Grew to 50+ active members."},{year:"2024",title:"Research & Scale",desc:"First research paper. Launched CyberSecurity track. Hosted 10+ events."},{year:"2025",title:"100+ Members & Growing",desc:"National hackathon 2nd place. LLM research pipeline. Batch 2025 applications now open."}].map((t,i)=>(
            <div key={t.year} style={{ display:"flex",gap:"1.5rem",marginBottom:"2rem" }}>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
                <div style={{ width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".72rem",color:"white",flexShrink:0 }}>{t.year}</div>
                {i<3&&<div style={{ width:2,flex:1,background:"rgba(59,139,253,.2)",marginTop:4 }}/>}
              </div>
              <div style={{ paddingBottom:"1.5rem" }}>
                <h4 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:".4rem" }}>{t.title}</h4>
                <p style={{ color:"#8b949e",fontSize:".875rem",lineHeight:1.65 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
