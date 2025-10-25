# 08 - Security & Authentication

## Introduction to Spring Security
- Spring Security is a framework that provides authentication, authorization, and protection against common attacks.
- It requires a Java 17 or higher Runtime Environment.

![How Security is set up in web applications](https://miro.medium.com/v2/resize:fit:720/format:webp/1*pWDGs1c3Nf2ANQnGOODMrQ.jpeg)
*How Security is set up in web applications*

- It is the middleware, which is executed before the code that executes the business logic of any particular endpoint.
- There are two things that are done on the middleware level: Authentication and Authorization.
- The role of middleware is typically performed by Servlet Filters, that are invoked before the Servlet, in the case with Spring Web: `DispatcherServlet`.

### The Security Filter Chain
![How Spring Security Works](https://miro.medium.com/v2/resize:fit:720/format:webp/1*w5eOljVpr3PxYass9PFS-w.jpeg)
*How Spring Security Works*

- Spring Security maintains a filter chain internally where each of the filters has a particular responsibility and filters are added or removed from the configuration depending on which services are required.
- It registers the Servlet filter of type `FilterChainProxy`, which allows Spring Security to implement its own filter mechanism with more granular control.
- Default Spring Security filter chain consists of many filters, but their purpose can be divided into a couple of categories:
    - **Authentication filters** - responsible for the creation of the authenticated object of the Authentication implementation and setting it into the `SecurityContext`.
    - **AuthorizationFilter** - responsible for deciding if the user can perform certain action based on the data in the Authentication.
    - **Other filters** - attack-protection (*e.g.*, `CsrfFilter`), exception mapping (*e.g.*, `ExceptionTranslationFilter`), etc.
- When setting up Spring Security, most of the time, we need to implement the logic of authentication only.
- By default, Spring Security applies basic security to all HTTP endpoints.

### CSRF Protection:
- Protection against Cross-Site Request Forgery attacks, where an attacker tricks a user into performing actions they didn't intend to.
- Spring Security includes CSRF protection by default, requiring a unique token to be sent with each HTTP request that modifies state.

### Customizing Security Configuration
- `WebSecurityConfigurerAdapter` is the base class that provides a convenient way to configure Spring Security for our application.
- By extending `WebSecurityConfigurerAdapter`, we can override methods to customize security settings such as authentication, authorization, and HTTP security.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // In-memory authentication with hardcoded users
        // In a production application, we would typically fetch user details from a database
        auth.inMemoryAuthentication()
            .withUser("user").password("password").roles("USER")
            .and()
            .withUser("admin").password("admin").roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Configuring which endpoints are secured and which are public
        // http.csrf().disable() will disable CRSF protection
        http.authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN") // Only accessible by users with the ADMIN role.
            .antMatchers("/user/**").hasRole("USER") // Only accessible by users with the USER role.
            .antMatchers("/").permitAll()
            .and().formLogin() // Enables form-based login
            .loginPage("/my-login").permitAll();
        // By default, Spring Security provides a login page when form-based authentication is enabled.
        // Users are redirected to this login page if they try to access a secured endpoint.
    }
}
```

## Authentication: Verifying Identity
- Authentication is how we verify the identity of who is trying to access a particular resource.
- A common way to authenticate users is by requiring the user to enter a username and password.
- Once authentication is performed we know the identity and can perform authorization.
- In case a particular API requires authentication and the information in the request is not sufficient or not valid to determine who the user is, the system typically denies the further processing of the request and responds with the 401 Unauthorized status code.

### `SecurityContext` and `SecurityContextHolder`
- The `SecurityContext` is a container object that stores authentication and security-related information about the currently logged-in user.
- It holds an Authentication object, which represents the principal (the user) and the user's granted authorities (roles/permissions).
- It is typically stored in a thread-local variable to ensure that the security information is specific to the current thread.
- The `SecurityContextHolder` is a helper class that provides access to the `SecurityContext`.
- It is the central point for accessing the security information of the current user in Spring Security.
- By default, Spring Security uses a `ThreadLocalSecurityContextHolderStrategy`, which means the `SecurityContext` is tied to the current thread.

### `AuthenticationManager`
- The `AuthenticationManager` is the gateway for authentication requests in Spring Security.
- It acts as a conductor, orchestrating the authentication process by delegating the actual verification of user credentials to one or more `AuthenticationProvider` instances.
- It accepts an Authentication object as input and attempts to authenticate the user based on the credentials provided.
- On successful authentication, it returns a fully populated Authentication object, including details such as the principal and granted authorities.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // This method configures the authentication mechanism.
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService) // Sets the custom user details service
            .passwordEncoder(passwordEncoder());      // Sets the password encoder
    }

    // This exposes the AuthenticationManager as a Bean.
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```

