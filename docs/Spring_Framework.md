# Topic: Spring Framework

# Introduction to Spring Framework

## What is Spring Framework?
### Overview
- Spring Framework is a comprehensive, lightweight framework for developing enterprise Java applications.
- It provides infrastructure support for developing Java applications, making it easier to create robust, maintainable, and testable applications.
- The term "Spring" means different things in different contexts.
- Most often, when people say "Spring", they mean the entire family of projects.
- The Spring Framework is divided into modules. Applications can choose which modules they need.
- The Spring programming model does not embrace the Jakarta EE platform specification; rather, it integrates with carefully selected individual specifications from the traditional EE umbrella.

### Key Features
- Inversion of Control (IoC) and Dependency Injection (DI)
- Aspect-Oriented Programming (AOP)
- Data Access abstraction
- Transaction management
- Web MVC framework
- Security framework

### Why Spring is Widely Used?
1. **Modular Architecture**: Spring is organized into modules, allowing you to use only what you need.
2. **Powerful Features**: Comprehensive set of features for enterprise development.
3. **Community Support**: Large, active community with extensive documentation.
4. **Integration**: Easy integration with other frameworks and libraries.
5. **Testing Support**: Excellent support for unit and integration testing.

### Core Spring Projects
1. **Spring Core**: IoC container and DI
2. **Spring Boot**: Auto-configuration and rapid development
3. **Spring Data**: Data access abstraction
4. **Spring MVC**: Web application framework
5. **Spring Security**: Authentication and authorization
6. **Spring Cloud**: Microservices and cloud-native development
7. **Spring Batch**: Batch processing
8. **Spring Integration**: Enterprise Integration Patterns

## Bean
- Java Beans are an essential component of Java programming that allows for the creation of reusable and interoperable software components.
- They are essentially Java classes that encapsulate data and functionality, making them easily accessible and manageable.
- Java Beans follow the principle of “Write Once, Run Anywhere” and can be integrated seamlessly into various Java development frameworks.
- A Spring IoC container manages one or more beans.
- These beans are created with the configuration metadata that supplied to the container (like in the form of XML `<bean/>` definitions).
- A bean definition is essentially a recipe for creating one or more objects.
- The container looks at the recipe for a named bean when asked and uses the configuration metadata encapsulated by that bean definition to create (or acquire) an actual object.

## Inversion of Control?
- It is a principle in software engineering which transfers the control of objects or portions of a program to a container or framework.
- In a traditional program, the code is in control, it calls libraries and controls the flow. In Inversion of Control, the framework or container is in control — it calls the code when needed.
- To enable this, frameworks use abstractions with additional behavior built in. If we want to add our own behavior, we need to extend the classes of the framework or plugin our own classes.
- We can achieve Inversion of Control through various mechanisms such as: Strategy design pattern, Service Locator pattern, Factory pattern, and Dependency Injection (DI).

**The advantages of this architecture are:**
- decoupling the execution of a task from its implementation
- making it easier to switch between different implementations
- greater modularity of a program
- greater ease in testing a program by isolating a component or mocking its dependencies, and allowing components to communicate through contracts

### Dependency Injection
- It is a specialized form of IoC, where objects define their dependencies only through constructor arguments, arguments to a factory method, or properties that are set on the object instance after it is constructed or returned from a factory method.
- The container then injects those dependencies when it creates the bean.
- Code is cleaner with the DI principle, and decoupling is more effective when objects are provided with their dependencies.
- The object does not look up its dependencies and does not know the location or class of the dependencies.
- As a result, the classes become easier to test, particularly when the dependencies are on interfaces or abstract base classes, which allow for stub or mock implementations to be used in unit tests.

### The IoC Container (`ApplicationContext`)
- The IoC container is a fundamental principle, not a specific class.
- It's the name for the system that manages objects and their dependencies.
- The `ApplicationContext` is the actual thing in Spring that is the IoC container. It's a Java interface that provides all the functionality.
- `ApplicationContext` is a sub-interface of `BeanFactory`.
- The `BeanFactory` provides the configuration framework and basic functionality, and the `ApplicationContext` adds more enterprise-specific functionality.
- It does everything the IoC container concept describes, plus more advanced features like:
    - Event publication
    - Internationalization (handling different languages)
    - Integration with Spring's Aspect Oriented Programming (AOP) features

### Constructor-based Dependency Injection
```java
public class SimpleMovieLister {
	// the SimpleMovieLister has a dependency on a MovieFinder
	private final MovieFinder movieFinder;

	// a constructor so that the Spring container can inject a MovieFinder
	public SimpleMovieLister(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder
}
```
- Constructor argument resolution matching occurs by using the argument’s type.
- If no potential ambiguity exists in the constructor arguments of a bean definition, the order in which the constructor arguments are defined in a bean definition is the order in which those arguments are supplied to the appropriate constructor when the bean is being instantiated.

### Setter-based Dependency Injection
```java
public class SimpleMovieLister {
	// the SimpleMovieLister has a dependency on the MovieFinder
	private MovieFinder movieFinder;

	// a setter method so that the Spring container can inject a MovieFinder
	public void setMovieFinder(MovieFinder movieFinder) {
		this.movieFinder = movieFinder;
	}

	// business logic that actually uses the injected MovieFinder
}
```
- Since we can mix constructor-based and setter-based DI, it is a good rule of thumb to use constructors for mandatory dependencies and setter methods or configuration methods for optional dependencies.

### Autowiring Dependencies
- Usually we provide bean configuration details in the spring bean configuration file and we also specify the beans that will be injected in other beans.
- But Spring framework provides autowiring features too where we don’t need to provide bean injection details explicitly.

```java
public class Store {
    @Autowired
    private Item item; 
}
```
- While constructing the Store object, if there’s no constructor or setter method to inject the `Item` bean, the container will use reflection to inject `Item` into `Store`.
- This approach might look simpler and cleaner, but it is not recommended to use because it has a few drawbacks:
    - Difficult to test.
    - The field can be `null` until Spring injects it.
    - Can’t mark it `final`, so it's mutable.
    - It's harder to tell from outside what this class depends on.
    - Using these beans outside Spring context fails, since autowired dependencies are not injected.

### Circular dependencies
- When using constructor injection heavily, it is possible to create an unresolvable circular dependency scenario.
- For example: Class A requires an instance of class B through constructor injection, and class B requires an instance of class A through constructor injection.
- If beans for classes A and B are configured to be injected into each other, the Spring IoC container detects this circular reference at runtime, and throws a `BeanCurrentlyInCreationException`.
- One possible solution is to edit the source code of some classes to be configured by setters rather than constructors.
- Alternatively, avoid constructor injection and use setter injection only.

## Core Annotations

### `@Configuration` and `@Bean`
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

### `@Component` Family

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

### `@ComponentScan`
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

### `@Autowired`
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
#### Autowire by Type
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

#### Autowire by Name
- For this type of autowiring, setter method is used for dependency injection.
- Also the variable name should be same in the class where we will inject the dependency and in the spring bean configuration file.
```java
public class MovieRecommender {
    @Autowired
    @Qualifier("RestrictedCustomerPreferenceDao")  // by name: looks for bean named "RestrictedCustomerPreferenceDao"
    private CustomerPreferenceDao customerPreferenceDao;
}
```

#### Autowire by Constructor
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

