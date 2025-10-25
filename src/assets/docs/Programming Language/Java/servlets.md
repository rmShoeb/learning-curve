# 15 - Servlets

## Servlet Lifecycle

**Overview:**
- Servlets are Java programs that run on a web server and handle `HTTP` requests.
- The servlet lifecycle is managed by the servlet container.

**Key Concepts:**
- Servlet lifecycle phases: Loading, Instantiation, Initialization, Request Handling, Destruction
- Container-managed lifecycle
- Single instance serves multiple requests

**Lifecycle Methods:**
- `init()` - Called once when servlet is first loaded
- `service()` - Called for each request
- `destroy()` - Called when servlet is unloaded

### Code Examples

#### Basic Servlet

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class LifecycleServlet extends HttpServlet {
    
    @Override
    public void init() throws ServletException {
        System.out.println("Servlet initialized");
        // Initialize resources, database connections, etc.
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        out.println("<html><body>");
        out.println("<h1>Hello from Servlet!</h1>");
        out.println("<p>Request processed at: " + new java.util.Date() + "</p>");
        out.println("</body></html>");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Handle POST requests
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        // Process login logic
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>Login processed for: " + username + "</h1>");
        out.println("</body></html>");
    }
    
    @Override
    public void destroy() {
        System.out.println("Servlet destroyed");
        // Clean up resources
    }
}
```

#### Web.xml Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    
    <servlet>
        <servlet-name>LifecycleServlet</servlet-name>
        <servlet-class>LifecycleServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>LifecycleServlet</servlet-name>
        <url-pattern>/lifecycle</url-pattern>
    </servlet-mapping>
</web-app>
```

### Resources
- [Servlet API Documentation](https://docs.oracle.com/javaee/7/api/javax/servlet/package-summary.html)
- [Servlet Tutorial](https://docs.oracle.com/javaee/7/tutorial/servlets.htm)

## Request and Response Handling

**Overview:**
Servlets handle `HTTP` requests and generate responses using `HttpServletRequest` and `HttpServletResponse` objects.

**Key Concepts:**
- Request parameters and headers
- Response status codes and headers
- Content types and character encoding
- Request forwarding and redirection

### Code Examples

#### Request Parameter Handling

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;

public class RequestHandlingServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        out.println("<html><body>");
        out.println("<h2>Request Information</h2>");
        
        // Get request parameters
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        
        if (name != null) {
            out.println("<p>Name: " + name + "</p>");
        }
        if (age != null) {
            out.println("<p>Age: " + age + "</p>");
        }
        
        // Display all parameters
        out.println("<h3>All Parameters:</h3>");
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String[] paramValues = request.getParameterValues(paramName);
            out.println("<p>" + paramName + ": " + Arrays.toString(paramValues) + "</p>");
        }
        
        // Display request headers
        out.println("<h3>Request Headers:</h3>");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            out.println("<p>" + headerName + ": " + headerValue + "</p>");
        }
        
        out.println("</body></html>");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Handle file upload
        if (request.getContentType() != null && request.getContentType().startsWith("multipart/")) {
            handleFileUpload(request, response);
        } else {
            // Regular form processing
            processForm(request, response);
        }
    }
    
    private void processForm(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        // Create JSON response
        out.println("{");
        out.println("  \"status\": \"success\",");
        out.println("  \"message\": \"Form processed successfully\",");
        out.println("  \"timestamp\": \"" + new Date() + "\"");
        out.println("}");
    }
    
    private void handleFileUpload(HttpServletRequest request, HttpServletResponse response) 
            throws IOException, ServletException {
        // Handle multipart form data for file uploads
        // Implementation would use Part API for file handling
        response.setContentType("text/plain");
        response.getWriter().println("File upload handled");
    }
}
```

#### Response Manipulation

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class ResponseHandlingServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if ("download".equals(action)) {
            handleFileDownload(response);
        } else if ("redirect".equals(action)) {
            handleRedirect(request, response);
        } else if ("json".equals(action)) {
            handleJsonResponse(response);
        } else {
            handleDefaultResponse(response);
        }
    }
    
    private void handleFileDownload(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition", "attachment; filename=\"sample.txt\"");
        
        PrintWriter out = response.getWriter();
        out.println("This is a sample file for download.");
    }
    
    private void handleRedirect(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        String redirectUrl = request.getContextPath() + "/welcome.jsp";
        response.sendRedirect(redirectUrl);
    }
    
    private void handleJsonResponse(HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        
        PrintWriter out = response.getWriter();
        out.println("{");
        out.println("  \"users\": [");
        out.println("    {\"id\": 1, \"name\": \"John Doe\"},");
        out.println("    {\"id\": 2, \"name\": \"Jane Smith\"}");
        out.println("  ]");
        out.println("}");
    }
    
    private void handleDefaultResponse(HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>Response Examples</title></head>");
        out.println("<body>");
        out.println("<h1>Response Handling Examples</h1>");
        out.println("<ul>");
        out.println("<li><a href='?action=download'>Download File</a></li>");
        out.println("<li><a href='?action=redirect'>Redirect Example</a></li>");
        out.println("<li><a href='?action=json'>JSON Response</a></li>");
        out.println("</ul>");
        out.println("</body></html>");
    }
}
```

