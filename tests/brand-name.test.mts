import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const visibleBrandFiles = [
  "src/app/(sport)/page.tsx",
  "src/app/(sport)/calendar/page.tsx",
  "src/app/login/page.tsx",
  "src/components/ManagementShell.tsx",
  "src/components/PublicFooter.tsx",
  "src/app/layout.tsx",
];

test("uses เล่นไร้ฤดู for visible brand labels", () => {
  for (const file of visibleBrandFiles) {
    assert.match(readFileSync(file, "utf8"), /เล่น[\s\S]*ไร้ฤดู/);
  }
});
