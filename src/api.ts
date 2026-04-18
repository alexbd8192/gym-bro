/**
 * Typed API layer — all PocketBase operations go through here.
 * gymbro.tsx calls these functions instead of touching localStorage directly.
 */
import pb from './pb';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GymProfile {
  id?: string;
  userId: string;
  unit: 'metric' | 'imperial';
  height: number;
  weight: number;
  dob: string;
  waist: number;
  hips: number;
  chest: number;
  arm: number;
  bodyFat: number;
  plateInventory: Record<string, number>;
  customExercises: any[];
  theme: string;
  activeProgramId: string;
}

export interface GymProgram {
  id?: string;
  userId: string;
  name: string;
  cycleWeeks: Array<{ type: 'active' | 'rest'; sessions: number }>;
  cycleStartDate: string;
}

export interface GymRoutine {
  id?: string;
  userId: string;
  name: string;
  exercises: any[];
  programId: string;
  archived: boolean;
}

export interface GymSession {
  id?: string;
  userId: string;
  date: string;
  type: 'strength' | 'cardio' | 'rest';
  routineName: string;
  exercises?: any[];
  duration?: number;
  comment?: string;
  activity?: string;
  durationMins?: number;
  distance?: number;
  distanceUnit?: string;
  notes?: string;
}

export interface AllUserData {
  profile: GymProfile | null;
  programs: GymProgram[];
  routines: GymRoutine[];
  sessions: GymSession[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function isLoggedIn(): boolean {
  return pb.authStore.isValid;
}

export function currentUser() {
  return pb.authStore.record;
}

export async function login(email: string, password: string) {
  return pb.collection('users').authWithPassword(email, password);
}

export function logout() {
  pb.authStore.clear();
}

// ─── Fetch all data for a user on login ───────────────────────────────────────

export async function fetchAllUserData(userId: string): Promise<AllUserData> {
  const filter = pb.filter('userId = {:userId}', { userId });

  const fetchOne = async (name: string, fn: () => Promise<any[]>) => {
    try { return await fn(); }
    catch(e: any) {
      throw new Error(`[${name}] ${e?.status ?? ''} ${e?.message ?? e}`);
    }
  };

  const [profileList, programs, routines, sessions] = await Promise.all([
    fetchOne('profiles', () => pb.collection('profiles').getFullList({ filter })),
    fetchOne('programs', () => pb.collection('programs').getFullList({ filter, sort: '-id' })),
    fetchOne('routines', () => pb.collection('routines').getFullList({ filter })),
    fetchOne('sessions', () => pb.collection('sessions').getFullList({ filter, sort: '-date,-id', requestKey: null })),
  ]);
  return {
    profile: (profileList[0] as unknown as GymProfile) ?? null,
    programs: programs as unknown as GymProgram[],
    routines: routines as unknown as GymRoutine[],
    sessions: sessions as unknown as GymSession[],
  };
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function saveProfile(data: GymProfile): Promise<GymProfile> {
  if (data.id) {
    const rec = await pb.collection('profiles').update(data.id, data);
    return rec as unknown as GymProfile;
  } else {
    const rec = await pb.collection('profiles').create(data);
    return rec as unknown as GymProfile;
  }
}

// ─── Programs ─────────────────────────────────────────────────────────────────

export async function createProgram(data: Omit<GymProgram, 'id'>): Promise<GymProgram> {
  const rec = await pb.collection('programs').create(data);
  return rec as unknown as GymProgram;
}

export async function updateProgram(id: string, data: Partial<GymProgram>): Promise<GymProgram> {
  const rec = await pb.collection('programs').update(id, data);
  return rec as unknown as GymProgram;
}

export async function deleteProgram(id: string): Promise<void> {
  await pb.collection('programs').delete(id);
}

// ─── Routines ─────────────────────────────────────────────────────────────────

export async function createRoutine(data: Omit<GymRoutine, 'id'>): Promise<GymRoutine> {
  const rec = await pb.collection('routines').create(data);
  return rec as unknown as GymRoutine;
}

export async function updateRoutine(id: string, data: Partial<GymRoutine>): Promise<GymRoutine> {
  const rec = await pb.collection('routines').update(id, data);
  return rec as unknown as GymRoutine;
}

export async function deleteRoutine(id: string): Promise<void> {
  await pb.collection('routines').delete(id);
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function createSession(data: Omit<GymSession, 'id'>): Promise<GymSession> {
  const rec = await pb.collection('sessions').create(data);
  return rec as unknown as GymSession;
}

export async function updateSession(id: string, data: Partial<GymSession>): Promise<GymSession> {
  const rec = await pb.collection('sessions').update(id, data);
  return rec as unknown as GymSession;
}

export async function deleteSession(id: string): Promise<void> {
  await pb.collection('sessions').delete(id);
}

// ─── Migration utility ────────────────────────────────────────────────────────
// One-time import of existing localStorage data into PocketBase.

export async function importFromLocalStorage(userId: string): Promise<void> {
  const raw = localStorage.getItem('gymbro_state');
  if (!raw) throw new Error('No local data found');
  const saved = JSON.parse(raw);

  // Profile
  const p = saved.profiles?.[userId] ?? {};
  await pb.collection('profiles').create({
    userId,
    unit:            p.unit            ?? 'metric',
    height:          p.height          ?? 0,
    weight:          p.weight          ?? 0,
    dob:             p.dob             ?? '',
    waist:           p.waist           ?? 0,
    hips:            p.hips            ?? 0,
    chest:           p.chest           ?? 0,
    arm:             p.arm             ?? 0,
    bodyFat:         p.bodyFat         ?? 0,
    plateInventory:  saved.plateInventory ?? {},
    customExercises: saved.customExercises ?? [],
    theme:           saved.theme       ?? 'matrix',
    activeProgramId: saved.activeProgramId ?? '',
  });

  // Programs
  const pbProgramIdMap: Record<string, string> = {};
  for (const prog of (saved.programs?.[userId] ?? [])) {
    const rec = await pb.collection('programs').create({
      userId,
      name:           prog.name,
      cycleWeeks:     prog.cycleWeeks     ?? [],
      cycleStartDate: prog.cycleStartDate ?? '',
    });
    pbProgramIdMap[prog.id] = rec.id;
  }

  // Routines
  const pbRoutineIdMap: Record<string, string> = {};
  for (const r of (saved.routines?.[userId] ?? [])) {
    const rec = await pb.collection('routines').create({
      userId,
      name:      r.name,
      exercises: r.exercises ?? [],
      programId: pbProgramIdMap[r.programId] ?? '',
      archived:  r.archived ?? false,
    });
    pbRoutineIdMap[r.id] = rec.id;
  }

  // Sessions
  for (const s of (saved.sessions?.[userId] ?? [])) {
    await pb.collection('sessions').create({
      userId,
      date:         s.date,
      type:         s.type ?? 'strength',
      routineName:  s.routineName ?? '',
      exercises:    s.exercises   ?? [],
      duration:     s.duration,
      comment:      s.comment,
      activity:     s.activity,
      durationMins: s.durationMins,
      distance:     s.distance,
      distanceUnit: s.distanceUnit,
      notes:        s.notes,
    });
  }
}
