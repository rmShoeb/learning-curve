# Topic: Advanced RDMS
---

# Subqueries
A subquery, or inner query, is a SELECT statement that is nested inside another SQL statement like SELECT, INSERT, UPDATE, or DELETE. It's a powerful tool for performing complex data retrieval by breaking the problem into sequential logical steps.
Subqueries are queries nested inside other queries. They can be used in SELECT, FROM, WHERE, and HAVING clauses to create complex queries that would be difficult to express with joins alone.

**Scalar Subqueries:**
Return a single value (one row, one column).

```sql
-- Find products priced above average
SELECT 
    product_name,
    price,
    (SELECT AVG(price) FROM products) AS avg_price,
    price - (SELECT AVG(price) FROM products) AS price_difference
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;

-- Customer with highest total spending
SELECT 
    customer_name,
    email,
    (SELECT SUM(total_amount) 
     FROM orders 
     WHERE customer_id = c.customer_id) AS total_spent
FROM customers c
WHERE (SELECT SUM(total_amount) 
       FROM orders 
       WHERE customer_id = c.customer_id) = (
    SELECT MAX(customer_total) FROM (
        SELECT SUM(total_amount) AS customer_total
        FROM orders 
        GROUP BY customer_id
    ) AS totals
);

-- Latest order date for each customer
SELECT 
    customer_name,
    (SELECT MAX(order_date) 
     FROM orders 
     WHERE customer_id = c.customer_id) AS latest_order_date,
    (SELECT COUNT(*) 
     FROM orders 
     WHERE customer_id = c.customer_id) AS total_orders
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders WHERE customer_id = c.customer_id);
```

**Row-based Subqueries:**
Return multiple columns but single row, used with row constructors.

```sql
-- Find customer with specific order characteristics
SELECT customer_name, email
FROM customers
WHERE (customer_id, registration_date) = (
    SELECT customer_id, MIN(registration_date)
    FROM customers
    WHERE customer_id IN (
        SELECT customer_id FROM orders 
        WHERE total_amount > 1000
    )
    GROUP BY customer_id
    ORDER BY MIN(registration_date)
    LIMIT 1
);

-- Products matching specific criteria combination
SELECT product_name, price, stock_quantity
FROM products
WHERE (category_id, price) IN (
    SELECT category_id, MAX(price)
    FROM products
    GROUP BY category_id
);
```

**Table Subqueries:**
Return multiple rows and columns, used in FROM clause or with IN/EXISTS.

```sql
-- Customer segmentation using subquery
SELECT 
    customer_tier,
    COUNT(*) AS customer_count,
    AVG(total_spent) AS avg_spent
FROM (
    SELECT 
        c.customer_id,
        c.customer_name,
        COALESCE(SUM(o.total_amount), 0) AS total_spent,
        CASE 
            WHEN COALESCE(SUM(o.total_amount), 0) >= 5000 THEN 'Premium'
            WHEN COALESCE(SUM(o.total_amount), 0) >= 1000 THEN 'Standard'
            ELSE 'Basic'
        END AS customer_tier
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.customer_name
) AS customer_analysis
GROUP BY customer_tier
ORDER BY avg_spent DESC;

-- Monthly sales comparison
SELECT 
    current_month.month,
    current_month.revenue AS current_revenue,
    previous_month.revenue AS previous_revenue,
    ((current_month.revenue - previous_month.revenue) / 
     previous_month.revenue * 100) AS growth_percentage
FROM (
    SELECT 
        MONTH(order_date) AS month,
        SUM(total_amount) AS revenue
    FROM orders 
    WHERE YEAR(order_date) = 2023
    GROUP BY MONTH(order_date)
) current_month
LEFT JOIN (
    SELECT 
        MONTH(order_date) + 1 AS month,
        SUM(total_amount) AS revenue
    FROM orders 
    WHERE YEAR(order_date) = 2023
    GROUP BY MONTH(order_date)
) previous_month ON current_month.month = previous_month.month
ORDER BY current_month.month;
```

**Correlated Subqueries:**
Reference columns from the outer query.

