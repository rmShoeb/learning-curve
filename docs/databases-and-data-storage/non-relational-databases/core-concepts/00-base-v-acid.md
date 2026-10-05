# BASE vs. ACID

- ACID and BASE are database transaction models that determine how a database organizes and manipulates data.
- ACID properties mean that once a transaction is complete, its data is consistent and stable on disk, which may involve multiple distinct memory locations.
- A fully ACID database is the perfect fit for use cases where data reliability and consistency are essential, for example, banking systems.
- In some databases where performance relies on large-scale sharding and horizontal scale-out for performance, maintaining ACID compliance is extremely costly.
- **BASE** chooses availability over consistency.
- It provides a less strict assurance than ACID.
    - Data will be consistent in the future, either at read time.
    - Or, it will always be consistent, but only for certain processed past snapshots.
- **B**asically **A**vailable: the system guarantees availability.
- **S**oft state: Data stores don’t have to be write-consistent, nor do different replicas have to be mutually consistent all the time.
- **E**ventual consistency: The system will become consistent over a period of time.
- Popular BASE-compliant databases include BigTable and DynamoDB, as well as Cassandra and Hadoop.
- Developers and data architects should select their data consistency trade-offs on a case-by-case basis.

## Resources
- [NoSQL](https://github.com/donnemartin/system-design-primer/blob/master/README.md#nosql)
- [Data consistency models: ACID vs. BASE explained](https://neo4j.com/blog/graph-database/acid-vs-base-consistency-models-explained/)
- [What’s the Difference Between an ACID and a BASE Database?](https://aws.amazon.com/compare/the-difference-between-acid-and-base-database/)