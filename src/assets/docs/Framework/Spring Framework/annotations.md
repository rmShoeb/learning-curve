# 04 - Core Annotations

## `@Configuration` and `@Bean`
- The `@Bean` annotation is used to indicate that a method instantiates, configures, and initializes a new object to be managed by the Spring IoC container.
- The `@Bean` annotation plays the same role as the `<bean/>` element.
- Annotating a class with `@Configuration` indicates that its primary purpose is as a source of bean definitions.
- `@Configuration` classes let inter-bean dependencies be defined by calling other `@Bean` methods in the same class. It can be considered the equivalent of `<beans/>` tag.
- In common scenarios, `@Bean` methods are to be declared within `@Configuration` classes. This prevents the same `@Bean` method from accidentally being invoked through a regular Java method call, which helps to reduce subtle bugs that can be hard to track down.

```java
@Configuration
public class DatabaseConfig {
    @Value("${database.url}")
    private String databaseUrl;

    @Value("${database.username}")
    private String username;

    @Value("${database.password}")
    private String password;
    
    @Bean
    @Primary // This bean will be preferred when multiple beans of same type exist
    public DataSource primaryDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(databaseUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(20);
        return dataSource;
    }
    
    @Bean("readOnlyDataSource")
    public DataSource readOnlyDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(databaseUrl + "?readOnly=true");
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(10);
        return dataSource;
    }
    
    @Bean
    @ConditionalOnProperty(name = "cache.enabled", havingValue = "true") // Only create this bean if a specific property exists (and optionally has a certain value) in application.properties
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "products");
    }
}
```

## `@Component` Family

**`@Component`**
- Generic stereotype annotation.
- Indicates that the annotated class is a component.
- Classes annotated with this are considered as candidates for auto-detection when using annotation-based configuration and classpath scanning.
```java
@Component
public class GenericComponent {
    // ...
}
```

**`@Repository`**
- Indicates that an annotated class is a "Repository", a mechanism for encapsulating storage, retrieval, and search behavior which emulates a collection of objects.
- This annotation serves as a specialization of `@Component`, allowing for implementation classes to be autodetected through classpath scanning.

```java
@Repository // Data access layer
public class UserRepository {
    public List<User> findAll() {
        // Database access logic
        return Arrays.asList(
            new User(1L, "Alice"),
            new User(2L, "Bob")
        );
    }
}
```

**`@Service`**
- Indicates that an annotated class is a "Service", an operation offered as an interface that stands alone in the model, with no encapsulated state.
- May also indicate that a class is a "Business Service Facade", or something similar.
- This annotation serves as a specialization of `@Component`, allowing for implementation classes to be autodetected through classpath scanning.
```java
@Service // Business logic layer
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public void saveUser(User user) {
        // Business logic with transaction
        userRepository.save(user);
    }
}
```

**`@Controller`**
- Indicates that an annotated class is a "Controller" (for example, a web controller).
- It is typically used in combination with annotated handler methods based on the RequestMapping annotation.

```java
@Controller
public class UserController {
    @Autowired
    private UserService userService;
    
    @RequestMapping("/users")
    public ModelAndView listUsers() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("welcome");
        mv.getModel().put("data", "Welcome home man");
        return mv;
    }
}

@RestController // REST API controller
public class UserRestController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/api/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
```

## `@ComponentScan`
- `@Component` annotation serves the purpose of differentiating beans from other objects, such as domain objects.
- Spring uses the `@ComponentScan` annotation to gather them into its `ApplicationContext`.

```java
@Configuration
@ComponentScan("com.example")
// or
@ComponentScan(basePackages = { "com.example.services", "com.example.repositories" }) // to scan multiple packages
public class AppConfig {
    // Spring will automatically detect and register @Component classes
}
```

```xml
<!--beans.xml-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
         http://www.springframework.org/schema/beans
         http://www.springframework.org/schema/beans/spring-beans.xsd
         http://www.springframework.org/schema/context
         http://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="com.example.app" />
</beans>
```

## `@Autowired`
- We can use Spring `@Autowired` annotation for spring bean autowiring.
- `@Autowired` annotation can be applied on variables, methods, and constructors.
- For `@Autowired` annotation to work, we also need to enable annotation based configuration in spring bean configuration file.
- This can be done by `context:annotation-config` element or by defining a bean of type `org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor`.

**`@Qualifier` annotation**
- This annotation is used to avoid conflicts in bean mapping and we need to provide the bean name that will be used for autowiring.
- This way we can avoid issues where multiple beans are defined for same type.
- This annotation usually works with the `@Autowired` annotation.
- For constructors with multiple arguments, we can use this annotation with the argument names in the method.

There are different ways through which we can autowire a spring bean.

### Autowire by Type
- For this type of autowiring, class type is used.
- So there should be only one bean configured for this type in the spring bean configuration file.

```java
public class MovieRecommender {
    @Autowired
    private CustomerPreferenceDao customerPreferenceDao;

    // Optional injection
    @Autowired(required = false)
    private AuditService auditService;
}
```

### Autowire by Name
- For this type of autowiring, setter method is used for dependency injection.
- Also the variable name should be same in the class where we will inject the dependency and in the spring bean configuration file.

```java
public class MovieRecommender {
    @Autowired
    @Qualifier("RestrictedCustomerPreferenceDao")  // by name: looks for bean named "RestrictedCustomerPreferenceDao"
    private CustomerPreferenceDao customerPreferenceDao;
}
```

### Autowire by Constructor
- This is almost similar to autowire by Type, the only difference is that constructor is used to inject the dependency.

```java
public class MovieRecommender {
	private final CustomerPreferenceDao customerPreferenceDao;

	@Autowired
	public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
		this.customerPreferenceDao = customerPreferenceDao;
	}
}
```

### Autowire by autodetect
- Spring 3.0 or older versions had this option available.
- This option was used for autowire by constructor or byType, as determined by Spring container.
- Since we already have so many options, this option now is deprecated.

### Self Injection
- `@Autowired` also considers self references for injection.
- However, it is a fallback mechanism.
- In practice, it should be used as a last resort only.
- As an alternative, it can be considered factoring out the affected methods to a separate delegate bean in such a scenario.
- Another alternative is to use `@Resource`, which may obtain a proxy back to the current bean by its unique name.