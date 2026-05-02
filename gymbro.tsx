import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import pb from './src/pb';
import {
  login as pbLogin, logout as pbLogout, fetchAllUserData,
  createSession as apiCreateSession, updateSession as apiUpdateSession, deleteSession as apiDeleteSession,
  createRoutine as apiCreateRoutine, updateRoutine as apiUpdateRoutine, deleteRoutine as apiDeleteRoutine,
  createProgram as apiCreateProgram, updateProgram as apiUpdateProgram, deleteProgram as apiDeleteProgram,
  saveProfile as apiSaveProfile, importFromLocalStorage,
} from './src/api';

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
  {id:166,name:"Box Jump",muscle:"Quads",eq:"Bodyweight",type:"Plyometric"},
  {id:167,name:"Jump Squat",muscle:"Quads",eq:"Bodyweight",type:"Plyometric"},
  {id:168,name:"Jumping Lunge",muscle:"Quads",eq:"Bodyweight",type:"Plyometric"},
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
  {id:196,name:"Trap Bar Shrug",muscle:"Traps",eq:"Trap Bar",type:"Isolation"},

  // Calves
  {id:197,name:"Barbell Calf Raise",muscle:"Calves",eq:"Barbell",type:"Isolation"},
  {id:198,name:"Single Leg Calf Raise",muscle:"Calves",eq:"Bodyweight",type:"Isolation"},
  {id:199,name:"Calf Press on Leg Press",muscle:"Calves",eq:"Machine",type:"Isolation"},
  {id:200,name:"Tibialis Raise",muscle:"Calves",eq:"Bodyweight",type:"Isolation"},
  {id:201,name:"Jump Rope",muscle:"Calves",eq:"Bodyweight",type:"Plyometric"},

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

  // Swiss Ball
  {id:222,name:"Swiss Ball Crunch",muscle:"Abs",eq:"Swiss Ball",type:"Isolation"},
  {id:223,name:"Swiss Ball Rollout",muscle:"Core",eq:"Swiss Ball",type:"Compound"},
  {id:224,name:"Swiss Ball Pike",muscle:"Core",eq:"Swiss Ball",type:"Compound"},
  {id:225,name:"Swiss Ball Hamstring Curl",muscle:"Hamstrings",eq:"Swiss Ball",type:"Isolation"},
  {id:226,name:"Swiss Ball Wall Squat",muscle:"Quads",eq:"Swiss Ball",type:"Isometric"},
  {id:227,name:"Swiss Ball Push-Up",muscle:"Chest",eq:"Swiss Ball",type:"Compound"},
  {id:228,name:"Swiss Ball Plank",muscle:"Core",eq:"Swiss Ball",type:"Isometric"},
  {id:229,name:"Swiss Ball Back Extension",muscle:"Back",eq:"Swiss Ball",type:"Isolation"},
  {id:230,name:"Swiss Ball Hip Thrust",muscle:"Glutes",eq:"Swiss Ball",type:"Isolation"},
  {id:231,name:"Swiss Ball Dumbbell Press",muscle:"Chest",eq:"Swiss Ball",type:"Compound"},

  // Trap Bar
  {id:232,name:"Trap Bar Deadlift",muscle:"Back",eq:"Trap Bar",type:"Compound"},
  {id:233,name:"Trap Bar Carry",muscle:"Traps",eq:"Trap Bar",type:"Compound"},
  {id:234,name:"Trap Bar Romanian Deadlift",muscle:"Hamstrings",eq:"Trap Bar",type:"Compound"},
  {id:235,name:"Trap Bar Jump",muscle:"Quads",eq:"Trap Bar",type:"Plyometric"},
  {id:236,name:"Trap Bar Row",muscle:"Back",eq:"Trap Bar",type:"Compound"},

  // Landmine
  {id:237,name:"Landmine Press",muscle:"Shoulders",eq:"Landmine",type:"Compound"},
  {id:238,name:"Landmine Row",muscle:"Back",eq:"Landmine",type:"Compound"},
  {id:239,name:"Landmine Squat",muscle:"Quads",eq:"Landmine",type:"Compound"},
  {id:240,name:"Landmine Romanian Deadlift",muscle:"Hamstrings",eq:"Landmine",type:"Compound"},
  {id:241,name:"Landmine Rotation",muscle:"Core",eq:"Landmine",type:"Compound"},
  {id:242,name:"Landmine Split Squat",muscle:"Quads",eq:"Landmine",type:"Compound"},
  {id:243,name:"Landmine Hip Thrust",muscle:"Glutes",eq:"Landmine",type:"Compound"},
  {id:244,name:"Landmine Overhead Press",muscle:"Shoulders",eq:"Landmine",type:"Compound"},

  // Medicine Ball
  {id:245,name:"Medicine Ball Slam",muscle:"Core",eq:"Medicine Ball",type:"Plyometric"},
  {id:246,name:"Medicine Ball Chest Pass",muscle:"Chest",eq:"Medicine Ball",type:"Plyometric"},
  {id:247,name:"Medicine Ball Rotational Throw",muscle:"Core",eq:"Medicine Ball",type:"Plyometric"},
  {id:248,name:"Medicine Ball Sit-Up",muscle:"Abs",eq:"Medicine Ball",type:"Isolation"},
  {id:249,name:"Medicine Ball Russian Twist",muscle:"Core",eq:"Medicine Ball",type:"Isolation"},
  {id:250,name:"Medicine Ball Wall Ball",muscle:"Quads",eq:"Medicine Ball",type:"Compound"},
  {id:251,name:"Medicine Ball Overhead Slam",muscle:"Core",eq:"Medicine Ball",type:"Plyometric"},
  {id:252,name:"Medicine Ball Squat",muscle:"Quads",eq:"Medicine Ball",type:"Compound"},

  // TRX / Suspension
  {id:253,name:"TRX Row",muscle:"Back",eq:"TRX",type:"Compound"},
  {id:254,name:"TRX Push-Up",muscle:"Chest",eq:"TRX",type:"Compound"},
  {id:255,name:"TRX Squat",muscle:"Quads",eq:"TRX",type:"Compound"},
  {id:256,name:"TRX Lunge",muscle:"Quads",eq:"TRX",type:"Compound"},
  {id:257,name:"TRX Hamstring Curl",muscle:"Hamstrings",eq:"TRX",type:"Isolation"},
  {id:258,name:"TRX Pike",muscle:"Core",eq:"TRX",type:"Compound"},
  {id:259,name:"TRX Plank",muscle:"Core",eq:"TRX",type:"Isometric"},
  {id:260,name:"TRX Bicep Curl",muscle:"Biceps",eq:"TRX",type:"Isolation"},
  {id:261,name:"TRX Tricep Extension",muscle:"Triceps",eq:"TRX",type:"Isolation"},
  {id:262,name:"TRX Y-Fly",muscle:"Shoulders",eq:"TRX",type:"Isolation"},
  {id:263,name:"TRX Fallout",muscle:"Core",eq:"TRX",type:"Compound"},

  // No Equipment — truly floor-only, no bar or props needed
  // Legs & Glutes
  {id:264,name:"Air Squat",muscle:"Quads",eq:"No Equipment",type:"Compound"},
  {id:265,name:"Reverse Lunge",muscle:"Quads",eq:"No Equipment",type:"Compound"},
  {id:266,name:"Lateral Lunge",muscle:"Adductors",eq:"No Equipment",type:"Compound"},
  {id:267,name:"Lunge Walk",muscle:"Quads",eq:"No Equipment",type:"Compound"},
  {id:268,name:"Single Leg Glute Bridge",muscle:"Glutes",eq:"No Equipment",type:"Isolation"},
  {id:269,name:"Donkey Kick",muscle:"Glutes",eq:"No Equipment",type:"Isolation"},
  {id:270,name:"Fire Hydrant",muscle:"Abductors",eq:"No Equipment",type:"Isolation"},
  {id:271,name:"Hip Circle",muscle:"Glutes",eq:"No Equipment",type:"Isolation"},
  {id:272,name:"Squat Hold",muscle:"Quads",eq:"No Equipment",type:"Isometric"},
  // Push
  {id:273,name:"Incline Push-Up",muscle:"Chest",eq:"No Equipment",type:"Compound"},
  {id:274,name:"Clap Push-Up",muscle:"Chest",eq:"No Equipment",type:"Plyometric"},
  // Core & Stability
  {id:275,name:"Side Plank",muscle:"Core",eq:"No Equipment",type:"Isometric"},
  {id:276,name:"Side Plank Hip Dip",muscle:"Core",eq:"No Equipment",type:"Isolation"},
  {id:277,name:"Bird Dog",muscle:"Core",eq:"No Equipment",type:"Isometric"},
  {id:278,name:"Dead Bug",muscle:"Core",eq:"No Equipment",type:"Isometric"},
  {id:279,name:"Mountain Climbers",muscle:"Core",eq:"No Equipment",type:"Compound"},
  {id:280,name:"Inchworm",muscle:"Core",eq:"No Equipment",type:"Compound"},
  {id:281,name:"Bear Crawl",muscle:"Core",eq:"No Equipment",type:"Compound"},
  // Cardio / Plyometric
  {id:282,name:"Burpee",muscle:"Quads",eq:"No Equipment",type:"Plyometric"},
  {id:283,name:"High Knees",muscle:"Quads",eq:"No Equipment",type:"Plyometric"},
  {id:284,name:"Jumping Jack",muscle:"Quads",eq:"No Equipment",type:"Plyometric"},
  {id:285,name:"Skater Jump",muscle:"Abductors",eq:"No Equipment",type:"Plyometric"},
  // Back & Posterior Chain
  {id:286,name:"Good Morning (Bodyweight)",muscle:"Hamstrings",eq:"No Equipment",type:"Compound"},
  {id:287,name:"Reverse Hyperextension",muscle:"Glutes",eq:"No Equipment",type:"Isolation"},
  {id:288,name:"Smith Machine Split Squat",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:289,name:"Smith Machine Incline Bench",muscle:"Chest",eq:"Smith Machine",type:"Compound"},
  {id:290,name:"Smith Machine Shrug",muscle:"Traps",eq:"Smith Machine",type:"Isolation"},
  {id:291,name:"Smith Machine Back Squat",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:292,name:"Smith Machine Front Squat",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:293,name:"Smith Machine Sumo Squat",muscle:"Glutes",eq:"Smith Machine",type:"Compound"},
  {id:294,name:"Smith Machine Romanian Deadlift",muscle:"Hamstrings",eq:"Smith Machine",type:"Compound"},
  {id:295,name:"Smith Machine Deadlift",muscle:"Back",eq:"Smith Machine",type:"Compound"},
  {id:296,name:"Smith Machine Good Morning",muscle:"Hamstrings",eq:"Smith Machine",type:"Compound"},
  {id:297,name:"Smith Machine Decline Bench",muscle:"Chest",eq:"Smith Machine",type:"Compound"},
  {id:298,name:"Smith Machine Close Grip Bench",muscle:"Triceps",eq:"Smith Machine",type:"Compound"},
  {id:299,name:"Smith Machine Lunge",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:300,name:"Smith Machine Reverse Lunge",muscle:"Quads",eq:"Smith Machine",type:"Compound"},
  {id:301,name:"Smith Machine Upright Row",muscle:"Traps",eq:"Smith Machine",type:"Compound"},
  // ── Barbell additions ─────────────────────────────────────────────────────
  {id:302,name:"Barbell Shoulder Press",muscle:"Shoulders",eq:"Barbell",type:"Compound"},
  {id:303,name:"Seated Overhead Press",muscle:"Shoulders",eq:"Barbell",type:"Compound"},
  {id:304,name:"Close Grip Bench Press",muscle:"Triceps",eq:"Barbell",type:"Compound"},
  {id:305,name:"Barbell Upright Row",muscle:"Traps",eq:"Barbell",type:"Compound"},
  {id:306,name:"Stiff Leg Deadlift",muscle:"Hamstrings",eq:"Barbell",type:"Compound"},
  {id:307,name:"Barbell Reverse Lunge",muscle:"Quads",eq:"Barbell",type:"Compound"},
  {id:308,name:"Power Clean",muscle:"Back",eq:"Barbell",type:"Compound"},
];

const EQ_TYPES = ["All", "Barbell", "EZ Bar", "Smith Machine", "Dumbbell", "Cable", "Machine", "Bodyweight", "Kettlebell", "Rings", "Bands", "Swiss Ball", "Trap Bar", "Landmine", "Medicine Ball", "TRX", "No Equipment"];
const MUSCLES = ["All", ...new Set(DB.map(e => e.muscle)).values()];

// ─── STARTER ROUTINE TEMPLATES ────────────────────────────────────────────
const ex = (name:string, sets:number, reps:number, weight:number=0) => ({name,sets,reps,weight});
const ROUTINE_TEMPLATES = [
  {
    name: "Push Day (PPL)",
    tag: "Chest · Shoulders · Triceps",
    exercises: [
      ex("Bench Press",          4, 5,  135),
      ex("Overhead Press",       3, 8,  75),
      ex("Incline Dumbbell Press",3,10, 50),
      ex("Lateral Raise",        4, 15, 20),
      ex("Tricep Pushdown",      3, 12, 40),
      ex("Skull Crusher",        3, 10, 60),
    ],
  },
  {
    name: "Pull Day (PPL)",
    tag: "Back · Biceps",
    exercises: [
      ex("Deadlift",       3, 5,  225),
      ex("Barbell Row",    4, 6,  135),
      ex("Lat Pulldown",   3, 10, 100),
      ex("Cable Row",      3, 12, 80),
      ex("Face Pull",      3, 15, 30),
      ex("Barbell Curl",   3, 10, 65),
    ],
  },
  {
    name: "Leg Day (PPL)",
    tag: "Quads · Hamstrings · Calves",
    exercises: [
      ex("Back Squat",       4, 5,  185),
      ex("Romanian Deadlift",3, 10, 135),
      ex("Leg Press",        3, 12, 270),
      ex("Leg Curl",         3, 12, 70),
      ex("Leg Extension",    3, 15, 70),
      ex("Seated Calf Raise",4, 15, 90),
    ],
  },
  {
    name: "Upper Body",
    tag: "Upper/Lower split — push + pull",
    exercises: [
      ex("Bench Press",       4, 6,  135),
      ex("Barbell Row",       4, 6,  115),
      ex("Overhead Press",    3, 8,  75),
      ex("Lat Pulldown",      3, 10, 90),
      ex("Dumbbell Curl",     3, 12, 30),
      ex("Tricep Pushdown",   3, 12, 35),
    ],
  },
  {
    name: "Lower Body",
    tag: "Upper/Lower split — quads + posterior chain",
    exercises: [
      ex("Back Squat",        4, 6,  185),
      ex("Romanian Deadlift", 3, 8,  135),
      ex("Hip Thrust",        3, 10, 135),
      ex("Leg Curl",          3, 12, 65),
      ex("Leg Extension",     3, 15, 65),
      ex("Seated Calf Raise", 4, 15, 90),
    ],
  },
  {
    name: "Full Body",
    tag: "3-day total body — big 4 + accessories",
    exercises: [
      ex("Back Squat",    3, 5, 185),
      ex("Bench Press",   3, 5, 135),
      ex("Barbell Row",   3, 5, 115),
      ex("Overhead Press",3, 8, 75),
      ex("Deadlift",      1, 5, 225),
      ex("Pull-Up",       3, 8, 0),
    ],
  },
  {
    name: "Glutes & Hamstrings",
    tag: "Posterior chain focus",
    exercises: [
      ex("Hip Thrust",        4, 10, 135),
      ex("Romanian Deadlift", 3, 10, 115),
      ex("Sumo Deadlift",     3, 6,  185),
      ex("Leg Curl",          3, 12, 65),
      ex("Dumbbell RDL",      3, 12, 40),
      ex("Glute Bridge",      3, 15, 0),
    ],
  },
  {
    name: "Arms & Shoulders",
    tag: "Biceps · Triceps · Delts",
    exercises: [
      ex("Overhead Press",      3, 8,  75),
      ex("Lateral Raise",       4, 15, 20),
      ex("Face Pull",           3, 15, 30),
      ex("Barbell Curl",        3, 10, 65),
      ex("Hammer Curl",         3, 12, 30),
      ex("Skull Crusher",       3, 10, 60),
      ex("Tricep Pushdown",     3, 12, 35),
    ],
  },
];

