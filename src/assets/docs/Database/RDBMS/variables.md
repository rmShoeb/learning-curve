# 07 - Variables

## What is a Variable?
- A named object that can store a specific type of data (`INT`, `VARCHAR`, `DATE`, *etc.*).
- These are placeholders used to store temporary data during the execution of a batch of code.
- Can be used in stored procedures, user-defined SQL functions, dynamic SQL, batches, and scripts.
- They can significantly simplify the SQL logic.

## Benefits
- **Enhanced readability:** By assigning meaningful names to values, statements become easier to understand.
- **Increased reusability:** Reuse a specific value across multiple parts of the statement.
- **Improved performance:** Improve execution efficiency by reducing redundancy.

## Use Cases
- **Parameterized queries:** Variables support the creation of dynamic, flexible, and reusable queries. By specifying variables in a query and using them as arguments, we can customize their values at runtime. This makes the resulting data adaptable and responsive to different inputs. The usage of parameterized queries is one of the primary ways to squash SQL injection too because parameterized queries provide the query and the user input to the database separately and not as a whole.
- **Store intermediate results:** Variables can hold temporary data or calculation results within a function or stored procedure. That simplifies complex logic and facilitates further processing without recalculating values.
- **Control flow:** Variables helps to manage the flow of execution in procedural SQL by storing values that can control conditional logic, loops, and decision-making processes.

## Usage
- SQL variables are not a formal part of the ISO/ANSI SQL standard.
- So the syntax for declaring and using variables varies between database systems, though not all relational databases support them.
- Values can be assigned to variables using the `SET` statement or the `SELECT INTO` statement or as a default value when the variable is declared.
- Literals, expressions, the result of a query, and special register values can be assigned to variables.

**SQL Server**
```sql
-- create single variable
DECLARE @MyCounter INT;
-- create multiple variables in a single statement
DECLARE @FirstName NVARCHAR(30), @MiddleName NVARCHAR(20), @LastName NVARCHAR(30);
-- initialize a variable
DECLARE @EMP_ID INT = 0;
-- set a value
SET @MyCounter = 13;
SELECT @FirstName = first_name FROM EMPLOYEE WHERE EMP_ID = @EMP_ID;
```

**Oracle**
```sql
DECLARE
    v_hiredate DATE;
    v_location VARCHAR2(15) := 'Paris';
    v_deptno NUMBER(2) NOT NULL := 8;
    eid CONSTANT NUMBER := 42;
BEGIN
    -- Use variables here
    v_deptno := 1234;
    DECLARE
        -- local variables
    BEGIN
        -- local variables can be used here
    SELECT hired_on, address INTO v_hiredate, v_location FROM EMPLOYEE WHERE emp_id = eid;
```

## Scope
- The scope of an SQL variable depends on the database management system and the context in which it is defined.
- Typically, the scope of a variable goes from the point it is declared to the end of the batch or stored procedure it lives in.

## Resources
- [SQL Variable: What It Is and How To Use It](https://www.dbvis.com/thetable/sql-variable-what-it-is-and-how-to-use-it/)
- [SQL Variables: Basics and usage](https://www.sqlshack.com/sql-variables-basics-and-usage/)
- [Variables in SQL procedures (`DECLARE`, `SET` statements)](https://www.ibm.com/docs/en/ias?topic=SSHRBY/com.ibm.swg.im.dashdb.apdv.sqlpl.doc/doc/c0020497.htm)
- [PL/SQL - Variables](https://www.tutorialspoint.com/plsql/plsql_variable_types.htm)