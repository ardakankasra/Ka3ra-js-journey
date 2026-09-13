"use strict";
// Day 03 — Property Descriptor
// How to: predict each output first (where // ? is), then run with node.

// 1 — default flags in defineProperty
const a = {};
Object.defineProperty(a, "x", { value: 1 });
try { a.x = 99; } catch (e) { console.log("1: throw", e.constructor.name); } // ? throws or not?
console.log("1:", a.x); // ?

// 2 — enumerable:false: invisible in copies but still there
const user = { name: "ali" };
Object.defineProperty(user, "passwordHash", { value: "abc", enumerable: false });
console.log("2:", Object.keys(user)); // ?
console.log("2:", { ...user }); // ?
console.log("2:", user.passwordHash); // ?

// 3 — configurable:false: no delete, no way back
const o = {};
Object.defineProperty(o, "id", { value: 5, configurable: false });
try { delete o.id; } catch (e) { console.log("3: throw", e.constructor.name); } // ?
console.log("3:", o.id); // ?

// 4 — computed getter (accessor flavor)
const order = { price: 100 };
Object.defineProperty(order, "total", {
  get() { return this.price * 1.1; },
  enumerable: true,
  configurable: true,
});
console.log("4:", order.total); // ?
order.price = 200;
console.log("4:", order.total); // ?

// 5 — freeze means all writable:false + configurable:false
const cfg = Object.freeze({ port: 4000 });
console.log("5:", JSON.stringify(Object.getOwnPropertyDescriptor(cfg, "port"))); // ?