```sql
-- Customers who placed orders above their personal average
SELECT 
    c.customer_name,
    o.order_id,
    o.order_date,
    o.total_amount,
    (SELECT AVG(total_amount) 
     FROM orders 
     WHERE customer_id = c.customer_id) AS personal_avg
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.total_amount > (
    SELECT AVG(total_amount)
    FROM orders 
    WHERE customer_id = c.customer_id
)
ORDER BY c.customer_name, o.order_date;

-- Products that haven't been ordered in the last 90 days
SELECT 
    p.product_name,
    p.category_id,
    p.price,
    (SELECT MAX(o.order_date)
     FROM orders o
     INNER JOIN order_items oi ON o.order_id = oi.order_id
     WHERE oi.product_id = p.product_id) AS last_order_date
FROM products p
WHERE NOT EXISTS (
    SELECT 1 
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    WHERE oi.product_id = p.product_id
      AND o.order_date > DATE_SUB(CURDATE(), INTERVAL 90 DAY)
)
ORDER BY last_order_date ASC NULLS FIRST;

-- Running totals using correlated subquery
SELECT 
    order_date,
    total_amount,
    (SELECT SUM(total_amount)
     FROM orders o2
     WHERE o2.order_date <= o1.order_date) AS running_total
FROM orders o1
ORDER BY order_date;
```

## What It Looks Like
The basic idea is to use the result of one query as an input for another.
```sql
SELECT column_name
FROM table_name
WHERE column_name OPERATOR (SELECT column_name FROM table_name WHERE ...);
```

## Types of Subqueries

### Scalar Subquery
A subquery that returns a single value (one row with one column). It can be used anywhere a single value is expected.

Use Case: Finding all employees who earn more than the average salary.

Example:

SQL

SELECT employee_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees); -- This subquery returns one value: the average salary.

### Multi-row Subquery
A subquery that returns multiple rows. It's often used with operators like IN, NOT IN, ANY, and ALL.

Use Case: Finding all managers who are also listed in the promotions_2025 table.

Example:

SQL

SELECT employee_name
FROM employees
WHERE employee_id IN (SELECT manager_id FROM departments); -- The IN operator checks against the list of manager_ids.

### Correlated Subquery
A complex subquery where the inner query depends on the outer query for its values. It is evaluated once for each row processed by the outer query, which can make it slow. 🐢

Use Case: Finding employees whose salary is the maximum in their respective departments.

Example:

SQL

SELECT employee_name, salary, department_id
FROM employees e1
WHERE salary = (SELECT MAX(salary)
                FROM employees e2
                WHERE e2.department_id = e1.department_id); -- The inner query is re-run for each employee's department.

## Key Takeaway: Subqueries are great for simple lookups, but can become unreadable and inefficient when nested too deeply.

# Common Table Expressions (CTEs)
A Common Table Expression (CTE) is a temporary, named result set that you can reference within another SQL statement. It's defined using the WITH clause and dramatically improves the readability and structure of complex queries. Think of it as creating a temporary, single-query-use view.
CTEs provide a way to define temporary named result sets that exist only for the duration of a query. They improve readability and enable recursive operations.

**Basic CTE Syntax:**

```sql
-- Simple CTE for readability
WITH customer_stats AS (
    SELECT 
        customer_id,
        COUNT(*) AS order_count,
        SUM(total_amount) AS total_spent,
        AVG(total_amount) AS avg_order_value,
        MAX(order_date) AS last_order_date
    FROM orders
    GROUP BY customer_id
)
SELECT 
    c.customer_name,
    c.email,
    cs.order_count,
    cs.total_spent,
    cs.avg_order_value,
    cs.last_order_date,
    DATEDIFF(CURDATE(), cs.last_order_date) AS days_since_last_order
FROM customers c
INNER JOIN customer_stats cs ON c.customer_id = cs.customer_id
WHERE cs.order_count >= 5
ORDER BY cs.total_spent DESC;

-- Multiple CTEs
WITH 
monthly_sales AS (
    SELECT 
        YEAR(order_date) AS year,
        MONTH(order_date) AS month,
        SUM(total_amount) AS monthly_revenue,
        COUNT(*) AS order_count
    FROM orders
    GROUP BY YEAR(order_date), MONTH(order_date)
),
sales_with_growth AS (
    SELECT 
        year,
        month,
        monthly_revenue,
        order_count,
        LAG(monthly_revenue) OVER (ORDER BY year, month) AS prev_month_revenue,
        ((monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY year, month)) / 
         LAG(monthly_revenue) OVER (ORDER BY year, month) * 100) AS growth_rate
    FROM monthly_sales
)
SELECT 
    year,
    month,
    monthly_revenue,
    order_count,
    COALESCE(growth_rate, 0) AS growth_rate,
    CASE 
        WHEN growth_rate > 10 THEN 'High Growth'
        WHEN growth_rate > 0 THEN 'Positive Growth'
        WHEN growth_rate < -10 THEN 'Significant Decline'
        ELSE 'Stable/Slight Decline'
    END AS growth_category
FROM sales_with_growth
ORDER BY year, month;
```

