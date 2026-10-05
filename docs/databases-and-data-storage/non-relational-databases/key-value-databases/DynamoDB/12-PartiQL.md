# PartiQL
- Traditional DynamoDB APIs (such as `GetItem`, `PutItem`, `Query`, and `Scan`) require constructing SDK-specific key conditions, filter expressions, and update expressions.
- PartiQL abstracts these into standard SQL-like syntax.
- It is a SQL-compatible query language designed to provide a familiar, declarative syntax for querying and manipulating semi-structured and document data across various storage engines.
- It enables developers to execute CRUD operations using standard `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements while preserving DynamoDB's core performance, availability, and scale invariants.
- It does not alter DynamoDB's underlying engine behavior, rather PartiQL engine parses the SQL-like statements and maps them directly to native DynamoDB API operations

## Core CRUD Operations
- Table and Index names in PartiQL are case-sensitive and must be enclosed in double quotes (e.g., `"Orders"`).
- String parameter values must be enclosed in single quotes (e.g., `'USER#101'`).

### Read Operations
- The `SELECT` statement retrieves items from a table or Global Secondary Index (GSI).
- A `SELECT` statement with a primary key `WHERE` clause maps to a native `Query` or `GetItem` operation.
- A `SELECT` statement without a primary key `WHERE` clause maps to a native `Scan` operation.

```sql
-- Pattern A: Indexed Read (Maps to GetItem or Query - Efficient)
SELECT PK, SK, email, orderStatus 
FROM "Orders" 
WHERE PK = 'USER#101' AND SK = 'METADATA';

-- Pattern B: Range Query (Maps to Query - Efficient)
SELECT PK, SK, totalAmount 
FROM "Orders" 
WHERE PK = 'USER#101' AND SK BEGINS_WITH 'ORDER#2026';

-- Pattern C: Global Secondary Index Read
SELECT PK, SK, orderStatus 
FROM "Orders"."GSI1" 
WHERE GSI1_PK = 'STATUS#PENDING';
```

INSERT, UPDATE, and DELETE statements map to PutItem, UpdateItem, and DeleteItem operations.
### Create Operations
- `INSERT` statements map to `PutItem`.
- If an item with the specified primary key already exists, the operation fails with a `DuplicateItemException`, unlike native `PutItem`, which overwrites by default unless conditioned.

```sql
INSERT INTO "Orders" VALUE {
  'PK': 'USER#101',
  'SK': 'ORDER#2026-03-30#ORD01',
  'totalAmount': 149.99,
  'orderStatus': 'PENDING',
  'items': ['Keyboard', 'Mouse']
};
```

### Update Operations
- `UPDATE` statements map to `UpdateItem` operations.
- To prevent race conditions during updates or deletes, append non-key condition logic to the `WHERE` clause.

```sql
-- Update scalar attributes and nested document values
UPDATE "Orders" 
SET orderStatus = 'SHIPPED',
    trackingNumber = 'TRK-9941',
    address.zip = 90210
WHERE PK = 'USER#101' AND SK = 'ORDER#2026-03-30#ORD01';

-- Append an item to a List attribute using the list_append function
UPDATE "Orders" 
SET items = list_append(items, ['Desk Mat'])
WHERE PK = 'USER#101' AND SK = 'ORDER#2026-03-30#ORD01';

-- Remove an attribute using REMOVE
UPDATE "Orders" 
REMOVE temporaryNotes 
WHERE PK = 'USER#101' AND SK = 'ORDER#2026-03-30#ORD01';

-- Update totalAmount ONLY IF the current status is still 'PENDING'
UPDATE "Orders" 
SET totalAmount = 199.99 
WHERE PK = 'USER#101' 
  AND SK = 'ORDER#2026-03-30#ORD01' 
  AND orderStatus = 'PENDING';
-- If orderStatus is not 'PENDING', DynamoDB raises a ConditionalCheckFailedException.
```

### Delete Operations
- `DELETE` statements map to `DeleteItem` operations.

```sql
DELETE FROM "Orders" 
WHERE PK = 'USER#101' AND SK = 'ORDER#2026-03-30#ORD01';
```

## Executing PartiQL
- AWS SDKs provide the `ExecuteStatement` and `BatchExecuteStatement` low-level API operations to execute parameterized PartiQL queries using `?` placeholders.
- `BatchExecuteStatement` accepts up to 25 PartiQL statements in a single network call.
    - Maximum total payload size of 16 MB.
    - Every statement in a batch must specify the item's full primary key in its `WHERE` clause.

```python
client = boto3.client('dynamodb')

# Parameterized SELECT Query
statement = """
    SELECT PK, SK, totalAmount 
    FROM "Orders" 
    WHERE PK = ? AND SK BEGINS_WITH ?
"""

parameters = [
    {'S': 'USER#101'},
    {'S': 'ORDER#2026'}
]

response = client.execute_statement(
    Statement=statement,
    Parameters=parameters,
    ConsistentRead=True  # Force Strongly Consistent Read
)

print(f"Fetched Orders: {response.get('Items', [])}")


# batch queries in 1 request
batch_response = client.batch_execute_statement(
    Statements=[
        {
            'Statement': 'UPDATE "Orders" SET orderStatus = ? WHERE PK = ? AND SK = ?',
            'Parameters': [{'S': 'DELIVERED'}, {'S': 'USER#101'}, {'S': 'ORDER#2026-01'}]
        },
        {
            'Statement': 'UPDATE "Orders" SET orderStatus = ? WHERE PK = ? AND SK = ?',
            'Parameters': [{'S': 'CANCELLED'}, {'S': 'USER#102'}, {'S': 'ORDER#2026-02'}]
        }
    ]
)
```

## Critical Limitations & Gotchas
- **No Multi-Item Single Insert**
    - It is possible to issue a single `INSERT` statement containing multiple items.
    - e.g., `INSERT INTO "Table" VALUES {...}, {...}` is invalid syntax.
    - Have to use `BatchExecuteStatement` instead.
- **No Multi-Item Bulk Updates or Deletes**
    - Cannot issue an `UPDATE` or `DELETE` statement that targets multiple items via non-key attributes.
    - e.g., `DELETE FROM "Orders" WHERE orderStatus = 'CANCELLED'` is rejected.
    - Every update or delete must specify the exact primary key.
- **No Native `LIMIT` Clause in Statement**
    - Adding `LIMIT` directly inside a PartiQL SQL string (e.g., `SELECT * FROM "Orders" LIMIT 10`) throws a `ValidationException`.
    - Pagination limits are set via the SDK API parameter wrapper, not inside the statement text.
- **No Cross-Table `JOIN`s:** PartiQL for DynamoDB does not support relational `JOIN` operations across tables.

## Best Practices
- Always specify full `PK` in `WHERE`. Avoid running `SELECT` without `PK` (Triggers accidental full Scan).
- Use parameterized statements (`?`).
- Use BatchExecuteStatement for bulk single-key writes.