"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, Calendar, FlaskConical, BookOpen, MessageSquare, Settings, LogOut, Cpu, Menu, X, UserCog, Bell } from "lucide-react";

const nav=[
  { href:"/admin/dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { href:"/admin/applications", icon:ClipboardList, label:"Applications" },
  { href:"/admin/members", icon:Users, label:"Members" },
  { href:"/admin/events", icon:Calendar, label:"Events" },
  { href:"/admin/projects", icon:FlaskConical, label:"Projects" },
  { href:"/admin/resources", icon:BookOpen, label:"Resources" },
  { href:"/admin/messages", icon:MessageSquare, label:"Messages" },
  { href:"/admin/team", icon:UserCog, label:"Team" },
  { href:"/admin/settings", icon:Settings, label:"Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname=usePathname();
  const router=useRouter();
  const [collapsed,setCollapsed]=useState(false);
  if(pathname==="/login"||pathname?.includes("/login"))return <>{children}</>;

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width:collapsed?64:220,minHeight:"100vh",background:"var(--bg2)",borderRight:"1px solid var(--border2)",display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:100,transition:"width .3s",overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ height:62,display:"flex",alignItems:"center",padding:collapsed?"0 1rem":"0 1.25rem",borderBottom:"1px solid var(--border2)",gap:".65rem",flexShrink:0 }}>
          <div style={{ width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Cpu size={15} color="white"/></div>
          {!collapsed&&<span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",letterSpacing:".06em",background:"linear-gradient(135deg,#60a8ff,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap" }}>AI-CLUB</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1,padding:".75rem 0",overflowY:"auto" }}>
          {nav.map(item=>{
            const active=pathname===item.href||pathname?.startsWith(item.href+"/");
            return (
              <Link key={item.href} href={item.href}
                style={{ display:"flex",alignItems:"center",gap:".7rem",padding:".6rem 1.1rem",margin:"1px .5rem",borderRadius:8,textDecoration:"none",color:active?"#f0f6fc":"#8b949e",background:active?"rgba(59,139,253,.12)":"transparent",border:active?"1px solid rgba(59,139,253,.2)":"1px solid transparent",transition:"all .2s",whiteSpace:"nowrap",overflow:"hidden" }}>
                <item.icon size={16} style={{ flexShrink:0,color:active?"#60a8ff":"undefined" }}/>
                {!collapsed&&<span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".88rem",letterSpacing:".03em" }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop:"1px solid var(--border2)",padding:".75rem .5rem",flexShrink:0 }}>
          <button onClick={()=>router.push("/login")}
            style={{ display:"flex",alignItems:"center",gap:".7rem",padding:".6rem 1rem",width:"100%",background:"none",border:"1px solid transparent",color:"#8b949e",cursor:"pointer",borderRadius:8,fontFamily:"inherit",transition:"all .2s",whiteSpace:"nowrap" }}>
            <LogOut size={16} style={{ flexShrink:0 }}/>{!collapsed&&<span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".88rem" }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1,marginLeft:collapsed?64:220,transition:"margin-left .3s",display:"flex",flexDirection:"column" }}>
        {/* Top bar */}
        <header style={{ height:62,background:"var(--bg2)",borderBottom:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.5rem",position:"sticky",top:0,zIndex:50 }}>
          <button onClick={()=>setCollapsed(!collapsed)} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer",display:"flex",alignItems:"center" }}>
            {collapsed?<Menu size={20}/>:<X size={20}/>}
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:"1rem" }}>
            <button style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer",position:"relative" }}>
              <Bell size={18}/>
              <span style={{ position:"absolute",top:-2,right:-2,width:7,height:7,background:"#f87171",borderRadius:"50%",border:"1.5px solid var(--bg2)" }}/>
            </button>
            <div style={{ display:"flex",alignItems:"center",gap:".6rem" }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".82rem",color:"white" }}>AD</div>
              {!collapsed&&<div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".88rem" }}>Admin</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#8b949e" }}>admin@aiclub.in</div>
              </div>}
            </div>
          </div>
        </header>
        <main style={{ flex:1,padding:"2rem",overflowY:"auto" }}>{children}</main>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
