# Improve RDBMS query performance through Profiling and Optimization techniques
https://dataschool.com/sql-optimization/optimization-using-explain/

# Introduction: The Need for Speed
In any application that relies on a Relational Database Management System (RDBMS), query performance is critical. It directly impacts application responsiveness, user satisfaction, and system scalability. Slow queries can bog down an entire system, leading to timeouts and a poor user experience.

The process of improving query performance is a two-step cycle:

Profiling: The diagnostic phase. This involves identifying which queries are slow and understanding why they are slow. You can't fix a problem you don't understand.

Optimization: The treatment phase. This involves applying various techniques to rewrite queries, modify the database schema, or adjust server configurations to make the query run faster.

Think of it like a car mechanic: first, they run diagnostics to find the problem (profiling), then they repair or tune the engine (optimization).

# Summary & Checklist
Improving query performance is an iterative process of diagnosing and resolving issues.

Remember the workflow: Profile First, Then Optimize.

Quick Optimization Checklist:
✅ Analyze the Execution Plan: Is there a Full Table Scan?
✅ Check Indexes: Are columns in $WHERE$, $JOIN$, and $ORDER BY$ clauses indexed?
✅ Review Your Query: Are your predicates SARGable? Are you avoiding $SELECT *$?
✅ Update Statistics: Are your database statistics current?
✅ Consider the Design: Is the table properly normalized or denormalized for your use case?




# from other parts

**Performance Considerations:**

```sql
-- Correlated subquery (potentially slow)
SELECT customer_name
FROM customers c
WHERE (
    SELECT COUNT(*)
    FROM orders o
    WHERE o.customer_id = c.customer_id
) > 5;

-- Better: Join or CTE approach
WITH customer_order_counts AS (
    SELECT 
        customer_id,
        COUNT(*) AS order_count
    FROM orders
    GROUP BY customer_id
)
SELECT c.customer_name
FROM customers c
INNER JOIN customer_order_counts coc ON c.customer_id = coc.customer_id
WHERE coc.order_count > 5;

-- Sometimes EXISTS is fastest for checking existence
SELECT customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
      AND o.total_amount > 1000
);
```