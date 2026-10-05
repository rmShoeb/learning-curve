# Querying & Expressions

## Querying Data
- In DynamoDB, reading multiple items requires either a `Query` or a `Scan` operation.
- `Query` provides single-digit millisecond latency at scale, while misusing `Scan` can cause high read costs, latency spikes, and read capacity throttling.

### Query
- A `Query` operation uses primary key attribute values to directly locate and retrieve items from a specific partition.
- Because DynamoDB routes the request directly to the target partition on disk using the partition key hash, a Query is fast, predictable, and scale-invariant.
- Primary key must be specified in a query. Sort key is optional, and is used to refine within the item collection.

```python
response = table.query(
    KeyConditionExpression=Key('PK').eq('USER#101') & Key('SK').begins_with('ORDER#2026'),
    FilterExpression=Attr('totalAmount').gt(50),  # FilterExpression applies AFTER data read
    ScanIndexForward=True  # True = Ascending order by SK; False = Descending order
)
```
- Read Capacity Unit (RCUs) is charged for all items matching the `KeyConditionExpression`, even if the `FilterExpression` discards them.
- `FilterExpression` filters items after DynamoDB reads them from disk.

### Scan
- `Scan` operation evaluates every single item in the entire table or secondary index.
- DynamoDB sequentially steps through all physical partitions containing the table's data, reads every item, and optionally applies a `FilterExpression` before returning the final result set.
- Scans can search across any attribute, regardless of key schema.
- RCU is consumed for the total volume of data read from disk.
- Execution time grows as total dataset grows.
- To speed up bulk scans, table scan can be split across multiple parallel threads using `TotalSegments` and `Segment`.

```
Client ── Scan(Filter: totalAmount > 50) ──► Partition 1 (Reads All Items)
                                         ├──► Partition 2 (Reads All Items)
                                         └──► Partition 3 (Reads All Items)
                                                    │
Client ◄── Returns matching items after full read ──┘
```

```python
# Scan entire table for active users
response = table.scan(
    FilterExpression=Attr('status').eq('ACTIVE')
)

items = response.get('Items', [])


## parallel scan
def scan_segment(segment_id, total_segments):
    table = boto3.resource('dynamodb').Table('AppTable')
    response = table.scan(
        Segment=segment_id,
        TotalSegments=total_segments
    )
    return response.get('Items', [])

# Execute 4 parallel scan segments across threads
total_segments = 4
with ThreadPoolExecutor(max_workers=total_segments) as executor:
    futures = [executor.submit(scan_segment, i, total_segments) for i in range(total_segments)]
    results = [f.result() for f in futures]
```

### Query vs Scan

|    Feature / Behavior   |                `Query`             |                    `Scan`                  |
|:-----------------------:|:----------------------------------:|:------------------------------------------:|
| Search Mechanism        | Direct partition lookup            | Full table/index scan                      |
| Partition Key Required? | Yes (`PK = :val`)                  | No (Can scan any attribute)                |
| Performance / Latency   | Predictable single-digit ms        | Degrades as table size grows               |
| RCU Consumption         | Billed only for matching key items | Billed for entire scanned dataset          |
| Primary Use Case        | Real-time application workloads    | Ad-hoc analytics, data migrations, exports |

| USE `QUERY` WHEN                   |          USE `SCAN` WHEN          |
|------------------------------------|-----------------------------------|
| Fetching items for a specific `PK` | Exporting entire database         |
| Running real-time API requests     | Running offline analytics         |
| Accessing sequential ranges (`SK`) | Working with small, static tables |

### Pagination 
- DynamoDB caps any single `Query` or `Scan` response payload at 1 MB of data.
- If a query returns more than 1 MB of records (or reaches table limits), DynamoDB truncates the result set and returns a pagination token named `LastEvaluatedKey`.
- To fetch all matching records beyond the 1 MB limit, pass `LastEvaluatedKey` back in subsequent calls as `ExclusiveStartKey` until `LastEvaluatedKey` is no longer present in the response.

```python
all_orders = []
pagination_key = None
    
while True:
    kwargs = { 'KeyConditionExpression': Key('PK').eq(f"USER#{user_id}") & Key('SK').begins_with('ORDER#') }

    if pagination_key:
        kwargs['ExclusiveStartKey'] = pagination_key
            
    response = table.query(**kwargs)
    all_orders.extend(response.get('Items', []))

    pagination_key = response.get('LastEvaluatedKey')
    if not pagination_key:
        break  # No more pages left
```

## Expressions
- Expressions in DynamoDB are text strings used within API calls to specify how items are identified, filtered, projected, or modified.
- This is essential for fine-tuning performance, minimizing capacity costs, and managing write operations cleanly.

