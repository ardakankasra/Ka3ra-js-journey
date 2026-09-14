"use strict";
// Day 03 — Freeze vs Seal
// How to: predict each output first (where // ? is), then run with node.

// 1 — seal: edit ok, add/delete blocked
const s = Object.seal({ name: "ali", age: 22 });
s.age = 50;
console.log("1:", s.age); // ?
try { s.job = "dev"; } catch (e) { console.log("1: throw", e.constructor.name); } // ? throws or not?
console.log("1:", s.job); // ?
try { delete s.name; } catch (e) { console.log("1: throw", e.constructor.name); } // ?
console.log("1:", s.name); // ?
console.log("1:", Object.isSealed(s)); // ?

// 2 — freeze: even edit blocked
const f = Object.freeze({ port: 4000 });
try { f.port = 9999; } catch (e) { console.log("2: throw", e.constructor.name); } // ?
console.log("2:", f.port); // ?
try { f.host = "x"; } catch (e) { console.log("2: throw", e.constructor.name); } // ?
console.log("2:", f.host); // ?
console.log("2:", Object.isFrozen(f)); // ?
console.log("2:", JSON.stringify(Object.getOwnPropertyDescriptor(f, "port"))); // ?

// 3 — shallow trap: nested object stays open
const cfg = Object.freeze({ db: { host: "a" } });
cfg.db.host = "hacked";
console.log("3:", cfg.db.host); // ?
console.log("3:", Object.isFrozen(cfg.db)); // ?
