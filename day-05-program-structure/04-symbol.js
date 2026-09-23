"use strict";
// Day 05 — Symbol (primitive, always unique, collision-free property keys)
// How to: predict each output first (where // ? is), then run with node.

// 1 — a primitive, and same description still means a DIFFERENT symbol
const s1 = Symbol("id");
const s2 = Symbol("id");
console.log("1:", typeof s1, s1 === s2); // ? "symbol", true or false?
console.log("1:", String(s1)); // ? printable form?

// 2 — as an object key: invisible to keys/JSON/for-in, readable directly
const id = Symbol("id");
const row = { name: "order", code: "x" };
row[id] = 7;
console.log("2:", Object.keys(row)); // ? only string keys?
console.log("2:", JSON.stringify(row)); // ? symbol dropped?
console.log("2:", Object.getOwnPropertySymbols(row).length); // ? the hidden one?
console.log("2:", row[id]); // ? still readable?

// 3 — string key and symbol key never clobber each other
const S = Symbol("tag");
const box = { tag: "string-key", [S]: "symbol-key" };
console.log("3:", box.tag, box[S]); // ? both survive?

// 4 — Symbol() is unique; Symbol.for() hits the GLOBAL registry (shared)
console.log("4:", Symbol("app.id") === Symbol("app.id")); // ? false?
console.log("4:", Symbol.for("app.id") === Symbol.for("app.id")); // ? true?

// 5 — well-known symbol = engine hook: Symbol.toPrimitive steers coercion
const price = {
  amount: 5,
  [Symbol.toPrimitive](hint) { return hint === "string" ? "€5" : 5; },
};
console.log("5:", `${price}`, price + 1); // ? "€5" and 6?

// 6 — String(sym) is allowed; implicit conversion in + throws
try { console.log("6:", "id=" + s1); } catch (e) { console.log("6: throw", e.constructor.name); } // ?
