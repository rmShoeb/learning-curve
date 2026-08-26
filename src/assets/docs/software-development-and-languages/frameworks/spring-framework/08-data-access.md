# Data Access

## The "Before and After" of Database Connectivity

### Java Database Connectivity
- It is an API that helps applications to communicate with databases.
- It allows Java programs to connect to a database, run queries, retrieve, and manipulate data.
- JDBC drivers handle interactions between the application and the database.
- There are typically 4 components.
    - **JDBC API:** It provides various methods and interfaces for easy communication with the database. It also provides a standard to connect a database to a client application.
    - **JDBC Driver Manager:** It is responsible for loading the correct database-specific driver to establish a connection with the database. It manages the available drivers and ensures the right one is used to process user requests and interact with the database.
    - **JDBC Test Suite:** It is used to test the operation(such as insertion, deletion, updating) being performed by JDBC Drivers.
    - **JDBC Drivers:** These are client-side adapters that convert requests from Java programs to a protocol that the DBMS can understand.

```java
public class JdbcExample {
    public static void main(String[] args)
    {
        // Database URL, username, and password
        String url = "jdbc:mysql://localhost:3306/database";
        String username = "username";
        String password = "password";
        String query  = "INSERT INTO students (id, name) VALUES (109, \"Farhan Qureshi\")";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection c = DriverManager.getConnection(url, username, password); // Establish connection
            Statement st = c.createStatement(); // Create a statement
            int count = st.executeUpdate(query); // Execute the query
            System.out.println("Number of rows affected by this query: " + count);

            // Close the connection
            st.close();
            c.close();
        } catch (ClassNotFoundException e) {
            System.err.println("JDBC Driver not found: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
        }
    }
}
```

### Spring Data JDBC
- JDBC produces a lot of boiler plate code, such as opening/closing a connection to a database, handling sql exceptions etc.
- Spring JDBC makes it easy to implement JDBC based repositories.
- We only need to define the connection parameters from the database and register the SQL query, the rest of the work for us is performed by Spring.
- There are two main approaches to configuring data sources in Spring:
    - using properties files
    - using Java-based configuration.
- It is preferred to use the `application.properties` file configuration because it separates the configuration from the code.

```
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/springjdbc
spring.datasource.username=guest_user
spring.datasource.password=guest_password
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

```java
@Configuration
@ComponentScan("com.example.jdbc")
public class SpringJdbcConfig {
    @Bean
    public DataSource mysqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/springjdbc");
        dataSource.setUsername("guest_user");
        dataSource.setPassword("guest_password");

        return dataSource;
    }
}
```

- `JdbcTemplate` is the main API through which we can most of the DB functionality like
    - creation and closing of connections
    - running statements and stored procedure calls
    - iterating over the ResultSet and returning results
- This is the base class that manages the processing of all events and database connections.
- Instances of the JdbcTemplate class are thread-safe. So we can create a single instance, and use it everywhere.
- However, we still need to write SQL queries explicitly, and map results to objects.

```java
public class PersonMapper implements RowMapper<Person> {
	public Person mapRow(ResultSet resultSet, int i) throws SQLException {
		Person person = new Person();
		person.setId(resultSet.getLong("id"));
		person.setFirstName(resultSet.getString("first_name"));
		person.setLastName(resultSet.getString("last_name"));
		person.setAge(resultSet.getInt("age"));
		return person;
	}
}

@Component
public class PersonDAOImpl implements PersonDAO {
	JdbcTemplate jdbcTemplate;
	private final String SQL_FIND_PERSON = "select * from people where id = ?";
	private final String SQL_DELETE_PERSON = "delete from people where id = ?";
	private final String SQL_UPDATE_PERSON = "update people set first_name = ?, last_name = ?, age  = ? where id = ?";
	private final String SQL_GET_ALL = "select * from people";
	private final String SQL_INSERT_PERSON = "insert into people(id, first_name, last_name, age) values(?,?,?,?)";

	@Autowired
	public PersonDAOImpl(DataSource dataSource) {
		jdbcTemplate = new JdbcTemplate(dataSource);
	}

