# 13 - View

## What is a View?
- In SQL, a view is a virtual table based on the result-set of an SQL statement.
- It contains rows and columns, just like a real table.
- The fields in a view are fields from one or more real tables in the database.
- It does not store any data itself but a saved `SELECT` statement that looks like a table.
- It is like a saved "bookmark" or "filter" for the data. When we access it, the database runs the saved query to get the results.
- The goal is to simplify complex queries, provide a layer of security, and simplified access to complex data relationships without storing duplicate data.
- A view always shows up-to-date data. The database engine recreates the view, every time a user queries it.

## Primary Use Cases

**Simplifying Complexity:**
- Hide complex joins and calculations.
- It acts as a filter on the underlying tables referenced in the view. 
- Instead of writing a 100-line query, we can just use `SELECT * FROM MyComplexView`.

**Enhancing Security:**
- Grant users access to a view that only shows specific columns or rows, rather than giving access to the underlying tables.
- For example, show employee names but hide their salaries.

**Providing Logical Data Independence:**
- The view can remain consistent even if we refactor the underlying tables.
- It shields users from changes to the underlying tables.
- For example, if we rename `country.country_name` to `country.name`, we can update the view's query. The end-users' applications can still `SELECT` from the view and won't break.

## Manage Views

### Create View

```sql
CREATE VIEW v_EuropeanCountries AS
SELECT
    country_id,
    country_name,
    indep_year
FROM
    country
WHERE
    continent = 'Europe';

CREATE VIEW v_PresidentAndCountry AS
SELECT
    p.president,
    c.country_name,
    c.continent,
    c.indep_year
FROM
    presidents AS p
JOIN
    country AS c ON p.country_id = c.country_id;
```

### Query a View

```sql
SELECT * FROM v_EuropeanCountries;
SELECT * FROM v_PresidentAndCountry WHERE continent = 'North America';
```

### Alter View

**SQL Server**
```sql
ALTER VIEW v_PresidentAndCountry AS
SELECT
    p.president_id, -- Added this column
    p.president,
    c.country_name,
    c.continent,
    c.indep_year
FROM
    presidents AS p
JOIN
    country AS c ON p.country_id = c.country_id;
```

**Oracle**
```sql
CREATE OR REPLACE VIEW v_PresidentAndCountry AS
SELECT
    p.president_id, -- Added this column
    p.president,
    c.country_name,
    c.continent,
    c.indep_year
FROM
    presidents p
JOIN
    country c ON p.country_id = c.country_id;
```

### List available Views

**SQL Server**

```sql
-- Standard SQL method (recommended)
SELECT
    TABLE_SCHEMA AS view_schema,
    TABLE_NAME AS view_name
FROM
    INFORMATION_SCHEMA.VIEWS
ORDER BY
    view_schema, view_name;

-- SQL Server native method
SELECT
    s.name AS view_schema,
    v.name AS view_name
FROM
    sys.views v
JOIN
    sys.schemas s ON v.schema_id = s.schema_id
ORDER BY
    s.name, v.name;
```

**Oracle**
```sql
-- Shows all views owned by the current user
SELECT view_name FROM USER_VIEWS;

-- query ALL_VIEWS to see all views user have permission to access
SELECT view_name FROM ALL_VIEWS WHERE owner = 'SCHEMA_NAME';
```

### Check if a Specific View Exists

**SQL Server**
```sql
-- Method 1: Querying INFORMATION_SCHEMA
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS
           WHERE TABLE_NAME = 'v_PresidentAndCountry'
           AND TABLE_SCHEMA = 'dbo')
BEGIN
    PRINT 'View v_PresidentAndCountry exists.'
END
ELSE
BEGIN
    PRINT 'View v_PresidentAndCountry does not exist.'
END

-- Method 2: Using the OBJECT_ID function (common)
-- 'V' specifies that we are looking for an object of type 'View'
IF OBJECT_ID('v_PresidentAndCountry', 'V') IS NOT NULL
BEGIN
    PRINT 'View v_PresidentAndCountry exists.'
END
ELSE
BEGIN
    PRINT 'View v_PresidentAndCountry does not exist.'
END
```

**Oracle**
```sql
-- Method 1: Simple query (will return 1 row if it exists, 0 if not)
SELECT * FROM USER_VIEWS WHERE view_name = 'V_PRESIDENTANDCOUNTRY'; -- Note the uppercase

-- Method 2: A PL/SQL block to use in a script
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM USER_VIEWS
    WHERE view_name = 'V_PRESIDENTANDCOUNTRY';

    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('View V_PRESIDENTANDCOUNTRY exists.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('View V_PRESIDENTANDCOUNTRY does not exist.');
    END IF;
END;
/
```

### Delete View

```sql
DROP VIEW v_EuropeanCountries;
```

## Updatable Views
- A view that we can use `INSERT`, `UPDATE`, or `DELETE` statements on, just as if it were a real table.
- The database is smart enough to "pass through" those changes to the underlying base table(s).

