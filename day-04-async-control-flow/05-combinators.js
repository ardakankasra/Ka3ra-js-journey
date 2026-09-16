"use strict";
// Day 04 — Promise combinators (all / allSettled / race / any)
// How to: predict each output first (where // ? is), then run with node.

const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const fail = (ms, msg) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

// 1 — all: results in INPUT order, resolves when the slowest finishes
Promise.all([wait(50, "slow"), wait(10, "fast")])
  .then((r) => console.log("1:", r)); // ? (finish order or input order?)

// 2 — all is fail-fast: first rejection wins, later results are ignored
Promise.all([wait(50, "ignored"), fail(10, "2: fail-fast")])
  .then(() => console.log("2: skipped")) // ?
  .catch((e) => console.log("2:", e.message)); // ?

// 3 — allSettled: waits for EVERYTHING, reports each outcome
Promise.allSettled([wait(10, "a"), fail(20, "b")])
  .then((r) => console.log("3:", JSON.stringify(r))); // ?

// 4 — race: first to SETTLE wins, fulfill or reject
Promise.race([wait(30, "4: slow"), wait(10, "4: fast")])
  .then((v) => console.log(v)); // ?
Promise.race([wait(30, "4: too slow"), fail(10, "4: rejected first")])
  .then(() => console.log("4: skipped")) // ?
  .catch((e) => console.log("4:", e.message)); // ?

// 5 — any: first FULFILLMENT wins; rejects only if ALL reject (AggregateError)
Promise.any([fail(10, "bad-1"), wait(30, "5: winner")])
  .then((v) => console.log(v)); // ?
Promise.any([fail(10, "bad-1"), fail(20, "bad-2")])
  .then(() => console.log("5: skipped")) // ?
  .catch((e) => console.log("5:", e instanceof AggregateError, e.errors.length)); // ?