### Key condition expressions
- A Key Condition Expression defines which items are read from disk during a `Query` operation.
- Since it determines partition routing and initial disk reads, it directly dictates the base RCU (Read Capacity Unit) consumption.

```python
response = table.query(
    KeyConditionExpression=Key('PK').eq('USER#101') & Key('SK').between('ORDER#2026-01-01', 'ORDER#2026-06-30')
)
```

### Filter expressions
- A Filter Expression discards unneeded records after DynamoDB reads data from disk during a `Query` or `Scan`, but before returning the result payload to the application.
- Since filter expressions are applied after data is read from disk, they do not reduce RCU.
- Supported Operators
    - Comparison: `=`, `<>`, `<`, `<=`, `>`, `>=`
    - Functions: `attribute_exists()`, `attribute_not_exists()`, `begins_with()`, `contains()`
    - Logic: `AND`, `OR`, `NOT`

```
[ Physical Disk Read ] ──► (KeyCondition Expression) ──► Items Read from Disk
                                                                │
[ Filter Expression ]  ◄── (Evaluated on Server) ───────────────┘
          │
          ▼
[ Returned Payload ] ──► Only items passing FilterExpression
```

```python
response = table.query(
    KeyConditionExpression=Key('PK').eq('USER#101'),
    FilterExpression=Attr('orderStatus').eq('SHIPPED') & Attr('totalAmount').gt(100)
)
```

### Projection expressions
- A Projection Expression specifies the exact subset of attributes to return in the response payload, dropping unwanted attributes.
- Reduces network bandwidth and memory footprint.
- Prevents transmitting unnecessary payloads.
- For `GetItem` or `Query` on the base table, projection expressions do not reduce RCU costs, unless used in combination with a `KEYS_ONLY` or `INCLUDE` Secondary Index.

```python
response = table.get_item(
    Key={'PK': 'USER#101', 'SK': 'METADATA'},
    ProjectionExpression="userName, email, profilePic"
)
```

### Update expressions
- An Update Expression defines modifications to make on an item during an `UpdateItem` operation.
- It supports four distinct clauses.

|  Clause  |                           Action                          |              Example Usage             |
|:--------:|:---------------------------------------------------------:|:--------------------------------------:|
| `SET`    | Adds new attributes or modifies existing attribute values | `SET #status = :val, price = :p`       |
| `REMOVE` | Deletes attributes from an item                           | `REMOVE legacyToken, temporaryAddress` |
| `ADD`    | Increments/decrements numbers or appends values to sets   | `ADD visitCount :inc`                  |
| `DELETE` | Removes elements from a set attribute                     | `DELETE userRoles :removed_role`       |

```python
# Increment counter and append an item to a list attribute
response = table.update_item(
    Key={'PK': 'USER#101', 'SK': 'METADATA'},
    UpdateExpression="SET loginCount = if_not_exists(loginCount, :zero) + :inc, "
                     "recentIPs = list_append(if_not_exists(recentIPs, :empty_list), :new_ip)",
    ExpressionAttributeValues={
        ':inc': 1,
        ':zero': 0,
        ':new_ip': ['192.168.1.1'],
        ':empty_list': []
    },
    ReturnValues="UPDATED_NEW"
)
```

### Expression attribute names
- DynamoDB reserves over 500 keywords (e.g., `Year`, `Date`, `Status`, `Role`, `User`, `Percent`, `Size`).
- Using these keywords directly in expressions triggers a validation syntax error.
- Attribute names containing dots (`.`) or hyphens (`-`) require aliasing to prevent parsing ambiguity.
- Expression Attribute Names are substitution tokens (placeholders starting with `#`) used as aliases for attribute names in expressions.

```python
response = table.update_item(
    Key={'PK': 'DEV#50', 'SK': 'METADATA'},
    UpdateExpression="SET #st = :s, #yr = :y",
    ExpressionAttributeNames={
        '#st': 'status',
        '#yr': 'year'
    },
    ExpressionAttributeValues={
        ':s': 'ACTIVE',
        ':y': 2026
    }
)
```

### Expression attribute values
- Expression Attribute Values are substitution tokens (placeholders starting with `:`) used to supply actual data values in expressions.
- They separate query expression logic from variable parameters (similar to parameterized SQL queries).
- They prevent syntax errors caused by special characters inside user data string values.

```python
# Resource API
ExpressionAttributeValues={
    ':val': 'SHIPPED',
    ':min_price': 49.99
}

# Low-Level Client API
ExpressionAttributeValues={
    ':val': {'S': 'SHIPPED'},
    ':min_price': {'N': '49.99'}
}
```