// ─── PLATE CALCULATOR CONSTANTS ───────────────────────────────────────────
// Bar weights stored in lbs; converted to kg on display when needed
const BARS = [
  {name:"Barbell", weight:45},
  {name:"Smith Machine", weight:35},
  {name:"EZ Bar", weight:20},
];
// Available plate sizes, largest first so calcPlates greedily picks big plates
const PLATES_LBS = [45,35,25,10,5,2.5,1.25];
const PLATES_KG  = [20,15,10,5,2.5,1.25];
// Visual colors for each plate weight (shared across lbs and kg where weights match)
const PLATE_COLORS = {45:"#E24B4A",35:"#185FA5",25:"#F0992B",20:"#E24B4A",15:"#185FA5",10:"#3B6D11",5:"#534AB7",2.5:"#888",1.25:"#aaa"};

// Greedy plate calculator: subtracts bar weight, divides remainder by 2 (each side),
// then fills from largest plate down. maxPairs limits how many of each plate can be used.
// Returns [{plate, count}] for one side of the bar.
function calcPlates(target, barW, plates, maxPairs: Record<number,number> = {}) {
  let rem = Math.max(0, (target - barW) / 2); // weight needed per side
  const res = [];
  plates.forEach(p => {
    const max = maxPairs[p] ?? Infinity;
    const n = Math.min(Math.floor(rem / p + 0.001), max); // 0.001 tolerance for float errors
    if (n > 0) { res.push({plate:p, count:n}); rem = Math.round((rem - n*p)*1000)/1000; }
  });
  return res;
}

const today = new Date().toISOString().split("T")[0];

// ─── HELPERS ──────────────────────────────────────────────────────────────