**Advanced CTE Examples:**

```sql
-- Product performance analysis with multiple metrics
WITH 
product_sales AS (
    SELECT 
        p.product_id,
        p.product_name,
        p.category_id,
        p.price,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
        COUNT(DISTINCT o.customer_id) AS unique_customers
    FROM products p
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_date >= '2023-01-01' OR o.order_date IS NULL
    GROUP BY p.product_id, p.product_name, p.category_id, p.price
),
category_averages AS (
    SELECT 
        category_id,
        AVG(revenue) AS avg_category_revenue,
        AVG(total_sold) AS avg_category_sold
    FROM product_sales
    GROUP BY category_id
),
product_rankings AS (
    SELECT 
        ps.*,
        ca.avg_category_revenue,
        ca.avg_category_sold,
        ROW_NUMBER() OVER (PARTITION BY ps.category_id ORDER BY ps.revenue DESC) AS category_rank,
        ROW_NUMBER() OVER (ORDER BY ps.revenue DESC) AS overall_rank,
        CASE 
            WHEN ps.revenue > ca.avg_category_revenue * 1.5 THEN 'Top Performer'
            WHEN ps.revenue > ca.avg_category_revenue THEN 'Above Average'
            WHEN ps.revenue > ca.avg_category_revenue * 0.5 THEN 'Below Average'
            ELSE 'Poor Performer'
        END AS performance_tier
    FROM product_sales ps
    INNER JOIN category_averages ca ON ps.category_id = ca.category_id
)
SELECT 
    product_name,
    category_id,
    price,
    total_sold,
    revenue,
    unique_customers,
    category_rank,
    overall_rank,
    performance_tier,
    ROUND(revenue / avg_category_revenue * 100, 2) AS pct_of_category_avg
FROM product_rankings
WHERE category_rank <= 5  -- Top 5 in each category
ORDER BY category_id, category_rank;
```

## Why Use CTEs?
Readability: Breaks a complex query into simple, logical building blocks.

Maintainability: Easier to debug and modify named blocks of logic.

Recursion: CTEs can reference themselves, allowing you to query hierarchical data (like an organizational chart).

## Types of CTEs
### Non-Recursive CTE
This is the most common type. You define one or more CTEs and then use them in a final query.

Use Case: Let's rewrite the correlated subquery example from before. We want to find each department's average salary and then list employees who earn more than their department's average.

Example:

SQL

WITH DepartmentAvgSalary AS (
    -- First, define the CTE to calculate average salary per department
    SELECT department_id, AVG(salary) as avg_sal_for_dept
    FROM employees
    GROUP BY department_id
)
-- Now, use the CTE in the main query
SELECT e.employee_name, e.salary, d.avg_sal_for_dept
FROM employees e
JOIN DepartmentAvgSalary d ON e.department_id = d.department_id
WHERE e.salary > d.avg_sal_for_dept;
This is much clearer than a correlated subquery! 👍

### Recursive CTE
A CTE that calls itself to process hierarchical or graph-like data. It must have an anchor member (the base case) and a recursive member joined by a UNION ALL.

Use Case: Displaying an entire organizational hierarchy, starting from the CEO.

Example:

SQL

WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor Member: Select the top-level employee (CEO)
    SELECT employee_id, employee_name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive Member: Join employees to their managers
    SELECT e.employee_id, e.employee_name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN EmployeeHierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM EmployeeHierarchy;

Enable hierarchical queries and tree traversal.

