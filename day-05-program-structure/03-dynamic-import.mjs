// Day 05 — Dynamic import() (runtime loading: returns a Promise, works in CJS + ESM)
// How to: predict each output first (where // ? is), then run with node.

// 1 — import() is an expression returning a Promise<module namespace>
const pathPromise = import("node:path");
console.log("1:", pathPromise instanceof Promise); // ? promise or module?
const pathMod = await pathPromise;
console.log("1:", typeof pathMod.basename, typeof pathMod.default); // ? named + default types

// 2 — always async: even for a cached builtin, sync code finishes FIRST
console.log("2: sync before"); // ?
const fsDone = import("node:fs").then((m) => console.log("2: loaded,", typeof m.readFileSync)); // ?
console.log("2: sync end"); // ? before the "loaded" line?
await fsDone; // gate: section 2 prints contiguously before section 3 starts

// 3 — load-once: dynamic import shares the cache with static import —
//     same module instance, same namespace object
console.log("3:", pathMod.basename === basename); // ? same function?
console.log("3:", (await import("node:path")) === pathMod); // ? same namespace?

// 4 — failure = rejected promise caught by await/try — NOT a sync throw like require
try {
  await import("./no-such-module.mjs");
} catch (e) {
  console.log("4: caught", e.code); // ? error code?
}

// 5 — conditional load: nothing executes until the branch is actually taken
let loaded = null;
if (false) loaded = await import("node:os"); // branch never runs
console.log("5:", loaded); // ? null — import() never executed?
const lazy = true ? await import("node:os") : null;
console.log("5:", typeof lazy.hostname); // ? taken branch loaded it?

// 6 — proof: the static import below ran before line 1 (hoisting)
import { basename } from "node:path";
