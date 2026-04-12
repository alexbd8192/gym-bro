import { useState, useMemo, useEffect } from "react";

// ─── EXERCISE DATABASE (80+) ───────────────────────────────────────────────
const DB = [
  // Barbell
  {id:1,name:"Back Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:2,name:"Front Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:3,name:"Bench Press",muscle:"Chest",eq:"Barbell",type:"Compound"},
  {id:4,name:"Incline Bench Press",muscle:"Chest",eq:"Barbell",type:"Compound"},
  {id:5,name:"Decline Bench Press",muscle:"Chest",eq:"Barbell",type:"Compound"},
  {id:6,name:"Deadlift",muscle:"Back",eq:"Barbell",type:"Compound"},
  {id:7,name:"Romanian Deadlift",muscle:"Hamstrings",eq:"Barbell",type:"Compound"},
  {id:8,name:"Sumo Deadlift",muscle:"Glutes",eq:"Barbell",type:"Compound"},
  {id:9,name:"Overhead Press",muscle:"Shoulders",eq:"Barbell",type:"Compound"},
  {id:10,name:"Barbell Row",muscle:"Back",eq:"Barbell",type:"Compound"},
  {id:11,name:"Pendlay Row",muscle:"Back",eq:"Barbell",type:"Compound"},
  {id:12,name:"Hip Thrust",muscle:"Glutes",eq:"Barbell",type:"Compound"},
  {id:13,name:"Good Morning",muscle:"Hamstrings",eq:"Barbell",type:"Compound"},
  {id:14,name:"Barbell Curl",muscle:"Biceps",eq:"Barbell",type:"Isolation"},
  {id:15,name:"Skull Crusher",muscle:"Triceps",eq:"Barbell",type:"Isolation"},
  {id:16,name:"Barbell Lunge",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:17,name:"Zercher Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  // EZ Bar
  {id:18,name:"EZ Bar Curl",muscle:"Biceps",eq:"EZ Bar",type:"Isolation"},
  {id:19,name:"EZ Bar Skullcrusher",muscle:"Triceps",eq:"EZ Bar",type:"Isolation"},
  {id:20,name:"EZ Bar Upright Row",muscle:"Shoulders",eq:"EZ Bar",type:"Compound"},
  {id:21,name:"EZ Bar Reverse Curl",muscle:"Forearms",eq:"EZ Bar",type:"Isolation"},
  // Smith Machine
  {id:22,name:"Smith Machine Squat",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:23,name:"Smith Machine Bench",muscle:"Chest",eq:"Smith Machine",type:"Compound"},
  {id:24,name:"Smith Machine Row",muscle:"Back",eq:"Smith Machine",type:"Compound"},
  {id:25,name:"Smith Machine Hip Thrust",muscle:"Glutes",eq:"Smith Machine",type:"Compound"},
  {id:26,name:"Smith Machine Shoulder Press",muscle:"Shoulders",eq:"Smith Machine",type:"Compound"},
  {id:27,name:"Smith Machine Calf Raise",muscle:"Calves",eq:"Smith Machine",type:"Isolation"},
  // Dumbbell
  {id:28,name:"Dumbbell Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:29,name:"Hammer Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:30,name:"Incline Dumbbell Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:31,name:"Dumbbell Bench Press",muscle:"Chest",eq:"Dumbbell",type:"Compound"},
  {id:32,name:"Incline Dumbbell Press",muscle:"Chest",eq:"Dumbbell",type:"Compound"},
  {id:33,name:"Dumbbell Fly",muscle:"Chest",eq:"Dumbbell",type:"Isolation"},
  {id:34,name:"Dumbbell Row",muscle:"Back",eq:"Dumbbell",type:"Compound"},
  {id:35,name:"Dumbbell Shoulder Press",muscle:"Shoulders",eq:"Dumbbell",type:"Compound"},
  {id:36,name:"Lateral Raise",muscle:"Shoulders",eq:"Dumbbell",type:"Isolation"},
  {id:37,name:"Front Raise",muscle:"Shoulders",eq:"Dumbbell",type:"Isolation"},
  {id:38,name:"Rear Delt Fly",muscle:"Shoulders",eq:"Dumbbell",type:"Isolation"},
  {id:39,name:"Dumbbell Tricep Kickback",muscle:"Triceps",eq:"Dumbbell",type:"Isolation"},
  {id:40,name:"Dumbbell Overhead Extension",muscle:"Triceps",eq:"Dumbbell",type:"Isolation"},
  {id:41,name:"Goblet Squat",muscle:"Quads",eq:"Dumbbell",type:"Compound"},
  {id:42,name:"Dumbbell Lunge",muscle:"Quads",eq:"Dumbbell",type:"Compound"},
  {id:43,name:"Dumbbell RDL",muscle:"Hamstrings",eq:"Dumbbell",type:"Compound"},
  {id:44,name:"Dumbbell Hip Thrust",muscle:"Glutes",eq:"Dumbbell",type:"Compound"},
  {id:45,name:"Dumbbell Calf Raise",muscle:"Calves",eq:"Dumbbell",type:"Isolation"},
  {id:46,name:"Dumbbell Shrug",muscle:"Traps",eq:"Dumbbell",type:"Isolation"},
  // Cable
  {id:47,name:"Cable Fly",muscle:"Chest",eq:"Cable",type:"Isolation"},
  {id:48,name:"Cable Row",muscle:"Back",eq:"Cable",type:"Compound"},
  {id:49,name:"Lat Pulldown",muscle:"Back",eq:"Cable",type:"Compound"},
  {id:50,name:"Face Pull",muscle:"Shoulders",eq:"Cable",type:"Isolation"},
  {id:51,name:"Cable Curl",muscle:"Biceps",eq:"Cable",type:"Isolation"},
  {id:52,name:"Tricep Pushdown",muscle:"Triceps",eq:"Cable",type:"Isolation"},
  {id:53,name:"Overhead Cable Extension",muscle:"Triceps",eq:"Cable",type:"Isolation"},
  {id:54,name:"Cable Lateral Raise",muscle:"Shoulders",eq:"Cable",type:"Isolation"},
  {id:55,name:"Cable Kickback",muscle:"Glutes",eq:"Cable",type:"Isolation"},
  {id:56,name:"Cable Crunch",muscle:"Core",eq:"Cable",type:"Isolation"},
  // Machine
  {id:57,name:"Leg Press",muscle:"Quads",eq:"Machine",type:"Compound"},
  {id:58,name:"Leg Curl",muscle:"Hamstrings",eq:"Machine",type:"Isolation"},
  {id:59,name:"Leg Extension",muscle:"Quads",eq:"Machine",type:"Isolation"},
  {id:60,name:"Seated Calf Raise",muscle:"Calves",eq:"Machine",type:"Isolation"},
  {id:61,name:"Chest Press Machine",muscle:"Chest",eq:"Machine",type:"Compound"},
  {id:62,name:"Pec Deck",muscle:"Chest",eq:"Machine",type:"Isolation"},
  {id:63,name:"Machine Row",muscle:"Back",eq:"Machine",type:"Compound"},
  {id:64,name:"Shoulder Press Machine",muscle:"Shoulders",eq:"Machine",type:"Compound"},
  {id:65,name:"Adductor Machine",muscle:"Adductors",eq:"Machine",type:"Isolation"},
  {id:66,name:"Abductor Machine",muscle:"Abductors",eq:"Machine",type:"Isolation"},
  // Bodyweight
  {id:67,name:"Pull-Up",muscle:"Back",eq:"Bodyweight",type:"Compound"},
  {id:68,name:"Chin-Up",muscle:"Biceps",eq:"Bodyweight",type:"Compound"},
  {id:69,name:"Push-Up",muscle:"Chest",eq:"Bodyweight",type:"Compound"},
  {id:70,name:"Dip",muscle:"Triceps",eq:"Bodyweight",type:"Compound"},
  {id:71,name:"Plank",muscle:"Core",eq:"Bodyweight",type:"Isometric"},
  {id:72,name:"Hanging Leg Raise",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:73,name:"Glute Bridge",muscle:"Glutes",eq:"Bodyweight",type:"Compound"},
  {id:74,name:"Nordic Curl",muscle:"Hamstrings",eq:"Bodyweight",type:"Isolation"},
  {id:75,name:"Inverted Row",muscle:"Back",eq:"Bodyweight",type:"Compound"},
  {id:76,name:"Pistol Squat",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:77,name:"Handstand Push-Up",muscle:"Shoulders",eq:"Bodyweight",type:"Compound"},
  {id:78,name:"Ab Wheel Rollout",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  // Kettlebell
  {id:79,name:"Kettlebell Swing",muscle:"Glutes",eq:"Kettlebell",type:"Compound"},
  {id:80,name:"Kettlebell Goblet Squat",muscle:"Quads",eq:"Kettlebell",type:"Compound"},
  {id:81,name:"Kettlebell Press",muscle:"Shoulders",eq:"Kettlebell",type:"Compound"},
  {id:82,name:"Turkish Get-Up",muscle:"Core",eq:"Kettlebell",type:"Compound"},
];

const EQ_TYPES = ["All", "Barbell", "EZ Bar", "Smith Machine", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell"];
const MUSCLES = ["All", ...new Set(DB.map(e => e.muscle)).values()];

// Bar weights in lbs
const BARS = [
  {name:"Barbell", weight:45},
  {name:"Smith Machine", weight:35},
  {name:"EZ Bar", weight:25},
];
const PLATES_LBS = [45,35,25,10,5,2.5,1.25];
const PLATES_KG  = [20,15,10,5,2.5,1.25];
const PLATE_COLORS = {45:"#E24B4A",35:"#185FA5",25:"#F0992B",20:"#E24B4A",15:"#185FA5",10:"#3B6D11",5:"#534AB7",2.5:"#888",1.25:"#aaa"};

function calcPlates(target, barW, plates) {
  let rem = Math.max(0, (target - barW) / 2);
  const res = [];
  plates.forEach(p => {
    const n = Math.floor(rem / p + 0.001);
    if (n > 0) { res.push({plate:p, count:n}); rem = Math.round((rem - n*p)*1000)/1000; }
  });
  return res;
}

// ─── STORAGE (in-memory) ──────────────────────────────────────────────────
const DEMO_USERS = [
  {id:"alex", name:"Alex", password:"1234"},
  {id:"gf",   name:"Gf",   password:"1234"},
];

const today = new Date().toISOString().split("T")[0];
const d = (n) => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().split("T")[0]; };

const DEMO_SESSIONS = {
  alex: [
    {id:"s1", date:d(2), routineId:null, routineName:"Push Day", exercises:[
      {name:"Bench Press", sets:[{w:185,r:5},{w:185,r:5},{w:185,r:4}]},
      {name:"Overhead Press", sets:[{w:115,r:8},{w:115,r:7},{w:115,r:6}]},
      {name:"Incline Dumbbell Press", sets:[{w:70,r:10},{w:70,r:9}]},
      {name:"Tricep Pushdown", sets:[{w:60,r:12},{w:60,r:12}]},
      {name:"Cable Fly", sets:[{w:40,r:15},{w:40,r:15}]},
    ]},
    {id:"s2", date:d(4), routineId:null, routineName:"Pull Day", exercises:[
      {name:"Deadlift", sets:[{w:315,r:3},{w:315,r:3},{w:295,r:3}]},
      {name:"Barbell Row", sets:[{w:185,r:8},{w:185,r:8},{w:185,r:6}]},
      {name:"Lat Pulldown", sets:[{w:130,r:10},{w:130,r:10}]},
      {name:"Dumbbell Curl", sets:[{w:40,r:12},{w:40,r:11}]},
    ]},
    {id:"s3", date:d(6), routineId:null, routineName:"Legs", exercises:[
      {name:"Back Squat", sets:[{w:225,r:5},{w:225,r:5},{w:225,r:4}]},
      {name:"Romanian Deadlift", sets:[{w:185,r:8},{w:185,r:8}]},
      {name:"Leg Press", sets:[{w:360,r:12},{w:360,r:10}]},
      {name:"Leg Curl", sets:[{w:90,r:12},{w:90,r:12}]},
    ]},
    {id:"s4", date:d(9), routineId:null, routineName:"Push Day", exercises:[
      {name:"Bench Press", sets:[{w:180,r:5},{w:180,r:5},{w:180,r:5}]},
      {name:"Overhead Press", sets:[{w:110,r:8},{w:110,r:8}]},
    ]},
  ],
  gf: [
    {id:"g1", date:d(3), routineId:null, routineName:"Lower A", exercises:[
      {name:"Hip Thrust", sets:[{w:135,r:10},{w:135,r:10},{w:135,r:8}]},
      {name:"Leg Press", sets:[{w:180,r:12},{w:180,r:12}]},
      {name:"Leg Curl", sets:[{w:70,r:12},{w:70,r:12}]},
    ]},
  ],
};

const DEMO_ROUTINES = {
  alex:[
    {id:"r1",name:"Push Day",exercises:[
      {name:"Bench Press",sets:3,reps:"5",weight:"185"},
      {name:"Overhead Press",sets:3,reps:"8",weight:"115"},
      {name:"Incline Dumbbell Press",sets:3,reps:"10",weight:"70"},
      {name:"Tricep Pushdown",sets:3,reps:"12",weight:"60"},
      {name:"Cable Fly",sets:2,reps:"15",weight:"40"},
    ]},
    {id:"r2",name:"Pull Day",exercises:[
      {name:"Deadlift",sets:3,reps:"3",weight:"315"},
      {name:"Barbell Row",sets:3,reps:"8",weight:"185"},
      {name:"Lat Pulldown",sets:3,reps:"10",weight:"130"},
      {name:"Dumbbell Curl",sets:3,reps:"12",weight:"40"},
    ]},
    {id:"r3",name:"Legs",exercises:[
      {name:"Back Squat",sets:3,reps:"5",weight:"225"},
      {name:"Romanian Deadlift",sets:3,reps:"8",weight:"185"},
      {name:"Leg Press",sets:3,reps:"12",weight:"360"},
      {name:"Leg Curl",sets:3,reps:"12",weight:"90"},
    ]},
  ],
  gf:[
    {id:"g1",name:"Lower A",exercises:[
      {name:"Hip Thrust",sets:3,reps:"10",weight:"135"},
      {name:"Leg Press",sets:3,reps:"12",weight:"180"},
      {name:"Leg Curl",sets:3,reps:"12",weight:"70"},
    ]},
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────
function getPRs(sessions) {
  const prs = {};
  (sessions||[]).forEach(s => s.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (!prs[ex.name] || set.w > prs[ex.name].w) prs[ex.name] = {w:set.w, r:set.r, date:s.date};
    });
  }));
  return prs;
}

function getLastTwo(sessions, exName) {
  const logs = [];
  [...(sessions||[])].sort((a,b)=>a.date>b.date?-1:1).forEach(s => {
    const ex = s.exercises.find(e=>e.name===exName);
    if (ex) logs.push({date:s.date, best:Math.max(...ex.sets.map(s=>s.w)), reps: ex.sets[0]?.r});
  });
  return logs.slice(0,2);
}

function exportCSV(sessions, userName) {
  const rows = [["Date","Session","Exercise","Set","Weight(lbs)","Reps"]];
  sessions.forEach(s => s.exercises.forEach(ex => ex.sets.forEach((set,i) =>
    rows.push([s.date, s.routineName||"Freestyle", ex.name, i+1, set.w, set.r])
  )));
  const csv = rows.map(r=>r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `gymbro_${userName}_${today}.csv`;
  a.click();
}

function exportMD(sessions, userName) {
  let md = `# Gym Bro — ${userName} export\n\n`;
  sessions.forEach(s => {
    md += `## ${s.date} — ${s.routineName||"Freestyle"}\n\n`;
    s.exercises.forEach(ex => {
      md += `### ${ex.name}\n`;
      ex.sets.forEach((set,i) => md += `- Set ${i+1}: ${set.w} lbs × ${set.r} reps\n`);
      md += "\n";
    });
  });
  const a = document.createElement("a");
  a.href = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
  a.download = `gymbro_${userName}_${today}.md`;
  a.click();
}

// ─── STYLES ───────────────────────────────────────────────────────────────
const S = {
  wrap: {fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",maxWidth:540,margin:"0 auto",padding:"0 0 5rem"},
  header: {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 0 0.5rem"},
  logo: {fontSize:20,fontWeight:500},
  tabs: {display:"flex",gap:2,borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:"1.25rem",overflowX:"auto"},
  tabBtn: a=>({padding:"8px 12px",fontSize:12,background:"none",border:"none",borderBottom:a?"2px solid var(--color-text-primary)":"2px solid transparent",color:a?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",fontWeight:a?500:400,whiteSpace:"nowrap"}),
  card: {background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"0.875rem 1rem",marginBottom:8},
  cardSec: {background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"0.875rem 1rem",marginBottom:8},
  label: {fontSize:12,color:"var(--color-text-secondary)",marginBottom:4,marginTop:10},
  input: {width:"100%",boxSizing:"border-box",padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  sm: {width:68,padding:"5px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  btn: {padding:"6px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontSize:13},
  btnPrimary: {padding:"7px 16px",borderRadius:"var(--border-radius-md)",border:"none",background:"#185FA5",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500},
  btnDanger: {padding:"6px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #A32D2D",background:"transparent",color:"#A32D2D",cursor:"pointer",fontSize:12},
  tag: c=>({fontSize:11,padding:"2px 8px",borderRadius:10,background:c+"22",color:c,fontWeight:500,display:"inline-block"}),
  prBadge: {fontSize:11,padding:"2px 7px",borderRadius:10,background:"#FAEEDA",color:"#BA7517",fontWeight:500},
  metricRow: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:"1rem"},
  metric: {background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.75rem",textAlign:"center"},
  metricVal: {fontSize:22,fontWeight:500},
  metricLbl: {fontSize:11,color:"var(--color-text-secondary)",marginTop:2},
  row: {display:"flex",gap:8,alignItems:"center"},
  pill: (a,c)=>({padding:"4px 12px",borderRadius:20,border:`1.5px solid ${a?c:"var(--color-border-tertiary)"}`,background:a?c+"22":"transparent",color:a?c:"var(--color-text-secondary)",fontSize:13,cursor:"pointer",fontWeight:a?500:400}),
  secTitle: {fontSize:13,fontWeight:500,marginBottom:8,marginTop:"1rem"},
};

// ─── APP ──────────────────────────────────────────────────────────────────
export default function GymBro() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [sessions, setSessions] = useState(DEMO_SESSIONS);
  const [routines, setRoutines] = useState(DEMO_ROUTINES);
  const [loggedIn, setLoggedIn] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({name:"",password:""});
  const [authErr, setAuthErr] = useState("");
  const [tab, setTab] = useState("dashboard");

  // Calculator state
  const [unit, setUnit] = useState("lbs");
  const [barIdx, setBarIdx] = useState(0);
  const [targetW, setTargetW] = useState(135);

  // DB tab state
  const [dbSearch, setDbSearch] = useState("");
  const [dbEq, setDbEq] = useState("All");
  const [dbMuscle, setDbMuscle] = useState("All");

  // Log/session state
  const [activeSession, setActiveSession] = useState(null); // {routineName, exercises:[{name,sets:[{w,r}]}]}
  const [editSessionId, setEditSessionId] = useState(null);

  // Routine state
  const [editRoutineId, setEditRoutineId] = useState(null);
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [routineForm, setRoutineForm] = useState({name:"",exercises:[]});
  const [routineExSearch, setRoutineExSearch] = useState("");

  // AI state
  const [aiGoal, setAiGoal] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiErr, setAiErr] = useState("");

  // ── DB FILTER (must be before early return — Rules of Hooks) ──
  const filteredDB = useMemo(()=>DB.filter(e=>
    (dbEq==="All"||e.eq===dbEq)&&
    (dbMuscle==="All"||e.muscle===dbMuscle)&&
    e.name.toLowerCase().includes(dbSearch.toLowerCase())
  ),[dbEq,dbMuscle,dbSearch]);

  // ── PERSIST (must be before early return — Rules of Hooks) ──
  useEffect(()=>{
    try {
      const saved = localStorage.getItem("gymbro_state");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.users)    setUsers(d.users);
        if (d.sessions) setSessions(d.sessions);
        if (d.routines) setRoutines(d.routines);
        if (d.loggedIn) setLoggedIn(d.loggedIn);
      }
    } catch(e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    localStorage.setItem("gymbro_state", JSON.stringify({users,sessions,routines,loggedIn}));
  },[users,sessions,routines,loggedIn]);

  if (!loggedIn) return <AuthScreen users={users} setUsers={setUsers} sessions={sessions} setSessions={setSessions} routines={routines} setRoutines={setRoutines} authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} authErr={authErr} setAuthErr={setAuthErr} onLogin={u=>{setLoggedIn(u);setAuthErr("");}} />;

  const uid = loggedIn.id;
  const userSessions = sessions[uid]||[];
  const userRoutines = routines[uid]||[];
  const prs = getPRs(userSessions);

  // ── SAVE SESSION ──
  function saveSession() {
    if (!activeSession || activeSession.exercises.length===0) return;
    const newS = {
      id:"s"+Date.now(),
      date:today,
      routineName:activeSession.routineName||"Freestyle",
      exercises:activeSession.exercises.filter(e=>e.sets.length>0)
    };
    if (editSessionId) {
      setSessions(prev=>({...prev,[uid]:prev[uid].map(s=>s.id===editSessionId?{...newS,id:editSessionId}:s)}));
      setEditSessionId(null);
    } else {
      setSessions(prev=>({...prev,[uid]:[newS,...(prev[uid]||[])]}));
    }
    setActiveSession(null);
  }

  function startSession(routine) {
    setActiveSession({
      routineName: routine ? routine.name : "Freestyle",
      exercises: routine ? routine.exercises.map(e=>({
        name:e.name,
        targetSets:e.sets,
        targetReps:e.reps,
        targetWeight:e.weight,
        sets:[{w:"",r:""}]
      })) : []
    });
    setTab("log");
  }

  function editSession(s) {
    setActiveSession({routineName:s.routineName, exercises:s.exercises.map(e=>({name:e.name,sets:[...e.sets.map(x=>({...x}))]}))}); 
    setEditSessionId(s.id);
    setTab("log");
  }

  // ── SAVE ROUTINE ──
  function saveRoutine() {
    if (!routineForm.name || routineForm.exercises.length===0) return;
    if (editRoutineId) {
      setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===editRoutineId?{...routineForm,id:editRoutineId}:r)}));
      setEditRoutineId(null);
    } else {
      setRoutines(prev=>({...prev,[uid]:[...(prev[uid]||[]),{...routineForm,id:"r"+Date.now()}]}));
    }
    setRoutineForm({name:"",exercises:[]});
    setShowNewRoutine(false);
  }

  function editRoutine(r) {
    setRoutineForm({name:r.name,exercises:r.exercises.map(e=>({...e}))});
    setEditRoutineId(r.id);
    setShowNewRoutine(true);
  }

  function deleteRoutine(id) {
    setRoutines(prev=>({...prev,[uid]:prev[uid].filter(r=>r.id!==id)}));
  }

  // ── AI PLAN ──
  async function generatePlan() {
    if (!aiGoal.trim()) return;
    setAiLoading(true); setAiErr(""); setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:`You are a gym programming expert. The user says: "${aiGoal}". Create a resistance training routine. Respond ONLY with valid JSON (no markdown, no backticks) in this exact format: {"name":"Routine Name","exercises":[{"name":"Exercise Name","sets":3,"reps":"8","weight":"135"}]}. Use exercise names that exactly match this list where possible: ${DB.map(e=>e.name).join(", ")}. Use lbs for weight. 4-7 exercises.`}]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setAiResult(parsed);
    } catch(e) { setAiErr("Could not generate plan. Try again."); }
    setAiLoading(false);
  }

  function importAIPlan() {
    if (!aiResult) return;
    setRoutines(prev=>({...prev,[uid]:[...(prev[uid]||[]),{...aiResult,id:"ai"+Date.now()}]}));
    setAiResult(null); setAiGoal("");
    setTab("routines");
  }

  // ── CALC ──
  const bar = BARS[barIdx];
  const plates = unit==="lbs" ? PLATES_LBS : PLATES_KG;
  const barW = unit==="lbs" ? bar.weight : Math.round(bar.weight*0.453592*10)/10;
  const plateList = calcPlates(targetW, barW, plates);

  // ── CALENDAR ──
  const sessionsByDate = {};
  userSessions.forEach(s=>{ sessionsByDate[s.date]=(sessionsByDate[s.date]||[]); sessionsByDate[s.date].push(s); });
  const calDays = Array.from({length:28},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(27-i)); return d.toISOString().split("T")[0]; });

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <span style={S.logo}>Gym Bro</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{loggedIn.name}</span>
          <button style={S.btn} onClick={()=>setLoggedIn(null)}>Sign out</button>
        </div>
      </div>

      <div style={S.tabs}>
        {[["dashboard","Dashboard"],["log","Log"],["progress","Progress"],["routines","Routines"],["calc","Calculator"],["db","Exercises"],["ai","AI Plan"]].map(([id,lbl])=>(
          <button key={id} style={S.tabBtn(tab===id)} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab==="dashboard" && (
        <div>
          <div style={S.metricRow}>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("log")}><div style={S.metricVal}>{userSessions.length}</div><div style={S.metricLbl}>sessions</div></div>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("progress")}><div style={S.metricVal}>{Object.keys(prs).length}</div><div style={S.metricLbl}>PRs</div></div>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("routines")}><div style={S.metricVal}>{userRoutines.length}</div><div style={S.metricLbl}>routines</div></div>
          </div>
          <div style={S.secTitle}>Last 4 weeks</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:"1.5rem"}}>
            {calDays.map(d=>{
              const hasSesh = sessionsByDate[d]?.length>0;
              return <div key={d} title={d} style={{height:18,borderRadius:3,background:hasSesh?"#185FA5":"var(--color-background-secondary)",opacity:hasSesh?0.85:1}} />;
            })}
          </div>
          <div style={S.secTitle}>Top PRs</div>
          {Object.entries(prs).slice(0,5).map(([ex,pr])=>(
            <div key={ex} style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:500}}>{ex}</span>
                <span style={S.prBadge}>{pr.w} lbs × {pr.r}</span>
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{pr.date}</div>
            </div>
          ))}
          <div style={S.secTitle}>Recent sessions</div>
          {userSessions.slice(0,3).map(s=>(
            <div key={s.id} style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:500}}>{s.routineName}</span>
                <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.date}</span>
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{s.exercises.map(e=>e.name).join(", ")}</div>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:"1.5rem"}}>
            <button style={S.btn} onClick={()=>exportCSV(userSessions,loggedIn.name)}>Export CSV</button>
            <button style={S.btn} onClick={()=>exportMD(userSessions,loggedIn.name)}>Export Markdown</button>
          </div>
        </div>
      )}

      {/* ── LOG ── */}
      {tab==="log" && (
        <div>
          {!activeSession ? (
            <div>
              <div style={S.secTitle}>Start a session</div>
              <button style={{...S.btnPrimary,marginBottom:8,width:"100%"}} onClick={()=>startSession(null)}>Freestyle session</button>
              {userRoutines.map(r=>(
                <div key={r.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{r.name}</div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.exercises.length} exercises</div>
                  </div>
                  <button style={S.btnPrimary} onClick={()=>startSession(r)}>Start</button>
                </div>
              ))}
              <div style={S.secTitle}>Session history</div>
              {userSessions.map(s=>(
                <div key={s.id} style={S.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:500}}>{s.routineName}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.date}</span>
                      <button style={S.btn} onClick={()=>editSession(s)}>Edit</button>
                    </div>
                  </div>
                  {s.exercises.map((ex,i)=>(
                    <div key={i} style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:1}}>
                      <strong style={{color:"var(--color-text-primary)"}}>{ex.name}</strong> — {ex.sets.map(s=>`${s.w}×${s.r}`).join(", ")}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:15,fontWeight:500}}>{activeSession.routineName}</span>
                <button style={S.btn} onClick={()=>{setActiveSession(null);setEditSessionId(null);}}>Cancel</button>
              </div>
              {activeSession.exercises.map((ex,ei)=>{
                const pr=prs[ex.name];
                const last=getLastTwo(userSessions.filter(s=>editSessionId?s.id!==editSessionId:true),ex.name)[0];
                return (
                  <div key={ei} style={S.card}>
                    <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{ex.name}</div>
                    {ex.targetWeight && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:2}}>Target: {ex.targetSets}×{ex.targetReps} @ {ex.targetWeight} lbs</div>}
                    {pr && <div style={{fontSize:12,color:"#BA7517",marginBottom:4}}>PR: {pr.w} lbs × {pr.r}</div>}
                    {last && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>Last: {last.best} lbs</div>}
                    {ex.sets.map((set,si)=>(
                      <div key={si} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:12,color:"var(--color-text-secondary)",minWidth:36}}>Set {si+1}</span>
                        <input type="number" value={set.w} placeholder="lbs" style={S.sm} onChange={e=>{
                          setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:exs[ei].sets.map((s,j)=>j===si?{...s,w:e.target.value}:s)};return {...prev,exercises:exs};});
                        }}/>
                        <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>×</span>
                        <input type="number" value={set.r} placeholder="reps" style={S.sm} onChange={e=>{
                          setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:exs[ei].sets.map((s,j)=>j===si?{...s,r:e.target.value}:s)};return {...prev,exercises:exs};});
                        }}/>
                        <button style={{...S.btn,padding:"4px 8px",fontSize:11,color:"#A32D2D"}} onClick={()=>{
                          setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:exs[ei].sets.filter((_,j)=>j!==si)};return {...prev,exercises:exs};});
                        }}>✕</button>
                      </div>
                    ))}
                    <button style={{...S.btn,fontSize:12,marginTop:2}} onClick={()=>{
                      setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:[...exs[ei].sets,{w:ex.sets[0]?.w||"",r:ex.sets[0]?.r||""}]};return {...prev,exercises:exs};});
                    }}>+ Set</button>
                  </div>
                );
              })}
              <AddExerciseInline onAdd={name=>{
                setActiveSession(prev=>({...prev,exercises:[...prev.exercises,{name,sets:[{w:"",r:""}]}]}));
              }}/>
              <button style={{...S.btnPrimary,width:"100%",marginTop:12}} onClick={saveSession}>
                {editSessionId?"Save changes":"Finish session"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── PROGRESS ── */}
      {tab==="progress" && (
        <div>
          <div style={S.secTitle}>Exercise progression</div>
          {Object.keys(prs).length===0 && <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>No sessions logged yet.</div>}
          {Object.entries(prs).map(([ex,pr])=>{
            const history = getLastTwo(userSessions,ex);
            const cur=history[0], prev=history[1];
            const pct = prev ? Math.round(((cur.best-prev.best)/prev.best)*100) : null;
            const up = pct!==null&&pct>=0;
            return (
              <div key={ex} style={S.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:500}}>{ex}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {pct!==null && (
                      <span style={{fontSize:13,fontWeight:500,color:up?"#3B6D11":"#A32D2D"}}>
                        {up?"↑":"↓"} {Math.abs(pct)}%
                      </span>
                    )}
                    <span style={S.prBadge}>PR {pr.w} lbs</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>
                  {cur && <span>Last: <strong style={{color:"var(--color-text-primary)"}}>{cur.best} lbs</strong> on {cur.date}</span>}
                  {prev && <span>  ·  Before: {prev.best} lbs on {prev.date}</span>}
                </div>
                <ProgressBar sessions={userSessions} exName={ex}/>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ROUTINES ── */}
      {tab==="routines" && (
        <div>
          {!showNewRoutine && (
            <>
              {userRoutines.map(r=>(
                <div key={r.id} style={S.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:15,fontWeight:500}}>{r.name}</span>
                    <div style={{display:"flex",gap:6}}>
                      <button style={S.btn} onClick={()=>editRoutine(r)}>Edit</button>
                      <button style={S.btnDanger} onClick={()=>deleteRoutine(r.id)}>Delete</button>
                    </div>
                  </div>
                  {r.exercises.map((e,i)=>(
                    <div key={i} style={{fontSize:13,display:"flex",justifyContent:"space-between",marginBottom:2,color:"var(--color-text-secondary)"}}>
                      <span style={{color:"var(--color-text-primary)"}}>{e.name}</span>
                      <span>{e.sets} × {e.reps} reps @ {e.weight} lbs</span>
                    </div>
                  ))}
                </div>
              ))}
              <button style={{...S.btnPrimary,marginTop:4}} onClick={()=>{setRoutineForm({name:"",exercises:[]});setEditRoutineId(null);setShowNewRoutine(true);}}>+ New routine</button>
            </>
          )}
          {showNewRoutine && (
            <div style={S.card}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10}}>{editRoutineId?"Edit routine":"New routine"}</div>
              <div style={S.label}>Routine name</div>
              <input value={routineForm.name} onChange={e=>setRoutineForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Push Day" style={S.input}/>
              <div style={{...S.secTitle,marginTop:12}}>Exercises</div>
              {routineForm.exercises.map((ex,i)=>(
                <div key={i} style={{...S.cardSec,marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:500}}>{ex.name}</span>
                    <button style={{...S.btn,padding:"2px 8px",fontSize:11}} onClick={()=>setRoutineForm(f=>({...f,exercises:f.exercises.filter((_,j)=>j!==i)}))}>Remove</button>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Sets</div>
                      <input type="number" value={ex.sets} style={{...S.sm,width:"100%"}} onChange={e=>setRoutineForm(f=>({...f,exercises:f.exercises.map((x,j)=>j===i?{...x,sets:e.target.value}:x)}))}/>
                    </div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Reps</div>
                      <input value={ex.reps} style={{...S.sm,width:"100%"}} onChange={e=>setRoutineForm(f=>({...f,exercises:f.exercises.map((x,j)=>j===i?{...x,reps:e.target.value}:x)}))}/>
                    </div>
                    <div style={{flex:1}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Weight (lbs)</div>
                      <input value={ex.weight} style={{...S.sm,width:"100%"}} onChange={e=>setRoutineForm(f=>({...f,exercises:f.exercises.map((x,j)=>j===i?{...x,weight:e.target.value}:x)}))}/>
                    </div>
                  </div>
                </div>
              ))}
              <div style={S.label}>Search & add exercise</div>
              <input value={routineExSearch} onChange={e=>setRoutineExSearch(e.target.value)} placeholder="Search exercises..." style={{...S.input,marginBottom:6}}/>
              <div style={{maxHeight:160,overflowY:"auto",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)"}}>
                {DB.filter(e=>e.name.toLowerCase().includes(routineExSearch.toLowerCase())).map(e=>(
                  <div key={e.id} style={{padding:"6px 10px",fontSize:13,cursor:"pointer",borderBottom:"0.5px solid var(--color-border-tertiary)"}} onClick={()=>setRoutineForm(f=>({...f,exercises:[...f.exercises,{name:e.name,sets:3,reps:"8",weight:""}]}))}>
                    {e.name} <span style={{color:"var(--color-text-secondary)",fontSize:11}}>{e.eq} · {e.muscle}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button style={S.btnPrimary} onClick={saveRoutine}>Save</button>
                <button style={S.btn} onClick={()=>{setShowNewRoutine(false);setEditRoutineId(null);}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CALCULATOR ── */}
      {tab==="calc" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
            <span style={{fontSize:13}}>Unit:</span>
            {["lbs","kg"].map(u=><button key={u} style={S.pill(unit===u,"#185FA5")} onClick={()=>{setUnit(u);setTargetW(u==="lbs"?135:60);}}>{u}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {BARS.map((b,i)=><button key={b.name} style={S.pill(barIdx===i,"#3B6D11")} onClick={()=>setBarIdx(i)}>{b.name} ({unit==="lbs"?b.weight:Math.round(b.weight*0.453592)})</button>)}
          </div>
          <div style={S.label}>Target weight ({unit})</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <input type="range" min={barW} max={unit==="lbs"?500:225} step={unit==="lbs"?2.5:1.25} value={targetW} onChange={e=>setTargetW(Number(e.target.value))} style={{flex:1}}/>
            <input type="number" value={targetW} style={{...S.sm,width:72}} onChange={e=>setTargetW(Number(e.target.value))}/>
          </div>
          <div style={S.card}>
            <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:10}}>Bar: {barW} {unit}  ·  Each side:</div>
            {plateList.length===0 && <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Just the bar!</div>}
            {plateList.map(({plate,count})=>(
              <div key={plate} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:PLATE_COLORS[plate]||"#888",flexShrink:0}}/>
                <span style={{fontSize:14,fontWeight:500,minWidth:46}}>{plate} {unit}</span>
                <span style={{fontSize:13,color:"var(--color-text-secondary)",minWidth:24}}>×{count}</span>
                <div style={{display:"flex",gap:2}}>
                  {Array.from({length:count}).map((_,j)=>(
                    <div key={j} style={{width:9,height:28,borderRadius:2,background:PLATE_COLORS[plate]||"#888",opacity:0.8}}/>
                  ))}
                </div>
              </div>
            ))}
            <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",marginTop:8,paddingTop:8,fontSize:13,fontWeight:500}}>
              Total: {targetW} {unit}
            </div>
          </div>
        </div>
      )}

      {/* ── EXERCISE DB ── */}
      {tab==="db" && (
        <div>
          <input value={dbSearch} onChange={e=>setDbSearch(e.target.value)} placeholder="Search exercises..." style={{...S.input,marginBottom:8}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
            {EQ_TYPES.map(t=><button key={t} style={S.pill(dbEq===t,"#185FA5")} onClick={()=>setDbEq(t)}>{t}</button>)}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
            {MUSCLES.map(m=><button key={m} style={S.pill(dbMuscle===m,"#534AB7")} onClick={()=>setDbMuscle(m)}>{m}</button>)}
          </div>
          <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:8}}>{filteredDB.length} exercises</div>
          {filteredDB.map(ex=>(
            <div key={ex.id} style={S.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:500}}>{ex.name}</span>
                <div style={{display:"flex",gap:4}}>
                  <span style={S.tag("#185FA5")}>{ex.muscle}</span>
                  <span style={S.tag("#3B6D11")}>{ex.eq}</span>
                </div>
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{ex.type}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── AI PLAN ── */}
      {tab==="ai" && (
        <div>
          <div style={{...S.cardSec,marginBottom:12}}>
            <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Describe your goal and I'll build a routine and save it directly to your Gym Bro.</div>
          </div>
          <div style={S.label}>Your goal</div>
          <textarea value={aiGoal} onChange={e=>setAiGoal(e.target.value)} rows={3} placeholder="e.g. I want to build a 3-day upper/lower split focused on hypertrophy, I'm intermediate level..." style={{...S.input,resize:"vertical"}}/>
          <button style={{...S.btnPrimary,marginTop:8,width:"100%"}} onClick={generatePlan} disabled={aiLoading}>
            {aiLoading?"Generating...":"Generate routine ↗"}
          </button>
          {aiErr && <div style={{color:"#A32D2D",fontSize:13,marginTop:8}}>{aiErr}</div>}
          {aiResult && (
            <div style={{...S.card,marginTop:12}}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:8}}>{aiResult.name}</div>
              {aiResult.exercises?.map((e,i)=>(
                <div key={i} style={{fontSize:13,display:"flex",justifyContent:"space-between",marginBottom:4,color:"var(--color-text-secondary)"}}>
                  <span style={{color:"var(--color-text-primary)"}}>{e.name}</span>
                  <span>{e.sets} × {e.reps} @ {e.weight} lbs</span>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button style={S.btnPrimary} onClick={importAIPlan}>Save to my routines</button>
                <button style={S.btn} onClick={()=>setAiResult(null)}>Discard</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────
function AuthScreen({users,setUsers,sessions,setSessions,routines,setRoutines,authMode,setAuthMode,authForm,setAuthForm,authErr,setAuthErr,onLogin}) {
  const S2 = {
    wrap:{fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",maxWidth:340,margin:"0 auto",padding:"3rem 1.5rem",minHeight:"100dvh"},
    card:{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.5rem"},
    input:{width:"100%",boxSizing:"border-box",padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14,marginBottom:10},
    btn:{width:"100%",padding:"8px",borderRadius:"var(--border-radius-md)",border:"none",background:"#185FA5",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:500},
    link:{fontSize:13,color:"#185FA5",cursor:"pointer",textDecoration:"underline"},
  };
  function handle() {
    if (authMode==="login") {
      const u=users.find(u=>u.name.toLowerCase()===authForm.name.toLowerCase()&&u.password===authForm.password);
      if (u) onLogin(u); else setAuthErr("Wrong username or password.");
    } else {
      if (!authForm.name.trim()||!authForm.password.trim()){setAuthErr("Fill in all fields.");return;}
      if (users.find(u=>u.name.toLowerCase()===authForm.name.toLowerCase())){setAuthErr("Username taken.");return;}
      const nu={id:authForm.name.toLowerCase().replace(/\s/g,"_")+Date.now(),name:authForm.name,password:authForm.password};
      setUsers(p=>[...p,nu]);
      setSessions(p=>({...p,[nu.id]:[]}));
      setRoutines(p=>({...p,[nu.id]:[]}));
      onLogin(nu);
    }
  }
  return (
    <div style={S2.wrap}>
      <div style={{fontSize:22,fontWeight:500,marginBottom:"1.5rem",textAlign:"center"}}>Gym Bro</div>
      <div style={S2.card}>
        <div style={{fontSize:15,fontWeight:500,marginBottom:14}}>{authMode==="login"?"Sign in":"Create account"}</div>
        <input value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))} placeholder="Username" style={S2.input}/>
        <input type="password" value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))} placeholder="Password" style={S2.input} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {authErr && <div style={{color:"#A32D2D",fontSize:13,marginBottom:8}}>{authErr}</div>}
        <button style={S2.btn} onClick={handle}>{authMode==="login"?"Sign in":"Register"}</button>
        <div style={{textAlign:"center",marginTop:12}}>
          {authMode==="login"
            ?<span style={{fontSize:13}}>No account? <span style={S2.link} onClick={()=>{setAuthMode("register");setAuthErr("");}}>Register</span></span>
            :<span style={{fontSize:13}}>Have an account? <span style={S2.link} onClick={()=>{setAuthMode("login");setAuthErr("");}}>Sign in</span></span>
          }
        </div>
      </div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",textAlign:"center",marginTop:12}}>Demo: username "Alex" password "1234"</div>
    </div>
  );
}

// ─── ADD EXERCISE INLINE ──────────────────────────────────────────────────
function AddExerciseInline({onAdd}) {
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const res=DB.filter(e=>e.name.toLowerCase().includes(q.toLowerCase())).slice(0,8);
  return (
    <div style={{marginTop:8}}>
      {!open
        ? <button style={{padding:"6px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontSize:13}} onClick={()=>setOpen(true)}>+ Add exercise</button>
        : <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"0.75rem"}}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search exercise..." style={{width:"100%",boxSizing:"border-box",padding:"6px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,marginBottom:6}}/>
            {res.map(e=>(
              <div key={e.id} style={{padding:"5px 8px",fontSize:13,cursor:"pointer",borderRadius:4}} onClick={()=>{onAdd(e.name);setQ("");setOpen(false);}}>
                {e.name} <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{e.eq}</span>
              </div>
            ))}
            <button style={{fontSize:12,padding:"4px 10px",marginTop:4,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}} onClick={()=>setOpen(false)}>Cancel</button>
          </div>
      }
    </div>
  );
}

// ─── MINI PROGRESS BAR ────────────────────────────────────────────────────
function ProgressBar({sessions,exName}) {
  const pts=[];
  [...sessions].sort((a,b)=>a.date>b.date?1:-1).forEach(s=>{
    const ex=s.exercises.find(e=>e.name===exName);
    if(ex) pts.push({date:s.date,best:Math.max(...ex.sets.map(s=>s.w))});
  });
  if(pts.length<2) return null;
  const max=Math.max(...pts.map(p=>p.best));
  const min=Math.min(...pts.map(p=>p.best));
  const range=max-min||1;
  return (
    <div style={{display:"flex",gap:3,alignItems:"flex-end",height:28,marginTop:4}}>
      {pts.map((p,i)=>{
        const h=Math.round(8+((p.best-min)/range)*20);
        const isLast=i===pts.length-1;
        return <div key={i} title={`${p.date}: ${p.best} lbs`} style={{flex:1,height:h,background:isLast?"#185FA5":"var(--color-background-secondary)",border:`0.5px solid ${isLast?"#185FA5":"var(--color-border-secondary)"}`,borderRadius:2}}/>;
      })}
    </div>
  );
}
