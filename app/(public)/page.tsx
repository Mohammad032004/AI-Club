"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionHeader, Card, Badge, GradientButton, OutlineButton } from "@/components/ui";
import { Brain, Shield, BookOpen, FlaskConical, ExternalLink, ChevronRight, Zap, Users, Trophy, Calendar, ArrowRight } from "lucide-react";

function Counter({ target }: { target: number }) {
  const [val,setVal]=useState(0);
  const ref=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        let cur=0;const step=target/60;
        const t=setInterval(()=>{cur=Math.min(cur+step,target);setVal(Math.floor(cur));if(cur>=target)clearInterval(t);},18);
        obs.disconnect();
      }
    },{threshold:.1});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[target]);
  return <span ref={ref}>{val}+</span>;
}

const stats=[
  {icon:Users,target:100,label:"Active Members",color:"#3b8bfd",bg:"rgba(59,139,253,.08)"},
  {icon:FlaskConical,target:50,label:"Projects Built",color:"#a78bfa",bg:"rgba(167,139,250,.08)"},
  {icon:Trophy,target:20,label:"Hackathons Won",color:"#22d3ee",bg:"rgba(34,211,238,.08)"},
  {icon:Calendar,target:30,label:"Workshops Held",color:"#34d399",bg:"rgba(52,211,153,.08)"},
];
const domains=[
  {Icon:Brain,title:"AI & Machine Learning",desc:"Deep dives into neural networks, NLP, transformers, and emerging AI architectures with hands-on projects.",color:"#3b8bfd",bg:"rgba(59,139,253,.1)"},
  {Icon:Shield,title:"Hackathons & Competitions",desc:"Team-based competitions pushing limits. We compete nationally and internationally, winning recognition.",color:"#a78bfa",bg:"rgba(167,139,250,.1)"},
  {Icon:BookOpen,title:"Workshops & Talks",desc:"Weekly sessions led by members and industry professionals. Learn by doing, from coding sprints to research seminars.",color:"#22d3ee",bg:"rgba(34,211,238,.1)"},
  {Icon:FlaskConical,title:"Research Projects",desc:"Collaborative research on real-world problems with publication opportunities and industry collaboration.",color:"#34d399",bg:"rgba(52,211,153,.1)"},
];
const events=[
  {type:"Workshop",title:"Intro to LLM Fine-Tuning",date:"Apr 20, 2025",loc:"Lab 3, Block C",desc:"Hands-on LoRA, QLoRA & PEFT session.",color:"blue" as const,grad:"linear-gradient(135deg,rgba(59,139,253,.25),rgba(109,40,217,.25))"},
  {type:"Hackathon",title:"AIthon 2025",date:"May 3–4, 2025",loc:"Main Auditorium",desc:"36-hour hackathon — ₹1 Lakh prize pool.",color:"teal" as const,grad:"linear-gradient(135deg,rgba(34,211,238,.25),rgba(59,139,253,.25))"},
  {type:"Guest Talk",title:"AI in Production",date:"Apr 28, 2025",loc:"Online (Zoom)",desc:"Industry expert on deploying ML at scale.",color:"green" as const,grad:"linear-gradient(135deg,rgba(52,211,153,.25),rgba(34,211,238,.25))"},
];
const projects=[
  {title:"MediScan AI",desc:"CNN-based chest X-ray analyzer achieving 94% accuracy for pneumonia and TB detection.",tags:["PyTorch","FastAPI","React"],by:"Aryan K., Priya S."},
  {title:"Hindi Sentiment NLP",desc:"BERT fine-tuned on 100K Hindi social media posts. 91% F1 score, HuggingFace deployed.",tags:["HuggingFace","Python","Flask"],by:"Sneha R."},
  {title:"CyberShield",desc:"Real-time network anomaly detection using LSTM. Trained on CICIDS2017. 96% precision.",tags:["TensorFlow","Next.js","PostgreSQL"],by:"Vikram A."},
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"6rem 1.5rem 4rem" }}>
        {/* bg effects */}
        <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",background:"#3b8bfd",top:-250,right:-200,filter:"blur(130px)",opacity:.07,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",width:600,height:600,borderRadius:"50%",background:"#6d28d9",bottom:-200,left:-200,filter:"blur(130px)",opacity:.08,pointerEvents:"none" }}/>
        <div className="bg-dots" style={{ position:"absolute",inset:0,opacity:.6 }}/>
        
        <div style={{ textAlign:"center",maxWidth:880,position:"relative",zIndex:1 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.25)",padding:".35rem 1rem",borderRadius:100,fontSize:".75rem",color:"#90c8ff",marginBottom:"1.75rem",fontFamily:"'JetBrains Mono',monospace" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#34d399",display:"inline-block",animation:"pulse 2s ease-in-out infinite" }}/>
            Applications Open — Batch 2025
          </div>
          
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2.8rem,7vw,5.5rem)",lineHeight:1.05,marginBottom:"1.5rem",letterSpacing:".01em" }}>
            Building the Future<br/>
            <span style={{ background:"linear-gradient(135deg,#60a8ff,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              with Artificial Intelligence
            </span>
          </h1>
          
          <p style={{ fontSize:"1.1rem",color:"#8b949e",maxWidth:580,margin:"0 auto 2.5rem",lineHeight:1.75 }}>
            A community of AI/ML enthusiasts, hackers, and researchers at LPCPS. We build intelligent systems, win hackathons, and push what's possible.
          </p>
          
          <div style={{ display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"2.5rem" }}>
            <Link href="/apply"><GradientButton size="lg">Join AI-CLUB <ArrowRight size={16}/></GradientButton></Link>
            <Link href="/projects"><OutlineButton>Explore Projects</OutlineButton></Link>
          </div>
          
          <div style={{ display:"flex",gap:".55rem",justifyContent:"center",flexWrap:"wrap" }}>
            {["AI / ML","Deep Learning","NLP & LLMs","Computer Vision","Cybersecurity","Reinforcement Learning"].map(t=>(
              <span key={t} style={{ background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",color:"#8b949e",fontSize:".76rem",padding:".28rem .85rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",borderBottom:"1px solid var(--border2)",padding:"3.5rem 1.5rem" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem" }}>
          {stats.map(s=>(
            <div key={s.label} style={{ background:s.bg,border:`1px solid ${s.color}22`,borderRadius:14,padding:"1.5rem",textAlign:"center",position:"relative",overflow:"hidden" }}>
              <div style={{ width:44,height:44,borderRadius:11,background:s.bg,border:`1px solid ${s.color}33`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto .875rem" }}>
                <s.icon size={20} color={s.color}/>
              </div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"2.2rem",color:s.color,lineHeight:1 }}>
                <Counter target={s.target}/>
              </div>
              <p style={{ fontSize:".75rem",color:"#8b949e",marginTop:".35rem",fontFamily:"'JetBrains Mono',monospace",letterSpacing:".05em",textTransform:"uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="section" style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <SectionHeader tag="What We Do" title="Where Curiosity Meets Capability" subtitle="From ML research to competitive hacking — we build, learn, and grow together."/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1.5rem" }}>
            {domains.map(d=>(
              <Card key={d.title} style={{ padding:"2rem" }}>
                <div style={{ width:48,height:48,borderRadius:12,background:d.bg,border:`1px solid ${d.color}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem" }}>
                  <d.Icon size={22} color={d.color}/>
                </div>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",marginBottom:".6rem" }}>{d.title}</h3>
                <p style={{ color:"#8b949e",fontSize:".875rem",lineHeight:1.7 }}>{d.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS (fetched from DB) ── */}
      <section style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <SectionHeader tag="Upcoming Events" title="What's Coming Up" subtitle="Register early — spots fill fast."/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem" }}>
            {events.map(e=>(
              <Card key={e.title} style={{ overflow:"hidden" }}>
                <div style={{ height:110,background:e.grad,padding:"1rem",display:"flex",alignItems:"flex-end" }}>
                  <Badge color={e.color}>{e.type}</Badge>
                </div>
                <div style={{ padding:"1.5rem" }}>
                  <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.05rem",marginBottom:".45rem" }}>{e.title}</h3>
                  <div style={{ display:"flex",gap:"1rem",fontSize:".78rem",color:"#8b949e",marginBottom:"1rem" }}>
                    <span>📅 {e.date}</span><span>📍 {e.loc}</span>
                  </div>
                  <p style={{ color:"#8b949e",fontSize:".875rem",lineHeight:1.65,marginBottom:"1.25rem" }}>{e.desc}</p>
                  <Link href="/events"><GradientButton size="sm">Register <ArrowRight size={12}/></GradientButton></Link>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:"2.5rem" }}>
            <Link href="/events"><OutlineButton>View All Events <ChevronRight size={14}/></OutlineButton></Link>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section" style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <SectionHeader tag="Featured Projects" title="What We've Built" subtitle="A snapshot of 50+ projects built by our members."/>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem" }}>
            {projects.map(p=>(
              <Card key={p.title} style={{ padding:"1.75rem" }}>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",marginBottom:".6rem" }}>{p.title}</h3>
                <p style={{ color:"#8b949e",fontSize:".875rem",lineHeight:1.7,marginBottom:"1.25rem" }}>{p.desc}</p>
                <div style={{ display:"flex",gap:".45rem",flexWrap:"wrap",marginBottom:"1.25rem" }}>
                  {p.tags.map(t=>(<span key={t} style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".7rem",padding:".18rem .6rem",borderRadius:7,fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>))}
                </div>
                <div style={{ display:"flex",gap:".65rem" }}>
                  <button style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".38rem .9rem",borderRadius:7,fontSize:".78rem",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}>⬡ GitHub</button>
                  <button style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".38rem .9rem",borderRadius:7,fontSize:".78rem",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4 }}><ExternalLink size={12}/> Demo</button>
                </div>
                <div style={{ borderTop:"1px solid var(--border2)",marginTop:"1.1rem",paddingTop:".875rem",fontSize:".75rem",color:"#6e7681",fontFamily:"'JetBrains Mono',monospace" }}>by {p.by}</div>
              </Card>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:"2.5rem" }}>
            <Link href="/projects"><OutlineButton>View All Projects <ChevronRight size={14}/></OutlineButton></Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"5rem 1.5rem",background:"linear-gradient(135deg,rgba(59,139,253,.06),rgba(109,40,217,.06))",borderTop:"1px solid rgba(59,139,253,.12)",borderBottom:"1px solid rgba(109,40,217,.12)" }}>
        <div style={{ maxWidth:680,margin:"0 auto",textAlign:"center" }}>
          <div style={{ fontSize:"3rem",marginBottom:"1rem" }}>🚀</div>
          <h2 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1.8rem,4vw,2.5rem)",marginBottom:"1rem" }}>Ready to build the future?</h2>
          <p style={{ color:"#8b949e",fontSize:"1.05rem",lineHeight:1.75,marginBottom:"2rem" }}>Join 100+ members who are learning, building, and competing in the world of AI. Batch 2025 applications are open now.</p>
          <div style={{ display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap" }}>
            <Link href="/apply"><GradientButton size="lg">Apply Now <ArrowRight size={16}/></GradientButton></Link>
            <Link href="/contact"><OutlineButton>Ask a Question</OutlineButton></Link>
          </div>
        </div>
      </section>
    </>
  );
}
