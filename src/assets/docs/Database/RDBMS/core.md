# 02 - Core SQL Concepts

## Basic CRUD Operations

### CREATE (`INSERT`) Operations

```sql
-- Single row insert
INSERT INTO customers (customer_name, email, phone) 
VALUES ('John Doe', 'john.doe@example.com', '555-1234');

-- Multiple row insert
INSERT INTO products (product_name, category_id, price, stock_quantity) 
VALUES 
    ('Laptop', 1, 999.99, 50),
    ('Mouse', 2, 29.99, 200),
    ('Keyboard', 2, 79.99, 150);

-- Insert with subquery
INSERT INTO high_value_customers (customer_id, customer_name, total_spent)
SELECT c.customer_id, c.customer_name, SUM(o.total_amount)
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.total_amount) > 1000;

-- Insert with default values
INSERT INTO audit_log (action, timestamp) 
VALUES ('USER_LOGIN', DEFAULT); -- Uses DEFAULT value for timestamp

-- Insert from another table
INSERT INTO archive_orders 
SELECT * FROM orders 
WHERE order_date < '2023-01-01';
```

### READ (`SELECT`) Operations

```sql
-- Basic select with all columns
SELECT * FROM products;

-- Select specific columns
SELECT product_name, price, stock_quantity 
FROM products;

-- Select with calculated columns
SELECT 
    product_name,
    price,
    stock_quantity,
    (price * stock_quantity) AS inventory_value,
    CASE 
        WHEN stock_quantity > 100 THEN 'High Stock'
        WHEN stock_quantity > 50 THEN 'Medium Stock'
        ELSE 'Low Stock'
    END AS stock_status
FROM products;
```

### `UPDATE` Operations

```sql
-- Simple update
UPDATE products 
SET price = 899.99 
WHERE product_id = 1;

-- Update multiple columns
UPDATE customers 
SET email = 'newemail@example.com', 
    phone = '555-9999',
    last_updated = GETDATE()
WHERE customer_id = 1;

-- Update with calculation
UPDATE products 
SET price = price * 1.10 -- 10% price increase
WHERE category_id = 1;

-- Update with subquery
UPDATE products 
SET stock_quantity = stock_quantity + 100
WHERE product_id IN (
    SELECT product_id 
    FROM order_items 
    GROUP BY product_id 
    HAVING SUM(quantity) > 1000
);
```

#### Reading
- [Efficient column updates in SQL](https://www.atlassian.com/data/sql/how-to-update-a-column-based-on-a-filter-of-another-column)

### `DELETE` Operations

```sql
-- Simple delete
DELETE FROM customers WHERE customer_id = 1;

-- Delete with multiple conditions
DELETE FROM orders 
WHERE status = 'Cancelled' AND order_date < '2023-01-01';

-- Delete with subquery
DELETE FROM products 
WHERE product_id NOT IN (
    SELECT DISTINCT product_id 
    FROM order_items 
    WHERE product_id IS NOT NULL
);

-- Safe delete with EXISTS
DELETE FROM customers 
WHERE NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.customer_id = customers.customer_id
);
```

## Filtering and Sorting

### `WHERE` Clause Filtering

```sql
-- Comparison operators
SELECT * FROM products WHERE price > 100;
SELECT * FROM products WHERE stock_quantity <= 50;
SELECT * FROM products WHERE category_id <> 1; -- Not equal

-- String filtering
SELECT * FROM customers WHERE customer_name LIKE 'John%'; -- Starts with 'John'
SELECT * FROM customers WHERE email LIKE '%@gmail.com'; -- Ends with '@gmail.com'
SELECT * FROM customers WHERE phone LIKE '555-____'; -- Exact pattern

-- Date filtering
SELECT * FROM orders WHERE order_date >= '2023-01-01';
SELECT * FROM orders WHERE order_date BETWEEN '2023-01-01' AND '2023-12-31';
SELECT * FROM orders WHERE YEAR(order_date) = 2023;

-- NULL handling
SELECT * FROM customers WHERE phone IS NOT NULL;
SELECT * FROM products WHERE description IS NULL;

-- IN and NOT IN
SELECT * FROM products WHERE category_id IN (1, 2, 3);
SELECT * FROM customers WHERE customer_id NOT IN (1, 5, 10);

-- Complex conditions with AND/OR
SELECT * FROM products 
WHERE (category_id = 1 OR category_id = 2) 
  AND price BETWEEN 50 AND 500 
  AND stock_quantity > 0;

-- Regular expressions (MySQL/PostgreSQL)
SELECT * FROM customers WHERE customer_name REGEXP '^[A-M]'; -- Names starting A-M
```

### `ORDER BY` Sorting

```sql
-- Single column sorting
SELECT * FROM products ORDER BY price ASC;
SELECT * FROM products ORDER BY price DESC;

-- Multiple column sorting
SELECT * FROM products 
ORDER BY category_id ASC, price DESC;

-- Sorting by calculated column
SELECT 
    product_name,
    price,
    stock_quantity,
    (price * stock_quantity) AS inventory_value
FROM products 
ORDER BY inventory_value DESC;

-- Conditional sorting
SELECT * FROM products 
ORDER BY 
    CASE category_id 
        WHEN 1 THEN 1  -- Electronics first
        WHEN 2 THEN 2  -- Accessories second
        ELSE 3         -- Others last
    END,
    product_name;

-- Sorting with NULL values
SELECT * FROM customers 
ORDER BY phone ASC NULLS LAST; -- PostgreSQL syntax

-- Random sorting
SELECT * FROM products 
ORDER BY RAND() -- MySQL
-- ORDER BY RANDOM() -- PostgreSQL
-- ORDER BY NEWID() -- SQL Server
LIMIT 10;
```

### `LIMIT` and `OFFSET` (Pagination)

```sql
-- MySQL/PostgreSQL syntax
SELECT * FROM products 
ORDER BY product_id 
LIMIT 10 OFFSET 20; -- Skip 20, take 10

-- SQL Server syntax
SELECT * FROM products 
ORDER BY product_id 
OFFSET 20 ROWS 
FETCH NEXT 10 ROWS ONLY;

-- Oracle syntax (older versions)
SELECT * FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY product_id) AS rn, p.*
    FROM products p
) WHERE rn BETWEEN 21 AND 30;

-- Oracle 12c+ syntax
SELECT * FROM products 
ORDER BY product_id 
OFFSET 20 ROWS 
FETCH NEXT 10 ROWS ONLY;
```