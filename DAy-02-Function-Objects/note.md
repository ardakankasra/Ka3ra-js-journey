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

### Execution Context:
  - The box JS builds before running code: holds variables, scope link, and `this`.
  - Two phases: **creation** (reserve `var`/functions = hoisting, lock `let/const` = TDZ, set `this`, link outer scope) then **execution** (run line by line).
  - Three parts: Variable Environment (own vars), Lexical Environment (link to outer scope → scope chain / closure), `this` binding.
  - One Global (GEC) + one Function context (FEC) per call, stacked on the **call stack**; popped on `return` unless a closure keeps it alive.

  ```javascript
  function outer() {
    const a = 1;        // lives in outer's FEC
    function inner() {
      console.log(a);   // not here → follows lexical link to outer
    }
    inner();            // new FEC pushed on stack
  }
  outer();              // stack: GEC → outer → inner
  ```

### Prototype Chain:
  - Lookup rule: if a prop isn't on the object itself, JS follows `[[Prototype]]` up to `null`.
  - Solves sharing: one method on the parent, used by all children — no per-object copies.
  - Found methods run with `this` = the caller, not where they were defined.
  - `class` is sugar over `Constructor.prototype`; `map`/`toUpperCase`/`toString` are all prototype lookups.

  ```javascript
  const animal = { speak() { console.log(this.name + ' makes sound'); } };
  const dog = { name: 'Rex' };

  Object.setPrototypeOf(dog, animal);
  dog.speak(); // Rex makes sound — found on parent, this === dog
  ```
  - Own props shadow prototype props; never mutate `Object.prototype` (global pollution).
