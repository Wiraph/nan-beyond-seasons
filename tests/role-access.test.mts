import assert from "node:assert/strict";
import test from "node:test";

import {
  ROLE_DISPLAY,
  ROLE_HOME,
  getRoleRouteRedirect,
  isDemoRole,
  isRoleRouteAllowed,
  parseStoredDemoRole,
} from "../src/lib/role-access.js";

test("recognizes only the three demo roles and exposes their homes", () => {
  assert.equal(isDemoRole("user"), true);
  assert.equal(isDemoRole("organizer"), true);
  assert.equal(isDemoRole("admin"), true);
  assert.equal(isDemoRole("visitor"), false);
  assert.equal(isDemoRole(null), false);

  assert.deepEqual(ROLE_HOME, {
    user: "/",
    organizer: "/organizer",
    admin: "/admin",
  });
});

test("provides display data for each permitted demo role", () => {
  assert.deepEqual(Object.keys(ROLE_DISPLAY).sort(), ["admin", "organizer", "user"]);
  assert.equal(ROLE_DISPLAY.user.label, "User");
  assert.equal(ROLE_DISPLAY.organizer.label, "Organizer");
  assert.equal(ROLE_DISPLAY.admin.label, "Admin");
});

test("allows users to access only retained Nan Game On routes", () => {
  assert.equal(isRoleRouteAllowed("user", "/"), true);
  assert.equal(isRoleRouteAllowed("user", "/calendar"), true);
  assert.equal(isRoleRouteAllowed("user", "/events/nan-open"), true);
  assert.equal(isRoleRouteAllowed("user", "/checkin/nan-open"), true);
  assert.equal(isRoleRouteAllowed("user", "/organizer"), false);
  assert.equal(isRoleRouteAllowed("user", "/admin"), false);
});

test("allows management roles to access only their own workspaces", () => {
  assert.equal(isRoleRouteAllowed("organizer", "/organizer"), true);
  assert.equal(isRoleRouteAllowed("organizer", "/organizer/events/new"), true);
  assert.equal(isRoleRouteAllowed("organizer", "/admin"), false);
  assert.equal(isRoleRouteAllowed("organizer", "/calendar"), false);

  assert.equal(isRoleRouteAllowed("admin", "/admin"), true);
  assert.equal(isRoleRouteAllowed("admin", "/admin/users"), true);
  assert.equal(isRoleRouteAllowed("admin", "/organizer"), false);
  assert.equal(isRoleRouteAllowed("admin", "/"), false);
});

test("redirects anonymous visitors to login and wrong roles to their own home", () => {
  assert.equal(getRoleRouteRedirect(null, "/calendar"), "/login");
  assert.equal(getRoleRouteRedirect("user", "/admin"), "/");
  assert.equal(getRoleRouteRedirect("organizer", "/calendar"), "/organizer");
  assert.equal(getRoleRouteRedirect("admin", "/organizer/events"), "/admin");
  assert.equal(getRoleRouteRedirect("admin", "/admin/events"), null);
});

test("treats malformed or unsupported stored roles as anonymous", () => {
  assert.equal(parseStoredDemoRole(null), null);
  assert.equal(parseStoredDemoRole("not-json"), null);
  assert.equal(parseStoredDemoRole(JSON.stringify("visitor")), null);
  assert.equal(parseStoredDemoRole(JSON.stringify("organizer")), "organizer");
});
