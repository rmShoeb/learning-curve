# 11 - Data Transformation

- It is the process of converting raw data from its original format into a different, more suitable one.
- It is the essential step that cleans, standardizes, and reshapes this data, making it valuable for analysis, reporting, or loading into another system.
- This transformation process often serves two distinct purposes:
    - Transforming for Reports: summarization and presentation for human audience. For example, aggregating data (using `SUM`, `COUNT`), calculating percentages, or `PIVOT`-ing rows into columns to create a concise, wide-view table for a dashboard.
    - Transforming for ETL (Extract, Transform, Load): integration and standardization for machine consumption. This includes, but not limited to, cleaning data, validating it against business rules, standardizing formats. The goal is to create a clean, consistent dataset to be loaded into a data warehouse or another database for future use.

## Value-Level Transformation (Changing What's in the Cells)

### Data Type Conversion
Implicit vs. Explicit Conversion
Using `CAST` (ANSI Standard)
Using `CONVERT` (T-SQL/Sybase)

### String Manipulation
`CONCAT`
`+`
`SUBSTRING`
`LEFT`
`RIGHT`
`TRIM`
`LTRIM`
`RTRIM`
`REPLACE`
`UPPER`
`LOWER`

### Date & Time Manipulation
`DATEADD`
`DATEDIFF`
`DATEPART`
`DATENAME`
`GETDATE()`
`NOW()`

### Numeric Functions
`ROUND`
`FLOOR`
`CEILING`

## Structural Transformation (Reshaping the Table)
- `PIVOT` and `UNPIVOT` are powerful operations used to transform data and make it more readable, efficient, and manageable.
- These operations allow us to manipulate tables by switching between rows and columns, which can be crucial for summarizing data, reporting, and data analysis.

### `PIVOT`
- This rotate data from rows to columns.
- It allows to take data in a normalized format and turn it into a more readable format with columns that represent different values of a categorical variable.
- When we apply `PIVOT`, each unique value in a column is turned into its own column, and the data is aggregated based on a specified function.
- This operation is commonly used in reporting, where data needs to be summarized by categories, such as sales by month, product, or region.

**Syntax**

```sql
SELECT <non-pivoted column>, [first pivoted column] AS <alias>, [second pivoted column] AS <alias>, ...
FROM (<SELECT query that provides the source data>) AS SourceTable
PIVOT
(
    <aggregation function>(<column being aggregated>)
    FOR [column that contains pivot values]
    IN ([first pivoted column], [second pivoted column], ...)
) AS PivotTable;
```

- *Non-pivoted columns:* These are the columns that remain unchanged in the result set. They provide context to the data being transformed.
- *Pivoted columns:* These are the new columns created from the distinct values in the pivot value column.
- *Aggregation function:* This function is used to summarize the data we want to pivot.
- *Column being aggregated:* This is the column that contains the data we want to summarize.
- *Column that contains pivot values:* This is the column whose distinct values we want to transform into separate columns in the result set.

**Example**

```sql
-- "Manual" Pivot
WITH LeaderSource AS (
     SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p
    JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m
    JOIN country c ON m.country_id = c.country_id
)
SELECT
    country_name,
    MAX(CASE WHEN LeaderType = 'President' THEN LeaderName END) AS President,
    MAX(CASE WHEN LeaderType = 'PrimeMinister' THEN LeaderName END) AS PrimeMinister,
    MAX(CASE WHEN LeaderType = 'Monarch' THEN LeaderName END) AS Monarch
FROM
    LeaderSource
GROUP BY
    country_name;

-- using PIVOT keyword
-- SQL Server
WITH LeaderSource AS (
    SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p
    JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m
    JOIN country c ON m.country_id = c.country_id
)
SELECT
    country_name, [President], [PrimeMinister], [Monarch]
FROM
    LeaderSource
PIVOT (
    MAX(LeaderName)  -- The aggregate function
    FOR LeaderType IN (
        [President], [PrimeMinister], [Monarch] -- The new columns
    )
) AS PivotTable;
```

*Output:*

|country_name|President|PrimeMinister|Monarch|
|------------|---------|-------------|-------|
|Australia||Anthony Albanese|Charles III|
|Brazil|Lula da Silva|||
|Canada||Stephen Harper|Charles III|
|France|François Mitterrand|||
|Germany|Frank-Walter Steinmeier|Olaf Scholz||
|India|Ram Nath Kovind|Narendra Modi||
|Ireland|Michael D. Higgins|Simon Harris||
|Japan||Shinzo Abe|Naruhito|
|New Zealand|||Charles III|
|Norway|||Olav V|
|South Africa|Cyril Ramaphosa|Thabo Mbeki||
|Spain|||Juan Carlos I|
|United Kingdom||Winston Churchill|Elizabeth II|
|United States|Theodore Roosevelt|||

