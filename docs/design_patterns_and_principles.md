# Title: Design Principles and Patterns

---

# Introduction
* Good design is the foundation of robust and maintainable software.
* Understanding the concepts of design principles and patterns improves the quality of code, enhances collaboration and scalability in software development projects.
* Mastering these can elevate one’s coding skills, making them a more effective and efficient programmer.
* Effective design principles and patterns make code more readable and maintainable, contribute to faster development cycles, fewer bugs, and a more enjoyable coding experience.
* Design patterns and principles are indispensable tools in software engineering that empower developers to create robust, maintainable, and scalable solutions.
* By mastering design patterns and principles, developers can elevate the quality of their software, improve collaboration within teams, and adapt to changing requirements with confidence.
* These serve as guiding lights, enabling developers to navigate the intricacies of software design and development.

---

# Design Principles

## What does Software Design Principle mean?
* General guidelines and best practices that are used to create maintainable, scalable, and efficient software.
* Intended to guide the process of designing software and help ensure that it is well-structured, easy to understand, and easy to modify, reducing the likelihood of bugs, and improving the overall quality of the software.

## Why are Software Design Principles important?
* Maintainability
* Scalability
* Reusability
* Flexibility
* Readability
* Collaboration
* Quality
* Cost reduction

## DRY - Don’t Repeat Yourself
* Every piece of knowledge or logic must have a single, unambiguous representation.
* Duplication can lead to inconsistencies, increased maintenance effort, and a higher likelihood of introducing errors when changes are required.
* Utilize abstractions, modularization, and reusable components to eliminate redundancy, ensuring that each piece of functionality is implemented in only one place.
* Example: Create a function and call it from multiple locations, rather than implementing the same functionality multiple times.

## KISS - Keep It Simple, Stupid
* Simplicity should be a key goal, and unnecessary complexity should be avoided.
* Does not mean oversimplifying or ignoring essential requirements.
* Find the simplest solution that meets the project’s needs.
* Example: Don’t use complicated algorithm when a simple for loop is enough.

## YAGNI - You Aren’t Gonna Need It
* Only implement functionality when deemed necessary, not when anticipated.
* Focus on the current requirements and avoid over-engineering.
* Otherwise, it can lead to increased complexity, longer development time, and wasted effort.
* Example: Do not add validation to some field if current requirements do not want it.

## SOLID
A set of five design principles that promote maintainability, scalability, and flexibility.

### S - Single Responsibility Principle
* Each class or module should have a single responsibility or purpose.
* This keeps code focused, making it easier to understand, test, and maintain.
* Reduces the impact of changes in one area on other parts of the system.
* Example: For report print and saving, one method should print the report, another should save it.

### O - Open/Closed Principle
* Software entities should be open for extension but closed for modification.
* ”Closed” part of the rule states that once a module has been developed and tested, the code should only be changed to correct bugs.
* ”Open” part says that it should have the ability to extend existing code in order to introduce new functionality.
* Typically achieved through inheritance or composition, which allows for a more stable and less error-prone codebase.
* Example: `BaseDTO` class to hold the common properties and other `DTO` classes extending it to hold different properties.

### L - Liskov Substitution Principle
* Mathematical formulation by Barbara Liskov.
* Let `ϕ(x)` be a property provable about objects `x` of type `T`. Then `ϕ(y)` should be true for objects `y` of type `S`, where `S` is a subtype of `T`.
* Implementations of the same interface should never give a different result.
* This ensures that the software remains consistent and reliable also when new sub-classes are introduced.

### I - Interface Segregation Principle
* Clients should not be forced to depend on interfaces they do not use.
* Interfaces should be segregated into smaller, more specific ones, allowing clients to depend only on the relevant interfaces.
* This reduces the coupling between components and improves the maintainability and flexibility of the software.
* Example: Ability to view a report and download it should be separate feature. User should not be forced to download the report when the intention is to only view it.

### D - Dependency Inversion Principle
* High-level modules should not depend on low-level modules directly.
* Both should depend on abstractions.
* Allows greater flexibility and easier adaptation to changes.
* Example: Payment system in an application can accept multiple methods of payment. A base interface will define the structure, and the actual procedures will handle the actual payments. High level system do not need to know which method was used.

---

# Design Patterns

## What is Design Pattern?
* Design level solutions for recurring problems that software engineers come across often.
* It is like a description on how to tackle these problems and design a solution.
* Using these patterns results in higher readability of the final code.

## 3 Types of Design Patterns

### Creational
* Concerned with class instantiation, and often involve creating objects in a manner suitable to the situation.

#### Singleton
* Create only one instance of a class and provide only one global access point to that object.
* Used when exactly one object is needed to coordinate actions across the system.
* A class using the singleton design pattern will include:
    - A private static variable, holding the only instance of the class.
    - A private constructor, so it cannot be instantiated anywhere else.
    - A public static method, to return the single instance of the class.
