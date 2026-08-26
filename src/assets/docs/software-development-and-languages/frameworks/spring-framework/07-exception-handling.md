# Basic Exception Handling

## `@ExceptionHandler`
- Spring automatically invokes `@ExceptionHandler` annotated methods when the given exception occurs.
- We can specify the exception either with the annotation or by declaring it as a method parameter.
- Since Spring 6.2, we can write different exception handlers for different content types.

```java
@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<ValidationErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
    // ...
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler( produces = MediaType.APPLICATION_JSON_VALUE )
public CustomExceptionObject handleException3Json(CustomException3 ex) {
    // ...
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
@ExceptionHandler( produces = MediaType.TEXT_PLAIN_VALUE )
public String handleException3Text(CustomException3 ex) {
    // ...
}
```

## Local Exception Handling
- We can place the handler methods in the controller class.
- We can use this approach whenever we need controller-specific exception handling.
- But it has the drawback that we cannot use it in multiple controllers unless we put it in a base class and use inheritance.

```java
@RestController
public class FooController {
    //...

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(NullPointerException.class)
    public void handleException() {
        // ...
    }
}
```

## Global Exception Handling
- This is the most common and powerful approach.
- We can create a separate class and annotate it with `@ControllerAdvice`.
- A `@ControllerAdvice` contains code that is shared between multiple controllers.
- We can then define `@ExceptionHandler` methods inside this class. These handlers will catch exceptions thrown from any controller across the entire application, allowing us to centralize the error-handling logic.
- For REST APIs, where each method’s return value should be rendered into the response body, there’s a `@RestControllerAdvice`.

```java
@RestControllerAdvice
public class MyGlobalExceptionHandler {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpClientErrorException.class)
    public void handleException() {
        // ...
    }
}
```

There’s also a base class (`ResponseEntityExceptionHandler`) that we could inherit from to use common pre-defined functionality.

```java
@ControllerAdvice
public class MyCustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler({ 
        IllegalArgumentException.class, 
        IllegalStateException.class
    })
    ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        String bodyOfResponse = "This should be application specific";
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        // ... (customization, maybe invoking the overridden method)
    }
}
```

## Annotate Exceptions Directly

```java
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class MyResourceNotFoundException extends RuntimeException {
    // ...
}
```

- This resolver is limited in the way it deals with the body of the response.
- It maps the Status Code on the response, but the body is still `null`.
- We can only use it for our custom exceptions because we cannot annotate existing, already compiled classes.
- One drawback is that it creates tight coupling with the exception.

## Using ResponseStatusException

```java
@GetMapping(value = "/{id}")
public Foo findById(@PathVariable("id") Long id) {
    try {
        // ...
    } catch (MyResourceNotFoundException ex) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Foo Not Found", ex);
    }
}
```

- We can create an instance of it providing an HttpStatus and, optionally, a reason and a cause.
- Benefits
    - We can implement a basic solution quite fast.
    - Same exception may need cause different status code in different situation. Same area can cause different exceptions. Using this helps us provide use case specific implementation without tight coupling.
- Tradeoff
    - No unified approach.
    - We may find ourselves replicating code in multiple controllers.

## `HandlerExceptionResolver`
- It intercepts and processes any exception raised and not handled by a Controller.
- This resolves any exception thrown by the application.
- It also allows us to implement a uniform exception handling mechanism in our REST API.

### Existing Implementations
- There are already existing implementations that are enabled by default in the `DispatcherServlet`.
- `ExceptionHandlerExceptionResolver` is actually the core component of how the `@ExceptionHandler` mechanism presented earlier works.
- `ResponseStatusExceptionResolver` is actually the core component of how the `@ResponseStatus` mechanism presented earlier works.
- `DefaultHandlerExceptionResolver` is used to resolve standard Spring exceptions to their corresponding HTTP Status Codes, namely Client error `4xx` and Server error `5xx` status codes. While it does set the Status Code of the Response properly, one limitation is that it doesn’t set anything to the body of the Response.

### Custom HandlerExceptionResolver

```java
@Component
public class RestResponseStatusExceptionResolver extends AbstractHandlerExceptionResolver {
    @Override
    protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        try {
            if (ex instanceof IllegalArgumentException) {
                return handleIllegalArgument((IllegalArgumentException) ex, response, handler);
            }
            // ...
        } catch (Exception handlerException) {
            logger.warn("Handling of [" + ex.getClass().getName() + "] resulted in Exception", handlerException);
        }
        return null;
    }

    private ModelAndView handleIllegalArgument(
      IllegalArgumentException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_CONFLICT);
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        // ...
        return new ModelAndView();
    }
}
```

**Limitation:** It interacts with the low-level `HtttpServletResponse` and fits into the old MVC model that uses `ModelAndView`.

## Resources
- [Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- [Spring ResponseStatusException](https://www.baeldung.com/spring-response-status-exception)
- [Exceptions](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)