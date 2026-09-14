"use strict";
// Day 03 — Generator (pause/resume with yield)
// How to: predict each output first (where // ? is), then run with node.

// 1 — pause/resume: each next() runs until the next yield
function* two() { yield 10; yield 20; }
const g1 = two();
console.log("1:", g1.next()); // ?
console.log("1:", g1.next()); // ?
console.log("1:", g1.next()); // ?

// 2 — two-way: next(x) becomes the paused yield's value (first next arg ignored)
function* echo() {
  const a = yield 1;
  const b = yield a;
  return b;
}
const g2 = echo();
console.log("2:", g2.next()); // ?
console.log("2:", g2.next("x")); // ?
console.log("2:", g2.next("y")); // ?

// 3 — lazy: infinite sequence, take only what you need
function* ids() { let i = 0; while (true) yield ++i; }
const taken = [];
for (const n of ids()) { taken.push(n); if (taken.length === 3) break; }
console.log("3:", taken); // ?

// 4 — yield* delegates; exhausted generators stay done
function* a() { yield 1; }
function* b() { yield* a(); yield 2; }
console.log("4:", [...b()]); // ?
const g4 = two();
console.log("4:", [...g4]); // ?
console.log("4:", [...g4]); // ? reused after done
