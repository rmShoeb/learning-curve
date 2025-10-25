# 10 - Spring Boot

## Core Features and Benefits
- Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications with minimal configuration.
- It provides auto-configuration, embedded servers, and opinionated defaults.

### Key Advantages
- **Auto-configuration**: Automatically configures Spring and third-party libraries
- **Embedded servers**: Built-in Tomcat, Jetty, or Undertow
- **Starter dependencies**: Curated dependency collections
    - It provides starter packages (*e.g.*, `spring-boot-starter-web`, `spring-boot-starter-data-jpa`).
    - These are pre-packaged bundles of commonly used dependencies that are tested and guaranteed to work together.
    - Including a single starter pulls in everything we need for a specific functionality, from Spring modules to third-party libraries.
- **Production-ready features**: Health checks, metrics, externalized configuration
- **No code generation**: Pure Java configuration
- **Minimal XML configuration**: Convention over configuration

### Auto-configuration
- In classic Spring, we had to manually and explicitly define beans for common components like a `DataSource`, `EntityManagerFactory`, `TransactionManager`, and `DispatcherServlet` in XML or Java `@Configuration` classes.
- Spring Boot detects the libraries we have included and automatically creates and configures these beans for us with sensible defaults.
- For example, if it sees the H2 database JAR on the classpath, it will automatically configure an in-memory database and a DataSource bean to connect to it.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Automatic configuration of JPA repositories
@SpringBootApplication
public class Application {
    @Bean
    public CommandLineRunner demo(CustomerRepository repository) {
        return args -> {
            repository.save(new Customer("John", "Doe"));
            repository.findAll().forEach(System.out::println);
        };
    }
}
```

### Embedded Server
- In classic Spring, we typically have to package our application as a WAR file and deploy it to an external server like `Tomcat` or `JBoss`.
- In Spring Boot, the `spring-boot-starter-web` includes an embedded Tomcat server by default.
- This allows us to package our application as a standalone, executable JAR file that we can run with a simple `java -jar` command, without needing an external server.
- This means: no need for external server configuration, easy deployment, development-friendly.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addAdditionalTomcatConnectors(createStandardConnector());
        return tomcat;
    }
}
```

### Type-safe Configuration
- It allows us to bind a group of related properties from the configuration file (like `application.properties`) to a structured Java object in a type-safe way.
- It is a powerful alternative to injecting individual values with `@Value`, especially when there are many related configuration keys.
- This gives us the ability to work with a real Java object with proper types, not just strings.
- It groups related properties, making the configuration much cleaner and easier to manage.

```properties
app.mail.host=smtp.example.com
app.mail.port=587
app.mail.from=noreply@example.com
```

```java
@Configuration
@ConfigurationProperties(prefix = "app.mail")
public class MailProperties {
    private String host;
    private int port;
    private String from;
    // getters and setters
}

// Usage
@Service
public class EmailService {
    private final MailProperties mailProps;

    public EmailService(MailProperties mailProps) {
        this.mailProps = mailProps;
    }
}
```

### Conditional Configuration

```java
@Configuration
public class DatabaseConfig {
    @Bean
    @ConditionalOnProperty(name = "db.type", havingValue = "mysql")
    // This annotation makes a bean's creation dependent on a property in the application.properties file.
    public DataSource mysqlDataSource() {
        return new MysqlDataSource();
    }

    @Bean
    @ConditionalOnMissingBean
    // This annotation tells Spring Boot to create a bean only if a bean of that same type has not already been defined by the user.
    public DataSource defaultDataSource() {
        return new EmbeddedDataSource();
    }
}
```

## Auto-Configuration

### `@SpringBootApplication` Breakdown
- The `@SpringBootApplication` annotation is a convenient shortcut that combines three essential annotations we need to start a Spring application.
- Using this single annotation is equivalent to using `@SpringBootConfiguration`,` @EnableAutoConfiguration`, and `@ComponentScan` together.
- `@SpringBootConfiguration`
    - This is a specialized version of Spring's standard `@Configuration`.
    - It marks the class as the main configuration source for the application.
    - This allows Spring Boot to find it automatically, especially for integration tests that use `@SpringBootTest`.
- `@EnableAutoConfiguration`
    - This is the core of Spring Boot's "magic".
    - It tells Spring Boot to automatically configure any components that it thinks we will need based on the JARs on the classpath.
    - For example, if it finds the `spring-boot-starter-web` dependency, it automatically configures Tomcat and Spring MVC.
- `@ComponentScan`
    - This is a standard Spring annotation that tells Spring to look for other components (like controllers, services, and repositories) in the current package and all its sub-packages.
    - Any class annotated with `@Component`, `@Service`, `@Repository`, or `@Controller` will be automatically detected and registered as a bean in the Spring application context.

### Customizing `@SpringBootApplication`
- By default, Spring Boot scans for components only in the current package and its sub-packages.
- If we need to scan other packages, we can use the `scanBasePackages` attribute.
- Sometimes, we may need to prevent Spring Boot from applying a specific auto-configuration. We can use the `exclude` attribute for that.
- For maximum flexibility, we can drop `@SpringBootApplication` and use the three individual annotations instead.

