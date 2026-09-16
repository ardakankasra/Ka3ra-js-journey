# 🧠 JS Deep-Dive: 7 Day Journey 

> Full pass through JavaScript's core mechanics: types, scope, prototypes, async internals, memory, security, and the newest ES2025/2026 additions, compressed into a focused 7-day sprint. 

---

## 📅 Progress Tracker

| Day | Topic | Status | Notes |
|----|-------|:------:|-------|
| 01 | Values, Types, Coercion + Scope, Hoisting, TDZ, Closures | ✅ | |
| 02 | `this`, Execution Context, call/apply/bind + Prototypes, Classes, Mixins | ✅ | |
| 03 | Objects & Arrays deep-dive + Iterators & Generators | ✅ | |
| 04 | Event Loop (Node phases) + Promises/async-await + Error Handling | 🟡 | ⚠️ heavy day |
| 05 | Modules (CJS vs ESM) + Meta-programming (Symbol/Proxy/Reflect) | ⬜ | |
| 06 | Functional JS + Modern syntax (ES2025/26) + Memory model + Node internals | ⬜ | ⚠️ heavy day |
| 07 | JS Security + Design Patterns + Testing + Capstone | ⬜ | ⚠️ heavy day |

Legend: ⬜ not started · 🟡 in progress · ✅ done
Days marked ⚠️ combine several dense subtopics — split into 1.5 days if needed rather than rushing.

---

## 🧩 Concepts by Day (one-liners)

### Day 01 — Foundations
- **Types & Values** — primitives copy by value, reference types copy by reference.
- **Coercion** — automatic type conversion when operators like `==` compare mismatched types.
- **Scope** — where a variable is reachable: global, function, or block.
- **Hoisting** — `var`/function *declarations* move to the top of scope; their values don't.
- **TDZ** — the gap between scope start and a `let`/`const` declaration, where the variable exists but can't be touched.
- **Closure** — a function retaining access to its outer scope's variables even after that scope has finished running.

### Day 02 — Function & Object Model
- **this** — determined by *how* a function is called, not where it's defined.
- **Execution Context** — the environment a piece of code runs in: scope, `this`, variables.
- **call/apply/bind** — explicitly set what `this` points to when invoking a function.
- **Prototype Chain** — how JS looks up properties/methods not found directly on an object.
- **Class** — syntactic sugar over the same prototype-based inheritance.
- **Mixin** — composing behavior from multiple sources without classical inheritance.

### Day 03 — Data Structures
- **Property Descriptor** — flags (writable/enumerable/configurable) controlling how a property behaves.
- **Object.freeze/seal** — freeze locks a shape completely; seal only blocks add/remove.
- **Shallow vs Deep Clone** — shallow copies one level; deep copies nested structures too.
- **Array-by-copy methods** — `toSorted`, `with`, etc. return a new array instead of mutating.
- **Iterator** — any object implementing `Symbol.iterator`, usable with `for...of`.
- **Generator** — a function that can pause and resume execution via `yield`.

### Day 04 — Async & Control Flow
- **Event Loop** — runs async callbacks once the call stack is empty.
- **Microtask vs Macrotask** — the Promise queue always drains before the timer queue.
- **Promise** — a stand-in for a value that will resolve or reject later.
- **async/await** — more readable syntax over Promises, same underlying behavior.
- **Promise combinators** — `all` (fail-fast), `allSettled` (waits for all), `race` (first settles wins).
- **Error hierarchy** — custom `extends Error` classes so errors are identifiable and handled distinctly.
- **Unhandled Rejection** — a rejected Promise with no `.catch`.

### Day 05 — Program Structure
- **CommonJS** — Node's original module system (`require`/`module.exports`), synchronous.
- **ESM** — the JS standard module system (`import`/`export`), async and tree-shakeable.
- **Dynamic import()** — loads a module at runtime instead of parse time.
- **Symbol** — a primitive for creating collision-free object keys.
- **Proxy** — an object that intercepts and customizes fundamental operations (get/set) on another object.
- **Reflect** — functional equivalents of an object's default operations, usually paired with Proxy.

### Day 06 — Modern JS & Runtime
- **Currying/Composition** — breaking a multi-arg function into single-arg steps, and chaining simple functions into complex behavior.
- **Set operations (ES2025)** — native union/intersection/difference methods on `Set`.
- **Iterator helpers (ES2025)** — `.map()`/`.filter()` directly on iterators, no array conversion needed.
- **Temporal API** — the modern, bug-resistant replacement for `Date`.
- **Garbage Collection** — automatic memory reclamation for objects with no remaining references.
- **WeakMap/WeakRef** — hold a reference without blocking garbage collection — prevents memory leaks.
- **EventEmitter** — Node's built-in pub/sub pattern underlying much of its async API.
- **Stream** — processing data in chunks instead of loading it fully into memory.

### Day 07 — Production Readiness
- **Prototype Pollution** — an attack that mutates `Object.prototype`, affecting the whole app.
- **ReDoS** — a poorly-written regex causing catastrophic backtracking and hanging the app.
- **Middleware / Chain of Responsibility** — the pattern Express itself runs on: each function passes control to the next.
- **Mocking** — replacing a real dependency (e.g. a DB call) with a fake for isolated testing.
- **TDD** — writing the test before writing the implementation.

---

## 🗂 Repo Structure

```
/day-01-foundations
  notes.md
  exercises.js
/day-02-function-object-model
  notes.md
  exercises.js
/day-03-data-structures
  notes.md
  exercises.js
/day-04-async-control-flow
  notes.md
  exercises.js
/day-05-program-structure
  notes.md
  exercises.js
/day-06-modern-js-runtime
  notes.md
  exercises.js
/day-07-production-readiness
  project/
  writeup.md
```

## ✍️ Daily Log Template (`notes.md`)

```md
## Day X — <Topic>

**What I learned:**
-

**Where this shows up in my backend project:**
-

**Trickiest part / thing I got wrong first:**
-

**One thing I'd explain to someone else:**
-
```

---

## 📚 Core References

- getify/You-Dont-Know-JS — deep mechanics of the language
- lydiahallie/javascript-questions — tricky, illustrated JS questions
- leonardomso/33-js-concepts — checklist of core concepts
- roadmap.sh/javascript — structured path + gap-check
- ryanmcdermott/clean-code-javascript — applying it cleanly afterward
- denysdovhan/wtfjs — edge cases and quirky behavior, good for stress-testing understanding

---
