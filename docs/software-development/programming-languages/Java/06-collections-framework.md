# Collections Framework and Data Structures

## Arrays
- An array is a collection of similar types of data.
- It is a fixed-size, ordered collection of elements of the same data type.
- Size is fixed at the time of creation, and can not be increased later.
- Trying to access index outside of array size throws `ArrayIndexOutOfBoundsException`.

```java
dataType[] arrayName; // declare an array
arrayName = new dataType[10]; // allocate memory
// or, do it together
String[] array = new String[100];
```

- `dataType` - it can be primitive data types like int, char, double, byte, etc. or Java objects.
- `arrayName` - it is an identifier.

To define the number of elements that an array can hold, we have to allocate memory for the array in Java.

```java
// declare and initialize and array
// Java compiler automatically specifies the size
int[] age = {12, 4, 5, 2, 5};
```

Each memory location is associated with a number, known as an array index. Indices always start from 0.

```java
// access array elements
age[index]
// loop through the array using for loop
for(int i = 0; i < age.length; i++) {
   System.out.println(age[i]);
}
// using enhanced for-loop
for(int a : age) {
   System.out.println(a);
}
```

### Multi-dimensional Array
- A multidimensional array is an array of arrays. Each element of a multidimensional array is an array itself.
- Unlike C/C++, each row of the multidimensional array in Java can be of different lengths.

```java
int[][] a = new int[3][4];
int[][] a = {
      {1, 2, 3}, 
      {4, 5, 6, 9}, 
      {7}, 
};
```

### Copying arrays

```java
int [] numbers = {1, 2, 3, 4, 5, 6};
int [] positiveNumbers = numbers;    // copying arrays
```

Although this allows us to create a copy, this has a problem. If we change a value in the original array, the copy array will also reflect that. Because this copy only copies the reference to the original array, and called a shallow copy. Creating a copy of the whole array (or any object) is called deep copy. To deep copy an array:

```java
arraycopy(Object src, int srcPos,Object dest, int destPos, int length)
```

Here,
- `src` - source array you want to copy
- `srcPos` - starting position (index) in the source array
- `dest` - destination array where elements will be copied from the source
- `destPos` - starting position (index) in the destination array
- `length` - number of elements to copy

Or,

```java
int[] destination = Arrays.copyOfRange(source, 0, source.length);
```

To copy a multi-dimensional array, we will have to iterate through the array and copy by 1 dimension.

## Overview of Java Collections
- The Java Collections Framework (JCF) is a unified architecture for representing and manipulating groups of objects.
- It provides interfaces, implementations, and algorithms to work with data structures more efficiently and flexibly than arrays.
- It does not allow using primitive types.
- It helps us to reduce the need to write custom data structures.
- It also provides ready-made implementations of common algorithms (search, sort, shuffle).
- `Collection` is the root interface of the collection framework, which extends the `Iterable` interface.
- Java does not provide direct implementations of the `Collection` interface but provides implementations of its sub-interfaces like `List`, `Set`, and `Queue`.
- The collections framework allows us to use a specific data structure for a particular type of data.

![](images/hierarchy-of-collection-framework-in-java.webp)

### Benefits of the framework
1. Reusable and standard implementation of common data structures.
2. Better memory management and performance, and easier data handling.
3. Common operations like searching and sorting are implemented.
4. Polymorphism and interchangeability.
5. Generics for type safety.
6. Consistent APIs like `add()`, `remove()`, `size()`, `contains()` etc.
7. Has thread safe options available.

## Interfaces

### `List`
- The `List` interface is an ordered collection that allows us to store and access elements sequentially.
- Allows duplicate elements.
- Maintains the insertion order.
- Provides indexed access to elements.
- Implementing classes:
	- `ArrayList`
		- It allows us to create resizable arrays.
		- Unlike arrays, `Arraylist`s can automatically adjust their capacity when we add or remove elements from them. Hence, `Arraylist`s are also known as dynamic arrays.
		- Random access is fast (`O(1)`), whereas insertion in the middle is slow (`O(n)`).
		- Not thread-safe.
		- Use `Collections.synchronizedList()` to ensure thread safety.
	- `LinkedList`
		- This follows doubly linked list structure.
		- Also implements the Deque interface.
		- Random access is slow (`O(n)`), but insertion in the middle is fast (`O(1)`).
		- Not thread-safe.
	- `Vector`
		- Thread-safe, i.e. it automatically applies a lock when performing some operation.
		- This continuous use of lock for each operation makes vectors less efficient.
		- This is a legacy class. Modern applications should use synchronized array list to ensure thread safety and better performance.
	- `Stack`
		- Follows the LIFO principle.
		- Extends the `Vector` class.
		- Uses `push()` and `pop()` methods, instead of `add()` and `remove()`.
		- Uses `peek()` to see the top element.
		- Allows to access individual element since it extends the Vector class, which a stack should not.
		- Since it extends Vector class, it is also thread safe.
		- This is a legacy class. Modern applications should use `ArrayDeque` class instead.

