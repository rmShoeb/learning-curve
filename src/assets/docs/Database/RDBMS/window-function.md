# 10 - Window Functions
- A window function performs a calculation across a set of table rows that are somehow related to the current row.
- Unlike aggregate functions, window function does not cause rows to become grouped into a single output row, rather they retain their separate identities.
- It is able to access more than just the current row of the query result.
- It runs a calculation on a "window" of rows but adds the result to the original row, preserving all the detail.

**Problem with GROUP BY**
```sql
SELECT pm.pm_name, COUNT(*) AS TotalTermCount
FROM prime_ministers pm
JOIN prime_minister_terms t ON pm.pm_id = t.pm_id
GROUP BY pm.pm_name;
```

*Output:*
|pm_name|TotalTermCount|
|-------|--------------|
|Fumio Kishida|1|
|Jawaharlal Nehru|1|
|Justin Trudeau|1|
|Margaret Thatcher|1|
|Narendra Modi|2|
|Rishi Sunak|1|
|Shinzo Abe|1|
|Simon Harris|1|
|Stephen Harper|1|
|Thabo Mbeki|2|
|Winston Churchill|2|

We have lost all other details as we can not add columns that are not in the GROUP BY clause.

**Syntax**
- The `OVER` Clause: This is the mandatory clause that defines the window.
- `PARTITION BY`: How to "group" or "partition" the rows into separate windows.
- `ORDER BY`: How to sort the rows within each window (essential for ranking and analytic functions).
- The Framing Clause (`ROWS`/`RANGE`): How to create a "moving" or "sliding" window relative to the current row.

```sql
SELECT
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (PARTITION BY pm.pm_id) AS TotalTermCount
FROM prime_ministers pm
JOIN prime_minister_terms t ON pm.pm_id = t.pm_id
ORDER BY pm.pm_name, t.pm_start;
```

*Output:*
|pm_name|pm_start|TotalTermCount|
|-------|--------|--------------|
|Fumio Kishida|2021|1|
|Jawaharlal Nehru|1947|1|
|Justin Trudeau|2015|1|
|Margaret Thatcher|1979|1|
|Narendra Modi|2014|2|
|Narendra Modi|2019|2|
|Rishi Sunak|2022|1|
|Shinzo Abe|2012|1|
|Simon Harris|2024|1|
|Stephen Harper|2006|1|
|Thabo Mbeki|1999|2|
|Thabo Mbeki|2004|2|
|Winston Churchill|1940|2|
|Winston Churchill|1951|2|

