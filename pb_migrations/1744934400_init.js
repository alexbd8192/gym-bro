/// <reference path="../pb_data/types.d.ts" />

// Initial schema — creates all Gym Bro collections
migrate((app) => {

  // ── profiles ──────────────────────────────────────────────────────────────
  // One record per user. Stores preferences, measurements, and settings.
  const profiles = new Collection({
    name: "profiles",
    type: "base",
    fields: [
      { type: "text",   name: "userId",         required: true },
      { type: "text",   name: "unit" },           // "metric" | "imperial"
      { type: "number", name: "height" },          // cm
      { type: "number", name: "weight" },          // kg
      { type: "text",   name: "dob" },             // YYYY-MM-DD
      { type: "number", name: "waist" },
      { type: "number", name: "hips" },
      { type: "number", name: "chest" },
      { type: "number", name: "arm" },
      { type: "number", name: "bodyFat" },
      { type: "json",   name: "plateInventory" },  // { "45": 4, "25": 2, ... }
      { type: "json",   name: "customExercises" }, // [{name,muscle,eq,type}, ...]
      { type: "text",   name: "theme" },           // "matrix" | "light" | ...
      { type: "text",   name: "activeProgramId" }, // PocketBase record ID
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_profiles_userId ON profiles (userId)",
    ],
  });
  app.save(profiles);

  // ── programs ──────────────────────────────────────────────────────────────
  // Training blocks (e.g. PPL, 5/3/1). Each belongs to one user.
  const programs = new Collection({
    name: "programs",
    type: "base",
    fields: [
      { type: "text", name: "userId",         required: true },
      { type: "text", name: "name",           required: true },
      { type: "json", name: "cycleWeeks" },        // [{type:"active",sessions:3},...]
      { type: "text", name: "cycleStartDate" },    // YYYY-MM-DD (Monday)
    ],
    indexes: [
      "CREATE INDEX idx_programs_userId ON programs (userId)",
    ],
  });
  app.save(programs);

  // ── routines ──────────────────────────────────────────────────────────────
  // Named workout templates. Optionally linked to a program.
  const routines = new Collection({
    name: "routines",
    type: "base",
    fields: [
      { type: "text",   name: "userId",    required: true },
      { type: "text",   name: "name",      required: true },
      { type: "json",   name: "exercises" }, // [{name,sets,reps,weight,note?}, ...]
      { type: "text",   name: "programId" }, // programs record ID (or empty)
      { type: "bool",   name: "archived" },
    ],
    indexes: [
      "CREATE INDEX idx_routines_userId ON routines (userId)",
    ],
  });
  app.save(routines);

  // ── sessions ──────────────────────────────────────────────────────────────
  // Individual logged sessions (strength, cardio, or rest).
  const sessions = new Collection({
    name: "sessions",
    type: "base",
    fields: [
      { type: "text",   name: "userId",       required: true },
      { type: "text",   name: "date",         required: true }, // YYYY-MM-DD
      { type: "text",   name: "type" },        // "strength" | "cardio" | "rest"
      { type: "text",   name: "routineName" },
      { type: "json",   name: "exercises" },   // [{name,sets:[{w,r}],note?}, ...]
      { type: "number", name: "duration" },    // seconds (strength sessions)
      { type: "text",   name: "comment" },
      // Cardio-specific
      { type: "text",   name: "activity" },    // "Run" | "Bike" | ...
      { type: "number", name: "durationMins" },
      { type: "number", name: "distance" },
      { type: "text",   name: "distanceUnit" }, // "km" | "mi"
      { type: "text",   name: "notes" },
    ],
    indexes: [
      "CREATE INDEX idx_sessions_userId ON sessions (userId)",
      "CREATE INDEX idx_sessions_date   ON sessions (date)",
    ],
  });
  app.save(sessions);

}, (app) => {
  // Rollback — drop all collections in reverse order
  for (const name of ["sessions", "routines", "programs", "profiles"]) {
    try { app.delete(app.findCollectionByNameOrId(name)); } catch(_) {}
  }
});
