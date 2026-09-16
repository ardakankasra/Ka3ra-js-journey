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

### Exercises:
- Open `01-event-loop.js`, predict each `console.log` first (where `// ?` is), then run `node 01-event-loop.js` and compare with your guess.
