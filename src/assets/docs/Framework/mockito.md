# Mockito
- A mock object returns a dummy data and avoids external dependencies.
- It simplifies the development of tests by mocking external dependencies and apply the mocks into the code under test.
- This is useful when the real object is impractical to incorporate into a test.
- Mockito is a java based mocking framework, used in conjunction with other testing frameworks.
- It internally uses *Java Reflection API* and allows to create objects of a service.

## Add Dependency

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

## Usage
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

## Resources
- [Mockito Series](https://www.baeldung.com/mockito-series)