#### Autowire by autodetect
- Spring 3.0 or older versions had this option available.
- This option was used for autowire by constructor or byType, as determined by Spring container.
- Since we already have so many options, this option now is deprecated.

#### Self Injection
- `@Autowired` also considers self references for injection.
- However, it is a fallback mechanism.
- In practice, it should be used as a last resort only.
- As an alternative, it can be considered factoring out the affected methods to a separate delegate bean in such a scenario.
- Another alternative is to use `@Resource`, which may obtain a proxy back to the current bean by its unique name.

## Configuration

- Spring provides three main approaches to configuration:
    - XML-based
    - Annotation-based
    - Java-based configuration.
- Modern Spring applications primarily use annotation and Java-based configuration.

### XML Configuration (Legacy)
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

### Annotation-based Configuration
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

### Java-based Configuration
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

## Resources
- [Intro to Inversion of Control and Dependency Injection with Spring](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)
- [Understanding Java Beans: A Comprehensive Guide for Beginners](https://medium.com/@mgm06bm/understanding-java-beans-a-comprehensive-guide-for-beginners-684163011c82)
- [Spring @Autowired Annotation](https://www.digitalocean.com/community/tutorials/spring-autowired-annotation)
- [Spring Configuration Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)
- [Spring Profiles Guide](https://docs.spring.io/spring-boot/reference/features/profiles.html#features.profiles)

---

# Spring Web MVC
- The original web framework built on the Servlet API.
- It follows the Model-View-Controller design pattern, providing separation of concerns between presentation, business logic, and data access layers.

## Model-View-Controller (MVC) Architecture
- It is an architectural/design pattern, created by **Trygve Reenskaug**, that separates an application into three main logical components Model, View, and Controller.
- Each architectural component is built to handle specific development aspects of an application.
- It isolates the business logic and presentation layer from each other.
- It was traditionally used for desktop applications. But now it is vastly used for web development frameworks and mobile apps as well.

![MVC Architechture](https://media.geeksforgeeks.org/wp-content/uploads/20220224160807/Model1.png)

### Components
**Model**
- It corresponds to all the data and business logic (Entities, DTOs, Services) that the user works with.
- It can add or retrieve data from the database.
- It responds to the controller's request because the controller can't interact with the database by itself.
- The model interacts with the database and gives the required data back to the controller.

**View**
- It is the presentation layer (JSP, Thymeleaf, JSON responses).
- It is used for all the UI logic of the application.
- Views are created by the data which is collected by the model component but these data are taken through the controller.
- Its job is to render data to the user in a specific format, and update the display when the Model changes.

**Controller**
- It is the component that enables the interconnection between the views and the model so it acts as an intermediary.
- The controller doesn’t have to worry about handling data logic, it just tells the model what to do, and interact with the View to render the final output.
- It does request handling and flow control, *i.e.* selecting and displaying the appropriate View.

## The Engine: `DispatcherServlet`
- When any web request is made, it first goes to the Front Controller, which is the `DispatcherServlet`.
- The `DispatcherServlet` provides a shared algorithm for request processing.
- This is the central dispatcher for HTTP request handlers/controllers.
- It dispatches to registered handlers for processing a web request, providing convenient mapping and exception handling facilities.
- It is based around a `JavaBeans` configuration mechanism.
- It needs to be declared and mapped according to the Servlet specification by using Java configuration or in `web.xml`.
- It uses Spring configuration to discover the delegate components it needs for request mapping, view resolution, exception handling, and more.
- The DispatcherServlet acts as the main controller to route requests to their intended destination.
- The Spring Web MVC framework is designed around a DispatcherServlet.
- In the Web MVC framework, each `DispatcherServlet` has its own `WebApplicationContext`.
- The default handler is based on the `@Controller` and `@RequestMapping` annotations.

![Spring-MVC-Framework-Control-flow-Diagram](https://media.geeksforgeeks.org/wp-content/uploads/20231106150237/Spring-MVC-Framework-Control-flow-Diagram.png)

### Configuration
```java
public class MyWebApplicationInitializer implements WebApplicationInitializer {
	@Override
	public void onStartup(ServletContext servletContext) {
		// Load Spring web application configuration
		AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
		context.register(AppConfig.class);

		// Create and register the DispatcherServlet
		DispatcherServlet servlet = new DispatcherServlet(context);
		ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
		registration.setLoadOnStartup(1);
		registration.addMapping("/app/*");
	}
}
```
Or,
```xml
<web-app>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>

	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>/WEB-INF/app-context.xml</param-value>
	</context-param>

	<servlet>
		<servlet-name>app</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value></param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>app</servlet-name>
		<url-pattern>/app/*</url-pattern>
	</servlet-mapping>
</web-app>
```

## Controllers and Request Mapping
- A Controller is typically responsible for preparing a model Map with data and selecting a view name but it can also write directly to the response stream and complete the request.
- Controllers interpret user input and transform it into a model that is represented to the user by the view.
- The `@Controller` annotation indicates that a particular class serves the role of a controller.
- The dispatcher scans such annotated classes for mapped methods and detects `@RequestMapping` annotations.
- Annotated controller beans can be explicitly using a standard Spring bean definition in the dispatcher's context.
- The `@Controller` stereotype also allows for autodetection, using component scanning.
- `@RequestMapping` annotation is used to map URLs onto an entire class or a particular handler method.
- Typically the class-level annotation maps a specific request path (or path pattern) onto a form controller.
- Method-level annotations narrow down the primary mapping for a specific HTTP method request method ("GET", "POST", etc.) or an HTTP request parameter condition.
- If no HTTP method is specified on a @RequestMapping, the method will map to all HTTP methods by default.
- A `@RequestMapping` on the class level is not required. Without it, all paths are simply absolute, and not relative.

```java
@Controller
@RequestMapping("/app")
public class HelloWorldController {
    @RequestMapping("/helloWorld", method=RequestMethod.GET)
    public String helloWorld(Model model) {
        model.addAttribute("message", "Hello World!");
        return "helloWorld";
    }
}
```

There are also HTTP method specific shortcut variants of `@RequestMapping`:
- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`

## Handling Data
### Handling Inputs
#### `@RequestHeader`
- This annotation is used to bind a request header to a method argument in a controller.
- If the target method parameter type is not String, type conversion is automatically applied.
```java
@GetMapping("/demo")
public void handle(
		@RequestHeader("Accept-Encoding") String encoding,
		@RequestHeader("Keep-Alive") long keepAlive) {
	//...
}
```
#### `@RequestParam`
- This annotation is used to bind Servlet request parameters (query parameters or form data) to a method argument in a controller.
- By default, method parameters that use this annotation are required, but they can be set to optional as well (with `required` set to `false`, or setting a default value).
- Type conversion is automatically applied if the target method parameter type is not String.
```java
@GetMapping
public String setupForm(
    @RequestParam("petId") int petId,
    @RequestParam(value = "query", required = false) String petName,
    Model model) {
	// ...
}
```
#### `@PathVariable`
- It can be used to handle template variables in the request URI mapping, and set them as method parameters.
- If the names for the method parameter and the path variable are same, we do not have to define any argument.
- If the path variable name is different, we can specify it in the argument.
- Method parameters annotated with @PathVariable are required by default.
- To make them optional
    - we can set the required property of @PathVariable to false.
    - we can also use `java.util.Optional<T>` (Java 8+, from Spring 4.1)
```java
@GetMapping("/employees/{id}")
// base-url/employees/13
public String getEmployeesById(@PathVariable String id) {
    return "ID: " + id;
}

@GetMapping("/employees/{id}/{name}")
// base-url/employees/13/riyad
public String getEmployeesByIdAndName(@PathVariable String id, @PathVariable String name) {
    return "ID: " + id + ", name: " + name;
}

@GetMapping(value = { "/employeeswithrequiredfalse", "/employeeswithrequiredfalse/{id}" })
public String getEmployeesByIdWithRequiredFalse(@PathVariable(required = false) String id) {
    if (id != null) {
        return "ID: " + id;
    } else {
        return "ID missing";
    }
}

@GetMapping(value = { "/employeeswithoptional", "/employeeswithoptional/{id}" })
public String getEmployeesByIdWithOptional(@PathVariable Optional<String> id) {
    if (id.isPresent()) {
        return "ID: " + id.get();
    } else {
        return "ID missing";
    }
}
```
#### `@ModelAttribute`
- This method parameter annotation binds request parameters, URI path variables, and request headers onto a model object.
- URI variables and headers are included only if they don’t override request parameters with the same name.
- Dashes are stripped from request header names.
- When using constructor binding, we can customize request parameter names through an `@BindParam` annotation.
```java
@PostMapping("/owners/{ownerId}/pets/{petId}/edit")
public String processSubmit(@ModelAttribute Pet pet) {
	// method logic...
}

@PutMapping("/accounts/{account}")
public String save(@ModelAttribute("account") Account account) {
	// ...
}

class Account {
	private final String firstName;

	public Account(@BindParam("first-name") String firstName) {
		this.firstName = firstName;
	}
}
```
#### `@RequestBody`
- This annotation is used to have the request body read and deserialized into an Object through an `HttpMessageConverter`.
- The process used by `@RequestBody` is JSON/XML serialization, not Java Serialization. So the class does not need to be serializable.
- Spring uses `Jackson` for serialization/deserialization, which needs a no-arg constructor, and standard getters setters for the fields that should be included into the JSON/XML.
- Form data should be read using `@RequestParam`, not with `@RequestBody` which can’t always be used reliably since in the Servlet API.
- `HttpEntity` is more or less identical to using `@RequestBody` but is based on a container object that exposes request headers and body.
```java
@PostMapping("/accounts")
public void handle(@RequestBody Account account) {
	// ...
}
```

### Preparing Output
#### `@ResponseBody`
- This annotation on a method to have the return serialized to the response body through an HttpMessageConverter.
- It is also supported at the class level, in which case it is inherited by all controller methods.
- @RestController is nothing more than a meta-annotation marked with @Controller and @ResponseBody.
```java
@GetMapping("/accounts/{id}")
@ResponseBody
public Account handle() {
	// ...
}
```

#### `ResponseEntity`
- It is like @ResponseBody but with status and headers.
```java
@GetMapping("/something")
public ResponseEntity<String> handle() {
	String body = ... ;
	String etag = ... ;
	return ResponseEntity.ok().eTag(etag).body(body);
}
```

## Rendering the UI: `View` and `ViewResolver`
- Spring MVC defines the `ViewResolver` and `View` interfaces that let us render models in a browser without tying to a specific view technology.
- `ViewResolver` provides a mapping between view names and actual views.
- `View` addresses the preparation of data before handing over to a specific view technology.
- Content Negotiation does not resolve views itself but rather delegates to other view resolvers and selects the view that resembles the representation requested by the client.
```java
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
    // JSP View Resolver
    @Bean
    public ViewResolver jspViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        resolver.setViewClass(JstlView.class);
        resolver.setOrder(2);
        return resolver;
    }
    
    // Thymeleaf View Resolver
    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(templateResolver());
        engine.addDialect(new LayoutDialect());
        engine.addDialect(new Java8TimeDialect());
        return engine;
    }
    
    @Bean
    public ThymeleafViewResolver thymeleafViewResolver() {
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setTemplateEngine(templateEngine());
        resolver.setCharacterEncoding("UTF-8");
        resolver.setOrder(1);
        return resolver;
    }
    
    @Bean
    public TemplateResolver templateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setApplicationContext(applicationContext);
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCacheable(false); // Set to true in production
        return resolver;
    }
    
    // Static resource handling
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)));
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(30)));
    }
    
    // Content negotiation
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("format")
            .ignoreAcceptHeader(false)
            .useRegisteredExtensionsOnly(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .mediaType("html", MediaType.TEXT_HTML);
    }
}

