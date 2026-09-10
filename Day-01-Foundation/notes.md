### Day 01 — Foundations
- **Types & Values** — primitives copy by value, reference types copy by reference.
- **Coercion** — automatic type conversion when operators like `==` compare mismatched types.
- **Scope** — where a variable is reachable: global, function, or block.
- **Hoisting** — `var`/function *declarations* move to the top of scope; their values don't.
- **TDZ** — the gap between scope start and a `let`/`const` declaration, where the variable exists but can't be touched.
- **Closure** — a function retaining access to its outer scope's variables even after that scope has finished running.

## Types & Values:

### The main question is: 

  "What happens when we take a copy of a variable?"

  ## Well there is two kind of copy
  - **Copy by value**: When we copy a primitive value (like a number, string, boolean, null, undefined, symbol, or bigint), the new variable gets its own copy of the value. Changes to one variable do not affect the other.


  - **Copy by reference**: When we copy a reference type (like an object or array), the new variable points to the same underlying data. Changes made through one variable will affect the other, since they both refer to the same object in memory.

 ### But there is a catch, mutation and reassignment
  - **Mutation**: Changing the contents of an object or array (e.g., adding a property, changing a value) affects all references to that object. For example:
    ```javascript
    let obj1 = { name: 'Alice' };
    let obj2 = obj1; // obj2 references the same object as obj1
    obj2.name = 'Bob'; // Mutates the object
    console.log(obj1.name); // Outputs: 'Bob'
    ```

  - **Reassignment**: Assigning a new value to a variable does not affect other references. For example:
    ```javascript
    let arr1 = [1, 2, 3];
    let arr2 = arr1; // arr2 references the same array as arr1
    arr2 = [4, 5, 6]; // Reassigns arr2 to a new array
    console.log(arr1); // Outputs: [1, 2, 3]
    console.log(arr2); // Outputs: [4, 5, 6]
    ```

  ## Coercion:
  - **Type coercion** occurs when JavaScript automatically converts one data type to another, often in the context of comparisons or operations. For example:
    ```javascript
    console.log('5' == 5); // true, string '5' is coerced to number 5
    console.log('5' === 5); // false, no coercion with strict equality
    console.log(true + 1); // 2, true is coerced to number 1
    console.log(null + 1); // 1, null is coerced to number 0
    console.log(undefined + 1); // NaN, undefined cannot be coerced to a number
    console.log('5' - 2); // 3, string '5' is coerced to number 5
    console.log('5' + 2); // '52', number 2 is coerced to string '2'
    console.log('5' * '2'); // 10, both strings are coerced to numbers
    console.log('5' / '2'); // 2.5, both strings are coerced to numbers
    console.log('5' % '2'); // 1, both strings are coerced to numbers
    console.log('5' ** '2'); // 25, both strings are coerced to numbers
    console.log('5' > '2'); // true, both strings are coerced to numbers
    ```

    ### Scope:
  - **Scope** determines the accessibility of variables and functions in different parts of the code.

  ### hoisting:
  - **Hoisting** is JavaScript's default behavior of moving declarations to the top of the current scope (script or function). This means that variables and functions can be used before they are declared. However, only the declarations are hoisted, not the initializations.

  ### TDZ:
  - **Temporal Dead Zone (TDZ)** is the period between the start of a block and the point where a variable is declared with `let` or `const`. During this time, the variable exists but cannot be accessed, leading to a ReferenceError if you try to use it.


  ### closure: 
  - **Closure** is the ability of a function to access and "remember" variables from its outer (enclosing) scope, even after the outer function has finished executing.