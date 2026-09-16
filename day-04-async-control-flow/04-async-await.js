"use strict";
// Day 04 — async/await (promise sugar with sync-looking syntax; same rules underneath)
// How to: predict each output first (where // ? is), then run with node.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 1 — an async function ALWAYS returns a promise, even for a plain value
async function f() { return 1; }
console.log("1:", f() instanceof Promise); // ?
f().then((v) => console.log("1:", v)); // ?

// 2 — await pauses ONLY its own function; the rest of the script keeps running
async function g() {
  const v = await Promise.resolve("2: unwrapped");
  console.log(v); // ?
  return "2: done";
}
g().then((v) => console.log(v)); // ?
console.log("2: sync"); // ?

// 3 — sequential awaits are SERIAL (times add up); Promise.all is PARALLEL (max wins)
async function serial() {
  const t = Date.now();
  await wait(50); await wait(50);
  return Date.now() - t;
}
async function parallel() {
  const t = Date.now();
  await Promise.all([wait(50), wait(50)]);
  return Date.now() - t;
}
serial().then((ms) => console.log("3: serial ms ~", ms)); // ? (>= 100?)
parallel().then((ms) => console.log("3: parallel ms ~", ms)); // ? (< serial?)

// // 4 — rejection inside await throws at that line: catch it or the async fn rejects
// async function safe() {
//   try {
//     await Promise.reject(new Error("db down"));
//   } catch (e) {
//     return "4: caught: " + e.message;
//   }
// }
// safe().then((v) => console.log(v)); // ?
// async function unsafe() {
//   await Promise.reject(new Error("4: unsafe"));
// }
// unsafe().catch((e) => console.log(e.message)); // ? (what if this .catch were missing?)

// // 5 — forgetting await hands you a promise, not the value (classic res.json bug)
// async function getUser() { return { name: "ali" }; }
// const maybeUser = getUser();
// console.log("5:", maybeUser instanceof Promise ? "promise — forgot await" : maybeUser); // ?
// getUser().then((u) => console.log("5:", u)); // ?
