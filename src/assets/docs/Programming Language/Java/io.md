# 09 - Java I/O (Input/Output)
- In Java, streams are the sequence of data that are read from the source and written to the destination.
- An input stream is used to read data from the source.
- An output stream is used to write data to the destination.
- For example, the `System.out` is a type of output stream.
- Depending upon the data a stream holds, it can be classified into:
	- Byte Stream
	- Character Stream

## Byte Streams
- It is used to read and write a single byte (8 bits) of data.
- All byte stream classes are derived from base abstract classes called `InputStream` and `OutputStream`.

### `InputStream`
- It is an abstract superclass in the java.io package that represents an input stream of bytes.
- Methods
	- `read()` - reads one byte of data from the input stream.
	- `read(byte[] array)` - reads bytes from the stream and stores in the specified array.
	- `available()` - returns the number of bytes available in the input stream.
	- `mark()` - marks the position in the input stream up to which data has been read.
	- `reset()` - returns the control to the point in the stream where the mark was set.
	- `markSupported()` - checks if the `mark()` and `reset()` method is supported in the stream.
	- `skips()` - skips and discards the specified number of bytes from the input stream.
	- `close()` - closes the input stream.
- Sub-classes
	- `FileInputStream` - used to read data (in bytes) from files.
	- `ByteArrayInputStream` - used to read an array of input data (in bytes).
	- `ObjectInputStream`- mainly used to read data written by the `ObjectOutputStream`.
	- `BufferedInputStream` - used with other input streams to read the data (in bytes) more efficiently. It maintains an internal buffer of 8192 bytes. It reads a chunk of bytes from the disk and stores in the internal buffer. And from the internal buffer bytes are read individually. The number of communication to the disk is reduced, and hence faster operation.

### `OutputStream`
- It is an abstract superclass in the `java.io` package that represents an output stream of bytes.
- Methods
	- `write(int b)` - writes the specified byte to the output stream.
	- `write(byte[] array)` - writes the bytes from the specified array to the output stream.
	- `flush()` - forces to write all data present in output stream to the destination.
	- `close()` - closes the output stream.
- Sub-classes
	- `FileOutputStream` - used to write data (in bytes) to the files.
	- `ByteArrayOutputStream` class of the `java.io` package can be used to write an array of output data (in bytes).
	- `ObjectOutputStream` - encodes Java objects using the class name and object values. It converts Java objects into corresponding streams. This is known as serialization. Objects need to be serialized while writing to the stream, because this class only writes those objects that implement the `Serializable` interface.
	- `BufferedOutputStream` - used with other output streams to write the data (in bytes) more efficiently. It maintains an internal buffer of 8192 bytes and the mechanism is similar to `BufferedInputStream`.
	- `PrintStream` - used to write output data in commonly readable form instead of bytes.
		- Unlike other output streams, this class converts the primitive data into the text format instead of bytes. It then writes that formatted data to the output stream.
		- And also, this class does not throw any input/output exception. Instead, we need to use the `checkError()` method to find any error in it.
		- The `PrintStream` class also has a feature of auto flushing. This means it forces the output stream to write all the data to the destination under one of the following conditions:
			- if newline character `\n` is written in the print stream.
			- if the `println()` method is invoked.
			- if an array of bytes is written in the print stream.

## Character Streams
- It is used to read and write a single character of data.
- All the character stream classes are derived from base abstract classes `Reader` and `Writer`.

### `Reader`
- A class of the `java.io` package.
- Is an abstract superclass that represents a stream of characters.
- Sub-classes
	- `BufferedReader` - Used with other readers to read data (in characters) more efficiently.
	- `InputStreamReader`
		- Used to convert data in bytes into data in characters.
		- It is also known as a bridge between byte streams and character streams.
	- `FileReader`
		- Used to read data (in characters) from files.
		- new `FileReader(String fileName)` to read files with file name.
		- new `FileReader(File fileObj)` to read using file object.
	- `StringReader`
		- Used to read data (in characters) from strings.
		- The specified string acts as a source from where characters are read individually.
- Methods
	- `ready()` - checks if the reader is ready to be read.
	- `read(char[] array)` - reads the characters from the stream and stores in the specified array.
	- `read(char[] array, int start, int length)` - reads the number of characters equal to length from the stream and stores in the specified array starting from the start.
	- `getEncoding()` - gets the type of encoding that is used to store data in the input stream/file.
	- `mark()` - marks the position in the stream up to which data has been read.
	- `reset()` - returns the control to the point in the stream where the mark is set.
	- `skip()` - discards the specified number of characters from the stream.
	- `close()` - closes the reader.

