# Conditional Logic

## `CASE`
- The `CASE` expression goes through conditions and returns a value when the first condition is met.
- It allows us to perform conditional logic directly within our `SELECT` statement.
- So, once a condition is true, it will stop reading and return the result.
- If no conditions are true, it returns the value in the `ELSE` clause.
- If there is no `ELSE` part and no conditions are true, it returns `NULL`.

### Simple `CASE` expression
- Compares an expression to a set of simple expressions to determine the result.
- It is like a `switch`-`case` statement in programming languages.

```sql
-- ANSI
SELECT
    FirstName,
    LastName,
    Department,
    CASE Department  -- The input value
        WHEN 'IT' THEN 'Information Technology'
        WHEN 'Sales' THEN 'Sales and Marketing'
        WHEN 'HR' THEN 'Human Resources'
        ELSE 'Other'
    END AS FullDepartmentName
FROM Employees;
```

### Searched `CASE` expression
- Evaluates a set of Boolean expressions to determine the result.
- It is like an if-then-else statement.

```sql
-- ANSI
SELECT
    FirstName,
    LastName,
    Salary,
    CASE
        WHEN Salary >= 90000 THEN 'Rich'
        WHEN Salary >= 70000 THEN 'Middle'
        WHEN Salary >= 60000 THEN 'Poor'
        ELSE 'Broke'
    END AS SalaryBand
FROM Employees;
```

### `DECODE`
- This is Oracle's legacy function that achieves the same result as a simple `CASE`.

```sql
SELECT
    FirstName,
    LastName,
    Department,
    DECODE(Department,
        'IT', 'Information Technology',
        'Sales', 'Sales and Marketing',
        'HR', 'Human Resources',
        'Other'  -- This is the final "else" value
    ) AS FullDepartmentName
FROM Employees;
```

### Ordering

```sql
SELECT
    EmployeeID,
    FirstName,
    LastName,
    Department
FROM Employees
ORDER BY
    CASE
        WHEN Department IS NULL THEN 1 -- Puts NULLs at the end
        ELSE 0
    END,
    Department ASC, -- Sorts the non-NULL group by department
    EmployeeID ASC; -- Sorts the NULL group by ID
```

### Resources
- [SQL CASE Expression](https://www.w3schools.com/sql/sql_case.asp)
- [CASE (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/case-transact-sql?view=sql-server-ver17)
- [CASE Statement](https://docs.oracle.com/cd/B13789_01/appdev.101/b10807/13_elems004.htm)

## `COALESCE`
- An ANSI-SQL standard function
- It returns the first non-null argument.
- If all the parameters are `NULL`, then returns `NULL`.
- Useful for handling `NULL` values and substituting them with a default value.
- Instead of replacing `NULL` values at the application level, it handles them upon data retrieval.
- SQL Server has more specific `ISNULL()` and Oracle has `NVL()`.
- It is almost always better to use `COALESCE` instead of `ISNULL` or `NVL`, because it is the standard and is more flexible.

```sql
SELECT
    FirstName,
    LastName,
    Department,
    COALESCE(Department, 'Unassigned') AS DisplayDepartment
FROM Employees;
```

## `NULLIF`
- Compares two expressions. If the expressions are equal, it returns `NULL`, otherwise, it returns the first expression.
- It's essentially the opposite of `COALESCE`. While `COALESCE` replaces `NULL` with a value, `NULLIF` converts a value into `NULL`.

**Use cases**
- Preventing Division-by-Zero Errors
- Converting Placeholders to `NULL`

```sql
-- ANSI
SELECT NULLIF(4,4) AS Same, NULLIF(5,7) AS Different;

SELECT
    FirstName,
    TotalSales,
    UnitsSold,
    TotalSales / NULLIF(UnitsSold, 0) AS AvgPrice -- if UnitsSold is 0, the result will be NULL, instead of causing exception
FROM Employees;
```

**Reading**
- [NULLIF (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/nullif-transact-sql?view=sql-server-ver17)
- [SQL Server NULLIF() Function](https://www.w3schools.com/sql/func_sqlserver_nullif.asp)
- [NULLIF() Function in SQL Server](https://www.geeksforgeeks.org/sql/nullif-function-in-sql-server/)
- [NULLIF](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/NULLIF.html)

## `GREATEST`
- returns the largest value from a list of expressions.
- compares each expression and returns the one with the highest value, while considering case sensitivity.

```sql
SELECT GREATEST('XYZ', 'xyz') FROM dual;
```

## `LEAST`
- returns the smallest value from a list of expressions.

```sql
SELECT LEAST('XYZ', 'xyz') FROM dual;
```

## Resources
- [SQL | Conditional Expressions](https://www.geeksforgeeks.org/sql/sql-conditional-expressions/)
- [Conditional Statements, Logic, and Expression in SQL: Understanding the Differences](https://medium.com/@ejirogabriell2019/conditional-statements-logic-and-expression-in-sql-understanding-the-differences-451ec183c81a)
- [How to Execute an IF…THEN Logic in an SQL SELECT Statement](https://www.baeldung.com/sql/select-conditional-logic)
- [Mastering Conditional Logic with IF and CASE Statements in SQL](https://codesignal.com/learn/courses/advanced-query-techniques-and-conditional-logic-in-sql/lessons/mastering-conditional-logic-with-if-and-case-statements-in-sql)