### `UserDetailsService`
- It is used by `DaoAuthenticationProvider` for retrieving a username, a password, and other attributes for authenticating with a username and password.
- Its job is to load user-specific data from the database (or any other source) by username.

```java
@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Find the user entity from the database
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // 2. Map the user's roles to Spring Security's GrantedAuthority objects
        Set<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role))
            .collect(Collectors.toSet());

        // 3. Return a Spring Security User object
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
}
```

### `PasswordEncoder`
- Spring Security’s `PasswordEncoder` interface is used to perform an one-way transformation of a password to let the password be stored securely.
- Spring provides the following password encoders:
    - `Argon2PasswordEncoder`
    - `BCryptPasswordEncoder`
    - `Pbkdf2PasswordEncoder`
    - `SCryptPasswordEncoder`
    - `NoOpPasswordEncoder`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // This bean is responsible for encoding passwords.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### `AuthenticationProvider`
- It processes specific types of authentication.
- Its interface exposes only two functions:
    - authenticate performs authentication with the request.
    - supports checks if this provider supports the indicated authentication type.
- One important implementation of the interface that we are using in our sample project is `DaoAuthenticationProvider`, which retrieves user details from a `UserDetailsService`.

#### `DaoAuthenticationProvider`
- It is an `AuthenticationProvider` implementation that uses a `UserDetailsService` and `PasswordEncoder` to authenticate a username and password.

