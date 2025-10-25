# C++


# Introduction

##  To compile a code

```bash
# to compile a program
g++ hello.cpp -Wall -std=c++17 -o hello
# to run the compiled program
./hello
./hello < input.txt
./hello < input.txt > output.txt
```

- The filename (in this case `hello.cpp`) is the mandatory parameter. It is the source code to be compiled.
- `-Wall` is an optional parameter, which tells the compiler to show all the warnings.
- `-std=c++17` is an optional parameter, which tells the compiler which C++ standard to use. Here, C++17 is used.
- `-o` tells the compiler to create an object file. This requires a name for the object file. `hello` is the name for the object file in this case.

## Preprocessor Directive
This processes the source code before it goes to the compiler, removes all comments and replaces them with a single space. Begins with a `#`. When the preprocessor sees this, it replaces with the file the directive is referring to. Conditional directives can be used to compile certain parts of the code.

It does not understand any C++ code. That is the job of the compiler.

## Keywords
https://en.cppreference.com/w/cpp/keyword

## Identifiers
- This is something a programmer defines.
- There are conventions to follow when defining an identifier.
- `include`, `main`, variables and constants are identifiers.

## The `main` function
- There has to be one and only one `main` function in a project.
- This is the starting point of the program execution.
- To execute a C++ program, the OS calls the `main()` function.
- There are two versions.

**Without Parameter**
This version does not expect anything from the operating system.

```c++
int main() {
    /** code **/
    return 0;
}
```

**Without Parameter**
- This version expects something from the operating system.
- `argc` is the argument count and `argv` is the argument vector.
- This version is used in command line programs.
- Only the arguments are passed after the program, *e.g.* `program.exe argument1 argument2 ...`

```c++
int main(int argc, char* argv[]) {
    /** code **/
    return 0;
}
```

- `main()` must return an integer.
- If the value is `0`, then the operating system understands that the program executed successfully.
- If the value is something other than `0`, then the Operating System uses that value to understand what went wrong.

## Namespaces
- As there are numerous libraries (system and custom), there is always a chance that same name
has been defined in multiple libraries.
- When that name is called, C++ does not understand which definition to use. This is called naming conflict.
- This is where namespace come in. In every module, a namespace is defined and name are defined under it.
- So, while using any names, we incorporate that namespace to clarify the usage.
- `using namespace NAMESPACE` tells the compiler that we will be using that `NAMESPACE` without mentioning it later anymore.
- But there is a problem. It will import all names under the `NAMESPACE`, which can create conflict when the program is large.
- There is another way to resolve conflict.

```c++
using std::cin; // :: is the scope resolution operator
using std::cout;
```
- This tells the compiler that we will be using exactly these names from this namespace.

---

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


# Arrays and Vectors

## Arrays

```c++
// declaration
int arr[100];
// initialization
int arr[5]{1,2,3,4,5};
int arr[5]{1,2,3}; // rest of the elements will be initialized to 0
int arr[]{1,2,3,4,5,6,7}; // array size will be calculated automatically
int arr[100]{0}; // all elements will be initialized to 0
```

- C++ does not do any bound calculation, i.e. if array size is 5 and we try to access 10th location, it does not stop us from doing so, although this kind of operation outputs garbage value.
- If we try to store something outside of bound of array, the program will most likely crash, although it depends on the running operating system.

### Multidimensional Arrays
- Although there are no limits to dimensions in C++, some compilers impose limits, but they are high enough.

```c++
// initialization
int movie_review[2][3]{
    {1,2,3},
    {1,2,3}
}
```

## Vectors
- Vector type is part of the standard library.

```c++
#include <vector>
using namespace std;
// or
using std::vector;
// declaration
vecto<int> vec;
vector<char> vowels(5); // constructor initialization, allows space for 5 chars. values are automatically set to 0
//initialization
vector<char> vowels{'a', 'e', 'i', 'o', 'u'}; // size is set automatically according to the number of elements
vector<double> temps(365, 8.0); // first parameter tells how many elements there will be. second parameter says the default value for all the elements.
```

