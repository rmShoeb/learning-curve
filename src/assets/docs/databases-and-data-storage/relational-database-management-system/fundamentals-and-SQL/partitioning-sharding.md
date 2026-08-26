# 25 - Partitioning and Sharding
Both partitioning and sharding are techniques used to manage very large databases (VLDBs) by breaking them down. However, they do it in fundamentally different ways.

## Partitioning (Scaling Up)
Partitioning is the process of splitting a very large table into smaller, more manageable pieces called partitions, but all these pieces still reside on a single database server. The database system knows how the data is split and handles it transparently to the application.

How it works: You define a "partition key" and a rule.

Range Partitioning: Partitions based on a range of values (e.g., one partition for each month of sales data).

List Partitioning: Partitions based on a list of discrete values (e.g., one partition for each country in a users table).

Hash Partitioning: Distributes data evenly across partitions based on a hash of the partition key.

Key Benefit: Partition Pruning. When you query with a WHERE clause on the partition key (e.g., WHERE sale_date = '2025-08-23'), the database only scans the relevant partition, dramatically speeding up queries.

## Sharding (Scaling Out)
Sharding is the process of splitting a database's data across multiple database servers. Each server (a "shard") holds a subset of the data. Unlike partitioning, sharding is not typically handled transparently by the database itself; it adds complexity to the application or middleware layer.

How it works: A "shard key" determines which server a piece of data lives on. For example, you could shard a users table based on user_id, with users 1-1,000,000 on Server A, users 1,000,001-2,000,000 on Server B, and so on.

Key Benefit: Horizontal Scalability. It distributes the load (CPU, RAM, disk I/O) across multiple machines, allowing your application to handle massive amounts of data and traffic that a single server could not.

## Partitioning vs. Sharding: The Key Difference

| Feature    | Partitioning                        | Sharding                              |
|------------|-------------------------------------|---------------------------------------|
| Scope      | One database, one server            | Multiple servers                      |
| Goal       | Improve performance & manageability | Increase capacity & throughput        |
| Complexity | Low (managed by DB system)          | High (managed by application)         |
| Analogy    | A book divided into chapters        | A book series across multiple volumes |