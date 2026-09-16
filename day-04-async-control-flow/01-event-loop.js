"use strict";
// Day 04 — Event loop (stack → microtasks → macrotask)
// How to: predict each output first (where // ? is), then run with node.

const fs = require("fs");

// 1 — order: sync first, microtask (promise) next, macrotask (timeout) last
console.log("1: sync"); // ?
Promise.resolve().then(() => console.log("1: promise")); // ?
setTimeout(() => console.log("1: timeout"), 0); // ?
console.log("1: sync end"); // ?

// 2 — microtasks drain fully: chained thens all run before any timeout
setTimeout(() => console.log("2: timeout"), 0); // ?
Promise.resolve()
  .then(() => console.log("2: then 1")) // ?
  .then(() => console.log("2: then 2")); // ?

// 3 — Node: process.nextTick runs before promise microtasks
Promise.resolve().then(() => console.log("3: promise")); // ?
process.nextTick(() => console.log("3: nextTick")); // ?
console.log("3: sync"); // ?

// 4 — inside an I/O callback, setImmediate always beats setTimeout(0)
fs.readFile(__filename, () => {
  setTimeout(() => console.log("4: timeout-in-io"), 0); // ?
  setImmediate(() => console.log("4: immediate-in-io")); // ?
});
