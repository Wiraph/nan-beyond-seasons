import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("keeps demo roles only in the open app session", () => {
  const storeSource = readFileSync("src/lib/RoleStore.tsx", "utf8");
  assert.match(storeSource, /useState<DemoRole \| null>\(null\)/);
  assert.doesNotMatch(storeSource, /localStorage|sessionStorage/);
});

test("lays account controls out on a single navbar row", () => {
  const menuSource = readFileSync("src/components/RoleAccountMenu.tsx", "utf8");
  assert.match(menuSource, /role-account-menu[^`]*flex[^`]*items-center/);
  assert.doesNotMatch(menuSource, /flex border-t border-current\/15/);
});

test("confirms icon-only logout before ending the demo session", () => {
  const logoutSource = readFileSync("src/components/LogoutButton.tsx", "utf8");
  assert.match(logoutSource, /useState\(false\)/);
  assert.match(logoutSource, /ti-logout/);
  assert.match(logoutSource, /role="dialog"/);
  assert.match(logoutSource, /setShowLogoutConfirm\(true\)/);
  assert.match(logoutSource, /createPortal/);
});

test("keeps language and logout adjacent and localizes the brand", () => {
  const headerActions = readFileSync("src/components/GameOnHeaderActions.tsx", "utf8");
  const brandSource = readFileSync("src/components/BrandWordmark.tsx", "utf8");
  assert.match(headerActions, /LangSwitcher[\s\S]*LogoutButton/);
  assert.match(brandSource, /Ruedu[\s\S]*Muan Nan/);
  assert.match(brandSource, /Joyful Every Season in Nan/);
});
