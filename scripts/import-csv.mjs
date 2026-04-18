/**
 * One-time import of historical training data from CSV into PocketBase.
 *
 * CSV format expected:
 *   Date, Routine, Exercise, Set, Weight, Reps, Notes
 *   (one row per set — this script groups them into sessions)
 *
 * Usage:
 *   POCKETBASE_EMAIL=you@example.com POCKETBASE_PASSWORD=yourpassword node scripts/import-csv.mjs
 *
 * The script is safe to re-run — it skips dates that already have a session in PocketBase.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PocketBase from 'pocketbase';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, '..', 'historical-data-to-import');
const PB_URL   = 'http://127.0.0.1:8090';

// ── Auth ──────────────────────────────────────────────────────────────────────

const email    = process.env.POCKETBASE_EMAIL;
const password = process.env.POCKETBASE_PASSWORD;

if (!email || !password) {
  console.error('Set POCKETBASE_EMAIL and POCKETBASE_PASSWORD env vars before running.');
  process.exit(1);
}

// ── Parse CSV ─────────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  // Simple CSV parser that handles quoted fields
  function parseLine(line) {
    const fields = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQuote = !inQuote; }
      else if (c === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; }
      else { cur += c; }
    }
    fields.push(cur.trim());
    return fields;
  }

  const headers = parseLine(lines[0]).map(h => h.toLowerCase());
  return lines.slice(1).map(line => {
    const vals = parseLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  }).filter(r => r.date && r.date.match(/^\d{4}-\d{2}-\d{2}$/));
}

// ── Group rows → sessions ─────────────────────────────────────────────────────
// Each unique (date + routine) = one session.
// Within a session, rows are grouped by exercise name → array of sets.

function buildSessions(rows) {
  const map = new Map(); // key: "date|routine"

  for (const row of rows) {
    const key = `${row.date}|${row.routine}`;
    if (!map.has(key)) {
      map.set(key, { date: row.date, routineName: row.routine, exercises: new Map() });
    }
    const session = map.get(key);
    const exName  = row.exercise || 'Unknown';

    if (!session.exercises.has(exName)) {
      session.exercises.set(exName, { name: exName, sets: [], note: '' });
    }
    const ex = session.exercises.get(exName);

    // Use first non-empty note as the exercise note
    if (!ex.note && row.notes) ex.note = row.notes;

    ex.sets.push({
      w: row.weight || '',
      r: row.reps   || '',
    });
  }

  // Convert exercises Map → array
  return [...map.values()].map(s => ({
    date:        s.date,
    routineName: s.routineName,
    exercises:   [...s.exercises.values()],
  }));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const pb = new PocketBase(PB_URL);

  console.log('Authenticating…');
  await pb.collection('users').authWithPassword(email, password);
  const userId = pb.authStore.record.id;
  console.log(`Logged in. userId = ${userId}`);

  // Fetch existing session dates so we don't duplicate
  console.log('Fetching existing sessions…');
  const existing = await pb.collection('sessions').getFullList({
    filter: pb.filter('userId = {:userId}', { userId }),
    fields: 'date,routineName',
  });
  const existingKeys = new Set(existing.map(s => `${s.date}|${s.routineName}`));
  console.log(`Found ${existing.length} existing sessions.`);

  // Parse CSV
  const text     = fs.readFileSync(CSV_PATH, 'utf8');
  const rows     = parseCSV(text);
  const sessions = buildSessions(rows);
  console.log(`CSV contains ${sessions.length} sessions across ${rows.length} set rows.`);

  // Import
  let created = 0, skipped = 0;

  for (const s of sessions) {
    const key = `${s.date}|${s.routineName}`;
    if (existingKeys.has(key)) {
      console.log(`  SKIP  ${s.date}  ${s.routineName}`);
      skipped++;
      continue;
    }
    await pb.collection('sessions').create({
      userId,
      date:        s.date,
      type:        'strength',
      routineName: s.routineName,
      exercises:   s.exercises,
    });
    console.log(`  OK    ${s.date}  ${s.routineName}  (${s.exercises.length} exercises)`);
    created++;
  }

  console.log(`\nDone — ${created} imported, ${skipped} skipped.`);
}

main().catch(err => { console.error(err); process.exit(1); });
