# Topic: `RxJs` Observables

# Introduction
- Observable is a function that can return a stream of values to an Observer over time, either synchronously or asynchronously.
- Observables do not start emitting values until they are subscribed to. This is known as lazy execution.
- They are not like Event emitters, or promises, but like functions. They only execute when they are called, *i.e.* they are subscribed.

## Characteristics of Observables
- **Lazy Execution:** Observables do not start emitting values until they are subscribed to. This means the producer of the values (the Observable) waits until a consumer (the Observer, or subscriber) is ready to receive the values.
- **Multiple Values Over Time:** Unlike Promises, which can only handle a single value, Observables can emit multiple values over time. This makes them well-suited for handling streams of data such as user inputs, sensor readings, or real-time data.
- **Unsubscription:** Observables support unsubscription, allowing you to cancel the subscription when you no longer need the data. This helps in managing resources and preventing memory leaks.

## Benefits over Promises
- Promises can handle only a single value or a single event. Best suited for one-time asynchronous operations like HTTP requests. Observables can emit multiple values over time, and suitable for scenarios where needed to handle a series of events.
- Promises execute immediately when created, regardless of whether there is a consumer waiting for the result. Observables don’t start emitting values until they are subscribed to.
- Once a Promise is initiated, it will run to completion. Observables can be cancelled by unsubscribing them.
- RxJS provides extensive set of operators for Observables, which are not available for Promises.

## Benefits of Using Observables
- **Composability:** rich set of operators to compose complex asynchronous tasks in a readable and maintainable way.
- **Declarative Code:** Observables allow to write code that describes what should happen with the data, rather than how to achieve it step by step.
- **Resource Management:** Subscriptions can be easily managed and cleaned up, reducing the risk of memory leaks.

## Common Use Cases
- **Handling User Inputs:** Reacting to user actions like clicks, keystrokes, or form inputs.
- **HTTP Requests:** Managing asynchronous HTTP requests and responses.
- **Real-Time Data:** Processing data streams such as WebSocket messages or server-sent events.
- **Timers and Intervals:** Creating timers or intervals that emit values over time.

# Key Concepts

## Core Components of an Observable
- **Observable:** Represents the idea of an invokable collection of future values or events.
- **Observer:** An object with callback methods that receive notifications from the Observable.
- **Subscription:** Represents the execution of an Observable and is primarily useful for canceling the execution.
- **Operators:** Functions that enable complex asynchronous code to be easily composed in a functional manner.
- **Subject:** A special type of Observable that allows values to be multicasted to multiple Observers.

## Observable Lifecycle
The Observable instance passes through these four stages throughout its lifetime:
1. Creation
2. Subscription
3. Execution
4. Destruction

## Creating Observables
```js
let obs = new Observable(subscriber => {
    try {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.complete();
    } catch (err) {
        subscriber.error(err);
    }
});
```

## Subscribing to Observables
```js
obs.subscribe({next(value) {
    console.log("Value: " + value);
}, error(err) {
    console.error("Error " + err);
}, complete() {
    console.log("Complete");
}});
```
- `subscribe` calls are not shared among multiple Observers of the same Observable.
- Each call to `obs.subscribe` triggers its own independent setup for that given subscriber.
- Subscribing to an Observable is like calling a function, providing callbacks where the data will be delivered to.
- A subscribe call is simply a way to start an ”Observable execution” and deliver values or events to an Observer of that execution.

## Executing Observables
- Observable execution is a lazy computation that only happens for each Observer that subscribes.
- The execution produces multiple values over time, either synchronously or asynchronously.
- Three types of values an Observable Execution can deliver:
    - ”Next” notification: sends a value.
    - ”Error” notification: sends a JavaScript Error or exception.
    - ”Complete” notification: does not send a value.
- ”Next” notifications are the most important and most common type. They represent actual data being delivered to a subscriber.
- ”Error” and ”Complete” notifications may happen only once during the Observable Execution, and there can only be either one of them.
- In an Observable Execution, zero to infinite Next notifications may be delivered. If either an Error or Complete notification is delivered, then nothing else can be
delivered afterwards.

### Synchronous Execution
```js
let obs = new Observable(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
});

console.log("Before");
obs.subscribe({next(value) {
    console.log("Value: " + value);
}});
console.log("After");
```
**Output:**
```
Before
Value: 1
Value: 2
Value: 3
After
```

### Asynchronous Execution
```js
console.log('Fetching data');
from(this.http.get<Joke>("https://v2.jokeapi.dev/joke/Any")).subscribe({
    next: (response) => {
        console.log('Received Data: ', response);
    },
    complete: () => console.log('Completed fetching data'),
    error: (err) => console.error('Error fetching data:', err)
});
console.log('Data fetching completed');
```
**Output:**
```
Fetching data
Data fetching completed
Received Data: {error: false,...}
Completed fetching data
```

