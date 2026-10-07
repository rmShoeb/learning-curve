# Static Analysis & Debugging Techniques

## Code Flow Tracing Strategies

### Mapping Entry Points and Bootstrapping Sequences
- In raw PHP applications, execution always begins at a specific file hit directly by the web server (or CLI script).

```
    [ Incoming HTTP Request ]
               │
               ▼
        ┌─────────────┐
        │ .htaccess / │ (URL Rewriting)
        │  Nginx.conf │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │  index.php  │ (Front Controller Entry)
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │  bootstrap  │ (Autoloaders, Configs, DB Singletons, Error Handlers)
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │ Router /    │ (URI Dispatching)
        │ Dispatcher  │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │ Controller  │ (Business Logic & Active Record DB Operations)
        └─────────────┘
```

#### Identify the Entry Point Pattern
- Raw PHP projects generally follow one of two execution entry models.
- Front Controller Pattern (Single Entry)
    - All requests redirect to a single file (usually `public/index.php` or `index.php`).
- Legacy Script-per-Page Pattern (Multi-Entry)
    - Every endpoint corresponds to a physical script (e.g., `api/get_user.php`, `api/update_order.php`).

#### Trace the Bootstrapping Order
- Regardless of entry model, locate the bootstrap sequence at the top of the file.
- Look for `require`, `require_once`, `include`, or `include_once` calls in the first lines.

### Tracing Dependencies and Singleton Instances

- In raw PHP codebases, dependency management relies on Singletons, Static Service Locators, or Registry Patterns rather than automated Dependency Injection containers like those found in Symfony or Laravel.

#### The Singleton Pattern
- Used to ensure a single shared instance (such as a database connection pool or configuration loader) exists across the entire request lifecycle.

#### The Global Registry / Service Locator
- Used in legacy systems to store global instances in an associative array or static container.

```php
class AppRegistry {
    private static array $services = [];

    public static function set(string $key, object $service): void {
        self::$services[$key] = $service;
    }

    public static function get(string $key): object {
        if (!isset(self::$services[$key])) {
            throw new Exception("Service {$key} not registered.");
        }
        return self::$services[$key];
    }
}

// Bootstrap initialization:
AppRegistry::set('db_writer', new PDO(...));
AppRegistry::set('db_reader', new PDO(...));

// Retrieval inside custom ORM:
$writer = AppRegistry::get('db_writer');
```

#### Globals Array Interception
- In older raw PHP applications, shared instances are stored directly inside PHP's native `$GLOBALS` superglobal array.

```php
// In bootstrap script:
$GLOBALS['db'] = new CustomDatabaseWrapper();

// Deep inside a model file:
function fetchUser(int $id) {
    global $db; // Pulls instance from $GLOBALS['db']
    // OR
    $db = $GLOBALS['db'];
    return $db->query("SELECT * FROM users WHERE id = {$id}");
}
```

### Locating Configurations and Environment Variables
- Configurations in raw PHP projects generally load through one of three mechanisms.
- Dotenv Parser Libraries (`vlucas/phpdotenv`)
    - If the project uses Composer, it likely parses a `.env` file into PHP's runtime environment (`$_ENV` and `getenv()`).
- Arrays Returning Configuration Files
    - Common in structured custom frameworks.
    - Configuration files in a config/ directory return PHP arrays directly.
- Legacy Constant Definitions
    - Found in older raw PHP applications.
    - Configurations are defined as global constants during the bootstrap phase.
