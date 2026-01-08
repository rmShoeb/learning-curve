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