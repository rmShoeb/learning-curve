# SQL vs. NoSQL

- Relational databases, such as MySQL and PostgreSQL offer strong consistency, well-understood query languages, and battle-tested reliability. However, as systems scale and use cases diversify, traditional SQL starts to exhibit problems.
- NoSQL offers flexible schema design, horizontal scalability, and models tailored to specific access patterns. The promise is to scale fast and iterate freely. However, there are trade-offs in consistency, structure, and operations.
- Data is denormalized, and joins are generally done in the application code. Most NoSQL stores lack true ACID transactions and favor eventual consistency.

## Resources
- [NoSQL](https://github.com/donnemartin/system-design-primer#nosql)
- [SQL vs NoSQL: Choosing the Right Database for An Application](https://blog.bytebytego.com/p/sql-vs-nosql-choosing-the-right-database)