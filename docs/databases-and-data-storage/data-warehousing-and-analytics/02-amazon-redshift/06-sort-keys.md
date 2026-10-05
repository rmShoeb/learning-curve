# Sort Keys

## Why sort keys matter
- In traditional RDBMS systems, B-Tree indexes optimize query lookups by maintaining a separate, pointer-dense tree structure on disk.
- In Amazon Redshift, maintaining B-Tree indexes for multi-billion-row datasets introduces unbearable write amplification and storage memory overhead.
- Redshift replaces indexes by physically ordering table rows on disk using Sort Keys.
- When data is physically stored in sorted order, the min/max values in Zone Maps tighten significantly.
- When a query contains a range or equality predicate, Redshift compares the query parameters against Zone Map metadata in memory, bypassing disk reads for non-matching blocks.
- Queries filtering on contiguous ranges scan consecutive disk blocks, converting random disk reads into high-throughput sequential reads.
- If two large tables are both distributed on their join key and sorted on that same join key, Redshift executes a Sort-Merge Join. This avoids building hash tables in memory or streaming data across the network, executing the join in $O(N + M)$ linear time.

## Sort key types

### Compound Sort Keys
- This is the default.
- A Compound Sort Key consists of an ordered list of columns defined in a specific hierarchy, e.g. `COMPOUND SORTKEY(col1, col2, col3)`.
- How it works:
    - Data is sorted primarily by `col1`.
    - Rows with identical values for `col1` are then sorted by `col2`, and so on, using standard lexicographical ordering.
- Best Use Cases:
    - Queries filtering on a hierarchy of columns.
    - Queries containing `GROUP BY` or `ORDER BY` clauses matching the key order.
    - Joins matching the leading column of the key.
- Limitations: If a query filters on `col2` or `col3` without filtering on the leading column col1, the Zone Maps for `col2` become largely useless, forcing full block scans.

### Interleaved Sort Keys
- An Interleaved Sort Key gives equal weight to every column declared in the key.
- `INTERLEAVED SORTKEY(col1, col2)`
- How it works:
    - Interleaved sorting maps multi-dimensional column spaces into a 1D sequence of disk blocks, ensuring that filters on any combination of the specified columns can prune blocks effectively.
- Best Use Cases:
    - Large tables (100M+ rows) queried across varying combinations of non-hierarchical attributes.
- Trade-offs:
    - Incompatible with AZ64: Columns in an interleaved sort key cannot use AZ64 compression encoding (RAW or ZSTD must be used).
    - Ingestion Overhead: Loading data into interleaved tables is significantly slower because Redshift must recompute Z-ordering during writes.
    - Heavy Maintenance: Interleaved keys require long, resource-intensive `VACUUM REINDEX` operations to maintain physical order as new data is inserted.

### Automatic Sort Keys
- When a table is defined with `SORTKEY AUTO` (or no sort key is specified), Redshift monitors query access patterns in the background using Automatic Table Optimization.
- If it detects that adding or altering a compound sort key will improve query execution times, it automatically restructures table sort orders in the background without locking client transactions.

## Choosing sort keys
- Selecting the correct sort key requires analyzing query workloads, predicate patterns, and table cardinalities.
- Identify the columns most frequently used in `WHERE` clauses across the analytical queries.
- If two large distributed tables are frequently joined together, setting the join column as both the `DISTKEY` and the `SORTKEY` enables high-performance co-located Merge Joins.
- If queries perform aggregations, placing those columns in the sort key allows Redshift to process rows pre-grouped in memory, bypassing costly runtime hashing or sorting phases.

| Workload Pattern                   | Recommended Sort Key Strategy                                 |
|------------------------------------|---------------------------------------------------------------|
| Time-Series / Event Logs           | Place the timestamp column first in a compound sort key.      |
| Frequent Range Predicates          | Lead with the most frequently filtered range column.          |
| Frequent Join / Dimension Lookup   | Match the `SORTKEY` to the `DISTKEY` or primary join column.  |
| Low-Cardinality + High-Cardinality | Lead with the low-cardinality column, followed by high.       |
| Ad-hoc Multi-Column Filtering      | Use interleaved sort key (or rely on `SORTKEY AUTO`).         |


## Unsorted data
- When data is loaded into Redshift using `COPY` or `INSERT`, Redshift appends new rows to an unsorted append-only region at the end of the table's disk blocks to keep ingest throughput high.
- The unsorted region has wide, unbounded min/max ranges in its Zone Maps.
- Consequently, every query filtering on the sort key must scan 100% of the unsorted blocks, bypassing block pruning benefits for that section of the table.
- As the unsorted percentage grows, query execution times degrade linearly.
- If pre-sorted data is appended though, Redshift automatically merges the new rows directly into the sorted region without creating unsorted blocks.