# 07 - Subqueries
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


Key Takeaway: Subqueries are great for simple lookups, but can become unreadable and inefficient when nested too deeply.

**Use Subqueries When:**
- Need a single value or simple filtering condition
- The logic is straightforward and doesn't need reuse
- Performance is better with EXISTS/NOT EXISTS operations
- Working with legacy systems that don't support CTEs

```sql
-- Good subquery use case: Simple filtering
SELECT customer_name, email
FROM customers
WHERE customer_id IN (
    SELECT customer_id 
    FROM orders 
    WHERE total_amount > 1000
);

-- EXISTS for performance with large datasets
SELECT product_name, price
FROM products p
WHERE EXISTS (
    SELECT 1 
    FROM order_items oi 
    WHERE oi.product_id = p.product_id
);
```