// Day 05 — ESM (import/export; static imports hoist, top-level await allowed)
// No "use strict" needed: every ES module is strict by definition.
// How to: predict each output first (where // ? is), then run with node.

// 1 — static imports are HOISTED: basename already works here even though
//     its import statement sits at the very BOTTOM of this file
console.log("1:", basename("/tmp/app.js")); // ? file part of the path?
console.log("1:", import.meta.url.endsWith("02-esm.mjs")); // ? my own module URL?

// 2 — export marks the public surface; local names still behave normally
export const tag = "02-esm";
export default function greet() { return "hi from esm"; }
export let counter = 0;
export const bump = () => ++counter;
console.log("2:", tag, typeof greet); // ?

// 3 — import * as self = THIS module's own namespace (self-cycle: same
//     instance, no re-run — ESM links cycles instead of failing)
console.log("3:", self.tag === tag); // ? same live value?
console.log("3:", typeof self.default); // ? default export lands on .default

// 4 — live bindings + read-only namespace: reads see changes, writes throw
self.bump();
self.bump();
console.log("4:", self.counter, counter); // ? both 2?
try { self.counter = 99; } catch (e) { console.log("4: throw", e.constructor.name); } // ?
console.log("4:", self.counter); // ? unchanged?

// 5 — top-level await pauses the WHOLE module (CJS require can never do this)
const t0 = Date.now();
await new Promise((r) => setTimeout(r, 20));
console.log("5:", Date.now() - t0 >= 20, "ms waited"); // ? true?

// 6 — hoisting proof: these two run before every line above
import { basename } from "node:path";
import * as self from "./02-esm.mjs";
