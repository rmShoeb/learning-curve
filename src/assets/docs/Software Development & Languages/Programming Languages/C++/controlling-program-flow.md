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