![DaoAuthenticationProvider Usage](https://docs.spring.io/spring-security/reference/_images/servlet/authentication/unpwd/daoauthenticationprovider.png)
*`DaoAuthenticationProvider` Usage*

- Spring Security's `UsernamePasswordAuthenticationFilter` intercepts the login request, which contains the user's plain-text username and password.
- The filter creates a `UsernamePasswordAuthenticationToken`. This is an object that holds the credentials before they have been verified.
- This token is passed to the `AuthenticationManager`, which in turn passes it to the `DaoAuthenticationProvider`.
- The `DaoAuthenticationProvider` calls the custom `UserDetailsService` using the username. This service fetches the user's data from the database, including their stored, hashed password.
- `DaoAuthenticationProvider` uses the `PasswordEncoder` to validate the password on the `UserDetails` returned in the previous step.
- If authentication is successful, a fully authenticated token is created and stored in the `SecurityContextHolder`. Otherwise, a `BadCredentialsException` is thrown, and authentication fails.

## Spring Security With JWT for REST API

```java
@Component
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepo userRepo;

    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, UserRepo userRepo) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepo = userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        // Get authorization header and validate
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(header) || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // Get jwt token and validate
        final String token = header.split(" ")[1].trim();
        if (!jwtTokenUtil.validate(token)) {
            chain.doFilter(request, response);
            return;
        }

        // Get user identity and set it on the spring security context
        UserDetails userDetails = userRepo
            .findByUsername(jwtTokenUtil.getUsername(token))
            .orElse(null);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null,
                userDetails == null ? List.of() : userDetails.getAuthorities()
        );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(request, response);
    }

}

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private final JwtTokenFilter jwtTokenFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // other config

        // Set permissions on endpoints
        http.authorizeRequests()
            .antMatchers("/api/login").permitAll()
            .anyRequest().authenticated();

        // Add JWT token filter
        http.addFilterBefore(
            jwtTokenFilter,
            UsernamePasswordAuthenticationFilter.class // Processes an authentication form submission
        );
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            UserDetails user = (UserDetails) authenticate.getPrincipal();
            String token = jwtTokenUtil.generateToken(user);

            return ResponseEntity.ok(token);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
```

## Cross-Origin Resource Sharing
- For security reasons, browsers prohibit AJAX calls to resources outside the current origin.
- Cross-Origin Resource Sharing (CORS) is a [W3C specification](https://www.w3.org/TR/cors/) implemented by most browsers that lets us specify what kind of cross-domain requests are authorized.
- The CORS specification distinguishes between preflight, simple, and actual requests.

### `@CrossOrigin`
By default, `@CrossOrigin` allows:
- All origins.
- All headers.
- All HTTP methods to which the controller method is mapped.

```java
@RestController
@RequestMapping("/account")
@CrossOrigin(origins = "https://domain2.com", maxAge = 3600)
public class AccountController {

	@CrossOrigin // enables cross-origin requests on annotated controller methods
	@GetMapping("/{id}")
	public Account retrieve(@PathVariable Long id) {
		// ...
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable Long id) {
		// ...
	}
}
```

### Global Configuration
- By default, global configuration enables the following:
    - All origins.
    - All headers.
    - GET, HEAD, and POST methods.
- `allowCredentials` is not enabled by default, since that establishes a trust level that exposes sensitive user-specific information (such as cookies and CSRF tokens) and should only be used where appropriate.

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
			.allowedOrigins("https://domain2.com")
			.allowedMethods("PUT", "DELETE")
			.allowedHeaders("header1", "header2", "header3")
			.exposedHeaders("header1", "header2")
			.allowCredentials(true).maxAge(3600);

		// Add more mappings...
	}
}
```

## Cross Site Request Forgery (CSRF)
- Cross-Site Request Forgery (CSRF or XSRF) is an attack that tricks an authenticated user into unknowingly submitting a malicious request to a website they trust.
- The goal of a CSRF attack is to make the victim perform a state-changing action, such as changing their email address, deleting data, or transferring funds, without their consent.
- The attack works because the server cannot distinguish between a legitimate request initiated by the user and a forged request initiated by a malicious site.
- Spring provides two mechanisms to protect against CSRF attacks:
    - The Synchronizer Token Pattern. This is the predominant and most comprehensive way to protect against CSRF attacks.
    - Specifying the SameSite Attribute on the session cookie
- Spring recommends to use CSRF protection for any request that could be processed by a browser by normal users. Otherwise, it can be disabled.
- However, in stateless REST APIs (with JWT), CSRF protection is not necessary. Since these applications don't rely on session cookies, the browser has no session to automatically send, and the primary vector for CSRF attacks is removed. This is why we explicitly disable it in JWT configurations with `http.csrf().disable()`.

## Authorization: Enforcing Permissions
- It is the security mechanism checks WHAT action the user is trying to perform and if the user has the permission or AUTHORITY to do that particular action.
- If the particular action is not allowed for the user (usually, based on the user’s permissions or user’s role in the system), the system typically responds with the 403 Forbidden status code.
- Spring Security provides interceptors that control access to secure objects, such as method invocations or web requests.

![Authorize HttpServletRequest](https://docs.spring.io/spring-security/reference/_images/servlet/authorization/authorizationfilter.png)
*Authorize `HttpServletRequest`*

### Web Security Configuration
- Spring Security 6.0 introduced component-based security configuration using the `SecurityFilterChain`.
- This replaced the older adapter-based pattern using `WebSecurityConfigurerAdapter`.

#### Using SecurityFilterChain
- The `SecurityFilterChain` is responsible for configuring all the security aspects of the web application:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            ).formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            ).logout(logout -> logout
                .logoutSuccessUrl("/")
            );
        
        return http.build();
    }
}
```

#### URL Pattern Configuration
Spring Security offers several ways to match URL patterns:

