// ---------- Mixin exercises: predict, then run ----------
// Idea: a class gets skills from MANY packs via Object.assign (no extends).

// 1. Two packs, one class — what prints?
const CanLog = {
  log(msg) { console.log(`[${this.name}] ${msg}`); }
};
const CanValidate = {
  validate() { return !!this.name; }
};
class Service {}
Object.assign(Service.prototype, CanLog, CanValidate);
const s = new Service();
s.name = 'orders';
s.log('started');    // ?
console.log(s.validate()); // ?

// 2. Whose `this`? — what prints?
const s2 = new Service();
s2.name = 'users';
s2.log('hi'); // ? (does s change?)

// 3. Name clash — the LAST pack silently wins. What prints?
const A = { save() { console.log('save A'); } };
const B = { save() { console.log('save B'); } };
class Doc {}
Object.assign(Doc.prototype, A, B);
new Doc().save(); // ?

// 4. Fix it — give `Robot` a `fly()` from `CanFly` WITHOUT extends:
// (hint: one Object.assign line)
const CanFly = { fly() { console.log(this.name + ' flies'); } };
class Robot {}
// your line here:
const r = new Robot();
r.name = 'R2';
// r.fly(); // should print 'R2 flies' after your fix

// 5. Flat copy check — what prints? (chain or copy?)
console.log(Object.hasOwn(Service.prototype, 'log')); // ?
console.log(Object.hasOwn(Service.prototype, 'validate')); // ?