![demo](https://dataschool.com/assets/images/how-to-teach-people-sql/appendix/window_functions/WindowPartitionedGif.gif)

## Aggregate Window Functions
- This uses aggregate functions over a window of rows.

**Simple Aggregates**
- Using `SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()` with `PARTITION BY`

```sql
SELECT 
    c.country_name,
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (PARTITION BY c.country_id) AS CountryTotalTerms, -- How many total terms are recorded for this country?
    AVG(t.pm_start) OVER (PARTITION BY c.country_id) AS CountryAvgStartYear, -- What is the average start year for all terms in this country? (less useful, but shows syntax)
    SUM(t.pm_start) OVER (PARTITION BY c.country_id) AS CountrySumOfYears -- What is the sum of all start years? (less useful, but shows syntax)
FROM prime_minister_terms t
JOIN prime_ministers pm ON t.pm_id = pm.pm_id
JOIN country c ON pm.country_id = c.country_id
ORDER BY c.country_name, pm.pm_name, t.pm_start;
```

**Advanced Aggregates (Running Totals)**
- Using the Framing Clause (`ROWS BETWEEN...`)
- Helps to calculate cumulative sums

```sql
SELECT 
    c.country_name,
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (
        PARTITION BY c.country_id 
        ORDER BY t.pm_start
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS RunningTermCount
FROM prime_minister_terms t
JOIN prime_ministers pm ON t.pm_id = pm.pm_id
JOIN country c ON pm.country_id = c.country_id
ORDER BY t.pm_start;
```

**Window Alias**
```sql
SELECT
	pm.pm_name,
	pmt.pm_start,
	LAG(pmt.pm_start, 2) OVER pm_start_asc_order as lagging,
	LEAD(pmt.pm_start, 2) OVER pm_start_asc_order as leading
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id
WINDOW pm_start_asc_order AS (ORDER BY pmt.pm_start);
```

## Ranking Window Functions

### `ROW_NUMBER()`
- Displays the number of a given row.
- It starts are 1 and numbers the rows according to the `ORDER BY` part of the window statement.
- It does not require to specify a variable within the parentheses

```sql
SELECT
	ROW_NUMBER() OVER(PARTITION BY c.country_id ORDER BY pmt.pm_start) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;
```

*Output:*
|serial|country_name|pm_name|pm_start|
|------|------------|-------|--------|
|1|United Kingdom|Winston Churchill|1940|
|2|United Kingdom|Winston Churchill|1951|
|3|United Kingdom|Margaret Thatcher|1979|
|4|United Kingdom|Rishi Sunak|2022|
|1|India|Jawaharlal Nehru|1947|
|2|India|Narendra Modi|2014|
|3|India|Narendra Modi|2019|
|1|Japan|Shinzo Abe|2012|
|2|Japan|Fumio Kishida|2021|
|1|Canada|Stephen Harper|2006|
|2|Canada|Justin Trudeau|2015|
|1|South Africa|Thabo Mbeki|1999|
|2|South Africa|Thabo Mbeki|2004|
|1|Ireland|Simon Harris|2024|

### `RANK()`
- It is slightly different from `ROW_NUMBER()`.
- Assigns a rank with gaps for ties (1, 2, 2, 4).
- If some row has ties, it assigns same value, whereas `ROW_NUMBER()` assigns different value.
- Looks for ties based on the `ORDER BY` clause.

```sql
SELECT
	RANK() OVER(ORDER BY pm.pm_name) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;
```

*Output:*
|serial|country_name|pm_name|pm_start|
|------|------------|-------|--------|
|1|Japan|Fumio Kishida|2021|
|2|India|Jawaharlal Nehru|1947|
|3|Canada|Justin Trudeau|2015|
|4|United Kingdom|Margaret Thatcher|1979|
|5|India|Narendra Modi|2014|
|5|India|Narendra Modi|2019|
|7|United Kingdom|Rishi Sunak|2022|
|8|Japan|Shinzo Abe|2012|
|9|Ireland|Simon Harris|2024|
|10|Canada|Stephen Harper|2006|
|11|South Africa|Thabo Mbeki|1999|
|11|South Africa|Thabo Mbeki|2004|
|13|United Kingdom|Winston Churchill|1940|
|13|United Kingdom|Winston Churchill|1951|

### `DENSE_RANK()`
- Similar to `RANK()`, but assigns a rank with no gaps for ties (1, 2, 2, 3).

```sql
SELECT
	DENSE_RANK() OVER(ORDER BY pm.pm_name) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;
```

*Output:*
|serial|country_name|pm_name|pm_start|
|------|------------|-------|--------|
|1|Japan|Fumio Kishida|2021|
|2|India|Jawaharlal Nehru|1947|
|3|Canada|Justin Trudeau|2015|
|4|United Kingdom|Margaret Thatcher|1979|
|5|India|Narendra Modi|2014|
|5|India|Narendra Modi|2019|
|6|United Kingdom|Rishi Sunak|2022|
|7|Japan|Shinzo Abe|2012|
|8|Ireland|Simon Harris|2024|
|9|Canada|Stephen Harper|2006|
|10|South Africa|Thabo Mbeki|1999|
|10|South Africa|Thabo Mbeki|2004|
|11|United Kingdom|Winston Churchill|1940|
|11|United Kingdom|Winston Churchill|1951|

### `NTILE(n)`
- Splits rows into a specified number of `n` buckets (*e.g.*, quartiles, deciles).
- `ORDER BY` determines which column to use to determine the buckets.

```sql
SELECT
	NTILE(4) OVER(ORDER BY pmt.pm_start) as tile,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;
```

*Output:*
|tile|country_name|pm_name|pm_start|
|----|------------|-------|--------|
|1|United Kingdom|Winston Churchill|1940|
|1|India|Jawaharlal Nehru|1947|
|1|United Kingdom|Winston Churchill|1951|
|1|United Kingdom|Margaret Thatcher|1979|
|2|South Africa|Thabo Mbeki|1999|
|2|South Africa|Thabo Mbeki|2004|
|2|Canada|Stephen Harper|2006|
|2|Japan|Shinzo Abe|2012|
|3|India|Narendra Modi|2014|
|3|Canada|Justin Trudeau|2015|
|3|India|Narendra Modi|2019|
|4|Japan|Fumio Kishida|2021|
|4|United Kingdom|Rishi Sunak|2022|
|4|Ireland|Simon Harris|2024|

## Analytic (Offset) Functions

### `LAG()` and `LEAD()`
- These functions that let peeking at data in other rows without using a self-join.
- `LAG()` accesseses data from a previous row in the partition.
- `LEAD()` accesseses data from a following row in the partition.
- If there is no previous or later row from which to pull, the result is `NULL`.

```sql
SELECT
	pm.pm_name,
	pmt.pm_start,
	LAG(pmt.pm_start, 2) OVER(ORDER BY pmt.pm_start) as lagging,
	LEAD(pmt.pm_start, 2) OVER(ORDER BY pmt.pm_start) as leading
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id;
```
*Output:*
|pm_name|pm_start|lagging|leading|
|-------|--------|-------|-------|
|Winston Churchill|1940||1951|
|Jawaharlal Nehru|1947||1979|
|Winston Churchill|1951|1940|1999|
|Margaret Thatcher|1979|1947|2004|
|Thabo Mbeki|1999|1951|2006|
|Thabo Mbeki|2004|1979|2012|
|Stephen Harper|2006|1999|2014|
|Shinzo Abe|2012|2004|2015|
|Narendra Modi|2014|2006|2019|
|Justin Trudeau|2015|2012|2021|
|Narendra Modi|2019|2014|2022|
|Fumio Kishida|2021|2015|2024|
|Rishi Sunak|2022|2019||
|Simon Harris|2024|2021||

### `FIRST_VALUE()`
Accesses data from the first row in the partition frame.

### `LAST_VALUE()`
Accesses data from the last row in the partition frame.

## Issues
- Window functions can be computationally expensive, especially on large datasets.

## Resources
- [SQL Window Functions](https://www.thoughtspot.com/sql-tutorial/sql-window-functions)
- [SQL Server Window Functions](https://www.sqlservertutorial.net/sql-server-window-functions/)
- [Window Functions Guide](https://www.postgresql.org/docs/current/tutorial-window.html)
- [SQL Window Functions Cheat Sheet](https://media.datacamp.com/legacy/image/upload/v1713890725/Marketing/Blog/SQL_Window_Functions_1_1.pdf)
- [Window Functions in SQL](https://www.geeksforgeeks.org/sql/window-functions-in-sql/)
- [How Window Functions Work](https://dataschool.com/how-to-teach-people-sql/how-window-functions-work/)