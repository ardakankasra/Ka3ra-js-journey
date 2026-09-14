### Day 03 — Data Structures
- **Property Descriptor** — the hidden ID card of every property (writable/enumerable/configurable) controlling how it behaves.

### Property Descriptor:

- **What it is:** every property has a hidden Descriptor answering three questions: `writable` (can it be reassigned with `=`?), `enumerable` (does it show up in loops/spread/JSON?), `configurable` (can it be deleted or can the Descriptor itself be changed?). Two flavors: **data** (`value` + `writable`) or **accessor** (`get`/`set`) — never both at once.

  ```javascript
  const user = { name: "ali" };
  Object.getOwnPropertyDescriptor(user, "name");
  // { value: "ali", writable: true, enumerable: true, configurable: true }

  const b = {};
  Object.defineProperty(b, "x", { value: 1 });
  // all three flags are false! Only value was given — the classic trap
  ```

- **What problem it solves:** plain `=` leaves everything open. The Descriptor adds locks: `writable: false` means read-only (e.g. an order `id`), `enumerable: false` means it exists but stays out of output (e.g. `passwordHash` in `res.json`), `configurable: false` means the lock is permanent — no way back.

- **Where it is used:** read-only fields (`id`, computed `totalPrice` in Anbar); hiding internals from JSON; `Object.freeze` (all `writable:false` + `configurable:false`) for global constants; computed getters (`total` derived from `price` on every access).

  ```javascript
  Object.defineProperty(config, "apiKey", {
    value: "123", writable: false, enumerable: false, configurable: false
  });
  config.apiKey = "hacked"; // silently ignored (strict mode: throws)
  console.log({ ...config }); // {} — never leaked
  ```

- **Rules:** created with `=` means all three are `true`; created with `defineProperty` means anything unstated is `false`. Spread, `Object.assign`, and `Object.keys` only see **own + enumerable** properties. `configurable: false` cannot be undone.
- **Classic bug:** a field goes missing after a spread copy — cause: that field is `enumerable: false`, not a bug in your code.

### Freeze / Seal:

- **What it is:** `seal` locks the shape (no add, no delete); `freeze` locks the shape + the values (no add, no delete, no edit).
  ```javascript
  const s = Object.seal({ age: 22 });
  s.age = 50; // OK
  s.job = "dev"; // blocked — shape is locked

  const f = Object.freeze({ port: 4000 });
  f.port = 9999; // blocked — value is locked too
  ```
- **Rules:** `seal` = all `configurable: false`; `freeze` = `seal` + all `writable: false`. Both are **shallow** — nested objects stay open. In sloppy mode failures are silent, in `"use strict"` they throw `TypeError`.
- **Classic bug:** `freeze` looks fully safe, but `cfg.db.host = "hacked"` still works — only the first level is frozen.

### Shallow vs Deep Clone:

- **What it is:** shallow copies one level (nested stays shared); deep copies nested structures too (fully separate).
  ```javascript
  const copy = { ...order }; // shallow — copy.customer === order.customer
  const deep = structuredClone(order); // deep — fully separate
  ```
- **Rules:** spread / `Object.assign` / `slice` are **shallow**. `structuredClone` is the standard **deep** (fails on functions, DOM). `JSON.parse(JSON.stringify())` is deep-but-lossy: drops `undefined`/functions, turns `Date` into string, breaks on circular refs.
- **Classic bug:** copy an order with spread, edit the nested field, and the original silently changes — shared reference, not logic bug.

### Exercises:
- Open `01-property-descriptor.js`, predict each `console.log` first (where `// ?` is), then run `node 01-property-descriptor.js` and compare with your guess.
- Open `02-freeze-seal.js`, predict each `console.log` first (where `// ?` is), then run `node 02-freeze-seal.js` and compare with your guess.
- Open `03-shallow-deep-clone.js`, predict each `console.log` first (where `// ?` is), then run `node 03-shallow-deep-clone.js` and compare with your guess.
