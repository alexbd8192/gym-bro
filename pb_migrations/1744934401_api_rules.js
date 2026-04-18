/// <reference path="../pb_data/types.d.ts" />

// Set API rules on all collections so authenticated users can only
// read/write records that belong to them (userId = their own auth ID).
migrate((app) => {
  const rule = 'userId = @request.auth.id';

  for (const name of ["profiles", "programs", "routines", "sessions"]) {
    const col = app.findCollectionByNameOrId(name);
    col.listRule   = rule;
    col.viewRule   = rule;
    col.createRule = rule;
    col.updateRule = rule;
    col.deleteRule = rule;
    app.save(col);
  }

}, (app) => {
  // Rollback — remove all rules (lock collections back down)
  for (const name of ["profiles", "programs", "routines", "sessions"]) {
    const col = app.findCollectionByNameOrId(name);
    col.listRule   = null;
    col.viewRule   = null;
    col.createRule = null;
    col.updateRule = null;
    col.deleteRule = null;
    app.save(col);
  }
});
