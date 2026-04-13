"use client";
export default function AdminSettingsPage() {
  return (
    <div>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Settings</h1>
        <p style={{ color:"#8b949e",fontSize:".875rem" }}>Admin panel configuration</p>
      </div>
      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"2rem",maxWidth:560 }}>
        <p style={{ color:"#8b949e",textAlign:"center",padding:"2rem" }}>Settings panel — configure your MongoDB URI, club name, and other settings in your <code style={{ background:"var(--bg2)",padding:".15rem .4rem",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:".82rem" }}>.env.local</code> file.</p>
      </div>
    </div>
  );
}
