import assert from "node:assert/strict";
import test from "node:test";

import { getBackFallback, shouldUseBrowserHistory } from "../src/lib/public-navigation.js";

test("uses the sport hub fallback routes", () => {
  assert.equal(getBackFallback("/calendar"), "/");
  assert.equal(getBackFallback("/passport"), "/");
  assert.equal(getBackFallback("/rewards"), "/");
  assert.equal(getBackFallback("/chat"), "/");
});

test("returns the event and check-in parent routes", () => {
  assert.equal(getBackFallback("/events/nan-open"), "/calendar");
  assert.equal(getBackFallback("/checkin/nan-open"), "/events/nan-open");
});

test("keeps the sport home free of a fallback and returns home for other paths", () => {
  assert.equal(getBackFallback("/"), null);
  assert.equal(getBackFallback("/map"), "/");
  assert.equal(getBackFallback("/posts/travel/42"), "/");
});

test("only uses browser history after an in-app public navigation", () => {
  assert.equal(shouldUseBrowserHistory(2, false), false);
  assert.equal(shouldUseBrowserHistory(1, true), false);
  assert.equal(shouldUseBrowserHistory(2, true), true);
});
