# Introduction to Amazon Redshift

## What Redshift is
- It is a fully managed, enterprise-class, cloud-native Data Warehouse designed specifically for Online Analytical Processing (OLAP) workloads.
- While transactional databases (OLTP) optimize for rapid row-by-row operations (inserts, updates, lookups), Redshift is architected to perform complex analytical aggregations and scans across petabytes of structured and semi-structured data with low latency.

### MPP (Massively Parallel Processing) Architecture
- Redshift scales horizontally by distributing dataset partitions and execution workloads across an array of computing instances (nodes) working in parallel.
- A single query is decomposed into smaller units of execution, compiled into parallel executable code, and assigned across hundreds of processing units (slices) simultaneously.

## Columnar Data Storage
How RDBMS stores data on disk:
![How RDBMS stores data](https://docs.aws.amazon.com/images/redshift/latest/dg/images/03a-Rows-vs-Columns.png)

How columnar data storage stores data on disk:
![How columnar data storage stores data on disk](https://docs.aws.amazon.com/images/redshift/latest/dg/images/03b-Rows-vs-Columns.png)

- Traditional databases store data as contiguous rows on disk.
- In contrast, Redshift organizes data sequentially by column.
- A query computing `SELECT SUM(Amount) FROM Sales` reads only the blocks holding data for `Amount`.
- Redshift skips all physical disk storage for other columns, avoiding unnecessary I/O overhead.
- Because values within the same column share the same data type, compression algorithms achieve significantly higher ratios compared to row storage.
- Higher compression means less data transferred from storage into RAM.

## Redshift architecture
- In modern Redshift architecture (specifically the RA3 node family), compute resources are decoupled from persistent storage.
- Data resides permanently in Redshift Managed Storage (RMS), a high-durability, S3-backed storage tier.
- Compute nodes cache warm working sets on high-performance local NVMe SSDs, scaling compute instances up or down independently of storage size without expensive, manual data re-platforming.
- A Redshift deployment (termed a Cluster) consists of a single Leader Node and one or more Compute Nodes coordinated over a high-speed private network fabric.
- **Leader Node**
    - Architectural role: Control Plane / Coordinator
    - Terminates client JDBC/ODBC connections.
    - Parses, rewrites, and optimizes SQL queries.
    - Compiles Execution Plans into execution code (C++).
    - Distributes execution workloads to Compute Nodes.
    - Aggregates partial intermediate results from Compute Nodes into a final client response.
    - Does system catalog metadata management.
- **Compute Nodes**
    - Architectural role: Data Plane / Execution
    - Executes compiled query segments in parallel.
    - Stores intermediate step outputs in memory/local disk.
    - Hydrates local SSD caches from Redshift Managed Storage (RMS).
    - Performes local joins, filtering, and aggregations.
- Node Slices
    - Architectural role: Parallel Processing Unit
    - Each Compute Node is divided into virtual processing units called Slices.
    - A Slice gets a dedicated allocation of CPU cores, memory, and assigned disk partitions.
    - Slices perform work completely in parallel with other slices.
- Redshift Managed Storage (RMS)
    - Architectural role: Persistent Storage Layer	
    - S3-backed persistent storage layer providing ~$100\%$ durability.
    - Automatically manages data block replication, block layout on disk, and tiering to local compute NVMe caches.

```
                         +--------------------------+
                         |      Client Layer        |
                         |  (JDBC / ODBC / Data API)|
                         +------------+-------------+
                                      |
                                      v
                        +----------------------------+
                        |        LEADER NODE         |
                        | - SQL Parser & Optimizer   |
                        | - Code Compiler            |
                        | - Coordinator / Aggregator |
                        +--------------+-------------+
                                       |
                   +-------------------+-------------------+
                   | High-Speed Private Network Fabric     |
                   +---------+-------------------+---------+
                             |                   |
                             v                   v
                   +------------------+ +------------------+
                   |  COMPUTE NODE 0  | |  COMPUTE NODE 1  |
                   | +--------------+ | | +--------------+ |
                   | |   Slice 0    | | | |   Slice 2    | |
                   | +--------------+ | | +--------------+ |
                   | |   Slice 1    | | | |   Slice 3    | |
                   | +--------------+ | | +--------------+ |
                   +--------+---------+ +--------+---------+
                            |                    |
                            +---------+----------+
                                      |
                                      v
                   +---------------------------------------+
                   |     Redshift Managed Storage (RMS)    |
                   |         (S3-Backed Shared Tier)       |
                   +---------------------------------------+
```

### Query Execution Lifecycle
- When a client application executes a statement against Redshift:
- The Leader Node parses the SQL string, validates permissions, and passes the query tree to the query optimizer.
- The optimizer uses table statistics (`ANALYZE`) to construct an optimal distribution execution plan.
- Unlike conventional databases that interpret query trees at runtime, the Leader Node compiles optimized execution plans into C++ code segments.
- These compiled machine instructions are cached for reuse across identical query patterns.
- Compiled code is dispatched to the Compute Nodes.
- Each Slice evaluates its local data partitions concurrently.
- Slices exchange data across the network if a query step requires redistribution (e.g., performing a `JOIN` across tables distributed differently).
- Compute Nodes return partial aggregations back to the Leader Node.
- The Leader Node merges these fragments into the final client dataset and returns it over the JDBC/ODBC stream.

## Redshift vs. Traditional Databases
- While Redshift originally derived from PostgreSQL 8.0.2 syntax standards for JDBC/ODBC driver compatibility, its internal engine, storage format, query processor, and operational assumptions are fundamentally different.
- In Redshift, primary and foreign key constraints are informational metadata used exclusively by the query optimizer to guide join strategy planning.
- Inserting duplicate values into a column declared `PRIMARY KEY` will succeed silently, leading to incorrect query results.
- Traditional B-Tree indexing is inefficient for multi-terabyte data warehouses because keeping indexes updated degrades write throughput, and indexes quickly outgrow available RAM.
- Redshift replaces indexes with Sort Keys and block-level Zone Maps.
- Single-Row Operations Are an Anti-Pattern. Operating Redshift with high-frequency single-row operations causes extreme queue bottlenecks. Bulk loading via `COPY` from Amazon S3 is the standard ingest path.

| Dimension                | PostgreSQL (OLTP)                  | Amazon Redshift (OLAP)              |
|--------------------------|------------------------------------|-------------------------------------|
| Primary Workload Target  | Transactional (High Concurrency, Low Latency) | Analytical (Low-to-Medium Concurrency, High Throughput) |
| Storage Layout           | Row-Oriented                       | Columnar                            |
| Execution Architecture   | Single Instance / Symmetric Multi-Processing (SMP) | Massively Parallel Processing (MPP) Distributed Cluster |
| Primary Keys & Uniqueness| Enforced via Indexes               | Informational ONLY (NOT ENFORCED)   |
| Foreign Key Constraints  | Enforced via Indexes/Triggers      | Informational ONLY (NOT ENFORCED)   |
| Indexes                  | B-Tree, GIN, GiST                  | None (Uses Sort Keys & Zone Maps)   |
| Compression Encodings    | Page-level TOAST / Basic           | Column-level Encodings (ZSTD, LZO, AZ64, Run-Length, Byte-Dict) |