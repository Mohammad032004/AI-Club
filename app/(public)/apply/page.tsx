"use client";
import { useState } from "react";
import { GradientButton, OutlineButton, FormField } from "@/components/ui";
import { CheckCircle, User, BookOpen, Code, FileText, ArrowRight, ArrowLeft } from "lucide-react";

const steps=[
  {label:"Personal",icon:User},
  {label:"Academics",icon:BookOpen},
  {label:"Skills",icon:Code},
  {label:"Statement",icon:FileText},
];
type FormData={
  firstName:string;lastName:string;email:string;phone:string;gender:string;linkedIn:string;github:string;
  college:string;branch:string;year:string;cgpa:string;certifications:string;
  skills:string[];domains:string[];experience:string;projectDesc:string;
  whyJoin:string;contribution:string;goals:string;
};
const SKILLS=["Python","JavaScript","TypeScript","C++","Java","R","SQL","TensorFlow","PyTorch","Scikit-learn","HuggingFace","LangChain","React","Next.js","Node.js","Docker","Git","Linux"];
const DOMAINS=["Machine Learning","Deep Learning","NLP & LLMs","Computer Vision","Reinforcement Learning","Cybersecurity","Web Development","Data Science","MLOps"];

export default function ApplyPage() {
  const [step,setStep]=useState(0);
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [form,setForm]=useState<FormData>({
    firstName:"",lastName:"",email:"",phone:"",gender:"",linkedIn:"",github:"",
    college:"",branch:"",year:"",cgpa:"",certifications:"",
    skills:[],domains:[],experience:"",projectDesc:"",
    whyJoin:"",contribution:"",goals:"",
  });

  const up=(k:keyof FormData,v:string)=>setForm(p=>({...p,[k]:v}));
  const toggle=(k:"skills"|"domains",v:string)=>setForm(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));

  const validate=():boolean=>{
    const e:Record<string,string>={};
    if(step===0){
      if(!form.firstName.trim()) e.firstName="Required";
      if(!form.lastName.trim()) e.lastName="Required";
      if(!form.email.trim()) e.email="Required";
      else if(!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email="Valid email required";
    }
    if(step===1){
      if(!form.college.trim()) e.college="Required";
      if(!form.branch.trim()) e.branch="Required";
      if(!form.year) e.year="Required";
    }
    if(step===3){
      if(!form.whyJoin.trim()||form.whyJoin.trim().length<30) e.whyJoin="Please write at least 30 characters";
      if(!form.contribution.trim()||form.contribution.trim().length<30) e.contribution="Please write at least 30 characters";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next=async()=>{
    if(!validate()) return;
    if(step<3){setStep(s=>s+1);return;}
    setLoading(true);
    try{
      const res=await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,cgpa:form.cgpa?parseFloat(form.cgpa):undefined})});
      if(res.ok) setSubmitted(true);
      else{ const d=await res.json(); setErrors({submit:d.error||"Submission failed"}); }
    }catch{ setErrors({submit:"Network error. Please try again."}); }
    finally{setLoading(false);}
  };
  const back=()=>{setStep(s=>s-1);setErrors({});};

  if(submitted) return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",paddingTop:80 }}>
      <div style={{ textAlign:"center",maxWidth:520 }}>
        <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#34d399,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.75rem" }}>
          <CheckCircle size={38} color="white"/>
        </div>
        <h2 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"2rem",marginBottom:"1rem" }}>Application Submitted!</h2>
        <p style={{ color:"#8b949e",lineHeight:1.75,marginBottom:".75rem" }}>Thank you, <strong style={{ color:"#f0f6fc" }}>{form.firstName}</strong>! Your application for AI-Club Batch 2025 has been received.</p>
        <p style={{ color:"#8b949e",lineHeight:1.75,marginBottom:"2.5rem" }}>We'll review and get back to you at <strong style={{ color:"#90c8ff" }}>{form.email}</strong> within 7 working days.</p>
        <div style={{ background:"rgba(59,139,253,.07)",border:"1px solid rgba(59,139,253,.18)",borderRadius:12,padding:"1rem 1.25rem",marginBottom:"2rem",fontSize:".875rem",color:"#8b949e",lineHeight:1.7 }}>
          <strong style={{ color:"#90c8ff" }}>What's next?</strong> Our team will shortlist candidates and invite selected applicants for a brief technical/cultural interview over the next 2 weeks.
        </div>
        <GradientButton onClick={()=>{setSubmitted(false);setStep(0);setForm({firstName:"",lastName:"",email:"",phone:"",gender:"",linkedIn:"",github:"",college:"",branch:"",year:"",cgpa:"",certifications:"",skills:[],domains:[],experience:"",projectDesc:"",whyJoin:"",contribution:"",goals:""});}}>
          Submit Another Application
        </GradientButton>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"7rem 1.5rem 5rem",maxWidth:780,margin:"0 auto" }}>
      <div style={{ marginBottom:"2.5rem" }}>
        <span style={{ display:"inline-block",fontFamily:"'JetBrains Mono',monospace",fontSize:".68rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"#60a8ff",background:"rgba(59,139,253,.1)",border:"1px solid rgba(59,139,253,.22)",padding:".28rem .85rem",borderRadius:100,marginBottom:"1rem" }}>Join AI-Club</span>
        <h1 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1.75rem,4vw,2.5rem)",marginBottom:".5rem" }}>Membership Application</h1>
        <p style={{ color:"#8b949e" }}>Batch 2025 · Applications close May 15, 2025</p>
      </div>

      {/* Stepper */}
      <div style={{ display:"flex",alignItems:"center",marginBottom:"2.5rem" }}>
        {steps.map((s,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",flex:i<steps.length-1?1:"none" }}>
            <div className={`step-${i<step?"done":i===step?"active":""}`} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:".35rem" }}>
              <div className="step-circle">
                {i<step?<CheckCircle size={16} color="#34d399"/>:<s.icon size={15} color={i===step?"#60a8ff":"#6e7681"}/>}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
            {i<steps.length-1&&<div style={{ flex:1,height:1.5,background:i<step?"#34d399":"var(--border2)",margin:"0 .4rem",marginBottom:".875rem",transition:"background .3s" }}/>}
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:16,padding:"2rem",marginBottom:"1.5rem" }}>
        {step===0&&(
          <>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem",marginBottom:"1.75rem" }}>Personal Information</h3>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
              <FormField label="First Name" required><input required className="input-field" value={form.firstName} onChange={e=>up("firstName",e.target.value)} placeholder="Rahul" style={{ borderColor:errors.firstName?"#f87171":undefined }}/>{errors.firstName&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.firstName}</span>}</FormField>
              <FormField label="Last Name" required><input required className="input-field" value={form.lastName} onChange={e=>up("lastName",e.target.value)} placeholder="Sharma" style={{ borderColor:errors.lastName?"#f87171":undefined }}/>{errors.lastName&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.lastName}</span>}</FormField>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
              <FormField label="Email Address" required>
                <input type="email" className="input-field" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="rahul@college.edu.in" style={{ borderColor:errors.email?"#f87171":undefined }}/>
                {errors.email&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.email}</span>}
              </FormField>
              <FormField label="Phone Number"><input type="tel" className="input-field" value={form.phone} onChange={e=>up("phone",e.target.value)} placeholder="+91 9876543210"/></FormField>
            </div>
            <FormField label="Gender">
              <select className="input-field" value={form.gender} onChange={e=>up("gender",e.target.value)}>
                <option value="">Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option>
              </select>
            </FormField>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
              <FormField label="GitHub Profile"><input className="input-field" value={form.github} onChange={e=>up("github",e.target.value)} placeholder="github.com/username"/></FormField>
              <FormField label="LinkedIn Profile"><input className="input-field" value={form.linkedIn} onChange={e=>up("linkedIn",e.target.value)} placeholder="linkedin.com/in/username"/></FormField>
            </div>
          </>
        )}
        {step===1&&(
          <>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem",marginBottom:"1.75rem" }}>Academic Background</h3>
            <FormField label="College / University" required>
              <input className="input-field" value={form.college} onChange={e=>up("college",e.target.value)} placeholder="Lucknow Public College of Professional Studies" style={{ borderColor:errors.college?"#f87171":undefined }}/>
              {errors.college&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.college}</span>}
            </FormField>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
              <FormField label="Branch / Program" required>
                <input className="input-field" value={form.branch} onChange={e=>up("branch",e.target.value)} placeholder="B.Tech CSE (AI/ML)" style={{ borderColor:errors.branch?"#f87171":undefined }}/>
                {errors.branch&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.branch}</span>}
              </FormField>
              <FormField label="Current Year" required>
                <select className="input-field" value={form.year} onChange={e=>up("year",e.target.value)} style={{ borderColor:errors.year?"#f87171":undefined }}>
                  <option value="">Select year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                </select>
                {errors.year&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.year}</span>}
              </FormField>
            </div>
            <FormField label="CGPA / Percentage"><input type="number" min="0" max="10" step=".1" className="input-field" value={form.cgpa} onChange={e=>up("cgpa",e.target.value)} placeholder="8.5"/></FormField>
            <FormField label="Relevant Courses & Certifications"><textarea className="input-field" value={form.certifications} onChange={e=>up("certifications",e.target.value)} placeholder="List any AI/ML courses, certifications (Coursera, Udemy, etc.)..."/></FormField>
          </>
        )}
        {step===2&&(
          <>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem",marginBottom:"1.75rem" }}>Skills & Interests</h3>
            <FormField label="Technical Skills (select all that apply)">
              <div style={{ display:"flex",gap:".45rem",flexWrap:"wrap",marginTop:".25rem" }}>
                {SKILLS.map(s=>(
                  <button key={s} type="button" onClick={()=>toggle("skills",s)}
                    style={{ background:form.skills.includes(s)?"rgba(59,139,253,.18)":"rgba(255,255,255,.04)",border:`1px solid ${form.skills.includes(s)?"rgba(59,139,253,.45)":"var(--border2)"}`,color:form.skills.includes(s)?"#90c8ff":"#8b949e",padding:".32rem .8rem",borderRadius:100,fontSize:".78rem",cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all .2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Domains of Interest (select all that apply)">
              <div style={{ display:"flex",gap:".45rem",flexWrap:"wrap",marginTop:".25rem" }}>
                {DOMAINS.map(d=>(
                  <button key={d} type="button" onClick={()=>toggle("domains",d)}
                    style={{ background:form.domains.includes(d)?"rgba(167,139,250,.18)":"rgba(255,255,255,.04)",border:`1px solid ${form.domains.includes(d)?"rgba(167,139,250,.45)":"var(--border2)"}`,color:form.domains.includes(d)?"#c4b5fd":"#8b949e",padding:".32rem .8rem",borderRadius:100,fontSize:".78rem",cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all .2s" }}>
                    {d}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Experience Level">
              <select className="input-field" value={form.experience} onChange={e=>up("experience",e.target.value)}>
                <option value="">Select your level</option>
                <option>Beginner — Just starting out</option><option>Intermediate — Some projects done</option><option>Advanced — Multiple projects, competitions</option>
              </select>
            </FormField>
            <FormField label="Describe a project you've worked on (or want to work on)">
              <textarea className="input-field" value={form.projectDesc} onChange={e=>up("projectDesc",e.target.value)} placeholder="Describe a technical project — what it does, what tech you used, what you learned..."/>
            </FormField>
          </>
        )}
        {step===3&&(
          <>
            <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.15rem",marginBottom:"1.75rem" }}>Statement of Purpose</h3>
            <FormField label="Why do you want to join AI-Club?" required>
              <textarea className="input-field" value={form.whyJoin} onChange={e=>up("whyJoin",e.target.value)} placeholder="Tell us why you're interested in AI-Club and what draws you to AI/ML..." style={{ borderColor:errors.whyJoin?"#f87171":undefined,minHeight:130}}/>
              {errors.whyJoin&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.whyJoin}</span>}
            </FormField>
            <FormField label="How will you contribute to the club?" required>
              <textarea className="input-field" value={form.contribution} onChange={e=>up("contribution",e.target.value)} placeholder="Describe what you bring to the club — skills, ideas, energy, projects you'd like to build..." style={{ borderColor:errors.contribution?"#f87171":undefined,minHeight:130}}/>
              {errors.contribution&&<span style={{ color:"#f87171",fontSize:".72rem",fontFamily:"'JetBrains Mono',monospace" }}>{errors.contribution}</span>}
            </FormField>
            <FormField label="What are your goals for the next 2 years?">
              <textarea className="input-field" value={form.goals} onChange={e=>up("goals",e.target.value)} placeholder="Research publications, internships, startups — share your vision..."/>
            </FormField>
            {errors.submit&&<div style={{ background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",borderRadius:10,padding:".75rem 1rem",marginBottom:".75rem",color:"#f87171",fontSize:".85rem" }}>{errors.submit}</div>}
            <div style={{ background:"rgba(59,139,253,.06)",border:"1px solid rgba(59,139,253,.15)",borderRadius:10,padding:".875rem 1rem" }}>
              <p style={{ fontSize:".82rem",color:"#8b949e",lineHeight:1.65 }}>By submitting, you confirm that all information is accurate. Applications are reviewed within 7 working days.</p>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>{step>0&&<OutlineButton onClick={back}><ArrowLeft size={14}/>Previous</OutlineButton>}</div>
        <div style={{ display:"flex",alignItems:"center",gap:"1rem" }}>
          <span style={{ color:"#8b949e",fontSize:".78rem",fontFamily:"'JetBrains Mono',monospace" }}>Step {step+1}/{steps.length}</span>
          <GradientButton onClick={next} disabled={loading}>
            {loading?<><div style={{ width:15,height:15,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%",animation:"spin 1s linear infinite" }}/>Submitting...</>:step<3?<>Continue<ArrowRight size={14}/></>:<>Submit Application 🚀</>}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