// ─── VOLUME HELPERS ───────────────────────────────────────────────────────
// Volume = weight × reps, summed across all sets. Skips incomplete sets.
function calcExVol(sets): number {
  return sets.reduce((sum, s) => {
    const w = parseFloat(s.w), r = parseFloat(s.r);
    return sum + (isNaN(w)||isNaN(r) ? 0 : w * r);
  }, 0);
}
// Total volume for a full session across all exercises
function calcSessionVol(exercises): number {
  return (exercises||[]).reduce((sum, ex) => sum + calcExVol(ex.sets), 0);
}
// Format a volume number compactly: 12,500 → "12.5k"
function fmtVol(v: number): string {
  return v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(Math.round(v));
}
function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
// Count consecutive training days ending today (or yesterday if not trained today)
function calcStreak(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0;
  const days = new Set(sessions.map(s => s.date));
  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  let cursor = new Date(today + "T12:00:00");
  // If nothing today, start counting from yesterday
  if (!days.has(today)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const d = cursor.toISOString().split("T")[0];
    if (!days.has(d)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Returns a map of { exerciseName → {w, r, date} } for all-time heaviest set per exercise
function getPRs(sessions) {
  const prs = {};
  (sessions||[]).forEach(s => (s.exercises||[]).forEach(ex => {
    ex.sets.forEach(set => {
      if (!prs[ex.name] || set.w > prs[ex.name].w) prs[ex.name] = {w:set.w, r:set.r, date:s.date};
    });
  }));
  return prs;
}

// Returns the two most recent sessions that contain a given exercise,
// each with the best (heaviest) weight logged that day
function getLastTwo(sessions, exName) {
  const logs = [];
  [...(sessions||[])].sort((a,b)=>a.date>b.date?-1:1).forEach(s => {
    const ex = (s.exercises||[]).find(e=>e.name===exName);
    if (ex) logs.push({date:s.date, best:Math.max(...ex.sets.map(s=>s.w)), reps: ex.sets[0]?.r});
  });
  return logs.slice(0,2);
}

// Triggers a CSV download of all sessions for the logged-in user
function exportCSV(sessions, userName) {
  const rows = [["Date","Session","Exercise","Set","Weight(lbs)","Reps"]];
  sessions.forEach(s => (s.exercises||[]).forEach(ex => ex.sets.forEach((set,i) =>
    rows.push([s.date, s.routineName||"Freestyle", ex.name, i+1, set.w, set.r])
  )));
  const csv = rows.map(r=>r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `gymbro_${userName}_${today}.csv`;
  a.click();
}

// Triggers a Markdown download of all sessions for the logged-in user
function exportMD(sessions, userName) {
  let md = `# Gym Bro — ${userName} export\n\n`;
  sessions.forEach(s => {
    md += `## ${s.date} — ${s.routineName||"Freestyle"}\n\n`;
    (s.exercises||[]).forEach(ex => {
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
  header: {display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.5rem 0 1rem"},
  logo: {fontSize:22,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase" as const},
  tabs: {display:"flex",gap:2,marginBottom:"1.5rem",position:"relative",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"4px 4px 0",border:"0.5px solid var(--color-border-tertiary)",overflowX:"auto" as const,scrollbarWidth:"none" as const},
  tabBtn: a=>({padding:"13px 16px",background:a?"var(--color-background-primary)":"none",border:a?"0.5px solid var(--color-border-tertiary)":"0.5px solid transparent",borderBottom:a?"0.5px solid var(--color-background-primary)":"0.5px solid transparent",borderRadius:"var(--border-radius-sm) var(--border-radius-sm) 0 0",color:a?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",fontWeight:a?600:400,whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11,marginBottom:-1}),
  // Primary card — main content blocks
  card: {background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1.125rem 1.25rem",marginBottom:14},
  // Secondary card — nested/sub content
  cardSec: {background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"0.875rem 1rem",marginBottom:8},
  // Form field label
  label: {fontSize:12,color:"var(--color-text-secondary)",marginBottom:4,marginTop:14},
  input: {width:"100%",boxSizing:"border-box",padding:"8px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  sm: {width:68,padding:"6px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13},
  btn: {padding:"7px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontSize:13},
  btnPrimary: {padding:"8px 18px",borderRadius:"var(--border-radius-md)",border:"none",background:"var(--color-accent)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:500},
  btnDanger: {padding:"6px 12px",borderRadius:"var(--border-radius-md)",border:"0.5px solid #A32D2D",background:"transparent",color:"#A32D2D",cursor:"pointer",fontSize:12},
  tag: c=>({fontSize:11,padding:"2px 8px",borderRadius:10,background:c+"22",color:c,fontWeight:500,display:"inline-block"}),
  prBadge: {fontSize:11,padding:"2px 7px",borderRadius:10,background:"#FAEEDA",color:"#BA7517",fontWeight:500},
  metricRow: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:"1.25rem"},
  metric: {background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"1rem",textAlign:"center"},
  metricVal: {fontSize:24,fontWeight:600},
  metricLbl: {fontSize:11,color:"var(--color-text-secondary)",marginTop:3},
  row: {display:"flex",gap:8,alignItems:"center"},
  pill: (a,c)=>({padding:"5px 13px",borderRadius:20,border:`1.5px solid ${a?c:"var(--color-border-tertiary)"}`,background:a?c+"22":"transparent",color:a?c:"var(--color-text-secondary)",fontSize:13,cursor:"pointer",fontWeight:a?500:400}),
  // Major page section title — used for all top-level section headers within a tab
  secTitle: {fontSize:13,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase" as const,color:"var(--color-text-primary)",marginBottom:14,marginTop:"2.5rem",paddingBottom:10,borderBottom:"1px solid var(--color-border-tertiary)"},
  // Sub-section label — small muted uppercase label within a card/form
  subLabel: {fontSize:10,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:"var(--color-text-secondary)",marginBottom:6},
};


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
// Convert cm to total inches (for measurements)
function cmToInches(cm:number) { return Math.round(cm / 2.54 * 10) / 10; }
// Convert inches to cm
function inchesToCm(inches:number) { return Math.round(inches * 2.54 * 10) / 10; }
// Display a stored-in-cm measurement in the current unit
function displayMeasure(cm:number, unit:"metric"|"imperial") {
  return unit==="imperial" ? `${cmToInches(cm)} in` : `${cm} cm`;
}
// Compute BMI from weight (kg) and height (cm)
function calcBMI(weightKg:number, heightCm:number) {
  if (!weightKg||!heightCm) return null;
  const bmi = weightKg / Math.pow(heightCm/100, 2);
  return Math.round(bmi * 10) / 10;
}
function bmiCategory(bmi:number) {
  if (bmi<18.5) return {label:"Underweight",color:"#185FA5"};
  if (bmi<25)   return {label:"Normal",color:"#3B6D11"};
  if (bmi<30)   return {label:"Overweight",color:"#F0992B"};
  return               {label:"Obese",color:"#A32D2D"};
}

// Returns the ISO date string of the Monday of the week containing `dateStr`
function getMondayOfWeek(dateStr:string):string {
  const d = new Date(dateStr+"T12:00:00");
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - (day===0 ? 6 : day-1));
  return d.toISOString().split("T")[0];
}

// Given a program's cycleStartDate and cycleWeeks length, returns the 0-based index into cycleWeeks for today
function getCycleWeekIndex(cycleStartDate:string, cycleLen:number):number {
  const start = new Date(cycleStartDate+"T12:00:00");
  const now = new Date(today+"T12:00:00");
  const weeks = Math.floor((now.getTime()-start.getTime())/(7*24*60*60*1000));
  return ((weeks % cycleLen) + cycleLen) % cycleLen; // handles negative (future start date)
}

// Count sessions for a program's routines in the calendar week starting on `weekMonday`
function countProgramSessionsInWeek(allSessions:any[], progRoutineNames:Set<string>, weekMonday:string):number {
  const d = new Date(weekMonday+"T12:00:00");
  const weekEnd = new Date(d); weekEnd.setDate(d.getDate()+6);
  const endStr = weekEnd.toISOString().split("T")[0];
  return allSessions.filter(s=>s.date>=weekMonday && s.date<=endStr && (s.type==="strength"||!s.type) && progRoutineNames.has(s.routineName)).length;
}

const CARDIO_ACTIVITIES = ["Run","Walk","Bike","Swim","Row","HIIT","Jump Rope","Elliptical","Stairmaster","Yoga","Other"];

const formInputStyle = {width:"100%",boxSizing:"border-box" as const,background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-sm)",padding:"8px 10px",color:"var(--color-text-primary)",fontFamily:"inherit",fontSize:13};
const formSaveBtn = {flex:1,padding:"8px",borderRadius:"var(--border-radius-sm)",background:"var(--color-accent)",color:"#000",border:"none",fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"};
const formCancelBtn = {padding:"8px 14px",borderRadius:"var(--border-radius-sm)",background:"none",border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",fontFamily:"inherit",fontSize:13,cursor:"pointer"};
const formSubLabel = {fontSize:10,color:"var(--color-text-secondary)",marginBottom:4};

function CardioForm({form, setForm, onSave, onCancel}: {form:any, setForm:any, onSave:()=>void, onCancel:()=>void}) {
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",padding:"1rem",marginTop:8}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Log cardio</div>
      <div style={{marginBottom:8}}>
        <div style={formSubLabel}>DATE</div>
        <input type="date" style={formInputStyle} value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))} />
      </div>
      <div style={{display:"flex",gap:6,marginBottom:8,overflowX:"auto" as const,scrollbarWidth:"none" as const,paddingBottom:4}}>
        {CARDIO_ACTIVITIES.map(a=>(
          <button key={a} style={{padding:"4px 10px",borderRadius:20,fontSize:11,border:"0.5px solid var(--color-border-secondary)",background:form.activity===a?"var(--color-accent)":"var(--color-background-secondary)",color:form.activity===a?"#000":"var(--color-text-primary)",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap" as const}} onClick={()=>setForm((f:any)=>({...f,activity:a}))}>{a}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <div style={{flex:1}}>
          <div style={formSubLabel}>DURATION (min) *</div>
          <input type="number" placeholder="30" style={formInputStyle} value={form.durationMins} onChange={e=>setForm((f:any)=>({...f,durationMins:e.target.value}))} />
        </div>
        <div style={{flex:1}}>
          <div style={formSubLabel}>DISTANCE</div>
          <div style={{display:"flex",gap:4}}>
            <input type="number" placeholder="5" style={{...formInputStyle,flex:1}} value={form.distance} onChange={e=>setForm((f:any)=>({...f,distance:e.target.value}))} />
            <select style={{...formInputStyle,width:60,flex:"none"}} value={form.distanceUnit} onChange={e=>setForm((f:any)=>({...f,distanceUnit:e.target.value}))}>
              <option>km</option><option>mi</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{marginBottom:10}}>
        <div style={formSubLabel}>NOTES</div>
        <input placeholder="Optional notes…" style={formInputStyle} value={form.notes} onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))} />
      </div>
      <div style={{display:"flex",gap:6}}>
        <button style={formSaveBtn} onClick={onSave}>Save</button>
        <button style={formCancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function RestForm({form, setForm, onSave, onCancel}: {form:any, setForm:any, onSave:()=>void, onCancel:()=>void}) {
  return (
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",padding:"1rem",marginTop:8}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Log rest day</div>
      <div style={{marginBottom:8}}>
        <div style={formSubLabel}>DATE</div>
        <input type="date" style={formInputStyle} value={form.date} onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))} />
      </div>
      <input placeholder="Optional note (e.g. Active recovery, deload…)" style={{...formInputStyle,marginBottom:10}} value={form.notes} onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))} />
      <div style={{display:"flex",gap:6}}>
        <button style={formSaveBtn} onClick={onSave}>Save</button>
        <button style={formCancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────
export default function GymBro() {
  // ── Core data — loaded from PocketBase on login ──
  const [sessions, setSessions] = useState<Record<string,any[]>>({});   // keyed by userId
  const [routines, setRoutines] = useState<Record<string,any[]>>({});   // keyed by userId
  const [programs, setPrograms] = useState<Record<string,any[]>>({});   // keyed by userId

  // ── Auth / loading ──
  const [pbAuthed, setPbAuthed] = useState(pb.authStore.isValid);
  const [loading, setLoading] = useState(pb.authStore.isValid); // true while fetching initial data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [profileRecordId, setProfileRecordId] = useState<string|null>(null);
  const [importing, setImporting] = useState(false);
  const [loadError, setLoadError] = useState<string|null>(null);

  // ── Navigation ──
  const [tab, setTab] = useState("dashboard");

  // ── Calculator state ──
  const [unit, setUnit] = useState("lbs");           // "lbs" or "kg"
  const [barIdx, setBarIdx] = useState(0);           // index into BARS array
  const [targetW, setTargetW] = useState(135);       // target weight (number, used for calculation)
  const [targetWInput, setTargetWInput] = useState("135"); // raw string shown in the text input
  const [plateInventory, setPlateInventory] = useState<Record<string,number>>({});

  // DB tab state
  const [dbSearch, setDbSearch] = useState("");
  const [dbEq, setDbEq] = useState("All");
  const [dbMuscle, setDbMuscle] = useState("All");

  // ── Active session logging ──
  // activeSession is null when not logging; otherwise holds the in-progress workout
  const [activeSession, setActiveSession] = useState(null); // {routineName, exercises:[{name,sets:[{w,r}],note?:string}]}
  const [editSessionId, setEditSessionId] = useState(null); // non-null when editing a past session
  const [showCommentStep, setShowCommentStep] = useState(false); // shows the post-session comment box
  const [sessionComment, setSessionComment] = useState("");
  const [showCardioForm, setShowCardioForm] = useState(false);
  const [cardioForm, setCardioForm] = useState({activity:"Run",durationMins:"",distance:"",distanceUnit:"km",notes:"",date:today});
  const [showRestForm, setShowRestForm] = useState(false);
  const [restForm, setRestForm] = useState({date:today,notes:""});
  const [confirmDeleteSessionId, setConfirmDeleteSessionId] = useState<string|null>(null);
  const [editRestCardioId, setEditRestCardioId] = useState<string|null>(null);
  const [editRestCardioForm, setEditRestCardioForm] = useState<any>({});
  const [editStartDateProgramId, setEditStartDateProgramId] = useState<string|null>(null);
  const [editStartDateValue, setEditStartDateValue] = useState("");

  // ── Rest timer (used during active session) ──
  const [restDuration, setRestDuration] = useState(120);         // configured duration in seconds
  const [restRemaining, setRestRemaining] = useState<number|null>(null); // null = timer not started
  const [restRunning, setRestRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds since session started

  // ── Routine form state ──
  const [editRoutineId, setEditRoutineId] = useState(null);
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [routineForm, setRoutineForm] = useState({name:"",exercises:[],programId:""});
  const [routineExSearch, setRoutineExSearch] = useState("");

  // ── Calendar navigation ──
  const [calSelectedDay, setCalSelectedDay] = useState(null);     // day selected on dashboard calendar
  const [logCalSelectedDay, setLogCalSelectedDay] = useState(null); // day selected on session calendar
  const [calOffset, setCalOffset] = useState(0);      // how many weeks back the dashboard calendar is showing
  const [logCalOffset, setLogCalOffset] = useState(0); // same for the session tab calendar

  // ── Dashboard UI state ──
  const [selectedSessionId, setSelectedSessionId] = useState(null); // expanded session card
  const [e1rmTooltip, setE1rmTooltip] = useState(false);            // info popup for e1RM explanation

  // ── Routines UI state ──
  const [showArchived, setShowArchived] = useState(false);       // toggle archived routines visibility
  const [showTemplates, setShowTemplates] = useState(false);    // toggle starter templates panel
  const [showNewProgram, setShowNewProgram] = useState(false);   // program creation form open
  const [programForm, setProgramForm] = useState({name:"", routineIds:[] as string[], cycleActiveWeeks:3, cycleSessionsPerWeek:3, cycleHasRestWeek:true});  // new/edit program form
  const [editProgramId, setEditProgramId] = useState(null);      // non-null when renaming a program
  const [collapsedPrograms, setCollapsedPrograms] = useState<Record<string,boolean>>({});  // which programs are collapsed
  const [confirmDeleteProgramId, setConfirmDeleteProgramId] = useState(null); // confirm before deleting a program
  const [addRoutinesProgramId, setAddRoutinesProgramId] = useState<string|null>(null);   // program whose "add routines" picker is open
  const [addRoutinesSelection, setAddRoutinesSelection] = useState<string[]>([]);         // routine ids checked in that picker
  const [activeProgramId, setActiveProgramId] = useState<string|null>(null);

  // ── Custom exercises — user-created, merged with built-in DB ──
  const [customExercises, setCustomExercises] = useState<any[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false); // form open in DB tab
  const [customForm, setCustomForm] = useState({name:"", muscle:"Chest", eq:"Barbell", type:"Isolation"});

  const [theme, setTheme] = useState("daylight");
  const [profiles, setProfiles] = useState<Record<string,any>>({});
  const [profileWeightInput, setProfileWeightInput] = useState("");
  const [profileHeightFt, setProfileHeightFt] = useState("");   // imperial height input (feet part)
  const [profileHeightIn, setProfileHeightIn] = useState("");   // imperial height input (inches part)
  const [profileMeasureForm, setProfileMeasureForm] = useState({waist:"",hips:"",chest:"",arm:"",bodyFat:""});
  const [convHInput, setConvHInput] = useState("");             // converter: height input
  const [convWInput, setConvWInput] = useState("");             // converter: weight input
  const [convHDir, setConvHDir] = useState<"cmToIn"|"inToCm">("cmToIn");  // converter direction
  const [convWDir, setConvWDir] = useState<"kgToLbs"|"lbsToKg">("kgToLbs");

  // ── Routine delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── DB FILTER (must be before early return — Rules of Hooks) ──
  // fullDB merges built-in exercises with any user-created custom ones
  const fullDB = useMemo(()=>[...DB, ...customExercises],[customExercises]);
  const filteredDB = useMemo(()=>fullDB.filter(e=>
    (dbEq==="All"||e.eq===dbEq)&&
    (dbMuscle==="All"||e.muscle===dbMuscle)&&
    e.name.toLowerCase().includes(dbSearch.toLowerCase())
  ),[fullDB,dbEq,dbMuscle,dbSearch]);

  // ── POCKETBASE: load all user data after login ──
  const uid = pb.authStore.record?.id ?? "";

  const loadData = useCallback(async () => {
    const userId = pb.authStore.record?.id ?? "";
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchAllUserData(userId);
      setSessions({ [userId]: data.sessions });
      setRoutines({ [userId]: data.routines });
      setPrograms({ [userId]: data.programs });
      if (data.profile) {
        setProfileRecordId(data.profile.id ?? null);
        setProfiles({ [userId]: {
          unit:      data.profile.unit      || "metric",
          height:    data.profile.height    || 0,
          weight:    data.profile.weight    || 0,
          dob:       data.profile.dob       || "",
          waist:     data.profile.waist     || 0,
          hips:      data.profile.hips      || 0,
          chest:     data.profile.chest     || 0,
          arm:       data.profile.arm       || 0,
          bodyFat:   data.profile.bodyFat   || 0,
          // Extended profile fields stored in the profiles record
          birthDate:        data.profile.birthDate        || "",
          weightUnit:       data.profile.weightUnit       || "lbs",
          measureUnit:      data.profile.measureUnit      || "metric",
          weights:          data.profile.weights          || [],
          bodyMeasurements: data.profile.bodyMeasurements || [],
        }});
        setTheme(data.profile.theme || "daylight");
        setPlateInventory(data.profile.plateInventory || {});
        setCustomExercises(data.profile.customExercises || []);
        setActiveProgramId(data.profile.activeProgramId || null);
      }
    } catch(e: any) {
      console.error("Failed to load data:", e);
      setLoadError(e?.message || String(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (pb.authStore.isValid) loadData();
  }, [loadData]);

  async function handleLogin(e?: any) {
    e?.preventDefault();
    setLoginError("");
    try {
      await pbLogin(loginEmail, loginPassword);
      setPbAuthed(true);
      await loadData();
    } catch(err: any) {
      setLoginError(err?.message || "Invalid email or password");
    }
  }

  function handleLogout() {
    pbLogout();
    setPbAuthed(false);
    setSessions({}); setRoutines({}); setPrograms({});
    setProfiles({}); setPlateInventory({}); setCustomExercises([]);
    setActiveProgramId(null); setProfileRecordId(null); setTheme("daylight");
    setTab("dashboard");
  }

  // ── Profile API save — call after any profile mutation ──
  async function saveProfileToAPI(updates: Record<string,any>) {
    const userId = pb.authStore.record?.id ?? "";
    if (!userId) return;
    const current = profiles[userId] || {};
    const full = {
      userId,
      unit:             current.unit            || "metric",
      height:           current.height          || 0,
      weight:           current.weight          || 0,
      dob:              current.dob             || "",
      waist:            current.waist           || 0,
      hips:             current.hips            || 0,
      chest:            current.chest           || 0,
      arm:              current.arm             || 0,
      bodyFat:          current.bodyFat         || 0,
      birthDate:        current.birthDate        || "",
      weightUnit:       current.weightUnit       || "lbs",
      measureUnit:      current.measureUnit      || "metric",
      weights:          current.weights          || [],
      bodyMeasurements: current.bodyMeasurements || [],
      plateInventory,
      customExercises,
      theme,
      activeProgramId:  activeProgramId || "",
      ...updates,
    };
    try {
      const saved = await apiSaveProfile({ ...full, id: profileRecordId ?? undefined });
      if (!profileRecordId && saved.id) setProfileRecordId(saved.id);
    } catch(e) {
      console.error("Failed to save profile:", e);
    }
  }

  useEffect(()=>{
    const t = THEMES[theme] || THEMES.matrix;
    Object.entries(t).forEach(([k,v])=>{ if(k.startsWith("--")) document.documentElement.style.setProperty(k,v); });
    document.documentElement.style.setProperty("--color-body-bg", t["--color-body-bg"]);
  },[theme]);

  useEffect(()=>{
    if (!restRunning || restRemaining === null || restRemaining <= 0) {
      if (restRemaining === 0) setRestRunning(false);
      return;
    }
    const id = setTimeout(()=>setRestRemaining(r=>r!==null ? r-1 : null), 1000);
    return ()=>clearTimeout(id);
  },[restRunning, restRemaining]);

  // Tick elapsed timer every second while a session is active
  useEffect(()=>{
    if (!activeSession?.startedAt) { setElapsed(0); return; }
    setElapsed(Math.round((Date.now() - activeSession.startedAt) / 1000));
    const id = setInterval(()=>setElapsed(Math.round((Date.now() - activeSession.startedAt!) / 1000)), 1000);
    return ()=>clearInterval(id);
  },[activeSession?.startedAt]);

  // ── Login screen ──
  if (!pbAuthed) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-body-bg)",fontFamily:"var(--font-mono)"}}>
      <div style={{width:320,padding:"2rem",background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-lg)"}}>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",textAlign:"center",marginBottom:24}}>
          💪 <span style={{textDecoration:"underline"}}>Gym Bro</span> 💪
        </div>
        <form onSubmit={handleLogin}>
          <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>Email</div>
          <input type="email" autoComplete="username" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}
            placeholder="you@example.com" style={{...S.input,marginBottom:10}} />
          <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>Password</div>
          <input type="password" autoComplete="current-password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)}
            placeholder="••••••••" style={{...S.input,marginBottom:16}} />
          {loginError && <div style={{fontSize:12,color:"#e05",marginBottom:10}}>{loginError}</div>}
          <button type="submit" style={{...S.btnPrimary,width:"100%",padding:"10px"}}>Sign in</button>
        </form>
        <div style={{marginTop:16,textAlign:"center",fontSize:11,color:"var(--color-text-secondary)"}}>
          Accounts are managed by an admin.
        </div>
        <div style={{marginTop:16}}>
          <select value={theme} onChange={e=>setTheme(e.target.value)}
            style={{width:"100%",background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",padding:"4px 8px",fontSize:13,cursor:"pointer"}}>
            {Object.entries(THEMES).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  // ── Loading screen (after login, fetching data) ──
  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-body-bg)",fontFamily:"var(--font-mono)",color:"var(--color-text-secondary)",fontSize:14}}>
      Loading…
    </div>
  );

  // ── Load error screen ──
  if (loadError) return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"var(--color-body-bg)",fontFamily:"var(--font-mono)",padding:"2rem",gap:16}}>
      <div style={{fontSize:16,fontWeight:700,color:"#e05"}}>Failed to load data</div>
      <div style={{fontSize:13,color:"var(--color-text-secondary)",maxWidth:360,textAlign:"center"}}>{loadError}</div>
      <button style={{...S.btn,marginTop:8}} onClick={()=>{setLoadError(null);loadData();}}>Retry</button>
      <button style={{...S.btn}} onClick={handleLogout}>Sign out</button>
    </div>
  );
  const userSessions = sessions[uid]||[];
  const userRoutines = routines[uid]||[];
  const prs = getPRs(userSessions);

  // ── SAVE SESSION ──
  async function saveSession() {
    if (!activeSession || activeSession.exercises.length===0) return;
    const durationSecs = activeSession.startedAt
      ? Math.round((Date.now() - activeSession.startedAt) / 1000)
      : undefined;
    const sessionData = {
      userId: uid,
      date: today,
      type: "strength" as const,
      routineName: activeSession.routineName||"Freestyle",
      exercises: activeSession.exercises.filter(e=>e.sets.length>0),
      comment: sessionComment.trim() || undefined,
      duration: durationSecs,
    };
    if (editSessionId) {
      const updated = await apiUpdateSession(editSessionId, sessionData);
      setSessions(prev=>({...prev,[uid]:prev[uid].map(s=>s.id===editSessionId?updated:s)}));
      setEditSessionId(null);
    } else {
      const created = await apiCreateSession(sessionData);
      setSessions(prev=>({...prev,[uid]:[created,...(prev[uid]||[])]}));
    }
    setActiveSession(null);
    setShowCommentStep(false);
    setSessionComment("");
  }

  function startSession(routine) {
    setActiveSession({
      routineName: routine ? routine.name : "Freestyle",
      startedAt: Date.now(),
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

  async function logCardio() {
    if (!cardioForm.durationMins) return;
    const created = await apiCreateSession({
      userId: uid,
      date: cardioForm.date||today,
      type: "cardio" as const,
      routineName: cardioForm.activity,
      activity: cardioForm.activity,
      durationMins: Number(cardioForm.durationMins),
      distance: cardioForm.distance ? Number(cardioForm.distance) : undefined,
      distanceUnit: cardioForm.distanceUnit,
      notes: cardioForm.notes.trim()||undefined,
    });
    setSessions(prev=>({...prev,[uid]:[created,...(prev[uid]||[])].sort((a,b)=>a.date<b.date?1:-1)}));
    setShowCardioForm(false);
    setCardioForm({activity:"Run",durationMins:"",distance:"",distanceUnit:"km",notes:"",date:today});
  }

  async function logRestDay() {
    const created = await apiCreateSession({
      userId: uid,
      date: restForm.date||today,
      type: "rest" as const,
      routineName: "Rest day",
      notes: restForm.notes.trim()||undefined,
    });
    setSessions(prev=>({...prev,[uid]:[created,...(prev[uid]||[])].sort((a,b)=>a.date<b.date?1:-1)}));
    setShowRestForm(false);
    setRestForm({date:today,notes:""});
  }

  async function deleteSession(id:string) {
    await apiDeleteSession(id);
    setSessions(prev=>({...prev,[uid]:(prev[uid]||[]).filter(s=>s.id!==id)}));
    setConfirmDeleteSessionId(null);
  }

  function editSession(s) {
    setActiveSession({routineName:s.routineName, exercises:(s.exercises||[]).map(e=>({name:e.name,sets:[...e.sets.map(x=>({...x}))],note:e.note||""}))});
    setEditSessionId(s.id);
    setSessionComment(s.comment||"");
    setShowCommentStep(false);
    setTab("log");
  }

  // ── SAVE ROUTINE ──
  async function saveRoutine() {
    if (!routineForm.name || routineForm.exercises.length===0) return;
    if (editRoutineId) {
      const updated = await apiUpdateRoutine(editRoutineId, {
        name: routineForm.name,
        exercises: routineForm.exercises,
        programId: routineForm.programId,
      });
      setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===editRoutineId?{...r,...updated}:r)}));
      setEditRoutineId(null);
    } else {
      const created = await apiCreateRoutine({
        userId: uid,
        name: routineForm.name,
        exercises: routineForm.exercises,
        programId: routineForm.programId,
        archived: false,
      });
      setRoutines(prev=>({...prev,[uid]:[...(prev[uid]||[]),created]}));
    }
    setRoutineForm({name:"",exercises:[],programId:""});
    setShowNewRoutine(false);
  }

  function editRoutine(r) {
    setRoutineForm({name:r.name,exercises:r.exercises.map(e=>({...e})),programId:r.programId||""});
    setEditRoutineId(r.id);
    setShowNewRoutine(true);
  }

  async function duplicateRoutine(r) {
    const created = await apiCreateRoutine({
      userId: uid,
      name: r.name+" (copy)",
      exercises: r.exercises,
      programId: r.programId || "",
      archived: false,
    });
    setRoutines(prev=>({...prev,[uid]:[...(prev[uid]||[]),created]}));
  }

  // Program CRUD
  async function saveProgram() {
    if (!programForm.name.trim()) return;
    const cycleWeeks = [
      ...Array.from({length:programForm.cycleActiveWeeks}, ()=>({type:"active" as const, sessions:programForm.cycleSessionsPerWeek})),
      ...(programForm.cycleHasRestWeek ? [{type:"rest" as const, sessions:0}] : []),
    ];
    if (editProgramId) {
      const updated = await apiUpdateProgram(editProgramId, {name:programForm.name.trim(), cycleWeeks});
      setPrograms(prev=>({...prev,[uid]:prev[uid].map(p=>p.id===editProgramId?{...p,...updated}:p)}));
      setEditProgramId(null);
    } else {
      const created = await apiCreateProgram({
        userId: uid,
        name: programForm.name.trim(),
        cycleWeeks,
        cycleStartDate: getMondayOfWeek(today),
      });
      if (programForm.routineIds.length>0) {
        for (const rid of programForm.routineIds) {
          await apiUpdateRoutine(rid, {programId: created.id});
        }
        setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>
          programForm.routineIds.includes(r.id) ? {...r,programId:created.id} : r
        )}));
      }
      setPrograms(prev=>({...prev,[uid]:[...(prev[uid]||[]),created]}));
    }
    setProgramForm({name:"", routineIds:[], cycleActiveWeeks:3, cycleSessionsPerWeek:3, cycleHasRestWeek:true});
    setShowNewProgram(false);
  }

  async function deleteProgram(id) {
    const toDetach = (routines[uid]||[]).filter(r=>r.programId===id);
    for (const r of toDetach) await apiUpdateRoutine(r.id, {programId:""});
    await apiDeleteProgram(id);
    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.programId===id?{...r,programId:""}:r)}));
    setPrograms(prev=>({...prev,[uid]:prev[uid].filter(p=>p.id!==id)}));
    setConfirmDeleteProgramId(null);
  }

  async function deleteRoutine(id) {
    await apiDeleteRoutine(id);
    setRoutines(prev=>({...prev,[uid]:prev[uid].filter(r=>r.id!==id)}));
  }

  async function archiveRoutine(id) {
    await apiUpdateRoutine(id, {archived:true});
    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===id?{...r,archived:true}:r)}));
  }

  async function unarchiveRoutine(id) {
    await apiUpdateRoutine(id, {archived:false});
    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>r.id===id?{...r,archived:false}:r)}));
  }

  // ── CALC ──
  const bar = BARS[barIdx];
  const allPlates = unit==="lbs" ? PLATES_LBS : PLATES_KG;
  const barW = unit==="lbs" ? bar.weight : Math.round(bar.weight*0.453592*10)/10;
  function getPairs(p: number): number { return plateInventory[`${unit}-${p}`] ?? 1; }
  function setPairs(p: number, n: number) {
    const newInv = {...plateInventory, [`${unit}-${p}`]: Math.max(0, Math.min(9, n))};
    setPlateInventory(newInv);
    saveProfileToAPI({plateInventory: newInv});
  }
  const availPlates = allPlates.filter(p=>getPairs(p)>0);
  const maxPairsMap = Object.fromEntries(allPlates.map(p=>[p, getPairs(p)]));
  const plateList = calcPlates(targetW, barW, availPlates, maxPairsMap);
  const actualTotal = barW + plateList.reduce((sum,{plate,count})=>sum+plate*count*2, 0);
  const notExact = Math.abs(actualTotal - targetW) > 0.01;

  // ── CALENDAR ──
  const sessionsByDate: Record<string,typeof userSessions> = {};
  userSessions.forEach(s=>{ sessionsByDate[s.date]=(sessionsByDate[s.date]||[]); sessionsByDate[s.date].push(s); });
  const todayDT = new Date();
  const todayDow = todayDT.getDay(); // 0=Sun
  function getCalDays(weeksBack: number) {
    const dow = todayDT.getDay();
    const daysSinceMon = (dow + 6) % 7;
    const start = new Date(todayDT);
    start.setDate(todayDT.getDate() - daysSinceMon - 28 - weeksBack * 7);
    return Array.from({length:35},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d.toISOString().split("T")[0]; });
  }
  function calMonthLabel(days: string[]) {
    const first = new Date(days[0]+"T12:00:00");
    const last  = new Date(days[34]+"T12:00:00");
    const fmt = (d: Date) => d.toLocaleDateString("en-US",{month:"short",year:"numeric"});
    return first.getMonth()===last.getMonth() ? fmt(first) : `${first.toLocaleDateString("en-US",{month:"short"})} – ${fmt(last)}`;
  }
  const calDays    = getCalDays(calOffset);
  const logCalDays = getCalDays(logCalOffset);
  const calDayLabels = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  return (
    <div style={S.wrap}>
      <div style={{...S.header,flexDirection:"column",alignItems:"center",gap:4}}>
        <span style={S.logo}>💪 <span style={{textDecoration:"underline"}}>Gym Bro</span> 💪</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{pb.authStore.record?.email ?? ""}</span>
          <button style={S.btn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      <div style={S.tabs}>
        {[["dashboard","Dashboard"],["log","Session"],["routines","Programs"],["calc","Calc"],["progress","Progress"],["db","Exercises"],["profile","Profile"]].map(([id,lbl])=>(
          <button key={id} style={{...S.tabBtn(tab===id),flexShrink:0}} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab==="dashboard" && (
        <div>
          <div style={S.metricRow}>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("log")}><div style={S.metricVal}>{userSessions.length}</div><div style={S.metricLbl}>sessions</div></div>
            <div style={{...S.metric,cursor:"pointer"}} onClick={()=>setTab("progress")}><div style={S.metricVal}>{Object.keys(prs).length}</div><div style={S.metricLbl}>PRs</div></div>
            <div style={S.metric}><div style={S.metricVal}>{calcStreak(userSessions)}{calcStreak(userSessions)>0?"🔥":""}</div><div style={S.metricLbl}>day streak</div></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...S.secTitle}}>
            <span>Calendar</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button style={S.btn} onClick={()=>{setCalOffset(o=>o+1);setCalSelectedDay(null);}}>‹</button>
              <span style={{fontSize:11,color:"var(--color-text-secondary)",minWidth:90,textAlign:"center"}}>{calMonthLabel(calDays)}</span>
              <button style={{...S.btn,opacity:calOffset===0?0.3:1}} disabled={calOffset===0} onClick={()=>{setCalOffset(o=>Math.max(0,o-1));setCalSelectedDay(null);}}>›</button>
            </div>
          </div>
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
                  {s.type==="cardio" && <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>🏃 {s.durationMins} min{s.distance ? ` · ${s.distance} ${s.distanceUnit}` : ""}{s.notes ? ` — ${s.notes}` : ""}</div>}
                  {s.type==="rest" && <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>😴 {s.notes||"Planned rest day"}</div>}
                  {(!s.type||s.type==="strength") && (s.exercises||[]).map((ex,j)=>(
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
            last6.forEach(s=>(s.exercises||[]).forEach(ex=>{
              const dbEx = DB.find(d=>d.name===ex.name);
              const muscle = dbEx?.muscle;
              if (muscle && muscleSets[muscle]!==undefined) muscleSets[muscle] += ex.sets.length;
            }));
            const maxSets = Math.max(...Object.values(muscleSets), 1);
            return (
              <div style={{marginTop:0,marginBottom:"0.75rem"}}>
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

          {/* ── Volume trend chart — last 10 sessions as vertical bars ── */}
          {userSessions.length > 0 && (()=>{
            const recent = [...userSessions].slice(0,10).reverse(); // oldest → newest left to right
            const vols = recent.map(s => calcSessionVol(s.exercises));
            const maxVol = Math.max(...vols, 1);
            return (
              <div style={{marginTop:0,marginBottom:"0.75rem"}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Volume trend · last {recent.length} sessions</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:4,height:64}}>
                  {recent.map((s,i)=>{
                    const pct = vols[i] / maxVol;
                    const barH = Math.max(4, Math.round(pct * 56)); // min 4px so bar is always visible
                    return (
                      <div key={s.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        {/* Volume label above bar */}
                        <span style={{fontSize:9,color:"var(--color-text-secondary)",lineHeight:1}}>{vols[i]>0?fmtVol(vols[i]):""}</span>
                        {/* Bar */}
                        <div style={{width:"100%",height:barH,borderRadius:"2px 2px 0 0",background:`var(--color-accent)`,opacity: 0.4 + pct * 0.6}}/>
                      </div>
                    );
                  })}
                </div>
                {/* Date labels below bars */}
                <div style={{display:"flex",gap:4,marginTop:4}}>
                  {recent.map(s=>{
                    const d = new Date(s.date+"T12:00:00");
                    const lbl = `${d.toLocaleDateString("en-US",{month:"short"})} ${d.getDate()}`;
                    return <div key={s.id} style={{flex:1,fontSize:8,color:"var(--color-text-secondary)",textAlign:"center",overflow:"hidden"}}>{lbl}</div>;
                  })}
                </div>
              </div>
            );
          })()}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",...S.secTitle,paddingBottom:8}}>
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
        </div>
      )}

      {/* ── LOG ── */}
      {tab==="log" && (
        <div>
          {!activeSession ? (
            <div>
              {/* ── Active program or fallback ── */}
              {(()=>{
                const activeProg = (programs[uid]||[]).find(p=>p.id===activeProgramId);
                const activeProgRoutines = activeProg
                  ? userRoutines.filter(r=>r.programId===activeProg.id && !r.archived)
                  : [];
                return activeProg ? (
                  <div style={{marginBottom:20}}>
                    {/* Program header */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.01em"}}>{activeProg.name}</div>
                        <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>Active program · {activeProgRoutines.length} routine{activeProgRoutines.length!==1?"s":""}</div>
                        {(()=>{
                          if (!activeProg.cycleWeeks || !activeProg.cycleStartDate) return null;
                          const cw = activeProg.cycleWeeks;
                          const idx = getCycleWeekIndex(activeProg.cycleStartDate, cw.length);
                          const week = cw[idx];
                          const progNames = new Set(activeProgRoutines.map((r:any)=>r.name));
                          const done = countProgramSessionsInWeek(userSessions, progNames, getMondayOfWeek(today));
                          const target = week.sessions;
                          const isRest = week.type==="rest";
                          return (
                            <div style={{marginTop:4,fontSize:12}}>
                              {isRest
                                ? <span style={{color:"var(--color-text-secondary)"}}>Week {idx+1}/{cw.length} · 😴 Rest week — take it easy</span>
                                : <span>
                                    <span style={{color:"var(--color-text-secondary)"}}>Week {idx+1}/{cw.length} · </span>
                                    <span style={{fontWeight:600,color:done>=target?"var(--color-accent)":"var(--color-text-primary)"}}>{done}/{target} sessions</span>
                                    <span style={{color:"var(--color-text-secondary)"}}>{done>=target?" done ✓":" this week"}</span>
                                  </span>
                              }
                            </div>
                          );
                        })()}
                      </div>
                      <button style={S.btn} onClick={()=>setTab("routines")}>Switch</button>
                    </div>
                    {/* Routines to start */}
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:10}}>
                      {activeProgRoutines.length===0 && (
                        <div style={{...S.card,fontSize:13,color:"var(--color-text-secondary)",textAlign:"center" as const}}>No routines in this program yet.</div>
                      )}
                      {activeProgRoutines.map(r=>(
                        <div key={r.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:14,fontWeight:500}}>{r.name}</div>
                            <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.exercises.length} exercise{r.exercises.length!==1?"s":""}</div>
                          </div>
                          <button style={S.btnPrimary} onClick={()=>startSession(r)}>▶ Start</button>
                        </div>
                      ))}
                    </div>
                    {/* Freestyle always available */}
                    <button style={{...S.btn,width:"100%"}} onClick={()=>startSession(null)}>+ Freestyle session</button>
                    <div style={{display:"flex",gap:6,marginTop:6}}>
                      <button style={{...S.btn,flex:1}} onClick={()=>{setShowCardioForm(v=>!v);setShowRestForm(false);}}>🏃 Log cardio</button>
                      <button style={{...S.btn,flex:1}} onClick={()=>{setShowRestForm(v=>!v);setShowCardioForm(false);}}>😴 Log rest day</button>
                    </div>
                    {showCardioForm && <CardioForm form={cardioForm} setForm={setCardioForm} onSave={logCardio} onCancel={()=>setShowCardioForm(false)} />}
                    {showRestForm && <RestForm form={restForm} setForm={setRestForm} onSave={logRestDay} onCancel={()=>setShowRestForm(false)} />}
                  </div>
                ) : (
                  /* No active program — show freestyle + nudge + standalone routines */
                  <div style={{marginBottom:20}}>
                    <div style={{...S.secTitle,marginTop:0,borderBottom:"none",paddingBottom:0,marginBottom:14}}>Start a session</div>
                    <button style={{...S.btnPrimary,marginBottom:6,width:"100%"}} onClick={()=>startSession(null)}>+ Freestyle session</button>
                    <div style={{display:"flex",gap:6,marginBottom:10}}>
                      <button style={{...S.btn,flex:1}} onClick={()=>{setShowCardioForm(v=>!v);setShowRestForm(false);}}>🏃 Log cardio</button>
                      <button style={{...S.btn,flex:1}} onClick={()=>{setShowRestForm(v=>!v);setShowCardioForm(false);}}>😴 Log rest day</button>
                    </div>
                    {showCardioForm && <CardioForm form={cardioForm} setForm={setCardioForm} onSave={logCardio} onCancel={()=>setShowCardioForm(false)} />}
                    {showRestForm && <RestForm form={restForm} setForm={setRestForm} onSave={logRestDay} onCancel={()=>setShowRestForm(false)} />}
                    {(programs[uid]||[]).length>0 && (
                      <div style={{...S.card,fontSize:13,color:"var(--color-text-secondary)",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span>No active program selected</span>
                        <button style={S.btn} onClick={()=>setTab("routines")}>Set one →</button>
                      </div>
                    )}
                    {userRoutines.filter(r=>!r.archived && !r.programId).map(r=>(
                      <div key={r.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:500}}>{r.name}</div>
                          <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.exercises.length} exercise{r.exercises.length!==1?"s":""}</div>
                        </div>
                        <button style={S.btnPrimary} onClick={()=>startSession(r)}>▶ Start</button>
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={S.secTitle}>Recent sessions</div>
              {userSessions.slice(0,5).map(s=>{
                const isOpen = selectedSessionId === s.id;
                const isConfirmDelete = confirmDeleteSessionId === s.id;
                const typeIcon = s.type==="cardio"?"🏃":s.type==="rest"?"😴":"🏋️";
                return (
                  <div key={s.id} style={{...S.card,cursor:"pointer",borderColor:isOpen?"var(--color-accent)":undefined}}
                    onClick={()=>setSelectedSessionId(isOpen?null:s.id)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <span style={{fontSize:14,fontWeight:500}}>{typeIcon} {s.routineName}</span>
                        {s.type==="cardio" && <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:1}}>{s.durationMins} min{s.distance ? ` · ${s.distance} ${s.distanceUnit}` : ""}</div>}
                        {(s.type==="strength" || !s.type) && s.duration && <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:1}}>⏱ {fmtDuration(s.duration)}</div>}
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.date}</span>
                        {(!s.type || s.type==="strength") && <button style={S.btn} onClick={e=>{e.stopPropagation();editSession(s);}}>Edit</button>}
                        {(s.type==="cardio"||s.type==="rest") && <button style={S.btn} onClick={e=>{e.stopPropagation();setEditRestCardioId(s.id);setEditRestCardioForm({notes:s.notes||"",durationMins:s.durationMins||"",distance:s.distance||"",distanceUnit:s.distanceUnit||"km",activity:s.activity||""});setSelectedSessionId(s.id);}}>Edit</button>}
                        <button style={S.btn} onClick={e=>{e.stopPropagation();
                          const lines:string[]=[];
                          const icon=s.type==="cardio"?"🏃":s.type==="rest"?"😴":"🏋️";
                          lines.push(`${icon} ${s.routineName} — ${s.date}`);
                          lines.push("─".repeat(30));
                          if(s.type==="cardio"){
                            lines.push(`Activity: ${s.activity||"Cardio"}`);
                            lines.push(`Duration: ${s.durationMins} min`);
                            if(s.distance) lines.push(`Distance: ${s.distance} ${s.distanceUnit}`);
                            if(s.notes) lines.push(`Notes: ${s.notes}`);
                          } else if(s.type==="rest"){
                            lines.push(s.notes||"Planned rest day");
                          } else {
                            (s.exercises||[]).forEach((ex:any)=>{
                              lines.push("");
                              lines.push(ex.name+(ex.note?` (${ex.note})`:""));
                              (ex.sets||[]).forEach((st:any,k:number)=>lines.push(`  Set ${k+1}: ${st.w} lbs × ${st.r}`));
                            });
                            if(s.duration) lines.push(`\nDuration: ${fmtDuration(s.duration)}`);
                            if(s.comment) lines.push(`Note: ${s.comment}`);
                          }
                          navigator.clipboard.writeText(lines.join("\n"));
                        }}>📋 Copy</button>
                        {isConfirmDelete
                          ? <>
                              <button style={{...S.btn,color:"var(--color-error,#e05)"}} onClick={e=>{e.stopPropagation();deleteSession(s.id);}}>Confirm</button>
                              <button style={S.btn} onClick={e=>{e.stopPropagation();setConfirmDeleteSessionId(null);}}>Cancel</button>
                            </>
                          : <button style={S.btn} onClick={e=>{e.stopPropagation();setConfirmDeleteSessionId(s.id);}}>Delete</button>
                        }
                        <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{isOpen?"▲":"▼"}</span>
                      </div>
                    </div>
                    {!isOpen && s.type==="cardio" && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{s.notes||"Cardio session"}</div>}
                    {!isOpen && s.type==="rest" && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{s.notes||"Planned rest day"}</div>}
                    {!isOpen && (!s.type||s.type==="strength") && <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>{(s.exercises||[]).map((e:any)=>e.name).join(", ")}</div>}
                    {isOpen && s.type==="cardio" && (editRestCardioId===s.id ? (
                      <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}} onClick={e=>e.stopPropagation()}>
                        <div style={{display:"flex",gap:6,marginBottom:6}}>
                          <div style={{flex:2}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Activity</div>
                            <input value={editRestCardioForm.activity} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,activity:e.target.value}))}/>
                          </div>
                          <div style={{flex:1}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Duration (min)</div>
                            <input type="number" value={editRestCardioForm.durationMins} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,durationMins:e.target.value}))}/>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:6,marginBottom:6}}>
                          <div style={{flex:2}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Distance</div>
                            <input type="number" value={editRestCardioForm.distance} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,distance:e.target.value}))}/>
                          </div>
                          <div style={{flex:1}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Unit</div>
                            <select value={editRestCardioForm.distanceUnit} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,distanceUnit:e.target.value}))}>
                              <option>km</option><option>mi</option>
                            </select>
                          </div>
                        </div>
                        <div style={{marginBottom:8}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Notes</div>
                          <input value={editRestCardioForm.notes} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,notes:e.target.value}))}/>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button style={S.btnPrimary} onClick={async()=>{const upd=await apiUpdateSession(s.id,{activity:editRestCardioForm.activity,durationMins:Number(editRestCardioForm.durationMins),distance:editRestCardioForm.distance?Number(editRestCardioForm.distance):undefined,distanceUnit:editRestCardioForm.distanceUnit,notes:editRestCardioForm.notes});setSessions(prev=>({...prev,[uid]:prev[uid].map(x=>x.id===s.id?{...x,...upd}:x)}));setEditRestCardioId(null);}}>Save</button>
                          <button style={S.btn} onClick={()=>setEditRestCardioId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8,fontSize:12,color:"var(--color-text-secondary)"}}>
                        <div>{s.durationMins} min{s.distance ? ` · ${s.distance} ${s.distanceUnit}` : ""}</div>
                        {s.notes && <div style={{marginTop:4,fontStyle:"italic"}}>📝 {s.notes}</div>}
                      </div>
                    ))}
                    {isOpen && s.type==="rest" && (editRestCardioId===s.id ? (
                      <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}} onClick={e=>e.stopPropagation()}>
                        <div style={{marginBottom:8}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Notes</div>
                          <input value={editRestCardioForm.notes} style={{...S.sm,width:"100%"}} onChange={e=>setEditRestCardioForm(f=>({...f,notes:e.target.value}))}/>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button style={S.btnPrimary} onClick={async()=>{const upd=await apiUpdateSession(s.id,{notes:editRestCardioForm.notes});setSessions(prev=>({...prev,[uid]:prev[uid].map(x=>x.id===s.id?{...x,...upd}:x)}));setEditRestCardioId(null);}}>Save</button>
                          <button style={S.btn} onClick={()=>setEditRestCardioId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8,fontSize:12,color:"var(--color-text-secondary)"}}>
                        {s.notes ? <div style={{fontStyle:"italic"}}>📝 {s.notes}</div> : <div>Planned rest day</div>}
                      </div>
                    ))}
                    {isOpen && (!s.type||s.type==="strength") && (
                      <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:8}}>
                        {(s.exercises||[]).map((ex:any,j:number)=>(
                          <div key={j} style={{marginBottom:6}}>
                            <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{ex.name}</span>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:3}}>
                              {(ex.sets||[]).map((st:any,k:number)=>(
                                <span key={k} style={{fontSize:11,padding:"2px 7px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                                  Set {k+1}: {st.w} lbs × {st.r}
                                </span>
                              ))}
                            </div>
                            {ex.note && <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:3}}>📝 {ex.note}</div>}
                          </div>
                        ))}
                        {s.comment && <div style={{marginTop:8,paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",fontSize:12,color:"var(--color-text-secondary)",fontStyle:"italic"}}>💬 {s.comment}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...S.secTitle}}>
                <span>History calendar</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button style={S.btn} onClick={()=>{setLogCalOffset(o=>o+1);setLogCalSelectedDay(null);}}>‹</button>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)",minWidth:90,textAlign:"center"}}>{calMonthLabel(logCalDays)}</span>
                  <button style={{...S.btn,opacity:logCalOffset===0?0.3:1}} disabled={logCalOffset===0} onClick={()=>{setLogCalOffset(o=>Math.max(0,o-1));setLogCalSelectedDay(null);}}>›</button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                {calDayLabels.map(l=><div key={l} style={{textAlign:"center",fontSize:10,color:"var(--color-text-secondary)",paddingBottom:2}}>{l}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:"0.5rem"}}>
                {logCalDays.map(d=>{
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
                        <span style={{fontSize:13,fontWeight:500,color:"var(--color-accent)"}}>{s.type==="cardio"?"🏃 ":s.type==="rest"?"😴 ":""}{s.routineName}</span>
                        {(!s.type||s.type==="strength") && <button style={S.btn} onClick={()=>{editSession(s);setLogCalSelectedDay(null);}}>Edit</button>}
                      </div>
                      {s.type==="cardio" && <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.durationMins} min{s.distance ? ` · ${s.distance} ${s.distanceUnit}` : ""}{s.notes ? ` — ${s.notes}` : ""}</div>}
                      {s.type==="rest" && <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.notes||"Planned rest day"}</div>}
                      {(!s.type||s.type==="strength") && (s.exercises||[]).map((ex,j)=>(
                        <div key={j} style={{marginBottom:4}}>
                          <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)"}}>{ex.name}</span>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:2}}>
                            {(ex.sets||[]).map((st,k)=>(
                              <span key={k} style={{fontSize:11,padding:"2px 7px",borderRadius:8,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                                Set {k+1}: {st.w}×{st.r}
                              </span>
                            ))}
                          </div>
                          {ex.note && <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:3}}>📝 {ex.note}</div>}
                        </div>
                      ))}
                      {(!s.type||s.type==="strength") && s.comment && <div style={{marginTop:8,paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",fontSize:12,color:"var(--color-text-secondary)",fontStyle:"italic"}}>💬 {s.comment}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <span style={{fontSize:15,fontWeight:600}}>{activeSession.routineName}</span>
                  {activeSession.startedAt && (
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>⏱ {fmtDuration(elapsed)}</div>
                  )}
                </div>
                <button style={S.btn} onClick={()=>{if(window.confirm("Cancel this session? All progress will be lost.")){setActiveSession(null);setEditSessionId(null);setShowCommentStep(false);setSessionComment("");setRestRunning(false);setRestRemaining(null);}}}>Cancel</button>
              </div>

              {/* ── REST TIMER ── */}
              {(()=>{
                const done = restRemaining === 0;
                const active = restRemaining !== null;
                const mm = String(Math.floor((restRemaining??restDuration)/60)).padStart(2,"0");
                const ss = String((restRemaining??restDuration)%60).padStart(2,"0");
                const pct = active ? (restRemaining??0) / restDuration : 1;
                return (
                  <div style={{...S.card,marginBottom:12,borderColor: done ? "var(--color-accent)" : active ? "var(--color-border-secondary)" : "var(--color-border-tertiary)"}}>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Rest Timer</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontSize:28,fontWeight:600,letterSpacing:2,color: done ? "var(--color-accent)" : restRunning ? "var(--color-text-primary)" : "var(--color-text-secondary)",fontVariantNumeric:"tabular-nums"}}>
                          {mm}:{ss}
                        </span>
                        {done && <span style={{fontSize:12,color:"var(--color-accent)"}}>✓ Rest done!</span>}
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button style={S.btn} onClick={()=>{
                          if (!active) { setRestRemaining(restDuration); setRestRunning(true); }
                          else if (restRunning) { setRestRunning(false); }
                          else { setRestRunning(true); }
                        }}>
                          {!active || done ? "▶ Start" : restRunning ? "⏸ Pause" : "▶ Resume"}
                        </button>
                        <button style={S.btn} onClick={()=>{ setRestRemaining(null); setRestRunning(false); }}>↺</button>
                      </div>
                    </div>
                    <div style={{marginTop:8,height:4,borderRadius:2,background:"var(--color-background-secondary)"}}>
                      <div style={{height:4,borderRadius:2,background: done ? "var(--color-accent)" : "var(--color-accent)",width:`${Math.round(pct*100)}%`,transition:"width 1s linear",opacity: done ? 1 : 0.6}}/>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:8}}>
                      {[[60,"1:00"],[90,"1:30"],[120,"2:00"],[180,"3:00"]].map(([s,lbl])=>(
                        <button key={s} style={{...S.btn,flex:1,fontSize:11,background:restDuration===s&&!active?"var(--color-background-secondary)":"none",color:restDuration===s?"var(--color-text-primary)":"var(--color-text-secondary)"}}
                          onClick={()=>{ setRestDuration(s as number); setRestRemaining(null); setRestRunning(false); }}>{lbl}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {activeSession.exercises.map((ex,ei)=>{
                const pr=prs[ex.name];
                const last=getLastTwo(userSessions.filter(s=>editSessionId?s.id!==editSessionId:true),ex.name)[0];
                return (
                  <div key={ei} style={S.card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:14,fontWeight:500}}>{ex.name}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {/* Live volume for this exercise — only shown once at least one set has values */}
                        {calcExVol(ex.sets) > 0 && (
                          <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>
                            {fmtVol(calcExVol(ex.sets))} lbs
                          </span>
                        )}
                        <button style={{...S.btn,fontSize:11,color:"#A32D2D",padding:"2px 6px"}} onClick={()=>{
                          setActiveSession(prev=>({...prev,exercises:prev.exercises.filter((_,i)=>i!==ei)}));
                        }}>Remove</button>
                      </div>
                    </div>
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
                    <div style={{display:"flex",gap:6,marginTop:2}}>
                      <button style={{...S.btn,fontSize:12}} onClick={()=>{
                        setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],sets:[...exs[ei].sets,{w:ex.sets[0]?.w||"",r:ex.sets[0]?.r||""}]};return {...prev,exercises:exs};});
                      }}>+ Set</button>
                      <button style={{...S.btn,fontSize:12}} onClick={()=>{ setRestRemaining(restDuration); setRestRunning(true); }}>⏱ Rest</button>
                    </div>
                    <div style={{marginTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:6}}>
                      <input
                        type="text"
                        value={ex.note||""}
                        placeholder="📝 Machine notes (seat, pin, pad…)"
                        style={{...S.input,fontSize:11,padding:"5px 8px",color:"var(--color-text-secondary)"}}
                        onChange={e=>{
                          setActiveSession(prev=>{const exs=[...prev.exercises];exs[ei]={...exs[ei],note:e.target.value};return {...prev,exercises:exs};});
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <AddExerciseInline
                allExercises={fullDB}
                onAdd={name=>setActiveSession(prev=>({...prev,exercises:[...prev.exercises,{name,sets:[{w:"",r:""}],note:""}]}))}
                onCreateCustom={newEx=>{const arr=[...customExercises,newEx];setCustomExercises(arr);saveProfileToAPI({customExercises:arr});}}
              />
              {/* Session total volume summary */}
              {calcSessionVol(activeSession.exercises) > 0 && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",marginTop:12,borderRadius:"var(--border-radius-md)",background:"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)"}}>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>Total session volume</span>
                  <span style={{fontSize:14,fontWeight:600,color:"var(--color-accent)"}}>{fmtVol(calcSessionVol(activeSession.exercises))} lbs</span>
                </div>
              )}
              {!showCommentStep ? (
                <button style={{...S.btnPrimary,width:"100%",marginTop:12}} onClick={()=>setShowCommentStep(true)}>
                  {editSessionId?"Save changes":"Finish session"}
                </button>
              ) : (
                <div style={{...S.card,marginTop:12,borderColor:"var(--color-accent)"}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Session comment <span style={{fontWeight:400,color:"var(--color-text-secondary)"}}>(optional)</span></div>
                  <textarea
                    value={sessionComment}
                    onChange={e=>setSessionComment(e.target.value)}
                    placeholder="How did it feel? Energy, injuries, notes…"
                    rows={3}
                    style={{...S.input,resize:"vertical",fontSize:12,lineHeight:1.5}}
                    autoFocus
                  />
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button style={{...S.btnPrimary,flex:1}} onClick={saveSession}>
                      {editSessionId?"Save changes":"Save session"}
                    </button>
                    <button style={S.btn} onClick={()=>setShowCommentStep(false)}>Back</button>
                  </div>
                </div>
              )}
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
              {/* ═══════════════════════════════════════
                  PROGRAMS SECTION
              ═══════════════════════════════════════ */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...S.secTitle,marginTop:0}}>
                <span>Programs</span>
                <button style={S.btn} onClick={()=>{setProgramForm({name:"",routineIds:[]});setEditProgramId(null);setShowNewProgram(true);}}>+ New program</button>
              </div>

              {(programs[uid]||[]).length===0 && (
                <div style={{...S.card,color:"var(--color-text-secondary)",fontSize:13,textAlign:"center" as const,padding:"18px 12px"}}>
                  No programs yet. Create one to group your routines.
                </div>
              )}

              {(programs[uid]||[]).map(prog=>{
                const progRoutines = userRoutines.filter(r=>r.programId===prog.id && !r.archived);
                const isCollapsed = collapsedPrograms[prog.id];
                const isEditingName = editProgramId===prog.id;
                const isActive = activeProgramId===prog.id;
                return (
                  <div key={prog.id} style={{...S.card,marginBottom:12,padding:0,overflow:"hidden",borderColor:isActive?"var(--color-accent)":undefined,borderWidth:isActive?1.5:undefined}}>
                    {/* Program header */}
                    <div style={{padding:"12px 14px",background:"var(--color-bg-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      {isEditingName ? (
                        /* Inline rename form */
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <input autoFocus value={programForm.name} onChange={e=>setProgramForm(f=>({...f,name:e.target.value}))}
                            onKeyDown={e=>{if(e.key==="Enter")saveProgram();if(e.key==="Escape")setEditProgramId(null);}}
                            style={{...S.input,flex:1,marginBottom:0,padding:"5px 10px",fontSize:15}} />
                          <button style={S.btnPrimary} onClick={saveProgram}>Save</button>
                          <button style={S.btn} onClick={()=>setEditProgramId(null)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          {/* Top row: name + collapse toggle */}
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.01em"}}>{prog.name}</div>
                              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:2}}>
                                {progRoutines.length} routine{progRoutines.length!==1?"s":""}
                                {isActive && <span style={{marginLeft:8,fontSize:11,padding:"1px 7px",borderRadius:8,background:"var(--color-accent)",color:"#fff",fontWeight:500}}>Active</span>}
                              </div>
                              {(()=>{
                                if (!prog.cycleWeeks || !prog.cycleStartDate) return null;
                                const cw = prog.cycleWeeks;
                                const idx = getCycleWeekIndex(prog.cycleStartDate, cw.length);
                                const week = cw[idx];
                                const progNames = new Set(progRoutines.map((r:any)=>r.name));
                                const monday = getMondayOfWeek(today);
                                const done = countProgramSessionsInWeek(userSessions, progNames, monday);
                                const target = week.sessions;
                                const isRest = week.type==="rest";
                                return (
                                  <div style={{marginTop:6,fontSize:12}}>
                                    <span style={{color:"var(--color-text-secondary)"}}>Week {idx+1}/{cw.length} · </span>
                                    {isRest
                                      ? <span style={{color:"var(--color-text-secondary)"}}>😴 Rest week</span>
                                      : <>
                                          <span style={{fontWeight:600,color:done>=target?"var(--color-accent)":"var(--color-text-primary)"}}>{done}/{target}</span>
                                          <span style={{color:"var(--color-text-secondary)"}}> this week{done>=target?" ✓":""}</span>
                                        </>
                                    }
                                    <div style={{display:"flex",gap:3,marginTop:4}}>
                                      {cw.map((w:any,i:number)=>(
                                        <div key={i} style={{height:4,flex:1,borderRadius:2,background:i<idx?"var(--color-accent)":i===idx?"var(--color-accent)88":"var(--color-background-secondary)",border:"0.5px solid var(--color-border-tertiary)"}} />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            <button style={{...S.btn,padding:"4px 10px",fontSize:12}} onClick={()=>setCollapsedPrograms(p=>({...p,[prog.id]:!p[prog.id]}))}>
                              {isCollapsed?"▶ Show":"▼ Hide"}
                            </button>
                          </div>
                          {/* Bottom row: uniform action buttons */}
                          <div style={{display:"flex",gap:6,flexWrap:"wrap" as const}}>
                            {!isActive && <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>{setActiveProgramId(prog.id);saveProfileToAPI({activeProgramId:prog.id});}}>Set active</button>}
                            {prog.cycleWeeks && <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={async()=>{const d=getMondayOfWeek(today);await apiUpdateProgram(prog.id,{cycleStartDate:d});setPrograms(prev=>({...prev,[uid]:prev[uid].map(p=>p.id===prog.id?{...p,cycleStartDate:d}:p)}));}}>↺ Reset cycle</button>}
                            {prog.cycleWeeks && editStartDateProgramId===prog.id ? (
                              <>
                                <input type="date" value={editStartDateValue} style={{...S.sm,width:140}} onChange={e=>setEditStartDateValue(e.target.value)}/>
                                <button style={{...S.btnPrimary,fontSize:12,padding:"5px 12px"}} onClick={async()=>{if(!editStartDateValue)return;await apiUpdateProgram(prog.id,{cycleStartDate:editStartDateValue});setPrograms(prev=>({...prev,[uid]:prev[uid].map(p=>p.id===prog.id?{...p,cycleStartDate:editStartDateValue}:p)}));setEditStartDateProgramId(null);}}>Apply</button>
                                <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>setEditStartDateProgramId(null)}>Cancel</button>
                              </>
                            ) : (
                              prog.cycleWeeks && <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>{setEditStartDateProgramId(prog.id);setEditStartDateValue(prog.cycleStartDate||today);}}>📅 Start date</button>
                            )}
                            <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>{setEditProgramId(prog.id);setProgramForm({name:prog.name,routineIds:[],cycleActiveWeeks:prog.cycleWeeks?.filter((w:any)=>w.type==="active").length??3,cycleSessionsPerWeek:prog.cycleWeeks?.find((w:any)=>w.type==="active")?.sessions??3,cycleHasRestWeek:prog.cycleWeeks?.some((w:any)=>w.type==="rest")??true});}}>Rename</button>
                            <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>{
                              setAddRoutinesProgramId(prog.id);
                              setAddRoutinesSelection([]);
                              setCollapsedPrograms(p=>({...p,[prog.id]:false}));
                            }}>+ Add routines</button>
                            {confirmDeleteProgramId===prog.id ? (
                              <>
                                <span style={{fontSize:12,color:"var(--color-text-secondary)",alignSelf:"center"}}>Sure?</span>
                                <button style={{...S.btnDanger,fontSize:12,padding:"5px 12px"}} onClick={()=>deleteProgram(prog.id)}>Yes, delete</button>
                                <button style={{...S.btn,fontSize:12,padding:"5px 12px"}} onClick={()=>setConfirmDeleteProgramId(null)}>Cancel</button>
                              </>
                            ) : (
                              <button style={{...S.btnDanger,fontSize:12,padding:"5px 12px"}} onClick={()=>setConfirmDeleteProgramId(prog.id)}>Delete</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Routines inside this program */}
                    {!isCollapsed && (
                      <div style={{padding:"8px 10px",display:"flex",flexDirection:"column",gap:8}}>
                        {/* Add routines picker */}
                        {addRoutinesProgramId===prog.id && (()=>{
                          // Show all non-archived routines not already in this program
                          // Only show routines that are truly unassigned (standalone) and not archived
                          const candidates = userRoutines.filter(r=>!r.archived && !r.programId);
                          return (
                            <div style={{background:"var(--color-bg-secondary)",borderRadius:"var(--border-radius-sm)",padding:"10px 10px 8px",border:"0.5px solid var(--color-accent)"}}>
                              <div style={{fontSize:12,fontWeight:500,marginBottom:8,color:"var(--color-text-secondary)"}}>Select routines to add</div>
                              {candidates.length===0 ? (
                                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:8}}>No standalone routines available to add.</div>
                              ) : (
                                <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                                  {candidates.map(r=>{
                                    const checked = addRoutinesSelection.includes(r.id);
                                    const otherProg = (programs[uid]||[]).find(p=>p.id===r.programId);
                                    return (
                                      <label key={r.id} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,padding:"5px 6px",borderRadius:"var(--border-radius-sm)",background:checked?"var(--color-bg-primary)":"transparent"}}>
                                        <input type="checkbox" checked={checked}
                                          onChange={e=>setAddRoutinesSelection(s=>e.target.checked?[...s,r.id]:s.filter(id=>id!==r.id))}
                                          style={{accentColor:"var(--color-accent)",width:15,height:15}}/>
                                        <span style={{flex:1}}>{r.name}</span>
                                        <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{r.exercises?.length ?? 0} exercises</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                              <div style={{display:"flex",gap:6}}>
                                <button style={{...S.btnPrimary,flex:1}} onClick={async()=>{
                                  if (addRoutinesSelection.length>0) {
                                    for (const rid of addRoutinesSelection) await apiUpdateRoutine(rid,{programId:prog.id});
                                    setRoutines(prev=>({...prev,[uid]:prev[uid].map(r=>
                                      addRoutinesSelection.includes(r.id)?{...r,programId:prog.id}:r
                                    )}));
                                  }
                                  setAddRoutinesProgramId(null);
                                  setAddRoutinesSelection([]);
                                }}>Add {addRoutinesSelection.length>0?`(${addRoutinesSelection.length})`:""}
                                </button>
                                <button style={S.btn} onClick={()=>{setAddRoutinesProgramId(null);setAddRoutinesSelection([]);}}>Cancel</button>
                              </div>
                            </div>
                          );
                        })()}
                        {progRoutines.length===0 && addRoutinesProgramId!==prog.id && (
                          <div style={{fontSize:13,color:"var(--color-text-secondary)",padding:"6px 2px"}}>No routines yet.</div>
                        )}
                        {progRoutines.map(r=>(
                          <div key={r.id} style={S.cardSec}>
                            {/* Top row: name + Start */}
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                              <span style={{fontSize:14,fontWeight:600}}>{r.name}</span>
                              <button style={S.btnPrimary} onClick={()=>startSession(r)}>▶ Start</button>
                            </div>
                            {/* Exercise list */}
                            {r.exercises.map((e,i)=>(
                              <div key={i} style={{fontSize:12,display:"flex",justifyContent:"space-between",marginBottom:2,color:"var(--color-text-secondary)"}}>
                                <span style={{color:"var(--color-text-primary)"}}>{e.name}</span>
                                <span>{e.sets} × {e.reps} @ {e.weight} lbs</span>
                              </div>
                            ))}
                            {/* Bottom row: secondary actions */}
                            <div style={{display:"flex",gap:6,marginTop:10,paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                              {confirmDeleteId===r.id ? (
                                <>
                                  <span style={{fontSize:12,color:"var(--color-text-secondary)",alignSelf:"center"}}>Sure?</span>
                                  <button style={{...S.btnDanger,fontSize:12,padding:"4px 10px"}} onClick={()=>{deleteRoutine(r.id);setConfirmDeleteId(null);}}>Yes, delete</button>
                                  <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>setConfirmDeleteId(null)}>Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>editRoutine(r)}>Edit</button>
                                  <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>duplicateRoutine(r)}>Copy</button>
                                  <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>archiveRoutine(r.id)}>Archive</button>
                                  <button style={{...S.btnDanger,fontSize:12,padding:"4px 10px"}} onClick={()=>setConfirmDeleteId(r.id)}>Delete</button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── New program form ── */}
              {showNewProgram && (()=>{
                const availableRoutines = userRoutines.filter(r=>!r.archived && !r.programId);
                return (
                  <div style={{...S.card,marginBottom:16,borderColor:"var(--color-accent)"}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>New training program</div>
                    <div style={S.label}>Program name</div>
                    <input autoFocus value={programForm.name} onChange={e=>setProgramForm(f=>({...f,name:e.target.value}))}
                      onKeyDown={e=>{if(e.key==="Enter")saveProgram();}}
                      placeholder="e.g. PPL, 5/3/1, Hypertrophy Block" style={{...S.input,marginBottom:12}}/>
                    {availableRoutines.length>0 && (
                      <>
                        <div style={S.label}>Include routines</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                          {availableRoutines.map(r=>{
                            const checked = programForm.routineIds.includes(r.id);
                            const currentProg = (programs[uid]||[]).find(p=>p.id===r.programId);
                            return (
                              <label key={r.id} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,padding:"6px 8px",borderRadius:"var(--border-radius-sm)",background:checked?"var(--color-bg-secondary)":"transparent"}}>
                                <input type="checkbox" checked={checked}
                                  onChange={e=>setProgramForm(f=>({...f,
                                    routineIds:e.target.checked?[...f.routineIds,r.id]:f.routineIds.filter(id=>id!==r.id)
                                  }))}
                                  style={{accentColor:"var(--color-accent)",width:15,height:15}}/>
                                <span style={{flex:1}}>{r.name}</span>
                                {currentProg && <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>in {currentProg.name}</span>}
                              </label>
                            );
                          })}
                        </div>
                      </>
                    )}
                    <div style={S.label}>Weekly cycle</div>
                    <div style={{...S.card,background:"var(--color-background-secondary)",padding:"10px 12px",marginBottom:12}}>
                      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8,flexWrap:"wrap" as const}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <input type="number" min={1} max={12} style={{...S.input,width:52,marginBottom:0,padding:"5px 8px",textAlign:"center" as const}} value={programForm.cycleActiveWeeks} onChange={e=>setProgramForm(f=>({...f,cycleActiveWeeks:Math.max(1,Number(e.target.value))}))} />
                          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>active weeks ×</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <input type="number" min={1} max={7} style={{...S.input,width:44,marginBottom:0,padding:"5px 8px",textAlign:"center" as const}} value={programForm.cycleSessionsPerWeek} onChange={e=>setProgramForm(f=>({...f,cycleSessionsPerWeek:Math.max(1,Number(e.target.value))}))} />
                          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>sessions/week</span>
                        </div>
                      </div>
                      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,cursor:"pointer"}}>
                        <input type="checkbox" checked={programForm.cycleHasRestWeek} onChange={e=>setProgramForm(f=>({...f,cycleHasRestWeek:e.target.checked}))} style={{accentColor:"var(--color-accent)"}} />
                        <span>Add a rest/deload week at end of cycle</span>
                      </label>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:8}}>
                        Cycle: {programForm.cycleActiveWeeks} week{programForm.cycleActiveWeeks!==1?"s":""} × {programForm.cycleSessionsPerWeek} sessions{programForm.cycleHasRestWeek?" + 1 rest week":""} = {programForm.cycleActiveWeeks+(programForm.cycleHasRestWeek?1:0)} weeks total
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={{...S.btnPrimary,flex:1}} onClick={saveProgram}>Create</button>
                      <button style={S.btn} onClick={()=>setShowNewProgram(false)}>Cancel</button>
                    </div>
                  </div>
                );
              })()}

              {/* ═══════════════════════════════════════
                  STANDALONE ROUTINES SECTION
              ═══════════════════════════════════════ */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",...S.secTitle}}>
                <span>Standalone routines</span>
                <button style={S.btnPrimary} onClick={()=>{setRoutineForm({name:"",exercises:[],programId:""});setEditRoutineId(null);setShowNewRoutine(true);}}>+ New routine</button>
              </div>

              {(()=>{
                const standalone = userRoutines.filter(r=>!r.programId && !r.archived);
                return standalone.length===0 ? (
                  <div style={{...S.card,color:"var(--color-text-secondary)",fontSize:13,textAlign:"center" as const,padding:"18px 12px"}}>
                    No standalone routines. Create one or assign existing routines to a program.
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {standalone.map(r=>(
                      <div key={r.id} style={S.card}>
                        {/* Top row: name + Start */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <span style={{fontSize:15,fontWeight:600}}>{r.name}</span>
                          <button style={S.btnPrimary} onClick={()=>startSession(r)}>▶ Start</button>
                        </div>
                        {/* Exercise list */}
                        {r.exercises.map((e,i)=>(
                          <div key={i} style={{fontSize:13,display:"flex",justifyContent:"space-between",marginBottom:2,color:"var(--color-text-secondary)"}}>
                            <span style={{color:"var(--color-text-primary)"}}>{e.name}</span>
                            <span>{e.sets} × {e.reps} reps @ {e.weight} lbs</span>
                          </div>
                        ))}
                        {/* Bottom row: secondary actions */}
                        <div style={{display:"flex",gap:6,marginTop:10,paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)"}}>
                          {confirmDeleteId===r.id ? (
                            <>
                              <span style={{fontSize:12,color:"var(--color-text-secondary)",alignSelf:"center"}}>Sure?</span>
                              <button style={{...S.btnDanger,fontSize:12,padding:"4px 10px"}} onClick={()=>{deleteRoutine(r.id);setConfirmDeleteId(null);}}>Yes, delete</button>
                              <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>setConfirmDeleteId(null)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>editRoutine(r)}>Edit</button>
                              <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>duplicateRoutine(r)}>Copy</button>
                              <button style={{...S.btn,fontSize:12,padding:"4px 10px"}} onClick={()=>archiveRoutine(r.id)}>Archive</button>
                              <button style={{...S.btnDanger,fontSize:12,padding:"4px 10px"}} onClick={()=>setConfirmDeleteId(r.id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* ── Starter Templates ── */}
              <div style={{marginTop:"1.5rem"}}>
                <button style={{...S.btn,width:"100%",textAlign:"left" as const,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>setShowTemplates(v=>!v)}>
                  <span>📋 Starter templates</span>
                  <span>{showTemplates?"▲":"▼"}</span>
                </button>
                {showTemplates && (
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
                    {ROUTINE_TEMPLATES.map(t=>{
                      const alreadyAdded = userRoutines.some(r=>r.name===t.name);
                      return (
                        <div key={t.name} style={{...S.card,padding:"12px 14px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                            <div>
                              <div style={{fontSize:14,fontWeight:600}}>{t.name}</div>
                              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{t.tag}</div>
                            </div>
                            <button
                              style={{...S.btnPrimary,fontSize:12,padding:"4px 12px",opacity:alreadyAdded?0.45:1,cursor:alreadyAdded?"default":"pointer"}}
                              disabled={alreadyAdded}
                              onClick={async()=>{
                                if (alreadyAdded) return;
                                const created = await apiCreateRoutine({userId:uid, name:t.name, exercises:t.exercises, programId:"", archived:false});
                                setRoutines(prev=>({...prev,[uid]:[...(prev[uid]||[]),created]}));
                              }}
                            >{alreadyAdded?"Added ✓":"+ Add"}</button>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:2}}>
                            {t.exercises.map((e,i)=>(
                              <div key={i} style={{fontSize:12,display:"flex",justifyContent:"space-between",color:"var(--color-text-secondary)"}}>
                                <span style={{color:"var(--color-text-primary)"}}>{e.name}</span>
                                <span>{e.sets}×{e.reps}{e.weight>0?` @ ${e.weight} lbs`:""}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Archive ── */}
              {userRoutines.some(r=>r.archived) && (
                <div style={{marginTop:"1.5rem"}}>
                  <button style={{...S.btn,width:"100%",textAlign:"left" as const,display:"flex",justifyContent:"space-between"}} onClick={()=>setShowArchived(v=>!v)}>
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
              {(programs[uid]||[]).length>0 && (
                <>
                  <div style={{...S.label,marginTop:10}}>Program (optional)</div>
                  <select value={routineForm.programId||""} onChange={e=>setRoutineForm(f=>({...f,programId:e.target.value}))}
                    style={{...S.input,marginBottom:4}}>
                    <option value="">— Standalone —</option>
                    {(programs[uid]||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </>
              )}
              <div style={{...S.secTitle,marginTop:"1.5rem",fontSize:11,letterSpacing:"0.08em"}}>Exercises</div>
              {routineForm.exercises.map((ex,i)=>(
                <div key={i} style={{...S.cardSec,marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:500}}>{ex.name}</span>
                    <div style={{display:"flex",gap:3}}>
                      <button style={{...S.btn,padding:"2px 6px",fontSize:11}} disabled={i===0} onClick={()=>setRoutineForm(f=>{const a=[...f.exercises];[a[i-1],a[i]]=[a[i],a[i-1]];return{...f,exercises:a};})}>▲</button>
                      <button style={{...S.btn,padding:"2px 6px",fontSize:11}} disabled={i===routineForm.exercises.length-1} onClick={()=>setRoutineForm(f=>{const a=[...f.exercises];[a[i],a[i+1]]=[a[i+1],a[i]];return{...f,exercises:a};})}>▼</button>
                      <button style={{...S.btn,padding:"2px 8px",fontSize:11}} onClick={()=>setRoutineForm(f=>({...f,exercises:f.exercises.filter((_,j)=>j!==i)}))}>Remove</button>
                    </div>
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
                  <div style={{marginTop:6}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Notes</div>
                    <input value={ex.note||""} placeholder="e.g. keep elbows tucked" style={{...S.sm,width:"100%"}} onChange={e=>setRoutineForm(f=>({...f,exercises:f.exercises.map((x,j)=>j===i?{...x,note:e.target.value}:x)}))}/>
                  </div>
                </div>
              ))}
              <div style={S.label}>Search & add exercise</div>
              <input value={routineExSearch} onChange={e=>setRoutineExSearch(e.target.value)} placeholder="Search exercises..." style={{...S.input,marginBottom:6}}/>
              <div style={{maxHeight:160,overflowY:"auto",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-md)"}}>
                {fullDB.filter(e=>e.name.toLowerCase().includes(routineExSearch.toLowerCase())).map(e=>(
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
          {/* Unit selector — switches between lbs and kg, resets target to a sensible default */}
          <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
            <span style={{fontSize:13}}>Unit:</span>
            {["lbs","kg"].map(u=><button key={u} style={S.pill(unit===u,"var(--color-accent)")} onClick={()=>{
              const def = u==="lbs"?135:60;
              setUnit(u); setTargetW(def); setTargetWInput(String(def));
            }}>{u}</button>)}
          </div>
          {/* Bar selector — affects the bar weight subtracted before plate calculation */}
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {BARS.map((b,i)=><button key={b.name} style={S.pill(barIdx===i,"#3B6D11")} onClick={()=>setBarIdx(i)}>{b.name} ({unit==="lbs"?b.weight:Math.round(b.weight*0.453592)})</button>)}
          </div>
          <div style={S.label}>Target weight ({unit})</div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            {/* Slider for quick scrubbing */}
            <input type="range" min={barW} max={unit==="lbs"?500:225} step={unit==="lbs"?5:2.5} value={targetW}
              onChange={e=>{ const v=Number(e.target.value); setTargetW(v); setTargetWInput(String(v)); }}
              style={{flex:1}}/>
            {/* Step-down button */}
            <button style={S.btn} onClick={()=>{
              const v = Math.max(barW, targetW-(unit==="lbs"?5:2.5));
              setTargetW(v); setTargetWInput(String(v));
            }}>-5</button>
            {/* Free-type input — snaps to nearest achievable weight on blur or Enter */}
            <input
              type="text" inputMode="decimal"
              value={targetWInput}
              style={{...S.sm,width:64,textAlign:"center"}}
              onChange={e=>setTargetWInput(e.target.value)}
              onBlur={()=>{
                const parsed = parseFloat(targetWInput);
                if (isNaN(parsed)) { setTargetWInput(String(targetW)); return; }
                // Snap to nearest step increment, clamped to bar weight minimum
                const step = unit==="lbs" ? 2.5 : 1.25;
                const snapped = Math.max(barW, Math.round(parsed / step) * step);
                setTargetW(snapped);
                setTargetWInput(String(snapped));
              }}
              onKeyDown={e=>{ if(e.key==="Enter") (e.target as HTMLInputElement).blur(); }}
            />
            {/* Step-up button */}
            <button style={S.btn} onClick={()=>{
              const v = targetW+(unit==="lbs"?5:2.5);
              setTargetW(v); setTargetWInput(String(v));
            }}>+5</button>
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
            <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:500}}>Total: {actualTotal} {unit}</span>
              {notExact && <span style={{fontSize:11,color:"#F0992B"}}>⚠ {targetW - actualTotal > 0 ? `+${(targetW-actualTotal).toFixed(2)}` : (targetW-actualTotal).toFixed(2)} {unit} short</span>}
            </div>
          </div>

          <div style={S.secTitle}>My plates ({unit})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
            {allPlates.map(p=>{
              const pairs = getPairs(p);
              const enabled = pairs > 0;
              const color = PLATE_COLORS[p] || "#888";
              return (
                <div key={p} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 10px",borderRadius:6,border:`1px solid ${enabled ? color : "var(--color-border-tertiary)"}`,background:enabled ? `${color}18` : "none",minWidth:58}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:color,opacity:enabled?1:0.35}}/>
                  <span style={{fontSize:12,fontWeight:500,opacity:enabled?1:0.4}}>{p} {unit}</span>
                  <span style={{fontSize:10,color:enabled?"var(--color-text-secondary)":"#A32D2D",marginBottom:1}}>
                    {enabled ? `${pairs} ${pairs===1?"pair":"pairs"}` : "disabled"}
                  </span>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <button style={{...S.btn,padding:"1px 6px",fontSize:11}} onClick={()=>setPairs(p,pairs-1)}>−</button>
                    <button style={{...S.btn,padding:"1px 6px",fontSize:11}} onClick={()=>setPairs(p,pairs+1)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:10,color:"var(--color-text-secondary)",marginBottom:4}}>Max 9 pairs · tap − to 0 to disable</div>
        </div>
      )}

      {/* ── EXERCISE DB ── */}
      {tab==="db" && (
        <div>
          {/* Search bar */}
          <input value={dbSearch} onChange={e=>setDbSearch(e.target.value)} placeholder="Search exercises..." style={{...S.input,marginBottom:12}}/>

          {/* Equipment filter pills */}
          <div style={S.subLabel}>Equipment</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {EQ_TYPES.map(t=><button key={t} style={S.pill(dbEq===t,"var(--color-accent)")} onClick={()=>setDbEq(t)}>{t}</button>)}
          </div>

          {/* Muscle group filter pills */}
          <div style={S.subLabel}>Muscle group</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {["All","Chest","Back","Shoulders","Traps","Biceps","Triceps","Forearms","Abs","Core","Quads","Hamstrings","Glutes","Adductors","Abductors","Calves","Neck"].map(m=>(
              <button key={m} style={S.pill(dbMuscle===m,"#534AB7")} onClick={()=>setDbMuscle(m)}>{m}</button>
            ))}
          </div>

          {/* Count + create button */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{filteredDB.length} exercises</span>
            <button style={S.btnPrimary} onClick={()=>{ setCustomForm({name:"",muscle:"Chest",eq:"Barbell",type:"Isolation"}); setShowCustomForm(true); }}>+ Create exercise</button>
          </div>

          {/* Create custom exercise form */}
          {showCustomForm && (
            <div style={{...S.card,marginBottom:12,borderColor:"var(--color-accent)"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>New exercise</div>
              <div style={S.label}>Name</div>
              <input value={customForm.name} onChange={e=>setCustomForm(f=>({...f,name:e.target.value}))}
                placeholder="e.g. Cable Face Pull" style={{...S.input,marginBottom:8}} autoFocus/>
              <div style={S.label}>Muscle group</div>
              <select value={customForm.muscle} onChange={e=>setCustomForm(f=>({...f,muscle:e.target.value}))}
                style={{...S.input,marginBottom:8}}>
                {["Chest","Back","Shoulders","Traps","Biceps","Triceps","Forearms","Abs","Core","Quads","Hamstrings","Glutes","Adductors","Abductors","Calves","Neck"].map(m=>(
                  <option key={m}>{m}</option>
                ))}
              </select>
              <div style={S.label}>Equipment</div>
              <select value={customForm.eq} onChange={e=>setCustomForm(f=>({...f,eq:e.target.value}))}
                style={{...S.input,marginBottom:8}}>
                {["Barbell","EZ Bar","Smith Machine","Dumbbell","Cable","Machine","Bodyweight","Kettlebell","Rings","Bands","Swiss Ball","Trap Bar","Landmine","Medicine Ball","TRX","No Equipment"].map(e=>(
                  <option key={e}>{e}</option>
                ))}
              </select>
              <div style={S.label}>Type</div>
              <select value={customForm.type} onChange={e=>setCustomForm(f=>({...f,type:e.target.value}))}
                style={{...S.input,marginBottom:12}}>
                {["Compound","Isolation","Isometric","Plyometric"].map(t=><option key={t}>{t}</option>)}
              </select>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.btnPrimary,flex:1}} onClick={()=>{
                  if (!customForm.name.trim()) return;
                  const newEx = {...customForm, name:customForm.name.trim(), id:`custom-${Date.now()}`, custom:true};
                  const arr = [...customExercises, newEx];
                  setCustomExercises(arr);
                  saveProfileToAPI({customExercises:arr});
                  setShowCustomForm(false);
                }}>Save</button>
                <button style={S.btn} onClick={()=>setShowCustomForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filteredDB.map(ex=>(
              <div key={ex.id} style={{...S.card,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,fontWeight:500}}>{ex.name}</span>
                    {ex.custom && <span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#534AB722",color:"#534AB7",fontWeight:500}}>custom</span>}
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={S.tag("var(--color-accent)")}>{ex.muscle}</span>
                    <span style={S.tag("#3B6D11")}>{ex.eq}</span>
                    {ex.custom && (
                      <button style={{...S.btn,fontSize:11,color:"#A32D2D",padding:"2px 7px"}} onClick={()=>{
                        if(window.confirm(`Delete "${ex.name}"?`)){const arr=customExercises.filter(e=>e.id!==ex.id);setCustomExercises(arr);saveProfileToAPI({customExercises:arr});}
                      }}>✕</button>
                    )}
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:4}}>{ex.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROFILE ── */}
      {tab==="profile" && (()=>{
        const profile = profiles[uid] || {};
        const age = calcAge(profile.birthDate);
        const weightUnit = profile.weightUnit || "lbs";
        const measureUnit: "metric"|"imperial" = profile.measureUnit || "metric";
        const weights: any[] = profile.weights || [];
        const lastWeight = weights[weights.length-1];
        const prevWeight = weights[weights.length-2];
        const weightDiff = lastWeight && prevWeight ? (lastWeight.value - prevWeight.value).toFixed(1) : null;

        function saveProfile(updates:any) {
          setProfiles(prev=>({...prev,[uid]:{...(prev[uid]||{}),...updates}}));
          saveProfileToAPI(updates);
        }
        function addWeight() {
          const v = parseFloat(profileWeightInput);
          if (isNaN(v) || v<=0) return;
          saveProfile({weights:[...weights,{date:today,value:v}]});
          setProfileWeightInput("");
        }

        return (
          <div>
            {/* ── Unit system ── */}
            <div style={S.secTitle}>Unit system</div>
            <div style={S.card}>
              <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:10}}>Controls how all body measurements are displayed and entered.</div>
              <div style={{display:"flex",gap:8}}>
                {(["metric","imperial"] as const).map(u=>(
                  <button key={u} style={{...S.pill(measureUnit===u,"var(--color-accent)"),flex:1,textAlign:"center" as const}}
                    onClick={()=>saveProfile({measureUnit:u})}>
                    {u==="metric"?"⚖️ Metric (kg, cm)":"🇺🇸 Imperial (lbs, in)"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Personal info ── */}
            <div style={S.secTitle}>Personal info</div>
            <div style={S.card}>
              <div style={{marginBottom:12}}>
                <div style={S.label}>Name</div>
                <div style={{fontSize:14}}>{pb.authStore.record?.email ?? ""}</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{...S.label,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>Birth date</span>
                  {age && <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{age} yrs</span>}
                </div>
                <input type="date" value={profile.birthDate||""} onChange={e=>saveProfile({birthDate:e.target.value})} style={S.input}/>
              </div>
              {/* Height — input changes by unit */}
              <div style={S.label}>Height</div>
              {measureUnit==="metric" ? (
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <input type="text" inputMode="decimal" value={profile.height||""} onChange={e=>saveProfile({height:e.target.value})} placeholder="cm" style={{...S.input,flex:1}}/>
                  <span style={{fontSize:13,color:"var(--color-text-secondary)",whiteSpace:"nowrap" as const}}>
                    {profile.height ? cmToFtIn(parseFloat(profile.height)) : "—"}
                  </span>
                </div>
              ) : (
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="text" inputMode="decimal" value={profileHeightFt} placeholder="ft"
                    style={{...S.input,width:72,flex:"none"}}
                    onChange={e=>{ setProfileHeightFt(e.target.value); }}
                    onBlur={()=>{
                      const ft=parseFloat(profileHeightFt), inches=parseFloat(profileHeightIn||"0");
                      if (!isNaN(ft)) saveProfile({height:String(Math.round(inchesToCm(ft*12+inches)*10)/10)});
                    }}/>
                  <input type="text" inputMode="decimal" value={profileHeightIn} placeholder="in"
                    style={{...S.input,width:72,flex:"none"}}
                    onChange={e=>setProfileHeightIn(e.target.value)}
                    onBlur={()=>{
                      const ft=parseFloat(profileHeightFt||"0"), inches=parseFloat(profileHeightIn);
                      if (!isNaN(inches)) saveProfile({height:String(Math.round(inchesToCm(ft*12+inches)*10)/10)});
                    }}/>
                  <span style={{fontSize:13,color:"var(--color-text-secondary)",whiteSpace:"nowrap" as const}}>
                    {profile.height ? `${parseFloat(profile.height)} cm` : "—"}
                  </span>
                </div>
              )}
              {/* BMI if we have weight + height */}
              {(()=>{
                const lastW = weights[weights.length-1];
                const heightCm = parseFloat(profile.height);
                const weightKg = lastW ? (weightUnit==="lbs" ? lastW.value*0.453592 : lastW.value) : null;
                const bmi = weightKg&&heightCm ? calcBMI(weightKg, heightCm) : null;
                const cat = bmi ? bmiCategory(bmi) : null;
                return bmi ? (
                  <div style={{marginTop:12,display:"flex",alignItems:"center",gap:12}}>
                    <div>
                      <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:2}}>BMI</div>
                      <div style={{fontSize:22,fontWeight:600}}>{bmi}</div>
                    </div>
                    <div style={{fontSize:12,padding:"3px 10px",borderRadius:8,background:cat!.color+"22",color:cat!.color,fontWeight:500}}>{cat!.label}</div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* ── Weight tracking ── */}
            <div style={S.secTitle}>Weight tracking</div>
            <div style={S.card}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:12}}>
                {["lbs","kg"].map(u=><button key={u} style={S.pill(weightUnit===u,"var(--color-accent)")} onClick={()=>saveProfile({weightUnit:u})}>{u}</button>)}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <input type="text" inputMode="decimal" value={profileWeightInput} onChange={e=>setProfileWeightInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addWeight()}
                  placeholder={`Weight in ${weightUnit}`} style={{...S.input,margin:0}}/>
                <button style={S.btnPrimary} onClick={addWeight}>Log</button>
              </div>
              {lastWeight && (
                <div style={{display:"flex",gap:16,marginBottom:12,flexWrap:"wrap" as const}}>
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

            {/* ── Body measurements ── */}
            <div style={S.secTitle}>Body measurements</div>
            <div style={S.card}>
              <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>
                Stored in cm · displayed in {measureUnit==="imperial"?"inches":"cm"}
              </div>
              {/* Log form */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {([
                  ["waist","Waist"],["hips","Hips"],["chest","Chest"],["arm","Bicep (flexed)"]
                ] as [string,string][]).map(([key,label])=>(
                  <div key={key}>
                    <div style={S.label}>{label} ({measureUnit==="imperial"?"in":"cm"})</div>
                    <input type="text" inputMode="decimal"
                      value={(profileMeasureForm as any)[key]}
                      onChange={e=>setProfileMeasureForm(f=>({...f,[key]:e.target.value}))}
                      placeholder={measureUnit==="imperial"?"e.g. 32":"e.g. 81"}
                      style={S.input}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                <div style={S.label}>Body fat %</div>
                <input type="text" inputMode="decimal"
                  value={profileMeasureForm.bodyFat}
                  onChange={e=>setProfileMeasureForm(f=>({...f,bodyFat:e.target.value}))}
                  placeholder="e.g. 18" style={{...S.input,maxWidth:160}}/>
              </div>
              <button style={{...S.btnPrimary,width:"100%"}} onClick={()=>{
                const toStore = (v:string) => {
                  const n = parseFloat(v);
                  if (isNaN(n)||n<=0) return undefined;
                  // Convert imperial input (inches) to cm for storage
                  return measureUnit==="imperial" ? inchesToCm(n) : n;
                };
                const bf = parseFloat(profileMeasureForm.bodyFat);
                const entry:any = {date:today};
                const w = toStore(profileMeasureForm.waist);   if(w)   entry.waist=w;
                const h = toStore(profileMeasureForm.hips);    if(h)   entry.hips=h;
                const c = toStore(profileMeasureForm.chest);   if(c)   entry.chest=c;
                const a = toStore(profileMeasureForm.arm);     if(a)   entry.arm=a;
                if(!isNaN(bf)&&bf>0) entry.bodyFat=bf;
                if (Object.keys(entry).length>1) {
                  saveProfile({bodyMeasurements:[...(profile.bodyMeasurements||[]),entry]});
                  setProfileMeasureForm({waist:"",hips:"",chest:"",arm:"",bodyFat:""});
                }
              }}>Log measurements</button>

              {/* Latest measurements display */}
              {(()=>{
                const history:any[] = profile.bodyMeasurements||[];
                if (history.length===0) return null;
                // Latest value for each metric
                const latest = (key:string) => {
                  for (let i=history.length-1;i>=0;i--) if(history[i][key]!=null) return history[i][key];
                  return null;
                };
                const fields = [
                  {key:"waist",label:"Waist"},{key:"hips",label:"Hips"},
                  {key:"chest",label:"Chest"},{key:"arm",label:"Bicep"},
                  {key:"bodyFat",label:"Body fat",unit:"%"},
                ];
                return (
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:8}}>LATEST</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                      {fields.map(f=>{
                        const v = latest(f.key);
                        if (v==null) return null;
                        const display = f.unit==="%" ? `${v}%` : displayMeasure(v, measureUnit);
                        return (
                          <div key={f.key} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"10px 12px"}}>
                            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>{f.label.toUpperCase()}</div>
                            <div style={{fontSize:16,fontWeight:600}}>{display}</div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Recent history */}
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",margin:"12px 0 6px"}}>HISTORY</div>
                    {history.slice().reverse().slice(0,5).map((entry:any,i:number)=>(
                      <div key={i} style={{fontSize:12,padding:"5px 0",borderBottom:"0.5px solid var(--color-border-tertiary)",display:"flex",flexWrap:"wrap" as const,gap:8,justifyContent:"space-between"}}>
                        <span style={{color:"var(--color-text-secondary)"}}>{entry.date}</span>
                        <span style={{display:"flex",gap:10,flexWrap:"wrap" as const}}>
                          {entry.waist!=null&&<span>W: {displayMeasure(entry.waist,measureUnit)}</span>}
                          {entry.hips!=null&&<span>H: {displayMeasure(entry.hips,measureUnit)}</span>}
                          {entry.chest!=null&&<span>C: {displayMeasure(entry.chest,measureUnit)}</span>}
                          {entry.arm!=null&&<span>B: {displayMeasure(entry.arm,measureUnit)}</span>}
                          {entry.bodyFat!=null&&<span>BF: {entry.bodyFat}%</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* ── Unit converter ── */}
            <div style={S.secTitle}>Unit converter</div>
            <div style={S.card}>
              {/* Height converter */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Height</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {([["cmToIn","cm → ft/in"],["inToCm","ft/in → cm"]] as const).map(([d,lbl])=>(
                    <button key={d} style={S.pill(convHDir===d,"var(--color-accent)")} onClick={()=>{setConvHDir(d);setConvHInput("");}}>{lbl}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="text" inputMode="decimal" value={convHInput} onChange={e=>setConvHInput(e.target.value)}
                    placeholder={convHDir==="cmToIn"?"cm e.g. 178":"inches e.g. 70"}
                    style={{...S.input,flex:1,margin:0}}/>
                  <div style={{fontSize:14,fontWeight:600,minWidth:80,textAlign:"right" as const,color:"var(--color-accent)"}}>
                    {(()=>{
                      const n=parseFloat(convHInput);
                      if(isNaN(n)||n<=0) return "—";
                      if(convHDir==="cmToIn") return cmToFtIn(n);
                      return `${inchesToCm(n)} cm`;
                    })()}
                  </div>
                </div>
              </div>
              {/* Weight converter */}
              <div>
                <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Weight</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  {([["kgToLbs","kg → lbs"],["lbsToKg","lbs → kg"]] as const).map(([d,lbl])=>(
                    <button key={d} style={S.pill(convWDir===d,"var(--color-accent)")} onClick={()=>{setConvWDir(d);setConvWInput("");}}>{lbl}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="text" inputMode="decimal" value={convWInput} onChange={e=>setConvWInput(e.target.value)}
                    placeholder={convWDir==="kgToLbs"?"kg e.g. 80":"lbs e.g. 175"}
                    style={{...S.input,flex:1,margin:0}}/>
                  <div style={{fontSize:14,fontWeight:600,minWidth:80,textAlign:"right" as const,color:"var(--color-accent)"}}>
                    {(()=>{
                      const n=parseFloat(convWInput);
                      if(isNaN(n)||n<=0) return "—";
                      if(convWDir==="kgToLbs") return `${Math.round(n*2.20462*10)/10} lbs`;
                      return `${Math.round(n/2.20462*10)/10} kg`;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* ── App settings ── */}
            <div style={S.secTitle}>App settings</div>
            <div style={S.card}>
              <div style={S.label}>Theme</div>
              <select value={theme} onChange={e=>{setTheme(e.target.value);saveProfileToAPI({theme:e.target.value});}} style={{...S.input,marginBottom:16}}>
                {Object.entries(THEMES).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.name}</option>)}
              </select>
              <div style={S.label}>Export my data</div>
              <div style={{display:"flex",gap:8,marginTop:6}}>
                <button style={S.btn} onClick={()=>exportCSV(userSessions, pb.authStore.record?.email ?? "user")}>Export CSV</button>
                <button style={S.btn} onClick={()=>exportMD(userSessions, pb.authStore.record?.email ?? "user")}>Export Markdown</button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

// ─── ADD EXERCISE INLINE ──────────────────────────────────────────────────
function AddExerciseInline({onAdd, allExercises, onCreateCustom}) {
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const [creating,setCreating]=useState(false);
  const [form,setForm]=useState({muscle:"Chest",eq:"Barbell",type:"Isolation"});
  const res=(allExercises||DB).filter(e=>e.name.toLowerCase().includes(q.toLowerCase())).slice(0,8);
  const ALL_MUSCLES_INLINE = ["Chest","Back","Shoulders","Traps","Biceps","Triceps","Forearms","Abs","Core","Quads","Hamstrings","Glutes","Adductors","Abductors","Calves","Neck"];
  const ALL_EQ_INLINE = ["Barbell","EZ Bar","Smith Machine","Dumbbell","Cable","Machine","Bodyweight","Kettlebell","Rings","Bands","Swiss Ball","Trap Bar","Landmine","Medicine Ball","TRX","No Equipment"];
  return (
    <div style={{marginTop:8}}>
      {!open
        ? <button style={{padding:"6px 14px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-primary)",cursor:"pointer",fontSize:13}} onClick={()=>setOpen(true)}>+ Add exercise</button>
        : <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"0.75rem"}}>
            {!creating ? (<>
              <input autoFocus value={q} onChange={e=>{setQ(e.target.value);setCreating(false);}} placeholder="Search exercise..." style={{width:"100%",boxSizing:"border-box",padding:"6px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:13,marginBottom:6}}/>
              {res.map(e=>(
                <div key={e.id} style={{padding:"5px 8px",fontSize:13,cursor:"pointer",borderRadius:4,display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>{onAdd(e.name);setQ("");setOpen(false);}}>
                  <span>{e.name}{e.custom&&<span style={{fontSize:10,marginLeft:6,color:"#534AB7"}}>custom</span>}</span>
                  <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{e.muscle}</span>
                </div>
              ))}
              {/* If typed text doesn't match anything, offer to create it as a custom exercise */}
              {q.trim() && res.length===0 && (
                <div style={{padding:"8px",fontSize:12,color:"var(--color-text-secondary)"}}>
                  No results for "<strong style={{color:"var(--color-text-primary)"}}>{q}</strong>"
                  <button style={{display:"block",marginTop:6,fontSize:12,padding:"4px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-accent)",background:"transparent",color:"var(--color-accent)",cursor:"pointer"}}
                    onClick={()=>setCreating(true)}>+ Create "{q}" as custom exercise</button>
                </div>
              )}
              <button style={{fontSize:12,padding:"4px 10px",marginTop:4,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}} onClick={()=>{setOpen(false);setQ("");}}>Cancel</button>
            </>) : (<>
              {/* Inline quick-create form — pre-fills name from the search query */}
              <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>Create custom exercise</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Name: <strong style={{color:"var(--color-text-primary)"}}>{q}</strong></div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>Muscle group</div>
              <select value={form.muscle} onChange={e=>setForm(f=>({...f,muscle:e.target.value}))}
                style={{width:"100%",marginBottom:6,padding:"5px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}>
                {ALL_MUSCLES_INLINE.map(m=><option key={m}>{m}</option>)}
              </select>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>Equipment</div>
              <select value={form.eq} onChange={e=>setForm(f=>({...f,eq:e.target.value}))}
                style={{width:"100%",marginBottom:6,padding:"5px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}>
                {ALL_EQ_INLINE.map(e=><option key={e}>{e}</option>)}
              </select>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>Type</div>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                style={{width:"100%",marginBottom:8,padding:"5px 8px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12}}>
                {["Compound","Isolation","Isometric","Plyometric"].map(t=><option key={t}>{t}</option>)}
              </select>
              <div style={{display:"flex",gap:6}}>
                <button style={{flex:1,padding:"5px",borderRadius:"var(--border-radius-md)",border:"none",background:"var(--color-accent)",color:"#000",cursor:"pointer",fontSize:12,fontWeight:500}}
                  onClick={()=>{
                    if (!q.trim()) return;
                    const newEx = {id:`custom-${Date.now()}`,name:q.trim(),...form,custom:true};
                    onCreateCustom(newEx);  // saves to customExercises state
                    onAdd(newEx.name);      // adds to the active session
                    setQ(""); setOpen(false); setCreating(false);
                  }}>Save & add to session</button>
                <button style={{padding:"5px 10px",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer",fontSize:12}}
                  onClick={()=>setCreating(false)}>Back</button>
              </div>
            </>)}
          </div>
      }
    </div>
  );
}

// ─── MINI PROGRESS BAR ────────────────────────────────────────────────────
function ProgressBar({sessions,exName}) {
  const pts:any[]=[];
  [...sessions].sort((a,b)=>a.date>b.date?1:-1).forEach(s=>{
    const ex=(s.exercises||[]).find((e:any)=>e.name===exName);
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
