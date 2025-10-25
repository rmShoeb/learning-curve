# 08 - Exception Handling

## Introduction
- The code can experience errors while executing our instructions.
- Good exception handling can handle errors and gracefully re-route the program to give the user still a positive experience.
- In production, filesystems can corrupt, networks break down, and JVMs run out of memory.
- The wellbeing of our code depends on how it deals with “unhappy paths”.
- We must handle these conditions because they affect the flow of the application negatively and form exceptions.
- Without handling these exceptions, an otherwise healthy program may stop running altogether!
- Exceptions in Java are objects with all of them extending from Throwable.

```
              ---> Throwable <--- 
              |    (checked)     |
              |                  |
              |                  |
      ---> Exception           Error
      |    (checked)        (unchecked)
      |
RuntimeException
  (unchecked)
```

## Exception Types
### Checked Exceptions
- These are exceptions that the Java compiler requires us to handle.
- We have to either declaratively throw the exception up the call stack (using `throws`), or we have to handle it ourselves (with `try-catch`).
- We should use checked exceptions when we can reasonably expect the caller of our method to be able to recover.
- Examples: `IOException` and `ServletException`.

### Unchecked Exceptions
- Runtime Exceptions refer to the same thing.
- These exceptions are not checked at compile-time but run-time.
- These are exceptions that the Java compiler does not require us to handle.
- If we create an exception that extends `RuntimeException`, it will be unchecked. Otherwise, it will be checked.
- Examples: `NullPointerException`, `IllegalArgumentException`, `ArrayIndexOutOfBoundsException` and `SecurityException`.

### Errors
- These represent serious and usually irrecoverable conditions.
- For example: a library incompatibility, infinite recursion, or memory leaks, `StackOverflowError`, `OutOfMemoryError`.
- Usually, we want these to propagate all the way up.
- Even though they don’t extend `RuntimeException`, they are also unchecked.

## Try, Catch, Finally
- If we have a `try` block, then must have either of `catch` or `finally` block. Otherwise, thows will need to be added to method signature.
- Sometimes, the code can throw more than one exception, and we can have more than one `catch` block handle each individually.
- Java lets us handle subclass exceptions separately, but we have to place them higher in the list of catches.
- When we know that the way we handle errors is going to be the same, we can catch multiple exceptions in the same block.
- When we catch an exception, but do not do anything, it is called Swallowing Exception.
- If none of the statements in the try block generates an exception, the `catch` block is skipped.
- The `finally` block is always executed no matter whether there is an exception or not. This block block is optional, and there can be only one block for one `try` block.

```java
public int getPlayerScore(String playerFile) {
    try {
        Scanner contents = new Scanner(new File(playerFile));
        return Integer.parseInt(contents.nextLine());
    } catch (FileNotFoundException noFile) {
        logger.warn("File not found, resetting score.");
        return 0;
    } catch (IOException e) { // FileNotFoundException is a sub-class of IOException
        logger.warn("Player file wouldn't load!", e);
        return 0;
    } catch (NumberFormatException | IllegalArgumentException e) {
        logger.warn("Player file was corrupted!", e);
        return 0;
    } catch (Exception e) {
        // catch and swallow
        // In such cases, we should still at least add a comment stating that we intentionally ate the exception.
        // or,
        e.printStackTrace();
    } finally {
        // when we have code that needs to execute regardless of whether an exception occurs
        if (contents != null) {
            contents.close();
        }
    }
}
```

## Try with Resources
- When working with things that extend or implements `AutoCloseable` interface, we can use `try-with-resources` syntax.
- Java will automatically close the resources, even if there is any exception, without needing to close it in a `finally` block.
- We can still use a `finally` block, though, to do any other kind of cleanup we want.

```java
public int getPlayerScore(String playerFile) {
    try (Scanner contents = new Scanner(new File(playerFile))) {
      return Integer.parseInt(contents.nextLine());
    } catch (FileNotFoundException e ) {
      logger.warn("File not found, resetting score.");
      return 0;
    }
}
```

