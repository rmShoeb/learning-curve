# 16 - Java Server Pages (JSP)

## JSP Syntax and Directives

**Overview:**
Java Server Pages (JSP) is a technology that allows embedding Java code in HTML pages. JSP pages are compiled into servlets by the JSP container.

**Key Concepts:**
- Scriptlets, expressions, and declarations
- Page, include, and taglib directives
- Implicit objects
- JSP lifecycle

**JSP Elements:**
- Scriptlet: `<% Java code %>`
- Expression: `<%= expression %>`
- Declaration: `<%! declaration %>`
- Comment: `<%-- comment --%>`
- Directive: `<%@ directive %>`

### Code Examples

#### Basic JSP Page

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*, java.text.*" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>JSP Syntax Examples</title>
</head>
<body>
    <h1>JSP Syntax and Directives Example</h1>
    
    <!-- JSP Comment (not visible in HTML source) -->
    <%-- This is a JSP comment --%>
    
    <!-- HTML Comment (visible in HTML source) -->
    <!-- This is an HTML comment -->
    
    <h2>Current Date and Time</h2>
    <!-- Expression -->
    <p>Current time: <%= new Date() %></p>
    
    <h2>Scriptlet Example</h2>
    <%
        // Scriptlet - Java code
        String userName = request.getParameter("name");
        if (userName == null) {
            userName = "Guest";
        }
        
        int visitCount = 1;
        HttpSession userSession = request.getSession();
        Integer count = (Integer) userSession.getAttribute("visitCount");
        if (count != null) {
            visitCount = count + 1;
        }
        userSession.setAttribute("visitCount", visitCount);
    %>
    
    <p>Welcome, <%= userName %>!</p>
    <p>This is your visit number: <%= visitCount %></p>
    
    <h2>Loop Example</h2>
    <ul>
    <%
        String[] colors = {"Red", "Green", "Blue", "Yellow", "Purple"};
        for (int i = 0; i < colors.length; i++) {
    %>
        <li style="color: <%= colors[i].toLowerCase() %>"><%= colors[i] %></li>
    <%
        }
    %>
    </ul>
    
    <h2>Request Information</h2>
    <table border="1">
        <tr><td>Request Method:</td><td><%= request.getMethod() %></td></tr>
        <tr><td>Request URI:</td><td><%= request.getRequestURI() %></td></tr>
        <tr><td>Server Name:</td><td><%= request.getServerName() %></td></tr>
        <tr><td>Server Port:</td><td><%= request.getServerPort() %></td></tr>
        <tr><td>Remote Address:</td><td><%= request.getRemoteAddr() %></td></tr>
        <tr><td>Session ID:</td><td><%= session.getId() %></td></tr>
    </table>
</body>
</html>
```

#### JSP Directives Example

```html
<%-- Page Directive --%>
<%@ page language="java" 
         contentType="text/html; charset=UTF-8" 
         pageEncoding="UTF-8"
         import="java.util.*, java.io.*"
         session="true"
         buffer="8kb"
         autoFlush="true"
         isThreadSafe="true"
         errorPage="error.jsp" %>

<%-- Include Directive --%>
<%@ include file="header.jsp" %>

<%-- Taglib Directive --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html>
<head>
    <title>Directives Example</title>
</head>
<body>
    <h1>JSP Directives Example</h1>
    
    <%-- Declaration --%>
    <%!
        // Class-level variables and methods
        private int pageAccessCount = 0;
        
        public String getCurrentDateTime() {
            return new java.util.Date().toString();
        }
        
        public String formatNumber(int number) {
            return String.format("%,d", number);
        }
    %>
    
    <%
        // Increment page access count
        pageAccessCount++;
    %>
    
    <p>Page accessed <%= formatNumber(pageAccessCount) %> times since server restart.</p>
    <p>Current date/time: <%= getCurrentDateTime() %></p>
    
    <h2>Request Parameters</h2>
    <%
        java.util.Enumeration<String> paramNames = request.getParameterNames();
        if (!paramNames.hasMoreElements()) {
    %>
        <p>No parameters provided. Try adding ?name=value to the URL.</p>
    <%
        } else {
    %>
        <table border="1">
            <tr><th>Parameter Name</th><th>Parameter Value</th></tr>
    <%
            while (paramNames.hasMoreElements()) {
                String paramName = paramNames.nextElement();
                String paramValue = request.getParameter(paramName);
    %>
            <tr>
                <td><%= paramName %></td>
                <td><%= paramValue %></td>
            </tr>
    <%
            }
    %>
        </table>
    <%
        }
    %>