// Controller with view resolution
@Controller
@RequestMapping("/products")
public class ProductViewController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public String listProducts(Model model,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        
        model.addAttribute("products", products);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", products.getTotalPages());
        
        return "products/list"; // Resolves to /WEB-INF/views/products/list.jsp
    }
    
    // Redirect example
    @PostMapping("/{id}/favorite")
    public String addToFavorites(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        productService.addToFavorites(id);
        redirectAttributes.addFlashAttribute("message", "Product added to favorites!");
        return "redirect:/products/" + id;
    }
    
    // Forward example
    @GetMapping("/search")
    public String searchProducts(@RequestParam String query, Model model) {
        if (query.trim().isEmpty()) {
            return "forward:/products"; // Forward to list products
        }
        
        List<Product> products = productService.searchByName(query);
        model.addAttribute("products", products);
        model.addAttribute("query", query);
        
        return "products/search-results";
    }
}
```

## Resources
- [MVC Framework Introduction](https://www.geeksforgeeks.org/software-engineering/mvc-framework-introduction/)
- [Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring MVC Series](https://www.baeldung.com/spring-mvc)
- [Spring - MVC Framework](https://www.geeksforgeeks.org/springboot/spring-mvc-framework/)

---

# Basic Exception Handling

## `@ExceptionHandler`
- Spring automatically invokes `@ExceptionHandler` annotated methods when the given exception occurs.
- We can specify the exception either with the annotation or by declaring it as a method parameter.
- Since Spring 6.2, we can write different exception handlers for different content types.
```java
@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<ValidationErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
    // ...
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler( produces = MediaType.APPLICATION_JSON_VALUE )
public CustomExceptionObject handleException3Json(CustomException3 ex) {
    // ...
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler( produces = MediaType.TEXT_PLAIN_VALUE )
public String handleException3Text(CustomException3 ex) {
    // ...
}
```

## Local Exception Handling
- We can place the handler methods in the controller class.
- We can use this approach whenever we need controller-specific exception handling.
- But it has the drawback that we cannot use it in multiple controllers unless we put it in a base class and use inheritance.
```java
@RestController
public class FooController {
    //...

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(NullPointerException.class)
    public void handleException() {
        // ...
    }
}
```

## Global Exception Handling
- This is the most common and powerful approach.
- We can create a separate class and annotate it with `@ControllerAdvice`.
- A `@ControllerAdvice` contains code that is shared between multiple controllers.
- We can then define `@ExceptionHandler` methods inside this class. These handlers will catch exceptions thrown from any controller across the entire application, allowing us to centralize the error-handling logic.
- For REST APIs, where each method’s return value should be rendered into the response body, there’s a `@RestControllerAdvice`.
```java
@RestControllerAdvice
public class MyGlobalExceptionHandler {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpClientErrorException.class)
    public void handleException() {
        // ...
    }
}
```
There’s also a base class (`ResponseEntityExceptionHandler`) that we could inherit from to use common pre-defined functionality.
```java
@ControllerAdvice
public class MyCustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({ 
        IllegalArgumentException.class, 
        IllegalStateException.class
    })
    ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        String bodyOfResponse = "This should be application specific";
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        // ... (customization, maybe invoking the overridden method)
    }
}
```

## Annotate Exceptions Directly
```java
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class MyResourceNotFoundException extends RuntimeException {
    // ...
}
```
- This resolver is limited in the way it deals with the body of the response.
- It maps the Status Code on the response, but the body is still `null`.
- We can only use it for our custom exceptions because we cannot annotate existing, already compiled classes.
- One drawback is that it creates tight coupling with the exception.

## Using ResponseStatusException
```java
@GetMapping(value = "/{id}")
public Foo findById(@PathVariable("id") Long id) {
    try {
        // ...
    } catch (MyResourceNotFoundException ex) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Foo Not Found", ex);
    }
}
```
- We can create an instance of it providing an HttpStatus and, optionally, a reason and a cause.
- Benefits
    - We can implement a basic solution quite fast.
    - Same exception may need cause different status code in different situation. Same area can cause different exceptions. Using this helps us provide use case specific implementation without tight coupling.
- Tradeoff
    - No unified approach.
    - We may find ourselves replicating code in multiple controllers.

## `HandlerExceptionResolver`
- It intercepts and processes any exception raised and not handled by a Controller.
- This resolves any exception thrown by the application.
- It also allows us to implement a uniform exception handling mechanism in our REST API.

### Existing Implementations
- There are already existing implementations that are enabled by default in the `DispatcherServlet`.
- `ExceptionHandlerExceptionResolver` is actually the core component of how the `@ExceptionHandler` mechanism presented earlier works.
- `ResponseStatusExceptionResolver` is actually the core component of how the `@ResponseStatus` mechanism presented earlier works.
- `DefaultHandlerExceptionResolver` is used to resolve standard Spring exceptions to their corresponding HTTP Status Codes, namely Client error `4xx` and Server error `5xx` status codes. While it does set the Status Code of the Response properly, one limitation is that it doesn’t set anything to the body of the Response.

### Custom HandlerExceptionResolver
```java
@Component
public class RestResponseStatusExceptionResolver extends AbstractHandlerExceptionResolver {
    @Override
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            if (ex instanceof IllegalArgumentException) {
                return handleIllegalArgument((IllegalArgumentException) ex, response, handler);
            }
            // ...
        } catch (Exception handlerException) {
            logger.warn("Handling of [" + ex.getClass().getName() + "] resulted in Exception", handlerException);
        }
        return null;
    }

    private ModelAndView handleIllegalArgument(
      IllegalArgumentException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_CONFLICT);
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        // ...
        return new ModelAndView();
    }
}
```

**Limitation:** It interacts with the low-level `HtttpServletResponse` and fits into the old MVC model that uses `ModelAndView`.

## Resources
- [Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- [Spring ResponseStatusException](https://www.baeldung.com/spring-response-status-exception)
- [Exceptions](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)

---

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
- However, we still need to write SQL queries explicitly, and map results to objects..
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

---

# Security & Authentication

## Introduction to Spring Security
- Spring Security is a framework that provides authentication, authorization, and protection against common attacks.
- It requires a Java 17 or higher Runtime Environment.

![How Security is set up in web applications](https://miro.medium.com/v2/resize:fit:720/format:webp/1*pWDGs1c3Nf2ANQnGOODMrQ.jpeg)
*How Security is set up in web applications*

- It is the middleware, which is executed before the code that executes the business logic of any particular endpoint.
- There are two things that are done on the middleware level: Authentication and Authorization.
- The role of middleware is typically performed by Servlet Filters, that are invoked before the Servlet, in the case with Spring Web: `DispatcherServlet`.

### The Security Filter Chain
![How Spring Security Works](https://miro.medium.com/v2/resize:fit:720/format:webp/1*w5eOljVpr3PxYass9PFS-w.jpeg)
*How Spring Security Works*

- Spring Security maintains a filter chain internally where each of the filters has a particular responsibility and filters are added or removed from the configuration depending on which services are required.
- It registers the Servlet filter of type `FilterChainProxy`, which allows Spring Security to implement its own filter mechanism with more granular control.
- Default Spring Security filter chain consists of many filters, but their purpose can be divided into a couple of categories:
    - **Authentication filters** - responsible for the creation of the authenticated object of the Authentication implementation and setting it into the `SecurityContext`.
    - **AuthorizationFilter** - responsible for deciding if the user can perform certain action based on the data in the Authentication.
    - **Other filters** - attack-protection (*e.g.*, `CsrfFilter`), exception mapping (*e.g.*, `ExceptionTranslationFilter`), etc.
- When setting up Spring Security, most of the time, we need to implement the logic of authentication only.
- By default, Spring Security applies basic security to all HTTP endpoints.

### CSRF Protection:
- Protection against Cross-Site Request Forgery attacks, where an attacker tricks a user into performing actions they didn't intend to.
- Spring Security includes CSRF protection by default, requiring a unique token to be sent with each HTTP request that modifies state.

### Customizing Security Configuration
- `WebSecurityConfigurerAdapter` is the base class that provides a convenient way to configure Spring Security for our application.
- By extending `WebSecurityConfigurerAdapter`, we can override methods to customize security settings such as authentication, authorization, and HTTP security.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // In-memory authentication with hardcoded users
        // In a production application, we would typically fetch user details from a database
        auth.inMemoryAuthentication()
            .withUser("user").password("password").roles("USER")
            .and()
            .withUser("admin").password("admin").roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Configuring which endpoints are secured and which are public
        // http.csrf().disable() will disable CRSF protection
        http.authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN") // Only accessible by users with the ADMIN role.
            .antMatchers("/user/**").hasRole("USER") // Only accessible by users with the USER role.
            .antMatchers("/").permitAll()
            .and().formLogin() // Enables form-based login
            .loginPage("/my-login").permitAll();
        // By default, Spring Security provides a login page when form-based authentication is enabled.
        // Users are redirected to this login page if they try to access a secured endpoint.
    }
}
```

