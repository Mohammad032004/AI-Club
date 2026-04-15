import Link from "next/link";
import { Cpu, Globe, Mail, Code2 } from "lucide-react";

export default function Footer() {
<<<<<<< HEAD
  return (
    <footer
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border2)",
        padding: "1.25rem 1rem 0.9rem",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginBottom: ".55rem" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "linear-gradient(135deg,#3b8bfd,#6d28d9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cpu size={13} color="white" />
              </div>
              <span
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontWeight: 700,
                  fontSize: ".95rem",
                  letterSpacing: ".05em",
                  background: "linear-gradient(135deg,#60a8ff,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI-CLUB
              </span>
            </div>

            <p
              style={{
                color: "#8b949e",
                fontSize: ".74rem",
                lineHeight: 1.45,
                maxWidth: 280,
                marginBottom: ".75rem",
              }}
            >
              Premier AI/ML and Cybersecurity student community at LPCPS, Lucknow.
            </p>

            <div style={{ display: "flex", gap: ".4rem" }}>
              {[
                { icon: Code2, label: "GitHub", href: "#" },
                { icon: Globe, label: "LinkedIn", href: "#" },
                { icon: Mail, label: "Email", href: "mailto:aiclub@lpcps.org" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid var(--border2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8b949e",
                    textDecoration: "none",
                  }}
                >
                  <s.icon size={13} />
=======
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
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
                </a>
              ))}
            </div>
          </div>

<<<<<<< HEAD
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: ".6rem",
                fontWeight: 600,
                color: "#60a8ff",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: ".5rem",
              }}
            >
              Navigation
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
              {[
                { href: "/", l: "Home" },
                { href: "/about", l: "About" },
                { href: "/events", l: "Events" },
                { href: "/projects", l: "Projects" },
                { href: "/resources", l: "Resources" },
                { href: "/contact", l: "Contact" },
              ].map((lk) => (
                <Link
                  key={lk.href}
                  href={lk.href}
                  style={{ color: "#8b949e", fontSize: ".78rem", textDecoration: "none", lineHeight: 1.2 }}
                >
                  {lk.l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: ".6rem",
                fontWeight: 600,
                color: "#60a8ff",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: ".5rem",
              }}
            >
              Community
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".25rem" }}>
              {[
                { href: "/apply", l: "Apply Now" },
                { href: "/about", l: "Meet the Team" },
                { href: "/contact", l: "Contact Us" },
              ].map((lk) => (
                <Link
                  key={lk.href}
                  href={lk.href}
                  style={{ color: "#8b949e", fontSize: ".78rem", textDecoration: "none", lineHeight: 1.2 }}
                >
                  {lk.l}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border2)",
            paddingTop: ".75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: ".35rem",
          }}
        >
          <span style={{ color: "#6e7681", fontSize: ".68rem", fontFamily: "'JetBrains Mono',monospace" }}>
            © 2025 AI-Club · LPCPS, Lucknow
          </span>
          <span style={{ color: "#6e7681", fontSize: ".68rem" }}>Built by the community, for the community</span>
=======
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
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
        </div>
      </div>
    </footer>
  );
}
