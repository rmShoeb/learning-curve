# Data Modeling
- RDBMS expects developers to normalize the data first, and figure out queries later.
- DynamoDB inverts this: design data structures exclusively around the applications read-write patterns.

## Access patterns
- Start with the queries. What does the application need?
- DynamoDB does not perform runtime joins across physical partitions.
- Before creating tables, document every read and write path required by the application interfaces.
- Designing a schema before listing every application query leads to severe performance bottlenecks and forced full-table Scan operations.

```
+-----------------------+      +-----------------------+      +-----------------------+
| 1. Define Application | ---> | 2. Map Entity Keys    | ---> | 3. Build Tables &     |
|    Access Patterns    |      |    & Sort Hierarchies |      |    Secondary Indexes  |
+-----------------------+      +-----------------------+      +-----------------------+
```

## Design from queries
- Once the access patterns are defined, design key structures directly targeting those access paths.
- In DynamoDB, queries rely on exact key matches (`PK = :pk`) and range conditions (`SK begins_with(...)`).
- Matching keys directly to access patterns guarantees scale-invariant latency during lookups.

## One-to-many relationships
- In SQL, a one-to-many relationship is split into separate tables and joined at query time.
- In DynamoDB, this is handled by placing related items into the same physical Item Collection.

```
+------------------------------------------------------------------------------------+
| Physical Partition (Item Collection: PK = USER#USR-104)                            |
+----------------------+-----------------------+-------------------------------------+
| Partition Key (PK)   | Sort Key (SK)         | Attributes                          |
+----------------------+-----------------------+-------------------------------------+
| USER#USR-104         | METADATA              | Name: Alex, Email: alex@dev.io      |
| USER#USR-104         | ORDER#2026-01-15#O101 | Total: $45.00, Status: DELIVERED    |
| USER#USR-104         | ORDER#2026-02-20#O102 | Total: $12.50, Status: SHIPPED      |
| USER#USR-104         | ORDER#2026-03-10#O103 | Total: $89.00, Status: PROCESSING   |
+----------------------+-----------------------+-------------------------------------+
```

- Because all records sharing `PK = USER#USR-104` reside together on disk, a single Query call retrieves both the parent user profile and all associated child orders.

## Denormalization
- In normalized databases, redundant data is eliminated to guarantee consistency and minimize disk space.
- In DynamoDB, compute capacity (RCUs and WCUs) and request latency are far more critical constraints than disk space.
- Denormalization is a primary strategy to minimize round trips and avoid secondary index lookups.
- If denormalized data updates frequently, application must propagate updates using asynchronous pipelines to rewrite copied records in the background.

```
                       DENORMALIZATION TRADE-OFFS
                          
  BENEFITS                                DRAWBACKS
+------------------------------------+  +------------------------------------+
| - Fast, single-request reads       |  | - Complex update logic             |
| - Lower RCU consumption            |  | - Eventual consistency risk        |
| - Eliminates cross-table lookups   |  | - Higher write unit cost on update |
+------------------------------------+  +------------------------------------+
```

## Single-table design
- It is the practice of storing multiple distinct entity types (e.g., `Users`, `Orders`, `Products`, `Invoices`) inside a single DynamoDB table, using generic key names like `PK` and `SK`.
- This allows different entity types to coexist in one table.
- While single-table design optimizes operational footprint and cost by allowing multiple entities to share provisioned capacity, it adds architectural complexity.
- Starting with multi-table designs (one table per core entity) is simpler, easier to refactor, and entirely appropriate for applications with evolving query requirements.
- Move to single-table structures when there is need for strict cost optimization or joint single-request entity retrieval.

```
                        SINGLE-TABLE DECISION FRAMEWORK
                         
  ADVANTAGES                             WHEN TO AVOID
+------------------------------------+  +------------------------------------+
| - Single table management          |  | - Rapidly changing access patterns |
| - Maximize provisioned throughput  |  | - Flexible, ad-hoc analytics       |
| - Joint entity retrieval in 1 RCU  |  | - Early-stage prototype designs    |
+------------------------------------+  +------------------------------------+
```

## Multi-table design
- Even though an AWS account can contain dozens of distinct DynamoDB tables, each table is a completely isolated data store.
- DynamoDB does not manage cross-table relationships automatically.
- However, it is still possible to establish relationships between data across multiple tables using application-managed patterns.

  ```json
  // Users table
  {
    "PK": "USR-104",
    "Name": "John"
  }

  // Orders table
  {
    "PK": "ORD-9921",
    "userId": "USR-104" // (Acts as a manual logical reference)
  }
  ```

- In RDBMS, foreign keys trigger cascading deletes or prevent orphaned records. This can be achieved in DynamoDB using `TransactWriteItems`.
  ```python
  import boto3

  client = boto3.client('dynamodb')

  # Write an order to 'Orders' ONLY if the user exists in 'Users'
  try:
      client.transact_write_items(
          TransactItems=[
              {
                  # Condition Check on Table A (Users)
                  'ConditionCheck': {
                      'TableName': 'Users',
                      'Key': {'PK': {'S': 'USER#USR-104'}},
                      'ConditionExpression': 'attribute_exists(PK)'
                  }
              },
              {
                  # Put Operation on Table B (Orders)
                  'Put': {
                      'TableName': 'Orders',
                      'Item': {
                          'PK': {'S': 'ORDER#ORD-9921'},
                          'userId': {'S': 'USER#USR-104'},
                          'total': {'N': '49.99'}
                      }
                  }
              }
          ]
      )
  except client.exceptions.TransactionCanceledException:
      print("Failed: Foreign key validation failed. User does not exist.")
    ```
- Since DynamoDB does not have any concept of foreign key, it will not update data in a reference table if parent table data changes. Cross-table synchronization needs to be handled using DynamoDB Streams and AWS Lambda.