import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const outputDir = ".test-dist";
const tsc = fileURLToPath(new URL("../node_modules/typescript/bin/tsc", import.meta.url));

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}

try {
  rmSync(outputDir, { recursive: true, force: true });
  run(process.execPath, [
    tsc,
    "--module",
    "node16",
    "--moduleResolution",
    "node16",
    "--target",
    "es2022",
    "--outDir",
    outputDir,
    "--noEmit",
    "false",
    "--skipLibCheck",
    "tests/public-navigation.test.mts",
    "tests/role-access.test.mts",
    "tests/management-workspaces.test.mts",
    "tests/chat-guide.test.mts",
    "tests/role-session.test.mts",
    "src/lib/public-navigation.ts",
    "src/lib/management-events.ts",
  ]);

  if (!process.exitCode) {
    run(process.execPath, [
      "--test",
      `${outputDir}/tests/public-navigation.test.mjs`,
      `${outputDir}/tests/role-access.test.mjs`,
      `${outputDir}/tests/management-workspaces.test.mjs`,
      `${outputDir}/tests/chat-guide.test.mjs`,
      `${outputDir}/tests/role-session.test.mjs`,
    ]);
  }
} finally {
  rmSync(outputDir, { recursive: true, force: true });
}
