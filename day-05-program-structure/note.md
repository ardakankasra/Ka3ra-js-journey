### Day 05 — Program Structure

- **CommonJS** — Node's original module system (`require`/`module.exports`), synchronous.

### CommonJS:

- **What it is:** each `.js` file is one module. Node wraps every file in a function `(exports, require, module, __filename, __dirname)` before running it, so top-level code lives inside that function scope. `require(path)` loads another module synchronously and returns its `module.exports`.

- **What problem it solves:** without modules every script shares ONE global namespace — files overwrite each other's globals and load order decides behavior. CommonJS makes sharing explicit: a file exports exactly what it puts on `module.exports`, everything else stays private.

  ```javascript
  // config.js
  module.exports = { port: 4000 };

  // server.js
  const config = require("./config"); // executes config.js NOW, returns its exports
  ```

- **Where it is used:** Node's classic backend layout — `routes/`, `services/`, `config.js` wired together by `require`; every npm package without `"type": "module"` in `package.json` (including most older Express middleware). Already met it in `day-04-async-control-flow/01-event-loop.js` (`const fs = require("fs")`).

- **Rules (priority order):**
  1. **One file = one module, private by default** — `let`/`const` at the top level are invisible outside the file; nothing leaks to `globalThis` unless you put it there yourself.
  2. **`module.exports` is the real export object** — `exports` is only a local alias pointing at it. `module.exports = X` changes what requirers get; `exports = X` breaks the alias and exports nothing.
  3. **`require` is synchronous** — it resolves the path, executes that file top-to-bottom, then returns; your line blocks until the other file finishes, and a throw inside it lands at the `require(...)` line.
  4. **Load once, cache forever** — resolution is keyed by absolute path, so the second `require("./config")` returns the same object without re-running the file.
  5. **Circular `require` returns a partial module** — in A ↔ B cycles each side sees whatever was filled in at that moment (often `{}`).
  6. **Path resolution** — `./` and `../` are relative to the *current file* (extension optional: `.js` → `.json` → `.node`); bare names (`fs`, `express`) are Node builtins or an upward `node_modules` lookup.

- **Classic bug:** reassigning the alias — `exports = { port: 4000 }` looks right but exports nothing; the requirer receives the original `{}` and crashes somewhere else. Fix: `module.exports = { port: 4000 }`.

### ESM:

- **What it is:** the JS-standard module system (`import`/`export`), native to browsers and modern Node. A file is ESM if it ends `.mjs` or its nearest `package.json` has `"type": "module"`.

- **What problem it solves:** `require` is a runtime function — nothing can see what a file uses without executing it, so bundlers can't drop unused exports and loading is serial/blocking. `import` is a declaration the engine reads before running anything:

  ```javascript
  // db.js
  export default function connect() { /* ... */ }

  // server.js — hoisted: db.js fully evaluated before your first line
  import connect from "./db.js";
  ```

- **Where it is used:** Anbar server + Client (React/Vite run ESM end-to-end), every browser module, modern npm packages. Tree-shaking (Vite dropping unused exports) only exists because imports are statically visible.

- **Rules (priority order):**
  1. **`import`/`export` are declarations, top level only** — collected at link time, dependencies evaluated before the file's first line (hoisting); inside an `if` → SyntaxError.
  2. **Full specifiers required** — `./db.js` with extension: ESM does no CJS-style `.js` guessing; wrong/missing path → `ERR_MODULE_NOT_FOUND`.
  3. **Live bindings, immutable namespace** — importers see later changes (`self.counter` tracks the module), but writing to the namespace throws `TypeError`; you can't detach an export the way `exports = {}` breaks CJS.
  4. **Top-level await is legal** — the module pauses, its importers wait; this makes ESM async by nature.
  5. **Dynamic `import()` returns a Promise** — the runtime-way to load (lazy-load a route, load on click), and it even works inside CJS files — the bridge between the two systems.
  6. **Always strict** — no `"use strict"` needed.

- **Classic bug:** the CJS habit of extension-less paths — `import db from "./db"` throws `ERR_MODULE_NOT_FOUND` where `require("./db")` would have found `./db.js`. Fix: always write the full filename.

### Dynamic import():

- **What it is:** `import(specifier)` used as an expression (not a declaration) — returns a Promise resolving to the module namespace; the runtime form of ESM loading.

- **What problem it solves:** static `import` is unconditional and top-level — you can't load code only on a click, a route, or a feature flag. Before/after:

  ```javascript
  import admin from "./admin.js";        // static: admin bundle ships to EVERYONE
  const admin = await import("./admin.js"); // dynamic: loads only when the route opens
  ```

- **Where it is used:** `React.lazy(() => import("./AdminPanel"))`, Vite per-route code splitting, optional deps behind feature flags, and inside CJS files reaching for ESM (`require()` of an ESM file throws → `await import()` is the escape hatch).

- **Rules (priority order):**
  1. **Returns a Promise, always async** — even for an already-cached module the callback lands in a microtask, after the current sync code.
  2. **Namespace shape** — resolves to `{ default, ...named }`, same namespace object the static import would link against; same URL = shared cache = one instance.
  3. **Failure is a rejected promise**, not a sync throw — missing module gives `ERR_MODULE_NOT_FOUND` at `await`/`.catch`, never at the line itself the way `require` throws.
  4. **Relative specifiers resolve against the importing file** — and unlike CJS, still need the full extension (`./x.js`).
  5. **Works in BOTH systems** — inside `.mjs` and inside `.js` CJS files; in CJS it's the only door into ESM.
  6. **Conditional by construction** — it's an ordinary expression: put it in `if`, `try`, a click handler, a route loader.

- **Classic bug:** forgetting it's a Promise — `const m = import("./utils.js"); m.helper()` → `TypeError: m.helper is not a function` (m is a Promise). Fix: `const m = await import("./utils.js")` or `import(...).then(...)`.

### Exercises:
- Open `01-common.js`, predict each `console.log` first (where `// ?` is), then run `node 01-common.js` and compare with your guess.
- Open `02-esm.mjs`, predict each `console.log` first (where `// ?` is), then run `node 02-esm.mjs` and compare with your guess.
- Open `03-dynamic-import.mjs`, predict each `console.log` first (where `// ?` is), then run `node 03-dynamic-import.mjs` and compare with your guess.
