# Core Components
- In DynamoDB, tables, items, and attributes are the core components to work with.
- A table is a collection of items, and each item is a collection of attributes.
- Items in DynamoDB are similar in many ways to rows, records, or tuples in other database systems.
- Attributes in DynamoDB are similar in many ways to fields or columns in other database systems. DynamoDB supports nested attributes up to 32 levels deep.
- DynamoDB uses primary keys to uniquely identify each item in a table.
- Other than the primary key, the tables are schemaless, which means that neither the attributes nor their data types need to be defined beforehand. Each item can have its own distinct attributes.

## Tables
- When creating a table or a secondary index, the names and data types of each primary key attribute must be specified.
- Each primary key attribute must be defined as type string, number, or binary.
- Every DynamoDB table is associated with a table class, and there are two table classes designed to help optimizing for cost.
    - The Standard table class is the default, and is recommended for the vast majority of workloads. This is the default.
    - The Standard-Infrequent Access table class is optimized for tables where storage is the dominant cost and data is infrequently accessed. For example, application logs, old social media posts, e-commerce order history, etc.

### Primary Key
- The primary key uniquely identifies each item in the table, so that no two items can have the same key.
- When creating a table, a primary key for it must be specified.
- Each primary key attribute must be a scalar (meaning that it can hold only a single value). The only data types allowed for primary key attributes are string, number, or binary. There are no such restrictions for other, non-key attributes.
- DynamoDB supports two different kinds of primary keys.

#### Partition Key
- A simple primary key, composed of one attribute known as the partition key.
- DynamoDB uses the partition key's value as input to an internal hash function. The output from the hash function determines the partition in which the item will be stored.
- The partition key of an item is also known as its hash attribute.
- In a table that has only a partition key, no two items can have the same partition key value.

#### Composite Primary Key
- First attribute is the partition key, and the second attribute is the sort key.
- Partition key is used to generate the hash function to determine the storage partition.
- The Sort Key dictates how data is structured, ordered, and accessed within that partition.
- In a table that has a partition key and a sort key, it's possible for multiple items to have the same partition key value. However, those items must have different sort key values.
- This allows to model 1:N and N:M relationships without using complex SQL joins.
- This allows applications to query items using `KeyConditionExpression` and built-in operators: `begins_with()`, `BETWEEN`, `>`, `<`, `>=`, `<=`.
- The sort key of an item is also known as its range attribute.

### Global Tables
- For applications serving a global user base or requiring strict multi-region disaster recovery, single-region deployment models present latency and availability bottlenecks.
- DynamoDB Global Tables provide a fully managed, multi-region, multi-active database solution that replicates data across designated AWS regions automatically.
- Unlike traditional primary-replica database configurations where write operations are routed to a single primary database node, Global Tables operate on a multi-active (multi-master) model.
- Clients read and write to their geographically closest AWS Region, achieving single-digit millisecond latency locally.
- Writes committed in one region propagate asynchronously to all replica regions (eventual consistency).
- Because applications can simultaneously perform write operations on the same item in two different AWS Regions, concurrent writes can occur before data propagates.
- Global Tables handle write conflicts automatically using a Last Writer Wins (LWW) resolution policy.
    - DynamoDB uses internal system timestamps to determine the latest update.
    - Resolution happens at the item level, not the attribute level.
    - To minimize LWW conflicts, avoid updating the same item concurrently in multiple regions.
    - Assign users or entities deterministically to a primary home region whenever possible.
- To deploy a DynamoDB Global Table
    - Base replica tables must have DynamoDB Streams enabled.
    - All replica tables must share identical primary key schemas, index definitions (GSIs), and attribute settings across regions.
    - Auto Scaling or On-Demand mode must be enabled symmetrically across all replica regions so that write capacity in one region does not bottleneck during cross-region replication writes.

```
                 GLOBAL TABLES MULTI-ACTIVE REPLICATION

    AWS Region 1 (us-east-1)                  AWS Region 2 (eu-west-1)
  +--------------------------+              +--------------------------+
  |    Local Application     |              |    Local Application     |
  +------------+-------------+              +------------+-------------+
               │ Write                                   │ Write
               ▼                                         ▼
  +--------------------------+  Asynchronous  +--------------------------+
  |  Replica Table (Region 1)| <============> |  Replica Table (Region 2)|
  +--------------------------+  Replication   +--------------------------+
  ```

## Items
- An Item is a group of attributes that represents a single data record in a DynamoDB table.
- This is equivalent to rows of a table in RDBMS.
- The maximum total size for any single item in DynamoDB is 400 KB. This includes both the attribute names and their values.
- Every item must contain a Primary Key that uniquely identifies it within the table.
- While an individual item is capped at 400 KB, a DynamoDB table can store an unlimited number of items.

```json
{
  "userId": "u123",
  "name": "John",
  "email": "john@example.com",
  "age": 28
}
```

## Atributes
- An Attribute is a key-value pair containing a single fundamental piece of data within an item.
- This is equivalent to a field/column in a row of a table in RDBMS.
- Other than the mandatory Primary Key attributes, each item can have different kind and number of attributes.
- Other than the primary key attributes, any attributes or data types do not have to be defined when creating tables.

### Scalar Types
- A scalar type can represent exactly one value.
- The scalar types are number, string, binary, Boolean, and null.

### Document Types
- A document type can represent a complex structure with nested attributes, such as what you would find in a JSON document.
- The document types are list and map.

### Set Types
- A set type can represent multiple scalar values.
- The set types are string set, number set, and binary set.

## Naming Rules
- All names must be encoded using UTF-8.
- Table names and index names must be between 3 and 255 characters long.
- Attribute names must be at least one character long and less than 64 KB in size.
- Attribute names are included in metering of storage and throughput usage.
- Names are case-sensitive. `UserId` and `userid` are treated as distinct attributes.
- While DynamoDB reserved-words can be used in names, it is not recommended as this requires defining placeholder variables for expression.

## API

### Control Plane
- These operations let creating and managing DynamoDB tables.
- They also let working with indexes, streams, and other objects that are dependent on tables.

### Data Plane
- These operations let performing CRUD actions on data in a table.
- Some of the data plane operations also let reading data from a secondary index.

### Transactions
- Provides ACID functionality to maintain data correctness.
- This can be achieved via classic APIs as well as PartiQL.

### Details on
- [Amazon DynamoDB API Reference](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html)