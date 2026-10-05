# Table Design, Compression, and Data Distribution

## Table Design Fundamentals
- While standard dimensional modeling practices still apply logically, the physical storage implementation must account for Redshift’s columnar, distributed nature.

```
Logical Schema (Star Schema)           Physical Realization (Redshift Storage Block)
+-----------------------+              +------------------------------------------+
|      FactSales        |              | Column 1 (Sale_ID)   -> Block 1, Block 2 |
|-----------------------|              | Column 2 (Date_ID)   -> Block 3, Block 4 |
| Sale_ID   (PK)        |  ==========> | Column 3 (Cust_ID)   -> Block 5, Block 6 |
| Date_ID   (FK)        |              | Column 4 (Amount)    -> Block 7, Block 8 |
| Cust_ID   (FK)        |              | [Compressed 1MB immutable block segments]|
| Amount    (NUMERIC)   |              +------------------------------------------+
+-----------------------+
```

### Data Types and Sizing Precision
- Redshift stores data in immutable 1 MB blocks.
- Choosing oversized data types directly impacts query efficiency.
- For string optimization, avoid declaring blanket `VARCHAR(255)` or `VARCHAR(max)` attributes.
- During query execution, Redshift allocates memory for intermediate string processing based on the declared column width, not the actual length of the stored string data.
- Over-allocating `VARCHAR` sizes starves the query engine of RAM, forcing queries to spill to disk.
- Prefer `DATE` or `TIMESTAMP` over string representations (`VARCHAR`).
- Dates are stored internally as 4-byte or 8-byte integers, enabling rapid range scans and efficient compression.
- Use fixed-point `DECIMAL` / `NUMERIC` for precise financial figures.
- For non-exact decimal scientific computations, use `REAL` (4-byte) or `DOUBLE PRECISION` (8-byte).

### Column Ordering Strategy
- Because Redshift is a columnar engine, physical column order does not impact basic read performance.
- However, structural layout best practices recommend:
    - *Sort Key Columns First:* Place the `SORTKEY` columns at the top of the `CREATE TABLE` DDL statement for schema readability.
    - *Variable-Length Columns Last:* Placing fixed-width numeric and timestamp columns ahead of large variable-length `VARCHAR` fields improves execution memory alignment during processing.

### Nullability Constraints
- Always declare columns `NOT NULL` when business rules permit.
- Execution Impact: Nullable columns require an extra bit array per row to track `NULL` flags.
- Optimizer Benefits: The query optimizer uses `NOT NULL` declarations to generate efficient execution plans (e.g., converting costly outer joins to inner joins, or eliminating null-checking steps during aggregation).

### Constraints
- Redshift constraints are informational only and are not enforced on ingestion (`INSERT`, `COPY`).
- De-duplication logic must be handled in stage tables prior to final insertion.
- The query optimizer uses foreign key relationships to perform Join Elimination.

## Compression
- In a columnar database, compression directly translates to query execution speed.
- Less data read from disk means less network transfer time and higher cache efficiency.
- Benefits
    - Reduces overall disk footprint by up to $60-80\%$.
    - Accelerates I/O-bound queries by fetching fewer disk blocks into RAM/Cache.
- Cons
    - Increases CPU overhead during decompression at query runtime and during data ingestion (`COPY` / `INSERT`).

### Automatic Encoding
- Redshift manages encoding through two automated mechanisms.
- Automatic Table Optimization (ATO): Redshift monitors query patterns and automatically adjusts compression encodings in the background without requiring manual DDL changes.
- `COPY` Command Auto-Encoding: When loading data into an empty table using the `COPY` command, Redshift automatically analyzes a sample of the incoming dataset and assigns the optimal column encodings if none were explicitly declared in the schema DDL.

## Data Distribution
- It defines how table rows are partitioned and spread across the Slices of a Redshift cluster.
- Choosing the correct distribution style is the single most critical factor in achieving high query performance.
- `DISTSTYLE EVEN`
    - Rows are distributed in a Round-Robin fashion across all Slices, regardless of the column values within those rows.
    - Use Case: Tables without clear join patterns, staging tables, or when data is analyzed independently of other tables.
    - Advantage: Guarantees uniform data distribution, eliminating data volume skew.
    - Disadvantage: Forces data movement across the network during `JOIN` operations.
- `DISTSTYLE KEY`
    - Requires `DISTKEY`
    - Rows are distributed based on the MD5 hash value of a single designated column (`DISTKEY`).
    - All rows sharing the same hash value are physically placed on the exact same slice.
    - Use Case: Large fact tables and large dimension tables frequently joined together on a common join column (e.g., `customer_id` or `order_id`).
    - Advantage: Enables Co-located Joins. Joins execute locally on each slice without transmitting data across the cluster network.
    - Disadvantage: Bad distribution key choices can cause severe Data Skew if one key value occurs disproportionately often.
- `DISTSTYLE ALL`
    - A complete copy of the entire table is replicated to the primary slice of every compute node in the cluster.
    - Use Case: Small, slow-changing dimension tables (e.g., tables under 3–5 million rows).
    - Advantage: Completely eliminates network data movement when joining small dimension tables against large distributed fact tables.
    - Disadvantage: Increases disk storage consumption across every node and slows down `INSERT`/`UPDATE`/`DELETE` performance, as changes must be synchronized to all copies.
- `DISTSTYLE AUTO`
    - Redshift automatically manages the distribution strategy.
    - New or small tables start as `DISTSTYLE ALL`.
    - If table size expands beyond a threshold, Redshift automatically transitions the table to `DISTSTYLE EVEN` (or `DISTSTYLE KEY` if a key was specified).

## Data redistribution
- When two tables are joined on columns that are not co-located on the same physical slices, Redshift must move rows across the internal cluster network during query execution.
- This dynamic step is known as Data Redistribution.

### Redistribution Mechanics
- During physical plan execution, the Leader Node injects one of three network operations.
- Hash Redistribution
    - If neither table is distributed on the join key, Redshift hashes the join key values of both tables at runtime and streams rows to the appropriate target slices based on those hashes.
    - Cost: High network overhead, high execution delay.
- Broadcast Redistribution
    - Redshift sends a full copy of the entire inner table (typically the smaller table in a join) over the network to every compute node in the cluster.
    - Cost: Moderate to high.
    - Efficient if the inner table is relatively small, but disastrous if both tables contain hundreds of millions of rows.
- Co-located Join
    - Both tables share identical `DISTKEY` definitions and data types, allowing rows with matching keys to reside on the same slice.
    - Cost: Zero network movement. Local CPU memory and disk scans perform the entire join operation.

### Data skew
- It occurs when rows are distributed unevenly across cluster slices.
- Causes of Data Skew:
    - Selecting a `DISTKEY` with low cardinality (e.g., `Gender`, `Status_Code`, or `Is_Active`).
    - Selecting a high-cardinality `DISTKEY` where a single value dominates the dataset.

## Choosing a Distribution Key
- Selecting the correct `DISTKEY` involves evaluating join patterns, column cardinality, data skew, and filter usage.
- Identify the two largest tables in the analytics schema that are frequently joined together.
- Set their join column as the `DISTKEY` for both tables to enable co-located joins.
- Ensure the candidate key has sufficient unique values to distribute rows evenly across all available slices in the cluster.
- Validate that no single key value accounts for a large percentage of total table rows.
- If a candidate key is constantly filtered using strict `WHERE` predicates, choosing it as a `DISTKEY` routes the entire query execution to a single slice, leaving the rest of the cluster idle. In this scenario, choose an alternative distribution key or use `DISTSTYLE EVEN`.
