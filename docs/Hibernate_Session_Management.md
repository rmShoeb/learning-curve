# Hibernate
- An Object-Relational Mapping (ORM) tool for Java that simplifies database interactions by allowing developers to work with Java objects rather than SQL queries.
- Automates the mapping between Java classes and database tables, managing data persistence and retrieval transparently.
- Some key aspects are:
	- Object-Relational Mapping (ORM)
	- Transparent Persistence
	- Hibernate Query Language (HQL)
	- Automatic Database Schema Generation
	- Lazy Loading
	- Transaction Management
	- Caching
	- Platform Independence

---

# Hibernate Session
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

---

# Session Management Strategies

## Session per Transaction
- A Hibernate session is created at the beginning of a database transaction and is closed when the transaction ends.
- The session is short-lived and is discarded once the transaction completes (either through commit or rollback).
- It is suitable for applications that need to ensure transaction atomicity, where all database operations within a session must succeed or fail together.
- Each transaction operates in isolation, reducing the complexity of managing session lifecycles across multiple transactions.
- Resources (such as database connections) are used only during the short-lived session tied to a transaction, improving performance.

## Session per Request
- Commonly used in web applications.
- A new Hibernate session is created for every HTTP request, and the session is closed once the request is completed.
- The session is opened when the request hits the server and remains active during the processing of the request, allowing Hibernate to perform operations such as fetching or saving data.
- Once the request processing is done (either successfully or with an error), the session is closed.
- One challenge with this strategy is how to manage lazy-loaded entities. If lazy-loaded properties are accessed outside the session, it will result in a `LazyInitializationException`.

## Long Session (Extended Session)
- This keeps the Hibernate session open across multiple transactions or requests, instead of closing it at the end of each transaction or request.
- The session can span the entire lifecycle of a business process, allowing entities to remain attached to the session over time.
- Useful in long-running processes, such as multi-step workflows or conversational state management.
- For example, in an interface where a user fills out data over multiple steps, the session can be maintained until the final step when all data is committed.
- Keeping sessions open for a long time can increase memory usage, as Hibernate needs to track entities in the session.
- Not suitable for high-concurrency environments, as they can lead to stale data or version conflicts.

---

# Key Operations with Hibernate Session

## Session Operations

- `get()`
	- Return the persistent instance of the given entity class with the given identifier, or null if there is no such persistent instance.
- `save()`
	- Persists a transient object to the database.
	- Generates an `INSERT` statement to add the object as a new row in the database.
	- The generated identifier (primary key) of the object.
	- `@Deprecated(since="6.0")`, use `persist()` instead.
- `update()`
	- Updates the state of a detached object, and reattaches the object to the session and synchronizes its current state with the database.
	- Generates an `UPDATE` statement if changes are detected.
	- `@Deprecated(since="6.0")`, use `merge()` instead.
- `delete()`
	- Removes a persistent or detached object from the database.
	- Generates a `DELETE` statement to remove the corresponding row from the database.
	- `@Deprecated(since="6.0")`, use `remove()` instead.

## Flush and Clear
- Flushing is the process of synchronizing the in-memory state of the session (persistence context) with the database.
- During flush, Hibernate generates the necessary SQL statements (`INSERT`, `UPDATE`, `DELETE`) to reflect changes made to the persistent entities in the session and executes them in the database.
- Automatic Flushing
	- Hibernate automatically flushes the session at certain points, such as:
		- Before committing a transaction.
		- Before executing a query that could return results affected by unflushed changes.
	- This ensures that changes are persisted before critical operations like committing transactions or executing queries.
- Manual Flushing
	- `flush()` can be called explicitly on the session
	- This can be useful when it is needed to persist changes immediately without waiting for automatic flush events.
- Clearing
	- The `clear()` method evicts all objects from the session, effectively detaching them from the session.
	- Any changes made to the objects will not be flushed to the database unless they are explicitly reattached to the session.
	- Clearing the session can be useful for freeing up memory after a large batch operation or reset the session state between operations.

## Dirty Checking
- A mechanism in Hibernate that automatically detects changes made to persistent objects while they are still associated with the session.
- Hibernate compares the original state of an entity with its current state in memory.
- If any properties of the entity have been modified, Hibernate marks the entity as "dirty" and schedules it for an update during the next flush.
- This process occurs without requiring explicit `update()` calls. Hibernate handles it during the flush operation.
- Benefits:
	- The developer doesn't need to worry about manually updating objects or calling specific methods to persist changes.
	- Only changed objects are persisted, which reduces unnecessary database operations.
- Overhead:
	- In large sessions with many objects, Hibernate needs to check each object for changes, which can introduce some performance overhead.

```java
Person person = session.get(Person.class, 1);
person.setName("John Doe");
```

