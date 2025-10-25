# 01 - Session
- Represents a connection between the Java application and the database.
- The primary interface used by applications to interact with the underlying database through Hibernate.
- Acts as a bridge that manages database operations, including saving, retrieving, updating, and deleting objects from the database.

## Responsibilities of Hibernate Session

### Managing Entity States
- Hibernate manages entities in different states during their lifecycle within the session.
- These states determine how Hibernate interacts with the database concerning these entities.

```java
Employee emp = new Employee(); // Transient
session.save(emp); // Persistent
session.evict(emp); // Detached
```

#### Transient State:
- An object is considered transient if it is a new object that has been instantiated but is not yet associated with a Hibernate session.
- These objects have no representation in the database, and Hibernate does not track their changes.

#### Persistent State:
- An object enters the persistent state when it is associated with an active Hibernate session.
- Hibernate tracks changes to these objects and automatically synchronizes the changes with the database when the session is flushed.
- Hibernate ensures that all entities in the persistent state are synchronized with the database during the session lifecycle.

#### Detached State:
- An object is in the detached state when it was previously associated with a session but that session is now closed or the object has been evicted.
- Hibernate no longer tracks the object, but it can still be re-associated with a new session.

### Connection Management
- A Hibernate session is responsible for managing database connections. It opens and closes connections as needed, which helps control resource usage.
- Each session is bound to a single database connection, and operations like reading and writing to the database are handled through this connection.
- Hibernate abstracts away the need for explicit connection management (e.g., JDBC connection management), making the process more efficient.
- Sessions can be configured to work with connection pooling mechanisms, where multiple connections are maintained and reused for better performance in handling database operations.

### Transaction Demarcation
- Means the start and end of a transaction, i.e. boundary of the transaction.
- Hibernate transactions ensure data integrity by allowing changes to be committed or rolled back atomically.
- Within a session, multiple database operations, that are part of a single transaction, can be performed.
- Transaction management can be handled programmatically through the session, or it can be integrated with external transaction management systems like Spring.

## Lifecycle of a Hibernate Session

```java
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();
Employee emp = new Employee();
session.save(emp);
tx.commit();
session.close();
```

### Session creation
- This phase initiates the session and establishes a connection to the database.
- A session is typically created when a request to interact with the database is made.
- Each session provides a persistence context, which is a temporary cache where Hibernate tracks all entities being manipulated during that session.
- At this stage, the session is ready to perform database operations like inserting, updating, or retrieving data.

### Perform database operations
- After the session is created, you can perform various database operations, such as saving, updating, deleting, or retrieving entities.
- Hibernate manages the state of entities during this phase, ensuring that changes made to the objects are automatically tracked and synchronized with the database.
- Operations within the session are often wrapped in transactions. A transaction ensures that multiple database operations are treated as a single atomic unit, where all changes are committed or rolled back together.
- During this phase, Hibernate also manages the persistence context, using mechanisms like automatic dirty checking, which tracks changes to entities and prepares them for persistence.

### Close session
- Once all database operations are complete, the session must be closed.
- Closing the session releases the database connection and clears the persistence context, detaching all entities. This ensures no memory leaks or connection issues.
- After the session is closed, the same session cannot be reused, and the entities it was managing are in the detached state.
- It's important to close the session properly to free up resources like the database connection.
- In most applications, session creation and closure are managed automatically by frameworks like Spring or manually in code for finer control.

## Lazy Loading
- Instead of retrieving all associated objects (like collections or related entities) immediately when the parent object is fetched from the database, Hibernate waits until those objects are actually needed.
- This is done to optimize the performance of data retrieval by delaying the loading of related entities until they are explicitly accessed.
- A proxy object is created for the related entities, and the actual data is fetched only when attempted to access the related entity (e.g., by calling a getter method).
- Lazy loading is beneficial when the related entities are not always needed immediately, and fetching them upfront would be inefficient.

```java
@OneToMany(fetch = FetchType.LAZY) // tells Hibernate to load the collection only when accessed.
private Set<OrderItem> orderItems;
```

## How Transactions are tied to Sessions?
- **Session**
	- Represents a single unit of interaction with the database, during which entities are managed and SQL operations are executed.
	- It manages the persistence context, which holds the entities that Hibernate tracks during the session.
- **Transaction**
	- Represents a unit of work that should be atomic (all or nothing).
	- All changes to the database should succeed or fail together.
	- Hibernate relies on the underlying database's transaction management system for handling transactions.
- **Relationship between Sessions and Transactions**
	- A transaction typically begins after a session is opened, and it ends with either a commit or rollback.
	- Transactions define the boundaries of the work done in a session.
	- While a session may last through multiple operations (or even requests in a long session), a transaction delimits when changes made to the session's entities are flushed to the database.
	- A common practice is to use one session per transaction, where a session is created when the transaction starts and closed when the transaction completes.

```java
Session session = sessionFactory.openSession();
Transaction transaction = session.beginTransaction();
try {
    // Database operations
    session.save(someEntity);
    transaction.commit();
} catch (Exception e) {
    transaction.rollback();
} finally {
    session.close();
}
```