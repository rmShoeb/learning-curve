# 01 - Introduction

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