import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("keeps demo roles only in the open app session", () => {
  const storeSource = readFileSync("src/lib/RoleStore.tsx", "utf8");
  assert.match(storeSource, /useState<DemoRole \| null>\(null\)/);
  assert.doesNotMatch(storeSource, /localStorage|sessionStorage/);
});
