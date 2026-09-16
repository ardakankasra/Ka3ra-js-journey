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

### Exercises:
- Open `01-event-loop.js`, predict each `console.log` first (where `// ?` is), then run `node 01-event-loop.js` and compare with your guess.
- Open `02-micro-macro.js`, predict each `console.log` first (where `// ?` is), then run `node 02-micro-macro.js` and compare with your guess.
- Open `03-promise.js`, predict each `console.log` first (where `// ?` is), then run `node 03-promise.js` and compare with your guess.