```java
List<String> list = new ArrayList<>();
Vector<Integer> vector= new Vector<>();
Stack<Integer> stacks = new Stack<>();
```

### `Set`
- Provides the features of the mathematical set in Java.
- Unlike Lists, sets cannot have duplicate elements.
- Elements in sets are stored in groups like sets in mathematics.
- APIs
	- `add()` and `addAll()` - does the union operation.
	- `retailnAll()` - does the intersection operation.
	- `remove()` and `removeAll()` - does the difference operation.
	- `iterator() `
- Extending Interfaces
	- `SortedSet` - used to store elements with some order in a set. `TreeSet` is an implementing class.
	- `NavigableSet` - provides the features to navigate among the set elements. It is considered as a type of SortedSet. `TreeSet` is an implementing class.
- Implementing classes
	- `HashSet` - provides the functionalities of the hash table data structure.
	- `LinkedHashSet` - provides functionalities of both the hashtable and the linked list data structure.
	- `TreeSet` - provides the functionality of a tree data structure.
		- Unlike `HashSet`, elements in `TreeSet` are stored in some order. It is because `TreeSet` implements the SortedSet interface as well.
		- `HashSet` is faster than the `TreeSet` for basic operations like add, remove, contains and size.
	- EnumSet 

### `Queue`
- Elements are stored in FIFO manner.
- Does not allow random access.
- Usually used for task scheduling, buffering, etc.
- APIs
	- `add()` - adds an element. return true if operation is successful, throws exception otherwise.
	- `offer()` - adds an element. return true if operation is successful, false otherwise.
	- `element()` - returns the head of the queue. Throws an exception if the queue is empty.
	- `peek()` - Returns the head of the queue. Returns null if the queue is empty.
	- `remove()` - Returns and removes the head of the queue. Throws an exception if the queue is empty.
	- `poll()` - Returns and removes the head of the queue. Returns null if the queue is empty.
- Interfaces that extend Queue 
	- `Deque`: provides the functionality of a double-ended queue. `ArrayDeque` and LinkedList are implementing classes.
	- `BlockingQueue`: allows any operation to wait until it can be successfully performed. For example, if we want to delete an element from an empty queue, then the blocking queue allows the delete operation to wait until the queue contains some elements to be deleted. `ArrayBlockingQueue` and `LinkedBlockingQueue` are implementing classes.
	- `BlockingDeque`: same as `BlockingQueue`, but for `Deque`.
- Implementing classes
	- `PriorityQueue`: provides the functionality of heap data structure. The head always appears as sorted, but the rest may not.

### `Map`
- Elements of Map are stored in key/value pairs.
- Keys are unique values associated with individual Values.
- A map cannot contain duplicate keys. And, each key is associated with a single value.
- We can access and modify values using the keys associated with them.
- The Map interface maintains 3 different sets:
	- the set of keys, `keySet() `
	- the set of values, `values() `
	- the set of key/value associations, `entrySet() `
- APIs
	- `put(K, V)`, `putIfAbsent(K, V) `
	- `get(K)` - if key not found, returns null 
	- `getOrDefault(K, defaultValue) `
	- `containsKey(K)`, `containsValue(V)`
	- `replace(K, V)`
	- `remove(K)`
- Extending Interface
	- `SortedMap`  - provides sorting of keys stored in a map. `TreeMap` is an implementing class.
	- `NavigableMap` - provides the features to navigate among the map entries. It is considered as a type of `SortedMap`. `TreeMap` is an implementing class.
	- `ConcurrentMap` - provides a thread-safe map. `ConcurrentHashMap` is an implementing class.
- Implementing classes
	- `HashMap` - provides the functionality of the hash table data structure. The default capacity will be 16 and the default load factor will be 0.75. This means the hash table will be created to hold 16 elements, and once 75% of the table is populated, the elements will be moved to a new table with double capacity.
	- `LinkedHashMap` - Hash table and linked list implementation of the Map interface, with predictable iteration order. It maintains a doubly-linked list. Since it uses the linked list, it requires more storage than HashMap. It is also slower.
	- `EnumMap` 
	- `WeakHashMap` - Keys are of the `WeakReference` type. The object of a weak reference type can be garbage collected in Java if the reference is no longer used in the program. This is useful to save resources.