</body>
</html>

<%-- Include footer --%>
<%@ include file="footer.jsp" %>
```

#### Error Page Example (`error.jsp`)

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <title>Error Page</title>
    <style>
        .error { color: red; font-weight: bold; }
        .stack-trace { background-color: #f0f0f0; padding: 10px; font-family: monospace; }
    </style>
</head>
<body>
    <h1 class="error">An Error Occurred</h1>
    
    <p><strong>Error Message:</strong> <%= exception.getMessage() %></p>
    <p><strong>Exception Type:</strong> <%= exception.getClass().getName() %></p>
    
    <h3>Stack Trace:</h3>
    <div class="stack-trace">
        <%
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            exception.printStackTrace(pw);
            out.println(sw.toString());
        %>
    </div>
    
    <p><a href="javascript:history.back()">Go Back</a></p>
</body>
</html>
```

### Resources
- [JSP Syntax Reference](https://docs.oracle.com/javaee/7/tutorial/jspsyntax.htm)
- [JSP Directives Documentation](https://docs.oracle.com/javaee/7/api/javax/servlet/jsp/package-summary.html)

## Expression Language (EL)

**Overview:**
Expression Language (EL) provides a simpler way to access data in JSP pages without using scriptlets. EL expressions are enclosed in `${}` syntax.

**Key Concepts:**
- Access to implicit objects
- Property navigation
- Operators (arithmetic, logical, relational)
- Function calls
- Collections and maps

### Code Examples

#### Basic EL Expressions

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Expression Language Examples</title>
</head>
<body>
    <h1>Expression Language (EL) Examples</h1>
    
    <%-- Set some attributes for demonstration --%>
    <c:set var="userName" value="John Doe" scope="request" />
    <c:set var="userAge" value="30" scope="request" />
    <c:set var="isAdmin" value="true" scope="session" />
    
    <h2>Basic EL Expressions</h2>
    <p>User Name: ${userName}</p>
    <p>User Age: ${userAge}</p>
    <p>Is Admin: ${isAdmin}</p>
    
    <h2>Arithmetic Operations</h2>
    <p>Age + 5 = ${userAge + 5}</p>
    <p>Age * 2 = ${userAge * 2}</p>
    <p>Age / 3 = ${userAge / 3}</p>
    <p>Age % 7 = ${userAge % 7}</p>
    
    <h2>Comparison Operations</h2>
    <p>Age > 25: ${userAge > 25}</p>
    <p>Age >= 30: ${userAge >= 30}</p>
    <p>Age < 35: ${userAge lt 35}</p>
    <p>Age == 30: ${userAge eq 30}</p>
    <p>Name != 'Admin': ${userName ne 'Admin'}</p>
    
    <h2>Logical Operations</h2>
    <p>Is Adult AND Admin: ${userAge >= 18 && isAdmin}</p>
    <p>Is Adult OR Admin: ${userAge >= 18 || isAdmin}</p>
    <p>Not Admin: ${!isAdmin}</p>
    
    <h2>Conditional (Ternary) Operator</h2>
    <p>Status: ${isAdmin ? 'Administrator' : 'Regular User'}</p>
    <p>Category: ${userAge >= 65 ? 'Senior' : (userAge >= 18 ? 'Adult' : 'Minor')}</p>
    
    <h2>String Operations</h2>
    <p>Empty check: ${empty userName ? 'No name' : userName}</p>
    <p>Not empty check: ${not empty userName}</p>
    
    <h2>Implicit Objects</h2>
    <p>Request Method: ${pageContext.request.method}</p>
    <p>Server Name: ${pageContext.request.serverName}</p>
    <p>Context Path: ${pageContext.request.contextPath}</p>
    <p>Session ID: ${pageContext.session.id}</p>
    
    <h2>Request Parameters</h2>
    <p>Parameter 'name': ${param.name}</p>
    <p>Parameter 'age': ${param.age}</p>
    <p>All parameters: ${paramValues}</p>
    
    <h2>Headers</h2>
    <p>User-Agent: ${header['User-Agent']}</p>
    <p>Accept: ${header.Accept}</p>
    
    <h2>Collections and Arrays</h2>
    <%
        request.setAttribute("numbers", new int[]{1, 2, 3, 4, 5});
        java.util.Map<String, String> userMap = new java.util.HashMap<>();
        userMap.put("firstName", "John");
        userMap.put("lastName", "Doe");
        userMap.put("email", "john.doe@example.com");
        request.setAttribute("userMap", userMap);
    %>
    
    <p>First number: ${numbers[0]}</p>
    <p>Third number: ${numbers[2]}</p>
    <p>Array length: ${numbers.length}</p>
    
    <p>First Name: ${userMap.firstName}</p>
    <p>Last Name: ${userMap['lastName']}</p>
    <p>Email: ${userMap.email}</p>
    
    <h2>Iteration with JSTL</h2>
    <ul>
        <c:forEach var="number" items="${numbers}">
            <li>Number: ${number}, Square: ${number * number}</li>
        </c:forEach>
    </ul>
    
    <h3>User Map Entries:</h3>
    <ul>
        <c:forEach var="entry" items="${userMap}">
            <li>${entry.key}: ${entry.value}</li>
        </c:forEach>
    </ul>
</body>
</html>
```

#### Advanced EL with Custom Functions

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
    <title>Advanced EL Examples</title>
</head>
<body>
    <h1>Advanced Expression Language Examples</h1>
    
    <c:set var="message" value="  Hello, World! Welcome to JSP EL.  " />
    <c:set var="email" value="user@example.com" />
    
    <h2>String Functions</h2>
    <p>Original: "${message}"</p>
    <p>Length: ${fn:length(message)}</p>
    <p>Trimmed: "${fn:trim(message)}"</p>
    <p>Uppercase: ${fn:toUpperCase(fn:trim(message))}</p>
    <p>Lowercase: ${fn:toLowerCase(fn:trim(message))}</p>
    <p>Substring (0-5): ${fn:substring(fn:trim(message), 0, 5)}</p>
    <p>Contains 'World': ${fn:contains(message, 'World')}</p>
    <p>Starts with 'Hello': ${fn:startsWith(fn:trim(message), 'Hello')}</p>
    <p>Ends with 'EL.': ${fn:endsWith(fn:trim(message), 'EL.')}</p>
    <p>Index of 'World': ${fn:indexOf(message, 'World')}</p>
    <p>Replace 'World' with 'Universe': ${fn:replace(message, 'World', 'Universe')}</p>
    
    <h2>Split Function</h2>
    <c:set var="colors" value="red,green,blue,yellow,purple" />
    <p>Colors string: ${colors}</p>
    <p>Split colors:</p>
    <ul>
        <c:forEach var="color" items="${fn:split(colors, ',')}">
            <li style="color: ${color}">${color}</li>
        </c:forEach>
    </ul>
    
    <h2>Join Function</h2>
    <c:set var="words" value="${fn:split('Java,is,awesome', ',')}" />
    <p>Joined with spaces: ${fn:join(words, ' ')}</p>
    <p>Joined with ' - ': ${fn:join(words, ' - ')}</p>
    
    <h2>Email Validation Example</h2>
    <p>Email: ${email}</p>
    <p>Contains @: ${fn:contains(email, '@')}</p>
    <p>Has .com: ${fn:endsWith(email, '.com')}</p>
    <p>Valid format: ${fn:contains(email, '@') && fn:contains(email, '.')}</p>
    
    <h2>Complex Expressions</h2>
    <%
        java.util.List<java.util.Map<String, Object>> users = new java.util.ArrayList<>();
        
        java.util.Map<String, Object> user1 = new java.util.HashMap<>();
        user1.put("name", "Alice Johnson");
        user1.put("age", 25);
        user1.put("active", true);
        
        java.util.Map<String, Object> user2 = new java.util.HashMap<>();
        user2.put("name", "Bob Smith");
        user2.put("age", 35);
        user2.put("active", false);
        
        java.util.Map<String, Object> user3 = new java.util.HashMap<>();
        user3.put("name", "Carol Davis");
        user3.put("age", 28);
        user3.put("active", true);
        
        users.add(user1);
        users.add(user2);
        users.add(user3);
        
        request.setAttribute("users", users);
    %>
    
    <table border="1">
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Status</th>
            <th>Category</th>
        </tr>
        <c:forEach var="user" items="${users}">
            <tr style="background-color: ${user.active ? '#e6ffe6' : '#ffe6e6'}">
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>${user.active ? 'Active' : 'Inactive'}</td>
                <td>
                    ${user.age < 30 ? 'Young' : (user.age < 50 ? 'Middle-aged' : 'Senior')}
                </td>
            </tr>
        </c:forEach>
    </table>
    
    <h2>Mathematical Expressions</h2>
    <c:set var="x" value="10" />
    <c:set var="y" value="3" />
    
    <p>x = ${x}, y = ${y}</p>
    <p>x + y = ${x + y}</p>
    <p>x - y = ${x - y}</p>
    <p>x * y = ${x * y}</p>
    <p>x / y = ${x / y}</p>
    <p>x mod y = ${x mod y}</p>
    <p>x ^ y = ${x^y}</p> <!-- Note: ^ is XOR, not power -->
</body>
</html>
```

### Resources
- [EL Specification](https://docs.oracle.com/javaee/7/tutorial/jsfel.htm)
- [JSTL Functions](https://docs.oracle.com/javaee/5/jstl/1.1/docs/tlddocs/fn/tld-summary.html)

## JSP Tag Libraries

**Overview:**
JSP Tag Libraries provide a way to encapsulate complex functionality in reusable tags. The most common is JSTL (JSP Standard Tag Library).

**Key Concepts:**
- Core tags (`c:`)
- Formatting tags (`fmt:`)
- SQL tags (`sql:`)
- XML tags (`x:`)
- Functions (`fn:`)
- Custom tags

### Code Examples

#### JSTL Core Tags

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSTL Core Tags Examples</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .even { background-color: #f9f9f9; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <h1>JSTL Core Tags Examples</h1>
    
    <h2>c:set and c:out</h2>
    <c:set var="greeting" value="Hello, JSTL!" />
    <c:set var="count" value="5" />
    <c:set var="htmlContent" value="<strong>Bold Text</strong>" />
    
    <p>Greeting: <c:out value="${greeting}" /></p>
    <p>Count: <c:out value="${count}" /></p>
    <p>HTML (escaped): <c:out value="${htmlContent}" /></p>
    <p>HTML (unescaped): <c:out value="${htmlContent}" escapeXml="false" /></p>
    <p>Default value: <c:out value="${emptyVar}" default="Default Value" /></p>
    
    <h2>c:if</h2>
    <c:if test="${count > 3}">
        <p style="color: green;">Count is greater than 3!</p>
    </c:if>
    
    <c:if test="${count <= 3}">
        <p style="color: red;">Count is 3 or less.</p>
    </c:if>
    
    <h2>c:choose, c:when, c:otherwise</h2>
    <c:choose>
        <c:when test="${count < 3}">
            <p>Count is small (less than 3)</p>
        </c:when>
        <c:when test="${count >= 3 && count <= 10}">
            <p>Count is medium (3 to 10)</p>
        </c:when>
        <c:otherwise>
            <p>Count is large (greater than 10)</p>
        </c:otherwise>
    </c:choose>
    
    <h2>c:forEach - Numbers</h2>
    <ul>
        <c:forEach var="i" begin="1" end="${count}">
            <li>Item ${i} (Square: ${i * i})</li>
        </c:forEach>
    </ul>
    
    <h2>c:forEach - Collection</h2>
    <%
        java.util.List<String> fruits = new java.util.ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        fruits.add("Date");
        fruits.add("Elderberry");
        request.setAttribute("fruits", fruits);
    %>
    
    <table>
        <tr><th>Index</th><th>Fruit</th><th>Length</th><th>Position</th></tr>
        <c:forEach var="fruit" items="${fruits}" varStatus="status">
            <tr class="${status.index % 2 == 0 ? 'even' : ''}">
                <td>${status.index}</td>
                <td>
                    <c:choose>
                        <c:when test="${status.first}">
                            <strong>${fruit}</strong> (First)
                        </c:when>
                        <c:when test="${status.last}">
                            <strong>${fruit}</strong> (Last)
                        </c:when>
                        <c:otherwise>
                            ${fruit}
                        </c:otherwise>
                    </c:choose>
                </td>
                <td>${fruit.length()}</td>
                <td>${status.count} of ${status.end}</td>
            </tr>
        </c:forEach>
    </table>
    
    <h2>c:forTokens</h2>
    <c:set var="data" value="red,green,blue;yellow|purple" />
    <p>Data: ${data}</p>
    <p>Tokens (delimited by ',;|'):</p>
    <ul>
        <c:forTokens items="${data}" delims=",;|" var="token">
            <li style="color: ${token}">${token}</li>
        </c:forTokens>
    </ul>
    
    <h2>c:url and c:param</h2>
    <c:url var="searchUrl" value="/search">
        <c:param name="query" value="java programming" />
        <c:param name="category" value="technology" />
        <c:param name="sort" value="date" />
    </c:url>
    <p>Search URL: <a href="${searchUrl}">${searchUrl}</a></p>
    
    <h2>c:import</h2>
    <div style="border: 1px solid #ccc; padding: 10px;">
        <h3>Imported Content:</h3>
        <c:catch var="importError">
            <c:import url="https://httpbin.org/json" />
        </c:catch>
        <c:if test="${not empty importError}">
            <p style="color: red;">Error importing content: ${importError.message}</p>
        </c:if>
    </div>
    
    <h2>c:remove</h2>
    <c:set var="tempVar" value="This will be removed" />
    <p>Before removal: ${tempVar}</p>
    <c:remove var="tempVar" />
    <p>After removal: ${empty tempVar ? 'Variable removed' : tempVar}</p>
</body>
</html>
```

#### JSTL Formatting Tags

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSTL Formatting Tags</title>
</head>
<body>
    <h1>JSTL Formatting Tags Examples</h1>
    
    <c:set var="now" value="<%= new java.util.Date() %>" />
    <c:set var="price" value="1234.56" />
    <c:set var="percentage" value="0.75" />
    
    <h2>Date Formatting</h2>
    <p>Current Date/Time: ${now}</p>
    <p>Date only: <fmt:formatDate value="${now}" type="date" /></p>
    <p>Time only: <fmt:formatDate value="${now}" type="time" /></p>
    <p>Both: <fmt:formatDate value="${now}" type="both" /></p>
    <p>Short format: <fmt:formatDate value="${now}" type="both" dateStyle="short" timeStyle="short" /></p>
    <p>Medium format: <fmt:formatDate value="${now}" type="both" dateStyle="medium" timeStyle="medium" /></p>
    <p>Long format: <fmt:formatDate value="${now}" type="both" dateStyle="long" timeStyle="long" /></p>
    <p>Custom pattern: <fmt:formatDate value="${now}" pattern="yyyy-MM-dd HH:mm:ss" /></p>
    <p>Custom pattern 2: <fmt:formatDate value="${now}" pattern="EEEE, MMMM d, yyyy 'at' h:mm a" /></p>
    
    <h2>Number Formatting</h2>
    <p>Raw price: ${price}</p>
    <p>Currency: <fmt:formatNumber value="${price}" type="currency" /></p>
    <p>Number: <fmt:formatNumber value="${price}" type="number" /></p>
    <p>Percentage: <fmt:formatNumber value="${percentage}" type="percent" /></p>
    <p>Custom pattern: <fmt:formatNumber value="${price}" pattern="#,##0.00" /></p>
    <p>Max fraction digits: <fmt:formatNumber value="${price}" maxFractionDigits="1" /></p>
    <p>Min fraction digits: <fmt:formatNumber value="${price}" minFractionDigits="3" /></p>
    
    <h2>Locale-specific Formatting</h2>
    <fmt:setLocale value="en_US" />
    <p>US Format: <fmt:formatNumber value="${price}" type="currency" /></p>
    
    <fmt:setLocale value="de_DE" />
    <p>German Format: <fmt:formatNumber value="${price}" type="currency" /></p>
    
    <fmt:setLocale value="ja_JP" />
    <p>Japanese Format: <fmt:formatNumber value="${price}" type="currency" /></p>
    
    <fmt:setLocale value="en_US" /> <!-- Reset to US -->
    
    <h2>Parsing</h2>
    <fmt:parseDate value="2023-12-25" pattern="yyyy-MM-dd" var="parsedDate" />
    <p>Parsed date: <fmt:formatDate value="${parsedDate}" pattern="EEEE, MMMM d, yyyy" /></p>
    
    <fmt:parseNumber value="$1,234.56" type="currency" var="parsedPrice" />
    <p>Parsed price: <fmt:formatNumber value="${parsedPrice}" type="number" /></p>
    
    <h2>Time Zones</h2>
    <fmt:timeZone value="GMT">
        <p>GMT: <fmt:formatDate value="${now}" type="both" timeStyle="full" /></p>
    </fmt:timeZone>
    
    <fmt:timeZone value="America/New_York">
        <p>New York: <fmt:formatDate value="${now}" type="both" timeStyle="full" /></p>
    </fmt:timeZone>
    
    <fmt:timeZone value="Asia/Tokyo">
        <p>Tokyo: <fmt:formatDate value="${now}" type="both" timeStyle="full" /></p>
    </fmt:timeZone>
    
    <h2>Resource Bundles (Messages)</h2>
    <!-- Assuming you have message.properties files -->
    <fmt:setBundle basename="messages" />
    <p>
        <fmt:message key="welcome.message" var="welcomeMsg" />
        ${not empty welcomeMsg ? welcomeMsg : 'Message not found'}
    </p>
    
    <fmt:message key="user.greeting">
        <fmt:param value="John Doe" />
    </fmt:message>
</body>
</html>
```

#### Custom Tag Example

```java
// Custom Tag Handler
package com.example.tags;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTimeTag extends SimpleTagSupport {
    private String format = "yyyy-MM-dd HH:mm:ss";
    private String cssClass = "";
    
    public void setFormat(String format) {
        this.format = format;
    }
    
    public void setCssClass(String cssClass) {
        this.cssClass = cssClass;
    }
    
    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();
        
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        String formattedDate = sdf.format(new Date());
        
        if (cssClass != null && !cssClass.isEmpty()) {
            out.println("<span class=\"" + cssClass + "\">" + formattedDate + "</span>");
        } else {
            out.println(formattedDate);
        }
    }
}
```

#### Tag Library Descriptor (`WEB-INF/tld/custom.tld`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<taglib xmlns="http://java.sun.com/xml/ns/javaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
        http://java.sun.com/xml/ns/javaee/web-jsptaglibrary_2_1.xsd"
        version="2.1">
    
    <tlib-version>1.0</tlib-version>
    <short-name>custom</short-name>
    <uri>http://example.com/custom</uri>
    
    <tag>
        <name>dateTime</name>
        <tag-class>com.example.tags.DateTimeTag</tag-class>
        <body-content>empty</body-content>
        <attribute>
            <name>format</name>
            <required>false</required>
            <rtexprvalue>true</rtexprvalue>
        </attribute>
        <attribute>
            <name>cssClass</name>
            <required>false</required>
            <rtexprvalue>true</rtexprvalue>
        </attribute>
    </tag>
</taglib>
```

#### Using Custom Tags

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://example.com/custom" prefix="custom" %>
<!DOCTYPE html>
<html>
<head>
    <title>Custom Tags Example</title>
    <style>
        .highlight { background-color: yellow; font-weight: bold; }
        .timestamp { color: blue; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Custom Tags Example</h1>
    
    <p>Default format: <custom:dateTime /></p>
    <p>Custom format: <custom:dateTime format="EEEE, MMMM d, yyyy" /></p>
    <p>With CSS class: <custom:dateTime format="HH:mm:ss" cssClass="timestamp" /></p>
    <p>Highlighted: <custom:dateTime format="yyyy-MM-dd" cssClass="highlight" /></p>
</body>
</html>
```

### Resources
- [JSTL Documentation](https://docs.oracle.com/javaee/5/tutorial/doc/bnakc.html)
- [Custom Tags Tutorial](https://docs.oracle.com/javaee/7/tutorial/jsptags.htm)
- [Tag Library Descriptor Reference](https://docs.oracle.com/javaee/7/tutorial/jsptags003.htm)