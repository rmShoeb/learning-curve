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