## Destroying Observables
- When observable.subscribe is called, the Observer gets attached to the newly created Observable execution.
- Calling unsubscribe() cancels the execution.
```js
const subscription = obs.subscribe((x) => console.log(x));
subscription.unsubscribe();
```

# Operators in RxJS
- Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.
- They are functions.
- Two kinds of operators:
    1. Pipeable Operators
    2. Creation Operators

## Pipeable Operators
- These are the kind that can be piped to Observables using the syntax `observableInstance.pipe(operator)`.
- When they are called, they do not change the existing Observable instance. Instead, they return a new Observable, whose subscription logic is based on the first Observable.
- Subscribing to the output Observable will also subscribe to the input Observable.
```js
of(1,2,1000).pipe(
    map(x => x*x),
    map(x => x-9),
    filter(x => x>5)
).subscribe({next(value) {
    console.log("Value: " + value);
}});
```
**Output:**
```
Value: 999991
```

## Creation Operators
- These are the other kind of operator, which can be called as standalone functions to create a new Observable.

### `of`
Converts the arguments to an observable sequence.
```js
const obs = of(1,2,3);
```

### `from`
Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.
```js
const obs = from([1,2,3]);
```

## Join Creation Operators
These are Observable creation operators that also have join functionality.

### `combineLatest`
Combines multiple Observables to create an Observable whose values are calculated from the latest values of each of its input Observables.
```js
combineLatest([
    timer(0, 1000),
    timer(250, 1000),
    timer(750, 1000)
]).subscribe({next(value) {
    console.log("Value: " + value);
}});
```
**Output:**
```
Value: 0,0,0
Value: 1,0,0
Value: 1,1,0
Value: 1,1,1
.
.
.
```

### `zip`
Combines multiple Observables to create an Observable whose values are calculated from the values, in order, of each of its input Observables.
```js
zip(
    of(1,2,3),
    of('a', 'b', 'c'),
    of(true, true, false)
).subscribe({next(value) {
    console.log("Value: " + value);
}});
```
**Output:**
```
Value: 1,a,true
Value: 2,b,true
Value: 3,c,false
```

## Transformation Operators

### `map`
Applies a given function to each value emitted by the source Observable, and emits the resulting values as an Observable.
```js
let obs = of(1,2,3);
obs.pipe(
    map(x => x*x),
).subscribe({next(value) {
    console.log("Value: " + value);
}});
```
**Output:**
```
Value: 1
Value: 4
Value: 9
```

### `concatMap`
Used to map each value emitted by a source observable to an inner observable, and then it flattens these inner observables in the order they are emitted.
```js
anotherObs(num: number) {
    return of(`Value is ${num}`).pipe(delay(1000));
}
of(1,2,3).pipe(
    concatMap(num => this.anotherObs(num))).subscribe({
        next(value) {
            console.log("Value: " + value);
        }
    }
);
```
**Output:**
```
Value: Value is 1
Value: Value is 2
Value: Value is 3
```

## More Operators
- Filtering Operators
- Join Operators
- Multicasting Operators
- Error Handling Operators
- Utility Operators
- Conditional and Boolean Operators
- Mathematical and Aggregate Operators

# Cold Observables
- A cold observable is one where the data stream starts producing values only after a subscription is made.
- Analogous to ”on-demand” data sources.
- Every time a new subscriber joins, a new instance of the observable is created, and the observable starts emitting values from the beginning.

# Hot Observables
- A hot observable starts producing values even before any subscription is made.
- The observable emits values continuously, and subscribers will receive the values from the observable at the point in time when they subscribe.
- This is similar to a live broadcast.

# Subjects
- Plain Observables are unicast i.e. each subscribed Observer owns an independent execution of the Observable.
- Subject is a special type of Observable that allows values to be multicasted to many Observers.
- Every Subject is an Observable. Internally to the Subject, subscribe does not invoke a new execution that delivers values. It simply registers the given Observer in a list of Observers.
- Every Subject is an Observer, since it can subscribe to another observable.
```js
const subject = new Subject<number>();
subject.subscribe({
    next: (v) => console.log(`observerA: ${v}`)
});
subject.subscribe({
    next: (v) => console.log(`observerB: ${v}`)
});

subject.next(Math.ceil(Math.random() * 100));

interval(1000).pipe(take(3)).subscribe(subject);
```
**Output:**
```
observerA: 27
observerB: 27
observerA: 0
observerB: 0
observerA: 1
observerB: 1
observerA: 2
observerB: 2
```