**Avantages**
- This operator simplifies complex data analysis by creating a columnar format that is clearer and more intuitive.
- It reduces the need for multiple queries by generating all the desired results at once.

**Limitations**
- The operation can be resource-intensive, especially when applied to large datasets.
- It is important to index the relevant columns and filter the data as much as possible before using PIVOT.
- SQL Server does not natively support dynamic column names in PIVOT queries. In this cases, dynamic SQL must be used.
- Ensuring that the data is clean and free of `NULL` values in the pivot columns is crucial, as `NULL` values can significantly affect aggregation results.

### `UNPIVOT`
- It allows us to convert columns back into rows.
- Can be useful when we need to normalize or restructure
    - data after performing a pivot operation.
    - a table with multiple columns.
- One of its primary advantages is that it facilitates data normalization, which involves converting a denormalized, wide dataset into a normalized, narrow format.
- Just like `PIVOT`, `UNPIVOT` is also resource intensive when processing large dataset, and `NULL` values have to handled beforehand too.

**Syntax**

```sql
-- pivoted data, typically a table
WITH LeaderSource AS (
    -- 1. Source Data
    SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m JOIN country c ON m.country_id = c.country_id
),
PivotedData AS (
    -- 2. "Store" the PIVOT results in this CTE
    SELECT country_name, [President], [PrimeMinister], [Monarch]
    FROM LeaderSource
    PIVOT (
        MAX(LeaderName)
        FOR LeaderType IN ([President], [PrimeMinister], [Monarch])
    ) AS PivotTable
)

-- manual unpivot
SELECT country_name, 'President' AS LeaderType, President AS LeaderName
FROM PivotedData
WHERE President IS NOT NULL
UNION ALL
SELECT country_name, 'PrimeMinister' AS LeaderType, PrimeMinister AS LeaderName
FROM PivotedData
WHERE PrimeMinister IS NOT NULL
UNION ALL
SELECT country_name, 'Monarch' AS LeaderType, Monarch AS LeaderName
FROM PivotedData
WHERE Monarch IS NOT NULL;

-- with UNPIVOT keyword
-- SQL Server
SELECT
    country_name,
    LeaderType,
    LeaderName
FROM
    PivotedData
UNPIVOT (
    LeaderName FOR LeaderType IN ([President], [PrimeMinister], [Monarch])
) AS UnpivotTable;
```

*Output:*

|country_name|LeaderType|LeaderName|
|------------|----------|----------|
|Brazil|President|Lula da Silva|
|France|President|François Mitterrand|
|Germany|President|Frank-Walter Steinmeier|
|India|President|Ram Nath Kovind|
|Ireland|President|Michael D. Higgins|
|South Africa|President|Cyril Ramaphosa|
|United States|President|Theodore Roosevelt|
|Australia|PrimeMinister|Anthony Albanese|
|Canada|PrimeMinister|Stephen Harper|
|Germany|PrimeMinister|Olaf Scholz|
|India|PrimeMinister|Narendra Modi|
|Ireland|PrimeMinister|Simon Harris|
|Japan|PrimeMinister|Shinzo Abe|
|South Africa|PrimeMinister|Thabo Mbeki|
|United Kingdom|PrimeMinister|Winston Churchill|
|Australia|Monarch|Charles III|
|Canada|Monarch|Charles III|
|Japan|Monarch|Naruhito|
|New Zealand|Monarch|Charles III|
|Norway|Monarch|Olav V|
|Spain|Monarch|Juan Carlos I|
|United Kingdom|Monarch|Elizabeth II|

### Resource
- [Pivot and Unpivot in SQL](https://www.geeksforgeeks.org/sql/pivot-and-unpivot-in-sql/)
- [PIVOT And UNPIVOT for Data Analysis in SQL Server](https://medium.com/data-bistrot/pivot-and-unpivot-for-data-analysis-in-sql-server-9340f2671837)
- [How to Implement PIVOT and UNPIVOT in SQL Server](https://dotnettutorials.net/lesson/pivot-and-unpivot-sql-server/)