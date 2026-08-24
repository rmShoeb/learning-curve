# Execution Plans

### Execution Plan Analysis
- It is the process of examining the step-by-step "roadmap" that the database's Query Optimizer creates to retrieve the data for a query.
- By analyzing this plan, we can verify whether the database is using our indexes efficiently, or if it's resorting to slow, brute-force methods.

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

## The Query Optimizer
Introduction to Execution Plans: Logical vs. Physical plans.
The Query Lifecycle: Parsing $\rightarrow$ Binding $\rightarrow$ Optimization $\rightarrow$ Execution.
Cost-Based Optimization: How the DB "prices" different strategies (CPU, I/O, Memory).

## Statistics
Statistics Overview: What they are (Histograms, Density Vectors).
Cardinality Estimation: How the DB guesses how many rows will be returned.
Stale Statistics: The impact of outdated stats on plan quality.

## Capturing Execution Plans
Estimated vs. Actual Plans: The critical difference (runtime metrics vs. theoretical).
Methods of Capture: SSMS (CTRL+L, CTRL+M), Trace Flags, Extended Events.
Live Query Statistics: Watching the data flow in real-time.

## Reading Execution Plans (The Basics)
Data Flow Direction: Reading from right-to-left, top-to-bottom.
Visual Elements: Arrow thickness (row counts) and Icon types.
Properties Window: Inspecting "Actual Number of Rows" vs. "Estimated Number of Rows".

## The Operator Toolkit (Vocabulary)
Data Access Operators: Table Scan vs. Index Scan vs. Index Seek.
Key Lookups (The "Hidden" Cost).
Join Operators: Nested Loops (Good for small data).
Hash Match (Good for large unsorted data).
Merge Join (Good for large sorted data).
Aggregation & Sorting: Stream Aggregate, Hash Aggregate, Sort

## Common Performance Pitfalls
Parameter Sniffing: When a plan built for one value ruins performance for another.
Implicit Conversions: Data type mismatches causing index scans (VARCHAR vs. NVARCHAR).
Spills to TempDB: Sort/Hash warnings (The yellow bang icon ⚠️).

## Advanced Troubleshooting
Plan Cache & Recompilation: Why plans are reused or discarded.
Query Store (SQL Server): Tracking plan regressions over time.
Index Tuning Advice: Interpreting the "Missing Index" suggestions in a plan.

## Resources