## Authentication: Verifying Identity
- Authentication is how we verify the identity of who is trying to access a particular resource.
- A common way to authenticate users is by requiring the user to enter a username and password.
- Once authentication is performed we know the identity and can perform authorization.
- In case a particular API requires authentication and the information in the request is not sufficient or not valid to determine who the user is, the system typically denies the further processing of the request and responds with the 401 Unauthorized status code.

### `SecurityContext` and `SecurityContextHolder`
- The `SecurityContext` is a container object that stores authentication and security-related information about the currently logged-in user.
- It holds an Authentication object, which represents the principal (the user) and the user's granted authorities (roles/permissions).
- It is typically stored in a thread-local variable to ensure that the security information is specific to the current thread.
- The `SecurityContextHolder` is a helper class that provides access to the `SecurityContext`.
- It is the central point for accessing the security information of the current user in Spring Security.
- By default, Spring Security uses a `ThreadLocalSecurityContextHolderStrategy`, which means the `SecurityContext` is tied to the current thread.

### `AuthenticationManager`
- The `AuthenticationManager` is the gateway for authentication requests in Spring Security.
- It acts as a conductor, orchestrating the authentication process by delegating the actual verification of user credentials to one or more `AuthenticationProvider` instances.
- It accepts an Authentication object as input and attempts to authenticate the user based on the credentials provided.
- On successful authentication, it returns a fully populated Authentication object, including details such as the principal and granted authorities.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // This method configures the authentication mechanism.
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService) // Sets the custom user details service
            .passwordEncoder(passwordEncoder());      // Sets the password encoder
    }

    // This exposes the AuthenticationManager as a Bean.
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```

### `UserDetailsService`
- It is used by `DaoAuthenticationProvider` for retrieving a username, a password, and other attributes for authenticating with a username and password.
- Its job is to load user-specific data from the database (or any other source) by username.

```java
@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Find the user entity from the database
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // 2. Map the user's roles to Spring Security's GrantedAuthority objects
        Set<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role))
            .collect(Collectors.toSet());

        // 3. Return a Spring Security User object
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
}
```

### `PasswordEncoder`
- Spring Security’s `PasswordEncoder` interface is used to perform an one-way transformation of a password to let the password be stored securely.
- Spring provides the following password encoders:
    - `Argon2PasswordEncoder`
    - `BCryptPasswordEncoder`
    - `Pbkdf2PasswordEncoder`
    - `SCryptPasswordEncoder`
    - `NoOpPasswordEncoder`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // This bean is responsible for encoding passwords.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### `AuthenticationProvider`
- It processes specific types of authentication.
- Its interface exposes only two functions:
    - authenticate performs authentication with the request.
    - supports checks if this provider supports the indicated authentication type.
- One important implementation of the interface that we are using in our sample project is `DaoAuthenticationProvider`, which retrieves user details from a `UserDetailsService`.

#### `DaoAuthenticationProvider`
- It is an `AuthenticationProvider` implementation that uses a `UserDetailsService` and `PasswordEncoder` to authenticate a username and password.

![DaoAuthenticationProvider Usage](https://docs.spring.io/spring-security/reference/_images/servlet/authentication/unpwd/daoauthenticationprovider.png)
*`DaoAuthenticationProvider` Usage*

- Spring Security's `UsernamePasswordAuthenticationFilter` intercepts the login request, which contains the user's plain-text username and password.
- The filter creates a `UsernamePasswordAuthenticationToken`. This is an object that holds the credentials before they have been verified.
- This token is passed to the `AuthenticationManager`, which in turn passes it to the `DaoAuthenticationProvider`.
- The `DaoAuthenticationProvider` calls the custom `UserDetailsService` using the username. This service fetches the user's data from the database, including their stored, hashed password.
- `DaoAuthenticationProvider` uses the `PasswordEncoder` to validate the password on the `UserDetails` returned in the previous step.
- If authentication is successful, a fully authenticated token is created and stored in the `SecurityContextHolder`. Otherwise, a `BadCredentialsException` is thrown, and authentication fails.

## Spring Security With JWT for REST API
```java
@Component
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepo userRepo;

    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, UserRepo userRepo) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        // Get authorization header and validate
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(header) || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // Get jwt token and validate
        final String token = header.split(" ")[1].trim();
        if (!jwtTokenUtil.validate(token)) {
            chain.doFilter(request, response);
            return;
        }

        // Get user identity and set it on the spring security context
        UserDetails userDetails = userRepo
            .findByUsername(jwtTokenUtil.getUsername(token))
            .orElse(null);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null,
                userDetails == null ? List.of() : userDetails.getAuthorities()
        );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(request, response);
    }

}

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private final JwtTokenFilter jwtTokenFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // other config

        // Set permissions on endpoints
        http.authorizeRequests()
            .antMatchers("/api/login").permitAll()
            .anyRequest().authenticated();

        // Add JWT token filter
        http.addFilterBefore(
            jwtTokenFilter,
            UsernamePasswordAuthenticationFilter.class // Processes an authentication form submission
        );
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            UserDetails user = (UserDetails) authenticate.getPrincipal();
            String token = jwtTokenUtil.generateToken(user);

            return ResponseEntity.ok(token);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
