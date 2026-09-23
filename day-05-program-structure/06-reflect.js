"use strict";
// Day 05 — Reflect (built-in functions: one per fundamental operation; Proxy's counterpart)
// How to: predict each output first (where // ? is), then run with node.

// 1 — syntax as a function: get/set/has callable with explicit arguments
const o = { name: "ka3ra" };
console.log("1:", Reflect.get(o, "name"), Reflect.has(o, "name")); // ? "ka3ra" true
console.log("1:", Reflect.set(o, "age", 22), o.age); // ? true 22 (boolean, not throw)

// 2 — apply takes thisArg explicitly: fixes "lost this" when passing methods around
const greeter = { name: "server", hello(n) { return `hi ${n} from ${this.name}`; } };
console.log("2:", Reflect.apply(greeter.hello, greeter, ["world"])); // ? receiver given
try { const loose = greeter.hello; loose("x"); } catch (e) { console.log("2: throw", e.constructor.name); } // ? this lost → ?

// 3 — decline vs throw: Reflect.set RETURNS false on refusal, syntax TypeError
const frozen = Object.freeze({ x: 1 });
console.log("3:", Reflect.set(frozen, "x", 2)); // ? false, no exception
try { frozen.x = 2; } catch (e) { console.log("3: throw", e.constructor.name); } // ? same refusal, but ?
console.log("3:", frozen.x); // ? unchanged

// 4 — ownKeys = every own key, strings AND symbols (Object.keys: strings only)
const mixed = { a: 1, [Symbol("s")]: 2 };
console.log("4:", Object.keys(mixed).length, Reflect.ownKeys(mixed).length); // ? 1 2

// 5 — the Proxy pairing: trap signature === Reflect signature — forward verbatim
const raw = {};
const person = new Proxy(raw, {
  set(t, p, v, r) { return Reflect.set(t, p, v, r); }, // (target, prop, value, receiver)
});
person.name = "kasra";
console.log("5:", person.name, raw.name); // ? both "kasra" — write landed on TARGET

// 6 — construct with newTarget: run a constructor, but brand it with another prototype
class Animal { constructor() { this.kind = "animal"; } }
class Dog extends Animal { bark() { return "woof"; } }
const pet = Reflect.construct(Animal, [], Dog); // new.target = Dog
console.log("6:", pet instanceof Dog, pet instanceof Animal, pet.kind); // ? true true "animal"
