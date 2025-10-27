# 04 - Index
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

**Reading**
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

**Reading**
- [Clustered and non-clustered indexes](https://www.ibm.com/docs/en/ias?topic=indexes-clustered-non-clustered)

### Non-Clustered Index
- The index is a separate structure that lives apart from the data.
- It contains the index key values, and each key value has a pointer to the data row.
- The data itself remains in its original, unsorted order (often called a "heap") or is sorted by the clustered index.
- A table can have many non-clustered indexes.
- The textbook index: The index at the back of a textbook. The book's chapters are in their own order. The index is a separate list at the end that contains keywords and pointers (page numbers) to the data's location.

![non-clsutered-index-example](https://miro.medium.com/v2/resize:fit:1400/1*9-ZWe4LhE4wXeGMLFLOUxg.jpeg)

**Reading**
- [Clustered and non-clustered indexes](https://www.ibm.com/docs/en/ias?topic=indexes-clustered-non-clustered)

### Unique Index
- Unique indexes help maintain data integrity by ensuring that no rows of data in a table have identical key values.
- When we create a unique index for an existing table with data, values in the columns or expressions that comprise the index key are checked for uniqueness.
- If the table contains rows with duplicate key values, the index creation process fails.
- When a unique index is defined for a table, uniqueness is enforced whenever keys are added or changed within the index.
- Non-unique indexes are used solely to improve query performance by maintaining a sorted order of data values that are used frequently.
- There exists no significant difference between a primary key or unique key constraint and a unique index.

**Reading**
- [Unique and non-unique indexes](https://www.ibm.com/docs/en/ias?topic=indexes-unique-non-unique)
- [Differences between primary key or unique key constraints and unique indexes](https://www.ibm.com/docs/en/ias?topic=indexes-unique-non-unique#d22242e85)

### Multicolumn Indexes
- An index that includes more than one column, and can store data on up to 32 columns.
- It's very useful for queries that filter on multiple columns in the `WHERE` clause.
- Standard indexes on a column can lead to substantial decreases in query execution times. However, Multi-column indexes can achieve even greater decreases in query time due to its ability to move through the data quicker.

**Reading**
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

**Reading**
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

### When to
**Create an Index:**
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