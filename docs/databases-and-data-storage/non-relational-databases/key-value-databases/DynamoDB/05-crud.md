# CRUD Operations

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')
```

## Create
The `PutItem` operation creates a new item or completely replaces an entire existing item if an item with the same primary key already exists.
```python
table.put_item(
    Item={
        'PK': 'USER#101',
        'SK': 'METADATA',
        'name': 'Alex',
        'email': 'alex@dev.io',
        'role': 'Admin',
        'loginCount': 1
    }
)
```

## Read
- `GetItem` retrieves a single item by its exact primary key (`PK` and `SK`).
- If the item does not exist, `GetItem` returns an empty response.

```python
response = table.get_item(
    Key={
        'PK': 'USER#101',
        'SK': 'METADATA'
    },
    ConsistentRead=True  # Optional. Default is False (Eventually Consistent). Set True for Strongly Consistent.
)

item = response.get('Item')
if item:
    print("User Name:", item['name'])
    print("User Email:", item['email'])
else:
    print("Item not found.")
```

## Update
- Unlike `PutItem`, which replaces the entire item, `UpdateItem` performs in-place modifications.
- It updates specific attribute values, adds new attributes, or removes existing attributes without overwriting unchanged fields.
- If the target key does not exist, `UpdateItem` creates a new item automatically.
- It requires an Update Expression specifying the operation type:
    - `SET`: Adds new attributes or modifies existing ones.
    - `REMOVE`: Deletes specified attributes from an item.
    - `ADD`: Increments/decrements numeric attributes or appends elements to sets.
    - `DELETE`: Removes elements from a set attribute.

```python
# Update 'role', increment 'loginCount' by 1, and return the modified item
response = table.update_item(
    Key={
        'PK': 'USER#101',
        'SK': 'METADATA'
    },
    UpdateExpression="SET #r = :new_role ADD loginCount :inc",
    ExpressionAttributeNames={
        '#r': 'role'  # 'role' is a reserved keyword in DynamoDB, so we use an alias '#r'
    },
    ExpressionAttributeValues={
        ':new_role': 'SuperAdmin',
        ':inc': 1
    },
    ReturnValues="UPDATED_NEW"  # Options: NONE, ALL_OLD, UPDATED_OLD, ALL_NEW, UPDATED_NEW
)

print("Updated attributes:", response['Attributes'])
```

## Delete
- `DeleteItem` removes a single item from a table by its primary key.
- Deleting an item that does not exist, still results in a successful HTTP 200 response.

```python
table.delete_item(
    Key={
        'PK': 'USER#101',
        'SK': 'METADATA'
    }
)

# safe delete using conditional
try:
    response = table.delete_item(
        Key={
            'PK': 'USER#101',
            'SK': 'METADATA'
        },
        ConditionExpression="attribute_exists(PK)"
    )
except ClientError as e:
    if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
        print("Error: Item does not exist. Delete aborted.")
    else:
        raise
```