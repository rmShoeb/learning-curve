# Configuration

- Spring provides three main approaches to configuration:
    - XML-based
    - Annotation-based
    - Java-based configuration.
- Modern Spring applications primarily use annotation and Java-based configuration.

## XML Configuration (Legacy)
- From the Spring IoC containers point-of-view, everything is a bean.
- The objects defined in a Spring XML configuration file are not all generic, vanilla beans.
- The classic `<bean/>`-based approach is good, but its generic-nature comes with a price in terms of configuration overhead.

```xml
<!-- applicationContext.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="userService" class="com.example.service.UserServiceImpl">
        <property name="userRepository" ref="userRepository"/>
    </bean>
    
    <bean id="userRepository" class="com.example.repository.UserRepositoryImpl"/>
</beans>
```

## Annotation-based Configuration
- Once component scanning is enabled, Spring automatically discovers, creates, and auto-wires everything.
- It is cleaner and faster to write.

```java
@Component
public class UserRepository {
    public User findById(Long id) {
        return new User(id, "John Doe");
    }
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User getUser(Long id) {
        return userRepository.findById(id);
    }
}

@Configuration
@ComponentScan("com.example") // if we do not define this, then we will require XML configuration for component scanning
public class AppConfig {
    // Spring will automatically detect and register @Component classes
}
```

## Java-based Configuration
- With this, we explicitly define how each bean is created, and its requirements.
- This provides finer control on configuration.
- With this, we can conditionally create beans.

```java
@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new UserRepositoryImpl();
    }
    
    @Bean
    public UserService userService() {
        UserService service = new UserServiceImpl();
        service.setUserRepository(userRepository());
        return service;
    }
    
    @Bean
    @Scope("prototype") // Different scope
    public UserPreferences userPreferences() {
        return new UserPreferences();
    }
}
```

## Profiles and Environment Configuration
- Spring Profiles provide a way to segregate parts of the application configuration and make it be available only in certain environments.
- It tells Spring: "Only register this bean if the given profile is active."
- Any `@Component`, `@Configuration` or `@ConfigurationProperties` can be marked with `@Profile` to limit when it is loaded.
- If `@ConfigurationProperties` beans are registered through `@EnableConfigurationProperties` instead of automatic scanning, the `@Profile` annotation needs to be specified on the `@Configuration` class that has the `@EnableConfigurationProperties` annotation.

```java
@Configuration
@Profile("development")
public class DevConfig {
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
        return builder.setType(EmbeddedDatabaseType.H2)
                    .addScript("schema.sql")
                    .addScript("data.sql")
                    .build();
    }
    
    @Bean
    public MailSender mailSender() {
        return new MockMailSender();
    }
}

@Configuration
@Profile("production")
public class ProdConfig {
    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:postgresql://prod-db:5432/myapp");
        return dataSource;
    }
    
    @Bean
    public MailSender mailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.company.com");
        return mailSender;
    }
}

@Configuration
@Profile({"test", "integration"})
public class TestConfig {
    @Bean
    @Primary
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .build();
    }
}
```

### Environment-specific Properties

```properties
# application.properties (default)
app.name=My Spring Application
logging.level.com.example=INFO
spring.profiles.active=dev

# application-dev.properties
logging.level.com.example=DEBUG
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true

# application-prod.properties
logging.level.com.example=WARN
spring.datasource.url=${DATABASE_URL}
server.port=8080
```

Or, provide profile name in command line:
```bash
java -jar myapp.jar --spring.profiles.active=prod
```

### Using `@Value` with Environment

```java
@Component
public class AppProperties {
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.version:1.0.0}") // Default value
    private String appVersion;
    
    @Value("${app.features:feature1,feature2}")
    private List<String> features;
    
    @Value("#{systemProperties['user.home']}")
    private String userHome;
    
    @Value("#{environment['PATH']}")
    private String path;
    
    // Getters
    public String getAppName() { return appName; }
    public String getAppVersion() { return appVersion; }
    public List<String> getFeatures() { return features; }
}
```