## Throw and Throws
- If we don’t want to handle the exception ourselves or we want to generate our exceptions for others to handle, then we have to throw it.
- The `throw` keyword is used to explicitly throw a single exception.
- The `throws` keyword is used to declare the type of exceptions that might occur within the method. It is used in the method declaration.
- If the exception we are throwing is checked, then we have to use `throws` with method signature as well.
- If the exception is unchecked, we don’t have to mark the method, though we can.
- We can also choose to rethrow an exception we’ve caught, or do a wrap and rethrow.

```java
public List<Player> loadAllPlayers(String playersFile) throws TimeoutException. IOException {
    if(!isFilenameValid(playersFile)) {
        throw new IllegalArgumentException("Filename isn't valid!");
    }
    try { 
        // ...
    } catch (IOException io) { 		
        throw io;
        // or, wrap it
        throw new PlayerLoadException(io);
    }
    if( someConditionFailed ) {
        throw new Exception("This operation took too long");
    } 
}
```

## Suppressed Exceptions

```java
public static void suppressedException(String filePath) throws IOException {
    FileInputStream fileIn = null;
    try {
        fileIn = new FileInputStream(filePath); // this faces error
    } catch (FileNotFoundException e) {
        throw new IOException(e); // we have handled the original error, hence suppressed
    } finally {
        fileIn.close(); // filein is null, and this will cause NullPointerException, and the calling method will not know of the original exception
    }
}

// to include suppressed exception information
public static void addSuppressedException(String filePath) throws IOException {
    Throwable firstException = null;
    FileInputStream fileIn = null;
    try {
        fileIn = new FileInputStream(filePath);
    } catch (IOException e) {
        firstException = e;
    } finally {
        try {
            fileIn.close();
        } catch (NullPointerException npe) {
            if (firstException != null) {
                npe.addSuppressed(firstException);
            }
            throw npe;
        }
    }
}

// when using AutoCloseable, it’s the exception thrown in the close method that’s suppressed. The original exception is thrown.
// to get the suppressed exceptions from try-with-resources
public void suppressedResourceException(String[] args) {
    try (MyResource r = new MyResource()) {
        throw new Exception("Exception in try block");
    } catch (Exception e) {
        System.out.println("Caught: " + e);
        for (Throwable suppressed : e.getSuppressed()) { // get the suppressed exceptions
            System.out.println("Suppressed: " + suppressed);
        }
    }
}
```

## Custom Exceptions
- Even though Java provides almost general exceptions, we may want to define custom exceptions because:
	- Business logic exceptions that are specific to the business logic and workflow. These help the application users or the developers understand what the exact problem is.
	- To catch and provide specific treatment to a subset of existing Java exceptions
- To define a custom checked exception, we have to extend the `Exception` class.
- To create a custom unchecked exception, we need to extend the `RuntimeException` class.

```java
// define a custom checked exception
public class IncorrectFileNameException extends Exception { 
    public IncorrectFileNameException(String errorMessage) {
        super(errorMessage);
    }
    // make sure root cause of the issue is included
    public IncorrectFileNameException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}

// throwing a custom exception
try (Scanner file = new Scanner(new File(fileName))) {
    if (file.hasNextLine())
        return file.nextLine();
} catch (FileNotFoundException e) {
    if (!isCorrectFileName(fileName)) {
        throw new IncorrectFileNameException("Incorrect filename : " + fileName );
        // or, make sure root cause of the issue is included
        throw new IncorrectFileNameException("Incorrect filename : " + fileName , err);
    }
}

// define a runtime/unchecked exception
public class IncorrectFileExtensionException 
  extends RuntimeException {
    public IncorrectFileExtensionException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}
```

## Resources
- https://www.baeldung.com/java-exceptions
- https://www.baeldung.com/java-new-custom-exception