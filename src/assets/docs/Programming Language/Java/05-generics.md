# Generics

## Introduction
- Java Generics allows us to create a single class, interface, and method that can be used with different types of data (objects).
- This helps us to reuse our code.
- But it does not work with primitive types.
- `T` used inside the angle bracket `<>` indicates the type parameter.

```java
// create a generics class
class GenericsClass<T> {
  // variable of T type
  private T data;
  public GenericsClass(T data) {
    this.data = data;
  }
  // method that return T type variable
  public T getData() {
    return this.data;
  }
}

class DemoClass {
  // creae a generics method
  public <T> void genericsMethod(T data) {
    System.out.println("Generics Method:");
    System.out.println("Data Passed: " + data);
  }
}

class Main {
  public static void main(String[] args) {
    GenericsClass<Integer> intObj = new GenericsClass<>(5);
    System.out.println("Generic Class returns: " + intObj.getData());
    GenericsClass<String> stringObj = new GenericsClass<>("Java Programming");
    System.out.println("Generic Class returns: " + stringObj.getData());

    DemoClass demo = new DemoClass();
    demo.<String>genericsMethod("Java Programming");
    demo.<Integer>genericsMethod(25);
    // We can call the generics method without including the type parameter. In this case, the compiler can match the type parameter based on the value passed to the method.
  }
}
```

## Advantages
1. Code Reusability
2. Compile-time Type Checking: The type parameter of generics provides information about the type of data used in the generics code.
   `GenericsClass<Integer> list = new GenericsClass<>(); `
   For this instance, if we try to pass in any other object of type than Integer, it will cause error at compile time.
3. The collections framework uses the concept.

## Bounded Type Parameters
- In general, the type parameter can accept any data types (except primitive types).
- However, if we want to use generics for some specific types (such as accept data of number types) only, then we can use bounded types.
- In the case of bound types, we use the `extends` keyword.

```java
class GenericsClass <T extends Number> {
  // this class can only work with data types that are children of Number (Integer, Double, and so on).
  // if we create object with Type that are not children of Number, it will cause error.
  public void display() {
    System.out.println("This is a bounded type generics class.");
  }
}

public class Box<T> {
    private T t;          

    public void set(T t) {
        this.t = t;
    }
    public T get() {
        return t;
    }
    public <U extends Number> void inspect(U u){
        System.out.println("T: " + t.getClass().getName());
        System.out.println("U: " + u.getClass().getName());
    }
}

// multiple bounds
<T extends B1 & B2 & B3>
```

## Wildcards
- In generic code, the question mark (?), called the wildcard, represents an unknown type.
- The wildcard can be used in a variety of situations: as the type of a parameter, field, or local variable; sometimes as a return type (though it is better programming practice to be more specific).
- The wildcard is never used as a type argument for a generic method invocation, a generic class instance creation, or a supertype.

### Upper Bounded Wildcards

```java
public static void process(List<? extends Number> list) {
  // matches Number and any subtype of Number.
  // The method can access the list elements as type Number.
}
```

### Lower Bounded Wildcards

```java
public static void addNumbers(List<? super Integer> list) {
    // lower bounded wildcard restricts the unknown type to be a specific type or a super type of that type.
    // You can specify an upper bound for a wildcard, or you can specify a lower bound, but you cannot specify both.
    for (int i = 1; i <= 10; i++) {}
}
```

### Unbounded Wildcards

```java
public static void printList(List<?> list) {
    for (Object elem: list) {}
}
```

## Resources
- https://docs.oracle.com/javase/tutorial/java/generics/bounded.html
- https://docs.oracle.com/javase/tutorial/java/generics/wildcards.html