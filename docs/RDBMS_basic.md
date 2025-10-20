# Topic: RDBMS Core Concepts
---

# Introduction to RDBMS

## What is an RDBMS?
- A Relational Database Management System (RDBMS) is based on the relational model, which organizes data into tables with rows and columns.
- RDBMSs provide a systematic way to store, organize, and retrieve data using SQL (Structured Query Language).
- Popular RDBMS Examples:
    - **Oracle Database**: Enterprise-grade RDBMS with advanced features
    - **MySQL**: Open-source, widely used for web applications
    - **PostgreSQL**: Advanced open-source object-relational database
    - **Microsoft SQL Server**: Microsoft's enterprise database solution
    - **IBM DB2**: Enterprise database for large-scale applications
    - **SQLite**: Lightweight, embedded database

## Why use an RDBMS?

### ACID Properties
**Atomicity**: Transactions are all-or-nothing
**Consistency**: Database remains in valid state
**Isolation**: Concurrent transactions don't interfere
**Durability**: Committed changes persist

### Data Integrity Benefits
- Referential integrity through foreign keys
- Domain integrity through data types and constraints
- Entity integrity through primary keys
- User-defined business rules through check constraints

## Relational Model

### Core Components
1. **Tables (Relations)**: Store data in rows and columns
2. **Rows (Tuples)**: Individual records
3. **Columns (Attributes)**: Data fields with specific types
4. **Keys**: Unique identifiers and relationship links

```sql
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10,2),
    stock_quantity INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    phone VARCHAR(20)
);
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);
```

### Relationship Types
```sql
-- One-to-One: Customer to Customer Profile
CREATE TABLE customer_profiles (
    customer_id INT PRIMARY KEY,
    preferences TEXT,
    loyalty_points INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- One-to-Many: Customer to Orders
CREATE TABLE Orders (
    OrderID INTEGER PRIMARY KEY,
    OrderDate DATE NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    customer_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
);

-- Many-to-many relationship through junction table
CREATE TABLE product_suppliers (
    product_id INT,
    supplier_id INT,
    supply_price DECIMAL(10,2),
    lead_time_days INT,
    PRIMARY KEY (product_id, supplier_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);
```

