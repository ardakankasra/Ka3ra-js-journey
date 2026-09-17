### Day 04 — Async & Control Flow

- **Event Loop** — the scheduler that runs async callbacks only when the call stack is empty, so one slow I/O never freezes the server.

### Event Loop:

- **What it is:** single-threaded JS plus a loop: run the stack to empty → drain all microtasks → run one macrotask → repeat. Node adds phases inside the macrotask step (timers → pending I/O → poll → check/`setImmediate` → close).

  ```javascript
  console.log("sync");
  Promise.resolve().then(() => console.log("promise")); // microtask
  setTimeout(() => console.log("timeout"), 0); // macrotask
  // sync → promise → timeout
  ```

- **What problem it solves:** without it, one slow operation freezes everything. Blocking (`querySync`) holds the only thread; non-blocking (`query(sql, cb)`) registers the callback and frees the thread — the loop fires it when the I/O result arrives.

- **Where it is used:** every Express handler awaiting a DB call, every `fetch` to an external API, every retry/backoff timer — all depend on the loop staying unblocked so other requests get served while one waits.

  ```javascript
  db.query("SELECT ...", (rows) => render(rows)); // stack continues
  console.log("still responsive"); // runs first, callback fires later
  ```

- **Rules:** no callback ever interrupts running sync code. Microtasks (`process.nextTick` first in Node, then promises/`queueMicrotask`) drain fully before any macrotask. `setTimeout(fn, 0)` vs `setImmediate(fn)` from the main module is nondeterministic — inside an I/O callback `setImmediate` always wins.
- **Classic bug:** blocking the loop with sync CPU work (big `JSON.parse`, unchunked million-row loop, `crypto` sync call in a handler) stalls ALL requests, not just that one — offload to a worker, chunk with `setImmediate`, or stream.

### Microtask vs Macrotask:

- **What it is:** two queues, different priority — the microtask queue (`Promise.then`, `await` continuations, `queueMicrotask`) always drains fully before the macrotask queue (`setTimeout`, I/O, `setImmediate`) runs once.

  ```javascript
  setTimeout(() => console.log("timeout"), 0); // macrotask — last
  Promise.resolve().then(() => console.log("promise")); // microtask — first
  ```

- **What problem it solves:** ordering guarantees — microtask means "right after this script, before anything timed"; macrotask means "yield to timers/I/O first". Use a microtask when the follow-up must beat any timer (e.g. update cache before a delayed save); use a timeout when you want to yield a full loop turn.

- **Where it is used:** code after `await` in an Express handler is a microtask (other pending microtasks run first); `setTimeout`-based retry/backoff always waits a full microtask drain plus its delay.
- **Rules:** one macrotask per loop turn, ALL microtasks drain between turns — even ones queued by other microtasks. `queueMicrotask`/`then`/`await` share one FIFO queue (`process.nextTick` jumps ahead of all of them in Node). A timer scheduled from a microtask waits behind already-queued timers. `await` on an already-resolved value still yields — never synchronous.
- **Classic bug:** microtask starvation — a loop that keeps re-queueing `then`s never reaches timers/I/O, so requests hang. Fix: break the chain with `setImmediate`/`setTimeout` to yield a macrotask turn.

### Promise:

- **What it is:** a stand-in for a future value with three states: `pending` → `fulfilled` (value) or `rejected` (reason), one-way only. `then` handles fulfillment, `catch` handles rejection — each returns a NEW promise, so chains compose.

  ```javascript
  const p = new Promise((resolve) => resolve(2)); // executor runs NOW, synchronously
  p.then((n) => n * 10).then((n) => console.log(n)); // 20
  ```

- **What problem it solves:** callback hell and lost errors. Before — nested callbacks where each level re-handles errors and nothing composes:

  ```javascript
  getUser(id, (u) => getOrders(u, (o) => render(o))); // errors? handled where?
  ```

  After — one flat chain, one error channel, return values flow downstream:

  ```javascript
  getUser(id).then(getOrders).then(render).catch(handleErr); // single catch covers all three
  ```

- **Where it is used:** every DB driver, `fetch`, and `fs/promises` call in a backend returns one; Express 5 awaits handler promises and forwards rejections to error middleware.
- **Rules:** executor runs synchronously at construction; `then` callbacks are always async microtasks. Returning a value passes it down; returning a promise UNWRAPS it (flattening — costs one extra microtask tick, so it logs after same-level thens). Rejection/throw skips all `then`s until the first `catch`; `catch` recovers (chain continues fulfilled) unless it rethrows. `Promise.resolve(x)` assimilates if `x` is a promise.
- **Classic bug:** a floating promise with no `catch` — the rejection is silent (or an `unhandledRejection` crash in new Node) far from where it was created. Fix: every chain ends in `catch`, or `await` it inside try/catch.

### async/await:

- **What it is:** the same promises underneath with sync-looking syntax — `await` pauses only its own function to a microtask; an `async` function always returns a promise.

  ```javascript
  async function f() { return 1; }
  f() instanceof Promise; // true — even for a plain value
  ```

