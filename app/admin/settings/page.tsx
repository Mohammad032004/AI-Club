"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, Trash2, Edit, RefreshCw, X, Shield, Key, Mail, Users } from "lucide-react";
import { toast } from "@/lib/toast";

interface AdminUser { _id: string; name: string; email: string; role: string; createdAt: string; }

function Tab({ label, active, onClick, icon: Icon }: { label: string; active: boolean; onClick: () => void; icon: React.ComponentType<{size?: number}> }) {
  return (
    <button onClick={onClick} style={{ display:"flex",alignItems:"center",gap:".5rem",padding:".65rem 1.25rem",borderRadius:8,border:`1px solid ${active?"rgba(59,139,253,.3)":"var(--border2)"}`,background:active?"rgba(59,139,253,.12)":"transparent",color:active?"#60a8ff":"#8b949e",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".88rem",cursor:"pointer",letterSpacing:".03em",transition:"all .2s" }}>
      <Icon size={15}/>{label}
    </button>
  );
}

function PasswordField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom:"1rem" }}>
      <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"••••••••"}
          style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".7rem 2.5rem .7rem 1rem",borderRadius:8,fontSize:".9rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
        <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#8b949e",cursor:"pointer",display:"flex" }}>
          {show?<EyeOff size={15}/>:<Eye size={15}/>}
        </button>
      </div>
    </div>
  );
}

