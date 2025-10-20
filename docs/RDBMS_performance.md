# Topic: Improve RDBMS query performance through Profiling and Optimization techniques
https://dataschool.com/sql-optimization/optimization-using-explain/

# Introduction: The Need for Speed
In any application that relies on a Relational Database Management System (RDBMS), query performance is critical. It directly impacts application responsiveness, user satisfaction, and system scalability. Slow queries can bog down an entire system, leading to timeouts and a poor user experience.

The process of improving query performance is a two-step cycle:

Profiling: The diagnostic phase. This involves identifying which queries are slow and understanding why they are slow. You can't fix a problem you don't understand.

Optimization: The treatment phase. This involves applying various techniques to rewrite queries, modify the database schema, or adjust server configurations to make the query run faster.

Think of it like a car mechanic: first, they run diagnostics to find the problem (profiling), then they repair or tune the engine (optimization).

# Part 1: Profiling - Finding the Bottleneck
Profiling is about gathering data to pinpoint performance issues. The primary goal is to analyze the Execution Plan.

## What is an Execution Plan?
An execution plan (or query plan) is the database's step-by-step roadmap for retrieving the data requested by your query. The database's query optimizer generates this plan by considering various access paths, join methods, and operators. Analyzing this plan is the most effective way to understand query behavior.

## Key things to look for in an execution plan:

Full Table Scan: This is often a major red flag. It means the database is reading every single row in a table because it can't find a more efficient way to locate the required data. Imagine searching for a word in a book by reading every page instead of using the index at the back.

Expensive Operators: Look for operators with a high "cost" percentage. This cost is an estimate from the optimizer of the resources required. Common culprits include certain types of joins (like a nested loop on large tables) or sorting operations.

Incorrect Cardinality Estimates: This happens when the database's guess about the number of rows that will be returned at a certain step is wildly inaccurate. This can cause the optimizer to choose a suboptimal plan.

## Profiling Tools & Metrics
Different RDBMSs offer various tools to view execution plans and monitor performance:

| RDBMS      | Profiling Tool / Command                                    |
|------------|-------------------------------------------------------------|
| PostgreSQL | EXPLAIN ANALYZE command                                     |
| MySQL      | EXPLAIN command, Performance Schema                         |
| SQL Server | SQL Server Profiler, SHOWPLAN                               |
| Oracle     | EXPLAIN PLAN statement, Automatic Workload Repository (AWR) |


## Key Metrics to Monitor:

Execution Time: The total time taken for the query to complete.

CPU Time: How much processing power the query consumed.

Logical/Physical Reads: The number of data pages read from memory (logical) or disk (physical). High physical reads indicate an I/O bottleneck.

# Optimization Techniques - Fixing the Problem
Once you've identified a slow query and analyzed its execution plan, you can apply various optimization techniques.

## Indexing Strategies
This is the most common and effective optimization technique. An index is a special data structure that allows the database to find rows quickly without performing a full table scan.

### When to Create an Index:

On columns frequently used in the $WHERE$ clause.

On columns used for $JOIN$ operations (i.e., foreign key columns).

On columns used in the $ORDER BY$ or $GROUP BY$ clause.

### Types of Indexes:

B-Tree Index: The default and most common type, excellent for a wide range of comparisons (=, >, <, $BETWEEN$).

Composite Index: An index on two or more columns (e.g., (lastname, firstname)). The order of columns in the index is crucial and should match the order in your query's $WHERE$ clause.

Covering Index: An index that includes all columns requested in a query's $SELECT$, $WHERE$, and $JOIN$ clauses. This allows the database to answer the query using only the index, without ever touching the actual table, which is extremely fast.

### The Trade-off
Indexes speed up read operations ($SELECT$) but slow down write operations ($INSERT$, $UPDATE$, $DELETE$) because the index must also be updated. Don't over-index a table that has frequent writes.

## Query Rewriting
Sometimes, the best way to improve performance is to write a smarter query.

Avoid $SELECT *$: Only select the columns you actually need. Requesting unnecessary columns increases data transfer over the network and can prevent the use of covering indexes.

Write SARGable Predicates: A "SARGable" (Search Argument-able) predicate is one that allows the database to use an index.

| Non-SARGable (Slow)               | SARGable (Fast)              | Reason                                                  |
|-------------------------------------|--------------------------------|---------------------------------------------------------|
| `WHERE SUBSTRING(name, 1, 3) = 'Rob'` | `WHERE name LIKE 'Rob%'`         | Applying a function to the column prevents index usage. |
|` WHERE date_col + 1 = @SomeDate`      | `WHERE date_col = @SomeDate - 1` | Perform calculations on the variable, not the column.   |
| `WHERE price / 2 = 100`               | `WHERE price = 200`              | Avoid calculations on the indexed column.               |

Prefer $JOIN$ over Subqueries: In many cases, a $JOIN$ is more efficient and readable than a subquery, as the optimizer has more options for reordering and executing the join.

Instead of this:

SQL

SELECT * FROM Orders WHERE CustomerID IN (SELECT CustomerID FROM Customers WHERE Country = 'Germany');
Use this:

SQL

SELECT o.* FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID WHERE c.Country = 'Germany';

## Database Design
A solid foundation is key to performance.

Normalization: A process of organizing columns and tables to minimize data redundancy. This generally improves write performance and data integrity.

Denormalization: The opposite process, where you intentionally add redundant data to one or more tables. This can be used to avoid costly joins and is a common technique in data warehousing to speed up read-heavy analytical queries.

Choose Appropriate Data Types: Use the smallest data type that can reliably hold your data. For example, use TINYINT instead of INT if you only need to store values from 0-255. Smaller data types mean smaller rows, more rows per data page, and less I/O.

## Advanced & Server-Level Techniques
Update Statistics: The query optimizer relies on statistical information about the data distribution in your tables to make smart decisions. If this data is stale (e.g., after many inserts/deletes), the optimizer can generate a poor plan. Regularly update these statistics.

Materialized Views: A materialized view is essentially a pre-computed query result that is stored as a physical table. For complex and frequently executed analytical queries, this can provide a massive performance boost.

Partitioning: For very large tables (VLDBs), you can split the table into smaller, more manageable pieces, or "partitions," based on a column like a date or a region. This allows the database to scan only the relevant partitions instead of the entire table.

# Summary & Checklist
Improving query performance is an iterative process of diagnosing and resolving issues.

Remember the workflow: Profile First, Then Optimize.

Quick Optimization Checklist:
✅ Analyze the Execution Plan: Is there a Full Table Scan?
✅ Check Indexes: Are columns in $WHERE$, $JOIN$, and $ORDER BY$ clauses indexed?
✅ Review Your Query: Are your predicates SARGable? Are you avoiding $SELECT *$?
✅ Update Statistics: Are your database statistics current?
✅ Consider the Design: Is the table properly normalized or denormalized for your use case?