"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Check, RefreshCw, Mail, MailOpen } from "lucide-react";
import { messagesApi, type Message } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function AdminMessagesPage() {
  const [messages,setMessages]=useState<Message[]>([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<Message|null>(null);
  const [busyId,setBusyId]=useState<string|null>(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const {messages}=await messagesApi.list();setMessages(messages);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const markRead=async(id:string,read:boolean)=>{
    setBusyId(id);
    try{
      await messagesApi.markRead(id,read);
      setMessages(prev=>prev.map(m=>m._id===id?{...m,read}:m));
      if(selected?._id===id)setSelected(prev=>prev?{...prev,read}:null);
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  const del=async(id:string)=>{
    if(!confirm("Delete this message?"))return;
    setBusyId(id);
    try{await messagesApi.delete(id);setMessages(prev=>prev.filter(m=>m._id!==id));if(selected?._id===id)setSelected(null);toast.success("Deleted");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed");}
    finally{setBusyId(null);}
  };

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Messages</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem" }}>{messages.filter(m=>!m.read).length} unread messages</p>
        </div>
        <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
          <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/>Refresh
        </button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:selected?"1fr 1.2fr":"1fr",gap:"1.5rem",alignItems:"start" }}>
        <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
          {loading?(
            <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading...
            </div>
          ):messages.length===0?(
            <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
              <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>✉️</div>No messages
            </div>
          ):(
            messages.map(m=>(
              <div key={m._id} onClick={()=>{setSelected(selected?._id===m._id?null:m);if(!m.read)markRead(m._id,true);}}
                style={{ padding:".875rem 1.25rem",borderBottom:"1px solid rgba(59,139,253,.05)",cursor:"pointer",background:selected?._id===m._id?"rgba(59,139,253,.06)":m.read?"transparent":"rgba(59,139,253,.03)",transition:"background .15s",opacity:busyId===m._id?.5:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:".3rem" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:".5rem" }}>
                    {m.read?<MailOpen size={14} color="#6e7681"/>:<Mail size={14} color="#60a8ff"/>}
                    <span style={{ fontWeight:m.read?500:700,fontSize:".875rem",color:m.read?"#8b949e":"#f0f6fc" }}>{m.name}</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:".4rem" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#6e7681" }}>{new Date(m.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                    <button onClick={e=>{e.stopPropagation();del(m._id);}} style={{ background:"none",border:"none",color:"#6e7681",cursor:"pointer",padding:2,display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                  </div>
                </div>
                <div style={{ fontSize:".78rem",color:"#60a8ff",fontWeight:600,marginBottom:".2rem" }}>{m.subject}</div>
                <p style={{ fontSize:".78rem",color:"#8b949e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.message}</p>
              </div>
            ))
          )}
        </div>

        {selected&&(
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"1.5rem",position:"sticky",top:"1.5rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem" }}>
              <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.05rem" }}>{selected.subject}</h3>
              <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer",fontSize:"1.1rem" }}>✕</button>
            </div>
            {[{l:"From",v:selected.name},{l:"Email",v:selected.email},{l:"Date",v:new Date(selected.createdAt).toLocaleString("en-IN")}].map(r=>(
              <div key={r.l} style={{ marginBottom:".75rem" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".2rem" }}>{r.l}</div>
                <div style={{ fontSize:".875rem" }}>{r.v}</div>
              </div>
            ))}
            <div style={{ marginTop:"1rem" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".5rem" }}>Message</div>
              <p style={{ fontSize:".875rem",color:"#8b949e",lineHeight:1.7,background:"var(--bg2)",padding:"1rem",borderRadius:10,border:"1px solid var(--border2)" }}>{selected.message}</p>
            </div>
            <div style={{ display:"flex",gap:".65rem",marginTop:"1.25rem" }}>
              <button onClick={()=>markRead(selected._id,!selected.read)} style={{ flex:1,background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.25)",color:"#90c8ff",padding:".6rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                <Check size={14}/>{selected.read?"Mark Unread":"Mark Read"}
              </button>
              <button onClick={()=>del(selected._id)} style={{ flex:1,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",color:"#f87171",padding:".6rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>Delete</button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
