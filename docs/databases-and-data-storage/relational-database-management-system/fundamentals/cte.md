# Common Table Expressions (CTE)

- It is the result set of a query which exists temporarily and for use only within the context of a larger query.
- A temporary, named result set that we can reference within another SQL statement.
- Much like a derived table, the result of a CTE is not stored and exists only for the duration of the query.
- These are like database views and derived tables, like creating a temporary, single-query-use view.
- They enable users to more easily write and maintain complex queries via increased readability, simplification, and enable recursive operations.

**Example use cases**
- Needing to reference a derived table multiple times in a single query
- Performing the same calculation multiple times over across multiple query components

**Why Use CTEs?**
- *Reusability:* Help us to refer to the same subquery multiple times.
- *Readability:* Breaks a complex query into simple, logical, manageable building blocks.
- *Maintainability:* Easier to debug and modify named blocks of logic.
- *Recursion:* CTEs can reference themselves, allowing us to query hierarchical data (like an organizational chart).

**Limitations**

While CTEs are excellent for readability, they have important limitations, especially regarding performance.

*Scope*
- A CTE exists only during the execution of the query.
- Once the query completes, the CTE is discarded.
- It only exists for the single statement (`SELECT`, `INSERT`, `UPDATE`, or `DELETE`) that immediately follows it.
- We cannot define a CTE and then try to reference it in a second, separate query. We must use a `VIEW` or `#temp` table (SQL Server) / `GLOBAL TEMPORARY TABLE` (Oracle) for that.

```sql
-- Incorrect (Fails in Both):
WITH MyCTE AS (
    SELECT * FROM country WHERE continent = 'Europe'
)
-- This query works
SELECT * FROM MyCTE;

-- This query will FAIL because the CTE no longer exists
SELECT * FROM MyCTE WHERE country_name = 'Germany';
```

*No Indexing*
- We cannot create an index on a CTE; it is not a physical table, rather an in-memory expression.
- If the CTE generates a very large result set (*e.g.*, millions of rows) that the main query then has to join or filter, the lack of an index can be a severe performance bottleneck.
- If it is really needed to repeatedly query a large intermediate result set, it is almost always faster to output the CTE's data into a Temporary Table (`#temp` or `GLOBAL TEMPORARY TABLE`) and create indexes on that.

*Special performance issue in SQL Server*
- If we reference a CTE multiple times, Oracle (and PostgreSQL/MySQL) database's optimizer can "materialize" the results (run the CTE once and store its results in a temporary space). This is efficient.
- However, SQL Server's optimizer treats CTE as a "syntactic sugar" for a subquery.
- It re-runs CTEs every time they are referenced.
- So, for complex logic, and/or large data is best to put the result in a temporary table, instead of using a CTE.

*Some operations, such as `INSERT` and `UPDATE`, may have restrictions when using CTEs in certain databases.*

## Syntax

```sql
WITH PM_Term_Counts AS (
    -- Step 1 (CTE): Count terms for each PM ID
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
)
-- Step 2 (Main Query): Join the CTE with other tables
SELECT c.country_name, pm.pm_name, ptc.TermCount
FROM prime_ministers pm
JOIN country c ON pm.country_id = c.country_id
JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id
ORDER BY c.country_name;
```

**Output:**

|country_name|pm_name|TermCount|
|------------|-------|---------|
|Canada|Justin Trudeau|1|
|Canada|Stephen Harper|1|
|India|Narendra Modi|2|
|India|Jawaharlal Nehru|1|
|Ireland|Simon Harris|1|
|Japan|Fumio Kishida|1|
|Japan|Shinzo Abe|1|
|South Africa|Thabo Mbeki|2|
|United Kingdom|Rishi Sunak|1|
|United Kingdom|Winston Churchill|2|
|United Kingdom|Margaret Thatcher|1|

```sql
WITH
-- CTE 1: Count the terms for each individual PM
PM_Term_Counts AS (
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
),
-- CTE 2: Link PMs to their continent and their term count
-- This CTE references the first CTE (PM_Term_Counts)
PM_Continent_Data AS (
    SELECT c.continent, pm.pm_id, ptc.TermCount
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id
)
-- Main Query: Aggregate the results from the second CTE
SELECT continent, COUNT(pm_id) AS TotalPMs, AVG(CAST(TermCount AS DECIMAL(5, 2))) AS AvgTermsPerPM
FROM PM_Continent_Data
GROUP BY continent
ORDER BY continent;
```

**Output:**