- Like array, memory locations are contiguous in vector.
- If square brackets are used for accessing elements, then vector provides no bounds checking. But it provides functions for bound checking.

```c++
vec.at(index);
cin >> vec.at(0);
vec.at(0) = 95;
```

- When the `.at()` is used and we try to access an out of bound memory, it throws an `std::out_of_bound exception` exception (captured at runtime), which doesn’t happen in array indexing.
- The program does crash though, if exceptions are not handled.

```c++
// to increase the vector size
vec.push_back(96);
// 2D-vector
vector<vector<int>> vec{
    {1,2,3,4},
    {1,2,3,4}
};
// access elements
vec[0][1];
vec.at(0).at(1);
```

### The `size()` method
- The `size()` method of vector returns an unsigned integer.
- So, if this is compared with a variable of type other than unsigned integer (e.g. `i < vec.size(); // i is int`), some compilers give a warning.


# Input/Output

## Basic I/O

### `std::cin`
- to read stream of data from console using keyboard.
- Space, tabs and newlines are terminators. So, space separated inputs are considered as different inputs.
- This is why `cin` cannot read long space-separated strings. To get around this problem, we will have to use other operators/methods than the extraction operator.
- Since, `cin` reads data from buffer, if there is anything in the buffer, it won’t wait for keyboard input, and read whatever there is in the buffer until it finds a terminator.

### `std::cout`
- `std::endl` flushes the stream.
- If the stream is buffered, it may not get written in the terminal until it is flushed. This is important for file I/O.


# Pointers


# Statements and Operators

## Expression
- The most basic building block of a C++ program.

## Statement
- A complete line of code that performs some action.

**Null Statement**

```c++
;
```

## The Assignment Operator
- There are two terms associated to assignment operator, l-value and r-value.
- l-value denotes the location of the an expression, and is used when the expression is on the left hand side of the assignment operator.
- r-value denotes the value of the an expression, and is used when the expression is on the right hand side of the assignment operator.
- Literal constants do not have l-value.

```c++
/* multiple assignment in one statement */
num1 = num2 = 100;
```

**Complex Assignments**
```c++
l_opd = l_opd oprt r_opd; can be written as l_opd oprt= r_opd; e.g.
a += b; // means a = a+b
a += b*c; // means a = a+(b*c)
```

## Arithmetic Operators
- All the operators, except the modulo operator, is overloaded, i.e. they can be used with multiple types (e.g. `int`, `float`, `double` etc.), whereas the modulo operator works only with integers.

**Increment Decrement Operator**
Never use it twice for same variable in the same statement.

## Relational Operators
- C++20 has a new three-way operator `<=>`, which evaluates to 0 if the operands are equal, less than 0 if the left-hand operand is greater, and greater than 0 if the right hand side is greater.

## Logical Operators
- Precedence: `not` > `and` > `or`

|  | keyword | symbol |
|:--------:|:--------------:|:-------:|
| Logical AND | `and` | `&&`   |
| Logical OR | `or` | `\|\|` |
| Logical NOT | `not` | `!`    |

## Operator Precedence
https://en.cppreference.com/w/cpp/language/operator_precedence

---

# Controlling Program Flow

**Dangling `else`**
- An `else` statement always connects itself to the closest `if` statement.

## `switch` statement

```c++
switch(int_control_expr){
    case expr_1:
        stmnt_1;
        break;
    case expr_2:
        stmnt_2;
        break;
    default:
        default_stmnt;
}
```

- `int_control_expr` has to be an integer, or equivalent.
- `case` blocks usually donot need curly braces, but is required when variables are declared in the block.
- `break` statements in `case` blocks are optional, but it is good practice to include it in all `case` blocks.
- `case` expressions must be constants or literals. When a match is found, all the blocks are executed until a `break` statement is found.
- `default` block is optional, It is best practice to include one. They do not need `break` statements, since they are at the bottom.
- When using `enum` types in `switch` expressions, either all enumeration values have to be handled, or a `default` block has to be included. Otherwise, the compiler will raise warnings.