```sql
-- Employee hierarchy traversal
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: top-level managers
    SELECT 
        employee_id,
        employee_name,
        manager_id,
        department,
        salary,
        1 AS level,
        CAST(employee_name AS VARCHAR(1000)) AS hierarchy_path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT 
        e.employee_id,
        e.employee_name,
        e.manager_id,
        e.department,
        e.salary,
        eh.level + 1,
        CONCAT(eh.hierarchy_path, ' > ', e.employee_name)
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT 
    employee_id,
    REPEAT('  ', level - 1) + employee_name AS indented_name,
    department,
    salary,
    level,
    hierarchy_path
FROM employee_hierarchy
ORDER BY hierarchy_path;

-- Product category tree with sales rollup
WITH RECURSIVE category_tree AS (
    -- Root categories
    SELECT 
        category_id,
        category_name,
        parent_category_id,
        1 AS level,
        CAST(category_id AS VARCHAR(100)) AS path
    FROM categories
    WHERE parent_category_id IS NULL
    
    UNION ALL
    
    -- Subcategories
    SELECT 
        c.category_id,
        c.category_name,
        c.parent_category_id,
        ct.level + 1,
        CONCAT(ct.path, '-', c.category_id)
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_category_id = ct.category_id
),
category_sales AS (
    SELECT 
        ct.category_id,
        ct.category_name,
        ct.level,
        ct.path,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS direct_sales
    FROM category_tree ct
    LEFT JOIN products p ON ct.category_id = p.category_id
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_date >= '2023-01-01' OR o.order_date IS NULL
    GROUP BY ct.category_id, ct.category_name, ct.level, ct.path
)
SELECT 
    REPEAT('  ', level - 1) + category_name AS hierarchy_display,
    direct_sales,
    level,
    path
FROM category_sales
ORDER BY path;

-- Sequential date generation
WITH RECURSIVE date_series AS (
    SELECT DATE('2023-01-01') AS date_value
    
    UNION ALL
    
    SELECT DATE_ADD(date_value, INTERVAL 1 DAY)
    FROM date_series
    WHERE date_value < DATE('2023-12-31')
)
SELECT 
    ds.date_value,
    DAYNAME(ds.date_value) AS day_name,
    COALESCE(daily_sales.revenue, 0) AS daily_revenue,
    COALESCE(daily_sales.order_count, 0) AS order_count
FROM date_series ds
LEFT JOIN (
    SELECT 
        DATE(order_date) AS order_date,
        SUM(total_amount) AS revenue,
        COUNT(*) AS order_count
    FROM orders
    WHERE YEAR(order_date) = 2023
    GROUP BY DATE(order_date)
) daily_sales ON ds.date_value = daily_sales.order_date
ORDER BY ds.date_value;
```

# SET Operators
SET operators are used to combine the result sets of two or more SELECT statements. For these to work, each SELECT query must have the same number of columns with compatible data types.

## The Operators
UNION: Combines two result sets and removes duplicate rows.

UNION ALL: Combines two result sets and includes all rows, including duplicates. (It's faster because it doesn't check for duplicates).

INTERSECT: Returns only the rows that exist in both result sets.

EXCEPT (or MINUS in Oracle): Returns rows from the first result set that do not exist in the second one.

## Example Scenario
Imagine we have two tables: FullTimeEmployees and PartTimeEmployees.

SQL

-- To get a single list of all unique employee names
SELECT employee_name FROM FullTimeEmployees
UNION
SELECT employee_name FROM PartTimeEmployees;

-- To get a list of everyone, even if they work both full-time and part-time
SELECT employee_name FROM FullTimeEmployees
UNION ALL
SELECT employee_name FROM PartTimeEmployees;

-- To find employees who are listed as BOTH full-time and part-time
SELECT employee_name FROM FullTimeEmployees
INTERSECT
SELECT employee_name FROM PartTimeEmployees;

-- To find employees who are ONLY full-time
SELECT employee_name FROM FullTimeEmployees
EXCEPT
SELECT employee_name FROM PartTimeEmployees;

# Handling JSON Data
Modern applications often use JSON (JavaScript Object Notation) for data exchange. Many RDBMS (like PostgreSQL, MySQL, SQL Server) now have native support for storing and querying JSON data directly, blending the worlds of relational and NoSQL. 🌐

## Storing JSON
You can use a dedicated JSON or JSONB data type. JSONB is a binary representation which is often faster to query but slightly slower to insert. It also supports indexing.

SQL

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    details JSONB
);

INSERT INTO products (name, details)
VALUES ('Laptop', '{"brand": "TechCo", "specs": {"ram": 16, "ssd": 512}, "tags": ["electronics", "computer"]}');

## Querying JSON
Special operators and functions are used to navigate the JSON structure.

### Extracting Data
->: Extracts a JSON field as a JSON object/array.