## Resources
- [Codd's 12 Rules for Relational Databases](https://en.wikipedia.org/wiki/Codd%27s_12_rules)
- [Database Normalization Tutorial](https://www.studytonight.com/dbms/database-normalization.php)
- [ACID Properties Explained](https://database.guide/what-are-acid-properties-in-a-database/)

---

# Core SQL Concepts

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

## Grouping and Aggregation

### Grouping
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

### Aggregate Functions
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

### `HAVING` Clause

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

### Advanced Grouping
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
- [Window Functions Guide](https://www.postgresql.org/docs/current/tutorial-window.html)

---

# Constraints
- In a database table, we can add rules to a column known as constraints.
- These rules control the data that can be stored in a column.
- The goal is to enforce data integrity and accuracy at the table level.

## `DEFAULT`
- Purpose: Provides a default value for a column when none is specified.
```sql
-- set default value of college_country column to 'US'
CREATE TABLE Colleges (
  college_id INT PRIMARY KEY,
  college_country VARCHAR(10) DEFAULT 'BD'
);
```
When inserting rows
```sql
INSERT INTO Colleges (college_id, college_code)
VALUES (1, 'ARP76');

INSERT INTO Colleges (college_id, college_code, college_country)
VALUES (2, 'JWS89', 'UAE');

INSERT INTO Colleges (college_id, college_code, college_country)
VALUES (3, 'JW89', NULL);
```

To add `DEFAULT` constraint to an existing column
```sql
-- MS SQL Server
ALTER TABLE College
ADD CONSTRAINT country_default
DEFAULT 'SA'
FOR college_country;
-- Oracle
ALTER TABLE College
MODIFY college_country DEFAULT 'UAE';
```

To remove a `DEFAULT` constraint
```sql
-- same syntax for both SQL Server and Oracle
ALTER TABLE College
ALTER COLUMN college_country DROP DEFAULT;
```

## `NOT NULL`
- Purpose: Ensures a column cannot have a `NULL` value.
- We must enter a value into columns with the `NOT NULL` constraint. Otherwise, SQL will give us an error.
```sql
CREATE TABLE Colleges (
  college_id INT NOT NULL,
  college_name VARCHAR(50)
);
```

To remove `NOT NULL` constraint from a column
```sql
-- MS SQL Server
ALTER TABLE Colleges ALTER COLUMN college_id INT;
--Oracle
ALTER TABLE Colleges MODIFY (college_id NULL);
```

To add `NOT NULL` constraint to a column
```sql
-- MS SQL Server
ALTER TABLE Colleges ALTER COLUMN college_id INT NOT NULL;
--Oracle
ALTER TABLE Colleges MODIFY college_id INT NOT NULL;
```
But we have to make sure to add some value to any rows where this column has `NULL`, before adding this constraint.

## `PRIMARY KEY`
- Purpose: Uniquely identifies each record in a table.
- Must contain unique values and cannot contain `NULL` values.
- There can be only one primary key per table.
- We will get an error If we try to insert `NULL` or duplicate values in the primary key column.
```sql
CREATE TABLE Colleges (
  college_id INT,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- add the PRIMARY KEY constraint to multiple columns
CREATE TABLE Colleges (
  college_id INT,
  college_code VARCHAR(20),
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id, college_code)
);
```

Add a primary key to an existing table
```sql
ALTER TABLE Colleges
ADD PRIMARY KEY (college_id);

ALTER TABLE Colleges
ADD CONSTRAINT CollegePK PRIMARY KEY (college_id, college_code);
```

Auto Increment Primary Key
```sql
-- MS SQL Server
CREATE TABLE Colleges (
  college_id INT IDENTITY(1,1),
  college_code VARCHAR(20) NOT NULL,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- Oracle
-- create sequence of numbers
CREATE SEQUENCE auto_inc
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;

CREATE TABLE Colleges (
  college_id INT,
  college_code VARCHAR(20) NOT NULL,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- create trigger before insert to
-- add auto incremented value
CREATE TRIGGER auto_inc_trigger
BEFORE INSERT ON Colleges
FOR EACH ROW
BEGIN
SELECT auto_inc.nextval INTO :new.college_id FROM dual
END;
```

To remove Primary Key
```sql
ALTER TABLE Colleges
DROP CONSTRAINT CollegePK;
```

## FOREIGN KEY
- Purpose: Links two tables together. Prevents actions that would destroy links between tables.
- Properties: A key in one table that refers to the `PRIMARY KEY` in another table.
- The foreign key can be referenced to any column in the parent table.
- However, it is a general practice to reference the foreign key to the primary key of the parent table.
- An insertion failure occurs when a value is entered into a table's foreign key column that does not match any value in the primary key column of the related table.

![Referencing Columns in Another Table with FOREIGN KEY](https://www.programiz.com/sites/tutorial2program/files/foreign-key.png)

```sql
CREATE TABLE Customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER
);

CREATE TABLE Orders (
  order_id INT,
  product VARCHAR(40),
  total INT,
  customer_id INT,
  CONSTRAINT OrdersPK PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(id)
);
```

## `UNIQUE`
- Purpose: Ensures that all values in a column are different.
- Similar to a `PRIMARY KEY`, but can accept one `NULL` value.
- A table can have multiple `UNIQUE` constraints.
- We will get an error if we try to insert duplicate values in a column with the `UNIQUE` constraint.
```sql
-- create a table with unique constraint on college_code column
CREATE TABLE Colleges (
  college_id INT NOT NULL UNIQUE,
  college_code VARCHAR(20) UNIQUE,
  college_name VARCHAR(50)
);

-- add unique constraint to an existing column
ALTER TABLE Colleges
ADD UNIQUE (college_id);

-- add unique constraint to multiple columns 
ALTER TABLE Colleges
ADD UNIQUE Unique_College (college_id, college_code);

-- create unique index
CREATE UNIQUE INDEX college_index
ON Colleges(college_code);
```

## `CHECK`
- It is used to specify the condition that must be validated in order to insert data into a table.
- It's a good practice to create named constraints so that it is easier to alter and drop constraints.
- If data in an `INSERT` or `UPDATE` statement fails a `CHECK` constraint, the database rejects the entire command and returns an error message. The row is not inserted or updated.
```sql
CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  amount INT CHECK (amount > 0)
);

-- create a named constraint
CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  amount INT,
  CONSTRAINT amountCK CHECK (amount > 0)
);

-- add CHECK constraint
ALTER TABLE Orders
ADD CHECK (amount > 0);

-- add named CHECK constraint
ALTER TABLE Orders
ADD CONSTRAINT amountCK CHECK (amount > 0);

-- remove CHECK constraint named amountCK
ALTER TABLE Orders
DROP CONSTRAINT amountCK;
```

## Constraint Management

### Dropping Constraints
```sql
-- Drop foreign key constraint
ALTER TABLE orders DROP FOREIGN KEY fk_orders_customer;

-- Drop check constraint
ALTER TABLE products DROP CONSTRAINT chk_price_positive;

-- Drop unique constraint
ALTER TABLE customers DROP CONSTRAINT uk_customers_email;
```

### Disabling/Enabling Constraints
```sql
-- SQL Server: Disable constraint checking
ALTER TABLE orders NOCHECK CONSTRAINT fk_orders_customer;
ALTER TABLE orders CHECK CONSTRAINT fk_orders_customer;

-- Oracle: Disable/Enable constraints
ALTER TABLE orders DISABLE CONSTRAINT fk_orders_customer;
ALTER TABLE orders ENABLE CONSTRAINT fk_orders_customer;
```

### Viewing Constraints
```sql
-- SQL Server: View constraints
SELECT 
    tc.CONSTRAINT_NAME,
    tc.CONSTRAINT_TYPE,
    tc.TABLE_NAME,
    cc.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE cc 
    ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
WHERE tc.TABLE_SCHEMA = 'your_database';

-- Oracle: View constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    search_condition
FROM user_constraints 
WHERE table_name = 'YOUR_TABLE';
```

## Best Practices
1. **Use Descriptive Names**: Name constraints clearly (e.g., `chk_salary_positive` instead of `chk1`)
2. **Business Rule Enforcement**: Implement business logic as database constraints when possible
3. **Performance Impact**: Check constraints are evaluated on every `INSERT`/`UPDATE`
4. **Foreign Key Actions**: Choose `ON DELETE`/`UPDATE` actions carefully based on business requirements
5. **Cross-Database Compatibility**: Test constraint syntax across different database systems

## Resources
- [SQL Constraints](https://www.programiz.com/sql/constraints)

---

# Index
- Indexing makes columns faster to query by creating pointers to where data is stored within a database.
- It functions like a book's index, allowing the database to find rows quickly without scanning the entire table.
- Instead of scanning every page (full table scan), we look up the term in the index and go directly to the correct page number (data row location).
- Indexes dramatically speed up `SELECT` queries with `WHERE` clauses but slow down `INSERT`, `UPDATE`, and `DELETE` operations.
- Primary keys are automatically indexed, and columns frequently used in searches or joins are good candidates for indexing.
- It creates a data structure (like a B-Tree) that holds the indexed column values and a pointer to the corresponding row.

## How it Works
### Without an Index
- A user enters a massive library containing tens of thousands of books.
- All the books are shelved in the random order they were acquired over many years.
- The user wants to find the book "A Brief History of Time."
- Because there is no organizing system, they have only one method to find it.
- Start at the first shelf, pick up the first book, check its title, and continue this process one by one down every aisle.
- If the book is located near the end of the library, the search could take hours, forcing them to physically scan every single book.
- This is like a database performing a "full table scan" on a table with no index. It must read every row to locate the specific data requested.

![without index](https://wac-cdn.atlassian.com/dam/jcr:9aae23a8-963b-4874-ace5-59da8fdd9dd8/BasicSearchGif.gif?cdnVersion=2965)

### With an Index
- Consider the same user entering a library with a well-maintained card catalog at the entrance.
- The cards in this catalog are sorted alphabetically by book title, and each card lists the book's precise location (e.g., "Aisle 7, Shelf 3").
- To find "A Brief History of Time," the user walks to the card catalog, goes directly to the 'B' drawer, and quickly finds the corresponding card.
- After noting the location, they walk straight to the correct aisle and shelf and retrieve the book in just a few minutes.
- The card catalog serves as the index. It is a separate, efficiently sorted data structure that points directly to the main data's location.
- A database uses an index in the same way, allowing it to locate the required rows almost instantly and avoid a time-consuming full scan.

![with index](https://wac-cdn.atlassian.com/dam/jcr:a4f8958d-e2e8-450d-a79a-ce0ea657d909/BinarySearchGif.gif?cdnVersion=2965)

**Read**
- [B-tree](https://www.programiz.com/dsa/b-tree)

## Types of Indexes:

### Clustered Index
- It determines the physical order of the data in the table. The rows on the disk are actually sorted and stored in the same order as the clustered index.
- A table can have only one.
- The primary key is often the clustered index.
- In some database systems, the leaf node of the clustered index corresponds to the actual data, not a pointer to data that is found elsewhere.
- A dictionary is a perfect example. The words are physically sorted alphabetically from A to Z. The clustered index is the data organization.
- When we create a `PRIMARY KEY`, most database systems (like SQL Server) automatically create a clustered index on that column.

![clsutered-index-example](https://media.geeksforgeeks.org/wp-content/uploads/20200410115906/Clustered_Index.jpg)

**Read**
- [Clustered and non-clustered indexes](https://www.ibm.com/docs/en/ias?topic=indexes-clustered-non-clustered)

### Non-Clustered Index
- The index is a separate structure that lives apart from the data.
- It contains the index key values, and each key value has a pointer to the data row.
- The data itself remains in its original, unsorted order (often called a "heap") or is sorted by the clustered index.
- A table can have many non-clustered indexes.
- The textbook index: The index at the back of a textbook. The book's chapters are in their own order. The index is a separate list at the end that contains keywords and pointers (page numbers) to the data's location.

![non-clsutered-index-example](https://miro.medium.com/v2/resize:fit:1400/1*9-ZWe4LhE4wXeGMLFLOUxg.jpeg)

**Read**
- [Clustered and non-clustered indexes](https://www.ibm.com/docs/en/ias?topic=indexes-clustered-non-clustered)

### Unique Index
- Unique indexes help maintain data integrity by ensuring that no rows of data in a table have identical key values.
- When we create a unique index for an existing table with data, values in the columns or expressions that comprise the index key are checked for uniqueness.
- If the table contains rows with duplicate key values, the index creation process fails.
- When a unique index is defined for a table, uniqueness is enforced whenever keys are added or changed within the index.
- Non-unique indexes are used solely to improve query performance by maintaining a sorted order of data values that are used frequently.
- There exists no significant difference between a primary key or unique key constraint and a unique index.

**Read**
- [Unique and non-unique indexes](https://www.ibm.com/docs/en/ias?topic=indexes-unique-non-unique)
- [Differences between primary key or unique key constraints and unique indexes](https://www.ibm.com/docs/en/ias?topic=indexes-unique-non-unique#d22242e85)

### Multicolumn Indexes
- An index that includes more than one column, and can store data on up to 32 columns.
- It's very useful for queries that filter on multiple columns in the `WHERE` clause.
- Standard indexes on a column can lead to substantial decreases in query execution times. However, Multi-column indexes can achieve even greater decreases in query time due to its ability to move through the data quicker.

**Read**
- [Multicolumn Indexes](https://www.atlassian.com/data/sql/multicolumn-indexes)

## Index Management

### Creating Index
```sql
-- Creating a clustered index (usually the primary key)
CREATE CLUSTERED INDEX idx_products_pk 
ON Products (ProductID);

-- SQL Server: Primary key automatically creates clustered index
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    SKU VARCHAR(50) NOT NULL,
    ProductName VARCHAR(100)
);

CREATE TABLE Products (
    ProductID INT NOT NULL,
    SKU VARCHAR(50) NOT NULL,
    ProductName VARCHAR(100),
    CONSTRAINT PK_Products PRIMARY KEY (ProductID),
    CONSTRAINT UQ_Products_SKU UNIQUE (SKU)
);

-- Oracle: Similar concept with Index Organized Tables (IOT)
CREATE TABLE Products (
    ProductID INT NOT NULL,
    SKU VARCHAR(50) NOT NULL,
    ProductName VARCHAR(100),
    CONSTRAINT PK_Products PRIMARY KEY (ProductID),
    CONSTRAINT UQ_Products_SKU UNIQUE (SKU)
) ORGANIZATION INDEX;

-- Basic non-clustered index
CREATE INDEX idx_customers_email ON customers (email);

-- Composite index (multiple columns)
CREATE INDEX idx_orders_customer_date 
ON orders (customer_id, order_date);

-- Unique index
CREATE UNIQUE INDEX idx_products_sku 
ON products (product_sku);

-- Partial/Filtered index (SQL Server)
CREATE INDEX idx_active_customers 
ON customers (customer_name, email) 
WHERE status = 'ACTIVE';

-- Function-based index (Oracle)
CREATE INDEX idx_customers_upper_name 
ON customers (UPPER(customer_name));

-- Descending index
CREATE INDEX idx_orders_date_desc 
ON orders (order_date DESC);

-- Multi-column index with mixed sort orders
CREATE INDEX idx_sales_analysis 
ON sales (region ASC, sale_date DESC, amount ASC);
```

**Read**
- [Managing Index-Organized Tables](https://docs.oracle.com/html/E25494_01/tables012.htm)

### Query existing index
```sql
-- SQL Server
SELECT
    i.name AS index_name,
    i.type_desc AS index_type,
    i.is_unique,
    COL_NAME(ic.object_id, ic.column_id) AS column_name
FROM
    sys.indexes i
INNER JOIN
    sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
WHERE
    i.object_id = OBJECT_ID('presidents');

-- Oracle
SELECT
    i.index_name,
    i.uniqueness,
    c.column_name,
    c.column_position
FROM
    USER_INDEXES i
JOIN
    USER_IND_COLUMNS c ON i.index_name = c.index_name
WHERE
    i.table_name = 'PRESIDENTS';
```

### Deleting Index
```sql
-- SQL Server
-- Index Names are Scoped to the Table
-- This means we can have same index name on other tables
DROP INDEX idx_presidents_country_id ON presidents; -- Need to specify table name

-- Oracle
-- Index Names are Scoped to the Schema
-- This means we can not have same index name on other tables within same schame
DROP INDEX IDX_PRESIDENTS_COUNTRY_ID; -- No need to specify table name
```

## Performance

### Execution Plan Analysis
- It is the process of examining the step-by-step "roadmap" that the database's Query Optimizer creates to retrieve the data for a query.
- By analyzing this plan, we can verify whether the database is using our indexes efficiently, or if it's resorting to slow, brute-force methods.

**The Goal of Index-Focused Analysis**
- Is my index being used? The most basic question. Did the database choose to take the highway?
- HOW is my index being used? Is it being used in the most efficient way possible?
- Are there any "bottlenecks"? Can I spot an operation that is taking up 90% of the query's total cost?
- Is the database telling me it needs an index? Modern query optimizers are smart enough to suggest missing indexes right in the execution plan.

**To View an Execution Plan**
```sql
-- SQL Server
SET STATISTICS XML ON;
GO

SELECT p.president, c.country_name, c.continent
FROM presidents p
JOIN country c ON p.country_id = c.country_id
WHERE c.continent = 'Europe';
GO

SET STATISTICS XML OFF;
GO

-- Oracle
EXPLAIN PLAN FOR
SELECT customer_name 
FROM customers 
WHERE email = 'john@example.com';

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

### Index Performance Scenarios

```sql
-- Good index usage: Leading column in WHERE clause
CREATE INDEX idx_composite ON orders (customer_id, order_date, status);

-- Efficient: Uses index
SELECT * FROM orders WHERE customer_id = 123;
SELECT * FROM orders WHERE customer_id = 123 AND order_date = '2023-01-01';

-- Less efficient: Doesn't use index optimally
SELECT * FROM orders WHERE order_date = '2023-01-01';  -- Skips leading column
SELECT * FROM orders WHERE status = 'SHIPPED';  -- Uses only last column

-- Index for sorting
CREATE INDEX idx_customers_name ON customers (customer_name);
SELECT * FROM customers ORDER BY customer_name;  -- Uses index for sorting
```

## The Trade-off

### Pros
- Dramatically speeds up `SELECT` queriese, specially those with `WHERE` clauses and `JOIN` operations. This is the primary reason for using indexes.
- Enforces Uniqueness: Unique indexes guarantee data integrity by preventing duplicate values.

### Cons
- Slows down data modification (`INSERT`, `UPDATE`, `DELETE`) because the index must also be updated.
- More indexes mean more work. The database engine has to maintain the indexes, which adds a small amount of overhead to its operations.
- Takes up disk space. An index is a data structure that is stored on the disk, just like the table itself. The more indexes there are, and the larger the table, the more disk space it will consume.

### When to Use an Index and When Not To
**Create an Index On:**
- Primary Keys: The database usually does this by default.
- Foreign Keys: Columns used to join tables are excellent candidates for indexes. It makes `JOIN` operations much faster.
- Frequently Searched Columns: Any column that often appears in a `WHERE` clause (*e.g.*, `WHERE country_name = 'Canada'`).
- Columns Used in `ORDER BY`: Indexing a column can speed up sorting operations significantly.

**Avoid or Be Cautious About Indexing:**
- Tables with Frequent, Large Batch Updates: If we are constantly inserting or updating huge numbers of rows, the overhead of updating the indexes can be very costly.
- Small Tables: If a table only has a few hundred rows, it's often faster for the database to just do a full table scan than to bother looking up the index. The "book" is so short, it's faster to just flip through it.
- Columns with Low Cardinality (Few Unique Values): There's little benefit to indexing a Gender column that only contains 'Male', 'Female'. The index won't be very selective.

## Resources
- [Indexing](https://www.atlassian.com/data/sql/how-indexing-works)
- [Indexes](https://learn.microsoft.com/en-us/sql/relational-databases/indexes/indexes?view=sql-server-ver17)

---

# Joins
- A `JOIN` clause in SQL is used to combine rows from two or more tables based on a related column between them.

## Why Do We Need Joins?
To retrieve related data stored across multiple normalized tables.

## Types of Joins:
Use Venn diagrams to explain the core concepts.

### INNER JOIN
Returns records that have matching values in both tables. (The intersection of the Venn diagram).
INNER JOIN returns records that have matching values in both tables. It's the most common type of join and only includes rows where the join condition is met.

**Basic Inner Join:**
```sql
-- Basic inner join syntax
SELECT 
    c.customer_name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- Alternative syntax (implicit join)
SELECT 
    c.customer_name,
    o.order_id,
    o.total_amount
FROM customers c, orders o
WHERE c.customer_id = o.customer_id; -- Not recommended

-- Multiple table inner joins
SELECT 
    c.customer_name,
    o.order_id,
    oi.product_name,
    oi.quantity,
    oi.unit_price
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_date >= '2023-01-01';
```

**Inner Join with Aggregation:**
```sql
-- Customer order statistics
SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_spent,
    AVG(o.total_amount) AS avg_order_value,
    MIN(o.order_date) AS first_order,
    MAX(o.order_date) AS last_order
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) >= 3  -- Only customers with 3+ orders
ORDER BY total_spent DESC;

-- Product sales performance
SELECT 
    p.product_name,
    p.category_id,
    COUNT(oi.item_id) AS times_ordered,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(oi.unit_price) AS avg_selling_price
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY p.product_id, p.product_name, p.category_id
ORDER BY total_revenue DESC;
```

**Complex Inner Join Conditions:**
```sql
-- Join with multiple conditions
SELECT 
    c.customer_name,
    o.order_id,
    o.total_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
                   AND o.order_date >= c.registration_date
                   AND o.total_amount > 100;

-- Join with calculated fields
SELECT 
    c.customer_name,
    o.order_id,
    DATEDIFF(DAY, c.registration_date, o.order_date) AS days_to_first_order
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id = (
    SELECT MIN(order_id) 
    FROM orders 
    WHERE customer_id = c.customer_id
);
```

### LEFT JOIN (or LEFT OUTER JOIN)
Returns all records from the left table, and the matched records from the right table. The result is NULL from the right side if there is no match.
Returns all records from the left table and matched records from the right table. NULL values are returned for unmatched records from the right table.

```sql
-- All customers and their orders (including customers with no orders)
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY c.customer_name;

-- Find customers who haven't placed any orders
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.registration_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL; -- No matching orders

-- Customer summary with null handling
SELECT 
    c.customer_id,
    c.customer_name,
    COALESCE(COUNT(o.order_id), 0) AS order_count,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    CASE 
        WHEN COUNT(o.order_id) = 0 THEN 'No Orders'
        WHEN COUNT(o.order_id) <= 2 THEN 'Low Activity'
        WHEN COUNT(o.order_id) <= 5 THEN 'Medium Activity'
        ELSE 'High Activity'
    END AS activity_level
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY order_count DESC;
```

### RIGHT JOIN (or RIGHT OUTER JOIN)
Returns all records from the right table, and the matched records from the left table. The result is NULL from the left side if there is no match.
Returns all records from the right table and matched records from the left table.

```sql
-- All orders and customer info (including orders without customer data)
SELECT 
    o.order_id,
    o.order_date,
    o.total_amount,
    c.customer_name,
    c.email
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date;

-- Find orders without valid customer records (data integrity check)
SELECT 
    o.order_id,
    o.customer_id,
    o.order_date,
    o.total_amount
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL; -- Orders with invalid customer_id
```

### FULL OUTER JOIN
Returns all records when there is a match in either the left or right table. It combines the results of both LEFT and RIGHT joins.
Returns all records when there's a match in either table. Shows all customers and all orders.

```sql
-- Complete picture of customers and orders
SELECT 
    COALESCE(c.customer_id, o.customer_id) AS customer_id,
    c.customer_name,
    o.order_id,
    o.order_date,
    o.total_amount,
    CASE 
        WHEN c.customer_id IS NULL THEN 'Order without customer'
        WHEN o.order_id IS NULL THEN 'Customer without orders'
        ELSE 'Normal record'
    END AS record_type
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY customer_id, o.order_date;

-- Data quality check across tables
SELECT 
    'Customers without orders' AS issue_type,
    COUNT(*) AS count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
UNION ALL
SELECT 
    'Orders without customers' AS issue_type,
    COUNT(*) AS count
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;
```

### SELF JOIN
A regular join, but the table is joined with itself. Useful for hierarchical data (e.g., an Employees table with a ManagerID column that refers back to EmployeeID).
A table is joined with itself to compare rows within the same table or establish hierarchical relationships.

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

-- Find customers who placed orders on the same day
SELECT 
    o1.customer_id AS customer1,
    o2.customer_id AS customer2,
    o1.order_date,
    o1.order_id AS order1_id,
    o2.order_id AS order2_id
FROM orders o1
INNER JOIN orders o2 ON o1.order_date = o2.order_date
                    AND o1.customer_id < o2.customer_id  -- Avoid duplicates
ORDER BY o1.order_date, o1.customer_id;

-- Product price comparison within categories
SELECT 
    p1.product_name AS product1,
    p1.price AS price1,
    p2.product_name AS product2,
    p2.price AS price2,
    ABS(p1.price - p2.price) AS price_difference
FROM products p1
INNER JOIN products p2 ON p1.category_id = p2.category_id
                      AND p1.product_id < p2.product_id  -- Avoid duplicates
WHERE ABS(p1.price - p2.price) < 50  -- Similar prices
ORDER BY p1.category_id, price_difference;

-- Sequential order analysis
SELECT 
    c.customer_name,
    o1.order_id AS first_order,
    o1.order_date AS first_date,
    o1.total_amount AS first_amount,
    o2.order_id AS next_order,
    o2.order_date AS next_date,
    o2.total_amount AS next_amount,
    DATEDIFF(DAY, o1.order_date, o2.order_date) AS days_between
FROM customers c
INNER JOIN orders o1 ON c.customer_id = o1.customer_id
INNER JOIN orders o2 ON c.customer_id = o2.customer_id
                    AND o2.order_date > o1.order_date
WHERE NOT EXISTS (
    SELECT 1 FROM orders o3 
    WHERE o3.customer_id = c.customer_id 
      AND o3.order_date > o1.order_date 
      AND o3.order_date < o2.order_date
) -- Ensure o2 is the immediate next order
ORDER BY c.customer_name, o1.order_date;
```

### CROSS JOIN
Returns the Cartesian product of the two tables (every row from the first table combined with every row from the second table).
Returns the Cartesian product of both tables - every row from the first table combined with every row from the second table.

```sql
-- Generate all possible product-customer combinations
SELECT 
    c.customer_name,
    p.product_name,
    p.price
FROM customers c
CROSS JOIN products p
WHERE c.customer_id <= 5  -- Limit for demonstration
  AND p.category_id = 1
ORDER BY c.customer_name, p.product_name;

-- Create a date range for reporting
SELECT 
    d.date_value,
    c.category_name
FROM (
    SELECT DATE_ADD('2023-01-01', INTERVAL n DAY) AS date_value
    FROM (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 
        UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
        -- ... continue for desired range
    ) AS numbers
    WHERE n < 365
) d
CROSS JOIN categories c
ORDER BY d.date_value, c.category_name;

-- Size and color combinations for products
SELECT 
    sizes.size_name,
    colors.color_name,
    CONCAT(colors.color_name, ' - ', sizes.size_name) AS variant_name
FROM (
    SELECT 'Small' AS size_name UNION ALL
    SELECT 'Medium' UNION ALL
    SELECT 'Large' UNION ALL
    SELECT 'X-Large'
) sizes
CROSS JOIN (
    SELECT 'Red' AS color_name UNION ALL
    SELECT 'Blue' UNION ALL
    SELECT 'Green' UNION ALL
    SELECT 'Black'
) colors
ORDER BY sizes.size_name, colors.color_name;
```

## Resources
- [SQL Joins Explained](https://www.w3schools.com/sql/sql_join.asp)
- [Visual JOIN Examples](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/)
- [Advanced JOIN Techniques](https://modern-sql.com/feature/from)

# View: A Virtual Window 🖼️
Goal: Simplify complex queries and provide a layer of security.

## What is a View?
Definition: A virtual table based on the result-set of an SQL statement. It contains rows and columns, just like a real table.
Key property: It's a stored query, not stored data (unless it's a materialized view).

## Primary Use Cases:
Simplifying Complexity: Hide complex joins and calculations. Instead of writing a 100-line query, you can just SELECT * FROM MyComplexView.
Enhancing Security: Grant users access to a view that only shows specific columns or rows, rather than giving access to the underlying tables. For example, show employee names but hide their salaries.
Providing Logical Data Independence: The view can remain consistent even if you refactor the underlying tables.

# Variables: Temporary Storage 📦
Goal: Hold a single data value temporarily during the execution of a batch of code.

## What is a Variable?
Definition: A named object that can store a specific type of data (INT, VARCHAR, DATE, etc.).

## The Lifecycle:
Declaration: Creating the variable and defining its data type (e.g., DECLARE @MyVariable INT;).
Assignment: Giving the variable a value (e.g., SET @MyVariable = 10;).
Usage: Using it in queries, logic, etc.

## Scope: Where the variable is accessible (e.g., only within the current batch or procedure).

# Functions: Reusable Formulas ➗
Goal: Encapsulate a calculation or logic that can be reused easily and must return a value.

## What is a Function?
Definition: A named block of code that accepts optional input parameters, performs an action, and returns a result.

## Key Characteristics:
Must return a value (either a single scalar value or a table).
Can be used directly in SELECT statements (e.g., SELECT dbo.CalculateSalesTax(Price) FROM Products;).
Cannot modify data (INSERT, UPDATE, DELETE).

## Types of User-Defined Functions (UDFs):
Scalar Functions: Return a single value (e.g., a number, a string, a date).
Table-Valued Functions: Return a result set (a table).

# Stored Procedures: Reusable Actions ⚙️
Goal: Encapsulate a complete set of operations or business logic that can be executed as a single unit.

## What is a Stored Procedure?
Definition: A group of one or more pre-compiled SQL statements stored in the database.

## Functions vs. Stored Procedures (A Critical Comparison):
Return Value: A procedure does not have to return a value. A function must.
Usage: A procedure is executed on its own (EXEC MyProcedure). A function is used as part of another statement (like SELECT or WHERE).
Data Modification: Procedures can perform data modification (INSERT, UPDATE, DELETE). Functions cannot.

## Key Benefits:
Performance: The execution plan is cached, making subsequent calls faster.
Security: Grant users permission to execute the procedure without giving them access to the underlying tables.
Reduced Network Traffic: Instead of sending a large script, you just send the EXEC command.
Modularity: Encapsulates business logic in one place.

# Triggers: The Automated Watchdog 🐶
Goal: Automatically execute a procedure in response to a specific event on a table.

## What is a Trigger?
Definition: A special type of stored procedure that is invoked automatically when a Data Manipulation Language (DML) event occurs.

## The Core Components:
### The Event: The action that fires the trigger (INSERT, UPDATE, or DELETE).
### The Timing: When the trigger fires.
AFTER / FOR: Runs after the DML operation. Used for auditing, logging, etc.
INSTEAD OF: Runs instead of the DML operation. Often used on views to make them updatable.

## Common Use Cases:
Auditing: Creating a log of who changed what data and when.
Enforcing Complex Business Rules: Implementing rules that are too complex for a CHECK constraint.
Maintaining Data Redundancy: Automatically updating a summary table when data in another table changes.

## A Word of Caution: Triggers execute "invisibly" in the background. Overusing them can make database logic difficult to understand and debug.

---

# Resources
- [SQL Tutorials](https://youtube.com/playlist?list=PL-osiE80TeTsKOdPrKeSOp4rN3mza8VHN&si=bbq1PBhKiVwfVVFz)