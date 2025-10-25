# 03 - Key Operations with Hibernate Session

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