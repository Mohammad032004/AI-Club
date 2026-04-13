"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Users, X, RefreshCw, Calendar, MapPin } from "lucide-react";
import { eventsApi, type ClubEvent } from "@/lib/api";
import { toast } from "@/lib/toast";
import { StatusPill } from "@/components/ui";

function EventModal({ event, onClose, onSave }: { event?:ClubEvent|null; onClose:()=>void; onSave:(data:Partial<ClubEvent>,id?:string)=>Promise<void> }) {
  const [form,setForm]=useState({
    title:event?.title||"", type:event?.type||"workshop",
    description:event?.description||"", date:event?.date?.slice(0,10)||"",
    location:event?.location||"", maxAttendees:event?.maxAttendees?.toString()||"",
    status:event?.status||"upcoming", registrationOpen:event?.registrationOpen??true,
    tags:event?.tags?.join(", ")||"",
  });
  const [saving,setSaving]=useState(false);
  const [errs,setErrs]=useState<Record<string,string>>({});

  const validate=()=>{
    const e:Record<string,string>={};
    if(!form.title.trim()) e.title="Title is required";
    if(!form.type) e.type="Type is required";
    setErrs(e);
    return Object.keys(e).length===0;
  };

  const handleSave=async()=>{
    if(!validate()) return;
    setSaving(true);
    try{
      const tagsArr=form.tags?form.tags.split(",").map(t=>t.trim()).filter(Boolean):[];
      await onSave({...form,tags:tagsArr,maxAttendees:form.maxAttendees?parseInt(form.maxAttendees):undefined},event?._id);
      onClose();
    }catch{}
    finally{setSaving(false);}
  };

  const F=({k,l,t="text",span=false,opts}:{k:keyof typeof form;l:string;t?:string;span?:boolean;opts?:string[]})=>(
    <div style={{ gridColumn:span?"1/-1":undefined,marginBottom:"1rem" }}>
      <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>{l}</label>
      {opts?(
        <select value={form[k] as string} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
          style={{ width:"100%",background:"var(--bg2)",border:`1px solid ${errs[k]?"#f87171":"var(--border2)"}`,color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none" }}>
          {opts.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
        </select>
      ):(
        <input type={t} value={form[k] as string} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
          style={{ width:"100%",background:"var(--bg2)",border:`1px solid ${errs[k]?"#f87171":"var(--border2)"}`,color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box" }}/>
      )}
      {errs[k]&&<span style={{ color:"#f87171",fontSize:".7rem",fontFamily:"'JetBrains Mono',monospace" }}>{errs[k]}</span>}
    </div>
  );

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem" }}>{event?"Edit Event":"Create New Event"}</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#8b949e",cursor:"pointer" }}><X size={18}/></button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
          <F k="title" l="Title *" span/>
          <F k="date" l="Date" t="date"/>
          <F k="location" l="Location"/>
          <F k="maxAttendees" l="Max Attendees" t="number"/>
          <F k="type" l="Type *" opts={["workshop","hackathon","talk","meetup","competition"]}/>
          <F k="status" l="Status" opts={["upcoming","ongoing","past","cancelled"]}/>
          <F k="tags" l="Tags (comma-separated)" span/>
        </div>
        <div style={{ marginBottom:"1.25rem" }}>
          <label style={{ display:"block",fontFamily:"'JetBrains Mono',monospace",fontSize:".66rem",fontWeight:600,color:"#8b949e",letterSpacing:".07em",textTransform:"uppercase",marginBottom:".4rem" }}>Description</label>
          <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3}
            style={{ width:"100%",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text1)",padding:".65rem 1rem",borderRadius:8,fontSize:".875rem",fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.25rem" }}>
          <input type="checkbox" id="regOpen" checked={form.registrationOpen} onChange={e=>setForm(p=>({...p,registrationOpen:e.target.checked}))} style={{ width:16,height:16,accentColor:"#3b8bfd" }}/>
          <label htmlFor="regOpen" style={{ fontSize:".875rem",color:"#8b949e",cursor:"pointer" }}>Registration Open</label>
        </div>
        <div style={{ display:"flex",gap:".75rem" }}>
          <button onClick={onClose} style={{ flex:1,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".7rem",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex:2,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",color:"white",border:"none",padding:".7rem",borderRadius:8,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
            {saving?<><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite" }}/>Saving...</>:(event?"Save Changes":"Create Event")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events,setEvents]=useState<ClubEvent[]>([]);
  const [loading,setLoading]=useState(true);
  const [editTarget,setEditTarget]=useState<ClubEvent|null|undefined>(undefined);
  const [busyId,setBusyId]=useState<string|null>(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const {events}=await eventsApi.list();setEvents(events);}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Failed to load");}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{load();},[load]);

  const handleSave=async(data:Partial<ClubEvent>,id?:string)=>{
    try{
      if(id){
        const {event}=await eventsApi.update(id,data);
        setEvents(prev=>prev.map(e=>e._id===id?event:e));
        toast.success("Event updated");
      }else{
        await eventsApi.create(data);
        toast.success("Event created");
        await load(); // reload to show new event with proper _id
      }
    }catch(e:unknown){toast.error(e instanceof Error?e.message:"Save failed");throw e;}
  };

  const handleDelete=async(id:string,title:string)=>{
    if(!confirm(`Delete "${title}"?`))return;
    setBusyId(id);
    try{await eventsApi.delete(id);setEvents(prev=>prev.filter(e=>e._id!==id));toast.success("Deleted");}
    catch(e:unknown){toast.error(e instanceof Error?e.message:"Delete failed");}
    finally{setBusyId(null);}
  };

  return(
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.75rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.75rem",marginBottom:".25rem" }}>Events</h1>
          <p style={{ color:"#8b949e",fontSize:".875rem" }}>{events.length} total events in database</p>
        </div>
        <div style={{ display:"flex",gap:".65rem" }}>
          <button onClick={load} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".48rem .9rem",borderRadius:8,fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
            <RefreshCw size={13} style={{ animation:loading?"spin 1s linear infinite":"none" }}/>Refresh
          </button>
          <button onClick={()=>setEditTarget(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#3b8bfd,#6d28d9)",border:"none",color:"white",padding:".48rem 1rem",borderRadius:8,fontSize:".82rem",fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".04em" }}>
            <Plus size={13}/> Create Event
          </button>
        </div>
      </div>

      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden" }}>
        {loading?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ width:26,height:26,border:"2px solid rgba(59,139,253,.3)",borderTopColor:"#3b8bfd",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 1rem" }}/>Loading events...
          </div>
        ):events.length===0?(
          <div style={{ padding:"3rem",textAlign:"center",color:"#8b949e" }}>
            <div style={{ fontSize:"2.5rem",marginBottom:".75rem" }}>📅</div>
            <p>No events yet. Create your first event!</p>
          </div>
        ):(
          <table className="tbl">
            <thead>
              <tr>{["Event","Type","Date","Location","Status","Reg.","Actions"].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {events.map(e=>(
                <tr key={e._id} style={{ opacity:busyId===e._id ? 0.5:1,transition:"opacity .2s" }}>
                  <td style={{ fontWeight:600,color:"#f0f6fc",maxWidth:200 }}>
                    <div>{e.title}</div>
                    {e.description&&<div style={{ fontSize:".75rem",color:"#8b949e",marginTop:.2*16+"px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200 }}>{e.description}</div>}
                  </td>
                  <td><span style={{ background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{e.type}</span></td>
                  <td style={{ color:"#8b949e",fontSize:".82rem" }}>
                    {e.date?<div style={{ display:"flex",alignItems:"center",gap:4 }}><Calendar size={12}/>{new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>:"—"}
                  </td>
                  <td style={{ color:"#8b949e",fontSize:".82rem",maxWidth:140 }}>
                    {e.location?<div style={{ display:"flex",alignItems:"center",gap:4 }}><MapPin size={12}/>{e.location}</div>:"—"}
                  </td>
                  <td><StatusPill status={e.status}/></td>
                  <td><span style={{ background:e.registrationOpen?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)",color:e.registrationOpen?"#34d399":"#f87171",fontSize:".68rem",fontWeight:700,padding:".18rem .55rem",borderRadius:100,fontFamily:"'JetBrains Mono',monospace" }}>{e.registrationOpen?"Open":"Closed"}</span></td>
                  <td>
                    <div style={{ display:"flex",gap:4 }}>
                      <button onClick={()=>setEditTarget(e)} title="Edit" style={{ background:"rgba(59,139,253,.08)",border:"1px solid rgba(59,139,253,.2)",color:"#90c8ff",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Edit size={12}/></button>
                      <button title="Attendees" style={{ background:"rgba(255,255,255,.04)",border:"1px solid var(--border2)",color:"#8b949e",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Users size={12}/></button>
                      <button onClick={()=>handleDelete(e._id,e.title)} disabled={busyId===e._id} title="Delete" style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"#f87171",padding:".3rem .55rem",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editTarget!==undefined&&<EventModal event={editTarget} onClose={()=>setEditTarget(undefined)} onSave={handleSave}/>}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
