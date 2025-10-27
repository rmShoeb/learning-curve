# 06 - Routing
- Routing helps to change what the user sees in a single-page app.
- It helps to change the view by showing or hiding portions of the display that correspond to particular components, rather than going out to the server to get a new page.

## Angular Routing
- The `Router` enables navigation by interpreting a browser URL as an instruction to change the view.
- `<base href="/">` in the `<head>` of the `index.html` file assumes that the app folder is the application root, and uses `"/"`.

### Defining basic routes

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};

// app.routes.ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent, title: 'First component', },
  {
    path: 'second-component',
    component: SecondComponent,
    children: [
      { path: 'child-a', component: ChildAComponent },
    ]
  },
  // Componentless Routes
  {
   path: 'parent/:id',
   children: [
     { path: 'a', component: MainChild },
     { path: 'b', component: AuxChild, outlet: 'aux' }
   ]
  },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect
  { path: '**', component: PageNotFoundComponent } // wild-card route
];

// app.html
<a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a>
<a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a>
<router-outlet/>

// app.component.ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

### Route Order
- The order of routes is important because the `Router` uses a first-match wins strategy when matching routes, so more specific routes should be placed above less specific routes.
- List routes with a static path first, followed by an empty path route, which matches the default route.
- The wildcard route comes last because it matches every URL and the `Router` selects it only if no other routes match first.

### Lazy Loading

```ts
const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./lazy.component').then(c => c.LazyComponent)
  }
];
```

### Passing Parameters

#### Passing Path Parameters
- Use Case: Fetching product details using `id`.

```ts
// define route
const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent }
];
// navigate
<a [routerLink]="['/product', 101]">View Product 101</a> // this is displayed as "/product/101" in URL
// get the value
constructor(private route: ActivatedRoute) {}
ngOnInit() {
  this.productId = this.route.snapshot.paramMap.get('id');
}
```

#### Passing Query Parameters
- Use Case: Filtering a list of items based on category.

```ts
// navigate
this.router.navigate(['/product'], { queryParams: { id: 101 } }); // this is displayed as "/product?id=101&&name=riyad" in URL
// get value
constructor(private route: ActivatedRoute) {}
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    console.log(params['id']); // 101
  });
}
```

#### Passing Data Using the Navigation Extras Object
- Use Case: Passing sensitive data
- Navigation state allows passing non-URL data between components, but this data is lost on page refresh.

```ts
// navigate
this.router.navigate(['/checkout'], { state: { totalPrice: 2500, discount: 10 } }); // // this is displayed as "/checkout" in URL
// get value
constructor() {
  this.checkoutData = window.history.state;
  console.log(this.checkoutData.totalPrice); // 2500
  console.log(this.checkoutData.discount); // 10
}
```

#### Passing Data via Route Resolver
- Use Case: Fetching data before loading a component's view.

```ts
// create resolver service
@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  resolve(): Observable<any> {
    return of({ name: 'John Doe', age: 30 }); // Simulated API call
  }
}
// add resolver to route
const routes: Routes = [
  { path: 'profile', component: ProfileComponent, resolve: { user: UserResolver } }
];
// get data
constructor(private route: ActivatedRoute) {}
ngOnInit() {
  this.route.data.subscribe(data => {
    this.userData = data['user'];
    console.log(this.userData.name);
  });
}
```

## UI-Router
- A client-side router updates the browser URL as the user navigates through the single page app.
- Changes to the browser’s URL can drive navigation of the app, enabling a user to create deep-links (i.e., bookmarks) to areas deep within the application.
- Unlike Angular Router, which is URL-driven, UI-Router is state-driven.
- Uses state-based navigation instead of path-based routing.
- Allows nested and parallel views (multiple router outlets).

### States
- Each feature of an application is defined as a state.
- One state is active at any time, and UI-Router manages the transitions between the states.
- Each state describes the URL, the UI, data prerequisites, and other logical prerequisites for a feature.
- Before activating a state, UI-Router first fetches any prerequisites (asynchronously), and then activates the view/s and updates the URL.
- UI-Router states are hierarchical; states can be nested inside other states, forming a tree.
- Child states may inherit data and behavior (such as authentication) from their parent states.

#### State Properties
- `name`: A name for the state, providing a way to refer to the state
- `views`: How the UI will look and behave
- `url`: What the browser’s URL will be
- `params`: Parameter values that the state requires (such as blog-post-id)
- `resolve`: The actual data the state requires (often fetched, asynchronously, from the backend using a parameter value)

### Views
- A state defines a feature’s UI using a view, or multiple views.
- A view is a UI component, which is placed into a viewport (<ui-view>) when the state is activated.
- Views can be nested inside other views. A parent state’s view can create a viewport (<ui-view>), and an nested state can fill that viewport with their own view when activated.

```ts
var state = {
  name: 'home',
  component: HomeComponent
}
```

### URLs
- A state can define a URL, but it isn’t required.
- If a state has defined a URL, the browser’s location is updated to that URL when the state is active.
- A state’s URL is actually a URL fragment. Each state defines only the fragment of the URL that it “owns”. That fragment is appended to the parent state’s url in the browser URL when the nested state is active.

### Parameters
- When a state needs specific data, a parameter may be defined.
- Parameters can be defined in three locations:
	- Path: in the URL's path: `/foo/{fooId}` matches `123` in `http://mysite.com/foo/123`
	- Query: in the URL's query string: `/foo?fooId` matches `123` in `http://mysite.com/foo?fooId=123`
	- Non-url: arbitrary parameter data may be passed programmatically, and not reflect in the URL

### Resolve Data
- A feature often requires that some data be fetched from a server-side API. Often, that data is represented as an ID in a `url` parameter.
- The resolve mechanism allows the required to be fetched before rendering the view.
- If any of the resolve promises are rejected (perhaps due to a 401, 404, or 500 server response from a REST API), then the transition’s promise is rejected and the error hooks are invoked.
- This enables robust error handling for applications, and helps to avoid leaving the application in an inconsistent state.
- The resolve process is asynchronous. If a resolve returns a Promise, the transition is suspended until the promise is settled.
- Resolve data is made available to the views, as well as transition hooks.

### Transitions
- Transitions between states are transaction-like, i.e., they either completely succeed or completely fail.
- UI-Router provides a `Transition` object which represents a transition.
- A transition occurs any time the application state changes, or when any parameter values change.
- When a parent state is active and the user navigates to a child state, a Transition from the parent state to the child starts. Because the parent state was already entered, it is not entered a second time. Instead, the parent state is retained. The child state then becomes the active state.
- A transition will either fully succeed, or fail entirely. (Atomicity)
- Although transitions may take a long time to process, the current state remains unchanged until after the transition succeeds.

![UI Router Transition](/assets/images/angular-ui-router-transition.png)

## Resources
- https://angular.dev/guide/routing
- https://ui-router.github.io/guide/