"use client";
import { SectionHeader, Card } from "@/components/ui";

const teamHierarchy = [
  {
    level: "Faculty Head",
    members: [
      { name: "Dr. R. Verma", role: "Faculty Head", dept: "Computer Science & Engineering", course: "Ph.D. AI/ML", bio: "Guiding innovation with 15+ years of research experience in ML and AI systems.", grad: "linear-gradient(135deg,#3b82f6,#8b5cf6)" },
    ],
  },
  {
    level: "Leadership",
    members: [
      { name: "Aryan Kumar", role: "Club Head", dept: "CSE (AI/ML)", course: "B.Tech · 3rd Year", bio: "ML engineer passionate about building real-world AI systems. Won 3 national hackathons.", grad: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
      { name: "Priya Sharma", role: "Co-Head", dept: "Data Science", course: "B.Tech · 3rd Year", bio: "Data scientist specializing in NLP and large-scale model fine-tuning.", grad: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
    ],
  },
  {
    level: "Core Members",
    members: [
      { name: "Sneha Rao", role: "NLP Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "HuggingFace contributor. Specializes in multilingual NLP and low-resource language models.", grad: "linear-gradient(135deg,#10b981,#06b6d4)" },
      { name: "Vikram Agarwal", role: "Cybersecurity Lead", dept: "IT", course: "B.Tech · 3rd Year", bio: "CTF champion and security researcher. Focuses on adversarial ML and network security.", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
      { name: "Riya Mehta", role: "Events Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "Organizes workshops, hackathons, and speaker sessions. 500+ event attendees managed.", grad: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
      { name: "Kavya Pillai", role: "Design Lead", dept: "CSE", course: "B.Tech · 2nd Year", bio: "Full-stack developer and UI designer. Builds all club tools and web platforms.", grad: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ========================================
   ABOUT HERO (SIMPLE)
======================================== */}
      

<section className="section relative flex items-center justify-center min-h-[60vh] text-center overflow-hidden">

  {/* Soft background glow */}
  <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[120px] -top-32 left-1/2 -translate-x-1/2 rounded-full" />

  <div className="container relative z-10">

    {/* Small tag 
    <span className="badge mb-4 inline-block">
      About Us
    </span>*/}

    {/* Heading */}
    <h1 className="heading-xl text-[clamp(2.5rem,5vw,3.8rem)] mb-5">
      We are <span className="gradient-text">NexusAI</span>
    </h1>

    {/* Description */}
    <p className="text-[var(--text2)] max-w-xl mx-auto text-base leading-7">
      Founded in 2022, NexusAI is the premier AI student community on campus — 
      where research meets real-world impact.
    </p>

  </div>
</section>

      {/* ======================================== 
      Vision / Mission / Values 
      ========================================*/}
    
<section className="section">
  <div className="container">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {[
        {
          icon: "🎯",
          title: "Our Vision",
          text: "Leading student AI hub producing engineers and innovators."
        },
        {
          icon: "🚀",
          title: "Our Mission",
          text: "Democratizing AI through projects and mentorship."
        },
        {
          icon: "💡",
          title: "Our Values",
          text: "Open learning, collaboration, and curiosity."
        }
      ].map(v => (
        <div
          key={v.title}
          className="card p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--accent)]"
        >

          {/* Icon */}
          <div className="text-3xl mb-3">{v.icon}</div>

          {/* Title */}
          <h3 className="font-semibold text-base mb-2">
            {v.title}
          </h3>

          {/* Text */}
          <p className="text-[var(--text2)] text-sm leading-6">
            {v.text}
          </p>

        </div>
      ))}

    </div>

  </div>
</section>

      {/* What We Cover */}
      <section style={{ background: "#0a1525", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader tag="Domains" title="What We Cover" subtitle="Six core areas of focus — from foundational AI to competitive hacking." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
            {[
              { emoji: "🤖", label: "Machine Learning", desc: "Classical ML, regression, classification, clustering" },
              { emoji: "🧠", label: "Deep Learning", desc: "CNNs, RNNs, Transformers, GANs, Diffusion" },
              { emoji: "💬", label: "NLP & LLMs", desc: "BERT, GPT, RAG, fine-tuning, prompt engineering" },
              { emoji: "👁", label: "Computer Vision", desc: "Object detection, segmentation, pose estimation" },
              { emoji: "🔐", label: "Cybersecurity", desc: "CTF, pentesting, adversarial ML, network security" },
              { emoji: "⚡", label: "DevOps", desc: "Docker, FastAPI, cloud, CI/CD for ML" },
              { emoji: "🌐", label: "Web Development", desc: "Docker, FastAPI, cloud, CI/CD for ML" },
              { emoji: "📱", label: "App Development", desc: "Docker, FastAPI, cloud, CI/CD for ML" },
              { emoji: "⚙️", label: "System Design", desc: "Docker, FastAPI, cloud, CI/CD for ML" },
              { emoji: " IoT", label: "IOT", desc: "Docker, FastAPI, cloud, CI/CD for ML" },
            ].map(d => (
              <div key={d.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.5rem", transition: "border-color 0.3s" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{d.emoji}</div>
                <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{d.label}</h4>
                <p style={{ color: "#8ba3c7", fontSize: "0.8rem", lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Hierarchy */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader tag="The Team" title="Club Hierarchy" subtitle="From faculty guidance to core operations — meet the people who run NexusAI." />
        {teamHierarchy.map((tier) => (
          <div key={tier.level} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.85rem", borderRadius: 100 }}>{tier.level}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${tier.members.length === 1 ? "320px" : "260px"}, ${tier.members.length === 1 ? "420px" : "1fr"}))`, gap: "1.25rem", justifyContent: tier.members.length === 1 ? "center" : "start" }}>
              {tier.members.map(m => (
                <Card key={m.name} style={{ padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: m.grad, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "white", flexShrink: 0 }}>
                    {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>{m.name}</h4>
                    <div style={{ fontSize: "0.78rem", color: "#3b82f6", fontWeight: 600, marginBottom: "0.2rem" }}>{m.role}</div>
                    <div style={{ fontSize: "0.75rem", color: "#8ba3c7", marginBottom: "0.75rem" }}>{m.dept} · {m.course}</div>
                    <p style={{ color: "#8ba3c7", fontSize: "0.82rem", lineHeight: 1.65 }}>{m.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Club History Timeline */}
      <section style={{ background: "#0a1525", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SectionHeader tag="Our Journey" title="Club History" />
          {[
            { year: "2022", title: "NexusAI Founded", desc: "Started with 12 founding members and a single workshop on Python & ML basics." },
            { year: "2023", title: "First Hackathon Win", desc: "Won 1st place at State-level ML hackathon. Grew to 50+ active members." },
            { year: "2024", title: "Research & Scale", desc: "First research paper. Launched CyberSecurity track. Hosted 10+ events." },
            { year: "2025", title: "100+ Members & Growing", desc: "National hackathon 2nd place. LLM research pipeline. Batch 2025 applications now open." },
          ].map((t, i) => (
            <div key={t.year} style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "white", flexShrink: 0 }}>{t.year}</div>
                {i < 3 && <div style={{ width: 2, flex: 1, background: "rgba(59,130,246,0.2)", marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: "1.5rem" }}>
                <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "0.4rem" }}>{t.title}</h4>
                <p style={{ color: "#8ba3c7", fontSize: "0.875rem", lineHeight: 1.65 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
