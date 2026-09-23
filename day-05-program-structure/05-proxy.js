"use strict";
// Day 05 — Proxy (wraps an object, intercepts operations via handler traps)
// How to: predict each output first (where // ? is), then run with node.

// 1 — get trap observes the read, then forwards with Reflect (default behavior)
const seen = [];
const user = { name: "kasra" };
const watched = new Proxy(user, {
  get(t, p, r) { seen.push(String(p)); return Reflect.get(t, p, r); },
});
console.log("1:", watched.name); // ? "kasra"
console.log("1:", seen); // ? [ 'name' ] — the read was observed

// 2 — set trap validates: returning false in strict mode = TypeError, write blocked
const guarded = new Proxy({ age: 20 }, {
  set(t, p, v, r) {
    if (p === "age" && typeof v !== "number") return false;
    return Reflect.set(t, p, v, r);
  },
});
try { guarded.age = "old"; } catch (e) { console.log("2: throw", e.constructor.name); } // ? TypeError
guarded.age = 21;
console.log("2:", guarded.age); // ? valid write went through

// 3 — has trap (the `in` operator) decides what "exists"
const vault = { _pin: 1234, balance: 500 };
const safeView = new Proxy(vault, {
  has(t, p) { return !String(p).startsWith("_") && Reflect.has(t, p); },
});
console.log("3:", "_pin" in safeView, "balance" in safeView); // ? false true
console.log("3:", "_pin" in vault); // ? true — target unchanged

// 4 — apply trap (function call) — decorator pattern: count every call
let calls = 0;
function add(a, b) { return a + b; }
const counted = new Proxy(add, {
  apply(t, thisArg, args) { calls++; return Reflect.apply(t, thisArg, args); },
});
console.log("4:", counted(2, 3), counted(10, 1)); // ? 5, 11
console.log("4:", calls); // ? 2

// 5 — transparent by default: writes land on the TARGET, keys pass through
watched.age = 30; // no set trap on `watched` — default forwards to user
console.log("5:", watched === user); // ? proxy and target are NOT the same object
console.log("5:", user.age, Object.keys(watched)); // ? 30, [ 'name', 'age' ]

// 6 — invariant: a get trap cannot LIE about a frozen (non-writable) property
const frozen = Object.freeze({ x: 1 });
const liar = new Proxy(frozen, { get: () => 99 });
try { console.log("6:", liar.x); } catch (e) { console.log("6: throw", e.constructor.name); } // ? TypeError