---

# How Transactions are tied to Sessions?
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

---

# Best Practices in Session Management

## Efficient Session Handling
- Avoid session leakage
	- Session leakage occurs when sessions are not properly closed, leading to the accumulation of unclosed sessions that consume system resources, such as memory and database connections.
	- Ensure that sessions are closed at the end of each transaction or request.
	- Use session-per-request pattern for web applications.
- Manage session lifecycle effectively
	- Using session-per-transaction or session-per-request pattern.
	- Clear the session regularly
		- using `session.clear()` to detach all managed entities from the session, freeing up memory.
		- using `session.evict(entity)` to detach a specific entity from the session.
- Handling lazy initialization exceptions
	- `LazyInitializationException` occurs when Hibernate tries to access an entity’s lazy-loaded property after the session has been closed.
	- Fetch data within the same session.
	- Use `@Transactional`.
	- Use Eager fetching instead.

## Batch Processing with Hibernate
- Hibernate’s default behavior is to flush the persistence context after every single insert, update, or delete, which can lead to poor performance during bulk operations.
- Batch processing optimizes this by reducing the number of flushes and database round trips.
- Batching and JDBC Batch Size Considerations
	- Avoid cascading operations.
	- Ensure that the underlying JDBC driver supports batching.

### Steps for Batch Processing:

**Enable Hibernate Batch Size**

```xml
<hibernate-configuration>
    <session-factory>
        <!-- Enable batch processing -->
        <property name="hibernate.jdbc.batch_size">50</property>
        <!-- Mappings -->
        <mapping resource="your/mapping/file.hbm.xml"/>
    </session-factory>
</hibernate-configuration>
```
**Clear the session periodically**
```java
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();
for (int i = 0; i < entities.size(); i++) {
    session.update(entities.get(i));
    if (i % batchSize == 0) {
        session.flush();
        session.clear();
    }
}
tx.commit();
session.close();
```

---

# Caching

- Hibernate caching acts as a layer between the actual database and the application.
- It reduces the time taken to obtain the required data as it fetches from memory instead of directly hitting the database.
- It is very useful when application needs to fetch the same kind of data multiple times.

**When an Entity is Requested:**
- Hibernate first checks the session (first-level cache). If the entity is not found there, it checks the second-level cache.
- If the entity is found in the second-level cache, Hibernate returns it without querying the database.
- If the entity is not in either cache, Hibernate queries the database, retrieves the entity, stores it in both caches, and returns it to the application.

## First-Level Cache (`Session` Cache)
- This is associated with the Hibernate Session.
- It is the default cache in Hibernate, i.e., every session has its own cache, and it doesn't need to be explicitly configured.
- The session cache improves performance by reducing the number of database queries.
- Once an entity is loaded, subsequent operations within the same session do not require additional queries for the same entity.
- The session cache ensures consistency within the session because the cached entity is returned for all subsequent operations, and Hibernate tracks changes.
- If an entity is modified and the session is flushed, all changes are synchronized with the database.

```java
Session session = sessionFactory.openSession();
Employee employee = session.get(Employee.class, 1);  // Hits database
Employee sameEmployee = session.get(Employee.class, 1);  // Fetches from session cache
```

**Limitations**
- The first-level cache is scoped to the session. Once the session is closed, the cache is destroyed. If a new session is opened, the entities will need to be fetched from the database again, as the cache is not shared across sessions.
- Since the session cache only persists as long as the session is open, it is limited in size and duration, making it less useful for long-term data caching.

## Second-Level Cache (`SessionFactory` Cache)
- A shared cache across multiple sessions, and it persists beyond the scope of a single session.
- This helps reduce the number of database hits even across different sessions.
- It is optional and requires explicit configuration.
- While second-level caching improves performance, it introduces the risk of data becoming stale if the cache is not invalidated correctly.

```xml
<!-- hibernate.cfg.xml -->
<hibernate-configuration>
    <session-factory>
        <!-- Enable Second-Level Cache -->
        <property name="hibernate.cache.use_second_level_cache">true</property>
        <!-- Specify Cache Provider -->
        <property name="hibernate.cache.region.factory_class">org.hibernate.cache.ehcache.EhCacheRegionFactory</property>
        <!-- Other configuration properties -->
    </session-factory>
</hibernate-configuration>

<!-- entity mapping -->
<hibernate-mapping>
    <class name="com.example.Employee" table="EMPLOYEES">
        <!-- property mappings -->
        <!-- Enable Caching for this Entity -->
        <cache usage="read-write"/>
    </class>
</hibernate-mapping>
```

---

# Notes

- [Hibernate Deprecate List in 6.3](https://docs.jboss.org/hibernate/orm/6.3/javadocs/deprecated-list.html)