- **What problem it solves:** promise chains that still read inside-out once branching appears. Before — nested `then`s where each level re-handles errors; after — straight-line code with locals and normal control flow:

  ```javascript
  try {
    const u = await getUser(id);
    const o = await getOrders(u);
    render(u, o);
  } catch (e) { handleErr(e); }
  ```

- **Where it is used:** every Express handler, middleware, and seed script — any place that reads "get X, then get Y, then respond".
- **Rules:** `await` always yields (even on plain values — code after it never runs synchronously). Sequential `awaits` are serial, latencies add (2×50ms ≈ 123ms); `Promise.all` on independent I/Os costs the max (≈ 61ms) — verified in `04-async-await.js` §3. `await` in a loop is serial by construction. An unguarded rejection throws at that line and rejects the whole async function. Forgetting `await` hands you a promise, not the value.
- **Classic bug:** `for (const id of ids) await db.query(...)` in a hot endpoint — works in dev, N+1 round trips in production. Fix: `await Promise.all(ids.map(...))`, with a concurrency cap when N is unbounded. In Express 4 an uncaught handler rejection hangs the request — always try/catch (or an async-error wrapper) plus `next(e)`.

### Promise combinators:

- **What it is:** one call running N promises concurrently, reduced to one promise — differing only in what "done" means: `all` (all fulfill, input order), `allSettled` (all settle, per-item report), `race` (first settle wins), `any` (first fulfillment wins).

  ```javascript
  await Promise.all([getUser(id), getOrders(id)]); // [user, orders] — max latency, not sum
  ```

- **What problem it solves:** fanning out independent I/Os without manual counters, plus the timeout pattern `all`/`await` can't express:

  ```javascript
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("db timeout")), 5000));
  const rows = await Promise.race([db.query(sql), timeout]);
  ```

- **Where it is used:** `all` for parallel queries in one handler; `allSettled` for bulk imports where partial results are fine; `race` for timeouts on drivers without timeout support; `any` for fallbacks (primary → replica → recompute).
- **Rules:** `all` resolves in input order when the slowest fulfills, rejects on the first rejection. `allSettled` always fulfills with `{status, value/reason}` items. `race` settles with the first settler, fulfill or reject. `any` fulfills with the first fulfillment, rejects with `AggregateError` (`.errors` holds all reasons) only if everything fails.
- **Classic bug:** `all`'s fail-fast doesn't cancel the losers — other queries keep running (and billing) in the background. Fix: `AbortSignal` where supported, or `allSettled` when waste matters. `race` timeouts without `clearTimeout` in a `finally` leak a timer handle per request.

### Error hierarchy:

- **What it is:** custom `extends Error` classes — one per client-meaningful failure (`NotFound` → 404, `ValidationError` → 400) — so the handler maps type → status via `instanceof` instead of string-matching messages.

  ```javascript
  class NotFound extends AppError {
    constructor(what) { super(`${what} not found`, 404); this.name = "NotFound"; }
  }
  catch (e) {
    if (e instanceof NotFound) return res.status(404).json({ error: e.message });
    logger.error(e);
    return res.status(500).json({ error: "internal" });
  }
  ```

- **What problem it solves:** the `if (message.includes(...))` swamp — fragile to rewording, and every new error edits the handler. With a hierarchy the error carries its own meaning; the mapper is closed to message edits. `cause` chaining keeps the debuggable root (`SyntaxError`/driver error) while the handler sees your class.
- **Where it is used:** the Express error boundary — operational errors (4xx classes) get mapped responses, programmer bugs stay 500 with full stacks in the log.
- **Rules:** always `extends Error` with `super(message)` first (captures the stack); set `this.name`. Operational data (`status`, `code`) goes on fields, never parsed from messages. Throwing raw strings/objects loses stack and `instanceof` — lint it out. The class survives `await` — rejection carries the instance across the async boundary intact.
- **Classic bug:** `res.status(500).json({ error: e.message })` on unknowns leaks driver internals and paths to clients. Fix: log full server-side, send a static body. Second: a single `AppError` with ad-hoc statuses pushes status decisions to call sites — subclasses centralize them in the mapper.

### Exercises:
- Open `01-event-loop.js`, predict each `console.log` first (where `// ?` is), then run `node 01-event-loop.js` and compare with your guess.
- Open `02-micro-macro.js`, predict each `console.log` first (where `// ?` is), then run `node 02-micro-macro.js` and compare with your guess.
- Open `03-promise.js`, predict each `console.log` first (where `// ?` is), then run `node 03-promise.js` and compare with your guess.
- Open `04-async-await.js`, predict each `console.log` first (where `// ?` is), then run `node 04-async-await.js` and compare with your guess.
- Open `05-combinators.js`, predict each `console.log` first (where `// ?` is), then run `node 05-combinators.js` and compare with your guess.
- Open `06-error-hierarchy.js`, predict each `console.log` first (where `// ?` is), then run `node 06-error-hierarchy.js` and compare with your guess.