	public Person getPersonById(Long id) {
		return jdbcTemplate.queryForObject(SQL_FIND_PERSON, new Object[] { id }, new PersonMapper());
	}

	public List<Person> getAllPersons() {
		return jdbcTemplate.query(SQL_GET_ALL, new PersonMapper());
	}

	public boolean deletePerson(Person person) {
		return jdbcTemplate.update(SQL_DELETE_PERSON, person.getId()) > 0;
	}

	public boolean updatePerson(Person person) {
		return jdbcTemplate.update(SQL_UPDATE_PERSON, person.getFirstName(), person.getLastName(), person.getAge(), person.getId()) > 0;
	}

	public boolean createPerson(Person person) {
		return jdbcTemplate.update(SQL_INSERT_PERSON, person.getId(), person.getFirstName(), person.getLastName(), person.getAge()) > 0;
	}
}
```

### Spring Data JPA
- Spring Data JPA aims to significantly improve the implementation of data access layers by reducing boilerplate code needed.
- It makes it easy to easily implement Java Persistence API (JPA) based repositories.
- It makes it easier to build Spring-powered applications that use data access technologies.
- Its goal is to eliminate the data access layer's implementation almost entirely, especially for common operations.
- When Spring Data creates a new Repository implementation, it analyses all the methods defined by the interfaces and tries to automatically generate queries from the method names.

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
    
    // Constructors
    public User() {}
    public User(String username, String email) {
        this.username = username;
        this.email = email;
        this.createdDate = new Date();
    }
    
    // Getters and setters...
}

// Repository Interface
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Query methods derived from method names
    List<User> findByUsername(String username);
    List<User> findByEmailContaining(String email);
    List<User> findByCreatedDateBetween(Date startDate, Date endDate);

    // Custom JPQL queries
    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.createdDate > ?2")
    List<User> findActiveUsersByEmail(String email, Date since);

    // Native SQL queries
    @Query(value = "SELECT * FROM users u WHERE u.username LIKE %:pattern%", nativeQuery = true)
    List<User> findUsersByUsernamePattern(@Param("pattern") String pattern);

    // Modifying queries
    @Modifying
    @Query("UPDATE User u SET u.email = :email WHERE u.id = :id")
    int updateUserEmail(@Param("id") Long id, @Param("email") String email);
}
```

To enable JPA repository configuration

```java
@Configuration
@EnableJpaRepositories(basePackages = "com.example.jpa") 
public class PersistenceConfig { 
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
        return builder.setType(EmbeddedDatabaseType.HSQL).build();
    }
}
```
Or,
```xml
<jpa:repositories base-package="com.example.jpa" />
```

