# 03 - Inversion of Control?
- It is a principle in software engineering which transfers the control of objects or portions of a program to a container or framework.
- In a traditional program, the code is in control, it calls libraries and controls the flow. In Inversion of Control, the framework or container is in control — it calls the code when needed.
- To enable this, frameworks use abstractions with additional behavior built in. If we want to add our own behavior, we need to extend the classes of the framework or plugin our own classes.
- We can achieve Inversion of Control through various mechanisms such as: Strategy design pattern, Service Locator pattern, Factory pattern, and Dependency Injection (DI).

**The advantages of this architecture are:**
- decoupling the execution of a task from its implementation
- making it easier to switch between different implementations
- greater modularity of a program
- greater ease in testing a program by isolating a component or mocking its dependencies, and allowing components to communicate through contracts

## Dependency Injection
- It is a specialized form of IoC, where objects define their dependencies only through constructor arguments, arguments to a factory method, or properties that are set on the object instance after it is constructed or returned from a factory method.
- The container then injects those dependencies when it creates the bean.
- Code is cleaner with the DI principle, and decoupling is more effective when objects are provided with their dependencies.
- The object does not look up its dependencies and does not know the location or class of the dependencies.
- As a result, the classes become easier to test, particularly when the dependencies are on interfaces or abstract base classes, which allow for stub or mock implementations to be used in unit tests.

## The IoC Container (`ApplicationContext`)
- The IoC container is a fundamental principle, not a specific class.
- It's the name for the system that manages objects and their dependencies.
- The `ApplicationContext` is the actual thing in Spring that is the IoC container. It's a Java interface that provides all the functionality.
- `ApplicationContext` is a sub-interface of `BeanFactory`.
- The `BeanFactory` provides the configuration framework and basic functionality, and the `ApplicationContext` adds more enterprise-specific functionality.
- It does everything the IoC container concept describes, plus more advanced features like:
    - Event publication
    - Internationalization (handling different languages)
    - Integration with Spring's Aspect Oriented Programming (AOP) features

## Constructor-based Dependency Injection

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

## Setter-based Dependency Injection

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

## Autowiring Dependencies
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

## Circular dependencies
- When using constructor injection heavily, it is possible to create an unresolvable circular dependency scenario.
- For example: Class A requires an instance of class B through constructor injection, and class B requires an instance of class A through constructor injection.
- If beans for classes A and B are configured to be injected into each other, the Spring IoC container detects this circular reference at runtime, and throws a `BeanCurrentlyInCreationException`.
- One possible solution is to edit the source code of some classes to be configured by setters rather than constructors.
- Alternatively, avoid constructor injection and use setter injection only.