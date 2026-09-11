// ---------- Prototype Chain exercises: predict, then run ----------

// 1. Basic lookup — what prints?
const animal = { speak() { console.log(this.name + ' makes sound'); } };
const dog = { name: 'Rex' };
Object.setPrototypeOf(dog, animal);
dog.speak(); // ?

// 2. Whose `this`? — what prints?
const cat = { name: 'Tom' };
Object.setPrototypeOf(cat, animal);
cat.speak(); // ?

// 3. Shadowing — what prints?
dog.speak = () => console.log('woof');
dog.speak(); // ?
cat.speak(); // ? (did cat change?)

// 4. Constructor prototype — what prints?
function User(name) { this.name = name; }
User.prototype.greet = function () { console.log('hi ' + this.name); };
const u = new User('Ali');
console.log(u.hasOwnProperty('greet')); // ?
u.greet(); // ?

// 5. Fix it — make `orphan.greet()` print 'hi Sara' WITHOUT touching orphan:
// (hint: set its prototype to someone who has greet)
const orphan = { name: 'Sara' };
// your line here:
