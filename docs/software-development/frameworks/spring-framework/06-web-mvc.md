# Spring Web MVC
- The original web framework built on the Servlet API.
- It follows the Model-View-Controller design pattern, providing separation of concerns between presentation, business logic, and data access layers.

## Model-View-Controller (MVC) Architecture
- It is an architectural/design pattern, created by **Trygve Reenskaug**, that separates an application into three main logical components Model, View, and Controller.
- Each architectural component is built to handle specific development aspects of an application.
- It isolates the business logic and presentation layer from each other.
- It was traditionally used for desktop applications. But now it is vastly used for web development frameworks and mobile apps as well.

![MVC Architechture](https://media.geeksforgeeks.org/wp-content/uploads/20220224160807/Model1.png)

### Components
**Model**
- It corresponds to all the data and business logic (Entities, DTOs, Services) that the user works with.
- It can add or retrieve data from the database.
- It responds to the controller's request because the controller can't interact with the database by itself.
- The model interacts with the database and gives the required data back to the controller.

**View**
- It is the presentation layer (JSP, Thymeleaf, JSON responses).
- It is used for all the UI logic of the application.
- Views are created by the data which is collected by the model component but these data are taken through the controller.
- Its job is to render data to the user in a specific format, and update the display when the Model changes.

**Controller**
- It is the component that enables the interconnection between the views and the model so it acts as an intermediary.
- The controller doesn’t have to worry about handling data logic, it just tells the model what to do, and interact with the View to render the final output.
- It does request handling and flow control, *i.e.* selecting and displaying the appropriate View.

## The Engine: `DispatcherServlet`
- When any web request is made, it first goes to the Front Controller, which is the `DispatcherServlet`.
- The `DispatcherServlet` provides a shared algorithm for request processing.
- This is the central dispatcher for HTTP request handlers/controllers.
- It dispatches to registered handlers for processing a web request, providing convenient mapping and exception handling facilities.
- It is based around a `JavaBeans` configuration mechanism.
- It needs to be declared and mapped according to the Servlet specification by using Java configuration or in `web.xml`.
- It uses Spring configuration to discover the delegate components it needs for request mapping, view resolution, exception handling, and more.
- The DispatcherServlet acts as the main controller to route requests to their intended destination.
- The Spring Web MVC framework is designed around a DispatcherServlet.
- In the Web MVC framework, each `DispatcherServlet` has its own `WebApplicationContext`.
- The default handler is based on the `@Controller` and `@RequestMapping` annotations.

![Spring-MVC-Framework-Control-flow-Diagram](https://media.geeksforgeeks.org/wp-content/uploads/20231106150237/Spring-MVC-Framework-Control-flow-Diagram.png)

### Configuration

```java
public class MyWebApplicationInitializer implements WebApplicationInitializer {
	@Override
	public void onStartup(ServletContext servletContext) {
		// Load Spring web application configuration
		AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
		context.register(AppConfig.class);

		// Create and register the DispatcherServlet
		DispatcherServlet servlet = new DispatcherServlet(context);
		ServletRegistration.Dynamic registration = servletContext.addServlet("app", servlet);
		registration.setLoadOnStartup(1);
		registration.addMapping("/app/*");
	}
}
```

Or,

```xml
<web-app>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>

	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>/WEB-INF/app-context.xml</param-value>
	</context-param>

	<servlet>
		<servlet-name>app</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value></param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>app</servlet-name>
		<url-pattern>/app/*</url-pattern>
	</servlet-mapping>
</web-app>
```

## Controllers and Request Mapping
- A Controller is typically responsible for preparing a model Map with data and selecting a view name but it can also write directly to the response stream and complete the request.
- Controllers interpret user input and transform it into a model that is represented to the user by the view.
- The `@Controller` annotation indicates that a particular class serves the role of a controller.
- The dispatcher scans such annotated classes for mapped methods and detects `@RequestMapping` annotations.
- Annotated controller beans can be explicitly using a standard Spring bean definition in the dispatcher's context.
- The `@Controller` stereotype also allows for autodetection, using component scanning.
- `@RequestMapping` annotation is used to map URLs onto an entire class or a particular handler method.
- Typically the class-level annotation maps a specific request path (or path pattern) onto a form controller.
- Method-level annotations narrow down the primary mapping for a specific HTTP method request method ("GET", "POST", etc.) or an HTTP request parameter condition.
- If no HTTP method is specified on a @RequestMapping, the method will map to all HTTP methods by default.
- A `@RequestMapping` on the class level is not required. Without it, all paths are simply absolute, and not relative.

```java
@Controller
@RequestMapping("/app")
public class HelloWorldController {
    @RequestMapping("/helloWorld", method=RequestMethod.GET)
    public String helloWorld(Model model) {
        model.addAttribute("message", "Hello World!");
        return "helloWorld";
    }
}
```

There are also HTTP method specific shortcut variants of `@RequestMapping`:
- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`

## Handling Data

### Handling Inputs

#### `@RequestHeader`
- This annotation is used to bind a request header to a method argument in a controller.
- If the target method parameter type is not String, type conversion is automatically applied.

```java
@GetMapping("/demo")
public void handle(
		@RequestHeader("Accept-Encoding") String encoding,
		@RequestHeader("Keep-Alive") long keepAlive) {
	//...
}
```

#### `@RequestParam`
- This annotation is used to bind Servlet request parameters (query parameters or form data) to a method argument in a controller.
- By default, method parameters that use this annotation are required, but they can be set to optional as well (with `required` set to `false`, or setting a default value).
- Type conversion is automatically applied if the target method parameter type is not String.

```java
@GetMapping
public String setupForm(
    @RequestParam("petId") int petId,
    @RequestParam(value = "query", required = false) String petName,
    Model model) {
	// ...
}
```

#### `@PathVariable`
- It can be used to handle template variables in the request URI mapping, and set them as method parameters.
- If the names for the method parameter and the path variable are same, we do not have to define any argument.
- If the path variable name is different, we can specify it in the argument.
- Method parameters annotated with @PathVariable are required by default.
- To make them optional
    - we can set the required property of @PathVariable to false.
    - we can also use `java.util.Optional<T>` (Java 8+, from Spring 4.1)

```java
@GetMapping("/employees/{id}")
// base-url/employees/13
public String getEmployeesById(@PathVariable String id) {
    return "ID: " + id;
}

@GetMapping("/employees/{id}/{name}")
// base-url/employees/13/riyad
public String getEmployeesByIdAndName(@PathVariable String id, @PathVariable String name) {
    return "ID: " + id + ", name: " + name;
}

@GetMapping(value = { "/employeeswithrequiredfalse", "/employeeswithrequiredfalse/{id}" })
public String getEmployeesByIdWithRequiredFalse(@PathVariable(required = false) String id) {
    if (id != null) {
        return "ID: " + id;
    } else {
        return "ID missing";
    }
}

@GetMapping(value = { "/employeeswithoptional", "/employeeswithoptional/{id}" })
public String getEmployeesByIdWithOptional(@PathVariable Optional<String> id) {
    if (id.isPresent()) {
        return "ID: " + id.get();
    } else {
        return "ID missing";
    }
}
```

#### `@ModelAttribute`
- This method parameter annotation binds request parameters, URI path variables, and request headers onto a model object.
- URI variables and headers are included only if they don’t override request parameters with the same name.
- Dashes are stripped from request header names.
- When using constructor binding, we can customize request parameter names through an `@BindParam` annotation.

```java
@PostMapping("/owners/{ownerId}/pets/{petId}/edit")
public String processSubmit(@ModelAttribute Pet pet) {
	// method logic...
}

@PutMapping("/accounts/{account}")
public String save(@ModelAttribute("account") Account account) {
	// ...
}

class Account {
	private final String firstName;

	public Account(@BindParam("first-name") String firstName) {
		this.firstName = firstName;
	}
}
```

#### `@RequestBody`
- This annotation is used to have the request body read and deserialized into an Object through an `HttpMessageConverter`.
- The process used by `@RequestBody` is JSON/XML serialization, not Java Serialization. So the class does not need to be serializable.
- Spring uses `Jackson` for serialization/deserialization, which needs a no-arg constructor, and standard getters setters for the fields that should be included into the JSON/XML.
- Form data should be read using `@RequestParam`, not with `@RequestBody` which can’t always be used reliably since in the Servlet API.
- `HttpEntity` is more or less identical to using `@RequestBody` but is based on a container object that exposes request headers and body.

```java
@PostMapping("/accounts")
public void handle(@RequestBody Account account) {
	// ...
}
```

### Preparing Output

#### `@ResponseBody`
- This annotation on a method to have the return serialized to the response body through an HttpMessageConverter.
- It is also supported at the class level, in which case it is inherited by all controller methods.
- @RestController is nothing more than a meta-annotation marked with @Controller and @ResponseBody.

```java
@GetMapping("/accounts/{id}")
@ResponseBody
public Account handle() {
	// ...
}
```

#### `ResponseEntity`
- It is like @ResponseBody but with status and headers.
```java
@GetMapping("/something")
public ResponseEntity<String> handle() {
	String body = ... ;
	String etag = ... ;
	return ResponseEntity.ok().eTag(etag).body(body);
}
```

## Rendering the UI: `View` and `ViewResolver`
- Spring MVC defines the `ViewResolver` and `View` interfaces that let us render models in a browser without tying to a specific view technology.
- `ViewResolver` provides a mapping between view names and actual views.
- `View` addresses the preparation of data before handing over to a specific view technology.
- Content Negotiation does not resolve views itself but rather delegates to other view resolvers and selects the view that resembles the representation requested by the client.

```java
@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {
    // JSP View Resolver
    @Bean
    public ViewResolver jspViewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        resolver.setViewClass(JstlView.class);
        resolver.setOrder(2);
        return resolver;
    }
    
    // Thymeleaf View Resolver
    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(templateResolver());
        engine.addDialect(new LayoutDialect());
        engine.addDialect(new Java8TimeDialect());
        return engine;
    }
    
    @Bean
    public ThymeleafViewResolver thymeleafViewResolver() {
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setTemplateEngine(templateEngine());
        resolver.setCharacterEncoding("UTF-8");
        resolver.setOrder(1);
        return resolver;
    }
    
    @Bean
    public TemplateResolver templateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setApplicationContext(applicationContext);
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCacheable(false); // Set to true in production
        return resolver;
    }
    
    // Static resource handling
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)));
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(30)));
    }
    
    // Content negotiation
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("format")
            .ignoreAcceptHeader(false)
            .useRegisteredExtensionsOnly(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .mediaType("html", MediaType.TEXT_HTML);
    }
}

// Controller with view resolution
@Controller
@RequestMapping("/products")
public class ProductViewController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public String listProducts(Model model,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        
        model.addAttribute("products", products);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", products.getTotalPages());
        
        return "products/list"; // Resolves to /WEB-INF/views/products/list.jsp
    }
    
    // Redirect example
    @PostMapping("/{id}/favorite")
    public String addToFavorites(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        productService.addToFavorites(id);
        redirectAttributes.addFlashAttribute("message", "Product added to favorites!");
        return "redirect:/products/" + id;
    }
    
    // Forward example
    @GetMapping("/search")
    public String searchProducts(@RequestParam String query, Model model) {
        if (query.trim().isEmpty()) {
            return "forward:/products"; // Forward to list products
        }
        
        List<Product> products = productService.searchByName(query);
        model.addAttribute("products", products);
        model.addAttribute("query", query);
        
        return "products/search-results";
    }
}
```

## Resources
- [MVC Framework Introduction](https://www.geeksforgeeks.org/software-engineering/mvc-framework-introduction/)
- [Spring Web MVC](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring MVC Series](https://www.baeldung.com/spring-mvc)
- [Spring - MVC Framework](https://www.geeksforgeeks.org/springboot/spring-mvc-framework/)