**To define an updatable view, a query expression must also meet these requirements:**
- The `FROM` clause must refer to exactly one table or one updatable view. The statement cannot contain a `JOIN`, `UNION`, or `EXCEPT` clause. Because database can not exactly one underlying table and does not know which base table to affect.
- It cannot contain a `GROUP BY` or `HAVING` clause, or duplicate column names, or use aggregate functions (`SUM`, `COUNT`). Because aggregated columns do not exist, and DB can not determine where to update on others.
- It cannot directly contain the keyword `DISTINCT`, because database does not know what to do with the copies.
- It cannot contain a `WHERE` clause that contains a subquery.
- The column list does not include a `SYSKEY` from the underlying base table.

**Example:**
```sql
CREATE VIEW v_EuropeanCountries AS
SELECT
    country_id,
    country_name,
    indep_year
FROM
    country
WHERE
    continent = 'Europe';

UPDATE v_EuropeanCountries
SET country_name = 'Federal Republic of Germany'
WHERE country_name = 'Germany';
```

## Materialized Views
- It is a duplicate data table created by combining data from multiple existing tables for faster data retrieval.
- A view that does physically store its results.
- It automatically gets updated as data changes in the underlying tables.
- Can be refreshed immediately, on-demand, or periodically.
- It improves the performance of complex queries (typically queries with joins and aggregations) while offering simple maintenance operations.
- Requires additional space and incurs overhead for maintaining data consistency.

**Pros**
- *Massive Performance Gain for Reads:* A `SELECT` from a materialized view is just reading from a pre-computed, stored table. A 5-minute, 10-table `JOIN` query can become a 1-second `SELECT`.
- *Ideal for Reporting & Analytics:* Perfect for Business Intelligence dashboards or summary reports. The complex calculations (`SUM`, `COUNT`, `AVG`) are already done.
- *Reduces Load on Base Tables:* Instead of 1,000 users all running the same complex `JOIN` query on the live production tables, they all query the (often separate) materialized view.
- *Data storage simplicity:* Materialized views allows to consolidate complex query logic in one table. This makes data transformations and code maintenance easier for developers.
- *Improved access control:* We can use a materialized view to control who has access to specific data. We can filter information for users without giving them access to the source tables.

**Cons**
- *Data is Stale (Not Real-Time):* The data is a snapshot. It is only as fresh as its last "refresh." If a new president is added to the presidents table, the materialized view will not show it until the view is updated.
- *Requires Storage Space:* Because it stores the results, a materialized view takes up physical disk space, just like a real table.
- *Maintenance Overhead:* The data has to be updated (or "refreshed") at some point. This refresh process, which re-runs the complex query and rebuilds the stored results, can be resource-intensive.

**Reading**
- [Differences Between Views and Materialized Views in SQL](https://www.geeksforgeeks.org/dbms/differences-between-views-and-materialized-views-in-sql/)

## How they are created
**Oracle**
```sql
CREATE MATERIALIZED VIEW mv_LeaderSummary AS
SELECT
    c.continent,
    COUNT(p.president_id) AS president_count,
    COUNT(pm.pm_id) AS pm_count
FROM
    country c
LEFT JOIN
    presidents p ON c.country_id = p.country_id
LEFT JOIN
    prime_ministers pm ON c.country_id = pm.country_id
GROUP BY
    c.continent;
```

**SQL Server**
- They do no have a direct way of creating materialized views (option exists for [Azure Synapse Analytics](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest)).
- We have to create a regular view first, then create a `UNIQUE CLUSTERED INDEX` on it.
```sql
-- Step 1: Create the view. It MUST use SCHEMABINDING.
CREATE VIEW dbo.v_LeaderSummary
WITH SCHEMABINDING -- Locks the underlying tables from schema changes
AS
SELECT
    c.continent,
    -- COUNT_BIG(*) is required for indexed views on GROUP BY
    COUNT_BIG(*) AS TotalLeaders
FROM
    dbo.country c
JOIN -- (Indexed Views have strict rules, e.g., NO OUTER JOINs)
    dbo.presidents p ON c.country_id = p.country_id
GROUP BY
    c.continent;
GO

-- Step 2: Create the index. This is the step that physically stores the data.
CREATE UNIQUE CLUSTERED INDEX idx_v_LeaderSummary
ON dbo.v_LeaderSummary (continent);
GO
```

## Resources
- [SQL Views](https://www.w3schools.com/sql/sql_view.asp)
- [Views](https://learn.microsoft.com/en-us/sql/relational-databases/views/views)
- [Modify data through a view](https://learn.microsoft.com/en-us/sql/relational-databases/views/modify-data-through-a-view)
- [SQL 'UPDATABLE VIEWS' Explained](https://reintech.io/blog/sql-updatable-views-explained)
- [Updatable and Non-Updatable Views](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00004932en_us&page=GUID-D7147C7F-2016-0901-0293-000000000DE1.html&docLocale=en_US)
- [What is a Materialized View?](https://aws.amazon.com/what-is/materialized-view/)
- [Introduction to materialized views](https://docs.cloud.google.com/bigquery/docs/materialized-views-intro)