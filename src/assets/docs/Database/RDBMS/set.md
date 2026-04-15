# 06 - Combining Results (SET Operators)
SET operators are used to combine the result sets of two or more SELECT statements. For these to work, each SELECT query must have the same number of columns with compatible data types.
Set operations in SQL allow you to combine results from multiple queries. These operations treat query results as mathematical sets and provide powerful ways to merge, compare, and filter data.

## The Operators
UNION: Combines two result sets and removes duplicate rows.

UNION ALL: Combines two result sets and includes all rows, including duplicates. (It's faster because it doesn't check for duplicates).

INTERSECT: Returns only the rows that exist in both result sets.

EXCEPT (or MINUS in Oracle): Returns rows from the first result set that do not exist in the second one.

## Example Scenario
Imagine we have two tables: FullTimeEmployees and PartTimeEmployees.

```sql
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
```

**Oracle vs SQL Server Set Operations:**

```sql
-- Oracle MINUS vs SQL Server EXCEPT
-- Oracle:
SELECT part_number FROM approved_parts
MINUS
SELECT part_number FROM rejected_parts;

-- SQL Server equivalent:
SELECT part_number FROM approved_parts
EXCEPT
SELECT part_number FROM rejected_parts;

-- Both databases support UNION and INTERSECT with same syntax
```

### Performance Considerations

**Optimizing Set Operations:**

```sql
-- Use appropriate indexes for set operations
CREATE INDEX idx_customer_status ON customers(status, last_login_date);
CREATE INDEX idx_employee_status ON employees(status, last_access_date);

-- Use UNION ALL when duplicates don't matter (much faster)
SELECT order_id, 'CURRENT' as period FROM current_orders
UNION ALL  -- Faster than UNION
SELECT order_id, 'ARCHIVE' as period FROM archived_orders;

-- Consider using EXISTS instead of INTERSECT for better performance
-- Instead of INTERSECT:
SELECT customer_id FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.order_date >= '2023-01-01'
);
```


### Use Cases Summary

| Operation | Use Case | Example |
|-----------|----------|---------|
| **UNION** | Combine similar data from different sources | Merge customer lists from different regions |
| **UNION ALL** | Combine data including duplicates | Historical data aggregation |
| **INTERSECT** | Find common elements | Customers who are also employees |
| **EXCEPT/MINUS** | Find differences | Products without sales |

### Best Practices

1. **Ensure Compatible Schemas**: All queries in set operations must have the same number of columns with compatible data types
2. **Use Column Aliases**: Make result sets clear and consistent
3. **Consider Performance**: UNION ALL is faster than UNION when duplicates don't matter
4. **Index Appropriately**: Create indexes on columns used in set operations
5. **Test Cross-Database**: Verify syntax differences between Oracle and SQL Server