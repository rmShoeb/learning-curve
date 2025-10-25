# JUnit
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

## Add Dependency

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-engine</artifactId>
    <version>5.11.0-M2</version>
    <scope>test</scope>
</dependency>
```

## Annotations

### `@Test`
- Denotes that a method is a test method.
- Unlike `JUnit 4`’s `@Test` annotation, this annotation does not declare any attributes.

### `@BeforeEach`
- Denotes that the annotated method should be executed before each `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class.
- This is analogous to `JUnit 4`’s `@Before`.
- Such methods are inherited unless they are overridden.

### `@AfterEach`
- Denotes that the annotated method should be executed after each `@Test`, `@RepeatedTest`, `@ParameterizedTest`, or `@TestFactory` method in the current class.
- This is analogous to `JUnit 4`’s `@After`.
- Such methods are inherited unless they are overridden.

### `@BeforeAll`
- Denotes that the annotated method should be executed before all `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class.
- This analogous to `JUnit 4`’s `@BeforeClass`.
- Such methods are inherited unless they are overridden and must be `static` unless the "per-class" test instance lifecycle is used.

### `@AfterAll`
- Denotes that the annotated method should be executed after all `@Test`, `@RepeatedTest`, `@ParameterizedTest`, and `@TestFactory` methods in the current class.
- This analogous to `JUnit 4`’s `@AfterClass`.
- Such methods are inherited unless they are overridden and must be `static` unless the "per-class" test instance lifecycle is used.

## Using `JUnit`

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

## Resources
- [JUnit 5 User Guide](https://docs.junit.org/current/user-guide/)