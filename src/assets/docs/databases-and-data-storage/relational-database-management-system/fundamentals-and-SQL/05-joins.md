# Joins
- A `JOIN` clause in SQL is used to combine rows from two or more tables based on a related column between them.
- When each table is normalized, they hold specific information.
- `JOIN` is the action that combines these specific information and brings out the complete picture.
- It is a good practice to include the table name when specifying columns in the SQL statement.

**Why Do We Need Joins?**
- To retrieve related data stored across multiple normalized tables.
- To build an efficient and reliable database, we intentionally split data into multiple tables to avoid redundancy (Normalization).
- A `JOIN` is the tool we use to temporarily bring that separated data back together.

## Types of Joins

![Types of Join](https://blog.masterdaweb.com/wp-content/uploads/2015/08/inner-join-left-join-outer-join.png)

### Demo tables
**country**

| country_id | country_name | indep_year | continent |
|----|----------------|------|---------------|
| 1  | United States  | 1776 | North America |
| 2  | United Kingdom | 1707 | Europe        |
| 3  | India          | 1947 | Asia          |
| 4  | France         | 1792 | Europe        |
| 5  | Japan          | 660  | Asia          |
| 6  | Canada         | 1867 | North America |
| 7  | Australia      | 1901 | Oceania       |
| 8  | Germany        | 1990 | Europe        |
| 9  | Spain          | 1492 | Europe        |
| 10 | Norway         | 1905 | Europe        |
| 11 | Switzerland    | 1848 | Europe        |
| 12 | New Zealand    | 1907 | Oceania       |
| 13 | South Africa   | 1961 | Africa        |
| 14 | Ireland        | 1922 | Europe        |
| 15 | Brazil         | 1822 | South America |

**presidents**

| president_id | country_id | president |
|----|--------------------|-------------------------|
| 1  | 1 | George Washington |
| 2  | 1 | Abraham Lincoln |
| 3  | 1 | Franklin D. Roosevelt |
| 4  | 4 | Emmanuel Macron |
| 5  | 4 | Charles de Gaulle |
| 6  | 8 | Frank-Walter Steinmeier |
| 7  | 3  | Draupadi Murmu |
| 8  | 3 | Ram Nath Kovind |
| 9  | 1 | Theodore Roosevelt |
| 10 | 4 | François Mitterrand |
| 11 | 13 | Cyril Ramaphosa |
| 12 | 15 | Lula da Silva |
| 13 | 14  | Michael D. Higgins |
| 14 | *NULL* | President-in-Exile |

### `JOIN` or `INNER JOIN`
- Returns records that have matching values in both tables (The intersection of the Venn diagram).
- It's the most common type of join and only includes rows where the join condition is met.
- `INNER` is the default join type for `JOIN`, so when we write `JOIN`, the parser actually writes `INNER JOIN`.

![Inner Join](https://media.geeksforgeeks.org/wp-content/uploads/20250826161511955919/inner_join.webp)

```sql
-- Basic inner join syntax
-- get presidents and their country
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
INNER JOIN
    country AS c ON p.country_id = c.country_id;

-- Alternative syntax (implicit join)
-- Not recommended
-- to avoid Accidental Cross Join
-- Clarity and Readability
SELECT
    p.president,
    c.country_name,
    c.continent
FROM
    presidents AS p,
    country AS c
WHERE p.country_id = c.country_id;
```

**Result:**
| president | country_name |
|-------------------------|---------------|
| George Washington       | United States |
| Abraham Lincoln         | United States |
| Franklin D. Roosevelt   | United States |
| Emmanuel Macron         | France        |
| Charles de Gaulle       | France        |
| Frank-Walter Steinmeier | Germany       |
| Draupadi Murmu          | India         |
| Ram Nath Kovind         | India         |
| Theodore Roosevelt      | United States |
| François Mitterrand     | France        |
| Cyril Ramaphosa         | South Africa  |
| Lula da Silva           | Brazil        |
| Michael D. Higgins      | Ireland       |

### `LEFT JOIN` or `LEFT OUTER JOIN`
- Returns all records from the left table, and the matched records from the right table.
- If there is no match, the columns from the right table will contain `NULL`.

![Left Join](https://media.geeksforgeeks.org/wp-content/uploads/20230905093829/SQLW-300.jpg)

```sql
-- get all presidents (including the ones that have no country, means orphaned records)
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
LEFT JOIN
    country AS c ON p.country_id = c.country_id;
```

**Result:**
| president               | country_name  |
|-------------------------|---------------|
| George Washington       | United States |
| Abraham Lincoln         | United States |
| Franklin D. Roosevelt   | United States |
| Emmanuel Macron         | France        |
| Charles de Gaulle       | France        |
| Frank-Walter Steinmeier | Germany       |
| Draupadi Murmu          | India         |
| Ram Nath Kovind         | India         |
| Theodore Roosevelt      | United States |
| François Mitterrand     | France        |
| Cyril Ramaphosa         | South Africa  |
| Lula da Silva           | Brazil        |
| Michael D. Higgins      | Ireland       |
| President-in-Exile      | *NULL*        |

```sql
-- get orphaned records
SELECT
    p.president
FROM
    presidents AS p
LEFT JOIN
    country AS c ON p.country_id = c.country_id
WHERE
    c.country_id IS NULL;
```

**Result:**
| president               |
|-------------------------|
| President-in-Exile      |

### `RIGHT JOIN` or `RIGHT OUTER JOIN`
- A `RIGHT JOIN` is the mirror image of a `LEFT JOIN`.
- Returns all records from the right table, and the matched records from the left table.
- The result is `NULL` from the left side if there is no match.

![Right Join](https://www.w3schools.com/sql/img_rightjoin.gif)

```sql
-- get countries and their presidents, including countries that have no president
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
RIGHT JOIN
    country AS c ON p.country_id = c.country_id;
```

**Result:**
| president               | country_name  |
|-------------------------|---------------|
| George Washington       | United States |
| Abraham Lincoln         | United States |
| Franklin D. Roosevelt   | United States |
| Emmanuel Macron         | France        |
| Charles de Gaulle       | France        |
| Frank-Walter Steinmeier | Germany       |
| Draupadi Murmu          | India         |
| Ram Nath Kovind         | India         |
| Theodore Roosevelt      | United States |
| François Mitterrand     | France        |
| Cyril Ramaphosa         | South Africa  |
| Lula da Silva           | Brazil        |
| Michael D. Higgins      | Ireland       |
| United Kingdom          | *NULL*        |
| Japan                   | *NULL*        |
| Canada                  | *NULL*        |
| Australia               | *NULL*        |
| Spain                   | *NULL*        |
| Norway                  | *NULL*        |
| Switzerland             | *NULL*        |
| New Zealand             | *NULL*        |

```sql
-- get countries without presidents
SELECT
    c.country_name
FROM
    presidents AS p
RIGHT JOIN
    country AS c ON p.country_id = c.country_id
WHERE
	p.country_id IS NULL;
```

**Result:**
| country_name   |
|----------------|
| United Kingdom |
| Japan          |
| Canada         |
| Australia      |
| Spain          |
| Norway         |
| Switzerland    |
| New Zealand    |

### `FULL OUTER JOIN`
- Returns all records when there is a match in either the left or right table.
- It combines the results of both `LEFT` and `RIGHT` joins.
- It will place `NULL`s where there is no matching data on either side.
- `FULL OUTER JOIN` and `FULL JOIN` are the same.

![Full Outer Join](https://www.w3schools.com/sql/img_full_outer_join.png)

```sql
-- complete picture of both tables
SELECT
	p.president_id,
    p.president,
    c.country_name,
	c.country_id,
    CASE 
        WHEN c.country_id IS NULL THEN 'President without Country (Invalid record)'
        WHEN p.president_id IS NULL THEN 'Country without President'
        ELSE 'Country with President'
    END AS record_type
FROM
    presidents AS p
FULL OUTER JOIN
    country AS c ON p.country_id = c.country_id;
```

**Result:**

| president_id | president | country_name | country_id | record_type |
|--------------|-----------|--------------|------------|-------------|
| 1 | George Washington | United States | 1 | Country with President |
| 2 | Abraham Lincoln | United States | 1 | Country with President |
| 3 | Franklin D. Roosevelt | United States | 1 | Country with President |
| 4 | Emmanuel Macron | France | 4 | Country with President |
| 5 | Charles de Gaulle | France | 4 | Country with President |
| 6 |Frank-Walter Steinmeier | Germany | 8 | Country with President |
| 7 | Draupadi Murmu | India | 3 | Country with President |
| 8 | Ram Nath Kovind | India | 3 | Country with President |
| 9 | Theodore Roosevelt | United States | 1 | Country with President |
| 10 | François Mitterrand | France | 4 | Country with President |
| 11 | Cyril Ramaphosa | South Africa | 13 | Country with President |
| 12 | Lula da Silva | Brazil | 15 | Country with President |
| 13 | Michael D. Higgins | Ireland | 14 | Country with President |
| 14 | President-in-Exile | *NULL* | *NULL* | President without Country (Invalid record) |
| *NULL* | *NULL* | United Kingdom | 2 | Country without President |
| *NULL* | *NULL* | Japan | 5 | Country without President |
| *NULL* | *NULL* | Canada | 6 | Country without President |
| *NULL* | *NULL* | Australia | 7 | Country without President |
| *NULL* | *NULL* | Spain | 9 | Country without President |
| *NULL* | *NULL* | Norway | 10 | Country without President |
| *NULL* | *NULL* | Switzerland | 11 | Country without President |
| *NULL* | *NULL* | New Zealand | 12 | Country without President |

### `SELF JOIN`
- A regular join, but the table is joined with itself.
- Useful for hierarchical data (*e.g.*, an `Employees` table with a `ManagerID` column that refers back to `EmployeeID`), or comparing rows within the same table.

```sql
-- Employee hierarchy (manager-employee relationships)
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    employee_name VARCHAR(100),
    manager_id INT,
    department VARCHAR(50),
    salary DECIMAL(10,2)
);

-- Find employees and their managers
SELECT 
    e.employee_name AS employee,
    e.department,
    m.employee_name AS manager,
    e.salary AS employee_salary,
    m.salary AS manager_salary
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY e.department, e.employee_name;

-- Find employees who earn more than their manager
SELECT 
    e.employee_name AS employee,
    e.salary AS employee_salary,
    m.employee_name AS manager,
    m.salary AS manager_salary,
    (e.salary - m.salary) AS salary_difference
FROM employees e
INNER JOIN employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary
ORDER BY salary_difference DESC;
```

### `CROSS JOIN`
- Returns the Cartesian product of the two tables.
- Means every row from the first table combined with every row from the second table.
- It is rarely used, as it can generate massive result sets.
- It does not use an ON clause.

![Cross Join](https://cdn.discuss.boardinfinity.com/original/2X/e/e2c451df6e636c38924f1803333cc759ebca56cc.png)

```sql
-- Create every possible combination of a monarch and a prime minister
SELECT
    m.monarch,
    pm.pm_name
FROM
    monarchs AS m
CROSS JOIN
    prime_ministers AS pm;
```

## Resources
- [SQL Joins Explained](https://www.w3schools.com/sql/sql_join.asp)
- [A Visual Explanation of SQL Joins](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/)