->>: Extracts a JSON field as text.

SQL

-- Get the brand name (as text)
SELECT name, details ->> 'brand' as brand
FROM products;
-- Result: 'TechCo'

-- Get the specs object (as a JSON object)
SELECT name, details -> 'specs' as specs
FROM products;
-- Result: {"ram": 16, "ssd": 512}

### Traversing Nested Paths
You can chain the operators to go deeper into the JSON object.

SQL

-- Get the RAM value (as text)
SELECT name, details -> 'specs' ->> 'ram' as ram
FROM products;
-- Result: '16'

### Filtering with WHERE
You can use these operators in the WHERE clause to filter rows.

SQL

-- Find all products with more than 8GB of RAM
SELECT name, details
FROM products
WHERE (details -> 'specs' ->> 'ram')::INT > 8; -- Note the cast to integer

# Transactions and Rollback
A transaction is a sequence of operations performed as a single, logical unit of work. The key principle is: all or nothing. Either every operation in the transaction succeeds, or none of them do. This guarantees data integrity.

## The ACID Properties
Transactions are defined by four critical properties, known as ACID.

Atomicity: Guarantees that all operations within a transaction are completed successfully. If not, the transaction is aborted, and the database is rolled back to its state before the transaction began.

Consistency: Ensures that a transaction can only bring the database from one valid state to another.

Isolation: Ensures that concurrent transactions produce the same database state that would have been obtained if transactions were executed serially (one after another).

Durability: Guarantees that once a transaction has been committed, it will remain committed even in the event of a power loss, crash, or error.

## SQL Commands for Transactions
START TRANSACTION; (or BEGIN;): Begins a new transaction.

COMMIT;: Saves all the changes made in the transaction, making them permanent.

ROLLBACK;: Undoes all the changes made since the transaction began.

## Classic Example: Bank Transfer 💰
Imagine transferring $100 from Account A to Account B.

SQL

START TRANSACTION;

-- Step 1: Debit $100 from Account A
UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A';

-- Oh no! The server crashes right here! 😱

-- Step 2: Credit $100 to Account B (This never runs)
UPDATE accounts SET balance = balance + 100 WHERE account_id = 'B';

COMMIT; -- This is also never reached
Because the transaction was not committed, the database automatically performs a rollback upon recovery. The $100 debit from Account A is undone, and no money is lost. Data integrity is preserved!

# Partitioning vs. Sharding
Both partitioning and sharding are techniques used to manage very large databases (VLDBs) by breaking them down. However, they do it in fundamentally different ways.

## Partitioning (Scaling Up ⬆️)
Partitioning is the process of splitting a very large table into smaller, more manageable pieces called partitions, but all these pieces still reside on a single database server. The database system knows how the data is split and handles it transparently to the application.

How it works: You define a "partition key" and a rule.

Range Partitioning: Partitions based on a range of values (e.g., one partition for each month of sales data).

List Partitioning: Partitions based on a list of discrete values (e.g., one partition for each country in a users table).

Hash Partitioning: Distributes data evenly across partitions based on a hash of the partition key.

Key Benefit: Partition Pruning. When you query with a WHERE clause on the partition key (e.g., WHERE sale_date = '2025-08-23'), the database only scans the relevant partition, dramatically speeding up queries.

## Sharding (Scaling Out ↔️)
Sharding is the process of splitting a database's data across multiple database servers. Each server (a "shard") holds a subset of the data. Unlike partitioning, sharding is not typically handled transparently by the database itself; it adds complexity to the application or middleware layer.

How it works: A "shard key" determines which server a piece of data lives on. For example, you could shard a users table based on user_id, with users 1-1,000,000 on Server A, users 1,000,001-2,000,000 on Server B, and so on.

Key Benefit: Horizontal Scalability. It distributes the load (CPU, RAM, disk I/O) across multiple machines, allowing your application to handle massive amounts of data and traffic that a single server could not.

## Partitioning vs. Sharding: The Key Difference

| Feature    | Partitioning                        | Sharding                              |
|------------|-------------------------------------|---------------------------------------|
| Scope      | One database, one server            | Multiple servers                      |
| Goal       | Improve performance & manageability | Increase capacity & throughput        |
| Complexity | Low (managed by DB system)          | High (managed by application)         |
| Analogy    | A book divided into chapters        | A book series across multiple volumes |