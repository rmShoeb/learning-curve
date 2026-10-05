# Partitions and data distribution
- A partition is an allocation of storage for a table, automatically replicated across multiple Availability Zones within an AWS Region.
- Partition management is handled entirely by DynamoDB.
- DynamoDB allocates sufficient partitions to the table during `CREATING` phase of the table so that it can handle provisioned throughput requirements.
- DynamoDB allocates additional partitions to a table if
    - If the table's provisioned throughput settings is increased beyond what the existing partitions can support.
    - If an existing partition fills to capacity and more storage space is required.
- Global secondary indexes in DynamoDB are also composed of partitions, and are stored in separate partition than the base table.

## Data distribution

### Partition key
- If a table has primary key with partition key only, DynamoDB stores and retrieves each item based on its partition key value.
- The value is used in a hash function and the output value determines the partition in which the item will be stored.
- to read an item, the corresponding partition key value must be passed, which is used by the hash function to locate the partition and the item.
- It is recommended to choose a partition key that can have a large number of distinct values relative to the number of items in the table, so that DynamoDB can uniformly distribute items accross partitions.

### Partition key and sort key
- When the primary key has both partition key and sort key, DynamoDB uses the partition key find the partition same manner as simple primary key.
- However, it tends to keep items which have the same value of partition key close together and in sorted order by the sort key attribute's value.
- The set of items which have the same value of partition key is called an item collection.
- If there is no local secondary index on the table, DynamoDB automatically splits item collection over as many partitions as required to store the data and to serve read and write throughput.
- To read an item from the table, its partition key value and sort key value must be specified.
- In a DynamoDB table, there is no upper limit on the number of distinct sort key values per partition key value.

## Best practices
### Partition Key Design
#### Distributing workloads
- Every partition in a DynamoDB table is designed to deliver a maximum capacity of 3,000 read units per second and 1,000 write units per second.
- One read unit represents one strongly consistent read operation per second, or two eventually consistent read operations per second, for an item up to 4 KB in size.
- One write unit represents one write operation per second for an item up to 1 KB in size.
- If the table has an item size of 20 KB, a single consistent read operation will consume 5 read units.
- A partition key design that doesn't distribute I/O requests effectively can create "hot" partitions that result in throttling and use provisioned I/O capacity inefficiently.
- The optimal usage of a table's provisioned throughput depends not only on the workload patterns of individual items, but also on the partition key design.
- The more distinct partition key values that the workload accesses, the more those requests will be spread across the partitioned space.
- If a single table has only a small number of partition key values, write operations should be distributed across more distinct partition key values.

#### Write sharding
- One way to better distribute writes across a partition key space is to expand the space.
    - **Sharding using random suffixes:** Add a random number to the end of the partition key values and randomize the writes across the larger space. This results in better parallelism and higher overall throughput. But it is difficult to read a specific item because application do not know which suffix value was used when writing the item.
    - **Sharding using calculated suffixes:** Instead of a random number, a calculated number (something that can be generated again later to read items) is used when writing an item.
    - **Uploading data efficiently:**
        - When loading data from other data sources, DynamoDB partitions the  table data on multiple servers. To get better performance, data should be uploaded to all the allocated servers simultaneously.
        - Sorted writes direct all initial traffic to a single partition. Shuffle the input file order prior to upload.
        - Use `BatchWriteItem` to group operations to minimize network overhead.

### Sort key design
- Structure sort keys using prefixes and logical delimiters (`#`, `:`, `-`) to maintain hierarchies within a single partition key.
    ```
    Format:  <ENTITY_TYPE>#<DATE_OR_STATUS>#<UNIQUE_ID>
    Example: ORDER#2026-03-30#ORD-88214
    ```

### Secondary indexes
- Keep the number of indexes to a minimum. Indexes that are seldom used contribute to increased storage and I/O costs without improving application performance.
- Use GSIs by default for operational flexibility.
- Use LSIs only when strongly consistent reads are required within a partition key collection.
- To get the fastest queries with the lowest possible latency, project all the attributes that those queries are expected to return.
- When creating a local secondary index, think about how much data will be written to it, and how many of those data items will have the same partition key value. If a partition key value can exceed 10 GB in size, consider not creating that index.
- Consider designing a global secondary index to be sparse when both better performance and lower write throughput than that of the base table are required.
- Rather than creating individual GSIs per access pattern, design generic GSI key names and reuse the index across multiple entity types.