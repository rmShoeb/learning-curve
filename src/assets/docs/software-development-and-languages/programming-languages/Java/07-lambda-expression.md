# Lambda Expressions

## Functional Interfaces
- If a Java interface contains one and only one abstract method then it is termed as functional interface.
- This only one method specifies the intended purpose of the interface.
- `@FunctionalInterface` annotation forces the Java compiler to indicate that the interface is a functional interface.
- Hence, does not allow to have more than one abstract method.
- However, it is not compulsory.
- Since we know that a functional interface has just one method, there should be no need to define the name of that method when passing it as an argument. (Lambda expression allows us to do exactly that.)

```java
import java.lang.FunctionalInterface;
@FunctionalInterface
public interface MyInterface{
    // the single abstract method
    double getValue();
}
```

## Syntax and Usage
- Lambda expression is, essentially, an anonymous or unnamed method.
- The lambda expression does not execute on its own. Instead, it is used to implement a method defined by a functional interface.
- Operator `->` used is known as an arrow operator or a lambda operator.

```java
double getPiValue() {
    return 3.1415;
}
// can be written as
() -> 3.1415 // this does not need return keyword.
// or,
() -> {
    double pi = 3.1415;
    return pi;
}; // known as a block body

// usage
MyInterface ref;
ref = () -> 3.1415;
System.out.println("Value of Pi = " + ref.getPiValue());
```

### Lambda with parameters

```java
@FunctionalInterface
interface IsEvenInterface {
    boolean isEven(Number n);
}

public class Main {
    public static void main( String[] args ) {
        IsEvenInterface ref = (n) -> n%2==0;
        System.out.println("Lambda reversed = " + ref.isEven(797));
    }

}
```

### Generic Functional Interface and Lambda Expressions

```java
@FunctionalInterface
interface GenericInterface<T> {
    T func(T t);
}

public class Main {
    public static void main( String[] args ) {
        GenericInterface<String> reverse = (str) -> {
            String result = "";
            for (int i = str.length()-1; i >= 0 ; i--)
            result += str.charAt(i);
            return result;
        };
        System.out.println("Lambda reversed = " + reverse.func("Lambda"));

        GenericInterface<Integer> factorial = (n) -> {
            int result = 1;
            for (int i = 1; i <= n; i++)
            result = i * result;
            return result;
        };
        System.out.println("factorial of 5 = " + factorial.func(5));
    }
}
```

### Lambda Expression and Stream API

```java
// if we have a stream of data, we can perform bulk operations in the stream by the combination of Stream API and Lambda expression.
// this allows us to perform operations like search, filter, map, reduce, or manipulate collections like Lists.
myPlaces.stream()
        .filter((p) -> p.startsWith("Nepal"))
        .map((p) -> p.toUpperCase())
        .sorted()
        .forEach((p) -> System.out.println(p));
```

## Method References
- We use lambda expressions to create anonymous methods.
- Sometimes, however, a lambda expression does nothing but call an existing method.
- In those cases, it's often clearer to refer to the existing method by name.
- Method references are a special type of lambda expressions that enable us to do this.
- They are compact, easy-to-read lambda expressions for methods that already have a name.
- There are four kinds of method references:
	- Static methods
	- Instance methods of particular objects
	- Instance methods of an arbitrary object of a particular type
	- Constructor

```java
// Static Methods
messages.forEach(word -> StringUtils.capitalize(word)); // instead of this
messages.forEach(StringUtils::capitalize); // use this

// Instance methods of particular objects
public class Bicycle {
    private String brand;
    private Integer frameSize;
    public Bicycle(String brand) {
        this.brand = brand;
        this.frameSize = 0;
    }
    // getters and setters
}
public class BicycleComparator implements Comparator<Bicycle> {
    @Override
    public int compare(Bicycle a, Bicycle b) {
        return a.getFrameSize().compareTo(b.getFrameSize());
    }
}
BicycleComparator bikeFrameSizeComparator = new BicycleComparator();
createBicyclesList().stream().sorted((a, b) -> bikeFrameSizeComparator.compare(a, b)); // instead of this
createBicyclesList().stream().sorted(bikeFrameSizeComparator::compare); // use this
// Instance methods of an arbitrary object of a particular type
numbers.stream().sorted((a, b) -> a.compareTo(b)); // instead of this
numbers.stream().sorted(Integer::compareTo); // use this
// Constructor
List<String> bikeBrands = Arrays.asList("Giant", "Scott", "Trek", "GT");
bikeBrands.stream()
  .map(Bicycle::new)
  .toArray(Bicycle[]::new);
```

## Resources
- https://www.baeldung.com/java-method-references