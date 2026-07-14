import assert from "node:assert/strict";
import test from "node:test";

import { getBackFallback, shouldUseBrowserHistory } from "../src/lib/public-navigation.js";

test("uses the sport hub fallback routes", () => {
  assert.equal(getBackFallback("/calendar"), "/");
  assert.equal(getBackFallback("/passport"), "/");
  assert.equal(getBackFallback("/rewards"), "/");
  assert.equal(getBackFallback("/chat"), "/");
});

test("returns the event and post parent routes", () => {
  assert.equal(getBackFallback("/events/nan-open"), "/calendar");
  assert.equal(getBackFallback("/checkin/nan-open"), "/events/nan-open");
  assert.equal(getBackFallback("/posts/travel/42"), "/posts/travel");
});

test("returns explore for visitor utility, listing, and detail pages", () => {
  assert.equal(getBackFallback("/map"), "/explore");
  assert.equal(getBackFallback("/plan"), "/explore");
  assert.equal(getBackFallback("/wellness"), "/explore");
  assert.equal(getBackFallback("/search"), "/explore");
  assert.equal(getBackFallback("/category/nature"), "/explore");
  assert.equal(getBackFallback("/place/nan-museum"), "/explore");
  assert.equal(getBackFallback("/biz/coffee"), "/explore");
  assert.equal(getBackFallback("/posts/travel"), "/explore");
});

test("keeps hub pages free of a fallback and returns root for QR landing pages", () => {
  assert.equal(getBackFallback("/"), null);
  assert.equal(getBackFallback("/explore"), null);
  assert.equal(getBackFallback("/s/example-qr"), "/");
});

test("only uses browser history after an in-app public navigation", () => {
  assert.equal(shouldUseBrowserHistory(2, false), false);
  assert.equal(shouldUseBrowserHistory(1, true), false);
  assert.equal(shouldUseBrowserHistory(2, true), true);
});
