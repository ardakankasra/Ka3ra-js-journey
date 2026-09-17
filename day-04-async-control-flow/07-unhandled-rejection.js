"use strict";
// Day 04 — Unhandled rejection (a rejected promise with no .catch / no await+try)
// How to: predict each output first (where // ? is), then run with node.
// NOTE: the listener at the top is a safety net — without it, section 2's
// floating rejection would CRASH the process on Node 15+ (exit code 1).

let events = 0;
process.on("unhandledRejection", (reason) => {
  events++;
  console.log("[unhandledRejection]", reason.message);
});
process.on("rejectionHandled", () => console.log("[rejectionHandled] late catch attached"));

// 1 — handled chain: catch at the end covers the whole chain, no event
Promise.reject(new Error("1: handled")).catch((e) => console.log("1:", e.message)); // ?

// // 2 — floating promise: no catch anywhere -> the event fires
Promise.reject(new Error("2: floating")); // ?
console.log("2: sync continues"); // ?

// 3 — attaching catch too LATE: the event fires first, then rejectionHandled
const late = Promise.reject(new Error("3: late"));
setTimeout(() => late.catch((e) => console.log("3:", e.message)), 20); // ?

// 4 — Promise.all losers are NOT unhandled: all() internally handles them
Promise.all([
  new Promise((r) => setTimeout(r, 10)),
  Promise.reject(new Error("4: fail-fast winner")),
]).catch((e) => console.log("4:", e.message)); // ? — and no [unhandledRejection] for it

// 5 — Express-style: async handler that throws with no try/catch = hung request
//     + process-level crash risk. The wrapper is the fix:
const asyncWrapper = (fn) => (req) =>
  Promise.resolve(fn(req)).catch((e) => console.log("5: mapped to error middleware:", e.message));

const badHandler = async (req) => {
  if (req.id < 0) throw new Error("5: bad id");
  return "5: ok";
};
badHandler({ id: -1 }); // ? — unhandled (the bug)
asyncWrapper(badHandler)({ id: -1 }); // ? — handled (the fix)

setTimeout(() => console.log("total unhandled events:", events), 30); // ?
