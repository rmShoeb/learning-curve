# Stream API

## Introduction to Streams
- Introduced in Java 8, the Stream API is used to process collections of objects.
- A stream in Java is a sequence of objects that supports various methods that can be pipelined to produce the desired result.
- Stream API is a way to express and process collections of objects, which enables us to perform operations like filtering, mapping, reducing, and sorting.
- Once a stream instance is created, it will not modify its source, therefore allowing the creation of multiple instances from a single source.
- Streams are widely used in modern Java applications for Data Processing, processing JSON/XML responses, database Operations, Concurrent Processing.

### Features
- A stream is not a data structure. Instead, it takes input from the Collections, Arrays, or I/O channels.
- Streams don’t change the original data structure, they only provide the result as per the pipelined methods.
- Each intermediate operation is lazily executed and returns a stream as a result, hence, various intermediate operations can be pipelined.
- Terminal operations mark the end of the stream and return the result.

### Creating Streams

```java
// Empty Stream
Stream<String> streamEmpty = Stream.empty();
// Stream of Collection
Collection<String> collection = Arrays.asList("a", "b", "c");
Stream<String> streamOfCollection = collection.stream();
// Stream of Array
Stream<String> streamOfArray = Stream.of("a", "b", "c");
String[] arr = new String[]{"a", "b", "c"};
Stream<String> streamOfArrayFull = Arrays.stream(arr);
Stream<String> streamOfArrayPart = Arrays.stream(arr, 1, 3);
// Stream Builder
Stream<String> streamBuilder = Stream.<String>builder().add("a").add("b").add("c").build();
// Stream Generate
Stream<String> streamGenerated = Stream.generate(() -> "element").limit(10);
```

## Stream Operations

![](images/java-stream-operations.png)

### Intermediate Operation
- Intermediate Operations are the types of operations in which multiple methods are chained in a row.
- Methods are chained together.
- Intermediate operations transform a stream into another stream.
- It enables the concept of filtering where one method filters data and passes it to another method after processing.
- Intermediate operations are lazy. This means that they will be invoked only if it is necessary for the terminal operation execution.

```java
List<List<String>> listOfLists = Arrays.asList(
            Arrays.asList("Reflection", "Collection", "Stream"),
            Arrays.asList("Structure", "State", "Flow"),
            Arrays.asList("Sorting", "Mapping", "Reduction", "Stream")
);

// Create a set to hold intermediate results
Set<String> intermediateResults = new HashSet<>();

// Stream pipeline demonstrating various intermediate operations
List<String> result = listOfLists.stream()
            .flatMap(List::stream)                 // Flatten the list of lists into a single stream
            .filter(s -> s.startsWith("S"))        // Filter elements starting with "S"
            .map(String::toUpperCase)              // Transform each element to uppercase
            .distinct()                            // Remove duplicate elements
            .sorted()                              // Sort elements
            .peek(s -> intermediateResults.add(s)) // Perform an action (add to set) on each element
            .collect(Collectors.toList());         // Collect the final result into a list
```

### Terminal Operation
- Terminal Operations are the type of Operations that return the result.
- These Operations are not processed further just return a final result value.

```java
List<String> names = Arrays.asList(
            "Reflection", "Collection", "Stream",
            "Structure", "Sorting", "State"
);
// forEach: Print each name
names.stream().forEach(System.out::println);
// collect: Collect names starting with 'S' into a list
List<String> sNames = names.stream()
                           .filter(name -> name.startsWith("S"))
                           .collect(Collectors.toList());
// reduce: Concatenate all names into a single string
String concatenatedNames = names.stream().reduce("", (partialString, element) -> partialString + " " + element);
// count: Count the number of names
long count = names.stream().count();
// findFirst: Find the first name
Optional<String> firstName = names.stream().findFirst();
firstName.ifPresent(System.out::println);
```

## Collectors
- Collectors are used in the final step of processing a Stream.
- Implementations of Collector that implement various useful reduction operations, such as accumulating elements into collections, summarizing elements according to various criteria, etc.
- The `collect()` method is one of Java 8’s Stream API terminal methods.
- It allows us to perform mutable fold operations on data elements held in a Stream instance.
- The strategy for this operation is provided via the Collector interface implementation.
- `CollectingAndThen()` is a special collector that allows us to perform another action on a result straight after collecting ends.
- The `joining()` collector can be used for joining `Stream<String>` elements.
```java
List<String> givenList = Arrays.asList("a", "bb", "ccc", "dd");
List<String> resultLinkedList = givenList.stream().collect(toCollection(LinkedList::new));
List<String> resultList = givenList.stream().collect(toList());
Set<String> resultSet = givenList.stream().collect(toSet());
Map<String, Integer> resultMap = givenList.stream().collect(toMap(Function.identity(), String::length, (item, identicalItem) -> item));
String joiningResult = givenList.stream().collect(joining()); // "abbcccdd"
String joiningResultWithParam = givenList.stream().collect(joining(" ")); // "a bb ccc dd"
```

