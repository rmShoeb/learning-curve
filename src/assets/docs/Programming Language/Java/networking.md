# 13 - Networking

## `Sockets`

**Overview:**
- Java sockets are essential for network communication, acting as endpoints for sending and receiving data.
- A socket is created on a client device and attempts to connect to a server socket at a specified IP address and port number.

**Key Concepts:**
- `Socket` represents a connection between two machines
- TCP-based communication (reliable, connection-oriented)
- Client-server architecture

### Code Examples

#### Client Socket

```java
import java.io.*;
import java.net.*;

public class SocketClient {
    public static void main(String[] args) {
        try {
            // Create socket connection to server
            Socket socket = new Socket("localhost", 9999);
            
            // Get input and output streams
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            
            // Send message to server
            out.println("Hello Server!");
            
            // Read response from server
            String response = in.readLine();
            System.out.println("Server response: " + response);
            
            // Close connections
            in.close();
            out.close();
            socket.close();
            
        } catch (IOException e) {
            System.err.println("Client error: " + e.getMessage());
        }
    }
}
```

**Resources:**
- [Oracle Java Socket Documentation](https://docs.oracle.com/javase/8/docs/api/java/net/Socket.html)
- [Java Network Programming Tutorial](https://docs.oracle.com/javase/tutorial/networking/sockets/)

## `ServerSockets`

**Overview:**
`ServerSocket` is used to create server applications that listen for client connections on a specific port.

**Key Concepts:**
- Listens for incoming client connections
- Accepts connections and creates `Socket` instances for communication
- Can handle multiple clients using threading

### Code Examples

#### Basic Server

```java
import java.io.*;
import java.net.*;

public class SimpleServer {
    public static void main(String[] args) {
        try {
            // Create server socket on port 9999
            ServerSocket serverSocket = new ServerSocket(9999);
            System.out.println("Server started on port 9999");
            
            while (true) {
                // Wait for client connection
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client connected: " + clientSocket.getInetAddress());
                
                // Handle client in separate thread
                new Thread(new ClientHandler(clientSocket)).start();
            }
            
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
        }
    }
}

class ClientHandler implements Runnable {
    private Socket clientSocket;
    
    public ClientHandler(Socket socket) {
        this.clientSocket = socket;
    }
    
    @Override
    public void run() {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
            
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("Received: " + inputLine);
                out.println("Echo: " + inputLine);
            }
            
            clientSocket.close();
        } catch (IOException e) {
            System.err.println("Error handling client: " + e.getMessage());
        }
    }
}
```

**Resources:**
- [ServerSocket Documentation](https://docs.oracle.com/javase/8/docs/api/java/net/ServerSocket.html)
- [Multi-threaded Server Example](https://docs.oracle.com/javase/tutorial/networking/sockets/clientServer.html)

## `URL` and `HttpURLConnection`

**Overview:**
`URL` class represents a Uniform Resource Locator, while `HttpURLConnection` provides methods for `HTTP`-specific operations.

**Key Concepts:**
- `URL` parsing and manipulation
- `HTTP` methods (`GET`, `POST`, `PUT`, `DELETE`)
- Request/response headers
- Connection management

### Code Examples

#### HTTP GET Request

```java
import java.io.*;
import java.net.*;

public class HttpGetExample {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://api.github.com/users/octocat");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Set request method
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            
            // Get response code
            int responseCode = connection.getResponseCode();
            System.out.println("Response Code: " + responseCode);
            
            // Read response
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            StringBuilder response = new StringBuilder();
            
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            System.out.println("Response: " + response.toString());
            connection.disconnect();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### HTTP POST Request

```java
import java.io.*;
import java.net.*;

public class HttpPostExample {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://httpbin.org/post");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // Configure POST request
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            
            // Send JSON data
            String jsonData = "{\"name\":\"John\",\"age\":30}";
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonData.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            
            // Read response
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                System.out.println(response.toString());
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Resources
- [URL Class Documentation](https://docs.oracle.com/javase/8/docs/api/java/net/URL.html)
- [HttpURLConnection Documentation](https://docs.oracle.com/javase/8/docs/api/java/net/HttpURLConnection.html)

## `DatagramSockets`

**Overview:**
`DatagramSocket` provides `UDP` (User Datagram Protocol) communication, which is connectionless and unreliable but faster than `TCP`.

**Key Concepts:**
- Connectionless communication
- Packet-based data transmission
- No guaranteed delivery
- Lower overhead than `TCP`

### Code Examples

#### UDP Client

```java
import java.net.*;
import java.io.*;

public class UDPClient {
    public static void main(String[] args) {
        try {
            DatagramSocket socket = new DatagramSocket();
            InetAddress address = InetAddress.getByName("localhost");
            
            String message = "Hello UDP Server!";
            byte[] buffer = message.getBytes();
            
            // Create and send packet
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, 9876);
            socket.send(packet);
            
            // Receive response
            byte[] responseBuffer = new byte[1024];
            DatagramPacket responsePacket = new DatagramPacket(responseBuffer, responseBuffer.length);
            socket.receive(responsePacket);
            
            String response = new String(responsePacket.getData(), 0, responsePacket.getLength());
            System.out.println("Server response: " + response);
            
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### UDP Server

```java
import java.net.*;

public class UDPServer {
    public static void main(String[] args) {
        try {
            DatagramSocket socket = new DatagramSocket(9876);
            System.out.println("UDP Server started on port 9876");
            
            while (true) {
                byte[] buffer = new byte[1024];
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                
                // Receive packet
                socket.receive(packet);
                String message = new String(packet.getData(), 0, packet.getLength());
                System.out.println("Received: " + message);
                
                // Send response
                String response = "Echo: " + message;
                byte[] responseData = response.getBytes();
                DatagramPacket responsePacket = new DatagramPacket(
                    responseData, responseData.length, packet.getAddress(), packet.getPort());
                socket.send(responsePacket);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Resources
- [DatagramSocket Documentation](https://docs.oracle.com/javase/8/docs/api/java/net/DatagramSocket.html)
- [UDP Programming Tutorial](https://docs.oracle.com/javase/tutorial/networking/datagrams/)
- https://docs.oracle.com/javase/tutorial/networking/overview/networking.html
- https://medium.com/@AlexanderObregon/leveraging-java-for-network-programming-tips-and-techniques-ebbde8189e2b
- https://www.scaler.com/topics/networking-in-java/