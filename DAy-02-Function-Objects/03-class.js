// ---------- Class exercises: predict, then run ----------

// 1. Sugar check — what prints?
class User {
  constructor(name) { this.name = name; }
  greet() { console.log('hi ' + this.name); }
}
console.log(typeof User); // ?
const u = new User('Ali');
console.log(u.hasOwnProperty('greet')); // ? (own or on prototype?)
u.greet(); // ?

// 2. extends + super — what prints?
class Admin extends User {
  constructor(name, level) { super(name); this.level = level; }
  greet() { super.greet(); console.log('level: ' + this.level); }
}
new Admin('Sara', 1).greet(); // ? (two lines)

// 3. Must use `new` — what happens?
try { User('NoNew'); } catch (e) { console.log('error:', e.constructor.name); }

// 4. Lost `this` — what prints, and fix it on the marked line:
const svc = new User('Reza');
const fn = svc.greet;
try { fn(); } catch (e) { console.log('error:', e.constructor.name); }
// fix (don't change greet):
// const fixed = ...;
// fixed(); // hi Reza

// 5. Private field — what happens?
class Repo {
  #db;
  constructor(db) { this.#db = db; }
  get() { return this.#db; }
}
const r = new Repo('pg');
console.log(r.get()); // ?
// console.log(r.#db); // uncomment to see → ?
