# SQL vs. NoSQL

- Relational databases, such as MySQL and PostgreSQL offer strong consistency, well-understood query languages, and battle-tested reliability.
- The database engine explicitly enforces a rigid structure before any record is written (Fixed Schema/Schema-on-Write) via DDL.
- Every row in a table must contain the exact same defined columns. If a column is missing in an `INSERT` statement, the database populates it with `NULL` or a default value. Attempting to insert an unknown column throws a database error.
- Adding or removing a field requires executing `ALTER TABLE`. On large, production-grade web-scale databases, running an `ALTER TABLE` lock operation can cause downtime or degrade performance.
- However, as systems scale and use cases diversify, traditional SQL starts to exhibit problems.
- NoSQL offers flexible schema design, horizontal scalability, and models tailored to specific access patterns.
- Here, the database engine does not dictate item-level structure (Flexible Attributes/Schema-on-Read).
- Every item (row/document) in the same table or collection can have completely distinct attributes (fields) and data types.
- Adding new fields to an application requires zero database migrations. New items simply start incorporating the new key-value pairs immediately.
- The promise is to scale fast and iterate freely.
- However, there are trade-offs in consistency, structure, and operations.
- Data is denormalized, and joins are generally done in the application code.
- Most NoSQL stores lack true ACID transactions and favor eventual consistency.

| Feature              | Relational (Fixed Schema)                                   | NoSQL (Flexible Attributes)                                              |
|----------------------|-------------------------------------------------------------|--------------------------------------------------------------------------|
| Validation Point     | Schema-on-Write: Enforced at storage layer by the DB engine | Schema-on-Read: Enforced at application layer when data is parsed        |
| Field Uniformity     | Rigid; every row shares identical column definitions        | Dynamic; items in the same table can have different attributes           |
| Handling Sparse Data | High overhead (requires storing many NULL values)           | Efficient; attributes simply don't exist on items where they aren't used |
| Schema Migration     | Expensive; requires ALTER TABLE operations                  | Lightweight; handled entirely within application code logic              |
| Data Integrity Risk  | Minimal; bad data rejected at database boundary             | Higher; application bugs can lead to inconsistent or corrupted documents |

## Advantages

- Flexible schema design
- Scalability using distributed clusters of hardware.
- High performance as they are optimized specific data models and access patterns.
- Highly functional data types and APIs, purpose built for each of their respective data models.

## Resources
- [NoSQL](https://github.com/donnemartin/system-design-primer/blob/master/README.md#nosql)
- [SQL vs NoSQL: Choosing the Right Database for An Application](https://blog.bytebytego.com/p/sql-vs-nosql-choosing-the-right-database)
- [What is NoSQL?](https://aws.amazon.com/nosql/)