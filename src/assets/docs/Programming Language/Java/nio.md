# 14 - Non-blocking I/O (NIO)

## Overview of Java NIO

- Web containers in application servers normally use one server thread per client request.
- To develop scalable web applications, we have to ensure that threads associated with client requests are never sitting idle waiting for a blocking operation to complete.
- Java EE provides nonblocking I/O support for servlets and filters when processing requests in asynchronous mode.

**Key Concepts:**
- Channel-based I/O instead of stream-based
- Buffer-oriented operations
- Selectors for multiplexing
- Non-blocking operations
- Better scalability for high-concurrency applications

**NIO vs Traditional I/O:**
- **Traditional I/O**: Stream-oriented, blocking, one thread per connection
- **NIO**: Buffer-oriented, non-blocking, one thread can handle multiple connections

### Code Examples

#### Basic NIO File Reading

```java
import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;

public class NIOFileExample {
    public static void main(String[] args) {
        try {
            // Reading file using NIO
            Path path = Paths.get("example.txt");
            
            // Method 1: Read entire file
            byte[] fileBytes = Files.readAllBytes(path);
            System.out.println("File content: " + new String(fileBytes));
            
            // Method 2: Using FileChannel
            try (FileChannel fileChannel = FileChannel.open(path, StandardOpenOption.READ)) {
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                
                while (fileChannel.read(buffer) != -1) {
                    buffer.flip(); // Switch to read mode
                    
                    while (buffer.hasRemaining()) {
                        System.out.print((char) buffer.get());
                    }
                    
                    buffer.clear(); // Switch to write mode
                }
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### NIO File Writing

```java
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;

