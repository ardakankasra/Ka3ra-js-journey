"use strict";
// Day 04 — Error hierarchy (custom extends Error classes for distinct handling)
// How to: predict each output first (where // ? is), then run with node.

// 1 — a custom class keeps instanceof, name, stack, plus your own fields
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
const e1 = new AppError("missing", 404);
console.log("1:", e1 instanceof Error, e1 instanceof AppError); // ?
console.log("1:", e1.name, e1.status, typeof e1.stack); // ?

// 2 — one subclass per failure type, so the handler can tell them apart
class NotFound extends AppError {
  constructor(what) { super(`${what} not found`, 404); this.name = "NotFound"; }
}
class ValidationError extends AppError {
  constructor(field) { super(`bad ${field}`, 400); this.name = "ValidationError"; }
}
function toStatus(e) {
  if (e instanceof ValidationError) return 400;
  if (e instanceof NotFound) return 404;
  if (e instanceof AppError) return e.status;
  return 500;
}
console.log("2:", toStatus(new ValidationError("price"))); // ?
console.log("2:", toStatus(new NotFound("order 7"))); // ?
console.log("2:", toStatus(new Error("random"))); // ?

// 3 — cause chaining: wrap low-level errors without losing the root
let wrapped;
try {
  JSON.parse("{bad json");
} catch (orig) {
  wrapped = new ValidationError("payload");
  wrapped.cause = orig;
}
console.log("3:", wrapped.cause instanceof SyntaxError); // ?
console.log("3:", toStatus(wrapped)); // ?

// 4 — throwing raw strings/objects loses everything: no stack, no instanceof
try {
  throw "string boom";
} catch (e) {
  console.log("4:", e instanceof Error, typeof e); // ?
}

// 5 — the class survives the async boundary: an Express-style mapper reads it
async function showOrder(id) {
  await Promise.resolve();
  if (id < 0) throw new ValidationError("id");
  throw new NotFound(`order ${id}`);
}
async function handle(id) {
  try {
    await showOrder(id);
  } catch (e) {
    console.log(`5: id=${id} ->`, toStatus(e), e.message); // ?
  }
}
handle(7);
handle(-1);