## Conditional Operator
- This is a ternary operator. Very useful when used inline but also easy to abuse.
- Best practice is to never nest this operator.

```c++
// Syntax:
(cond_expr) ? expr_1 : expr_2;
// example:
result = (b!=0) ? (a/b):0;
```

## Looping

### `for` loop
- Iterate a specific number of times.
- We can use initialization styles for variable declaration in for loop expression, i.e. `for(int i{0}; i<10; i++){}`
- Comma operator: used to separate multiple expressions in for loop, e.g. `for(int i{0}, j{1}; i<10; i++, j++){}`

### Range-based `for` loop
- iterate every element in a range or collection.
- the iterator has to be of same data type as the range or collection.

```c++
int scores[] {100, 90, 80};
for(int score: scores){
    cout << score;
}
```

- The auto keyword can be used to instead of specifying the data type. The data type will be deduced at compile time according to the range or collection.

```c++
int scores[] {100, 90, 80};
for(auto score: scores){
    cout << score;
}
```

An initializer list can be provided in the loop itself, e.g. for(auto score: {100, 90, 80})

### `while` loop
- iterate while a condition remains true.
- stop when the condition becomes false.
- check the condition at the beginning of every iteration.

### do while loop
- same as `while` loop, except checks the condition at the end of every iteration.



# Classes and Objects



# Libraries

## `algorithm`
- The header `<algorithm>` defines a collection of functions especially designed to be used on ranges of elements.
- A range is any sequence of objects that can be accessed through iterators or pointers, such as an array or an instance of some of the STL containers.
- Notice though, that algorithms operate through iterators directly on the values, not affecting in any way the structure of any possible container (it never affects the size or storage allocation of the container).

### Non-modifying sequence operations

**`find(first, last, val)`**
- `first`: iterator to the initial position in a sequence.
- `last`: iterator to the final position in a sequence.
- `val`: value to search for in the range.
- Returns: An iterator to the first element in the range that compares equal to `val`. If no elements match, the function returns last.
```c++
it = find (myvector.begin(), myvector.end(), 30);
if (it != myvector.end())
    std::cout << "Element found in myvector: " << *it << ’\n’;
else
    std::cout << "Element not found in myvector\n";
```

### Modifying sequence operations

**`transform(first1, last1, result, UnaryOperator op)`**
- `first1`: iterator to the initial position of the first sequence.
- `last1`: iterator to the final position of the first sequence.
- `result`: iterator to the initial position of the sequence where the result will be stored.
- `op`: This can either be a function pointer or a function object.

```c++
std::transform (foo.begin(), foo.end(), bar.begin(), op_increase); // op_increase is a user-defined function
// std::plus adds together its two arguments:
std::transform (foo.begin(), foo.end(), bar.begin(), foo.begin(), std::plus<int>());
```

### Partitions
### Sorting
### Binary Search

## `cctype`

### Character classification functions

### Character conversion functions

**`tolower(c)`**
- `c`: Character to be converted, casted to an `int`, or `EOF`.
- Returns: The lowercase equivalent to `c`, if such value exists, or `c` (unchanged) otherwise. The value is returned as an `int` value that can be implicitly casted to `char`.

**`toupper(c)`**
- Similar to `tolower(c)`.

## `cfloat`
- contains information about floating point numbers.
- also has the same functionalities of `climits`

## `climits`

```c++
// contains information about data types for the compiler
INT_MAX -> maximum possible value in int
INT_MIN -> minimum possible value in int
```

## `initializer_list`

```c++
int m = std::max({a, b, c});
```

## `iomanip`

- for I/O manipulation
```c++
cout << fixed << setprecision(2); // sets double and float precision to 2-digits
```