# 04 - Browser Storage
- Web Storage, which can be accessed by using the `localStorage` and `sessionStorage` properties of the window object, is limited to 10 MiB of data maximum on all browsers.
- Browsers can store up to 5 MiB of local storage, and 5 MiB of session storage per origin.
- Once this limit is reached, browsers throw a `QuotaExceededError` exception which should be handled by using a `try...catch` block.

## Local Storage
1. Stores data permanently in the browser.
2. Data persists even after the user closes and reopens the browser.
3. The data stored inside the local storage is per-origin.
4. The computer will delete the `localStorage` object’s content in the following instances only:
	1. When the content gets cleared through JavaScript
	2. When the browser’s cache gets cleared
5. Suitable for storing user preferences, themes, tokens, etc.
6. There are inconsistencies with how browsers handle the local storage of documents not served from a web server (for instance, pages with a file: URL scheme). Therefore, the `localStorage` object may behave differently among browsers when used with non-HTTP URLs, such as `file:///document/on/users/local/system.html`.

```ts
// Store data
localStorage.setItem('username', 'JohnDoe');
// Retrieve data
const user = localStorage.getItem('username');
// Remove data
localStorage.removeItem('username');
// Clear all data
localStorage.clear();
```

## Session Storage
1. Similar to Local Storage but data is stored only for the session.
2. The data stored inside the session storage is per-origin and per-instance.
3. Per-instance means per-window or per-tab. In other words, the `sessionStorage` object’s lifespan expires once users close the instance (window or tab).
4. Suitable for temporary storage like form data, filters, etc.

```ts
// Store data
sessionStorage.setItem('sessionID', 'ABC123');
// Retrieve data
const sessionID = sessionStorage.getItem('sessionID');
// Remove data
sessionStorage.removeItem('sessionID');
// Clear all session storage
sessionStorage.clear();
```

## Cookies
1. Stores small amounts of data (usually 4KB).
2. Can have an expiration date (persistent cookies).
3. Can be accessed by both frontend and backend.
4. Cookies are sent with every HTTP request, which can impact performance.
5. Cookies do not have good support for running multiple instances of the same app. Such an attempt can cause errors such as double entry of bookings.
6. Suitable for authentication tokens, user sessions, and tracking data.

```ts
// Create a cookie (expires in 7 days)
document.cookie = "username=JohnDoe; expires=" + new Date(2025, 0, 1).toUTCString();
// Retrieve cookies
console.log(document.cookie);
// Delete a cookie (set expiration in the past)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
```

## `IndexedDB`
1. A NoSQL database built into the browser.
2. Used for storing large amounts of structured data.
3. Supports transactions, indexing, and queries.
4. It is more complex than Local Storage and requires event-based handling.
5. Suitable for storing offline data, caching, and complex data.

```ts
const request = indexedDB.open('MyDatabase', 1);

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened successfully', db);
};

request.onerror = (event) => {
  console.error('Database error:', event.target.error);
};
```

## When to Use Which Storage?
|   Storage Type  |  Persists After Browser Close? |           Size Limit           |              Use Case              |
|:---------------:|:------------------------------:|:------------------------------:|:----------------------------------:|
| Local Storage   | ✅ Yes                          | 5-10MB                         | User settings, theme, JWT tokens   |
| Session Storage | ❌ No (Cleared when tab closes) | 5MB                            | Temporary data like search filters |
| Cookies         | ✅ Yes (If set with expiration) | 4KB                            | Authentication, tracking data      |
| IndexedDB       | ✅ Yes                          | Unlimited (depends on browser) | Caching, large datasets            |
