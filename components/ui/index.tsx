"use client";
import React from "react";

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"#60a8ff",background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.22)",padding:".28rem .85rem",borderRadius:100,marginBottom:"1rem" }}>
      <span style={{ width:14,height:1,background:"#60a8ff",display:"inline-block" }} />
      {children}
    </span>
  );
}

export function SectionHeader({ tag, title, subtitle, center=true }: { tag?:string; title:string; subtitle?:string; center?:boolean }) {
  return (
    <div style={{ textAlign:center?"center":"left", marginBottom:"3rem" }}>
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1.8rem,4vw,2.8rem)",lineHeight:1.15,marginBottom:subtitle?".75rem":0 }}>{title}</h2>
      {subtitle && <p style={{ color:"#8b949e",fontSize:".95rem",maxWidth:center?500:"none",margin:center?"0 auto":0,lineHeight:1.7 }}>{subtitle}</p>}
    </div>
  );
}

export function Card({ children, style={}, hover=true }: { children:React.ReactNode; style?:React.CSSProperties; hover?:boolean }) {
  const [h,setH]=React.useState(false);
  return (
    <div onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:"var(--surface)",border:h?"1px solid var(--border)":"1px solid var(--border2)",borderRadius:14,transition:"all .3s",transform:h?"translateY(-3px)":"none",boxShadow:h?"var(--glow)":"none",...style }}>
      {children}
    </div>
  );
}

export function Badge({ children, color="blue" }: { children:React.ReactNode; color?:"blue"|"purple"|"green"|"amber"|"red"|"teal" }) {
  const map: Record<string,{bg:string;text:string}> = {
    blue:{ bg:"rgba(59,139,253,.15)",text:"#90c8ff" },
    purple:{ bg:"rgba(167,139,250,.15)",text:"#c4b5fd" },
    green:{ bg:"rgba(52,211,153,.15)",text:"#34d399" },
    amber:{ bg:"rgba(251,191,36,.15)",text:"#fbbf24" },
    red:{ bg:"rgba(248,113,113,.15)",text:"#f87171" },
    teal:{ bg:"rgba(34,211,238,.15)",text:"#67e8f9" },
  };
  const c=map[color]||map.blue;
  return <span style={{ background:c.bg,color:c.text,fontSize:".68rem",fontWeight:700,padding:".2rem .6rem",borderRadius:100,letterSpacing:".04em",fontFamily:"'Rajdhani',sans-serif" }}>{children}</span>;
}

export function StatusPill({ status }: { status:string }) {
  const map: Record<string,{bg:string;color:string;label:string}> = {
    active:{ bg:"rgba(52,211,153,.12)",color:"#34d399",label:"Active" },
    pending:{ bg:"rgba(251,191,36,.12)",color:"#fbbf24",label:"Pending" },
    rejected:{ bg:"rgba(248,113,113,.12)",color:"#f87171",label:"Rejected" },
    accepted:{ bg:"rgba(52,211,153,.12)",color:"#34d399",label:"Accepted" },
    upcoming:{ bg:"rgba(59,139,253,.12)",color:"#90c8ff",label:"Upcoming" },
    past:{ bg:"rgba(255,255,255,.06)",color:"#8b949e",label:"Past" },
    ongoing:{ bg:"rgba(34,211,238,.12)",color:"#67e8f9",label:"Ongoing" },
    cancelled:{ bg:"rgba(248,113,113,.12)",color:"#f87171",label:"Cancelled" },
  };
  const s=map[status]||map.pending;
  return <span style={{ background:s.bg,color:s.color,fontSize:".68rem",fontWeight:700,padding:".22rem .65rem",borderRadius:100,fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em" }}>{s.label}</span>;
}

export function GradientButton({ children, onClick, fullWidth=false, size="md", type="button", disabled=false }:
  { children:React.ReactNode; onClick?:()=>void; fullWidth?:boolean; size?:"sm"|"md"|"lg"; type?:"button"|"submit"; disabled?:boolean }) {
  const pad=size==="sm"?".38rem .95rem":size==="lg"?".85rem 2.25rem":".6rem 1.4rem";
  const fs=size==="sm"?".8rem":size==="lg"?"1.05rem":".9rem";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ background:disabled?"rgba(59,139,253,.35)":"linear-gradient(135deg,#3b8bfd,#1a5ccf)",color:"#fff",border:"none",padding:pad,borderRadius:8,fontSize:fs,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".06em",transition:"all .2s",width:fullWidth?"100%":"auto",display:"inline-flex",alignItems:"center",gap:".4rem",justifyContent:"center",opacity:disabled?.7:1 }}>
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick }: { children:React.ReactNode; onClick?:()=>void }) {
  return (
    <button onClick={onClick}
      style={{ background:"transparent",color:"var(--accent2)",border:"1px solid var(--border)",padding:".55rem 1.35rem",borderRadius:8,fontSize:".9rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".06em",transition:"all .2s",display:"inline-flex",alignItems:"center",gap:".4rem" }}>
      {children}
    </button>
  );
}

export function FormField({ label, children, required }: { label:string; children:React.ReactNode; required?:boolean }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:".42rem",marginBottom:"1rem" }}>
      <label style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".67rem",fontWeight:600,color:"#8b949e",letterSpacing:".08em",textTransform:"uppercase" }}>
        {label}{required&&<span style={{ color:"#f87171",marginLeft:2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export function Spinner({ size=18, color="#3b8bfd" }: { size?:number; color?:string }) {
  return (
    <div style={{ width:size,height:size,border:`2px solid rgba(${color==="white"?"255,255,255":"59,139,253"},.2)`,borderTopColor:color,borderRadius:"50%",animation:"spin 1s linear infinite",flexShrink:0 }} />
  );
}