function UserModal({ user, onClose, onSave }: { user?: AdminUser | null; onClose: () => void; onSave: (data: Record<string, string>, id?: string) => Promise<void> }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", role: user?.role || "member", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    if (!user && !form.newPassword) { toast.error("Password required for new user"); return; }
    setSaving(true);
    try { await onSave(form, user?._id); onClose(); }
    catch {} finally { setSaving(false); }
  };
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>{user ? "Edit User" : "Create User"}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={18}/></button>
        </div>
        {[{k:"name",l:"Full Name"},{k:"email",l:"Email Address"}].map(f=>(
          <div key={f.k} style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{f.l}</label>
            <input value={(form as Record<string,string>)[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
              style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".7rem 1rem",borderRadius:8,fontSize:".9rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
          </div>
        ))}
        <div style={{ marginBottom:"1rem" }}>
          <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Role</label>
          <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
            style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".7rem 1rem",borderRadius:8,fontSize:".9rem",fontFamily:"inherit",outline:"none" }}>
            <option value="admin">Admin (Full Access)</option>
            <option value="core">Core Member (Limited)</option>
            <option value="member">Member (View Only)</option>
          </select>
        </div>
        <PasswordField label={user ? "New Password (leave blank to keep)" : "Password *"} value={form.newPassword} onChange={v=>setForm(p=>({...p,newPassword:v}))}/>
        <div style={{ display:"flex",gap:".75rem",marginTop:"1.25rem" }}>
          <button onClick={onClose} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".7rem",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex:2,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".7rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em" }}>
            {saving ? "Saving..." : (user ? "Save Changes" : "Create User")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"password"|"email"|"users">("password");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null | undefined>(undefined);

  // Password change state
  const [pw, setPw] = useState({ email: "", current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  // Email change state
  const [em, setEm] = useState({ currentEmail: "", newEmail: "", password: "" });
  const [emLoading, setEmLoading] = useState(false);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const r = await fetch("/api/users");
      const d = await r.json();
      setUsers(d.users || []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoadingUsers(false); }
  };

  useEffect(() => { if (tab === "users") loadUsers(); }, [tab]);

  const handlePasswordChange = async () => {
    if (!pw.email || !pw.current || !pw.newPw) { toast.error("All fields required"); return; }
    if (pw.newPw !== pw.confirm) { toast.error("Passwords do not match"); return; }
    if (pw.newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setPwLoading(true);
    try {
      const r = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pw.email, currentPassword: pw.current, newPassword: pw.newPw }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success("Password changed successfully");
      setPw({ email: "", current: "", newPw: "", confirm: "" });
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setPwLoading(false); }
  };

  const handleEmailChange = async () => {
    if (!em.currentEmail || !em.newEmail || !em.password) { toast.error("All fields required"); return; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(em.newEmail)) { toast.error("Invalid email format"); return; }
    setEmLoading(true);
    try {
      const r = await fetch("/api/auth/change-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(em) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success("Email updated successfully");
      setEm({ currentEmail: "", newEmail: "", password: "" });
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setEmLoading(false); }
  };

  const handleUserSave = async (data: Record<string, string>, id?: string) => {
    try {
      const url = id ? `/api/users/${id}` : "/api/users";
      const method = id ? "PATCH" : "POST";
      const body = id ? { ...data, ...(data.newPassword ? { newPassword: data.newPassword } : {}) } : { name: data.name, email: data.email, role: data.role, password: data.newPassword };
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success(id ? "User updated" : "User created");
      await loadUsers();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); throw e; }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success("User deleted");
    } catch { toast.error("Failed"); }
  };

  const ROLE_COLORS: Record<string, string> = { admin: "#f87171", core: "#60a8ff", member: "#34d399" };

=======
export default function AdminSettingsPage() {
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
  return (
    <div>
      <div style={{ marginBottom:"1.75rem" }}>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Settings</h1>
<<<<<<< HEAD
        <p style={{ color:"#8b949e",fontSize:".875rem" }}>Manage account security and user access</p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:".65rem",marginBottom:"2rem",flexWrap:"wrap" }}>
        <Tab label="Change Password" active={tab==="password"} onClick={()=>setTab("password")} icon={Key}/>
        <Tab label="Change Email" active={tab==="email"} onClick={()=>setTab("email")} icon={Mail}/>
        <Tab label="User Management" active={tab==="users"} onClick={()=>setTab("users")} icon={Users}/>
      </div>

      {/* Change Password */}
      {tab === "password" && (
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"2rem",maxWidth:480 }}>
          <div style={{ display:"flex",alignItems:"center",gap:".65rem",marginBottom:"1.5rem" }}>
            <div style={{ width:38,height:38,borderRadius:10,background:"rgba(59,139,253,.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><Key size={18} color="#60a8ff"/></div>
            <div>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem" }}>Change Password</h3>
              <p style={{ color:"#8b949e",fontSize:".78rem" }}>Securely update your admin password</p>
            </div>
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Your Email</label>
            <input type="email" value={pw.email} onChange={e=>setPw(p=>({...p,email:e.target.value}))} placeholder="admin@aiclub.in"
              style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".7rem 1rem",borderRadius:8,fontSize:".9rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
          </div>
          <PasswordField label="Current Password" value={pw.current} onChange={v=>setPw(p=>({...p,current:v}))}/>
          <PasswordField label="New Password" value={pw.newPw} onChange={v=>setPw(p=>({...p,newPw:v}))} placeholder="Min 8 characters"/>
          <PasswordField label="Confirm New Password" value={pw.confirm} onChange={v=>setPw(p=>({...p,confirm:v}))}/>
          {pw.newPw && pw.confirm && pw.newPw !== pw.confirm && (
            <p style={{ color:"#f87171",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace",marginBottom:".75rem" }}>✗ Passwords do not match</p>
          )}
          <button onClick={handlePasswordChange} disabled={pwLoading}
            style={{ width:"100%",background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".75rem",borderRadius:8,fontWeight:700,cursor:pwLoading?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em",marginTop:".5rem",opacity:pwLoading?.7:1 }}>
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      )}

      {/* Change Email */}
      {tab === "email" && (
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"2rem",maxWidth:480 }}>
          <div style={{ display:"flex",alignItems:"center",gap:".65rem",marginBottom:"1.5rem" }}>
            <div style={{ width:38,height:38,borderRadius:10,background:"rgba(52,211,153,.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><Mail size={18} color="#34d399"/></div>
            <div>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem" }}>Change Email</h3>
              <p style={{ color:"#8b949e",fontSize:".78rem" }}>Update your login email address</p>
            </div>
          </div>
          {[{k:"currentEmail",l:"Current Email",t:"email"},{k:"newEmail",l:"New Email Address",t:"email"}].map(f=>(
            <div key={f.k} style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{f.l}</label>
              <input type={f.t} value={(em as Record<string,string>)[f.k]} onChange={e=>setEm(p=>({...p,[f.k]:e.target.value}))}
                style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".7rem 1rem",borderRadius:8,fontSize:".9rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
            </div>
          ))}
          <PasswordField label="Confirm with Password" value={em.password} onChange={v=>setEm(p=>({...p,password:v}))}/>
          <button onClick={handleEmailChange} disabled={emLoading}
            style={{ width:"100%",background:"linear-gradient(135deg,#34d399,#22d3ee)",color:"#030712",border:"none",padding:".75rem",borderRadius:8,fontWeight:700,cursor:emLoading?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em",marginTop:".5rem",opacity:emLoading?.7:1 }}>
            {emLoading ? "Updating..." : "Update Email"}
          </button>
        </div>
      )}

      {/* User Management */}
      {tab === "users" && (
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem",flexWrap:"wrap",gap:".75rem" }}>
            <div>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.1rem",marginBottom:".2rem" }}>Admin Users</h3>
              <p style={{ color:"#8b949e",fontSize:".82rem" }}>Manage who has access to this panel</p>
            </div>
            <div style={{ display:"flex",gap:".65rem" }}>
              <button onClick={loadUsers} style={{ display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".45rem .85rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                <RefreshCw size={13} style={{ animation:loadingUsers?"spin 1s linear infinite":"none" }}/>
              </button>
              <button onClick={()=>setEditUser(null)} style={{ display:"flex",alignItems:"center",gap:5,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".45rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>
                <Plus size={13}/> Add User
              </button>
            </div>
          </div>

          {/* Role Guide */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".75rem",marginBottom:"1.5rem" }}>
            {[{role:"admin",label:"Admin",desc:"Full access to all features",color:"#f87171"},{role:"core",label:"Core Member",desc:"Can manage content, limited settings",color:"#60a8ff"},{role:"member",label:"Member",desc:"View-only access",color:"#34d399"}].map(r=>(
              <div key={r.role} style={{ background:"var(--surface)",border:`1px solid ${r.color}22`,borderRadius:10,padding:"1rem" }}>
                <div style={{ display:"flex",alignItems:"center",gap:".5rem",marginBottom:".4rem" }}>
                  <Shield size={14} color={r.color}/>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".9rem",color:r.color }}>{r.label}</span>
                </div>
                <p style={{ color:"#8b949e",fontSize:".75rem",lineHeight:1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
            {loadingUsers ? (
              <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
                <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
                <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>👤</div>
                <p>No users found. Create the first admin account.</p>
              </div>
            ) : (
              <table className="tbl">
                <thead><tr>{["User","Role","Created","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u._id}>
                      <td>
                        <div style={{ fontWeight:600,fontSize:".875rem" }}>{u.name}</div>
                        <div style={{ fontSize:".72rem",color:"#8b949e",fontFamily:"'JetBrains Mono',monospace" }}>{u.email}</div>
                      </td>
                      <td>
                        <span style={{ background:`${ROLE_COLORS[u.role]||"#8b949e"}18`,color:ROLE_COLORS[u.role]||"#8b949e",fontSize:".7rem",fontWeight:700,padding:".2rem .6rem",borderRadius:100,fontFamily:"'Rajdhani',sans-serif",textTransform:"capitalize",letterSpacing:".04em" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color:"#8b949e",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                      </td>
                      <td>
                        <div style={{ display:"flex",gap:4 }}>
                          <button onClick={()=>setEditUser(u)} style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Edit size={12}/></button>
                          <button onClick={()=>deleteUser(u._id,u.name)} style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {editUser !== undefined && (
        <UserModal user={editUser} onClose={()=>setEditUser(undefined)} onSave={handleUserSave}/>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
=======
        <p style={{ color:"#8b949e",fontSize:".875rem" }}>Admin panel configuration</p>
      </div>
      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,padding:"2rem",maxWidth:560 }}>
        <p style={{ color:"#8b949e",textAlign:"center",padding:"2rem" }}>Settings panel — configure your MongoDB URI, club name, and other settings in your <code style={{ background:"var(--bg2)",padding:".15rem .4rem",borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:".82rem" }}>.env.local</code> file.</p>
      </div>
>>>>>>> 6ec63e697d3821c7ed1947ee75986b4eeeda0b9f
    </div>
  );
}