### Custom Collectors
If we want to write our own Collector implementation, we need to implement the Collector interface, and specify its three generic parameters: `public interface Collector<T, A, R> {...} `
1. T – the type of objects that will be available for collection
2. A – the type of a mutable accumulator object
3. R – the type of a final result

```java
public class ImmutableSetCollector<T> implements Collector<T, ImmutableSet.Builder<T>, ImmutableSet<T>> {
    @Override
    public Supplier<ImmutableSet.Builder<T>> supplier() {
        return ImmutableSet::builder;
    }
    
    @Override
    public BiConsumer<ImmutableSet.Builder<T>, T> accumulator() {
        return ImmutableSet.Builder::add;
    }
    
    @Override
    public BinaryOperator<ImmutableSet.Builder<T>> combiner() {
        return (left, right) -> left.addAll(right.build());
    }
    
    @Override
    public Function<ImmutableSet.Builder<T>, ImmutableSet<T>> finisher() {
        return ImmutableSet.Builder::build;
    }
    
    @Override
    public Set<Characteristics> characteristics() {
        return Sets.immutableEnumSet(Characteristics.UNORDERED);
    }
    
    public static <T> ImmutableSetCollector<T> toImmutableSet() {
        return new ImmutableSetCollector<>();
    }
}

// usage
List<String> givenList = Arrays.asList("a", "bb", "ccc", "dddd");
ImmutableSet<String> result = givenList.stream().collect(toImmutableSet());
```

## Parallel Streams
- Java Parallel Streams is meant for utilizing multiple cores of the processor.
- Normally any Java code has one stream of processing, where it is executed sequentially.
- Whereas by using parallel streams, we can divide the code into multiple streams that are executed in parallel on separate cores and the final result is the combination of the individual outcomes.
- The order of execution, however, is not under our control.
- Therefore, it is advisable to use parallel streams in cases where no matter what is the order of execution, the result is unaffected and the state of one element does not affect the other as well as the source of the data also remains unaffected.
- Parallel streams are best used when the order doesn’t matter, elements don’t depend on each other, and data remains unchanged.
- Parallel streams enable large-scale data processing tasks to be handled more efficiently by utilizing the full power of multi-core processors.
- A parallel stream divides the elements into multiple parts and processes them in parallel using multiple threads from the ForkJoinPool.
- May involve overhead due to thread management, so it’s most effective with CPU-bound tasks.

![](images/java-parallel-stream.png)

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
// Convert to parallel stream and perform operations
numbers.parallelStream()
       .filter(n -> n % 2 == 0)
       .forEach(System.out::println);
// or,
numbers.stream().parallel()
       .filter(n -> n % 2 == 0)
       .forEach(System.out::println);
// ordered
numbers.parallelStream()
       .filter(n -> n % 2 == 0)
       .forEachOrdered(e -> System.out.print(e + " "));
```

### Advantages
1. High speed: Parallel Stream allows programmers to perform various operations on data elements in a concurrent and parallel manner, leading to improved performance and faster execution times.
2. Readable code: By using Parallel Stream, program code becomes more readable and easier to understand. Programmers can write data processing code in a simpler and more intuitive way using this feature.
3. Easy implementation: Using Parallel Stream is very easy and straightforward, and programmers don’t need to write any boilerplate code for performing concurrent operations on data elements.

### Disadvantages
1. High memory consumption: Using Parallel Stream can lead to higher memory usage compared to traditional methods, as creating new threads to run parallel operations incurs additional memory overhead.
2. Non-determinism: The use of Parallel Stream can lead to non-deterministic behavior, meaning that the output of the program may vary with each execution.
3. Concurrency issues: Incorrect usage of Parallel Stream can lead to concurrency issues such as race conditions and deadlocks. Therefore, programmers should use this feature carefully and pay attention to concurrency issues.

## Resources
1. https://www.geeksforgeeks.org/java/stream-in-java/
2. https://www.baeldung.com/java-8-streams
3. https://docs.oracle.com/en/java/javase/11/docs/api//java.base/java/util/stream/Collectors.html
4. https://www.geeksforgeeks.org/java/what-is-java-parallel-streams/
5. https://medium.com/@mesfandiari77/parallel-stream-in-java-ac47c54176e0
6. https://www.baeldung.com/java-parallelstream-vs-stream-parallel
7. https://medium.com/@vino7tech/difference-between-stream-and-parallel-stream-in-java-8-0c20004706d2
8. https://docs.oracle.com/javase/tutorial/collections/streams/parallelism.html