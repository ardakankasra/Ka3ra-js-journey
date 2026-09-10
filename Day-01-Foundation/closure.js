function outer() {
  let name = "YOU";

  function inner() {
    console.log(name);
  }

  inner();
}

outer();

function out() {
  let name = "Killy";

  function inni() {
    console.log(name);
  }

  return inni;
}

const fn = out();

fn();