### Day 02 — Function & Object Model
- **this** — determined by *how* a function is called, not where it's defined.
- **Execution Context** — the environment a piece of code runs in: scope, `this`, variables.
- **call/apply/bind** — explicitly set what `this` points to when invoking a function.
- **Prototype Chain** — how JS looks up properties/methods not found directly on an object.
- **Class** — syntactic sugar over the same prototype-based inheritance.
- **Mixin** — composing behavior from multiple sources without classical inheritance.


### this:
  - Determined by *how* a function is called, not where it's defined.
  - Solves reuse: one function, many objects — `this` points at the current owner.

  ```javascript
  // Without this — one copy per object:
  const user = {
    name: 'Mike',
    greet: () => console.log(`Hi I'm ${user.name}`),
  };

  // With this — one function, reusable:
  function hello() {
    console.log(`Hello ${this.name}`);
  }

  const you = {
    name: 'Jack',
    hello // no () → reference only, does not execute
  };

  you.hello(); // Hello Jack — `this` === you (implicit binding)
  ```
  - 4 binding rules (priority order): `new` > explicit (`call/apply/bind`) > implicit (`obj.method()`) > default (`undefined` in strict, `globalThis` otherwise).
  - Arrow functions have no own `this` — they inherit it lexically from the outer scope.
  - Classic bug: passing a method as a callback loses `this` (e.g. `app.get('/x', service.handle)` → fix with `.bind()` or a wrapper arrow).
