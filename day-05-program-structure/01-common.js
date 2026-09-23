"use strict";
// Day 05 — CommonJS (require / module.exports; one file = one module, loaded synchronously)
// How to: predict each output first (where // ? is), then run with node.

// 1 — module scope: top-level let/const live inside the file, never on globalThis
const secret = "file-local";
console.log("1:", typeof globalThis.secret); // ? leaked or "undefined"?
console.log("1:", secret); // ? same value inside the module?

// 2 — module.exports is the real export object; exports is an alias pointing at it
console.log("2:", exports === module.exports); // ? alias or a copy?
exports.tag = "01-common"; // mutating through the alias reaches module.exports
console.log("2:", module.exports.tag); // ? did it arrive?

// 3 — classic bug: REASSIGNING exports breaks the alias; mutation above already landed
exports = { lost: true };
console.log("3:", exports === module.exports); // ? same object still?
console.log("3:", module.exports.lost, module.exports.tag); // ? lost: true or undefined?

// 4 — require is synchronous + cached: same resolved path => same object, loaded once
const path1 = require("node:path");
const path2 = require("node:path");
console.log("4:", path1 === path2); // ?
console.log("4:", typeof path1.join); // ? usable immediately (no await)?

// 5 — module metadata: which file is this, and am I the entry point?
console.log("5:", __filename.endsWith("01-common.js"), typeof __dirname); // ?
console.log("5:", require.main === module); // ? true when run as: node 01-common.js

// 6 — self-require: cache hit — no re-run, returns the PARTIAL module filled so far
const again = require("./01-common.js");
console.log("6:", again === module.exports); // ? same object?
console.log("6:", again.tag); // ? exports written so far?
