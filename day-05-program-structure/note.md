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

### Exercises:
- Open `01-common.js`, predict each `console.log` first (where `// ?` is), then run `node 01-common.js` and compare with your guess.
