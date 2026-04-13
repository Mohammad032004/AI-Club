"use client";
import { useState } from "react";
import { SectionHeader, Card, GradientButton, OutlineButton } from "@/components/ui";
import { ExternalLink, Search } from "lucide-react";

const projects = [
  { id: 1, title: "MediScan AI", category: "Computer Vision", desc: "CNN-based chest X-ray analyzer achieving 94% accuracy for pneumonia and TB detection using custom ResNet with attention.", tags: ["PyTorch", "FastAPI", "React", "Docker"], by: "Aryan Kumar, Priya Sharma", year: 2025, live: true, award: "🏆 Featured" },
  { id: 2, title: "Hindi Sentiment NLP", category: "NLP", desc: "BERT-based multi-class sentiment analyzer fine-tuned on 100K Hindi social media posts. 91% F1 score. Deployed on HuggingFace Spaces.", tags: ["HuggingFace", "Python", "Flask", "Gradio"], by: "Sneha Rao", year: 2025, live: true, award: null },
  { id: 3, title: "CyberShield Dashboard", category: "Cybersecurity", desc: "Real-time network anomaly detection using LSTM trained on CICIDS2017. 96% precision on zero-day attack classification.", tags: ["TensorFlow", "Next.js", "PostgreSQL", "D3.js"], by: "Vikram Agarwal", year: 2024, live: true, award: null },
  { id: 4, title: "RL Trading Agent", category: "Reinforcement Learning", desc: "PPO-based autonomous trading agent trained on NSE data. Outperforms buy-and-hold by 23% in 5-year backtesting.", tags: ["Stable-Baselines3", "OpenAI Gym", "Pandas", "Plotly"], by: "Riya Mehta", year: 2024, live: false, award: null },
  { id: 5, title: "Sign Language Interpreter", category: "Computer Vision", desc: "Real-time Indian Sign Language recognition using MediaPipe keypoints + custom CNN classifier. 89% accuracy. Won 2nd at MLHack 2024.", tags: ["MediaPipe", "OpenCV", "Streamlit", "TensorFlow"], by: "Team of 4", year: 2024, live: true, award: "🥈 2nd Place MLHack" },
  { id: 6, title: "Campus RAG Bot", category: "NLP", desc: "LangChain + Mistral-powered RAG chatbot over all college docs, notices, and timetables. <2s response time.", tags: ["LangChain", "Mistral", "ChromaDB", "Next.js"], by: "Kavya Pillai", year: 2025, live: true, award: null },
  { id: 7, title: "DeepFake Detector", category: "Computer Vision", desc: "EfficientNet-based deepfake detection with 96.4% accuracy. Trained on FaceForensics++ dataset.", tags: ["EfficientNet", "PyTorch", "Gradio"], by: "Aryan Kumar", year: 2025, live: true, award: null },
  { id: 8, title: "Crop Disease Detector", category: "Computer Vision", desc: "Mobile-friendly CNN to detect 38 crop diseases from leaf images. Built for farmers with an offline-capable PWA.", tags: ["TensorFlow Lite", "React PWA", "Python"], by: "Team NLP & CV", year: 2024, live: true, award: "🌾 Social Impact" },
  { id: 9, title: "AI Code Reviewer", category: "NLP", desc: "LLM-powered GitHub Actions bot that reviews PRs for bugs, security issues, and code quality using structured prompting.", tags: ["OpenAI API", "GitHub Actions", "Node.js"], by: "Sneha Rao, Kavya Pillai", year: 2025, live: false, award: null },
];

const categories = ["All", "Computer Vision", "NLP", "Cybersecurity", "Reinforcement Learning"];

export default function ProjectsPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = projects.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <>
      <section style={{ padding: "8rem 2rem 5rem", maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="Projects" title="50+ Projects & Counting" subtitle="From research prototypes to production systems — built entirely by our members." />

        {/* Stats */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {[["50+", "Total Projects"], ["15+", "Live Deployments"], ["5", "Award-Winning"], ["2025", "Latest Batch"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1rem 1.75rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.5rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
              <div style={{ fontSize: "0.72rem", color: "#8ba3c7", fontWeight: 600, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 340 }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8ba3c7" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects, tech, descriptions..." className="input-field" style={{ paddingLeft: 36 }} />
          </div>
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ background: cat === c ? "linear-gradient(135deg,#3b82f6,#8b5cf6)" : "rgba(255,255,255,0.04)", border: "1px solid", borderColor: cat === c ? "transparent" : "rgba(255,255,255,0.1)", color: cat === c ? "white" : "#8ba3c7", padding: "0.4rem 1rem", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
          {filtered.map(p => (
            <Card key={p.id} style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "0.15rem 0.55rem", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.category}</span>
                </div>
                {p.award && <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fbbf24", background: "rgba(245,158,11,0.1)", padding: "0.15rem 0.6rem", borderRadius: 100 }}>{p.award}</span>}
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.65rem" }}>{p.title}</h3>
              <p style={{ color: "#8ba3c7", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {p.tags.map(t => (<span key={t} style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", color: "#93c5fd", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: 7, fontWeight: 600 }}>{t}</span>))}
              </div>
              <div style={{ display: "flex", gap: "0.65rem", marginBottom: "1.25rem" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8ba3c7", padding: "0.4rem 0.9rem", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                  ⬡ GitHub
                </button>
                {p.live && (
                  <button style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8ba3c7", padding: "0.4rem 0.9rem", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>
                    <ExternalLink size={13} /> Live Demo
                  </button>
                )}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#8ba3c7" }}>
                <span>👤 {p.by}</span>
                <span>{p.year}</span>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8ba3c7" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No projects match your search. Try different keywords or filters.</p>
          </div>
        )}

        {/* Submit CTA */}
        <div style={{ marginTop: "4rem", textAlign: "center", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 20, padding: "3rem 2rem" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "0.75rem" }}>Built something cool?</h3>
          <p style={{ color: "#8ba3c7", marginBottom: "1.75rem", lineHeight: 1.7 }}>Members can submit projects to be featured on this page. Share your work with the community.</p>
          <GradientButton>Submit Your Project →</GradientButton>
        </div>
      </section>
    </>
  );
}
