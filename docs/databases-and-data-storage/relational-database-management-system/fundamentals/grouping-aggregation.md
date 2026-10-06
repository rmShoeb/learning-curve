# Grouping and Aggregation

## Grouping

```sql
-- Basic grouping
SELECT category_id, COUNT(*) AS product_count
FROM products 
GROUP BY category_id;

-- Multiple column grouping
SELECT 
    category_id, 
    CASE 
        WHEN price < 50 THEN 'Budget'
        WHEN price < 200 THEN 'Mid-range'
        ELSE 'Premium'
    END AS price_range,
    COUNT(*) AS product_count
FROM products 
GROUP BY category_id, price_range;

-- Grouping with calculations
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_spent,
    AVG(total_amount) AS avg_order_value,
    MIN(order_date) AS first_order,
    MAX(order_date) AS last_order
FROM orders 
GROUP BY customer_id;
```

## Aggregate Functions

```sql
-- Common aggregates
SELECT 
    COUNT(*) AS total_records,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS average_order,
    MIN(total_amount) AS smallest_order,
    MAX(total_amount) AS largest_order,
    STDDEV(total_amount) AS amount_std_dev
FROM orders;

-- String aggregation (database-specific)
-- SQL Server
SELECT 
    category_id,
    STRING_AGG(product_name, ', ') AS product_list
FROM products 
GROUP BY category_id;

-- MySQL
SELECT 
    category_id,
    GROUP_CONCAT(product_name SEPARATOR ', ') AS product_list
FROM products 
GROUP BY category_id;

-- PostgreSQL
SELECT 
    category_id,
    STRING_AGG(product_name, ', ') AS product_list
FROM products 
GROUP BY category_id;
```

## `HAVING` Clause

```sql
-- Filter groups after aggregation
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_spent
FROM orders 
GROUP BY customer_id
HAVING COUNT(*) >= 5 
   AND SUM(total_amount) > 1000;

-- HAVING with subqueries
SELECT 
    category_id,
    AVG(price) AS avg_price
FROM products 
GROUP BY category_id
HAVING AVG(price) > (
    SELECT AVG(price) * 1.2 
    FROM products
); -- Categories with above-average pricing

-- Complex HAVING conditions
SELECT 
    YEAR(order_date) AS order_year,
    MONTH(order_date) AS order_month,
    COUNT(*) AS order_count,
    SUM(total_amount) AS monthly_revenue
FROM orders 
GROUP BY YEAR(order_date), MONTH(order_date)
HAVING COUNT(*) > 10 
   AND SUM(total_amount) > (
       SELECT AVG(monthly_total) 
       FROM (
           SELECT SUM(total_amount) AS monthly_total
           FROM orders 
           GROUP BY YEAR(order_date), MONTH(order_date)
       ) AS monthly_averages
   );
```

## Advanced Grouping

```sql
-- ROLLUP for subtotals
SELECT 
    category_id,
    YEAR(created_date) AS year,
    COUNT(*) AS product_count
FROM products 
GROUP BY ROLLUP(category_id, YEAR(created_date));

-- CUBE for all combinations
SELECT 
    category_id,
    CASE WHEN price < 100 THEN 'Low' ELSE 'High' END AS price_tier,
    COUNT(*) AS product_count
FROM products 
GROUP BY CUBE(category_id, price_tier);

-- GROUPING SETS for specific combinations
SELECT 
    category_id,
    YEAR(created_date) AS year,
    COUNT(*) AS product_count
FROM products 
GROUP BY GROUPING SETS (
    (category_id),
    (YEAR(created_date)),
    (category_id, YEAR(created_date)),
    ()
);

-- Window functions with grouping
SELECT 
    category_id,
    product_name,
    price,
    AVG(price) OVER (PARTITION BY category_id) AS category_avg_price,
    price - AVG(price) OVER (PARTITION BY category_id) AS price_difference
FROM products 
ORDER BY category_id, price DESC;
```

## Resources
- [SQL Aggregate Functions](https://www.w3schools.com/sql/sql_count_avg_sum.asp)
- [GROUP BY and HAVING Tutorial](https://www.sqlshack.com/sql-group-by-clause-tutorial/)