public class NIOFileWriteExample {
    public static void main(String[] args) {
        try {
            Path path = Paths.get("output.txt");
            String content = "Hello NIO World!\nThis is written using NIO.";
            
            // Method 1: Simple write
            Files.write(path, content.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            
            // Method 2: Using FileChannel
            try (FileChannel fileChannel = FileChannel.open(path, 
                    StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.APPEND)) {
                
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                buffer.put("\nAppended using FileChannel".getBytes());
                buffer.flip();
                
                fileChannel.write(buffer);
            }
            
            System.out.println("File written successfully");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Resources
- [Java NIO Tutorial](https://docs.oracle.com/javase/tutorial/essential/io/file.html)
- [NIO.2 File API](https://docs.oracle.com/javase/7/docs/api/java/nio/file/package-summary.html)

## Channels and Buffers

**Overview:**
Channels represent connections to entities capable of I/O operations. Buffers are containers for data that channels read from or write to.

**Key Concepts:**
- **Channels**: `FileChannel`, `SocketChannel`, `ServerSocketChannel`, `DatagramChannel`
- **Buffers**: `ByteBuffer`, `CharBuffer`, `IntBuffer`, etc.
- **Buffer operations**: `put()`, `get()`, `flip()`, `clear()`, `rewind()`
- **Direct vs Heap buffers**

### Code Examples

#### Buffer Operations

```java
import java.nio.*;

public class BufferExample {
    public static void main(String[] args) {
        // Create a ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        
        System.out.println("Initial state:");
        printBufferState(buffer);
        
        // Put some data
        buffer.put("Hello NIO".getBytes());
        System.out.println("\nAfter putting data:");
        printBufferState(buffer);
        
        // Flip to read mode
        buffer.flip();
        System.out.println("\nAfter flip:");
        printBufferState(buffer);
        
        // Read data
        byte[] data = new byte[buffer.remaining()];
        buffer.get(data);
        System.out.println("Read data: " + new String(data));
        
        System.out.println("\nAfter reading:");
        printBufferState(buffer);
        
        // Clear buffer
        buffer.clear();
        System.out.println("\nAfter clear:");
        printBufferState(buffer);
        
        // Direct buffer example
        ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);
        System.out.println("\nDirect buffer: " + directBuffer.isDirect());
    }
    
    private static void printBufferState(ByteBuffer buffer) {
        System.out.println("Position: " + buffer.position() + 
                          ", Limit: " + buffer.limit() + 
                          ", Capacity: " + buffer.capacity() + 
                          ", Remaining: " + buffer.remaining());
    }
}
```

#### Channel Transfer Example

```java
import java.io.*;
import java.nio.channels.*;

public class ChannelTransferExample {
    public static void main(String[] args) {
        try {
            // Copy file using channel transfer
            copyFile("source.txt", "destination.txt");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static void copyFile(String source, String destination) throws IOException {
        try (FileChannel sourceChannel = FileChannel.open(Paths.get(source), StandardOpenOption.READ);
             FileChannel destChannel = FileChannel.open(Paths.get(destination), 
                     StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            long position = 0;
            long size = sourceChannel.size();
            
            // Transfer data from source to destination
            sourceChannel.transferTo(position, size, destChannel);
            
            System.out.println("File copied successfully using channel transfer");
        }
    }
}
```

#### Socket Channel Example

```java
import java.net.*;
import java.nio.*;
import java.nio.channels.*;

public class SocketChannelExample {
    public static void main(String[] args) {
        try {
            // Connect to server
            SocketChannel socketChannel = SocketChannel.open();
            socketChannel.connect(new InetSocketAddress("localhost", 8080));
            
            // Send data
            String message = "Hello from NIO client";
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put(message.getBytes());
            buffer.flip();
            
            socketChannel.write(buffer);
            
            // Read response
            buffer.clear();
            int bytesRead = socketChannel.read(buffer);
            
            if (bytesRead > 0) {
                buffer.flip();
                byte[] data = new byte[buffer.remaining()];
                buffer.get(data);
                System.out.println("Server response: " + new String(data));
            }
            
            socketChannel.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Resources
- [Channel Documentation](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/package-summary.html)
- [Buffer Documentation](https://docs.oracle.com/javase/8/docs/api/java/nio/Buffer.html)

## Selectors

**Overview:**
Selectors enable a single thread to monitor multiple channels for I/O events, providing an efficient way to handle many connections simultaneously.

**Key Concepts:**
- Single thread monitors multiple channels
- `SelectionKey` represents channel registration
- Interest operations (read, write, connect, accept)
- Event-driven programming model

### Code Examples

#### NIO Server with Selector

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;

public class NIOServer {
    private Selector selector;
    private ServerSocketChannel serverChannel;
    private static final int PORT = 8080;
    
    public NIOServer() throws IOException {
        selector = Selector.open();
        serverChannel = ServerSocketChannel.open();
        serverChannel.configureBlocking(false);
        serverChannel.bind(new InetSocketAddress(PORT));
        
        // Register server channel with selector for accept operations
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);
        
        System.out.println("NIO Server started on port " + PORT);
    }
    
    public void start() throws IOException {
        while (true) {
            // Wait for events
            int readyChannels = selector.select();
            
            if (readyChannels == 0) {
                continue;
            }
            
            Set<SelectionKey> selectedKeys = selector.selectedKeys();
            Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
            
            while (keyIterator.hasNext()) {
                SelectionKey key = keyIterator.next();
                
                if (key.isAcceptable()) {
                    handleAccept(key);
                } else if (key.isReadable()) {
                    handleRead(key);
                } else if (key.isWritable()) {
                    handleWrite(key);
                }
                
                keyIterator.remove();
            }
        }
    }
    
    private void handleAccept(SelectionKey key) throws IOException {
        ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
        SocketChannel clientChannel = serverChannel.accept();
        
        if (clientChannel != null) {
            clientChannel.configureBlocking(false);
            clientChannel.register(selector, SelectionKey.OP_READ);
            System.out.println("Client connected: " + clientChannel.getRemoteAddress());
        }
    }
    
    private void handleRead(SelectionKey key) throws IOException {
        SocketChannel clientChannel = (SocketChannel) key.channel();
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        
        try {
            int bytesRead = clientChannel.read(buffer);
            
            if (bytesRead > 0) {
                buffer.flip();
                byte[] data = new byte[buffer.remaining()];
                buffer.get(data);
                String message = new String(data).trim();
                
                System.out.println("Received: " + message);
                
                // Echo back the message
                key.attach("Echo: " + message);
                key.interestOps(SelectionKey.OP_WRITE);
                
            } else if (bytesRead < 0) {
                // Client disconnected
                System.out.println("Client disconnected");
                clientChannel.close();
                key.cancel();
            }
            
        } catch (IOException e) {
            System.out.println("Error reading from client");
            clientChannel.close();
            key.cancel();
        }
    }
    
    private void handleWrite(SelectionKey key) throws IOException {
        SocketChannel clientChannel = (SocketChannel) key.channel();
        String message = (String) key.attachment();
        
        if (message != null) {
            ByteBuffer buffer = ByteBuffer.wrap(message.getBytes());
            clientChannel.write(buffer);
            
            // Switch back to read mode
            key.interestOps(SelectionKey.OP_READ);
            key.attach(null);
        }
    }
    
    public static void main(String[] args) {
        try {
            NIOServer server = new NIOServer();
            server.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### NIO Client with Selector

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;

public class NIOClient {
    private Selector selector;
    private SocketChannel socketChannel;
    
    public NIOClient() throws IOException {
        selector = Selector.open();
        socketChannel = SocketChannel.open();
        socketChannel.configureBlocking(false);
    }
    
    public void connect(String host, int port) throws IOException {
        socketChannel.connect(new InetSocketAddress(host, port));
        socketChannel.register(selector, SelectionKey.OP_CONNECT);
        
        while (true) {
            selector.select();
            Set<SelectionKey> selectedKeys = selector.selectedKeys();
            Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
            
            while (keyIterator.hasNext()) {
                SelectionKey key = keyIterator.next();
                
                if (key.isConnectable()) {
                    handleConnect(key);
                } else if (key.isReadable()) {
                    handleRead(key);
                } else if (key.isWritable()) {
                    handleWrite(key);
                }
                
                keyIterator.remove();
            }
        }
    }
    
    private void handleConnect(SelectionKey key) throws IOException {
        SocketChannel channel = (SocketChannel) key.channel();
        
        if (channel.finishConnect()) {
            System.out.println("Connected to server");
            key.interestOps(SelectionKey.OP_WRITE);
            
            // Send initial message
            key.attach("Hello from NIO client!");
        }
    }
    
    private void handleRead(SelectionKey key) throws IOException {
        SocketChannel channel = (SocketChannel) key.channel();
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        
        int bytesRead = channel.read(buffer);
        if (bytesRead > 0) {
            buffer.flip();
            byte[] data = new byte[buffer.remaining()];
            buffer.get(data);
            System.out.println("Server response: " + new String(data));
        }
        
        // Close connection after reading response
        channel.close();
        key.cancel();
        System.exit(0);
    }
    
    private void handleWrite(SelectionKey key) throws IOException {
        SocketChannel channel = (SocketChannel) key.channel();
        String message = (String) key.attachment();
        
        if (message != null) {
            ByteBuffer buffer = ByteBuffer.wrap(message.getBytes());
            channel.write(buffer);
            
            key.interestOps(SelectionKey.OP_READ);
            key.attach(null);
        }
    }
    
    public static void main(String[] args) {
        try {
            NIOClient client = new NIOClient();
            client.connect("localhost", 8080);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Resources
- [Selector Documentation](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/Selector.html)
- [NIO Selector Tutorial](https://jenkov.com/tutorials/java-nio/selectors.html)
- https://docs.oracle.com/javaee/7/tutorial/servlets013.htm
- https://docs.oracle.com/en/java/javase/15/core/java-nio.html
- https://www.baeldung.com/java-io-vs-nio
- https://medium.com/coderscorner/tale-of-client-server-and-socket-a6ef54a74763
- https://www.geeksforgeeks.org/java/non-blocking-server-in-java-nio/