1. **antMatchers** (legacy, pre-Spring Security 6.0):
```java
.antMatchers("/admin/**").hasRole("ADMIN")
.antMatchers("/public/**").permitAll()
```

2. **mvcMatchers** (legacy, pre-Spring Security 6.0):
```java
.mvcMatchers("/api/**").hasRole("API_USER")
```

3. **requestMatchers** (preferred in Spring Security 6.0+):
```java
.requestMatchers("/secured/**").authenticated()
.requestMatchers(HttpMethod.POST, "/api/**").hasRole("API_USER")
```

#### Role-based Access Control
Spring Security provides several methods to implement role-based security:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/basic/**").hasRole("USER") // Basic role-based access
            .requestMatchers("/advanced/**").hasAnyRole("ADMIN", "MANAGER") // Multiple roles (OR condition)
            .requestMatchers("/reports/**").hasAuthority("GENERATE_REPORTS") // Authority-based access (more granular than roles)
            .requestMatchers("/special/**") // Complex expressions
            .access(new WebExpressionAuthorizationManager(
                "hasRole('ADMIN') and hasIpAddress('192.168.1.0/24')")
            )
        );
        
        return http.build();
    }
}
```

#### Common Configuration Scenarios

1. **Basic Web Application**:

```java
@Bean
public SecurityFilterChain basicWebSecurity(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/", "/home", "/register").permitAll()
            .requestMatchers("/resources/**", "/static/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        ).formLogin(form -> form
            .loginPage("/login")
            .defaultSuccessUrl("/dashboard")
            .permitAll()
        ).logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/")
        );
    
    return http.build();
}
```

2. **REST API Security**:

```java
@Bean
public SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())  // Typically disabled for stateless APIs
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

3. **Resource Server Configuration**:

```java
@Bean
public SecurityFilterChain resourceServerSecurity(HttpSecurity http) throws Exception {
    http.oauth2ResourceServer(oauth2 ->
        oauth2.jwt(jwt ->jwt
                .jwtAuthenticationConverter(jwtAuthenticationConverter())
            )
        ).authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/api/**").authenticated()
        );
    
    return http.build();
}
```

### Method-Level Security
- Method security allows us to apply access control at the method level, providing more fine-grained security than URL-based security.
- To enable method security, use the `@EnableMethodSecurity` annotation (which replaces the older `@EnableGlobalMethodSecurity`).

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
    // Configuration class content
}
```

#### Using `@PreAuthorize`
- Evaluates access control expression before method execution
- Prevents unauthorized method invocation
- Supports SpEL (Spring Expression Language)

```java
@Service
public class UserService {
    // Basic role check
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Multiple roles
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void updateUser(User user) {
        userRepository.save(user);
    }

    // Using method parameters in security expression
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Complex conditions
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('USER_WRITE')")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
```

#### Using `@PostAuthorize`
- Evaluates access control expression after method execution.
- Can access the method's return value using the `returnObject` variable.
- Useful when authorization depends on the returned data.

```java
@Service
public class DocumentService {
    // Ensure user can only access their own documents
    @PostAuthorize("returnObject.owner == authentication.principal.username")
    public Document getDocument(Long documentId) {
        return documentRepository.findById(documentId);
    }

    // Combine with @PreAuthorize for comprehensive security
    @PreAuthorize("hasRole('USER')")
    @PostAuthorize("returnObject.status == 'PUBLIC' or returnObject.owner == authentication.name")
    public Document getDocumentWithPreCheck(Long id) {
        return documentRepository.findById(id);
    }
}
```

#### Using `@Secured`
- Simple role-based security
- Does not support SpEL
- Legacy approach, but still supported

```java
@Service
public class LegacyService {
    @Secured("ROLE_ADMIN")
    public void adminOnlyMethod() {
        // Only accessible by admins
    }

    @Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
    public void managementMethod() {
        // Accessible by both admins and managers
    }
}
```

#### Method Security Expressions
Spring Security provides several built-in expressions:

```java
@Service
public class SecurityExampleService {
    // Basic expressions
    @PreAuthorize("isAuthenticated()")
    public void authenticatedUsersOnly() {}

    @PreAuthorize("isAnonymous()")
    public void anonymousUsersOnly() {}

    // Role and authority checks
    @PreAuthorize("hasRole('ADMIN')")  // Checks for ROLE_ADMIN
    public void adminOnly() {}

    @PreAuthorize("hasAuthority('READ_PRIVILEGE')")
    public void withSpecificAuthority() {}

    // Logical operations
    @PreAuthorize("hasRole('ADMIN') and hasRole('DBA')")
    public void adminAndDba() {}

    // Using authentication object
    @PreAuthorize("authentication.principal.username == #username")
    public void checkOwnProfile(String username) {}
}
```

#### Custom Security Expressions
We can create custom security expressions by implementing a `MethodSecurityExpressionRoot`:

```java
public class CustomSecurityExpressionRoot extends SecurityExpressionRoot {
    private final UserRepository userRepository;

    public CustomSecurityExpressionRoot(Authentication authentication, UserRepository userRepository) {
        super(authentication);
        this.userRepository = userRepository;
    }

    public boolean isMemberOf(String groupName) {
        User user = userRepository.findByUsername(authentication.getName());
        return user.getGroups().contains(groupName);
    }

    public boolean hasHigherRankThan(String username) {
        User currentUser = userRepository.findByUsername(authentication.getName());
        User otherUser = userRepository.findByUsername(username);
        return currentUser.getRank() > otherUser.getRank();
    }
}

@Component
public class CustomMethodSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {
    @Autowired
    private UserRepository userRepository;

    @Override
    protected MethodSecurityExpressionOperations createSecurityExpressionRoot(Authentication auth) {
        return new CustomSecurityExpressionRoot(auth, userRepository);
    }
}

// Using custom expressions
@Service
public class CustomSecurityService {
    @PreAuthorize("isMemberOf('PREMIUM_GROUP')")
    public void premiumFeature() {
        // Only accessible by premium group members
    }

    @PreAuthorize("hasHigherRankThan(#username)")
    public void modifyUser(String username) {
        // Only accessible by users with higher rank
    }
}
```

### `AuthorizationManager`
- It is a modern Spring Security interface responsible for making a single authorization decision.
- It's the core component for determining if a user is permitted to access a resource in the current, component-based security configuration.
- These are called by Spring Security’s request-based, method-based, and message-based authorization components and are responsible for making final access control decisions.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Build an AuthorizationManager
        AuthorizationManager<RequestAuthorizationContext> customManager = (authentication, context) -> {
            boolean isAdmin = authentication.get().getAuthorities().stream().anyMatch(
                grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")
            );
            return new AuthorizationDecision(isAdmin);
        };

        http.authorizeHttpRequests(authorize -> 
            authorize
                .antMatchers("/admin/**").access(customManager) // Use a custom manager
                .antMatchers("/user/**").hasRole("USER")     // Use built-in helpers
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
```

## Resources
- [Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [Web Security](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-security.html)
- [Security with Spring Series](https://www.baeldung.com/security-spring)
- [Learn the basics of Spring Security](https://dev.to/isaactony/learn-the-basics-of-spring-security-50b7)
- [Spring Security Guide. Part 1: Introduction](https://medium.com/@ihor.polataiko/spring-security-guide-part-1-introduction-c2709ff1bd98)
- [Understanding SecurityContext and SecurityContextHolder in Spring Security](https://medium.com/@CodeWithTech/understanding-securitycontext-and-securitycontextholder-in-spring-security-e8ec9c030819)
- [Spring Security: Authentication Manager](https://www.javaguides.net/2024/04/spring-security-authentication-manager.html)
- [Spring Security With JWT for REST API](https://www.toptal.com/spring/spring-security-tutorial)
- [CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [Protection Against Exploits](https://docs.spring.io/spring-security/reference/features/exploits/index.html)
- [Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)