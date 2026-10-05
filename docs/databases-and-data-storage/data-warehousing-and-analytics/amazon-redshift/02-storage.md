# Storage Architecture

## Columnar Storage Fundamentals
- Consider a database table containing financial transactions with four attributes: `Account_ID` (A), `Transaction_Date` (B), `Amount` (C), and `Merchant_Code` (D).
- In an OLTP system, data is written to disk sequentially row by row. This optimizes single-row lookups.
- However, analytical queries (OLAP) rarely select all columns.

```
Traditional Row-Oriented Storage Layout (OLTP):
+-----------------+-----------------+-----------------+
| Block 0         | Block 1         | Block 2         |
| [A1 B1 C1 D1]   | [A2 B2 C2 D2]   | [A3 B3 C3 D3]   |
+-----------------+-----------------+-----------------+

Columnar Storage Layout (Redshift OLAP):
+-----------------+-----------------+-----------------+-----------------+
| Block 0         | Block 1         | Block 2         | Block 3         |
| [A1 A2 A3 A4]   | [B1 B2 B3 B4]   | [C1 C2 C3 C4]   | [D1 D2 D3 D4]   |
+-----------------+-----------------+-----------------+-----------------+
```

### Mechanics of Read Efficiency
For the following query:
```sql
SELECT Transaction_Date, SUM(Amount) 
FROM transactions 
GROUP BY Transaction_Date;
```

- Row-Oriented Execution Path:
    1. The database engine must scan every single disk block containing table data.
    2. For each row, the engine reads `Account_ID` (A), `Transaction_Date` (B), `Amount` (C), and `Merchant_Code` (D) into RAM.
    3. The engine discards A and D in memory, keeping only B and C.
    4. Result: 50% to 90% of the network and disk I/O bandwidth is wasted reading unused column data.
- Columnar Execution Path:
    1. Redshift identifies that the query only requests columns B (`Transaction_Date`) and C (`Amount`).
    2. The storage engine reads only the 1MB disk blocks associated with columns B and C.
    3. Blocks containing columns A and D are skipped entirely at the physical storage layer.
    4. Result: Read I/O drops drastically, accelerating query performance proportionally to the ratio of requested columns to total table columns.

## Compression
- In a row-oriented system, adjacent bytes represent completely different data types and domains.
- Because neighboring bytes exhibit high entropy and low repeating patterns, compression algorithms achieve low compression ratios.
- In Redshift's columnar storage, every byte within a 1MB block represents the same attribute type and domain.
- This helps to the effectiveness of data compression algorithms
- Fixed-width integer, float, and temporal types align with hardware CPU register boundaries, enabling vector instruction optimizations.
- Columns like State_Code or OrderStatus contain repeating string patterns, allowing algorithms like Byte-Dictionary or Run-Length Encoding to compress data volumes by up to $80–90\%$.

## Zone maps
- Redshift handles rapid row filtering using Zone Maps paired with Sort Keys, instead of using standard B-Tree indexes.
- B-Tree indexes are inefficient for multi-terabyte analytical tables because keeping index structures updated during bulk inserts causes heavy write overhead, and the index files themselves quickly outgrow available memory.
- A Zone Map is an in-memory metadata structure maintained automatically by the Leader Node for every 1MB data block in the cluster.
- For every single column block stored on disk, the Zone Map records the minimum and maximum values present in that 1MB block.

```
ZONE MAP METADATA (In Memory)
+------------+----------------------+----------------------+
| Block ID   | Min_Value (Date)     | Max_Value (Date)     |
+------------+----------------------+----------------------+
| Block 101  | 2026-01-01           | 2026-01-15           |
| Block 102  | 2026-01-16           | 2026-01-31           |
| Block 103  | 2026-02-01           | 2026-02-15           |
| Block 104  | 2026-02-16           | 2026-02-28           |
+------------+----------------------+----------------------+

QUERY FILTER: WHERE Date >= '2026-02-01' AND Date <= '2026-02-15'

EVALUATION ENGINE:
- Block 101: Range [Jan 01 - Jan 15] -> SKIP DISK READ
- Block 102: Range [Jan 16 - Jan 31] -> SKIP DISK READ
- Block 103: Range [Feb 01 - Feb 15] -> MATCH! Read Block 103 into RAM
- Block 104: Range [Feb 16 - Feb 28] -> SKIP DISK READ
```

- This skipping process is called Block Pruning.
- On multi-terabyte tables, Zone Maps allow Redshift to bypass 99% of physical disk reads during ranged query evaluations.

### Sort Key Association
- Zone maps rely directly on how physically ordered data is on disk.
- If data is loaded into Redshift without a sort order, values are scattered across disk blocks at random.
- Because every block's [MIN, MAX] range spans the entire domain of the dataset, Zone Maps become ineffective, forcing Redshift to scan every single block on disk.
- By defining a `SORTKEY` on the filter column, incoming data is physically ordered on disk.

## Data locality
- It refers to how physically close data is to the compute cores executing a query.
- Minimizing distance across storage layers is essential to maximizing query throughput.

```
Latency
+-------+   +---------------------------------------+
| < 1ms |   |     Compute Node RAM / CPU Cache      |
+-------+   +---------------------------------------+
                ^                               ^
                | Local Cache Hit               | Local Cache Miss
                v                               v
+-------+   +---------------------------------------+
| ~2-5ms|   |       Local NVMe SSD Storage Cache    |
+-------+   +---------------------------------------+
                            ^
                            | Eviction / Page Fetch
                            v
+-------+   +---------------------------------------+
|50ms+  |   | Redshift Managed Storage (RMS / S3)   |
+-------+   +---------------------------------------+
```

| Query Access Pattern              | Operational Mechanism & Execution Speed                                                                            |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Local Cache Hit (NVMe SSD)        | High-speed localized read. Execution completes in sub-second to low-second ranges.                                 |
| Local Cache Miss (RMS Fetch)      | Requires streaming data blocks over the internal network from RMS into local NVMe storage. Higher initial latency. |
| Un-colocated Join (Network Shift) | Data must cross the cluster network inter-node fabric to match target join key slices. Worst-case latency.         |