### `Writer`
- A class of the `java.io` package.
- Is an abstract superclass that represents a stream of characters.
- Sub-classes
	- `BufferedWriter` - used with other writers to write data (in characters) more efficiently.
	- `OutputStreamWriter`
		- Used to convert data in character form into data in bytes form.
		- `flush()` - forces to write all the data present in the writer to the corresponding destination.
		- `append()` - inserts the specified character to the current writer.
	- `FileWriter`
		- Used to write data (in characters) to files.
		- `new FileWriter(String fileName)` to create file writer with file name.
		- `new FileWriter(File fileObj)` to file writer using file object.
	- `StringWriter`
		- used to write data (in characters) to the string buffer.
		- In Java, string buffer is considered as a mutable string.
		- `getBuffer()` - returns the data present in the string buffer.
	- `PrintWriter` 
		- used to write output data in a commonly readable form (text).
		- Unlike other writers, PrintWriter converts the primitive data(`int`, `float`, `char`, etc.) into the text format. It then writes that formatted data to the writer.
		- This class does not throw any input/output exception. Instead, we need to use the `checkError()` method to find any error in it.
		- It also has a feature of auto flushing. This means it forces the writer to write all data to the destination if one of the `println()` or `printf()` methods is called.
- Methods
	- `write(char[] array)` - writes the characters from the specified array to the output stream.
	- `write(String data)` - writes the specified string to the writer.
	- `append(char c)` - inserts the specified character to the current writer.
	- `flush()` - forces to write all the data present in the writer to the corresponding destination.
	- `close()` - closes the writer.

## Buffered Streams
- Streams usually use unbuffered I/O, which means each read or write request is handled directly by the underlying OS.
- This can make a program much less efficient, since each such request often triggers disk access, network activity, or some other operation that is relatively expensive.
- Buffered input streams read data from a memory area known as a buffer.
- The native input API is called only when the buffer is empty.
- Buffered output streams write data to a buffer, and the native output API is called only when the buffer is full.
- A program can convert an unbuffered stream into a buffered stream. The unbuffered stream object is passed to the constructor for a buffered stream class.
- It often makes sense to write out a buffer at critical points, without waiting for it to fill. This is known as flushing the buffer.
- To flush a stream manually, invoke its flush method.
- The flush method is valid on any output stream, but has no effect unless the stream is buffered.
- There are four buffered stream classes used to wrap unbuffered streams:
	- `BufferedInputStream` and `BufferedOutputStream` create buffered byte streams.
	- `BufferedReader` and `BufferedWriter` create buffered character streams.

## Serialization and Deserialization
- Serialization is the conversion of the state of an object into a byte stream. Deserialization does the opposite.
- The serialization process is instance-independent, i.e. we can serialize objects on one platform and deserialize them on another.
- Classes that are eligible for serialization need to implement `Serializable` interface.
- When a class implements the `Serializable` interface, all its sub-classes are serializable as well.
- Static fields belong to a class (as opposed to an object) and are not serialized.
- When an object has a reference to another object, these objects must implement the `Serializable` interface separately, or else a `NotSerializableException` will be thrown.
- The JVM associates a version (`long`) number with each serializable class. We use it to verify that the saved and loaded objects have the same attributes, and thus are compatible on serialization. Most IDEs can generate this number automatically
- If a serializable class doesn’t declare a `serialVersionUID`, the JVM will generate one automatically at run-time.
- However, it’s highly recommended that each class declares its `serialVersionUID`, as the generated one is compiler dependent and thus may result in unexpected `InvalidClassExceptions`.

```java
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    static String country = "ITALY";
    private int age;
    private String name;
    transient int height; // use the keyword transient to ignore class fields during serialization.
    private Address country; // Address must be serializable too, otherwise NotSerializableException
    private List<Phone> phoneList; // Phone must be serializable too, otherwise NotSerializableException
    // getters and setters
}
```

### Custom Serialization
- Custom serialization can be particularly useful when trying to serialize an object that has some un-serializable attributes.
- Classes need to have `writeObject` and `readObject`  methods implemented.

```java
public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;
    private transient Address address;
    private Person person;

    // setters and getters

    private void writeObject(ObjectOutputStream oos) throws IOException {
        oos.defaultWriteObject();
        oos.writeObject(address.getHouseNumber());
    }

    private void readObject(ObjectInputStream ois) throws ClassNotFoundException, IOException {
        ois.defaultReadObject();
        Integer houseNumber = (Integer) ois.readObject();
        Address a = new Address();
        a.setHouseNumber(houseNumber);
        this.setAddress(a);
    }
}
```

## File Handling

- `File` - a class of the `java.io` package. Used to perform various operations on files and directories.
- A file object in Java is an abstract representation of the file or directory pathname.

```java
File file = new File(String pathName); // creates an object of File using the path
file.createNewFile(); // true if a new file is created, false if the file already exists in the specified location.

FileWriter output = new FileWriter(file); // Creates a Writer using FileWriter
output.write("This is the data in the output file");
output.close();

FileReader input = new FileReader(file); // Creates a reader using the FileReader
char[] array = new char[100];
input.read(array);
input.close();

file.delete(); // true if the file is deleted, false if the file does not exist.
```

## Resources
- https://docs.oracle.com/javase/tutorial/essential/io/buffers.html
- https://www.baeldung.com/java-serialization