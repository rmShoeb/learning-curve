# Different Types of NoSQL Databases

## Key-Value Databases
- They store data as a collection of key-value pairs in which a key serves as a unique identifier.
- Generally allows for O(1) reads and writes.
- Both keys and values can be anything, ranging from simple objects to complex compound objects.
- Can support complex objects like arrays, nested dictionaries, images, videos, and semi-structured data.
- They don't need to perform any resource-intensive table joins. Their flexibility accommodates all the needed information in a single table.
- Can sort keys so that data is stored systematically and for implementing partitioning.
- Some databases allows to define two or more different keys or secondary indexes to access the same data.
- Advanced key-value databases provide native, server-side support for ACID to simplify developer experience.
- Provide high performance and are often used for simple data models or for rapidly-changing data, such as an in-memory cache layer.
- Examples are DynamoDB, RocksDB.
- A key-value store is the basis for more complex systems such as a document store, and in some cases, a graph database.

### Some disadvantages
- Can not filter by value as from the database point of view, every value is blob.
- Value can only be updated as a whole.

## Document Databases
- These have the same document model format that developers use in their application code.
- Store data as JSON objects that are flexible, semi-structured, and hierarchical in nature.
- Works well with catalogs, user profiles, and content management systems, where each document is unique and evolves over time.
- Examples are Amazon DocumentDB, MongoDB.

## Wide Column Store
- Its basic unit of data is a column (name/value pair).
- A column can be grouped in column families. Super column families further group column families.
- Examples are Google's BigTable, Facebook's Cassandra.

![Wide Column Store Sample](https://github.com/donnemartin/system-design-primer/raw/master/images/n16iOGk.png)

## Graph Databases
- They use nodes to store data entities and edges to store relationships between entities.
- An edge always has a start node, end node, type, and direction. It can describe parent-child relationships, actions, ownership, and the like.
- There is no limit to the number and kind of relationships a node can have.
- Typical use cases for a graph database include social networking, recommendation engines, fraud detection, and knowledge graphs.
- Examples are Amazon Neptune.

![Graph Database Sample](https://github.com/donnemartin/system-design-primer/raw/master/images/fNcl65g.png)

## In-Memory Databases
- While other databases store data on disk or SSDs, in-memory data stores are designed to eliminate the need to access disks.
- They are ideal for applications that require microsecond response times or have large spikes in traffic.
- Typical use cases are in gaming and ad-tech applications for features like leaderboards, session stores, and real-time analytics.
- Examples are MemoryDB, ElastiCache, DynamoDB Accelerator (DAX).

## Search Databases
- These are dedicated to the search of data content, such as application output logs.
- They are optimized for sorting unstructured data like images and videos.
- Examples are Amazon OpenSearch.

## Resources
- [NoSQL](https://github.com/donnemartin/system-design-primer/blob/master/README.md#nosql)
- [What is NoSQL?](https://aws.amazon.com/nosql/)
- [What Is a Key-Value Database?](https://aws.amazon.com/nosql/key-value/)