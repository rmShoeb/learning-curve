# Execution Plans and Query Tuning

https://blogs.oracle.com/mysql/new-json-format-for-explain

Key Learning: It focuses on the evolution of EXPLAIN and EXPLAIN ANALYZE. Specifically, how MySQL 8.3+ introduced a JSON format that matches the modern "Iterator-based" execution engine (similar to how modern SQL Server or Oracle versions display tree-based plans).

Relevance to your list: While not directly related to .ibd files, it is the tool you use to see if Fragmentation is causing a query to perform poorly (e.g., by seeing high actual_rows vs. estimated_rows).

https://dev.mysql.com/doc/refman/8.4/en/optimize-overview.html
https://www.youtube.com/watch?v=lfdqmE5gp6Q