```

## Cross-Origin Resource Sharing
- For security reasons, browsers prohibit AJAX calls to resources outside the current origin.
- Cross-Origin Resource Sharing (CORS) is a [W3C specification](https://www.w3.org/TR/cors/) implemented by most browsers that lets us specify what kind of cross-domain requests are authorized.
- The CORS specification distinguishes between preflight, simple, and actual requests.

### `@CrossOrigin`
By default, `@CrossOrigin` allows:
- All origins.
- All headers.
- All HTTP methods to which the controller method is mapped.

```java
@RestController
@RequestMapping("/account")
@CrossOrigin(origins = "https://domain2.com", maxAge = 3600)
public class AccountController {

	@CrossOrigin // enables cross-origin requests on annotated controller methods
	@GetMapping("/{id}")
	public Account retrieve(@PathVariable Long id) {
		// ...
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable Long id) {
		// ...
	}
}
```

### Global Configuration
- By default, global configuration enables the following:
    - All origins.
    - All headers.
    - GET, HEAD, and POST methods.
- `allowCredentials` is not enabled by default, since that establishes a trust level that exposes sensitive user-specific information (such as cookies and CSRF tokens) and should only be used where appropriate.

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
			.allowedOrigins("https://domain2.com")
			.allowedMethods("PUT", "DELETE")
			.allowedHeaders("header1", "header2", "header3")
			.exposedHeaders("header1", "header2")
			.allowCredentials(true).maxAge(3600);

		// Add more mappings...
	}
}
```

## Cross Site Request Forgery (CSRF)
- Cross-Site Request Forgery (CSRF or XSRF) is an attack that tricks an authenticated user into unknowingly submitting a malicious request to a website they trust.
- The goal of a CSRF attack is to make the victim perform a state-changing action, such as changing their email address, deleting data, or transferring funds, without their consent.
- The attack works because the server cannot distinguish between a legitimate request initiated by the user and a forged request initiated by a malicious site.
- Spring provides two mechanisms to protect against CSRF attacks:
    - The Synchronizer Token Pattern. This is the predominant and most comprehensive way to protect against CSRF attacks.
    - Specifying the SameSite Attribute on the session cookie
- Spring recommends to use CSRF protection for any request that could be processed by a browser by normal users. Otherwise, it can be disabled.
- However, in stateless REST APIs (with JWT), CSRF protection is not necessary. Since these applications don't rely on session cookies, the browser has no session to automatically send, and the primary vector for CSRF attacks is removed. This is why we explicitly disable it in JWT configurations with `http.csrf().disable()`.

## Authorization: Enforcing Permissions
- It is the security mechanism checks WHAT action the user is trying to perform and if the user has the permission or AUTHORITY to do that particular action.
- If the particular action is not allowed for the user (usually, based on the user’s permissions or user’s role in the system), the system typically responds with the 403 Forbidden status code.
- Spring Security provides interceptors that control access to secure objects, such as method invocations or web requests.