|continent|TotalPMs|AvgTermsPerPM|
|---------|--------|-------------|
|Africa|1|2.000000|
|Asia|4|1.250000|
|Europe|4|1.250000|
|North America|2|1.000000|

```sql
-- Find all prime ministers who have served more terms than the average term count of prime ministers of the United Kingdom
WITH PM_Term_Counts AS (
    -- get the term count for every PM
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
)
-- Main Query
SELECT c.country_name, pm.pm_name, ptc.TermCount
FROM prime_ministers pm
JOIN country c ON pm.country_id = c.country_id
JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id  -- <-- Reference 1
WHERE ptc.TermCount > (
        -- Subquery to find the UK's average PM term count
        SELECT AVG(UK_Counts.TermCount)
        FROM PM_Term_Counts UK_Counts  -- <-- Reference 2
        JOIN prime_ministers UK_PM ON UK_Counts.pm_id = UK_PM.pm_id
        JOIN country UK_C ON UK_PM.country_id = UK_C.country_id
        WHERE UK_C.country_name = 'United Kingdom'
);
```

**Output:**

|country_name|pm_name|TermCount|
|------------|-------|---------|
|United Kingdom|Winston Churchill|2|
|India|Narendra Modi|2|
|South Africa|Thabo Mbeki|2|

**Reading**
- [What Is a CTE in SQL Server?](https://learnsql.com/blog/cte-in-sql-server/)

## Types of CTEs

### Non-Recursive CTE
- This is the most common type.
- We define one or more CTEs and then use them in a final query.
- All the SQL above are non-recursive.

**Reading**
- [Guidelines for nonrecursive common table expressions](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql?view=sql-server-ver17#guidelines-for-nonrecursive-common-table-expressions)

### Recursive CTE
- A CTE that calls itself to process hierarchical or graph-like data.
- It iteratively processes data, returning results step by step until a termination condition is met.
- It consists of two main parts:
    - *Anchor Member:* The part that defines the base query that starts the recursion.
    - *Recursive Member:* The part that references the CTE itself, allowing it to perform the "recursive" operations. Here, we add new rows to the rows that have already been computed.
- The recursive member and anchor members must have the same number of columns and the same data types corresponding columns.
- In SQL Server, when combining the anchor member and recursive member, using `UNION ALL` is a must; `UNION` is not allowed.
- An example use case is to display an entire organizational hierarchy, starting from the CEO.

```sql
-- find all direct and indirect reports for a specific manager
WITH EmployeeHierarchy AS (
    -- Anchor member: select the top-level manager
    SELECT EmployeeID, EmployeeName, ManagerID, 1 AS Level
    FROM Employees
    WHERE EmployeeID = 1  -- Starting with the top-level manager
    UNION ALL
    -- Recursive member: find employees who report to the current managers
    SELECT e.EmployeeID, e.EmployeeName, e.ManagerID, eh.Level + 1
    FROM Employees e
    INNER JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT EmployeeID, EmployeeName, Level
FROM EmployeeHierarchy;
```

**Restrictions on Recursive CTEs**
- Recursive CTEs are powerful, but they are highly restricted.
- The "recursive member" (the part that references itself) has strict rules: cannot use `GROUP BY`, `DISTINCT`, `HAVING`, aggregate functions (like `SUM`, `AVG`, `COUNT`).
- In SQL Server, the default recursion limit is 100, though it is possible to set it higher with `OPTION (MAXRECURSION n)`, but an infinite loop is a real risk.
- If the termination condition for a recursive CTE is not met, it can result in an infinite loop, causing the query to run indefinitely.
- Oracle does not have a default recursion limit and will run until it exhausts system resources and throws error.
- In case of data that can caude infinite recursion, it is best to use a procedural loop.
- It can become resource-intensive if the recursion depth is high or large datasets are being processed.

**Reading**
- [Recursive queries using common table expressions (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/queries/recursive-common-table-expression-transact-sql?view=sql-server-ver17)
- [Guidelines for recursive common table expressions](https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql?view=sql-server-ver17#guidelines-for-recursive-common-table-expressions)
- [How to Write a Recursive CTE in SQL Server](https://learnsql.com/blog/recursive-cte-sql-server/)

## Resources
- [Common Table Expressions: When and How to Use Them](https://www.atlassian.com/data/sql/using-common-table-expressions)
- [CTE in SQL: A Complete Guide with Examples](https://www.datacamp.com/tutorial/cte-sql)
- [CTE in SQL](https://www.geeksforgeeks.org/sql/cte-in-sql/)