/// <reference path="../pb_data/types.d.ts" />

// Add extended profile fields that were missing from the initial schema.
// These store weight history, body measurement history, birth date,
// and preferred display units — all previously ignored by PocketBase.
migrate((app) => {
  const col = app.findCollectionByNameOrId("profiles");

  col.fields.add(new Field({ type: "text",   name: "birthDate" }));       // YYYY-MM-DD
  col.fields.add(new Field({ type: "text",   name: "weightUnit" }));      // "lbs" | "kg"
  col.fields.add(new Field({ type: "text",   name: "measureUnit" }));     // "metric" | "imperial"
  col.fields.add(new Field({ type: "json",   name: "weights" }));         // [{date, value}, ...]
  col.fields.add(new Field({ type: "json",   name: "bodyMeasurements" }));// [{date, waist, hips, ...}, ...]

  app.save(col);

}, (app) => {
  const col = app.findCollectionByNameOrId("profiles");
  for (const name of ["birthDate","weightUnit","measureUnit","weights","bodyMeasurements"]) {
    const f = col.fields.getByName(name);
    if (f) col.fields.remove(f);
  }
  app.save(col);
});
