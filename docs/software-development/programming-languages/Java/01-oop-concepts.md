# Object-Oriented Programming (OOP) with Java

## OOP Concepts
Alan Kay, considered by some to be the father of object-oriented programming. In his OOP concept:
1. [Everything Is An Object](https://wiki.c2.com/?EverythingIsAnObject).
2. Objects communicate by sending and receiving messages (in terms of objects).
3. Objects have their own memory (in terms of objects).
4. Every object is an instance of a class (which must be an object).
5. The class holds the shared behavior for its instances (in the form of objects in a program list)
6. To eval a program list, control is passed to the first object and the remainder is treated as its message.

## Classes and Objects
An object is any entity that has a state and behavior. A class is a blueprint for the object.

```java
class Bicycle {
  // state or field
  private int gear = 5;

  // behavior or method
  public void braking() {
    System.out.println("Working of Braking");
  }
}
```

Here, fields/variables and methods represent the state and behavior of the object respectively.
- field s are used to store data.
- method s are used to perform some operations.
```java
Bicycle sportsBicycle = new Bicycle(); // create new object of a class
// access field and method
sportsBicycle.gear;
sportsBicycle.braking();
```

### Constructor
- A constructor in Java is similar to a method that is invoked when an object of the class is created.
- Unlike methods, a constructor has the same name as that of the class and does not have any return type.
- Constructor Types
	- Default/No-Arg Constructor: If we do not define any constructor, the compiler creates one for us by default without any parameter.
	- Parameterized constructor: Unlike default constructor, parameterized constructor have one or more parameters. This type of constructor, it is possible to initialize objects with different set of values at the time of creation. These different set of value initialized to objects must pass as an arguments when the constructor is invoked.

```java
class Company {
  String name;

  // no-arg constructor
  public Company() {
    name = "Enosis";
  }
  // parameterized constructor
  public Company(String name) {
    this.name = name;
  }
}

class Main {
  public static void main(String[] args) {
    Company enosis = new Company();
    Company google = new Company("Google");
  }
}
```

### Method Overloading
- Two or more methods may have the same name if they differ in parameters (different number of parameters, different types of parameters, or both).
- These methods are called overloaded methods and this feature is called method overloading.
- Overloaded methods may have the same or different return types, but they must differ in parameters.
- Different ways to perform method overloading:
	- Overloading by changing the number of parameters
	- Overloading by changing the data type of parameters
- It is not method overloading if we only change the return type of methods. There must be differences in the number of parameters.

```java
void func() { ... }
void func(int a) { ... }
float func(double a) { ... }
float func(int a, float b) { ... }
```

### Constructor Overloading
- Similar to Java method overloading, we can also create two or more constructors with different parameters. This is called constructor overloading.
- Based on the parameter passed during object creation, different constructors are called, and different values are assigned.
- It is also possible to call one constructor from another constructor.

## Encapsulation
- This concept involves combining data and the methods that operate on it into one unit, usually a class.
- Encapsulation protects data from accidental modification, enhances code organization, and streamlines interaction between program components.
- Containerization is concerned with packaging applications and their dependencies for deployment, whereas encapsulation is a programming concept for enclosing data and methods within classes.

### Key Components
1. Data Hiding: It involves restricting direct access to an object’s internal state. Why is it important?
	1. Data Integrity: By controlling access to data, you can ensure that it remains consistent and valid.
	2. Code Maintainability: Isolating data within a class makes code easier to understand, modify, and test.
	3. Security: Protecting sensitive data from unauthorized access is crucial in many applications.
2. Access Modifiers: These keywords determine the accessibility of classes, methods, and other members.
	1. public: accessible everywhere.
	2. protected: they can be accessed by same package and sub-classes.
	3. private: they cannot be accessed outside of the class. Trying to access them outside the class causes error.
	4. If no access modifier is defined, by default java allows to access it within the package, but not sub-classes.

|   Modifier  | Class | Package | Sub-class | Other Classes |
|:-----------:|:-----:|:-------:|:---------:|---------------|
| private     | yes   | no      | no        | no            |
| no modifier | yes   | yes     | no        | no            |
| protected   | yes   | yes     | yes       | no            |
| public      | yes   | yes     | yes       | yes           |

### The Benefits of Encapsulation
- Data Protection: By making data private, you prevent accidental or intentional modification from outside the class, ensuring data integrity.
- Increased Security: Encapsulation helps protect sensitive information by restricting access to it.
- Code Reusability: Encapsulated classes often boast greater reusability because they function as self-contained units with clearly defined interfaces.
- Improved Maintainability: Changes to the internal implementation of a class are less likely to affect other parts of the program due to encapsulation.

## Inheritance
- The `extends` keyword is used to perform inheritance in Java.
- The new class that is created is known as subclass (child or derived class) and the existing class from where the child class is derived is known as superclass (parent or base class).
- In Java, inheritance is an is-a relationship. That is, we use inheritance only if there exists an is-a relationship between two classes. Here, Dog is an Animal.
- In Java, if a class includes protected fields and methods, then these fields and methods are accessible from the subclass of the class.
- In java, Object class is the root of the class hierarchy. Every class has Object as a superclass. All objects, including arrays, implement the methods of this class.

```java
class Animal {
  String name;
  public void eat() {
    System.out.println("I can eat");
  }
}

class Dog extends Animal {
  public void display() {
    System.out.println("My name is " + name);
  }
}

class Main {
  public static void main(String[] args) {
    Dog labrador = new Dog();
    labrador.name = "Rohu";
    labrador.display();
    labrador.eat();
  }
}
```

### Types of Inheritance
1. Single Inheritance
![](images/java-single-inheritance.png)
2. Multi-level Inheritance
![](images/java-multi-=level-inheritance.png)
3. Hierarchical Inheritance
![](images/java-hierarchical-inheritance.png)
4. Multiple Inheritance: Java doesn't support multiple inheritance. However, we can achieve multiple inheritance using interfaces.
![](images/java-multiple-inheritance.png)
5. Hybrid Inheritance, combining hierarchical and multiple inheritance.
![](images/java-hybrid-inheritance.png)

### `super()`
- This keyword is used to call the method of the parent class, or access properties of the parent class from the child class.
- Constructors in Java are not inherited. Hence, there is no such thing as constructor overriding in Java.
- However, we can call the constructor of the superclass from its subclasses. For that, we use `super()`.
- If we override a method in sub-class, we can still access the method from parent class using `super()`.
- Or if we have same property defined in both parent class and child class, we can access the property from parent class using `super()`.
- If we define a constructor in child class, we have to call `super()` in it. Because the compiler can automatically call the no-arg constructor. However, it cannot call parameterized constructors.
- The super should always be the first statement of the subclass constructor. Otherwise it will throw error.

### Method Overriding
- Also known as runtime polymorphism.
- If the same method is defined in both the superclass and the subclass, then the method of the subclass class overrides the method of the superclass. This is known as method overriding.

```java
class Animal {
  public void eat() {
    System.out.println("I can eat");
  }
}

class Dog extends Animal {
  @Override
  public void eat() {
    System.out.println("I eat dog food");
  }
  public void bark() {
    System.out.println("I can bark");
  }
}

class Main {
  public static void main(String[] args) {
    Dog labrador = new Dog();
    labrador.eat();
    labrador.bark();
  }
}
```

- In Java, annotations are the metadata that we used to provide information to the compiler.
- Here, the `@Override` annotation specifies the compiler that the method after this annotation overrides the method of the superclass.
- It is not mandatory to use `@Override`.
- Both the superclass and the subclass must have the same method name, the same return type and the same parameter list.
- We cannot override the method declared as final and static.
- We should always override abstract methods of the superclass.
- The same method declared in the superclass and its subclasses can have different access specifiers.
- We can only use those access specifiers in subclasses that provide larger access than the access specifier of the superclass.
- For example, if a method has protected access in super-class, the sub-class can override it to public but not to private.

## Polymorphism
- It simply means more than one form. That is, the same entity (method or operator or object) can perform different operations in different scenarios.
- Polymorphism allows us to create consistent code.
- We can achieve polymorphism in Java using the following ways:
	- Method Overriding
	- Method Overloading
	- Operator Overloading. However, java does not allow us to overload operators.

```java
class Polygon {
  public void render() {
    System.out.println("Rendering Polygon...");
  }
}

class Square extends Polygon {
  public void render() {
    System.out.println("Rendering Square...");
  }
}

class Circle extends Polygon {
  public void render() {
    System.out.println("Rendering Circle...");
  }
}

class Main {
  public static void main(String[] args) {
    Square s1 = new Square();
    s1.render();

    Circle c1 = new Circle();
    c1.render();
  }
}
```

### Compile Time Polymorphism
- Also called static polymorphism.
- Happens through method overloading.
- The compiler selects the correct version based on the method signature.
- This decision occurs at compile time.

### Runtime Polymorphism
- Also known as dynamic method dispatch.
- Occurs when a method call is resolved at runtime.
- Achieved through method overriding.

```java
class Main {
  public static void main(String[] args) {
    Polygon s1 = new Square();
    s1.render();

    Polygon c1 = new Circle();
    c1.render();
  }
}
```

## Abstraction
- It allows us to hide unnecessary details and only show the needed information.
- This allows us to manage complexity by omitting or hiding details with a simpler, higher-level idea.

### Abstract class
- Use the `abstract` keyword to declare an abstract class.
- We cannot create objects of abstract classes. But if the class has static properties/methods, we can access them via the class name, as static properties do not need objects.
- Is typically used as a base class to define a common contract for subclasses
- A method that doesn't have its body is known as an abstract method. We use the same `abstract` keyword to create abstract methods.
- An abstract class can have both the regular methods and abstract methods.
- If a class contains an abstract method, then the class should be declared abstract. Otherwise, it will generate an error.
- Though abstract classes cannot be instantiated, we can create subclasses from it. But we will have to override the abstract methods, and define them.
- We can also keep the sub-class abstract. We can then override some methods, while others remain abstract, or add more abstract methods.
- An abstract class can have constructors like the regular class. And, we can access the constructor of an abstract class from the subclass using the super keyword.

```java
abstract class Language {
  abstract void anAbstractMethod();
  void aConcreteMethod() {
    System.out.println("This is regular method");
  }
}

class Banlga extends Language {
  @override // recommended to use the annotation, but not required
  void anAbstractMethod() {
    System.out.println("Implementing the abstract method.");
  }
}

abstract class ProgrammingLanguage extends Language {
  abstract String whoCreatedThisLang();
}
```

### Interface
- An interface is a fully abstract class. It includes a group of abstract methods.
- We use the `interface` keyword to create an interface in Java.
- Like abstract classes, we cannot create objects of interfaces.
- To use an interface, other classes must implement it. We use the implements keyword to implement an interface.
- In Java, a class can also implement multiple interfaces.
- Similar to classes, interfaces can extend other interfaces. The `extends` keyword is used for extending interfaces.
- Interfaces provide specifications that a class (which implements it) must follow.
- Interfaces are also used to achieve multiple inheritance in Java.
- We can also add methods with implementation inside an interface. These methods are called default methods.
- Why do we need default methods?
	- We can have many classes implementing the interfaces. If we want to add a new method to the interface, we will have to track all the implementing classes, and implement the method. Otherwise, it will cause error.
	- If we provide a default implementation, implementing classes then later override it. Or if they don't, they won't cause error.
	- Default methods are inherited like ordinary methods.
- Similar to a class, we can access static methods of an interface using its references.
- With the release of Java 9, private methods are also supported in interfaces. We cannot create objects of an interface. Hence, private methods are used as helper methods that provide support to other methods in interfaces.

```java
interface Polygon {
  void getArea(int length, int breadth);
  public default void getSides() {
   // body of getSides()
  }
}

class Rectangle implements Polygon {
  public void getArea(int length, int breadth) {
    System.out.println("The area of the rectangle is " + (length * breadth));
  }
}
```

## Resources
1. https://wiki.c2.com/?AlanKaysDefinitionOfObjectOriented
2. https://stackify.com/oop-concept-for-beginners-what-is-encapsulation/