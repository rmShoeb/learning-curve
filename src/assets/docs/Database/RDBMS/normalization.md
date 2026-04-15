# 20 - Data Normalization

## What is it?
- Normalization can solve the problem of data redundancy and organize the data using different forms.
- It is the process of structuring data in a database, which involves creating tables and defining relationships between them by implementing rules that safegurd the data, enhance flexibility by reducing redundancy and preventing inconsistent dependencies.
- It is a systematic technique of decomposing tables to eliminate data repitition and helps organizing the data.

## Why is it needed?
### Insert Anomaly
### Update Anomaly
### Deletion Anomaly

## Normal Forms

### First Normal Form (1NF)
- Atomicity states that a single cell cannot hold multiple values, it must hold only a single attribute.
- A table is referred to as being in its First Normal Form if the atomicity of the table is 1.
- It disallows the multi-valued attribute, composite attribute, and their combinations.
- The following are not permitted in a table to make sure it is in 1NF:
    - Using row order to convey information.
    - Mixing data type within same column.
    - No primary key.
    - Repeating groups.

### Second Normal Form (2NF)
- It is about how the non-key columns of a table are related to the primary column.
- Each non-key attribute must depend on the entire primary key.

### Third Normal Form (3NF)
- It forbids any transitive dependecy between a non-key attribute and the primary key.
- Every non-key attribute on the table should depend on the key, the whole key, and nothing but the key.

### Boyce-Codd Normal Form (BCNF)
- This very similar to 3NF but stricter.
- Each attribute must depend on the entire primary key.

https://youtu.be/VWnKUKH4tLg?si=o5sKaK77gUKlMY9S

### Fourth Normal Form (4NF)
- Multi-valued dependencies in a table must be multivalued dependencies in the key.

### Fifth Normal Form (5NF)

## Denormalization

## Resources
- [Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF](https://www.youtube.com/watch?v=GFQaEYEc8_8)
- [Database Normalization: 1NF, 2NF, 3NF & BCNF Examples](https://www.digitalocean.com/community/tutorials/database-normalization)
- [Normalization in SQL (1NF - 5NF): A Beginner’s Guide](https://www.datacamp.com/tutorial/normalization-in-sql)
- [Normalization in SQL and DBMS: Concepts & Benefits](https://www.simplilearn.com/tutorials/sql-tutorial/what-is-normalization-in-sql)
- [Database Normalization in SQL Server](https://dotnettutorials.net/lesson/database-normalization-sql-server/)
- [Denormalization in Databases: When and How to Use It](https://www.datacamp.com/tutorial/denormalization)
- [Denormalization: A Solution for Performance or a Long-Term Trap?]()
- [Database System Concepts - Abraham Silberschatz, Henry F. Korth, S. Sudarshan](https://mrce.in/ebooks/Database%20System%20Concepts%207th%20Ed.pdf)