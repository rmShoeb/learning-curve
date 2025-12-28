# 15 - Functions

- SQL functions are prewritten actions that can be called on a cell, record or database to flexibly manipulate and extract information for further analysis.
- It is a named, reusable block of code that we can "call" to perform a specific task.
- They encapsulate a calculation or logic that can be reused easily.
- Its primary purpose is to take zero or more input parameters, perform a calculation, and return a single result.

**Key Characteristics:**
- Must return a value (either a single scalar value or a table).
- Can be used directly in `SELECT` statements (*e.g.*, `SELECT dbo.CalculateSalesTax(Price) FROM Products;`).
- Cannot modify data (`INSERT`, `UPDATE`, `DELETE`).

## Built-in Functions
These are functions that come pre-packaged with the database.

### Scalar Functions
- These functions operate on a single input value and return a single output value.
- String Functions: `UPPER()`, `LOWER()`, `SUBSTRING()`, `TRIM()`, `LEN()`
- Date/Time Functions: `GETDATE()`, `CURRENT_TIMESTAMP`, `DATEPART()`, `DATEDIFF()`
- Math Functions: `ROUND()`, `FLOOR()`, `ABS()`, `POWER()`

```sql
SELECT UPPER(country_name) FROM country;
```

### Aggregate Functions
- These are a special type of system function.
- They operate on a set of rows (a group) and return a single summary value for that group.
- Examples: `COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`

```sql
SELECT continent, COUNT(*)
FROM country GROUP BY continent;
```

## User-defined Functions

**Why use them?**
- *Code Reusability:* Write complex logic once, use it in many queries.
- *Consistency:* Ensure the same calculation is applied identically across the whole system.
- *Readability:* Replace a messy 10-line calculation in a `SELECT` statement with a single function name.

### Scalar Functions
- Takes one or more inputs and returns exactly one single "scalar" value (*e.g.*, a number, a string, a date).

**SQL Server**

```sql
-- Create a function to calculate years since independence
CREATE FUNCTION dbo.fn_YearsSinceIndep (@CountryID INT)
RETURNS INT
AS
BEGIN
    DECLARE @Years INT;
    SELECT @Years = (YEAR(GETDATE()) - indep_year)
    FROM country
    WHERE country_id = @CountryID;
    
    RETURN @Years;
END;
GO

-- Usage:
SELECT country_name, dbo.fn_YearsSinceIndep(country_id) AS Age
FROM country;
```

> In SQL Server, using a Scalar UDF in a `SELECT` statement with millions of rows can be very slow. This is because the database engine may have to "context switch" between the SQL engine and the Function engine for every single row. Whenever possible, try to use Table-Valued Functions or standard `JOIN` for better performance.

**Oracle**

```sql
CREATE OR REPLACE FUNCTION fn_YearsSinceIndep (p_country_id IN NUMBER)
RETURN NUMBER
IS
    v_years NUMBER;
BEGIN
    SELECT (EXTRACT(YEAR FROM SYSDATE) - indep_year)
    INTO v_years
    FROM country
    WHERE country_id = p_country_id;
    
    RETURN v_years;
END;
/

-- Usage:
SELECT country_name, fn_YearsSinceIndep(country_id) AS Age 
FROM country;
```

### Table-Valued Functions
- These returns an entire result set (rows and columns) instead of a single value.

**SQL Server**
```sql
CREATE FUNCTION dbo.fn_GetLeadersByContinent (@Cont VARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT p.president AS LeaderName, 'President' AS Role, c.country_name
    FROM presidents p JOIN country c ON p.country_id = c.country_id
    WHERE c.continent = @Cont
    UNION ALL
    SELECT m.monarch, 'Monarch', c.country_name
    FROM monarchs m JOIN country c ON m.country_id = c.country_id
    WHERE c.continent = @Cont
);
GO

--usage
SELECT * FROM dbo.fn_GetLeadersByContinent('Europe');
```

**Oracle**
```sql
-- 1. Define the row structure
CREATE OR REPLACE TYPE t_LeaderRow AS OBJECT (
    leader_name VARCHAR2(150),
    role VARCHAR2(50),
    country_name VARCHAR2(100)
);
/
-- 2. Define the table type
CREATE OR REPLACE TYPE t_LeaderTable AS TABLE OF t_LeaderRow;
/
-- 3. Create the Pipelined function
CREATE OR REPLACE FUNCTION fn_GetLeadersByContinent (p_cont IN VARCHAR2)
RETURN t_LeaderTable PIPELINED
IS
BEGIN
    FOR r IN (SELECT p.president, c.country_name FROM presidents p JOIN country c ON p.country_id = c.country_id WHERE c.continent = p_cont)
    LOOP
        PIPE ROW(t_LeaderRow(r.president, 'President', r.country_name));
    END LOOP;
    RETURN;
END;
/

-- usage
SELECT * FROM TABLE(fn_GetLeadersByContinent('Europe'));
```

## Managing Functions

**Create/Modify**
- SQL Server Uses `CREATE FUNCTION` for creating and `ALTER FUNCTION` for modification.
- Oracle simply uses `CREATE OR REPLACE FUNCTION`.

**Delete**
```sql
DROP FUNCTION function_name;
```

**Query Functions**
```sql
-- SQL Server:
SELECT name, type_desc 
FROM sys.objects 
WHERE type IN ('FN', 'IF', 'TF'); -- Scalar, Inline TVF, Table TVF

-- Oracle:
SELECT object_name 
FROM user_objects 
WHERE object_type = 'FUNCTION';
```

## Resources
- [SQL Functions With Examples](https://builtin.com/software-engineering-perspectives/sql-functions)
- [SQL Functions (Aggregate and Scalar Functions)](https://www.geeksforgeeks.org/sql/sql-functions-aggregate-scalar-functions/)
- [Creating SQL scalar functions](https://www.ibm.com/docs/en/db2/11.5.x?topic=functions-creating-sql-scalar)
- [SQL Window Functions](https://mode.com/sql-tutorial/sql-window-functions)

## Further Reading
- [SQL Functions - Oracle](https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions001.htm)
- [What are the SQL database functions?](https://learn.microsoft.com/en-us/sql/t-sql/functions/functions?view=sql-server-ver17)
- [Query Language (SQL) Functions - PostgreSQL](https://www.postgresql.org/docs/current/xfunc-sql.html)