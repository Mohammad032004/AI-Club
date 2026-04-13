import Link from "next/link";
import { Cpu, Globe, Mail, Code2 } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Code2, label: "GitHub", href: "#" },
    { icon: Globe, label: "LinkedIn", href: "#" },
    { icon: Mail, label: "Email", href: "mailto:aiclub@lpcps.org" },
  ];

  return (
    <footer style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",padding:"3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth:1200,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"2.5rem",marginBottom:"2.5rem" }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:".5rem",marginBottom:"1rem" }}>
              <div style={{ width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Cpu size={15} color="white"/>
              </div>
              <span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",letterSpacing:".06em",background:"linear-gradient(135deg,#60a8ff,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
                AI-CLUB
              </span>
            </div>
            <p style={{ color:"#8b949e",fontSize:".85rem",lineHeight:1.7,maxWidth:280,marginBottom:"1.25rem" }}>
              Premier AI/ML and Cybersecurity student community at LPCPS, Lucknow. Building the future with artificial intelligence.
            </p>
            <div style={{ display:"flex",gap:".6rem" }}>
              {socialLinks.map(s=>(
                <a key={s.label} href={s.href} title={s.label}
                  style={{ width:34,height:34,borderRadius:7,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#8b949e",textDecoration:"none",transition:"all .2s" }}>
                  <s.icon size={15}/>
                </a>
              ))}
            </div>
          </div>

          {[
            { title:"Navigation", links:[{href:"/",l:"Home"},{href:"/about",l:"About"},{href:"/events",l:"Events"},{href:"/projects",l:"Projects"}] },
            { title:"Resources", links:[{href:"/resources",l:"Resources"},{href:"/apply",l:"Apply Now"},{href:"/contact",l:"Contact"}] },
            { title:"Admin", links:[{href:"/login",l:"Admin Login"}] },
          ].map(col=>(
            <div key={col.title}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#60a8ff",letterSpacing:".1em",textTransform:"uppercase",marginBottom:".875rem" }}>
                {col.title}
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:".55rem" }}>
                {col.links.map(lk=>(
                  <Link key={lk.href} href={lk.href} style={{ color:"#8b949e",fontSize:".875rem",textDecoration:"none" }}>{lk.l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid var(--border2)",paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem" }}>
          <span style={{ color:"#6e7681",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace" }}>© 2025 AI-Club · LPCPS, Lucknow</span>
          <span style={{ color:"#6e7681",fontSize:".78rem" }}>Built by the community, for the community</span>
        </div>
      </div>
    </footer>
  );
}
