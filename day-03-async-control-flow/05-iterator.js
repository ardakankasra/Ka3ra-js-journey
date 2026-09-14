"use strict";
// Day 03 — Iterator (Symbol.iterator + for...of)
// How to: predict each output first (where // ? is), then run with node.

// 1 — arrays are iterable: for...of gives values
const arr = ["a", "b"];
for (const x of arr) console.log("1:", x); // ? order?
console.log("1:", [...arr]); // ?

// 2 — plain objects are NOT iterable
const obj = { a: 1 };
try { for (const x of obj) console.log(x); } catch (e) { console.log("2: throw", e.constructor.name); } // ?
console.log("2:", Object.keys(obj)); // ? use this instead

// 3 — custom iterable via generator: lazy sequence
const range = {
  *[Symbol.iterator]() { yield 1; yield 2; yield 3; }
};
for (const n of range) console.log("3:", n); // ?
console.log("3:", [...range]); // ?
const [first, ...rest] = range;
console.log("3:", first, rest); // ?

// 4 — manual iterator: next() returns { value, done }
const seq = {
  [Symbol.iterator]() {
    let i = 0;
    return { next: () => (++i <= 2 ? { value: i * 10, done: false } : { value: undefined, done: true }) };
  }
};
console.log("4:", [...seq]); // ?
