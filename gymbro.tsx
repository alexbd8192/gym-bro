import { useState, useMemo, useEffect, useRef } from "react";

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
  {id:83,name:"Kettlebell Clean",muscle:"Glutes",eq:"Kettlebell",type:"Compound"},
  {id:84,name:"Kettlebell Snatch",muscle:"Shoulders",eq:"Kettlebell",type:"Compound"},
  {id:85,name:"Kettlebell Windmill",muscle:"Core",eq:"Kettlebell",type:"Compound"},
  {id:86,name:"Kettlebell Deadlift",muscle:"Back",eq:"Kettlebell",type:"Compound"},
  {id:87,name:"Kettlebell Halo",muscle:"Shoulders",eq:"Kettlebell",type:"Compound"},
  {id:88,name:"Kettlebell Around the World",muscle:"Core",eq:"Kettlebell",type:"Isolation"},
  {id:89,name:"Single Arm Kettlebell Row",muscle:"Back",eq:"Kettlebell",type:"Compound"},
  // Rings
  {id:90,name:"Ring Dip",muscle:"Triceps",eq:"Rings",type:"Compound"},
  {id:91,name:"Ring Push-Up",muscle:"Chest",eq:"Rings",type:"Compound"},
  {id:92,name:"Ring Row",muscle:"Back",eq:"Rings",type:"Compound"},
  {id:93,name:"Ring Pull-Up",muscle:"Back",eq:"Rings",type:"Compound"},
  {id:94,name:"Ring Muscle-Up",muscle:"Back",eq:"Rings",type:"Compound"},
  {id:95,name:"Ring L-Sit",muscle:"Core",eq:"Rings",type:"Isometric"},
  {id:96,name:"Ring Chest Fly",muscle:"Chest",eq:"Rings",type:"Isolation"},
  {id:97,name:"Ring Face Pull",muscle:"Shoulders",eq:"Rings",type:"Isolation"},
  {id:98,name:"Ring Pike Push-Up",muscle:"Shoulders",eq:"Rings",type:"Compound"},
  {id:99,name:"Ring Archer Push-Up",muscle:"Chest",eq:"Rings",type:"Compound"},
  {id:100,name:"Ring Bicep Curl",muscle:"Biceps",eq:"Rings",type:"Isolation"},
  {id:101,name:"Ring Tricep Extension",muscle:"Triceps",eq:"Rings",type:"Isolation"},
  {id:102,name:"Ring Rear Delt Row",muscle:"Shoulders",eq:"Rings",type:"Isolation"},
  {id:103,name:"Ring Body Saw",muscle:"Core",eq:"Rings",type:"Compound"},
  {id:104,name:"Ring Bulgarian Split Squat",muscle:"Quads",eq:"Rings",type:"Compound"},
  // More Barbell
  {id:105,name:"Pause Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:106,name:"Box Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:107,name:"Barbell Hack Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:108,name:"Barbell Bulgarian Split Squat",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:109,name:"Push Press",muscle:"Shoulders",eq:"Barbell",type:"Compound"},
  {id:110,name:"Bradford Press",muscle:"Shoulders",eq:"Barbell",type:"Compound"},
  {id:111,name:"Seated Good Morning",muscle:"Hamstrings",eq:"Barbell",type:"Compound"},
  {id:112,name:"Barbell Wrist Curl",muscle:"Forearms",eq:"Barbell",type:"Isolation"},
  {id:113,name:"Barbell Reverse Curl",muscle:"Forearms",eq:"Barbell",type:"Isolation"},
  {id:114,name:"Barbell Step-Up",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:115,name:"Barbell Drag Curl",muscle:"Biceps",eq:"Barbell",type:"Isolation"},
  {id:116,name:"Floor Press",muscle:"Chest",eq:"Barbell",type:"Compound"},
  // More Dumbbell
  {id:117,name:"Arnold Press",muscle:"Shoulders",eq:"Dumbbell",type:"Compound"},
  {id:118,name:"Dumbbell Pullover",muscle:"Chest",eq:"Dumbbell",type:"Compound"},
  {id:119,name:"Dumbbell Bulgarian Split Squat",muscle:"Quads",eq:"Dumbbell",type:"Compound"},
  {id:120,name:"Dumbbell Step-Up",muscle:"Quads",eq:"Dumbbell",type:"Compound"},
  {id:121,name:"Dumbbell Chest Supported Row",muscle:"Back",eq:"Dumbbell",type:"Compound"},
  {id:122,name:"Zottman Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:123,name:"Spider Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:124,name:"Concentration Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:125,name:"Waiter Curl",muscle:"Biceps",eq:"Dumbbell",type:"Isolation"},
  {id:126,name:"Dumbbell Prone Reverse Fly",muscle:"Shoulders",eq:"Dumbbell",type:"Isolation"},
  {id:127,name:"Dumbbell Floor Press",muscle:"Chest",eq:"Dumbbell",type:"Compound"},
  {id:128,name:"Dumbbell Romanian Split Deadlift",muscle:"Hamstrings",eq:"Dumbbell",type:"Compound"},
  {id:129,name:"Dumbbell Wrist Curl",muscle:"Forearms",eq:"Dumbbell",type:"Isolation"},
  {id:130,name:"Dumbbell Tate Press",muscle:"Triceps",eq:"Dumbbell",type:"Isolation"},
  // More Cable
  {id:131,name:"Cable Woodchop",muscle:"Core",eq:"Cable",type:"Compound"},
  {id:132,name:"Cable Pallof Press",muscle:"Core",eq:"Cable",type:"Isometric"},
  {id:133,name:"Cable Pull-Through",muscle:"Glutes",eq:"Cable",type:"Compound"},
  {id:134,name:"Cable Overhead Tricep Extension",muscle:"Triceps",eq:"Cable",type:"Isolation"},
  {id:135,name:"Cable Hammer Curl",muscle:"Biceps",eq:"Cable",type:"Isolation"},
  {id:136,name:"Single Arm Cable Row",muscle:"Back",eq:"Cable",type:"Compound"},
  {id:137,name:"Cable Rear Delt Row",muscle:"Shoulders",eq:"Cable",type:"Isolation"},
  {id:138,name:"Cable Hip Flexion",muscle:"Core",eq:"Cable",type:"Isolation"},
  {id:139,name:"Cable Straight Arm Pulldown",muscle:"Back",eq:"Cable",type:"Isolation"},
  {id:140,name:"Cable Reverse Fly",muscle:"Shoulders",eq:"Cable",type:"Isolation"},
  {id:141,name:"Cable Upright Row",muscle:"Shoulders",eq:"Cable",type:"Compound"},
  {id:142,name:"Cable Shrug",muscle:"Traps",eq:"Cable",type:"Isolation"},
  // More Machine
  {id:143,name:"Hack Squat Machine",muscle:"Quads",eq:"Machine",type:"Compound"},
  {id:144,name:"Pendulum Squat",muscle:"Quads",eq:"Machine",type:"Compound"},
  {id:145,name:"T-Bar Row",muscle:"Back",eq:"Machine",type:"Compound"},
  {id:146,name:"Chest Supported Row Machine",muscle:"Back",eq:"Machine",type:"Compound"},
  {id:147,name:"Preacher Curl Machine",muscle:"Biceps",eq:"Machine",type:"Isolation"},
  {id:148,name:"Tricep Dip Machine",muscle:"Triceps",eq:"Machine",type:"Isolation"},
  {id:149,name:"Glute Kickback Machine",muscle:"Glutes",eq:"Machine",type:"Isolation"},
  {id:150,name:"Lying Leg Curl",muscle:"Hamstrings",eq:"Machine",type:"Isolation"},
  {id:151,name:"Standing Leg Curl",muscle:"Hamstrings",eq:"Machine",type:"Isolation"},
  {id:152,name:"Hip Abduction Machine",muscle:"Abductors",eq:"Machine",type:"Isolation"},
  {id:153,name:"Standing Calf Raise Machine",muscle:"Calves",eq:"Machine",type:"Isolation"},
  {id:154,name:"Neck Machine",muscle:"Neck",eq:"Machine",type:"Isolation"},
  // More Bodyweight
  {id:155,name:"Muscle-Up",muscle:"Back",eq:"Bodyweight",type:"Compound"},
  {id:156,name:"L-Sit",muscle:"Core",eq:"Bodyweight",type:"Isometric"},
  {id:157,name:"Dragon Flag",muscle:"Core",eq:"Bodyweight",type:"Compound"},
  {id:158,name:"Front Lever",muscle:"Back",eq:"Bodyweight",type:"Isometric"},
  {id:159,name:"Back Lever",muscle:"Chest",eq:"Bodyweight",type:"Isometric"},
  {id:160,name:"Pike Push-Up",muscle:"Shoulders",eq:"Bodyweight",type:"Compound"},
  {id:161,name:"Diamond Push-Up",muscle:"Triceps",eq:"Bodyweight",type:"Compound"},
  {id:162,name:"Wide Push-Up",muscle:"Chest",eq:"Bodyweight",type:"Compound"},
  {id:163,name:"Archer Push-Up",muscle:"Chest",eq:"Bodyweight",type:"Compound"},
  {id:164,name:"Decline Push-Up",muscle:"Chest",eq:"Bodyweight",type:"Compound"},
  {id:165,name:"Bulgarian Split Squat",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:166,name:"Box Jump",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:167,name:"Jump Squat",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:168,name:"Jumping Lunge",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:169,name:"Wall Sit",muscle:"Quads",eq:"Bodyweight",type:"Isometric"},
  {id:170,name:"Reverse Crunch",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:171,name:"V-Up",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:172,name:"Russian Twist",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:173,name:"Lying Leg Raise",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:174,name:"Toes to Bar",muscle:"Core",eq:"Bodyweight",type:"Isolation"},
  {id:175,name:"Hollow Body Hold",muscle:"Core",eq:"Bodyweight",type:"Isometric"},
  {id:176,name:"Superman Hold",muscle:"Back",eq:"Bodyweight",type:"Isometric"},
  {id:177,name:"Bodyweight Calf Raise",muscle:"Calves",eq:"Bodyweight",type:"Isolation"},
  {id:178,name:"Step-Up",muscle:"Quads",eq:"Bodyweight",type:"Compound"},
  {id:179,name:"Sissy Squat",muscle:"Quads",eq:"Bodyweight",type:"Isolation"},
  // Bands
  {id:180,name:"Band Pull Apart",muscle:"Shoulders",eq:"Bands",type:"Isolation"},
  {id:181,name:"Band Face Pull",muscle:"Shoulders",eq:"Bands",type:"Isolation"},
  {id:182,name:"Band Lateral Walk",muscle:"Glutes",eq:"Bands",type:"Isolation"},
  {id:183,name:"Band Tricep Pushdown",muscle:"Triceps",eq:"Bands",type:"Isolation"},
  {id:184,name:"Band Bicep Curl",muscle:"Biceps",eq:"Bands",type:"Isolation"},
  {id:185,name:"Band Squat",muscle:"Quads",eq:"Bands",type:"Compound"},
  {id:186,name:"Band Hip Thrust",muscle:"Glutes",eq:"Bands",type:"Compound"},
  {id:187,name:"Band Good Morning",muscle:"Hamstrings",eq:"Bands",type:"Compound"},
  {id:188,name:"Band Overhead Press",muscle:"Shoulders",eq:"Bands",type:"Compound"},
  {id:189,name:"Band Row",muscle:"Back",eq:"Bands",type:"Compound"},
  {id:190,name:"Band Clamshell",muscle:"Glutes",eq:"Bands",type:"Isolation"},

  // Traps
  {id:191,name:"Barbell Shrug",muscle:"Traps",eq:"Barbell",type:"Isolation"},
  {id:192,name:"Rack Pull",muscle:"Traps",eq:"Barbell",type:"Compound"},
  {id:193,name:"Barbell High Pull",muscle:"Traps",eq:"Barbell",type:"Compound"},
  {id:194,name:"Dumbbell Upright Row",muscle:"Traps",eq:"Dumbbell",type:"Compound"},
  {id:195,name:"Farmer's Walk",muscle:"Traps",eq:"Dumbbell",type:"Compound"},
  {id:196,name:"Trap Bar Shrug",muscle:"Traps",eq:"Barbell",type:"Isolation"},

  // Calves
  {id:197,name:"Barbell Calf Raise",muscle:"Calves",eq:"Barbell",type:"Isolation"},
  {id:198,name:"Single Leg Calf Raise",muscle:"Calves",eq:"Bodyweight",type:"Isolation"},
  {id:199,name:"Calf Press on Leg Press",muscle:"Calves",eq:"Machine",type:"Isolation"},
  {id:200,name:"Tibialis Raise",muscle:"Calves",eq:"Bodyweight",type:"Isolation"},
  {id:201,name:"Jump Rope",muscle:"Calves",eq:"Bodyweight",type:"Compound"},

  // Abs (Core additions)
  {id:202,name:"Crunch",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},
  {id:203,name:"Sit-Up",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},
  {id:204,name:"Decline Sit-Up",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},
  {id:205,name:"Bicycle Crunch",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},
  {id:206,name:"Side Crunch",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},
  {id:207,name:"Kneeling Cable Crunch",muscle:"Abs",eq:"Cable",type:"Isolation"},
  {id:208,name:"Ab Machine",muscle:"Abs",eq:"Machine",type:"Isolation"},
  {id:209,name:"Decline Crunch",muscle:"Abs",eq:"Bodyweight",type:"Isolation"},

  // Neck
  {id:210,name:"Neck Flexion",muscle:"Neck",eq:"Bodyweight",type:"Isolation"},
  {id:211,name:"Neck Extension",muscle:"Neck",eq:"Bodyweight",type:"Isolation"},
  {id:212,name:"Neck Lateral Flexion",muscle:"Neck",eq:"Bodyweight",type:"Isolation"},
  {id:213,name:"Wrestler's Bridge",muscle:"Neck",eq:"Bodyweight",type:"Isometric"},

  // Forearms (additions)
  {id:214,name:"Wrist Roller",muscle:"Forearms",eq:"Bodyweight",type:"Isolation"},
  {id:215,name:"Dead Hang",muscle:"Forearms",eq:"Bodyweight",type:"Isometric"},
  {id:216,name:"Plate Pinch",muscle:"Forearms",eq:"Barbell",type:"Isometric"},
  {id:217,name:"Reverse Wrist Curl",muscle:"Forearms",eq:"Dumbbell",type:"Isolation"},

  // Adductors / Abductors (additions)
  {id:218,name:"Sumo Squat",muscle:"Adductors",eq:"Dumbbell",type:"Compound"},
  {id:219,name:"Copenhagen Plank",muscle:"Adductors",eq:"Bodyweight",type:"Isometric"},
  {id:220,name:"Side Lying Leg Raise",muscle:"Abductors",eq:"Bodyweight",type:"Isolation"},
  {id:221,name:"Clamshell",muscle:"Abductors",eq:"Bodyweight",type:"Isolation"},
];

const EQ_TYPES = ["All", "Barbell", "EZ Bar", "Smith Machine", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell", "Rings", "Bands"];
const MUSCLES = ["All", ...new Set(DB.map(e => e.muscle)).values()];

// Bar weights in lbs
const BARS = [
  {name:"Barbell", weight:45},
  {name:"Smith Machine", weight:35},
  {name:"EZ Bar", weight:20},
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

// ─── THEMES ───────────────────────────────────────────────────────────────
const THEMES: Record<string,{name:string,emoji:string,[k:string]:string}> = {
  matrix: {
    name:"Matrix", emoji:"🖥️",
    "--color-body-bg":              "#090b09",
    "--color-background-primary":   "#0d0f0d",
    "--color-background-secondary": "#111611",
    "--color-text-primary":         "#c8f0c8",
    "--color-text-secondary":       "#5a8a5a",
    "--color-border-secondary":     "#2a4a2a",
    "--color-border-tertiary":      "#1a301a",
    "--color-accent":               "#00cc55",
  },
  harrypotter: {
    name:"Harry Potter", emoji:"⚡",
    "--color-body-bg":              "#120602",
    "--color-background-primary":   "#1c0905",
    "--color-background-secondary": "#2a1208",
    "--color-text-primary":         "#f0e0b0",
    "--color-text-secondary":       "#c09040",
    "--color-border-secondary":     "#5a2810",
    "--color-border-tertiary":      "#3a1808",
    "--color-accent":               "#c0392b",
  },
  lotr: {
    name:"Lord of the Rings", emoji:"💍",
    "--color-body-bg":              "#080600",
    "--color-background-primary":   "#0e0b06",
    "--color-background-secondary": "#1a1508",
    "--color-text-primary":         "#e8d5a0",
    "--color-text-secondary":       "#8a7040",
    "--color-border-secondary":     "#3a3015",
    "--color-border-tertiary":      "#252010",
    "--color-accent":               "#b8860b",
  },
  sonic: {
    name:"Sonic", emoji:"🦔",
    "--color-body-bg":              "#000820",
    "--color-background-primary":   "#000c3a",
    "--color-background-secondary": "#001055",
    "--color-text-primary":         "#70d8ff",
    "--color-text-secondary":       "#ffcc00",
    "--color-border-secondary":     "#0044bb",
    "--color-border-tertiary":      "#002288",
    "--color-accent":               "#ffcc00",
  },
  zelda: {
    name:"Zelda", emoji:"🗡️",
    "--color-body-bg":              "#030800",
    "--color-background-primary":   "#060e03",
    "--color-background-secondary": "#0b1a05",
    "--color-text-primary":         "#a8e060",
    "--color-text-secondary":       "#d4a820",
    "--color-border-secondary":     "#2a5010",
    "--color-border-tertiary":      "#1a3208",
    "--color-accent":               "#d4a820",
  },
  wow: {
    name:"World of Warcraft", emoji:"⚔️",
    "--color-body-bg":              "#060810",
    "--color-background-primary":   "#0a0e1a",
    "--color-background-secondary": "#10182a",
    "--color-text-primary":         "#f0c060",
    "--color-text-secondary":       "#8090c0",
    "--color-border-secondary":     "#2a3870",
    "--color-border-tertiary":      "#1a2450",
    "--color-accent":               "#c89030",
  },
  daylight: {
    name:"Daylight", emoji:"☀️",
    "--color-body-bg":              "#eeeeee",
    "--color-background-primary":   "#ffffff",
    "--color-background-secondary": "#f5f5f5",
    "--color-text-primary":         "#1a1a1a",
    "--color-text-secondary":       "#666666",
    "--color-border-secondary":     "#d0d0d0",
    "--color-border-tertiary":      "#e8e8e8",
    "--color-accent":               "#185FA5",
  },
};

// ─── STYLES ───────────────────────────────────────────────────────────────
const S = {
  wrap: {fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",maxWidth:540,margin:"0 auto",padding:"0 1rem 6rem"},
  header: {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.25rem 0 0.75rem"},
  logo: {fontSize:20,fontWeight:500},
  tabs: {display:"flex",gap:2,borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:"1.25rem",position:"relative"},
  tabBtn: a=>({padding:"8px 12px",fontSize:12,background:"none",border:"none",borderBottom:a?"2px solid var(--color-text-primary)":"2px solid transparent",color:a?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",fontWeight:a?500:400,whiteSpace:"nowrap"}),
  card: {background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:10},
  cardSec: {background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",marginBottom:10},
  label: {fontSize:12,color:"var(--color-text-secondary)",marginBottom:4,marginTop:10},
  input: {width:"100%",boxSizing:"border-box",padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  sm: {width:68,padding:"5px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  btn: {padding:"6px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontSize:13},
  btnPrimary: {padding:"7px 16px",borderRadius:"var(--border-radius-md)",border:"none",background:"var(--color-accent)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500},
  btnDanger: {padding:"6px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #A32D2D",background:"transparent",color:"#A32D2D",cursor:"pointer",fontSize:12},
  tag: c=>({fontSize:11,padding:"2px 8px",borderRadius:10,background:c+"22",color:c,fontWeight:500,display:"inline-block"}),
  prBadge: {fontSize:11,padding:"2px 7px",borderRadius:10,background:"#FAEEDA",color:"#BA7517",fontWeight:500},
  metricRow: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:"1rem"},
  metric: {background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.75rem",textAlign:"center"},
  metricVal: {fontSize:22,fontWeight:500},
  metricLbl: {fontSize:11,color:"var(--color-text-secondary)",marginTop:2},
  row: {display:"flex",gap:8,alignItems:"center"},
  pill: (a,c)=>({padding:"4px 12px",borderRadius:20,border:`1.5px solid ${a?c:"var(--color-border-tertiary)"}`,background:a?c+"22":"transparent",color:a?c:"var(--color-text-secondary)",fontSize:13,cursor:"pointer",fontWeight:a?500:400}),
  secTitle: {fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:"var(--color-text-secondary)",marginBottom:10,marginTop:"1.75rem"},
};

// ─── STORAGE INIT ─────────────────────────────────────────────────────────
function loadSaved() {
  try {
    const raw = localStorage.getItem("gymbro_state");
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}
const _saved = loadSaved();

function calcAge(birthDate:string) {
  if (!birthDate) return null;
  const today = new Date(), birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() - birth.getMonth() < 0 || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}
function cmToFtIn(cm:number) {
  const inches = cm/2.54, ft = Math.floor(inches/12);
  return `${ft}'${Math.round(inches%12)}"`;
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function GymBro() {
  const [users, setUsers] = useState(_saved?.users ?? DEMO_USERS);
  const [sessions, setSessions] = useState(_saved?.sessions ?? DEMO_SESSIONS);
  const [routines, setRoutines] = useState(_saved?.routines ?? DEMO_ROUTINES);
  const [loggedIn, setLoggedIn] = useState(_saved?.loggedIn ?? null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({name:"",password:""});
  const [authErr, setAuthErr] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if (!moreOpen) return;
    const handler = (e:MouseEvent)=>{ if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[moreOpen]);

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

  // Calendar state
  const [calSelectedDay, setCalSelectedDay] = useState(null);
  const [logCalSelectedDay, setLogCalSelectedDay] = useState(null);

  // Dashboard session detail state
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [e1rmTooltip, setE1rmTooltip] = useState(false);

  // Routines archive UI state
  const [showArchived, setShowArchived] = useState(false);

  const [theme, setTheme] = useState(_saved?.theme ?? "matrix");
  const [profiles, setProfiles] = useState<Record<string,any>>(_saved?.profiles ?? {});
  const [profileWeightInput, setProfileWeightInput] = useState("");

  // ── Routine delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── DB FILTER (must be before early return — Rules of Hooks) ──
  const filteredDB = useMemo(()=>DB.filter(e=>
    (dbEq==="All"||e.eq===dbEq)&&
    (dbMuscle==="All"||e.muscle===dbMuscle)&&
    e.name.toLowerCase().includes(dbSearch.toLowerCase())
  ),[dbEq,dbMuscle,dbSearch]);

  // ── PERSIST ──
  useEffect(()=>{
    localStorage.setItem("gymbro_state", JSON.stringify({users,sessions,routines,loggedIn,theme,profiles}));
  },[users,sessions,routines,loggedIn,theme]);

  useEffect(()=>{
    const t = THEMES[theme] || THEMES.matrix;
    Object.entries(t).forEach(([k,v])=>{ if(k.startsWith("--")) document.documentElement.style.setProperty(k,v); });
    document.documentElement.style.setProperty("--color-body-bg", t["--color-body-bg"]);
  },[theme]);

  if (!loggedIn) return <AuthScreen users={users} setUsers={setUsers} sessions={sessions} setSessions={setSessions} routines={routines} setRoutines={setRoutines} authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} authErr={authErr} setAuthErr={setAuthErr} onLogin={u=>{setLoggedIn(u);setAuthErr("");}} theme={theme} setTheme={setTheme} />;

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

  function archiveRoutine(id) {
    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===id?{...r,archived:true}:r)}));
  }

  function unarchiveRoutine(id) {
    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===id?{...r,archived:false}:r)}));
  }

  // ── CALC ──
  const bar = BARS[barIdx];
  const plates = unit==="lbs" ? PLATES_LBS : PLATES_KG;
  const barW = unit==="lbs" ? bar.weight : Math.round(bar.weight*0.453592*10)/10;
  const plateList = calcPlates(targetW, barW, plates);

  // ── CALENDAR ──
  const sessionsByDate: Record<string,typeof userSessions> = {};
  userSessions.forEach(s=>{ sessionsByDate[s.date]=(sessionsByDate[s.date]||[]); sessionsByDate[s.date].push(s); });
  const todayDT = new Date();
  const todayDow = todayDT.getDay(); // 0=Sun
  const daysSinceMon = todayDow === 0 ? 6 : todayDow - 1;
  const calStart = new Date(todayDT);
  calStart.setDate(todayDT.getDate() - daysSinceMon - 28); // 5 weeks back, starting Monday
  const calDays = Array.from({length:35},(_,i)=>{ const d=new Date(calStart); d.setDate(calStart.getDate()+i); return d.toISOString().split("T")[0]; });
  const calDayLabels = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <span style={S.logo}>💪 Gym Bro 💪</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{loggedIn.name}</span>
          <button style={S.btn} onClick={()=>setLoggedIn(null)}>Sign out</button>
        </div>
      </div>

      <div style={S.tabs}>
        {[["dashboard","Dashboard"],["log","Session"],["routines","Routines"],["calc","Calc"]].map(([id,lbl])=>(
          <button key={id} style={S.tabBtn(tab===id)} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
        <div ref={moreRef} style={{position:"relative",marginLeft:"auto"}}>
          <button
            style={S.tabBtn(["progress","db","profile"].includes(tab) || moreOpen)}
            onClick={()=>setMoreOpen(o=>!o)}
          >
            {tab==="progress"?"Progress":tab==="db"?"Exercises":tab==="profile"?"Profile":"More"} ▾
          </button>
          {moreOpen && (
            <div style={{position:"absolute",right:0,top:"100%",background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",zIndex:100,minWidth:120,boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>
              {[["progress","Progress"],["db","Exercises"],["profile","Profile"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>{setTab(id);setMoreOpen(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",fontSize:12,background:tab===id?"var(--color-background-secondary)":"none",border:"none",color:tab===id?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-mono)"}}>
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DASHBOARD ── */}
      {tab==="dashboard" && (
        <div>
          <div style={S.metricRow}>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("log")}><div style={S.metricVal}>{userSessions.length}</div><div style={S.metricLbl}>sessions</div></div>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("progress")}><div style={S.metricVal}>{Object.keys(prs).length}</div><div style={S.metricLbl}>PRs</div></div>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("routines")}><div style={S.metricVal}>{userRoutines.length}</div><div style={S.metricLbl}>routines</div></div>
          </div>
          <div style={S.secTitle}>Last 5 weeks</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
            {calDayLabels.map(l=><div key={l} style={{textAlign:"center",fontSize:10,color:"var(--color-text-secondary)",paddingBottom:2}}>{l}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:"0.5rem"}}>
            {calDays.map(d=>{
              const sessionsOnDay = sessionsByDate[d]||[];
              const hasSesh = sessionsOnDay.length > 0;
              const isToday = d === today;
              const isFuture = d > today;
              const isSelected = d === calSelectedDay;
              const dayNum = new Date(d+"T12:00:00").getDate();
              return (
                <div key={d}
                  onClick={()=>hasSesh&&setCalSelectedDay(isSelected?null:d)}
                  style={{
                    height:40,borderRadius:4,
                    background: hasSesh ? "var(--color-accent)22" : "var(--color-background-secondary)",
                    border: isSelected ? `2px solid var(--color-accent)` : isToday ? `1.5px solid var(--color-text-secondary)` : "0.5px solid var(--color-border-tertiary)",
                    cursor: hasSesh ? "pointer" : "default",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
                    opacity: isFuture ? 0.3 : 1,
                  }}>
                  <span style={{fontSize:11,fontWeight:isToday?600:400,color:hasSesh?"var(--color-accent)":isToday?"var(--color-text-primary)":"var(--color-text-secondary)"}}>{dayNum}</span>
                  {hasSesh && <div style={{width:4,height:4,borderRadius:"50%",background:"var(--color-accent)"}}/>}
                </div>
              );
            })}
          </div>
          {calSelectedDay && sessionsByDate[calSelectedDay] && (
            <div style={{...S.card,marginBottom:"1rem",borderColor:"var(--color-accent)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:500}}>
                  {new Date(calSelectedDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                </span>
                <button style={{...S.btn,padding:"2px 8px",fontSize:11}} onClick={()=>setCalSelectedDay(null)}>✕</button>
              </div>
              {sessionsByDate[calSelectedDay].map((s,i)=>(
                <div key={i} style={{marginBottom:i<sessionsByDate[calSelectedDay].length-1?12:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--color-accent)",marginBottom:4}}>{s.routineName}</div>
                  {s.exercises.map((ex,j)=>(
                    <div key={j} style={{fontSize:12,marginBottom:3}}>
                      <span style={{color:"var(--color-text-primary)",fontWeight:500}}>{ex.name}</span>
                      <span style={{color:"var(--color-text-secondary)"}}> — {ex.sets.map(st=>`${st.w}×${st.r}`).join(", ")}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {(()=>{
            const ALL_MUSCLES = ["Chest","Back","Shoulders","Traps","Biceps","Triceps","Forearms","Abs","Core","Quads","Hamstrings","Glutes","Adductors","Abductors","Calves","Neck"];
            const last6 = userSessions.slice(0,6);
            const muscleSets: Record<string,number> = {};
            ALL_MUSCLES.forEach(m=>{ muscleSets[m]=0; });
            last6.forEach(s=>s.exercises.forEach(ex=>{
              const dbEx = DB.find(d=>d.name===ex.name);
              const muscle = dbEx?.muscle;
              if (muscle && muscleSets[muscle]!==undefined) muscleSets[muscle] += ex.sets.length;
            }));
            const maxSets = Math.max(...Object.values(muscleSets), 1);
            return (
              <div style={{marginTop:"1rem",marginBottom:"1rem"}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Muscle focus · last 6 sessions</div>
                {ALL_MUSCLES.map(muscle=>{
                  const count = muscleSets[muscle] || 0;
                  const pct = count / maxSets;
                  const color = count === 0 ? "var(--color-border-secondary)" : pct >= 0.75 ? "var(--color-accent)" : pct >= 0.35 ? "#F0992B" : "#E24B4A";
                  return (
                    <div key={muscle} style={{marginBottom:5}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                        <span style={{color: count===0 ? "var(--color-text-secondary)" : "var(--color-text-primary)"}}>{muscle}</span>
                        <span style={{color:"var(--color-text-secondary)"}}>{count === 0 ? "—" : `${count} set${count!==1?"s":""}`}</span>
                      </div>
                      <div style={{height:5,borderRadius:3,background:"var(--color-background-secondary)"}}>
                        <div style={{height:5,borderRadius:3,width: count===0 ? "2px" : `${Math.round(pct*100)}%`,background:color,transition:"width 0.3s"}}/>
                      </div>
                    </div>
                  );
                })}
                <div style={{fontSize:10,color:"var(--color-text-secondary)",marginTop:8}}>
                  <span style={{color:"var(--color-accent)"}}>■</span> high volume &nbsp;
                  <span style={{color:"#F0992B"}}>■</span> moderate &nbsp;
                  <span style={{color:"#E24B4A"}}>■</span> low &nbsp;
                  <span style={{color:"var(--color-border-secondary)"}}>■</span> untrained
                </div>
              </div>
            );
          })()}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:"1rem",marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:500}}>Top PRs</span>
            <div style={{position:"relative",display:"inline-flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>heaviest set · e1RM = Epley</span>
              <span
                onClick={()=>setE1rmTooltip(v=>!v)}
                style={{fontSize:11,color:"var(--color-accent)",cursor:"pointer",userSelect:"none"}}
              >ⓘ</span>
              {e1rmTooltip && (
                <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",width:230,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 12px",zIndex:100,boxShadow:"0 4px 16px rgba(0,0,0,0.4)",fontSize:11,lineHeight:1.6,color:"var(--color-text-secondary)"}}>
                  <div style={{fontWeight:600,color:"var(--color-text-primary)",marginBottom:4}}>What is e1RM?</div>
                  <div>e1RM is your <em>estimated one-rep max</em> — the maximum weight you could theoretically lift for a single rep.</div>
                  <div style={{marginTop:6}}>It's calculated from your heaviest logged set using the <strong>Epley formula</strong>:</div>
                  <div style={{marginTop:6,padding:"4px 8px",background:"var(--color-background-secondary)",borderRadius:4,fontFamily:"var(--font-mono)"}}>weight × (1 + reps / 30)</div>
                  <div style={{marginTop:6}}>e.g. 200 lbs × 8 reps → e1RM ≈ 253 lbs</div>
                  <div style={{marginTop:8,fontSize:10,color:"var(--color-text-secondary)"}}>Most accurate for sets of 3–10 reps.</div>
                  <button onClick={()=>setE1rmTooltip(false)} style={{marginTop:8,fontSize:10,background:"none",border:"none",color:"var(--color-accent)",cursor:"pointer",padding:0}}>close</button>
                </div>
              )}
            </div>
          </div>
          {Object.entries(prs).slice(0,5).map(([ex,pr])=>{
            const w = parseFloat(pr.w); const r = parseFloat(pr.r);
            const e1rm = (!isNaN(w)&&!isNaN(r)&&r>1) ? Math.round(w*(1+r/30)) : null;
            return (
              <div key={ex} style={S.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:500}}>{ex}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={S.prBadge}>{pr.w} lbs × {pr.r} reps</span>
                    {e1rm && <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>e1RM ~{e1rm}</span>}
                  </div>
                </div>
                <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:3}}>{pr.date}</div>
              </div>
            );
          })}
          <div style={S.secTitle}>Recent sessions</div>
          {userSessions.slice(0,3).map(s=>{
            const isOpen = selectedSessionId === s.id;
            return (
              <div key={s.id} style={{...S.card,cursor:"pointer",borderColor:isOpen?"var(--color-accent)":undefined}}
                onClick={()=>setSelectedSessionId(isOpen?null:s.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:500}}>{s.routineName}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.date}</span>
                    <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{isOpen?"▲":"▼"}</span>
                  </div>
                </div>
                {!isOpen && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{s.exercises.map(e=>e.name).join(", ")}</div>}
                {isOpen && (
                  <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}}>
                    {s.exercises.map((ex,j)=>(
                      <div key={j} style={{marginBottom:6}}>
                        <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{ex.name}</span>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:3}}>
                          {ex.sets.map((st,k)=>(
                            <span key={k} style={{fontSize:11,padding:"2px 7px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                              Set {k+1}: {st.w} lbs × {st.r}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── LOG ── */}
      {tab==="log" && (
        <div>
          {!activeSession ? (
            <div>
              <div style={S.secTitle}>Start a session</div>
              <button style={{...S.btnPrimary,marginBottom:8,width:"100%"}} onClick={()=>startSession(null)}>Freestyle session</button>
              {userRoutines.filter(r=>!r.archived).map(r=>(
                <div key={r.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{r.name}</div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.exercises.length} exercises</div>
                  </div>
                  <button style={S.btnPrimary} onClick={()=>startSession(r)}>Start</button>
                </div>
              ))}
              <div style={S.secTitle}>Recent sessions</div>
              {userSessions.slice(0,5).map(s=>(
                <div key={s.id} style={S.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:500}}>{s.routineName}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.date}</span>
                      <button style={S.btn} onClick={e=>{e.stopPropagation();editSession(s);}}>Edit</button>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.exercises.map(e=>e.name).join(", ")}</div>
                </div>
              ))}
              <div style={S.secTitle}>History calendar</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                {calDayLabels.map(l=><div key={l} style={{textAlign:"center",fontSize:10,color:"var(--color-text-secondary)",paddingBottom:2}}>{l}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:"0.5rem"}}>
                {calDays.map(d=>{
                  const sessionsOnDay = sessionsByDate[d]||[];
                  const hasSesh = sessionsOnDay.length>0;
                  const isToday = d===today;
                  const isFuture = d>today;
                  const isSelected = d===logCalSelectedDay;
                  const dayNum = new Date(d+"T12:00:00").getDate();
                  return (
                    <div key={d} onClick={()=>hasSesh&&setLogCalSelectedDay(isSelected?null:d)}
                      style={{height:40,borderRadius:4,background:hasSesh?"var(--color-accent)22":"var(--color-background-secondary)",border:isSelected?`2px solid var(--color-accent)`:isToday?`1.5px solid var(--color-text-secondary)`:"0.5px solid var(--color-border-tertiary)",cursor:hasSesh?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,opacity:isFuture?0.3:1}}>
                      <span style={{fontSize:11,fontWeight:isToday?600:400,color:hasSesh?"var(--color-accent)":isToday?"var(--color-text-primary)":"var(--color-text-secondary)"}}>{dayNum}</span>
                      {hasSesh&&<div style={{width:4,height:4,borderRadius:"50%",background:"var(--color-accent)"}}/>}
                    </div>
                  );
                })}
              </div>
              {logCalSelectedDay && sessionsByDate[logCalSelectedDay] && (
                <div style={{...S.card,borderColor:"var(--color-accent)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:500}}>
                      {new Date(logCalSelectedDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                    </span>
                    <button style={{...S.btn,padding:"2px 8px",fontSize:11}} onClick={()=>setLogCalSelectedDay(null)}>✕</button>
                  </div>
                  {sessionsByDate[logCalSelectedDay].map((s,i)=>(
                    <div key={i} style={{marginBottom:i<sessionsByDate[logCalSelectedDay].length-1?12:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:13,fontWeight:500,color:"var(--color-accent)"}}>{s.routineName}</span>
                        <button style={S.btn} onClick={()=>{editSession(s);setLogCalSelectedDay(null);}}>Edit</button>
                      </div>
                      {s.exercises.map((ex,j)=>(
                        <div key={j} style={{marginBottom:4}}>
                          <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{ex.name}</span>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:2}}>
                            {ex.sets.map((st,k)=>(
                              <span key={k} style={{fontSize:11,padding:"2px 7px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                                Set {k+1}: {st.w}×{st.r}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
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
                        <input type="text" inputMode="decimal" value={set.w} placeholder="lbs" style={S.sm} onChange={e=>{
                          setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:exs[ei].sets.map((s,j)=>j===si?{...s,w:e.target.value}:s)};return {...prev,exercises:exs};});
                        }}/>
                        <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>×</span>
                        <input type="text" inputMode="numeric" value={set.r} placeholder="reps" style={S.sm} onChange={e=>{
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
                        {up?"↑":"↓"} {Math.abs(pct)}%{pct>=3?" ❤️":""}
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
              {userRoutines.filter(r=>!r.archived).map(r=>(
                <div key={r.id} style={S.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:15,fontWeight:500}}>{r.name}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {confirmDeleteId===r.id ? (
                        <>
                          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>Sure?</span>
                          <button style={S.btnDanger} onClick={()=>{deleteRoutine(r.id);setConfirmDeleteId(null);}}>Yes</button>
                          <button style={S.btn} onClick={()=>setConfirmDeleteId(null)}>No</button>
                        </>
                      ) : (
                        <>
                          <button style={S.btn} onClick={()=>editRoutine(r)}>Edit</button>
                          <button style={S.btn} onClick={()=>archiveRoutine(r.id)}>Archive</button>
                          <button style={S.btnDanger} onClick={()=>setConfirmDeleteId(r.id)}>Delete</button>
                        </>
                      )}
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
              {userRoutines.some(r=>r.archived) && (
                <div style={{marginTop:"1.5rem"}}>
                  <button style={{...S.btn,width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between"}} onClick={()=>setShowArchived(v=>!v)}>
                    <span>Archive ({userRoutines.filter(r=>r.archived).length})</span>
                    <span>{showArchived?"▲":"▼"}</span>
                  </button>
                  {showArchived && userRoutines.filter(r=>r.archived).map(r=>(
                    <div key={r.id} style={{...S.card,opacity:0.7,marginTop:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:14,fontWeight:500,color:"var(--color-text-secondary)"}}>{r.name}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <button style={S.btn} onClick={()=>unarchiveRoutine(r.id)}>Restore</button>
                          {confirmDeleteId===r.id ? (
                            <>
                              <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>Sure?</span>
                              <button style={S.btnDanger} onClick={()=>{deleteRoutine(r.id);setConfirmDeleteId(null);}}>Yes</button>
                              <button style={S.btn} onClick={()=>setConfirmDeleteId(null)}>No</button>
                            </>
                          ) : (
                            <button style={S.btnDanger} onClick={()=>setConfirmDeleteId(r.id)}>Delete</button>
                          )}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.exercises.map(e=>e.name).join(", ")}</div>
                    </div>
                  ))}
                </div>
              )}
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
            {["lbs","kg"].map(u=><button key={u} style={S.pill(unit===u,"var(--color-accent)")} onClick={()=>{setUnit(u);setTargetW(u==="lbs"?135:60);}}>{u}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {BARS.map((b,i)=><button key={b.name} style={S.pill(barIdx===i,"#3B6D11")} onClick={()=>setBarIdx(i)}>{b.name} ({unit==="lbs"?b.weight:Math.round(b.weight*0.453592)})</button>)}
          </div>
          <div style={S.label}>Target weight ({unit})</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <input type="range" min={barW} max={unit==="lbs"?500:225} step={unit==="lbs"?5:2.5} value={targetW} onChange={e=>setTargetW(Number(e.target.value))} style={{flex:1}}/>
            <button style={S.btn} onClick={()=>setTargetW(prev=>Math.max(barW,prev-(unit==="lbs"?5:2.5)))}>-5</button>
            <input type="text" inputMode="decimal" value={targetW} style={{...S.sm,width:64,textAlign:"center"}} onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setTargetW(Math.max(barW,v));}}/>
            <button style={S.btn} onClick={()=>setTargetW(prev=>prev+(unit==="lbs"?5:2.5))}>+5</button>
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
            {EQ_TYPES.map(t=><button key={t} style={S.pill(dbEq===t,"var(--color-accent)")} onClick={()=>setDbEq(t)}>{t}</button>)}
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
                  <span style={S.tag("var(--color-accent)")}>{ex.muscle}</span>
                  <span style={S.tag("#3B6D11")}>{ex.eq}</span>
                </div>
              </div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{ex.type}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE ── */}
      {tab==="profile" && (()=>{
        const profile = profiles[uid] || {};
        const age = calcAge(profile.birthDate);
        const weightUnit = profile.weightUnit || "lbs";
        const weights: any[] = profile.weights || [];
        const lastWeight = weights[weights.length-1];
        const prevWeight = weights[weights.length-2];
        const weightDiff = lastWeight && prevWeight ? (lastWeight.value - prevWeight.value).toFixed(1) : null;

        function saveProfile(updates:any) {
          setProfiles(prev=>({...prev,[uid]:{...(prev[uid]||{}),...updates}}));
        }
        function addWeight() {
          const v = parseFloat(profileWeightInput);
          if (isNaN(v) || v<=0) return;
          saveProfile({weights:[...weights,{date:today,value:v}]});
          setProfileWeightInput("");
        }

        return (
          <div>
            <div style={S.secTitle}>Personal info</div>
            <div style={S.card}>
              <div style={{marginBottom:12}}>
                <div style={S.label}>Name</div>
                <div style={{fontSize:14,color:"var(--color-text-primary)"}}>{loggedIn.name}</div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={S.label}>Birth date</div>
                  <input type="date" value={profile.birthDate||""} onChange={e=>saveProfile({birthDate:e.target.value})} style={S.input}/>
                </div>
                <div style={{flex:1}}>
                  <div style={S.label}>Age</div>
                  <div style={{fontSize:22,fontWeight:500,paddingTop:8}}>{age ?? "—"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:2}}>
                  <div style={S.label}>Height (cm)</div>
                  <input type="text" inputMode="decimal" value={profile.height||""} onChange={e=>saveProfile({height:e.target.value})} placeholder="e.g. 178" style={S.input}/>
                </div>
                <div style={{flex:1}}>
                  <div style={S.label}>Display</div>
                  <div style={{fontSize:14,paddingTop:10,color:"var(--color-text-secondary)"}}>
                    {profile.height ? cmToFtIn(parseFloat(profile.height)) : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div style={S.secTitle}>Weight tracking</div>
            <div style={S.card}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:12}}>
                {["lbs","kg"].map(u=><button key={u} style={S.pill(weightUnit===u,"var(--color-accent)")} onClick={()=>saveProfile({weightUnit:u})}>{u}</button>)}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <input type="text" inputMode="decimal" value={profileWeightInput} onChange={e=>setProfileWeightInput(e.target.value)} placeholder={`Weight in ${weightUnit}`} style={{...S.input,margin:0}}/>
                <button style={S.btnPrimary} onClick={addWeight}>Log</button>
              </div>
              {lastWeight && (
                <div style={{display:"flex",gap:16,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:2}}>CURRENT</div>
                    <div style={{fontSize:22,fontWeight:500}}>{lastWeight.value} <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{weightUnit}</span></div>
                  </div>
                  {weightDiff !== null && (
                    <div>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:2}}>CHANGE</div>
                      <div style={{fontSize:22,fontWeight:500,color:parseFloat(weightDiff)>0?"#c0392b":"#27ae60"}}>
                        {parseFloat(weightDiff)>0?"+":""}{weightDiff}
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:2}}>LAST LOGGED</div>
                    <div style={{fontSize:13,paddingTop:6,color:"var(--color-text-secondary)"}}>{lastWeight.date}</div>
                  </div>
                </div>
              )}
              {weights.length>0 && (
                <div>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>HISTORY</div>
                  {weights.slice().reverse().slice(0,8).map((w:any,i:number)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <span style={{color:"var(--color-text-secondary)"}}>{w.date}</span>
                      <span>{w.value} {weightUnit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={S.secTitle}>App settings</div>
            <div style={S.card}>
              <div style={S.label}>Theme</div>
              <select value={theme} onChange={e=>setTheme(e.target.value)} style={{...S.input,marginBottom:16}}>
                {Object.entries(THEMES).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.name}</option>)}
              </select>
              <div style={S.label}>Export my data</div>
              <div style={{display:"flex",gap:8,marginTop:6}}>
                <button style={S.btn} onClick={()=>exportCSV(userSessions,loggedIn.name)}>Export CSV</button>
                <button style={S.btn} onClick={()=>exportMD(userSessions,loggedIn.name)}>Export Markdown</button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────
function AuthScreen({users,setUsers,sessions,setSessions,routines,setRoutines,authMode,setAuthMode,authForm,setAuthForm,authErr,setAuthErr,onLogin,theme,setTheme}) {
  const S2 = {
    wrap:{fontFamily:"var(--font-mono)",color:"var(--color-text-primary)",maxWidth:340,margin:"0 auto",padding:"3rem 1.5rem",minHeight:"100dvh"},
    card:{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.5rem"},
    input:{width:"100%",boxSizing:"border-box",padding:"7px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:14,marginBottom:10},
    btn:{width:"100%",padding:"8px",borderRadius:"var(--border-radius-md)",border:"none",background:"var(--color-accent)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:500},
    link:{fontSize:13,color:"var(--color-accent)",cursor:"pointer",textDecoration:"underline"},
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
      <div style={{textAlign:"center",marginTop:"1.5rem"}}>
        <select value={theme} onChange={e=>setTheme(e.target.value)} style={{background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",padding:"4px 8px",fontSize:13,cursor:"pointer"}}>
          {Object.entries(THEMES).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.name}</option>)}
        </select>
      </div>
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
  const pts:any[]=[];
  [...sessions].sort((a,b)=>a.date>b.date?1:-1).forEach(s=>{
    const ex=s.exercises.find((e:any)=>e.name===exName);
    if(ex) pts.push({date:s.date,best:Math.max(...ex.sets.map((s:any)=>parseFloat(s.w)||0))});
  });
  // Always show 5 bars — pad left with empty slots if fewer sessions
  const recent=pts.slice(-5);
  while(recent.length<5) recent.unshift({date:null,best:0});
  const max=Math.max(...recent.map((p:any)=>p.best))||1;
  return (
    <div style={{marginTop:8,paddingBottom:2}}>
      <div style={{display:"flex",gap:4,alignItems:"flex-end",height:32}}>
        {recent.map((p:any,i:number)=>{
          const isEmpty=p.best===0;
          const isLast=i===4;
          const h=isEmpty?3:Math.round(6+(p.best/max)*26);
          return (
            <div key={i} title={p.date?`${p.date}: ${p.best} lbs`:"No data"}
              style={{flex:1,height:h,background:isEmpty?"transparent":isLast?"var(--color-accent)":"var(--color-background-secondary)",border:`0.5px solid ${isEmpty?"var(--color-border-tertiary)":isLast?"var(--color-accent)":"var(--color-border-secondary)"}`,borderRadius:2,borderStyle:isEmpty?"dashed":"solid"}}/>
          );
        })}
      </div>
      <div style={{display:"flex",gap:4,marginTop:3}}>
        {recent.map((p:any,i:number)=>(
          <div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:i===4?"var(--color-accent)":"var(--color-text-secondary)",overflow:"hidden"}}>
            {p.best>0 ? p.best : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