![Authorize HttpServletRequest](https://docs.spring.io/spring-security/reference/_images/servlet/authorization/authorizationfilter.png)
*Authorize `HttpServletRequest`*

### Web Security Configuration
- Spring Security 6.0 introduced component-based security configuration using the `SecurityFilterChain`.
- This replaced the older adapter-based pattern using `WebSecurityConfigurerAdapter`.

#### Using SecurityFilterChain
- The `SecurityFilterChain` is responsible for configuring all the security aspects of the web application:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            ).formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            ).logout(logout -> logout
                .logoutSuccessUrl("/")
            );
        
        return http.build();
    }
}
```

#### URL Pattern Configuration
Spring Security offers several ways to match URL patterns:

1. **antMatchers** (legacy, pre-Spring Security 6.0):
```java
.antMatchers("/admin/**").hasRole("ADMIN")
.antMatchers("/public/**").permitAll()
```

2. **mvcMatchers** (legacy, pre-Spring Security 6.0):
```java
.mvcMatchers("/api/**").hasRole("API_USER")
```

3. **requestMatchers** (preferred in Spring Security 6.0+):
```java
.requestMatchers("/secured/**").authenticated()
.requestMatchers(HttpMethod.POST, "/api/**").hasRole("API_USER")
```

#### Role-based Access Control
Spring Security provides several methods to implement role-based security:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/basic/**").hasRole("USER") // Basic role-based access
            .requestMatchers("/advanced/**").hasAnyRole("ADMIN", "MANAGER") // Multiple roles (OR condition)
            .requestMatchers("/reports/**").hasAuthority("GENERATE_REPORTS") // Authority-based access (more granular than roles)
            .requestMatchers("/special/**") // Complex expressions
            .access(new WebExpressionAuthorizationManager(
                "hasRole('ADMIN') and hasIpAddress('192.168.1.0/24')")
            )
        );
        
        return http.build();
    }
}
```

#### Common Configuration Scenarios

1. **Basic Web Application**:
```java
@Bean
public SecurityFilterChain basicWebSecurity(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/", "/home", "/register").permitAll()
            .requestMatchers("/resources/**", "/static/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        ).formLogin(form -> form
            .loginPage("/login")
            .defaultSuccessUrl("/dashboard")
            .permitAll()
        ).logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/")
        );
    
    return http.build();
}
```