### Resources
- [HttpServletRequest Documentation](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletRequest.html)
- [HttpServletResponse Documentation](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponse.html)

## Session Management

**Overview:**
`HTTP` is stateless, but web applications often need to maintain state across multiple requests. Servlets provide session management capabilities.

**Key Concepts:**
- `HttpSession` object
- Session creation and invalidation
- Session attributes
- Session timeout
- URL rewriting and cookies

### Code Examples

#### Session Management Servlet

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;

public class SessionManagementServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(true); // Create if doesn't exist
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>Session Management</title></head>");
        out.println("<body>");
        out.println("<h1>Session Management Example</h1>");
        
        // Display session information
        out.println("<h2>Session Information:</h2>");
        out.println("<p>Session ID: " + session.getId() + "</p>");
        out.println("<p>Creation Time: " + new Date(session.getCreationTime()) + "</p>");
        out.println("<p>Last Accessed: " + new Date(session.getLastAccessedTime()) + "</p>");
        out.println("<p>Max Inactive Interval: " + session.getMaxInactiveInterval() + " seconds</p>");
        out.println("<p>Is New Session: " + session.isNew() + "</p>");
        
        // Handle different actions
        String action = request.getParameter("action");
        
        if ("login".equals(action)) {
            handleLogin(request, session, out);
        } else if ("logout".equals(action)) {
            handleLogout(session, out);
        } else if ("addItem".equals(action)) {
            handleAddItem(request, session, out);
        } else if ("viewCart".equals(action)) {
            handleViewCart(session, out);
        }
        
        // Display navigation
        displayNavigation(out);
        
        out.println("</body></html>");
    }
    
    private void handleLogin(HttpServletRequest request, HttpSession session, PrintWriter out) {
        String username = request.getParameter("username");
        if (username != null && !username.trim().isEmpty()) {
            session.setAttribute("username", username);
            session.setAttribute("loginTime", new Date());
            out.println("<p style='color: green;'>Welcome, " + username + "!</p>");
        }
    }
    
    private void handleLogout(HttpSession session, PrintWriter out) {
        String username = (String) session.getAttribute("username");
        session.invalidate();
        out.println("<p style='color: red;'>Goodbye, " + (username != null ? username : "User") + "!</p>");
    }
    
    @SuppressWarnings("unchecked")
    private void handleAddItem(HttpServletRequest request, HttpSession session, PrintWriter out) {
        String item = request.getParameter("item");
        if (item != null && !item.trim().isEmpty()) {
            List<String> cart = (List<String>) session.getAttribute("cart");
            if (cart == null) {
                cart = new ArrayList<>();
                session.setAttribute("cart", cart);
            }
            cart.add(item);
            out.println("<p style='color: blue;'>Added '" + item + "' to cart.</p>");
        }
    }
    
    @SuppressWarnings("unchecked")
    private void handleViewCart(HttpSession session, PrintWriter out) {
        List<String> cart = (List<String>) session.getAttribute("cart");
        out.println("<h3>Shopping Cart:</h3>");
        if (cart == null || cart.isEmpty()) {
            out.println("<p>Cart is empty.</p>");
        } else {
            out.println("<ul>");
            for (String item : cart) {
                out.println("<li>" + item + "</li>");
            }
            out.println("</ul>");
        }
    }
    
    private void displayNavigation(PrintWriter out) {
        out.println("<hr>");
        out.println("<h3>Actions:</h3>");
        out.println("<form method='get'>");
        out.println("<input type='hidden' name='action' value='login'>");
        out.println("Username: <input type='text' name='username'>");
        out.println("<input type='submit' value='Login'>");
        out.println("</form>");
        
        out.println("<form method='get'>");
        out.println("<input type='hidden' name='action' value='logout'>");
        out.println("<input type='submit' value='Logout'>");
        out.println("</form>");
        
        out.println("<form method='get'>");
        out.println("<input type='hidden' name='action' value='addItem'>");
        out.println("Item: <input type='text' name='item'>");
        out.println("<input type='submit' value='Add to Cart'>");
        out.println("</form>");
        
        out.println("<form method='get'>");
        out.println("<input type='hidden' name='action' value='viewCart'>");
        out.println("<input type='submit' value='View Cart'>");
        out.println("</form>");
    }
}
```

#### Session Listener Example

```java
import javax.servlet.http.*;

public class SessionListener implements HttpSessionListener {
    
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        System.out.println("Session created: " + se.getSession().getId());
        // Initialize session data, increment active user count, etc.
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        System.out.println("Session destroyed: " + se.getSession().getId());
        // Clean up session data, decrement active user count, etc.
    }
}
```

### Resources
- [HttpSession Documentation](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html)
- [Session Management Tutorial](https://docs.oracle.com/javaee/7/tutorial/servlets011.htm)