# Introduction
JavaScript Engines
* V8 used by Chrome, Opera, Edge
* SpiderMonkey used by Firefox

---

# Data Types
## Number

## String
Use quotations to represent strings.
* Single quote
* Double quote
* Backtiks `hello`. This has extended functionality.
```js
alert(`hello ${name}`);
```
Strings are immutable.

## Symbol
Immutable

## Others
Only mutable type in JavaScript.
* Boolean `true`, `false`
* `null` does not belong to any data type. means "reference to non-existing object"
* `undefined` it is assigned to an uninitialized variable. it means ”no value or type”. if assigned to an existing variable, it will clear the value and type. though in such case, it is recommended to use `null`.
* `typeof` returns the data type of the argument. Usage: `typeof 50n; or typeof(50n)`;

## Type Conversion
https://javascript.info/type-conversions

## Caution
It is better not to create variables using String(), Number(), Boolean() as this can slow the program execution.

---

# Functions
```js
function showMessage(){
    alert( 'Hello everyone!' );
    return something; // if required
}
// to pass arbitrary number of arguments
function sumAll(...args) { // args is the name for the array
    let sum = 0;
    for (let arg of args) sum += arg;
    return sum;
}
function showName(firstName, lastName, ...titles) {
    alert( firstName + ' ' + lastName );
    alert( titles[0] );
    alert( titles.length );
}
```
If any value is not provided for some parameters, they will be `undefined`. To avoid such cases, we can provide default values to the parameters.
If the function is called without the parenthesis, that actually represents the whole function as string. If printed out, it will display the function declaration as string. This string can be assigned to other variables, and those can be used as function by adding the parenthesis.
So, the function name alone represents the function body as string, while with parenthesis, it represents the return value.
A Function Declaration can be called earlier than it is defined. A global Function Declaration is visible in the whole script, no matter where it is. That’s due to internal algorithms.

## Function Expression
A function, created inside an expression or inside another syntax construct. A Function Expression is created when the execution reaches it and is usable only from that moment.
```js
let sayHi = function() {
  alert( "Hello" );
};
```

## Callback Function
```js
function ask(question, yes, no){
    if(confirm(question)) yes()
    else no();
}
function showOk(){
    alert("You agreed.");
}
function showCancel(){
    alert("You canceled the execution.");
}
ask("Do you agree?", showOk, showCancel);
```
The arguments `showOk` and `showCancel` of ask are called callback functions or just callbacks. The idea is that
we pass a function and expect it to be “called back” later if necessary.

## Arrow Function
```js
let func = (arg1, arg2, ..., argN) => expression;
// example
let sum = (a, b) => a + b;
// function call
alert( sum(1, 2) );
// when there is only one argument
let double = n => n * 2;
// when there is no argument
let sayHi = () => alert("Hello!");
// multiline
let sum = (a, b) => {  // the curly brace opens a multiline function
  let result = a + b;
  return result; // if we use curly braces, then we need an explicit "return"
};
```

---

# Object
Looks like a python `dict`.

```js
// creating an object
let user = new Object();
let user = {};
// object syntax
let x = {firstName: "John",
         lastName: "Snow",
         "real name": "Aegon VI", // multiword key should be inside quotes
         };
x.firstName, x["firstName"] // access property
// dot access cannot be used for multiword keys
x.age=30; // add a new property
delete x.age; // deletes the property
"key" in object // to see if the key exists in the object
// access keys using loop
for (key in object) {
    // executes the body for each key among object properties
    // key is a variable here, it has to be declared before, or declared inline
}
```

Most of the time, when property names are known and simple, the dot is used. And if we need something more complex, then we switch to square brackets. Unlike variables, or functions, keywords can be used as property names.
There will be no error if the property doesn’t exist! Reading a non-existing property just returns `undefined`. Common practice is to declare objects as `const`.
One of the fundamental differences of objects versus primitives is that objects are stored and copied “by reference”, whereas primitive values: strings, numbers, booleans, etc – are always copied “as a whole value”. When an object variable is copied, the reference is copied, but the object itself is not duplicated. To make duplicate of objects,

