"use strict";
// Day 03 — Array by-copy methods
// How to: predict each output first (where // ? is), then run with node.

// 1 — sort mutates, toSorted returns new
const a = [30, 10, 20];
const r1 = a.toSorted();
console.log("1:", a); // ?
console.log("1:", r1); // ?
console.log("1:", r1 === a); // ?
a.sort();
console.log("1:", a); // ?

// 2 — with replaces by index without mutation
const b = ["a", "b", "c"];
const r2 = b.with(1, "B");
console.log("2:", b); // ?
console.log("2:", r2); // ?
try { b.with(9, "x"); } catch (e) { console.log("2: throw", e.constructor.name); } // ?

// 3 — toReversed / toSpliced + shallow trap
const c = [3, 1, 2];
console.log("3:", c.toReversed()); // ?
console.log("3:", c); // ?
console.log("3:", c.toSpliced(1, 1, 99)); // ?
console.log("3:", c); // ?
const rows = [{ n: 1 }, { n: 2 }];
const r3 = rows.toSorted((x, y) => x.n - y.n);
r3[0].n = 99;
console.log("3:", rows[0].n); // ?
