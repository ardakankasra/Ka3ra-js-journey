"use strict";
// Day 04 — Microtask vs macrotask (promise queue drains before timer queue)
// How to: predict each output first (where // ? is), then run with node.

// 1 — one of each: sync, then microtask, then macrotask
setTimeout(() => console.log("1: timeout"), 0); // ?
Promise.resolve().then(() => console.log("1: promise")); // ?
console.log("1: sync"); // ?

// 2 — nested microtasks still drain before the pending timeout
setTimeout(() => console.log("2: timeout"), 0); // ?
Promise.resolve()
  .then(() => {
    console.log("2: then 1"); // ?
    Promise.resolve().then(() => console.log("2: nested")); // ?
  })
  .then(() => console.log("2: then 2")); // ?

// 3 — queueMicrotask and promise.then share one FIFO queue
queueMicrotask(() => console.log("3: queued")); // ?
Promise.resolve().then(() => console.log("3: promise")); // ?

// 4 — a timer scheduled from a microtask waits behind the already-queued timer
setTimeout(() => console.log("4: timeout first"), 0); // ?
Promise.resolve().then(() => {
  console.log("4: promise"); // ?
  setTimeout(() => console.log("4: timeout from promise"), 0); // ?
});
