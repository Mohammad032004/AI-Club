"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Cpu, ChevronRight } from "lucide-react";

const navLinks = [
  { href:"/", label:"Home" },
  { href:"/about", label:"About" },
  { href:"/events", label:"Events" },
  { href:"/projects", label:"Projects" },
  { href:"/resources", label:"Resources" },
  { href:"/contact", label:"Contact" },
];

export default function Navbar() {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  if(pathname?.startsWith("/admin")||pathname?.startsWith("/login"))return null;

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  return(
    <>
    <nav style={{ position:"fixed",top:0,width:"100%",zIndex:200,height:62,background:scrolled?"rgba(3,7,18,.9)":"rgba(3,7,18,.5)",backdropFilter:"blur(20px)",borderBottom:scrolled?"1px solid rgba(56,139,253,.1)":"1px solid transparent",transition:"all .3s",display:"flex",alignItems:"center",padding:"0 1.5rem",justifyContent:"space-between" }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:".55rem" }}>
        <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Cpu size={16} color="white" />
        </div>
        <span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.25rem",letterSpacing:".06em",background:"linear-gradient(135deg,#60a8ff,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
          AI-CLUB
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display:"flex",gap:"1.75rem",alignItems:"center" }} className="hidden md:flex">
        {navLinks.map(l=>(
          <Link key={l.href} href={l.href} style={{ color:pathname===l.href?"#f0f6fc":"#8b949e",fontSize:".875rem",fontWeight:500,textDecoration:"none",letterSpacing:".02em",transition:"color .2s",position:"relative",paddingBottom:2 }}>
            {l.label}
            {pathname===l.href&&<span style={{ position:"absolute",bottom:0,left:0,right:0,height:1.5,background:"linear-gradient(90deg,#3b8bfd,#6d28d9)",borderRadius:2 }} />}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display:"flex",alignItems:"center",gap:".65rem" }}>
        <Link href="/apply" className="hidden md:inline-flex">
          <button style={{ background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"#fff",border:"none",padding:".45rem 1.1rem",borderRadius:7,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".06em",display:"flex",alignItems:"center",gap:4 }}>
            Apply Now <ChevronRight size={13} />
          </button>
        </Link>
        <button onClick={()=>setOpen(!open)} className="md:hidden" style={{ background:"none",border:"none",color:"#f0f6fc",cursor:"pointer" }}>
          {open?<X size={22}/>:<Menu size={22}/>}
        </button>
      </div>
    </nav>

    {/* Mobile menu */}
    {open&&(
      <div style={{ position:"fixed",top:62,left:0,right:0,background:"rgba(6,14,28,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(56,139,253,.1)",padding:"1.25rem 1.5rem",zIndex:199,display:"flex",flexDirection:"column",gap:"1rem",animation:"fadeIn .2s ease" }}>
        {navLinks.map(l=>(
          <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} style={{ color:pathname===l.href?"#60a8ff":"#8b949e",fontSize:".95rem",fontWeight:500,textDecoration:"none" }}>{l.label}</Link>
        ))}
        <Link href="/apply" onClick={()=>setOpen(false)}>
          <button style={{ background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"#fff",border:"none",padding:".6rem 1.25rem",borderRadius:8,fontSize:".9rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",width:"100%",letterSpacing:".06em" }}>Apply Now</button>
        </Link>
      </div>
    )}
    </>
  );
}
