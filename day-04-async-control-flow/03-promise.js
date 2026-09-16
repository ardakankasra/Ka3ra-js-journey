"use strict";
// Day 04 — Promise (pending → fulfilled/rejected; then/catch chains)
// How to: predict each output first (where // ? is), then run with node.

// 1 — the executor runs synchronously; then callbacks are async microtasks
console.log("1: executor start"); // ?
const p1 = new Promise((resolve) => {
  console.log("1: inside executor"); // ?
  resolve("1: resolved value");
});
console.log("1: after new Promise"); // ?
p1.then((v) => console.log(v)); // ?

// 2 — chaining: each then returns a new promise; values transform down the line
Promise.resolve(2)
  .then((n) => n * 10) // (no log — passes 20 on)
  .then((n) => console.log("2:", n)); // ?

// 3 — returning a promise unwraps it (flattening, no nesting)
Promise.resolve()
  .then(() => Promise.resolve("3: inner")) // (no log — unwrapped)
  .then((v) => console.log(v)); // ?

// 4 — rejection skips thens until the first catch; catch recovers the chain
Promise.reject(new Error("boom"))
  .then(() => console.log("4: skipped")) // ?
  .catch((e) => console.log("4: caught:", e.message)) // ?
  .then(() => console.log("4: recovered")); // ?

// 5 — a throw inside then rejects the rest of the chain the same way
Promise.resolve()
  .then(() => { throw new Error("5: bad"); }) // ?
  .then(() => console.log("5: skipped")) // ?
  .catch((e) => console.log("5:", e.message)); // ?
