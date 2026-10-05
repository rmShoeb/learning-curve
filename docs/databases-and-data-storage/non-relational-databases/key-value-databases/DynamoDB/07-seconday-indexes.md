# Secondary Indexes
- A secondary index lets querying the data in the table using an alternate key.
- They give applications more flexibility when querying data.
- When creating an index, we have to specify which attributes will be copied, or projected, from the base table to the index.
- At a minimum, DynamoDB projects the key attributes from the base table into the index.
- For any item in a table, DynamoDB writes a corresponding index entry only if the index key attributes are present in the item.

## Global secondary index
- An index with a partition key and sort key that can be different from those on the table.
- The primary key values in global secondary indexes don't need to be unique.
- These indexes span the entire table, allowing to query across all partition keys.
- Data is asynchronously replicated from the main table to the GSI partition nodes. This consumes WCUs on the GSI separately from the base table.
- Reading or querying a GSI consumes RCUs from the it's own provisioned/on-demand throughput capacity.
- If the index does not have all the attributes requested in a query, those will not be fetched from base table automatically (unlike LSI).
- To minimize costs, developers project only the fields required for the immediate query.
- If a GSI runs out of provisioned write capacity (or hits partition limits), DynamoDB applies backpressure to the base table.
- A table in DynamoDB can have 20 GSIs.

## Local secondary index
- An index that has the same partition key as the table, but a different sort key.
- It is co-located on the same physical storage partition as the main table item.
- Updating an LSI consumes WCUs directly from the base table’s allocated write capacity.
- Reading from an LSI consumes RCUs from the base table's capacity.
- If the index only projects `KEYS_ONLY` or `INCLUDE` and a query requests non-projected attributes, DynamoDB must perform an additional read against the base table. This doubles the read capacity cost for that request.
- A table in DynamoDB can have 5 LSIs.

## Sparse Indexes
- If an item lacks the attribute defined as an index partition key or sort key, DynamoDB does not add that item to the secondary index.
- AWS designates this pattern a Sparse Index.
- Global secondary indexes are sparse by default.

## Index projection
- It defines the set of attributes copied (projected) from the base table into a Secondary Index.
- When an item is written or updated in the base table, DynamoDB automatically copies the projected attributes to the index.
- They directly affect storage costs, write capacity consumption, and query performance.
- `KEYS_ONLY`
    - Projects only the base table primary key(s) (`PK`, `SK`) and the secondary index primary key(s) (`GSI_PK`, `GSI_SK`) into the index.
    - Storage requirement is minimal.
    - Lowest WCU consumption when writing updates to the index.
    - Best use case is when there is only need to evaluate existence or retrieve item IDs (primary keys) to perform a follow-up batch read later.
- `INCLUDE`
    - Projects the base table primary keys, index primary keys, plus a specific list of non-key attributes that are explicitly defined (`NonKeyAttributes`).
    - Storage requirement and WCU scales based on selected attributes.
    - Best use case is when an access pattern requires specific extra fields to satisfy an API view without fetching the entire item payload.
- `ALL`
    - Projects every attribute from the base table into the secondary index.
    - Since this duplicates the whole base table record, storage consumption and WCU are highest.
    - Best use case is when index queries require access to unpredictable or variable attributes, and avoiding table back-fetches is a strict requirement.

| Feature / Impact     | `KEYS_ONLY`                      | `INCLUDE`                                    | `ALL`                              |
|----------------------|----------------------------------|----------------------------------------------|------------------------------------|
| Attributes Copied    | Base Keys + Index Keys           | Base Keys + Index Keys + Explicit Attributes | All attributes from the base table |
| Storage Overhead     | Lowest                           | Moderate                                     | Highest (Full duplication)         |
| Write Cost (WCU)     | Lowest                           | Moderate                                     | Highest                            |
| Risk of Back-Fetches | High (If payload data is needed) | Low (If patterns are well-defined)           | Zero (All data present in index)   |

## Back-Fetches
- It occurs when a query on a secondary index does not contain all the requested attributes in its projection.
- If an application requests an attribute not present in a `KEYS_ONLY` or `INCLUDE` projection, then
    - app queries the index to retrieve the primary key (`PK`/`SK`).
    - app must issue a second API call (`GetItem` or `BatchGetItem`) to the base table using those keys to retrieve the missing attributes.
- **Optimization Rule:** Design `INCLUDE` projections to cover 100% of the attributes needed by that specific access pattern. This avoids extra network round-trips and base-table read operations.