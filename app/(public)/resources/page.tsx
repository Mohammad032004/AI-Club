"use client";
import { useState, useEffect } from "react";
import { SectionHeader, Card, GradientButton } from "@/components/ui";
import { FileText, Video, Link as LinkIcon, BookOpen, Download, Lock } from "lucide-react";

interface Resource { _id: string; title: string; description?: string; category: string; type: string; url?: string; fileSize?: string; access: "public" | "members"; downloads: number; createdAt: string; }

const TYPE_ICONS: Record<string, React.ComponentType<{size?: number; color?: string}>> = { pdf: FileText, video: Video, guide: LinkIcon, notebook: BookOpen, link: LinkIcon };
const CAT_LABELS: Record<string, string> = { ai_ml: "AI/ML", web_dev: "Web Dev", cybersecurity: "Cybersecurity", research: "Research", career: "Career" };
const CATS = ["All", "AI/ML", "Web Dev", "Cybersecurity", "Research", "Career"];

export default function ResourcesPage() {
  const [cat, setCat] = useState("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // FIX #9: fetch all resources from DB
        const r = await fetch("/api/resources?access=all", { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          setResources(d.resources || []);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = resources.filter(r => {
    if (cat === "All") return true;
    return CAT_LABELS[r.category] === cat;
  });

  const handleDownload = async (r: Resource) => {
    if (r.url) {
      window.open(r.url, "_blank");
      // increment download count
      await fetch(`/api/resources/${r._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ downloads: r.downloads + 1 }) }).catch(() => {});
    }
  };

  return (
    <>
      <section style={{ padding: "8rem 1.5rem 5rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Resources" title="Curated Learning Materials" subtitle="Handpicked resources from our team — notes, recordings, guides, and research papers."/>

        <div style={{ display: "flex", gap: ".65rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ background: cat === c ? "linear-gradient(135deg,#3b8bfd,#6d28d9)" : "rgba(255,255,255,.04)", border: "1px solid", borderColor: cat === c ? "transparent" : "var(--border2)", color: cat === c ? "white" : "#8b949e", padding: ".45rem 1.1rem", borderRadius: 100, fontSize: ".82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani',sans-serif" }}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ width: 28, height: 28, border: "2px solid rgba(59,139,253,.3)", borderTopColor: "#3b8bfd", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
            Loading resources...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8b949e" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📚</div>
            <p>{resources.length === 0 ? "No resources yet. Admins can add resources from the dashboard." : "No resources in this category."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.25rem" }}>
            {filtered.map(r => {
              const Icon = TYPE_ICONS[r.type] || FileText;
              const iconColors: Record<string, string> = { pdf: "#90c8ff", video: "#c4b5fd", guide: "#67e8f9", notebook: "#34d399", link: "#fbbf24" };
              const iconColor = iconColors[r.type] || "#90c8ff";
              return (
                <Card key={r._id} style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={iconColor}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".4rem" }}>
                      <h4 style={{ fontWeight: 700, fontSize: ".9rem", lineHeight: 1.4, flex: 1 }}>{r.title}</h4>
                      <span style={{ background: r.access === "public" ? "rgba(52,211,153,.1)" : "rgba(251,191,36,.1)", color: r.access === "public" ? "#34d399" : "#fbbf24", fontSize: ".63rem", fontWeight: 700, padding: ".12rem .45rem", borderRadius: 100, flexShrink: 0, marginLeft: 8, fontFamily: "'JetBrains Mono',monospace" }}>
                        {r.access === "public" ? "Free" : "Members"}
                      </span>
                    </div>
                    {r.description && <p style={{ color: "#8b949e", fontSize: ".82rem", lineHeight: 1.6, marginBottom: ".875rem" }}>{r.description}</p>}
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ background: "rgba(59,139,253,.1)", color: "#90c8ff", fontSize: ".65rem", fontWeight: 700, padding: ".12rem .45rem", borderRadius: 100, fontFamily: "'JetBrains Mono',monospace" }}>{CAT_LABELS[r.category] || r.category}</span>
                      <span style={{ color: "#8b949e", fontSize: ".72rem", fontFamily: "'JetBrains Mono',monospace" }}>{r.type.toUpperCase()}{r.fileSize ? ` · ${r.fileSize}` : ""}</span>
                      <div style={{ marginLeft: "auto" }}>
                        {r.url ? (
                          <button onClick={() => handleDownload(r)} style={{ background: "rgba(59,139,253,.1)", border: "1px solid rgba(59,139,253,.25)", color: "#90c8ff", padding: ".28rem .65rem", borderRadius: 7, fontSize: ".72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
                            <Download size={11}/> {r.type === "link" ? "Open" : "Download"}
                          </button>
                        ) : (
                          <span style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border2)", color: "#8b949e", padding: ".28rem .65rem", borderRadius: 7, fontSize: ".72rem", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'JetBrains Mono',monospace" }}>
                            <Lock size={11}/> No URL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "4rem", textAlign: "center", background: "rgba(109,40,217,.05)", border: "1px solid rgba(109,40,217,.15)", borderRadius: 20, padding: "3rem 2rem" }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: ".75rem" }}>Have a great resource to share?</h3>
          <p style={{ color: "#8b949e", marginBottom: "1.75rem", lineHeight: 1.7 }}>Core members can upload PDFs, guides, recordings, and links to this library.</p>
          <GradientButton>Upload Resource →</GradientButton>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
