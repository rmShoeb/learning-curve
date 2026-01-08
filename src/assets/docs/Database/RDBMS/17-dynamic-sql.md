# Dynamic SQL

## What is Dynamic SQL?
- It is an SQL programming technique that allows us to construct and execute SQL statements at runtime.
- Unlike static SQL, where queries are fixed during the development phase, dynamic SQL enables us to build flexible and general-purpose SQL queries that adapt to varying conditions.
- These statements are often used when the exact SQL query cannot be determined during the development phase, such as when working with user inputs.
- It allows us to write more flexible and adaptive queries that can respond to different input, conditions, and logic during execution.
- With dynamic SQL, we create SQL statements as strings and execute them using special execution functions or constructs.

## Why Use It?
- **Flexibility:** Building queries based on user input, like a search page with optional filters.
- **Generality:** Writing "one query" that can act on different tables or columns (*e.g.*, `TRUNCATE TABLE @tableName`).

## Syntax

```sql
-- SQL Server
DECLARE @SQL nvarchar(1000);
DECLARE @PID varchar(50) = '14';
DECLARE @tableName NVARCHAR(100) = 'country';
DECLARE @filterColumn NVARCHAR(100) = 'country_id';

-- concatenated query
SET @SQL = 'SELECT * FROM country c WHERE c.country_id = '+ @PID;
EXEC (@SQL);

-- parameterized query
SET @SQL = 'SELECT * FROM country c WHERE c.country_id = @PID';
EXECUTE sp_executesql @SQL, N'@PID NVARCHAR(75)', @PID = @PID; -- sp_executesql is a stored procedure

SET @SQL = 'SELECT * FROM ' + QUOTENAME(@tableName) + ' WHERE ' + QUOTENAME(@filterColumn) + ' = @PID';
EXECUTE sp_executesql @SQL, N'@PID NVARCHAR(75)', @PID = @PID;
```

|country_id|country_name|indep_year|continent|
|----------|------------|----------|---------|
|14|Ireland|1922|Europe|

## Issues & Best Practices
- Performance Issues
    - Since the SQL query is built and processed at runtime, it can take longer due to additional parsing and compiling steps.
    - Parameterized dynamic SQL (`sp_executesql`) can reuse execution plans, while `EXEC()` often cannot (leading to "plan cache bloat").
- Security Risks
    - If user inputs are not properly handled, it opens the door to SQL Injection attacks, which can compromise the database.
    - It is best to use parameterized query to prevent the SQL injection possibility.
    - User inputs should always be sanitized and validated.
- Harder to Debug: Debugging dynamic queries is more complex, as they are not predefined in the code and can change based on runtime conditions.
- Using dynamic SQL should be minimum, to avoid complexity and performance issues. Should be used when absolutely necessary.

## Resources
- [Dynamic SQL](https://www.geeksforgeeks.org/sql/dynamic-sql/)
- [Dynamic SQL: Techniques, Security, and Optimization](https://www.datacamp.com/tutorial/dynamic-sql)
- [Dynamic SQL in SQL Server](https://www.sqlshack.com/dynamic-sql-in-sql-server/)
- [Dynamic SQL: Building Queries at Runtime for Flexibility and Efficiency](https://vishnutr.medium.com/dynamic-sql-building-queries-at-runtime-for-flexibility-and-efficiency-634cdf4bccc7)