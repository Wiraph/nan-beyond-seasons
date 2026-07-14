import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("describes the credential-free demo role picker in AI guidance", () => {
  const routeSource = readFileSync("src/app/api/chat/route.ts", "utf8");

  assert.match(
    routeSource,
    /Select one of the three demo roles on \/login; no name or password is required\./,
  );
  assert.doesNotMatch(routeSource, /No login needed/);
});
