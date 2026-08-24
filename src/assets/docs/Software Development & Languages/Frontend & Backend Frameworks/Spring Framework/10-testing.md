# 09 - Testing

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

### Loading an `ApplicationContext`
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

### `@MockBean`
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

### `MockMvc`
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
- [Basics of Mocking Dependencies in Java Unit Tests with Mockito](https://medium.com/@AlexanderObregon/basics-of-mocking-dependencies-in-java-unit-tests-with-mockito-ddb689303d6c)