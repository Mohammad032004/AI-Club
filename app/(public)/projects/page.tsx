"use client";
import { useState, useEffect } from "react";
import { SectionHeader, Card, GradientButton, OutlineButton } from "@/components/ui";
import { ExternalLink, Search, RefreshCw } from "lucide-react";

interface Project { _id: string; title: string; description: string; category: string; tags?: string[]; github?: string; liveDemo?: string; builtBy?: string[]; year?: number; featured?: boolean; award?: string; visible?: boolean; }

const STATIC_PROJECTS: Project[] = [
  { _id:"s1", title:"MediScan AI", category:"Computer Vision", description:"CNN-based chest X-ray analyzer achieving 94% accuracy for pneumonia and TB detection.", tags:["PyTorch","FastAPI","React"], builtBy:["Aryan Kumar","Priya Sharma"], year:2025, featured:true, award:"🏆 Featured" },
  { _id:"s2", title:"Hindi Sentiment NLP", category:"NLP", description:"BERT fine-tuned on 100K Hindi social media posts. 91% F1 score, HuggingFace deployed.", tags:["HuggingFace","Python","Flask"], builtBy:["Sneha Rao"], year:2025 },
  { _id:"s3", title:"CyberShield Dashboard", category:"Cybersecurity", description:"Real-time network anomaly detection using LSTM. 96% precision on zero-day classification.", tags:["TensorFlow","Next.js","PostgreSQL"], builtBy:["Vikram Agarwal"], year:2024 },
];

const CATS = ["All", "Computer Vision", "NLP", "Cybersecurity", "Reinforcement Learning", "Deep Learning", "Web Development", "Data Science"];

export default function ProjectsPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDB, setFromDB] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // FIX #8: fetch visible projects from DB
        const r = await fetch("/api/projects", { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          if (d.projects && d.projects.length > 0) { setProjects(d.projects); setFromDB(true); }
          else setProjects(STATIC_PROJECTS);
        } else setProjects(STATIC_PROJECTS);
      } catch { setProjects(STATIC_PROJECTS); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = projects.filter(p =>
    (cat === "All" || p.category === cat) &&
    (`${p.title} ${p.description} ${p.tags?.join(" ") || ""}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <section style={{ padding: "8rem 1.5rem 5rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Projects" title={`${projects.length}+ Projects & Counting`} subtitle="From research prototypes to production systems — built entirely by our members."/>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {[[`${projects.length}+`, "Total Projects"], [projects.filter(p => p.liveDemo).length + "+", "Live Demos"], [projects.filter(p => p.award).length + "", "Award-Winning"]].map(([v, l]) => (
            <div key={l} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 12, padding: "1rem 1.75rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 800, fontSize: "1.5rem", background: "linear-gradient(135deg,#3b8bfd,#6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
              <div style={{ fontSize: ".72rem", color: "#8b949e", fontFamily: "'JetBrains Mono',monospace", marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
            </div>
          ))}
          {fromDB && <div style={{ background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 12, padding: "1rem 1.75rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: ".8rem", color: "#34d399" }}>✓ Live from Database</div>
            <div style={{ fontSize: ".68rem", color: "#8b949e", fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>Real-time sync active</div>
          </div>}
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 340 }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8b949e" }}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects, tech..." className="input-field" style={{ paddingLeft: 36 }}/>
          </div>
          <div style={{ display: "flex", gap: ".55rem", flexWrap: "wrap" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ background: cat === c ? "linear-gradient(135deg,#3b8bfd,#6d28d9)" : "rgba(255,255,255,.04)", border: "1px solid", borderColor: cat === c ? "transparent" : "var(--border2)", color: cat === c ? "white" : "#8b949e", padding: ".38rem .95rem", borderRadius: 100, fontSize: ".78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif" }}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ width: 30, height: 30, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
            Loading projects...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
            {filtered.map(p => (
              <Card key={p._id} style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".875rem" }}>
                  <span style={{ fontSize: ".68rem", fontWeight: 700, color: "#3b8bfd", background: "rgba(59,139,253,.1)", padding: ".15rem .55rem", borderRadius: 100, textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "'JetBrains Mono',monospace" }}>{p.category}</span>
                  {p.award && <span style={{ fontSize: ".7rem", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,.1)", padding: ".15rem .6rem", borderRadius: 100 }}>{p.award}</span>}
                </div>
                <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".6rem" }}>{p.title}</h3>
                <p style={{ color: "#8b949e", fontSize: ".875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{p.description}</p>
                {p.tags && <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {p.tags.map(t => <span key={t} style={{ background: "rgba(59,139,253,.08)", border: "1px solid rgba(59,139,253,.18)", color: "#90c8ff", fontSize: ".68rem", padding: ".18rem .55rem", borderRadius: 7, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>)}
                </div>}
                <div style={{ display: "flex", gap: ".6rem", marginBottom: "1.25rem" }}>
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.05)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".38rem .9rem", borderRadius: 8, fontSize: ".78rem", textDecoration: "none", fontFamily: "inherit" }}>⬡ GitHub</a>}
                  {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.05)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".38rem .9rem", borderRadius: 8, fontSize: ".78rem", textDecoration: "none", fontFamily: "inherit" }}><ExternalLink size={12}/> Live</a>}
                </div>
                {p.builtBy && <div style={{ borderTop: "1px solid var(--border2)", paddingTop: ".875rem", fontSize: ".75rem", color: "#6e7681", fontFamily: "'JetBrains Mono',monospace" }}>by {p.builtBy.join(", ")} {p.year && `· ${p.year}`}</div>}
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No projects match your search. Try different filters.</p>
          </div>
        )}

        <div style={{ marginTop: "4rem", textAlign: "center", background: "rgba(59,139,253,.06)", border: "1px solid rgba(59,139,253,.15)", borderRadius: 20, padding: "3rem 2rem" }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: ".75rem" }}>Built something cool?</h3>
          <p style={{ color: "#8b949e", marginBottom: "1.75rem", lineHeight: 1.7 }}>Members can submit projects to be featured on this page. Share your work with the community.</p>
          <GradientButton>Submit Your Project →</GradientButton>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
