# 05 - Basic Error Handling
- Even if an application has been thoroughly tested before deployment, it is always possible that the user may encounter errors.
- A web application cannot really “crash” like a desktop application, it remains open in the current browser tab, unresponsive.

## Error Types
1. Client Side Error
	1. Since JavaScript is single-threaded in the browser, it can happen that a part of the interface freezes and an action is not performed correctly.
	2. When we reference a non-existent variable.
	3. The value provided is not in the range of allowed values.
	4. When Interpreting syntactically invalid code
	5. When a value is not of the expected type
2. HTTP Error
	1. A request to the back end fails and the front end receives an error.
	2. Although in this case it is clear that the error is coming from the back end, there is a need to take care of the error handling for every single request to the back end.
It is better to handle these errors in a centralized location so that the user is presented with consistent error messages and also to avoid forgetting to intercept errors.

## Handling Errors in a Function

```ts
try {
  let result = JSON.parse("{invalidJson"); // This will throw an error
} catch (error) {
  console.error("Error parsing JSON:", error);
}
```

## Using `HttpInterceptor` for API Error Handling

```ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = `Error: ${error.status} - ${error.message}`;
        console.error(errorMessage);
        alert(errorMessage); // Show alert on error
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class AppModule {}
```

## Global Error Handler
- The default implementation of `ErrorHandler` prints error messages to the console.
- Whenever the  app throws an unhandled exception anywhere in the application angular intercepts that exception. It then invokes the method handleError(error) which writes the error messages to browser console.
- To intercept error handling, write a custom exception handler that replaces this default as appropriate.

```ts
class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    // do something with the exception
  }
}
// Provide in standalone apps
bootstrapApplication(AppComponent, {
  providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
})
// Provide in module-based apps
@NgModule({
  providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
})
class MyModule {}
```

## Resources
- https://www.pkief.com/blog/global-error-handling-in-angular
- https://angular.dev/api/core/ErrorHandler
- https://www.tektutorialshub.com/angular/error-handling-in-angular-applications/