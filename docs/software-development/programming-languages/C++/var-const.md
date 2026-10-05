# Variables and Constants

## Variables
- Variables are abstractions for memory locations.
- We use them to reduce complexity.
- Can’t declare same name as variable more then once in a single program, *e.g.* `cout`, it is already defined in `iostream` library; so when we include `iostream`, we cannot declare `cout` as variable.
- It is best practice to declare a variable closer to where we first use it, not at the top.

```c++
int age; // uninitialized
int age=24; // C-like initialization
int age(24); // constructor-like
int age{21}; // C++ list initialization, will help catch errors in compile time, e.g. overflow
int age{}; //this will initialize the variable to zero
// initializing multiple variables in a single statement, using list initialization
int var1{}, var2{}, var3{};
```

### Data Types
- `float`
    - precise to 7 decimal points
    - $1.2\times {10}^{-38}$ to $3.4\times {10}^{38}$
    - 4 bytes
- `double`
    - precise to 15 decimal points
    - $2.2\times {10}^{-308}$ to $1.8\times {10}^{308}$
    - 8 bytes
- `long double`
    - precise to 19 decimal points
    - $3.3\times {10}^{-4932}$ to $1.2\times {10}^{4932}$
    - 12/16 bytes (machine specific)
- `bool`
    - 1 byte

**Fun Fact**
- C++ considers character in single quotes as `char` and double quotes as `string`.
- From C++14, we can use quote inside large numbers to make them more readable (e.g. `123'456'789`).
- The compiler ignores the quotes and creates the actual number.
- C++ normally prints `0` for `false` and `1` for `true`.
- To show `true`/`false` instead of `1`/`0`, use `cout << std::boolalpha`.
- To return to `1`/`0` format, say `cout << std::noboolalpha`.

### Global/Local Variables
- When we mention a variable, the compiler first tries to find it in the local scope.
- If there is one, that is used, otherwise searches in the global scope.
- Global variables are automatically initialized to 0.

## Constants
- Once declared, values cannot be changed.

### Literal Constants
- actual literals e.g. `69`, `6.9`, `"Anna"`, `'F'`.
- Integer literals can be assigned specific type.

```c++
12 // int
12U / 12u // unsigned int
12L / 12l // long int
12LL / 12ll // long long int
// float literals have F, L
```

### Enumerated Constants
- using `enum` keyword.

### Defined Constants
- using `#define` preprocessor.
- No type-checking is involved.
- Better not to use, since hard to find errors.

### Declared Constants
- using `const` keyword (e.g. `const double pi=3.14`).
- Values have to be initialized during declaration, otherwise will cause error.
- Trying to change value later will cause compiler error.

### Constant Expressions

### Special Constants
`__cplusplus` is a `long int` that tells which version of compiler is being used, e.g. if `std=c++17` is defined, then it will show `201703`, meaning C++17 standard.

## Type casting

### Coersion
- automatic type casting, performed by the compiler when there is a type mismatch.
- If it cannot upgrade or downgrade an operand of an operator, it throws an compiler error.

### Explicit casting
- done by the programmer.

```c++
(double)int_var // C-style, just assumes that the variable can be cast to the specified type
// C++ has 4 casting methods
// static cast
static_cast<double>(int_var) // checks if it is possible to cast
// dynamic cast
// reinterpret cast
// there is another method which I do not remember
```