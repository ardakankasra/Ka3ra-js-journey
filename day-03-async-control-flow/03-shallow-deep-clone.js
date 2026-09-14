"use strict";
// Day 03 — Shallow vs Deep Clone
// How to: predict each output first (where // ? is), then run with node.

// 1 — spread is shallow: nested stays shared
const order = { id: 1, customer: { name: "ali" } };
const copy = { ...order };
copy.customer.name = "hacked";
console.log("1:", order.customer.name); // ?
console.log("1:", copy.customer === order.customer); // ?
copy.id = 99;
console.log("1:", order.id); // ?

// 2 — structuredClone is deep: nested is separate
const base = { id: 1, customer: { name: "ali" } };
const deep = structuredClone(base);
deep.customer.name = "hacked";
console.log("2:", base.customer.name); // ?
console.log("2:", deep.customer === base.customer); // ?

// 3 — JSON deep works but lossy: Date turns into string
const evt = { at: new Date("2026-01-01T00:00:00.000Z"), tag: undefined };
const viaJson = JSON.parse(JSON.stringify(evt));
console.log("3:", typeof viaJson.at); // ?
console.log("3:", viaJson.at); // ?
console.log("3:", "tag" in viaJson); // ?