```js
Object.assign(user, permissions1, permissions2);
let clone = Object.assign({}, user);
// object having object as property can cause problem
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};
// needs deep cloning
let clone = structuredClone(user);
// but it cannot clone function properties
```

The first argument is a target object. Further arguments is a list of source objects. If the copied property name already exists, it gets overwritten.

## Computed Properties
```js
let fruit = prompt("Which fruit to buy?", "apple");
let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};
// or
let bag = {};
bag[fruit] = 5;
alert( bag.apple ); // 5 if fruit="apple"
```

## Object Methods
To use function as a property,

```js
\begin{minted}[breaklines]{js}
car[fullname: function(){
    return name;
}]
// or
car[fullname(){ return name; }]
```

Use `this` inside an object to refer to itself. But be careful while using `this` as it has different property in different areas.

## Constructor
Looks like regular functions, but the name starts with capital letter (preferred) and executed with the `new` operator.

```js
function User(name) {
  this.name = name;
  this.isAdmin = false;
  new.target // is true if the function was called using new, false otherwise
}
let user = new User("Jack");
User("no-new"); // this is a regular function call
```

Typically, constructors should not have any return statements. If there is, it should return an object, otherwise the statement will be ignored. While creating an object with `new`, we can omit the parenthesis after the constructor.

## Object to Primitive Conversion
Unlike C++, JavaScript does not have operator overloading. While using operators with objects, JavaScript converts them to primitive types.

---

# Input/Output
* `alert()` creates a pop-up window at the top (modal).
* `prompt()` similar to alert, but has an input field for for the visitor. Usage
`result = prompt(title, [default]);`
`[default]` is an optional parameter, denotes initial value for the input field.
* `confirm()` shows a modal window with a question and two buttons: `OK` and `Cancel`. The result is true if OK is pressed and false otherwise. Usage:
`result = confirm(question);`

---

# Operators
## Arithmatic Operators
Pretty much the same as C/C++. But, in case of strings, JavaScript uses the `+` operator for concatenation.
```js
"Six " + 6 // results in a string -> Six 6
1+2+"4" // results in 34
"1"+2+4 // results in 124
```

## Comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order. In other words, strings are compared letter-by-letter.
When comparing values of different types, JavaScript converts the values to numbers. `null` becomes `0` and `undefined` becomes `NaN`.
```js
// something funny that happens in javascript
let a = 0;
alert( Boolean(a) ); // false
let b = "0";
alert( Boolean(b) ); // true
alert(a == b); // true!
```

`null` and `undefined` gives false for strict-equality (`===`), and true for non-strict equality (`==`).

## Logical Operators
Pretty much the same as C/C++. Special cases:
* `result = value1 || value2 || value3;` `result` will have the first value that equates to `true`. If all the expressions are `false`, then the value of the last expression will be assigned. Type of the expression is retained while assigning.
* Logical `AND` has same operations but opposite characteristics of logical `OR`.
* `!!` is sometimes used for converting a value to boolean type.
* Nullish coalescing operator `result = a ?? b` means if `a` is not `null` or `undefined`, then use `a`. Otherwise use `b`. Use case:
`alert(user ?? "Anonymous");`
`alert(firstName ?? lastName ?? nickName ?? "Anonymous");`
* Due to safety reasons, JavaScript forbids using `??` together with `&&` and `||` operators, unless the precedence is explicitly specified with parentheses.
`let x = 1 && 2 ?? 3; // Syntax error`

---

# Control Flow of Program

## Switch
The structure and execution of switch block is same as C/C++, but case statements can have expressions, *e.g.* `case b + 1:`
`switch` uses strict equality to match its expressions.