### Resources
- [JDBC (Java Database Connectivity)](https://www.geeksforgeeks.org/java/introduction-to-jdbc/)
- [Spring JdbcTemplate Example](https://www.digitalocean.com/community/tutorials/spring-jdbctemplate-example)
- [Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)

## Entity Mapping
- Entity mapping is at the core of the Java Persistence API (JPA) and allows us to map Java objects (entities) to database tables.
- By using various annotations, we can define how each field in a class corresponds to columns in a table and how relationships between entities are handled.
- JPA provides a set of annotations that simplify this mapping process, eliminating the need to write SQL queries manually.

### Common JPA Annotations
**`@Entity`**
- This annotation is used to mark a class as a JPA entity.
- This tells JPA that this class should be persisted in the database.
- Once the class is annotated with `@Entity`, JPA automatically maps it to a table in the database.
- If no table name is specified, the class name is used by default.
- By default, a class named `ProductOrder` will be mapped to a table named `product_order` (using snake case).

**`@Table`**
- This annotation is used to specify the table name for the entity.
- If the table name differs from the entity class name, we can use this annotation.

**`@Column`**
- This annotation is used to specify the mapping between a field and a database column.
- It allows customization of column properties such as name, length, nullability, etc.
- A field named `orderDate` will map to a column named `order_date` if no name specified.

**`@Id`**
- This annotation marks a field as the primary key for the entity.

**`@Version`**
- It is used for optimistic locking and checked for modification on save operations.
- The initially stored value is zero (one for primitive types).
- The version gets incremented automatically on every update.

```java
@Entity
@Table(name = "library_books", indexes = {
    @Index(name = "idx_book_category", columnList = "category")
})
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_title", length = 100, nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private String category;

    @Version
    private Integer version;
    
    // Constructors, getters, setters
}
```

### Defining Relationships Between Entities

```java
@Entity
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToOne
    private Address address;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Book> books;
}

@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToMany
    @JoinTable(
        name = "book_category",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;
}
```

> In JPA, cascading allows us to propagate certain operations (like saving, deleting, or updating) from a parent entity to its related entities automatically. This can be very useful when dealing with relationships, as it reduces the need to explicitly manage each related entity.

### `EntityManagerFactory`
- It is a JPA interface that creates instances of `EntityManager`, enabling interaction with the persistence context in a thread-safe manner.
- `EntityManager` is a core interface of `JPA`, and is used to interact with the persistence context and manage the lifecycle of entities.
- Hibernate uses `SessionFactory` as its factory class to create and manage `Session` instances.
- In Hibernate, `SessionFactory` can be considered equivalent of `EntityManagerFactory`, and `Session` as `EntityManager`.

## The Core Component: Repositories
- A repository acts as a middleman or an abstraction layer between the application's business logic and the data source (like a database).
- It provides a single place to manage all data access logic for a specific entity, making the code cleaner and easier to maintain.
- The goal of Spring Data repository abstraction is to significantly reduce the amount of boilerplate code required to implement data access layers for various persistence stores.
- The central interface in Spring Data repository abstraction is `Repository` interface. The main purpose of this is to hold type information.
- `CrudRepository` is the most common starting point. It extends `Repository` and provides a standard set of methods for Create, Read, Update, and Delete (CRUD) operations.
- `JpaRepository` is the most feature-rich and commonly used interface for projects using JPA.
- `@Repository` annotation is used to indicate that the class provides the mechanism for storage, retrieval, search, update and delete operation on objects.

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Query by example
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryAndStatus(ProductCategory category, ProductStatus status);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Pagination and sorting
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
    
    // Custom JPQL queries
    @Query("SELECT p FROM Product p WHERE p.price > :price AND p.status = 'ACTIVE'")
    List<Product> findActiveProductsAbovePrice(@Param("price") BigDecimal price);
    
    @Query("SELECT p FROM Product p JOIN p.orderItems oi GROUP BY p HAVING COUNT(oi) >= :minOrders")
    List<Product> findPopularProducts(@Param("minOrders") Long minOrders);
    
    // Native queries for complex operations
    @Query(value = """
        SELECT p.*, AVG(r.rating) as avg_rating 
        FROM products p 
        LEFT JOIN reviews r ON p.id = r.product_id 
        WHERE p.category = :category 
        GROUP BY p.id 
        HAVING AVG(r.rating) >= :minRating 
        ORDER BY avg_rating DESC
        """, nativeQuery = true)
    List<ProductWithRating> findTopRatedProductsByCategory(@Param("category") String category, @Param("minRating") Double minRating);
    
    // Projections
    @Query("SELECT new com.example.dto.ProductSummary(p.id, p.name, p.price) FROM Product p WHERE p.status = 'ACTIVE'")
    List<ProductSummary> findActiveProductSummaries();
    
    // Modifying queries
    // @Modifying annotation tells Spring Data that a custom query defined with @Query is an UPDATE, INSERT, or DELETE query, not a SELECT query.
    // such methods should be executed within a transaction
    // The service method/class that calls this, should be annotated with @Transactional. otherwise, the operation will fail.
    @Modifying
    @Query("UPDATE Product p SET p.status = 'DISCONTINUED' WHERE p.createdDate < :cutoffDate")
    int discontinueOldProducts(@Param("cutoffDate") Date cutoffDate);
    
    @Modifying
    @Query("DELETE FROM Product p WHERE p.status = 'DISCONTINUED' AND p.updatedDate < :cutoffDate")
    int deleteDiscontinuedProducts(@Param("cutoffDate") Date cutoffDate);
}
```

## The Safety Net: Transactions
- Transactions provide a mechanism for grouping database operations into a single cohesive unit, allowing applications to maintain a consistent state even in the presence of concurrent access and system failures.
- Spring Transactions are primarily managed using @Transactional annotation.
- This annotation can be applied at the class or method level to indicate that the annotated method (or all methods within the annotated class) should be executed within a transaction context.
- Spring Transactions work with various transaction management strategies, including JDBC, JPA (Java Persistence API), Hibernate, and JTA (Java Transaction API).
- Spring Transactions abstract away the complexities of managing transactions.

```java
@Service
@Transactional
public class OrderService {
    // Default transaction settings (READ_WRITE, REQUIRED)
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        // request processing

        orderRepository.save(order);
        paymentService.processPayment(savedOrder);
        emailService.sendOrderConfirmation(savedOrder);
        
        return order;
    }
    
    // Read-only transaction for better performance
    @Transactional(readOnly = true)
    public List<Order> findOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    // Custom transaction settings
    @Transactional(
        propagation = Propagation.REQUIRES_NEW,
        isolation = Isolation.READ_COMMITTED,
        timeout = 30,
        rollbackFor = {PaymentException.class}
    )
    public void processOrderPayment(Long orderId, PaymentDetails paymentDetails) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStateException("Order is not in pending state");
        }
        
        try {
            PaymentResult result = paymentService.processPayment(order, paymentDetails);
            if (result.isSuccessful()) {
                order.setStatus(OrderStatus.PAID);
                order.setPaymentReference(result.getTransactionId());
                orderRepository.save(order);
                // Start fulfillment process
                fulfillmentService.initiateShipping(order);
            } else {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
                orderRepository.save(order);
                throw new PaymentException("Payment failed: " + result.getErrorMessage());
            }
        } catch (PaymentGatewayException e) {
            // This will trigger rollback due to rollbackFor configuration
            throw new PaymentException("Payment gateway error", e);
        }
    }
}
```

### `TransactionManager`
- A Transaction Manager in Spring is responsible for managing transactions in a Spring application.
- It coordinates the beginning and ending of transactions, commits or rolls them back based on success or failure, and ensures data consistency and integrity.
- `DataSourceTransactionManager` is used with JDBC-based data access, where transactions are managed at the database level using JDBC’s Connection API.
- `JpaTransactionManager` manages transactions for JPA-based persistence units and coordinates with the underlying JPA provider.
- `JtaTransactionManager` is used in distributed environments where transactions span multiple resources or systems.
- `HibernateTransactionManager` is similar to `JpaTransactionManager` but tailored for use with the Hibernate ORM framework.

```java
@Configuration
@EnableTransactionManagement
public class PersistenceConfig {
    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
}
}
```

### Transaction event handling

```java
public class OrderCreatedEvent extends ApplicationEvent {
    private final Order order;

    public OrderCreatedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }

    public Order getOrder() {
        return order;
    }
}

@Service
public class OrderService {
    @Transactional
    public Order createOrder(OrderData data) {
        Order newOrder = new Order(data);
        Order savedOrder = orderRepository.save(newOrder);
        eventPublisher.publishEvent(new OrderCreatedEvent(this, savedOrder));
        return savedOrder;
    }
}

@Component
public class OrderTransactionEventListener {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCreated(OrderCreatedEvent event) {
        notificationService.sendOrderNotification(event.getOrder());
    }
    
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handleOrderCreationFailed(OrderCreatedEvent event) {
        alertService.sendOrderFailureAlert(event.getOrder());
    }
}
```

## Resources
- [Data Access](https://docs.spring.io/spring-framework/reference/data-access.html)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [Understanding Entity Mapping in JPA with Examples: @Entity, @Id, @Column, @Table, and Relationships](https://www.codingshuttle.com/spring-boot-handbook/entity-mapping/)
- [Knee-deep in Spring Boot, Transactional Event Listeners and CGLIB proxies](https://dev.to/peholmst/knee-deep-in-spring-boot-transactional-event-listeners-and-cglib-proxies-1il9)