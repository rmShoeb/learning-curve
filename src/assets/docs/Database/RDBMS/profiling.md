# 23 - Profiling: Finding the Bottleneck
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