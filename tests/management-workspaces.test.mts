import assert from "node:assert/strict";
import test from "node:test";

import { managementEventMetrics } from "../src/lib/management-events.js";

const sportEvents = [
  { verified: false, mode: ["compete"] as const, season: "green" as const },
  { verified: true, mode: ["spectate"] as const, season: "cool" as const },
  { verified: false, mode: ["compete", "spectate"] as const, season: "hot" as const },
];

test("summarizes existing sport events for read-only management workspaces", () => {
  const metrics = managementEventMetrics(sportEvents);

  assert.equal(metrics.total, sportEvents.length);
  assert.equal(metrics.verified + metrics.needsReview, metrics.total);
  assert.equal(metrics.compete, 2);
  assert.equal(metrics.spectate, 2);
  assert.equal(metrics.bySeason.green + metrics.bySeason.cool + metrics.bySeason.hot, metrics.total);
});

test("keeps supplied event collections independent of any persistence layer", () => {
  const metrics = managementEventMetrics([
    sportEvents[0],
    { ...sportEvents[1], season: "green" },
  ]);

  assert.deepEqual(metrics, {
    total: 2,
    verified: 1,
    needsReview: 1,
    compete: 1,
    spectate: 1,
    bySeason: { green: 2, cool: 0, hot: 0 },
  });
});
