# Strings

## String Class
- In Java, a string is a sequence of characters.
- Strings are immutable. This means once we create a string, we cannot change that string.
- Since `String` objects can not be changed, the objects are thread-safe.

```java
String first = "Java";
String name = new String("Java String");
int length = name.length(); // string length
String second = "Programming in " + first; // string concatenation using "+" operator
String joinedString = first.concat(" Program"); // string concatenation using String class's method
String escape = "This is the \"String\" class."; // escape sequence
```

### String Pool
- In Java, the JVM maintains a string pool to store all of its strings inside the Heap memory. The string pool helps in reusing the strings.
- While creating strings using string literals, we are directly providing the value of the string.
- Hence, the compiler first checks the string pool to see if the string already exists.
- If the string already exists, the new string is not created. Instead, the object a reference to the already existing string.
- If the string doesn't exist, a new string is created.
- While creating strings using the `new` keyword, a new string is created even if it is already present inside the string pool.
- Although String objects created with `new` keyword are created in heap, they are not added to string pool automatically. But they can be added to pool by interning.
- Using string literals can be more memory efficient due to string pool usage.
- String objects can be used when separate instances are explicitly needed.

### Why does Java use String pool?
- String is immutable Object.
- So every time some operation is performed on string, a new string object is created.
- Creating new string object every time is very expensive.
- So java added this functionality to reuse the already existing string contents.
- But this is applicable only for string literal to create string objects.

## `StringBuffer`
- `String` class creates immutable string objects.
- `StringBuffer` class is used for storing the mutable strings.
- It is faster than the `String` class and provides various additional methods.
- The memory allocation of the `StringBuffer` object is done in the heap section of memory.
- Since `String` uses string pool, changing a string causes a new string to be added to the pool, and over time this can cause memory wastage and inefficiency.
- Since `StringBuffer` is mutable, it just modifies the existing object.
- `StringBuffer` class is mostly used when we have to deal with different kinds of operations on the `String`.
- It is also is thread-safe.
- The default capacity of the `StringBuffer` is 16 bytes.

```java
StringBuffer ob = new StringBuffer();
StringBuffer ob = new StringBuffer(15); //Initialising the StringBuffer capacity to the 15 bytes
 StringBuffer ob = new StringBuffer(String);
// If the capacity of StringBuffer gets full after adding an extra String, the new capacity of StringBuffer will be (previousCapacity+1)∗2
ob.append("hello"); // append the new sequence to the existing sequence
ob.appendCodePoint(97); // takes the Unicode value and adds the String representation of the Unicode at the end of the sequence
ob.capacity(); // returns the capacity of the StringBuffer object
ob.deleteCharAt(2);
ob.setCharAt(2,'E'); // invalid index will cause an error due to an invalid range
ob.reverse();
```

## `StringBuilder`
- `StringBuilder` in Java is an alternative to `String` class, and is very similar to `StringBuffer` class.
- It represents a mutable sequence of characters.
- `StringBuilder` class operations are faster than `StringBuffer` because this class is not thread-safe.
- In most cases, operations on a string are performed on the same thread, hence `StringBuilder` class can be used.
- `StringBuilder` class is preferred over `StringBuffer` class due to its faster operations.
- `StringBuilder` class maintains a buffer array to hold the sequence of characters. When the sequence of characters is altered, the buffer array is changed accordingly to reflect the change.
- When the buffer array gets full, a new buffer array, double the size, is allocated to replace the existing array.
- Has same core methods as the `StringBuffer` class.

```java
StringBuilder ob = new StringBuilder();
StringBuilder ob = new StringBuilder(10);
CharSequence seq = "CharSequence";
StringBuilder ob = new StringBuilder(seq);
StringBuilder ob = new StringBuffer("String class object");
```

## Resources
- https://www.scaler.com/topics/java/stringbuilder-in-java/
- https://www.scaler.com/topics/java/stringbuilder-in-java/