## Loops
`for`, `while`, `do-while` loops are same as C/C++. break statement breaks from the immediate loop. If we want to break out of multiple loops at once:
```js
outer: for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
        if(condition) break outer;
    }
} alert('Done!');
```
Similar task can be done for `continue`.

---

# Classes
```js
class MyClass {
  // class methods
  constructor() { ... }
  method1() { ... }
  method2() { ... }
  method3() { ... }
  ...
}
let obj = new MyClass();
```
Class methods are non-enumerable.

## Class Expression
```js
let User = class {
  sayHi() {
    alert("Hello");
  }
};
// If a class expression has a name, it’s visible inside the class only:
let User = class MyClass {
  sayHi() {
    alert(MyClass); // MyClass name is visible only inside the class
  }
};
new User().sayHi(); // works, shows MyClass definition
alert(MyClass); // error, MyClass name isn't visible outside of the class
```

## Getters ans Setters
```js
class User {
    constructor(name) {
        // invokes the setter
        this.name = name;
    }

    get name() {
        return this._name;
    }
    
    set name(value) {
        if (value.length < 4) {
            alert("Name is too short.");
            return;
        }
        this._name = value;
    }
}
```

## Inheritance
```js
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}
```

## Method Override
```js
class Rabbit extends Animal {
  stop() {
    // ...now this will be used for rabbit.stop()
    // instead of stop() from class Animal
  }
}
```

## Constructor Override
```js
class Rabbit extends Animal {
  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }
  // ...
}
```

## Mixin
```js
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  }
};
class User {
  constructor(name) {
    this.name = name;
  }
}
// copy the methods
Object.assign(User.prototype, sayHiMixin);
// now User can say hi
new User("Dude").sayHi(); 
```

---

# Error Handling
```js
try {
  // code...
} catch (err) {
  // error handling
}
```

If an exception happens in “scheduled” code, like in setTimeout, then `try...catch` won’t catch it. That’s because the function itself is executed later, when the engine has already left the `try...catch` construct. To catch an exception inside a scheduled function, `try...catch` must be inside that function.
The `err` contains all information about the error occurred. Two main properties are:
* `name` Error name. For instance, for an `undefined` variable that’s `ReferenceError`.
* `message` Textual message about error details.
If we don’t need error details, we can omit the object, including parenthesis after the `catch`. We can create our error classes by extending the Error class.
```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

## `throw`
```js
// to create a new error
let error = new Error("Things happen o_O");
// throw an error
throw new SyntaxError("Incomplete data: no name");
```

Throwing an error from inside of catch block is called rethrowing. This error should be handled by an outer `try...catch` block, otherwise the script dies.

## `finally`
If added after `try...catch` block, it always executes, similar to Python.

## Global Catch
```html
<script>
    window.onerror = function(message, url, line, col, error) {
        alert(`${message}\n At ${line}:${col} of ${url}`);
    };
    function readData() {
        badFunc(); // Whoops, something went wrong!
    }
    readData();
</script>
```
The role of the global handler `window.onerror` is usually not to recover the script execution – that’s probably impossible in case of programming errors, but to send the error message to developers. There are also web-services that provide error-logging for such cases, like https://errorception.com or https://www.muscula.com.

---

# Browser Interaction
![Browser Interaction](images\browser-interaction.png)

## Document Object Model
Or DOM for short, represents all page content as objects that can be modified. The document object is the main “entry point” to the page. [DOM living standard](https://dom.spec.whatwg.org/)

## CSS Object Model (CSSOM)
In practice though, the CSSOM is rarely required, because we rarely need to modify CSS rules from JavaScript (usually we just add/remove CSS classes, not modify their CSS rules), but that’s also possible.

## Browser Object Model (BOM)
It represents additional objects provided by the browser (host environment) for working with everything except the document.

---

# Resources
* [The Modern JavaScript Tutorial](https://javascript.info/)
* [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)