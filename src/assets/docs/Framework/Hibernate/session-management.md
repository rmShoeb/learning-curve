# 02 - Session Management Strategies

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

## Best Practices in Session Management

### Efficient Session Handling
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

### Batch Processing with Hibernate
- Hibernate’s default behavior is to flush the persistence context after every single insert, update, or delete, which can lead to poor performance during bulk operations.
- Batch processing optimizes this by reducing the number of flushes and database round trips.
- Batching and JDBC Batch Size Considerations
	- Avoid cascading operations.
	- Ensure that the underlying JDBC driver supports batching.

#### Steps for Batch Processing:

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