* Example:
    - Java `Calendar` class. It uses its own `getInstance()` method to get the object to be used.
    - Using this pattern in logging service in a software application allows for centralized logging functionality without the need for multiple instances or unnecessary overhead.

#### Factory
* Defines an interface for creating an object but leaves the choice of its type to the subclasses.
* Used to encapsulate object creation logic, providing a way to create objects without exposing the instantiation logic to the client.
* Promotes loose coupling by separating the object creation process from the actual usage of the objects.
* Example: A factory class to generate report. Sub-classes will implement the actual report generation logic for different report types, *e.g.* PDF, Excel.

#### Abstract Factory
* An extension of the Factory Pattern.
* Provides an interface for creating families of related or dependent objects without specifying their concrete classes.
* Allows clients to create objects without needing to know their specific implementations.
* Example: In a restaurant management software, the abstract factory interface defines methods for creating menu items, while concrete factory implementations provide specific implementations for breakfast and dinner menus. Concrete product classes represent individual menu items. This pattern enables the system to create menus with consistent sets of menu items while allowing for flexibility in defining menu variations.

### Structural
* These patterns are designed with regard to a class’s structure and composition. The main goal of most of these patterns is to increase the functionality of the class(es) involved, without changing much of its composition.

#### Adapter
* Used to adapt the interface of an existing class to match the interface expected by the client.
* Helps classes work together when they are incompatible.
* Useful to take mixed interfaces and make them a consistent API.
* Example: A shopping site can have multiple options as payment methods. But different options can have different ways of making transaction. Adapters can be used to bridge the gap between the payment options and the interface expected by the payment gateway.

#### Decorator
* Deals with the actual structure of a class, whether is by inheritance, composition or both.
* Allows behavior to be added to individual objects, either statically or dynamically, without affecting the behavior of other objects from the same class.
* Useful when you need to extend the functionality of objects in a flexible and reusable way, without creating subclass.
* Example: Textarea fields in an application. Each format (e.g. font style, font face) can be different classes. Different record can have different combination.

#### Facade
* Provides a simplified interface to a set of interfaces in a subsystem.
* Hides complexities of various sub-systems (often organized into a class) with a simple interface.
* Example: The file manager application in an OS serves as the facade, providing a unified interface for performing file-related operations. Behind the scenes, the application interacts with various subsystems of the OS, such as the file system, disk drivers, and permissions management subsystems. The facade shields the user from the complexities of interacting with these subsystems directly, providing a more intuitive and user-friendly experience.

### Behavioral
* These patterns are designed depending on how one class communicates with others. The ideal scenario is when the classes that are interconnected, make the least use of each other.

#### Observer
* Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
* Three main components:
    - *Subject (or Observable)* This is the object being observed.
    - *Observer (or Subscriber)* This is the object that wants to be notified of changes in the subject’s state.
    - *Concrete Subject and Concrete Observer* These are the specific implementations of the subject and observer interfaces.
* Example: In a stock market monitoring application, the application serves as the subject that generates updates about changes in stock prices. Multiple users (investors or traders) subscribe to receive updates about specific stocks they are interested in. Whenever there is a change in the price of a stock that a user is interested in, the application notifies the subscribed users about the update.

#### Command
* Encapsulates a request as an object, allowing parameterization of clients with different requests, queuing of requests, and logging of the parameters.
* Allows the separation of the requester of a task from the object that performs the task.
* Applicable in scenarios where requests need to be queued, logged, undone, or implemented as reusable objects.
* Example: A remote control for home entertainment devices, such as a television or a stereo system. In this scenario: the remote control serves as the invoker, which accepts commands from the user and executes them. Each button on the remote control represents a different command, such as turning the device on/off, adjusting the volume, changing channels, or switching input sources. When the user presses a button on the remote control, a corresponding command is created and executed.

---

# References
- [6 Software design principles used by successful engineers](https://swimm.io/learn/system-design/6-software-design-principles-used-by-successful-engineers)
- [The Ultimate Guide for SOLID Design Principles](https://adevait.com/software/solid-design-principles-the-guide-to-becoming-better-developers)
- [SOLID: The First 5 Principles of Object Oriented Design](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [The 3 Types of Design Patterns All Developers Should Know (with code
examples of each)](https://www.freecodecamp.org/news/the-basic-design-patterns-all-developers-need-to-know/)
- [Why You Need Software Design Patterns & Top 7 Patterns to Know](https://swimm.io/learn/system-design/the-top-7-software-design-patterns-you-should-know-about)
- [What’s a Software Design Pattern? (+7 Most Popular Patterns)](https://www.netsolutions.com/insights/software-design-pattern/)