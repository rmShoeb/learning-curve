# REST API Conventions

## Introduction

- REST is an acronym for `REpresentational State Transfer` and an architectural style for distributed hypermedia systems.
- It has become one of the most widely used approaches for building web-based APIs (Application Programming Interfaces).
- It is not a protocol or a standard, it is an architectural style.
- It is based on some constraints and principles that promote simplicity, scalability, and statelessness in the design.
- A Web API (or Web Service) conforming to the REST architectural style is called a REST API (or RESTful API).
- Like the other architectural styles, REST also has its guiding principles and constraints. These principles must be satisfied if a service interface is to be referred to as RESTful.

## 6 Guiding Principles of REST

### Uniform Interface

- By applying the [principle of generality](https://www.d.umn.edu/~gshute/softeng/principles.html) to the components interface, we can simplify the overall system architecture and improve the visibility of interactions.
- The following four constraints can achieve a uniform REST interface:
	- **Identification of resources**
        – The interface must uniquely identify each resource involved in the interaction between the client and the server.
	- **Manipulation of resources through representations**
        – The resources should have uniform representations in the server response.
        - API consumers should use these representations to modify the resource state in the server.
	- **Self-descriptive messages**
        – Each resource representation should carry enough information to describe how to process the message.
        - It should also provide information on the additional actions that the client can perform on the resource.
	- **Hypermedia as the engine of application state**
        – The client should have only the initial URI of the application.
        The client application should dynamically drive all other resources and interactions with the use of hyperlinks.
- For example, the HTTP-based REST APIs make use of the standard `HTTP` methods (`GET`, `POST`, `PUT`, `DELETE`, etc.) and the URIs (Uniform Resource Identifiers) to identify resources.

### Client-Server

- This design pattern enforces the separation of concerns, which helps the client and the server components evolve independently.
- By separating the user interface concerns (client) from the data storage concerns (server), we improve the portability of the user interface across multiple platforms and improve scalability by simplifying the server components.
- While the client and the server evolve, we have to make sure that the interface/contract between the client and the server does not break.

### Stateless

- It mandates that each request from the client to the server must contain all of the information necessary to understand and complete the request.
- The server cannot take advantage of any previously stored context information on the server.
- For this reason, the client application must entirely keep the session state.
- This is typically achieved through JWT-based authentication.

### Cacheable

- This constraint requires that a response should implicitly or explicitly label itself as cacheable or non-cacheable.
- If the response is cacheable, the client application gets the right to reuse the response data later for equivalent requests and a specified period.
- This is achieved through setting caching headers in server response.

### Layered System

- This allows an architecture to be composed of hierarchical layers by constraining component behavior.
- In a layered system, each component cannot see beyond the immediate layer they are interacting with.
- Example of a layered system is the MVC pattern. It allows for a clear separation of concerns, making it easier to develop, maintain, and scale the application.

### Code on Demand (*Optional*)

- REST also allows client functionality to be extended by downloading and executing code in the form of applets or scripts.
- The downloaded code simplifies clients by reducing the number of features required to be pre-implemented.
- Servers can provide part of the features delivered to the client in the form of code, and the client only needs to execute the code.
- Since this is optional, most REST APIs do not implement this.

## HTTP Methods

- REST APIs enable us to develop all kinds of web applications having all possible CRUD (create, retrieve, update, delete) operations.
- [REST guidelines](https://restfulapi.net/rest-architectural-constraints/) suggest using a specific HTTP method on a particular type of call made to the server.
- Though technically it is possible to violate this guideline, yet it is highly discouraged.

### `GET`

- Use `GET` requests to retrieve resource representation/information only, and not modify it in any way.
- As `GET` requests do not change the resource’s state, these are said to be safe methods.
- `GET` APIs should be idempotent. Making multiple identical requests must produce the same result every time until another API (`POST` or `PUT`) has changed the state of the resource on the server.
- If the Request-URI refers to a data-producing process, it is the produced data that shall be returned as the entity in the response and not the source text of the process, unless that text happens to be the output of the process.
- For any given HTTP `GET` API, if the resource is found on the server, then it must return HTTP response code `200 (OK)`, along with the response body.
- In case the resource is NOT found on the server then API must return HTTP response code `404 (NOT FOUND)`.
- If it is determined that the GET request itself is not correctly formed then the server will return the HTTP response code `400 (BAD REQUEST)`.

### `POST` 

- `POST` methods are used to create a new resource into the collection of resources.
- Responses to this method are not cacheable unless the response includes appropriate Cache-Control or Expires header fields.
- `POST` is neither safe nor idempotent, and invoking two identical `POST` requests will result in two different resources containing the same information (except resource ids).
- Ideally, if a resource has been created on the origin server, the response should be HTTP response code `201 (Created)`, and contain an entity that describes the status of the request and refers to the new resource, and a Location header.
- Many times, the action performed by the `POST` method might not result in a resource that can be identified by a URI. In this case, either HTTP response code `200 (OK)` or `204 (No Content)` is the appropriate response status.

### `PUT`

- `PUT` APIs are primarily used to update an existing resource.
- If the resource does not exist, then API may decide to create a new resource or not.
- If the request passes through a cache and the Request-URI identifies one or more currently cached entities, those entries should be treated as stale.
- Responses to PUT method are not cacheable.
- If a new resource has been created by the `PUT` API, the origin server must inform the user agent via the HTTP response code `201 (Created)` response.
- If an existing resource is modified, either the `200 (OK)` or `204 (No Content)` response codes should be sent to indicate successful completion of the request.
- The difference between the `POST` and `PUT` APIs can be observed in request URIs.
- `POST` requests are made on resource collections, whereas `PUT` requests are made on a single resource.

### `PATCH`

- `PATCH` requests are to make a partial update on a resource.
- Support for `PATCH` in browsers, servers, and web application frameworks is not universal.
- Request payload of a `PATCH` request is not straightforward as it is for a PUT request.
- The `PATCH` method is not a replacement for the `POST` or `PUT` methods. It applies a delta (diff) rather than replacing the entire resource.

### `DELETE`

- `DELETE` APIs delete the resources (identified by the Request-URI).
- `DELETE` operations are idempotent. If we `DELETE` a resource, it’s removed from the collection of resources.
- Some may argue that it makes the `DELETE` method non-idempotent. It’s a matter of discussion and personal opinion.
- If the request passes through a cache and the Request-URI identifies one or more currently cached entities, those entries should be treated as stale.
- Responses to this method are not cacheable.
- A successful response of `DELETE` requests should be an HTTP response code `200 (OK)` if the response includes an entity describing the status.
- The status should be `202 (Accepted)` if the action has been queued.
- The status should be `204 (No Content)` if the action has been performed but the response does not include an entity.
- Repeatedly calling `DELETE` API on that resource will not change the outcome.
- However, calling `DELETE` on a resource a second time will return a `404 (NOT FOUND)` since it was already removed.

## Status Codes and Responses

- REST APIs use the Status-Line part of an HTTP response message to inform clients of their request’s overarching result.
- [RFC 2616](https://www.ietf.org/rfc/rfc2616.txt) defines the [Status-Line syntax](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1).
- HTTP defines these standard status codes that can be used to convey the results of a client’s request. The status codes are divided into five categories.

### [1xx: Informational](https://restfulapi.net/http-status-codes/#1xx)

- Communicates transfer protocol-level information.
- `100 Continue`: Indicates to the client that the initial part of the request has been received and has not yet been rejected by the server.
- Others: `101 Switching Protocol`, `102 Processing (WebDAV)`, `103 Early Hints`.

### [2xx: Success](https://restfulapi.net/http-status-codes/#2xx)

- Indicates that the client’s request was accepted successfully.
- `200 OK`: Indicates that the request has succeeded.
- `201 Created`: Indicates that the request has succeeded and a new resource has been created as a result.
- `202 Accepted`: Indicates that the request has been received but not completed yet. It is typically used in log running requests and batch processing.
- `204 No Content`: The server has fulfilled the request but does not need to return a response body. The server may return the updated meta information.
- Others: `203 Non-Authoritative Information`, `205 Reset Content`, `206 Partial Content`, `207 Multi-Status (WebDAV)`, `208 Already Reported (WebDAV)`, `226 IM Used`.

### [3xx: Redirection](https://restfulapi.net/http-status-codes/#3xx)

- Indicates that the client must take some additional action in order to complete their request.
- `301 Moved Permanently`: The URL of the requested resource has been changed permanently. The new URL is given by the `Location` header field in the response. This response is cacheable unless indicated otherwise.
- `302 Found`: The URL of the requested resource has been changed temporarily. The new URL is given by the Location field in the response. This response is only cacheable if indicated by a `Cache-Control` or `Expires` header field.
- `304 Not Modified`: Indicates the client that the response has not been modified, so the client can continue to use the same cached version of the response.
- Others: `300 Multiple Choices`, `303 See Other`, `305 Use Proxy (Deprecated)`, `306 (reserved status code, and Unused)`, `307 Temporary Redirect, 308 Permanent Redirect (experimental)`.

### [4xx: Client Error](https://restfulapi.net/http-status-codes/#4xx)

- This category of error status codes points the finger at clients.
- `400 Bad Request`: The server could not understand the request due to incorrect syntax. The client should NOT repeat the request without modifications.
- `401 Unauthorized`: Indicates that the request requires user authentication information. The client MAY repeat the request with a suitable Authorization header field.
- `403 Forbidden`: Unauthorized request. The client does not have access rights to the content. Unlike 401, the client’s identity is known to the server.
- `404 Not Found`: The server can not find the requested resource.
- `405 Method Not Allowed`: The server knows the request HTTP method, but it has been disabled and cannot be used for that resource.
- `409 Conflict`: The request could not be completed due to a conflict with the current state of the resource.
- `422 Unprocessable Entity (WebDAV)`: The server understands the content type and syntax of the request entity, but it is still unable to process the request for some reason.
- `429 Too Many Requests`: The user has sent too many requests in a given amount of time (“rate limiting”).
- Some others are `406 Not Acceptable`, `408 Request Timeout`, `412 Precondition Failed`, `413 Request Entity Too Large`, `418 I’m a teapot`, `426 Upgrade Required`, etc.

### [5xx: Server Error](https://restfulapi.net/http-status-codes/#5xx)

- The server takes responsibility for these error status codes.
- `500 Internal Server Error`: The server encountered an unexpected condition that prevented it from fulfilling the request.
- `501 Not Implemented`: The HTTP method is not supported by the server and cannot be handled.
- `502 Bad Gateway`: The server got an invalid response while working as a gateway to get the response needed to handle the request.
- `503 Service Unavailable`: The server is not ready to handle the request.
- Some others are `504 Gateway Timeout`, `507 Insufficient Storage (WebDAV)`, `508 Loop Detected (WebDAV)`, `510 Not Extended`, `511 Network Authentication Required`, etc.

## Resources

- https://restfulapi.net/