## Iterators and Enhanced for-loop

### `Iterator`
- This interface allows us to access elements of a collection. It has a sub-interface `ListIterator`.
- All the Java collections include an `iterator()` method. This method returns an instance of iterator used to iterate over elements of collections.
- `hasNext()` - returns true if there exists an element in the collection.
- `next()` - returns the next element of the collection.
- `remove()` - removes the last element returned by the `next()`.
- `forEachRemaining()` - performs the specified action for each remaining element of the collection.

### `ListIterator`
- This interface provides the functionality to access elements of a list.
- It is bidirectional.
- `nextIndex()` returns the index of the element that the `next()` method will return.
- `previous()` - returns the previous element of the list.
- `previousIndex()` - returns the index of the element that the `previous()` method will return.
- `set()` - replaces the element returned by either `next()` or `previous()` with the specified element.

### Enhanced for loop/for-each loop
- A simpler, more readable way to iterate over arrays and collections.
- Internally uses Iterator for collections.
- No need to manage index or call `.get()`.

```java
int[] numbers = {1, 2, 3, 4};
for (int num : numbers) {
    System.out.println(num);
}

List<String> names = List.of("Alice", "Bob", "Charlie");
for (String name : names) {
    System.out.println(name);
}
```

## Comparable and Comparator Interfaces
- Java provides some inbuilt methods to sort primitive types array or Wrapper classes array or list. But what about objects?
- `Comparable` and `Comparator` are core interfaces used for sorting objects in Java.
- Both interfaces use Generics for compile-time type checking.
- We should use `Comparable` to provide default sorting, and `Comparator` to provide custom sorting for different scenarios.

### `Comparable`
- Java provides `Comparable` interface which should be implemented by any custom class if we want to use Arrays or Collections sorting methods.
- It has `compareTo(T obj)` method which is used by sorting methods.
- We should override this method in such a way that it returns a negative integer, zero, or a positive integer if `this` object is less than, equal to, or greater than the object passed as an argument.

```java
public class Employee implements Comparable<Employee> {
    private int id;
    @Override
    public int compareTo(Employee emp) {
        return (this.id - emp.id);
    }
}
```
But what if we want to sort objects differently in different scenarios?

### `Comparator`
- This interface allows to provide different ways of sorting objects of a class.
- Implementations of `Comparator` interface are anonymous classes.

```java
public class Employee {
    private int id;
    private String name;
    private int age;
    private int salary;

    public static Comparator<Employee> SalaryComparator = new Comparator<Employee>() {
        @Override
        public int compare(Employee e1, Employee e2) {
            return e1.getSalary() - e2.getSalary();
        }
    };
    public static Comparator<Employee> AgeComparator = new Comparator<Employee>() {
        @Override
        public int compare(Employee e1, Employee e2) {
            return e1.getAge() - e2.getAge();
        }
    };
    public static Comparator<Employee> NameComparator = new Comparator<Employee>() {
        @Override
        public int compare(Employee e1, Employee e2) {
            return e1.getName().compareTo(e2.getName());
        }
    };
}

// using comparator to sort
Arrays.sort(empArr, Employee.SalaryComparator);

// or,
public class EmployeeComparatorByIdAndName implements Comparator<Employee> {
    @Override
    public int compare(Employee o1, Employee o2) {
        int flag = o1.getId() - o2.getId();
        if(flag==0) flag = o1.getName().compareTo(o2.getName());
        return flag;
    }
}
Arrays.sort(empArr, new EmployeeComparatorByIdAndName());
```

## Algorithms
- The framework provides various static algorithms that can be used to manipulate elements stored in data structures.
- Since algorithms can be used on various collections, these are also known as generic algorithms.
- `Collections.sort(data)` uses the merge sort algorithm. Modifies the object directly.
- `Collections.reverse(data)` - reverses the order of elements
- `Collections.fill(data, 0)` - replace every element in a collection with the specified value
- `Collections.copy(newObj, oldObj)` - creates a copy of elements from the specified source to destination. While performing the operation, both the lists should be of the same size.
- `Collections.swap(data, 0, 6)` - swaps the position of two elements in a collection.
- `Collections.binarySearch(data, 4)`

## Resources
- https://www.digitalocean.com/community/tutorials/comparable-and-comparator-in-java-example