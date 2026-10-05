# Introduction
- It is a NoSQL database that is designed to support both key-value and document data models.
- A serverless, fully managed, distributed database with single-digit millisecond performance at any scale.
- Unlike relational databases where queries slow down as tables grow to billions of rows, DynamoDB delivers predictable, single-digit millisecond latency whether the table contains 100 items or 100 billion items.
- Unlike relational databases, it doesn't support a `JOIN` operator, and recommends denormalizing data model to reduce database round trips and processing power needed to answer queries.
- It provides strong read consistency and ACID transactions.

Relational databases follow the structure:
```
Database
 └── Tables
      └── Rows
           └── Columns
```

DynamoDB Follows
```
Table
 └── Items
      └── Attributes
```

![Sample Structure](https://docs.aws.amazon.com/images/amazondynamodb/latest/developerguide/images/HowItWorksTables-2024.png)

## Terminology

| RDBMS                  | DynamoDB               |
|------------------------|------------------------|
| Table                  | Table                  |
| Row                    | Item                   |
| Column                 | Attribute              |
| Primary key            | Primary key            |
| Index                  | Secondary index        |
| View                   | Global secondary index |
| Array                  | List                   |
| Nested table or object | Map                    |