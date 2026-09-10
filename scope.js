let name = 'Ka3ra';

console.log(name); // ka3ra

function test() {
  let name = 'simon'; // shadowing
  let age = 22;
  console.log(name, age);
}

test(); // ali

function ka3ra(){
  console.log(name);
}

ka3ra();

if(true) {
  var you = 'killy' 
}

console.log(you);

let x = 'global'

function out() {
  let x = 'out';
  function inner() {
    let x = 'in';
    console.log(x);
  }
  inner()
}

out(); // in