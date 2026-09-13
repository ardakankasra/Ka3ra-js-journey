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

### Exercises:
- Open `01-property-descriptor.js`, predict each `console.log` first (where `// ?` is), then run `node 01-property-descriptor.js` and compare with your guess.
