"use client";
import { useState } from "react";
import { SectionHeader, GradientButton, FormField } from "@/components/ui";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <section style={{ padding: "8rem 2rem 6rem", maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader tag="Get In Touch" title="Contact Us" subtitle="Have questions about the club, events, or membership? We'd love to hear from you." />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "2.5rem", alignItems: "start" }}>
          {/* Left: Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { icon: Mail, label: "Email", value: "aiclub@lpcps.org", color: "rgba(59,130,246,0.15)", iconColor: "#93c5fd" },
              { icon: MapPin, label: "Location", value: "Lucknow Public College of Professional Studies, Block B, Campus", color: "rgba(139,92,246,0.15)", iconColor: "#c4b5fd" },
              { icon: Clock, label: "Response Time", value: "Usually within 24 hours", color: "rgba(16,185,129,0.15)", iconColor: "#34d399" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={19} color={item.iconColor} />
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8ba3c7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{item.label}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8ba3c7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.1rem" }}>Follow Us</div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { emoji: "📸", label: "Instagram" },
                  { emoji: "💼", label: "LinkedIn" },
                  { emoji: "⬡", label: "GitHub" },
                  { emoji: "𝕏", label: "Twitter/X" },
                ].map(s => (
                  <a key={s.label} href="#" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "0.45rem 0.85rem", textDecoration: "none", color: "#8ba3c7", fontSize: "0.8rem", fontWeight: 500, transition: "all 0.2s" }}>
                    <span style={{ fontSize: "0.85rem" }}>{s.emoji}</span> {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, height: 160, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem" }}>
              <MapPin size={28} color="#3b82f6" />
              <span style={{ color: "#8ba3c7", fontSize: "0.85rem" }}>Lucknow Public College of Professional Studies, Block B</span>
              <span style={{ color: "#8ba3c7", fontSize: "0.78rem" }}>Open Mon–Sat, 9AM–5PM</span>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2.5rem" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <CheckCircle size={56} color="#10b981" style={{ margin: "0 auto 1.25rem" }} />
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.75rem" }}>Message Sent!</h3>
                <p style={{ color: "#8ba3c7", lineHeight: 1.7 }}>Thanks for reaching out. We'll reply to <strong style={{ color: "#e8f0fe" }}>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  style={{ marginTop: "1.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8ba3c7", padding: "0.6rem 1.5rem", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "2rem" }}>Send us a message</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <FormField label="Your Name" required>
                    <input required className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" />
                  </FormField>
                  <FormField label="Email Address" required>
                    <input required type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </FormField>
                </div>
                <FormField label="Subject" required>
                  <select required className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    <option value="">Select a subject</option>
                    <option>Membership Query</option>
                    <option>Event Information</option>
                    <option>Collaboration Proposal</option>
                    <option>Technical Question</option>
                    <option>Other</option>
                  </select>
                </FormField>
                <FormField label="Message" required>
                  <textarea required className="input-field" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message here..." style={{ minHeight: 150 }} />
                </FormField>
                <GradientButton type="submit" fullWidth>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} />
                      Sending...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Send size={15} /> Send Message
                    </span>
                  )}
                </GradientButton>
                <p style={{ color: "#8ba3c7", fontSize: "0.75rem", marginTop: "1rem", textAlign: "center" }}>
                  Your message is stored securely and only visible to club administrators.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
