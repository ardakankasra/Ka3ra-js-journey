// Without this:
function greet() {
  console.log(`Hi I'm ${name}`);
}

const user = {
  name: 'Mike',
  greet: () => console.log
  (
    `Hi I'm ${user.name}`
  ),
};

// With this

function hello() {
  console.log(`Hello ${this.name}`);
}

const you = {
  name: "Jack",
  hello // when without () function does not execute
}

you.hello() // Jack


// ---------- Exercises: predict, then run ----------

// 1. Implicit binding — what prints?
const a = { name: 'A', say() { console.log(this.name); } };
a.say(); // ?

// 2. Lost binding — what prints? (strict vs sloppy: why TypeError or undefined?)
const sayFn = a.say;
try { sayFn(); } catch (e) { console.log('error:', e.constructor.name); }

// 3. Arrow has no own `this` — what prints?
const b = {
  name: 'B',
  say: () => console.log(this.name),
};
b.say(); // ?

// 4. `new` wins over implicit — what prints?
function Person(name) { this.name = name; }
const p = new Person('C');
console.log(p.name); // ?

// 5. Fix it — make this print 'D' without changing say():
// (hint: explicit binding)
const d = { name: 'D' };
function say() { console.log(this.name); }
// your line here:
