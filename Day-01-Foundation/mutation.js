let me = {
  name: 'Ka3ra',
  age: 22,
};

me.age = 23;

console.log(me);

// or with a function

function mutate(obj) {
  obj.age = 50;
  obj.name = 'Mike';
}
mutate(me);
console.log(me);