```java
@SpringBootApplication(
    scanBasePackages = {"com.example.myapp", "com.example.shared"},
    exclude = {DataSourceAutoConfiguration.class, SecurityAutoConfiguration.class}
)
@EnableCaching
@EnableScheduling
public class MyApplication {
    public static void main(String[] args) {
        // Customize the SpringApplication before running
        SpringApplication app = new SpringApplication(MyApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.setAdditionalProfiles("custom");
        app.run(args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @EventListener
    public void handleApplicationReady(ApplicationReadyEvent event) {
        System.out.println("🚀 Application is ready to serve requests!");
    }
}
```


## Developer Productivity Features
- `spring-boot-devtools` is a special dependency we can add to our project.
- Once added, it automatically enables some features to create a better development experience.
- It's smart enough to disable itself when we build a production-ready JAR file, so there's no performance impact in production.

**Dependency**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

**DevTools Features:**
- Automatic restart
    - When we change a Java file and save it, DevTools automatically restarts the embedded server.
    - This is a "smart" restart that is typically much faster than a full manual stop and start.
- LiveReload support
    - When we change a static resource like an HTML, CSS, JavaScript, or Thymeleaf template file, DevTools triggers a browser refresh without restarting the server.
    - This provides instant feedback on front-end changes.
    - However, this requires a LiveReload browser extension.
- Sensible Property Defaults
    - DevTools automatically applies configuration properties that are sensible for a development environment.
    - The most important example is disabling caching. This is helpful for template engines like Thymeleaf.
- Failure Analysis
    - This feature makes debugging startup errors much easier.
    - In a complex application, a startup error can produce a long, confusing stack trace (*e.g.*, "Error creating bean...").
    - Spring Boot includes `FailureAnalyzers` that intercept common startup exceptions. They analyze the cause and print a clear, human-readable report that diagnoses the problem and often suggests a solution.
- Spring Boot CLI - a tool for rapid prototyping of Spring applications.

## Monitoring and Management
- Spring Boot Actuator is a sub-project that adds production-ready features to an application, allowing us to monitor and manage it with minimal effort.
- The core of Actuator is a set of endpoints exposed over HTTP or JMX.
- Once the `spring-boot-starter-actuator` dependency is added, these endpoints provide a wealth of information about the running application.
- For security, only a few endpoints like `/health` and `/info` are exposed over the web by default.
- We can expose more by setting the `management.endpoints.web.exposure.include=* property`.

### Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Actuator Configuration

```properties
# Enable all actuator endpoints
management.endpoints.web.exposure.include=*

# Custom actuator port
management.server.port=9090

# Health endpoint details
management.endpoint.health.show-details=always
```

### Custom Health Indicator

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                    .withDetail("database", "Available")
                    .withDetail("connections", getConnectionPoolSize())
                    .build();
            }
        } catch (Exception ex) {
            return Health.down()
                .withDetail("database", "Unavailable")
                .withException(ex)
                .build();
        }
        return Health.down()
            .withDetail("database", "Connection invalid")
            .build();
    }
    
    private int getConnectionPoolSize() {
        // Implementation depends on connection pool
        return 10;
    }
}

@Component
public class CustomInfoContributor implements InfoContributor {
    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("runtime", getRuntimeInfo())
               .withDetail("features", getEnabledFeatures());
    }
    
    private Map<String, Object> getRuntimeInfo() {
        Map<String, Object> runtime = new HashMap<>();
        runtime.put("jvm.version", System.getProperty("java.version"));
        runtime.put("os.name", System.getProperty("os.name"));
        runtime.put("memory.max", Runtime.getRuntime().maxMemory());
        runtime.put("memory.total", Runtime.getRuntime().totalMemory());
        runtime.put("memory.free", Runtime.getRuntime().freeMemory());
        return runtime;
    }
    
    private List<String> getEnabledFeatures() {
        return Arrays.asList("user-management", "reporting", "caching");
    }
}
```

### Auditing
- This is a feature of Spring Data JPA that helps to track changes to our data.
- It's crucial for management and compliance.
- Auditing automatically populates fields on our entities like who created them and when they were last modified.
- We have to add annotations like `@CreatedBy`,` @CreatedDate`, `@LastModifiedBy`, and `@LastModifiedDate` to the JPA entities.
- We then have to provide an `AuditorAware` bean that tells Spring Data how to get the current user (usually from the `SecurityContextHolder`). This creates a clear audit trail for all our important data.

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider") // Enable auditing
public class PersistenceConfig {
    @Bean // This bean provides the current auditor (e.g., the logged-in user)
    public AuditorAware<String> auditorProvider() {
        // In a real app, we would get this from the Spring Security context
        return () -> Optional.of("admin");
    }
}

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class) // This listener populates the fields
public abstract class Auditable {
    @CreatedBy
    protected String createdBy;

    @CreatedDate
    protected LocalDateTime createdDate;

    // Getters and setters...
}

@Entity
public class Product extends Auditable {
    @Id
    private Long id;
    private String name;
    // When a new Product is created using its repository, the createdBy and createdDate fields will be automatically populated by Spring Data JPA.
    
    // ... constructors, getters, setters
}
```

## Resources
- [Spring Boot](https://docs.spring.io/spring-boot/)
- [Learn Spring Boot Series](https://www.baeldung.com/spring-boot)
- [Auditing](https://docs.spring.io/spring-data/jpa/reference/auditing.html)