2. **REST API Security**:
```java
@Bean
public SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())  // Typically disabled for stateless APIs
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

3. **Resource Server Configuration**:
```java
@Bean
public SecurityFilterChain resourceServerSecurity(HttpSecurity http) throws Exception {
    http.oauth2ResourceServer(oauth2 ->
        oauth2.jwt(jwt ->jwt
                .jwtAuthenticationConverter(jwtAuthenticationConverter())
            )
        ).authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/api/**").authenticated()
        );
    
    return http.build();
}
```

### Method-Level Security
- Method security allows us to apply access control at the method level, providing more fine-grained security than URL-based security.
- To enable method security, use the `@EnableMethodSecurity` annotation (which replaces the older `@EnableGlobalMethodSecurity`).

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
    // Configuration class content
}
```

#### Using `@PreAuthorize`
- Evaluates access control expression before method execution
- Prevents unauthorized method invocation
- Supports SpEL (Spring Expression Language)

```java
@Service
public class UserService {
    // Basic role check
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Multiple roles
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void updateUser(User user) {
        userRepository.save(user);
    }

    // Using method parameters in security expression
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Complex conditions
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('USER_WRITE')")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
```

#### Using `@PostAuthorize`
- Evaluates access control expression after method execution.
- Can access the method's return value using the `returnObject` variable.
- Useful when authorization depends on the returned data.

```java
@Service
public class DocumentService {
    // Ensure user can only access their own documents
    @PostAuthorize("returnObject.owner == authentication.principal.username")
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId);
    }

    // Combine with @PreAuthorize for comprehensive security
    @PreAuthorize("hasRole('USER')")
    @PostAuthorize("returnObject.status == 'PUBLIC' or returnObject.owner == authentication.name")
    public Document getDocumentWithPreCheck(Long id) {
        return documentRepository.findById(id);
    }
}
```

#### Using `@Secured`
- Simple role-based security
- Does not support SpEL
- Legacy approach, but still supported

```java
@Service
public class LegacyService {
    @Secured("ROLE_ADMIN")
    public void adminOnlyMethod() {
        // Only accessible by admins
    }

    @Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
    public void managementMethod() {
        // Accessible by both admins and managers
    }
}
```

#### Method Security Expressions
Spring Security provides several built-in expressions:

```java
@Service
public class SecurityExampleService {
    // Basic expressions
    @PreAuthorize("isAuthenticated()")
    public void authenticatedUsersOnly() {}

    @PreAuthorize("isAnonymous()")
    public void anonymousUsersOnly() {}

    // Role and authority checks
    @PreAuthorize("hasRole('ADMIN')")  // Checks for ROLE_ADMIN
    public void adminOnly() {}

    @PreAuthorize("hasAuthority('READ_PRIVILEGE')")
    public void withSpecificAuthority() {}

    // Logical operations
    @PreAuthorize("hasRole('ADMIN') and hasRole('DBA')")
    public void adminAndDba() {}

    // Using authentication object
    @PreAuthorize("authentication.principal.username == #username")
    public void checkOwnProfile(String username) {}
}
```

#### Custom Security Expressions
We can create custom security expressions by implementing a `MethodSecurityExpressionRoot`:

```java
public class CustomSecurityExpressionRoot extends SecurityExpressionRoot {
    private final UserRepository userRepository;

    public CustomSecurityExpressionRoot(Authentication authentication, UserRepository userRepository) {
        super(authentication);
        this.userRepository = userRepository;
    }

    public boolean isMemberOf(String groupName) {
        User user = userRepository.findByUsername(authentication.getName());
        return user.getGroups().contains(groupName);
    }

    public boolean hasHigherRankThan(String username) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        User otherUser = userRepository.findByUsername(username);
        return currentUser.getRank() > otherUser.getRank();
    }
}

@Component
public class CustomMethodSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {
    @Autowired
    private UserRepository userRepository;

    @Override
    protected MethodSecurityExpressionOperations createSecurityExpressionRoot(Authentication auth) {
        return new CustomSecurityExpressionRoot(auth, userRepository);
    }
}

// Using custom expressions
@Service
public class CustomSecurityService {
    @PreAuthorize("isMemberOf('PREMIUM_GROUP')")
    public void premiumFeature() {
        // Only accessible by premium group members
    }

    @PreAuthorize("hasHigherRankThan(#username)")
    public void modifyUser(String username) {
        // Only accessible by users with higher rank
    }
}
```

### `AuthorizationManager`
- It is a modern Spring Security interface responsible for making a single authorization decision.
- It's the core component for determining if a user is permitted to access a resource in the current, component-based security configuration.
- These are called by Spring Security’s request-based, method-based, and message-based authorization components and are responsible for making final access control decisions.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Build an AuthorizationManager
        AuthorizationManager<RequestAuthorizationContext> customManager = (authentication, context) -> {
            boolean isAdmin = authentication.get().getAuthorities().stream().anyMatch(
                grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")
            );
            return new AuthorizationDecision(isAdmin);
        };

        http.authorizeHttpRequests(authorize -> 
            authorize
                .antMatchers("/admin/**").access(customManager) // Use a custom manager
                .antMatchers("/user/**").hasRole("USER")     // Use built-in helpers
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
```

## Resources
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [Web Security](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-security.html)
- [Security with Spring Series](https://www.baeldung.com/security-spring)
- [Learn the basics of Spring Security](https://dev.to/isaactony/learn-the-basics-of-spring-security-50b7)
- [Spring Security Guide. Part 1: Introduction](https://medium.com/@ihor.polataiko/spring-security-guide-part-1-introduction-c2709ff1bd98)
- [Understanding SecurityContext and SecurityContextHolder in Spring Security](https://medium.com/@CodeWithTech/understanding-securitycontext-and-securitycontextholder-in-spring-security-e8ec9c030819)
- [Spring Security: Authentication Manager](https://www.javaguides.net/2024/04/spring-security-authentication-manager.html)
- [Spring Security With JWT for REST API](https://www.toptal.com/spring/spring-security-tutorial)
- [CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [Protection Against Exploits](https://docs.spring.io/spring-security/reference/features/exploits/index.html)
- [Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)

---

# Testing

## Spring `TestContext` Framework
- This is the core of Spring's testing support.
- It provides generic, annotation-driven unit and integration testing support that is agnostic of the testing framework in use.
- It also places a great deal of importance on convention over configuration, with reasonable defaults that can be overriden through annotation-based configuration.
- In addition to generic testing infrastructure, it provides explicit support for `JUnit 4`, `JUnit Jupiter` (AKA `JUnit 5`), and `TestNG`.
- Spring provides a custom `JUnit Runner` and custom `JUnit Rules` for `JUnit 4` and a custom Extension for `JUnit Jupiter` that lets writting so-called POJO test classes. 

### Key Abstractions
- The core of the framework consists of the `TestContextManager` class and the `TestContext`, `TestExecutionListener`, and `SmartContextLoader` interfaces.

#### `TestContext`
- It encapsulates the context in which a test is run and provides context management and caching support for the test instance for which it is responsible.
- It also delegates to a `SmartContextLoader` to load an `ApplicationContext` if requested.

#### `TestContextManager`
- It is the main entry point into the Spring `TestContext` Framework
- It is responsible for managing a single `TestContext` and signaling events to each registered `TestExecutionListener` at well-defined test execution points.
- A `TestContextManager` is created for each test class.

#### `TestExecutionListener`
- It defines the API for reacting to test-execution events published by the `TestContextManager`.
- Spring provides multiple implementation of this class.
- We can create custom `TestExecutionListener` implementations by using `@TestExecutionListeners`.

```java
@TestExecutionListeners(
	listeners = {},
	inheritListeners = false,
	mergeMode = MERGE_WITH_DEFAULTS)
class MyTest extends BaseTest {
	//...
}
```

#### Context Loader
- `ContextLoader` is a strategy interface for loading an `ApplicationContext` for an integration test managed by the Spring `TestContext` Framework.
- `SmartContextLoader` is an extension of the `ContextLoader` interface.
- It can choose to process resource locations, component classes, or context initializers.

### Bootstrapping the `TestContext` Framework
- The default configuration for the internals of the Spring `TestContext` Framework is sufficient for all common use cases.
- But if it is needed to change the default `ContextLoader`, we require to make a lot changes.
- For such low-level control over how the `TestContext` framework operates, Spring provides a bootstrapping strategy.
- `TestContextBootstrapper` defines the Interface for bootstrapping the `TestContext` framework.
- It is used by the `TestContextManager` to load the `TestExecutionListener` implementations for the current test and to build the `TestContext`.
- A custom bootstrapping strategy can be configured for a test class by using `@BootstrapWith`, either directly or as a meta-annotation.
- Although, it is discouraged from using this interface as this may change in future.

### Loading an ApplicationContext
- First, we have to tell the testing library (like `JUnit`) that this is a Spring-aware test. This lets Spring `TestContext` Framework manage the setup and execution.
- Then we have to tell Spring where to find the configuration files.
- After this, Spring handles the rest using its own `TestContext` framework.

```java
// Enabling the framework
@RunWith(SpringJUnit4ClassRunner.class) // JUnit 4
// Or,
@ExtendWith(SpringExtension.class) // JUnit 5
// Specifying the Configuration
@ContextConfiguration(locations = "classpath:application-context.xml")
// Or,
@ContextConfiguration(classes = AppConfig.class)
public class MyServiceTest {
    // ...
}

// Spring Boot simplifies it further
@SpringBootTest
class MyServiceIntegrationTest {
    //...
}
```

### Dependency Injection in Tests
- Dependency Injection in tests is a feature that allows the Spring framework to automatically provide instances of the application's beans directly to the test class.
- After the Spring `TestContext` Framework loads the `ApplicationContext`, it can inject any bean from that context into the test class fields.
- We simply have to declare a variable for the bean we need and annotate it with `@Autowired`.

## `JUnit`
- It is one of the most popular unit-testing frameworks in the Java ecosystem.
- `JUnit 5` is the current generation of the `JUnit` testing framework, which provides a modern foundation for developer-side testing on the JVM.
- It is composed of several different modules from three different sub-projects.
    - `JUnit Platform`
        - Serves as a foundation for launching testing frameworks on the JVM.
        - It also defines the `TestEngine` API for developing a testing framework that runs on the platform.
    - `JUnit Jupiter`
        - It is the combination of the programming model and extension model for writing tests and extensions in JUnit 5.
        - This sub-project provides a `TestEngine` for running `Jupiter` based tests on the platform.
    - `JUnit Vintage` provides a `TestEngine` for running `JUnit 3` and `JUnit 4` based tests on the platform.
- `JUnit 6` is currently in active development and scheduled to be released in September 2025.

### Add Dependency
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-engine</artifactId>
    <version>5.11.0-M2</version>
    <scope>test</scope>
</dependency>
```

### Annotations

#### `@Test`
- Denotes that a method is a test method.
- Unlike `JUnit 4`’s `@Test` annotation, this annotation does not declare any attributes.

#### `@BeforeEach`
- Denotes that the annotated method should be executed before each `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class.
- This is analogous to `JUnit 4`’s `@Before`.
- Such methods are inherited unless they are overridden.

#### `@AfterEach`
- Denotes that the annotated method should be executed after each `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class.
- This is analogous to `JUnit 4`’s `@After`.
- Such methods are inherited unless they are overridden.

#### `@BeforeAll`
- Denotes that the annotated method should be executed before all `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class.
- This analogous to `JUnit 4`’s `@BeforeClass`.
- Such methods are inherited unless they are overridden and must be `static` unless the "per-class" test instance lifecycle is used.

#### `@AfterAll`
- Denotes that the annotated method should be executed after all `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class.
- This analogous to `JUnit 4`’s `@AfterClass`.
- Such methods are inherited unless they are overridden and must be `static` unless the "per-class" test instance lifecycle is used.

### Using `JUnit`
```java
@ExtendWith(SpringExtension.class)
@DisplayName("A special test case")
class MyFirstJUnitJupiterTests {
    private final Calculator calculator = new Calculator();
    private final Person person = new Person();

    @Test
    @DisplayName("😱")
    void addition() {
        assertEquals(2, calculator.add(1, 1));
        assertEquals(4, calculator.add(2, 2), "The optional failure message is now the last parameter");
    }

    @Test
    void exceptionTesting() {
        Exception exception = assertThrows(ArithmeticException.class, () -> calculator.divide(1, 0));
        assertEquals("/ by zero", exception.getMessage());
    }

    @Test
    void groupedAssertions() {
        // In a grouped assertion all assertions are executed, and all failures will be reported together.
        assertAll("person",
            () -> {
                // Within a code block, if an assertion fails the subsequent code in the same block will be skipped.
                assertEquals("Jane", person.getFirstName());
            },
            () -> assertEquals("Doe", person.getLastName())
        );
    }

    // Assumptions
    @Test
    void testOnlyOnDeveloperWorkstation() {
        assumeTrue("DEV".equals(System.getenv("ENV")), () -> "Aborting test: not on developer workstation"); // If the condition is false, the test is skipped.
        // remainder of test
    }

    // Exception Handling
    // Uncaught Exceptions
    @Test
    void failsDueToUncaughtException() {
        // The following throws an ArithmeticException due to division by zero, which causes a test failure.
        calculator.divide(1, 0);
    }

    // Failed Assertions
    @Test
    void failsDueToUncaughtAssertionError() {
        // The following incorrect assertion will cause a test failure.
        // The expected value should be 2 instead of 99.
        assertEquals(99, calculator.add(1, 1));
    }

    // Asserting Expected Exceptions
    @Test
    void testExpectedExceptionIsThrown() {
        // The following assertion succeeds because the code under assertion throws the expected IllegalArgumentException.
        // The assertion also returns the thrown exception which can be used for further assertions like asserting the exception message.
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            throw new IllegalArgumentException("expected message");
        });
        assertEquals("expected message", exception.getMessage());

        // The following assertion also succeeds because the code under assertion throws IllegalArgumentException which is a subclass of RuntimeException.
        assertThrows(RuntimeException.class, () -> {
            throw new IllegalArgumentException("expected message");
        });
    }

    // Asserting That no Exception is Expected
    @Test
    void testExceptionIsNotThrown() {
        assertDoesNotThrow(() -> {
            shouldNotThrowException();
        });
    }

    // Disabling Tests
    @Disabled("Disabled until bug #42 has been resolved") // annotation can be used at class level too. all tests will be disabled then.
    @Test
    void testWillBeSkipped() {}

    // Conditional Test Execution
    @Test
    @EnabledOnOs(MAC)
    void onlyOnMacOs() {
        // ...
    }

    @Test
    @DisabledOnOs(architectures = "x86_64")
    void notOnX86_64() {
        // ...
    }

    @Test
    @EnabledOnJre({ JAVA_17, JAVA_21 })
    void onJava17And21() {
        // ...
    }

    @Test
    @EnabledForJreRange(min = JAVA_9, max = JAVA_11)
    void fromJava9To11() {
        // ...
    }

    // Test Execution Order
    @Test
    @Order(1)
    void nullValues() {
        // perform assertions against null values
    }

    @Test
    @Order(2)
    void emptyValues() {
        // perform assertions against empty values
    }
}

// It is also possible to use Java record classes as test classes.
record MyFirstJUnitJupiterRecordTests() {

    @Test
    void addition() {
        assertEquals(2, new Calculator().add(1, 1));
    }
}
```

## `Mockito`
- A mock object returns a dummy data and avoids external dependencies.
- It simplifies the development of tests by mocking external dependencies and apply the mocks into the code under test.
- This is useful when the real object is impractical to incorporate into a test.
- Mockito is a java based mocking framework, used in conjunction with other testing frameworks.
- It internally uses *Java Reflection API* and allows to create objects of a service.

### Add Dependency
```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
     <groupId>org.mockito</groupId>
     <artifactId>mockito-junit-jupiter</artifactId>
     <scope>test</scope>
</dependency>
```

### Usage
- We can either use `@Mock` annotation, or `Mockito.mock()` to mock dependency.
- **Stubbing** is the process of defining the behavior of a mock object.
- To add a behavior to the mocked object, `when()`, `thenReturn()`, `thenThrow()`, `thenAnswer()` functions are used.

```java
@ExtendWith(MockitoExtension.class)
public class CalculatorServiceTest{
    private CalcService calcService;

    @Mock
    private AddService addService;

    @InjectMocks
    private ArticleManager manager; // ArticleManager(User user, ArticleDatabase database)

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void mockWithMethod() {
        AddService addService = Mockito.mock(AddService.class); // create a mock object of AddService class
        CalcService calcService = new CalcService(addService);

        int num1 = 11;
        int num2 = 12;
        int expected = 23;

        when(addService.add(num1, num2)).thenReturn(expected);
        int actual = calcService.calc(num1, num2);
        assertEquals(expected, actual);
    }

    @Test
    void mockWithAnnotation() {
        int num1 = 11;
        int num2 = 12;
        int expected = 23;
        calcService = new CalcService(addService);

        when(addService.add(num1, num2)).thenReturn(expected);
        int actual = calcService.calc(num1, num2);
        assertEquals(expected, actual);
    }
}
```

#### `@MockBean`
- We can use this annotation to add mock objects to the Spring application context.
- The mock will replace any existing bean of the same type in the application context.
- If no bean of the same type is defined, a new one will be added.
- This annotation is useful in integration tests where a particular bean, like an external service, needs to be mocked.
```java
@RunWith(SpringRunner.class)
public class MockBeanAnnotationIntegrationTest {
    @MockBean
    UserRepository mockRepository;
    
    @Autowired
    ApplicationContext context;
    
    @Test
    public void givenCountMethodMocked_WhenCountInvoked_ThenMockValueReturned() {
        Mockito.when(mockRepository.count()).thenReturn(123L);

        UserRepository userRepoFromContext = context.getBean(UserRepository.class);
        long userCount = userRepoFromContext.count();

        Assert.assertEquals(123L, userCount);
        Mockito.verify(mockRepository).count();
    }
}
```

## `MockMvc`
- It provides support for testing Spring MVC applications.
- It performs full Spring MVC request handling but via mock request and response objects instead of a running server.
- It does that by invoking the `DispatcherServlet` and passing "mock" implementations of the Servlet API from the spring-test module which replicates the full Spring MVC request handling without a running server.
- It can be set up in one of two ways.
    - **`WebApplicationContext`**: Point to Spring configuration with Spring MVC and controller infrastructure in it.
    - **Standalone**: Point directly to the controllers you want to test and programmatically configure Spring MVC infrastructure.
- Mock web servers accept requests over HTTP like a regular server.
- It also has the ability to simulate specific network issues and conditions at the transport level, in combination with the client used in production.
- The @WebMvcTest annotation is used to create MVC (or more specifically controller) related tests.

```java
@WebMvcTest
class SortingControllerUnitTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SortingService sortingService;

    @Test
    void webMvcTest() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer mockServer = MockRestServiceServer.bindTo(restTemplate).build();
        mockServer.expect(requestTo("/greeting")).andRespond(withSuccess());

        // Test code that uses the above RestTemplate ...

        mockServer.verify();
    }
}
```

## Resources
- [Testing](https://docs.spring.io/spring-framework/reference/testing.html)
- [JUnit 5 User Guide](https://docs.junit.org/current/user-guide/)
- [Mockito Series](https://www.baeldung.com/mockito-series)
- [Basics of Mocking Dependencies in Java Unit Tests with Mockito](https://medium.com/@AlexanderObregon/basics-of-mocking-dependencies-in-java-unit-tests-with-mockito-ddb689303d6c)

---

# Spring Boot

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

---

# Resources
- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Spring Framework Reference](https://spring.io/projects/spring-framework)
- [Spring Guides](https://spring.io/guides)