import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("shows the Ruedu Muan Nan name in the visible app copy", () => {
  const chatSource = readFileSync("src/app/(sport)/chat/page.tsx", "utf8");
  assert.match(chatSource, /ฤดูม่วนน่าน/);
  assert.match(chatSource, /ม่วนได้ทุกฤดู ที่น่าน/);
});
