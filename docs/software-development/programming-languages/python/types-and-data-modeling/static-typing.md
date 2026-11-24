# Static Typing

- Python's typing system enables developers to document interfaces, catch domain bugs prior to deployment, and enforce structural or nominal contracts across large codebases.
- Modern static typing in Python relies on annotations that remain largely inert at runtime but provide static analysis tools like `mypy` and `pyright` the information required to prove type soundness.

## Core Typing Primitives

- Static type checkers evaluate programs by analyzing the constraints placed on values and variables.
- Python supplies several primitives to capture basic assumptions, optionality, literal values, and metadata.

### `Union` and the Pipe Operator

- The pipe syntax (`|`), introduced natively in Python 3.10, expresses that a value may belong to one of several distinct types.
- It supersedes the explicit `typing.Union` import while maintaining equivalent static semantics.
- In Python 3.7+, adding `from __future__ import annotations` at the very top of a module allows the use of `int | str` inside type annotations specifically, because it postpones evaluation of annotations into raw strings.
- However, outside of annotations, such as inside `isinstance()` checks or runtime type evaluation, `Union` remains required.

```python
# from 3.10
def parse_identifier(raw_value: int | str) -> str:
    """Normalizes an integer or string identifier into a formatted string."""
    if isinstance(raw_value, int):
        return f"ID-{raw_value:06d}"
    return raw_value.strip().upper()

# before 3.10
def parse_identifier(raw_value: Union[int, str]) -> str:
    ...
```

### `Optional`

- An optional value is an alias for a type unioned with None.
- Using `T | None` expresses that a function may fail to return a value or that an argument defaults to absence.
- Internally, `Optional[T]` is exactly equivalent to `Union[T, None]` (or `T | None` in modern syntax).
- It serves purely as syntactic sugar to communicate nullability clearly.

```python
from typing import Optional, Union

def find_user_email(user_id: int) -> str | None:
    """Fetches a user's email address by ID, returning None if nonexistent."""
    database_records: dict[int, str] = {1: "alice@example.com"}
    return database_records.get(user_id)

# These three expressions mean the exact same thing to a type checker:
a: Optional[str] = None
b: Union[str, None] = None
c: str | None = None
```

### `Any`

- It turns off static type checking for a given variable.
- Every type is compatible with `Any`, and `Any` is compatible with every type.
- Overusing `Any` creates blind spots.
- Static analysis cannot verify property access or call signatures on values typed as `Any`.

```python
from typing import Any

def deserialize_external_payload(blob: str) -> Any:
    """Parses untrusted JSON payloads into arbitrary Python objects."""
    import json
    return json.loads(blob)
```

### Callable

### `Literal`

- `Literal` limits a variable to one or more specific scalar values rather than broad primitive types like `str` or `int`.
- To extract the permitted values of a Literal at runtime (for example, to dynamically generate an error message), inspect its `__args__` attribute.
- Use `Enum` when creating a distinct domain model entity with identity, iteration needs, or attached behavior/methods.
- Use `Literal` for lightweight function arguments, file modes, or string flags where callers should pass plain values (e.g., `"r"`, `"json"`) without importing an Enum class.

```python
from typing import Literal

FileMode = Literal["r", "w", "a", "rb", "wb"]

def open_file_handler(path: str, mode: FileMode) -> None:
    """Simulates safe file opening constrained to allowed mode strings."""
    print(f"Opening {path} under mode {mode}")

open_file_handler("app.log", "r")      # Type checker passes
# open_file_handler("app.log", "truncate")  # Type checker flags an error

# This is illegal and raises an AttributeError:
# mode = FileMode.r 

# Literals require the raw scalar literal itself:
mode: FileMode = "r"

allowed_modes = FileMode.__args__  # ('r', 'w', 'a')
```

#### Difference Between `Enum` and `Literal`

| Dimension | Enum (`enum.Enum`) | Literal (`typing.Literal`) |
|---|---|---|
| Runtime existence | A real, instantiated Python class with runtime members, identity, and methods. | A type-hinting construct. Erased at runtime; does not create objects. |
| Data representation | Objects wrapped in the enum namespace (`Color.RED`). | Raw primitive values (`"red"`, `404`, `True`). |
| API serialization | Requires conversion (`member.value` or custom serializers) to convert to JSON/strings. | Zero serialization overhead; the value is already a plain string/number. |
| Namespace grouping | Grouped under a single class namespace. | Standalone type alias. |

### `Annotated`

- It attaches arbitrary runtime or static metadata to a type without modifying the base type for the checker.
- `Annotated` does not execute or enforce any validation on its own. Static checkers evaluate `Annotated[T, ...]` strictly as `T`.
- Libraries like Pydantic, FastAPI, and SQLAlchemy inspect the metadata inside `Annotated` to construct runtime validation rules or database schemas.
- Pydantic / FastAPI libraries parse metadata like `Annotated[int, Field(gt=0)]` and inject runtime validation logic.
- If external validation libraries are not used, a manual validation function or a descriptor/property is still required.

```python
from typing import Annotated

# Attaching validation or documentation constraints
PositiveInt = Annotated[int, "Constraint: value > 0"]
SqlColumn = Annotated[str, "SQL_MAPPING: VARCHAR(255) NOT NULL"]

x: PositiveInt = -50  # Python runs this without error!

def allocate_memory_buffer(block_size: PositiveInt) -> bytes:
    return bytes(block_size)
```

### `typing.Self`

- Introduced in Python 3.11, use `typing_extensions` for earlier versions.
- `Self` represents the enclosing class instance, preserving exact subclass types in method chaining patterns.
- Before `Self` was created, developers parameterized the class or method with a bound `TypeVar`.

```python
# Since 3.11
from typing import Self

class QueryBuilder:
    def __init__(self) -> None:
        self.clauses: list[str] = []

    def select(self, field: str) -> Self:
        self.clauses.append(f"SELECT {field}")
        return self

    def where(self, condition: str) -> Self:
        self.clauses.append(f"WHERE {condition}")
        return self

class AdvancedQueryBuilder(QueryBuilder):
    def paginate(self, limit: int) -> Self:
        self.clauses.append(f"LIMIT {limit}")
        return self

# The checker knows 'builder' preserves the subclass type throughout calls
builder = AdvancedQueryBuilder().select("name").paginate(10)

# before 3.11
from typing_extensions import Self

class Builder:
    def configure(self) -> Self:
        return self

# before Self was created
from typing import TypeVar

TBuilder = TypeVar("TBuilder", bound="Builder")

class Builder:
    def configure(self: TBuilder) -> TBuilder:
        return self
```

## Container Typing

- Modern Python uses built-in collections directly as generic type constructors.
- Abstract collections from `collections.abc` distinguish read-only data consumers from mutating operations.

### Standard Collections

```python
# Lists represent homogeneous sequences of variable size
user_ids: list[int] = [101, 102, 103]

# Dictionaries declare fixed key and value types
registry: dict[str, int] = {"alpha": 1, "beta": 2}

# Fixed-length tuples define typed heterogeneous records
coordinate: tuple[float, float, str] = (40.7128, -74.0060, "New York")

# Ellipsis (...) denotes arbitrary-length homogeneous tuples
readings: tuple[int, ...] = (10, 20, 30, 40, 50)
```

### Abstract Collections

```python
from collections.abc import Sequence, Mapping

def calculate_checksum(data: Sequence[int]) -> int:
    """Accepts any indexable sequence with a length (e.g., list, tuple, range)."""
    if not data:
        return 0
    return sum(data) % 256

def format_configuration(settings: Mapping[str, str]) -> list[str]:
    """Accepts any key-value mapping (dict, MappingProxyType, etc.)."""
    return [f"{key.upper()}={value}" for key, value in settings.items()]

# calculate_checksum works for both lists and tuples
calculate_checksum([1, 2, 3])
calculate_checksum((1, 2, 3))
```

## Subtyping & Interfaces:

### Nominal Subtyping

- It is inheritance based.
- Here, a class qualifies as a subtype only if it explicitly declares inheritance from an expected parent class.

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, recipient: str, body: str) -> bool:
        """Dispatches an alert to a target recipient."""
        pass

class EmailNotifier(Notifier):
    def send(self, recipient: str, body: str) -> bool:
        print(f"Sending email to {recipient}: {body}")
        return True

def notify_administrator(notifier: Notifier) -> None:
    notifier.send("admin@corp.internal", "System outage detected.")

notify_administrator(EmailNotifier())

# If an unrelated class defines a matching send() method but does not inherit from Notifier, nominal type checkers reject it.
```

### Structural subtyping

- It is shape based, using `typing.Protocol`.
- `Protocol` implements static duck typing.
- Any class whose attributes and methods match the signatures defined on a `Protocol` satisfies that protocol, regardless of its inheritance tree.


```python
from typing import Protocol

class Serializable(Protocol):
    def serialize(self) -> str:
        """Converts an internal representation into a string format."""
        ...

class DatabaseRecord:
    def __init__(self, record_id: int) -> None:
        self.record_id = record_id

    def serialize(self) -> str:
        return f'{{"id": {self.record_id}}}'

class ConfigurationSnapshot:
    def serialize(self) -> str:
        return "env=production;version=2.0"

def write_to_disk(target: Serializable) -> None:
    """Accepts any object conforming to the Serializable structure."""
    payload = target.serialize()
    print(f"Persisted: {payload}")

# Both classes pass inspection without inheriting from Serializable
write_to_disk(DatabaseRecord(42))
write_to_disk(ConfigurationSnapshot())
```

## Generics & Polymorphism:

### `TypeVar`

- `Any` abandons type checking entirely. It tells the analyzer, "Allow any type here, and allow any operation on the result without checking."
- `TypeVar` enforces consistency across multiple positions. It tells the analyzer, "I do not know upfront what type this will be, but whatever type enters as argument $X$ must be the exact same type that exits as return value $Y$."
- Historically, Python always required declaring a `TypeVar` explicitly before using it.
- However, Python 3.12 (PEP 695) introduced native generic syntax, matching the direct parameter style seen in languages like Java or TypeScript.

```python
from typing import TypeVar

T = TypeVar("T")

def get_first_element(items: list[T]) -> T:
    """Returns the first element of a list while preserving its exact type."""
    if not items:
        raise IndexError("Collection is empty.")
    return items[0]

first_int = get_first_element([1, 2, 3])       # Type inferred as int
first_str = get_first_element(["a", "b"])     # Type inferred as str


# No TypeVar declaration needed since 3.12!
def get_first_element[T](items: list[T]) -> T:
    ...
```

#### Bounded type variables

- A `TypeVar` can be constrained to a specific set of types or upper-bounded by a base class or protocol.

```python
from typing import TypeVar

# Value-restricted TypeVar (explicit allowed types)
AnyStr = TypeVar("AnyStr", str, bytes)

def duplicate_sequence(data: AnyStr) -> AnyStr:
    return data + data

# Upper-bounded TypeVar (must be Numeric or a subtype of it)
class Numeric(Protocol):
    def __add__(self: T, other: T) -> T: ...

N = TypeVar("N", bound=Numeric)

def add_elements(left: N, right: N) -> N:
    return left + right
```

### Generic classes

```python
from typing import Generic, TypeVar

ItemType = TypeVar("ItemType")

class PriorityQueue(Generic[ItemType]):
    def __init__(self) -> None:
        self._entries: list[tuple[int, ItemType]] = []

    def push(self, priority: int, item: ItemType) -> None:
        self._entries.append((priority, item))
        self._entries.sort(key=lambda entry: entry[0], reverse=True)

    def pop(self) -> ItemType:
        if not self._entries:
            raise IndexError("Queue is empty.")
        return self._entries.pop()[1]

string_queue: PriorityQueue[str] = PriorityQueue()
string_queue.push(1, "Task A")
popped_task: str = string_queue.pop()
```

#### Variance

- Variance determines how subtyping relationships among underlying types transfer to generic containers that wrap those types.
- **Invariance** (default)
	- `Container[Child]` is not compatible with `Container[Parent]`, and vice versa.
	- This prevents illegal insertions into mutable containers.
- **Covariance** (`covariant=True`)
	- If `Child` extends `Parent`, then `Container[Child]` is a subtype of `Container[Parent]`.
	- This is appropriate for read-only data sources.
- **Contravariance** (`contravariant=True`)
	- If `Child` extends `Parent`, then `Container[Parent]` is a subtype of `Container[Child]`.
	- This is appropriate for write-only data sinks or consumers.

```python
from typing import Generic, TypeVar

class Animal: pass
class Dog(Animal): pass

# Covariant Type: Producer / Read-Only Source
OutT = TypeVar("OutT", covariant=True)

class ReadOnlyRepository(Generic[OutT]):
    def __init__(self, value: OutT) -> None:
        self._value = value

    def get_value(self) -> OutT:
        return self._value

def inspect_animal_source(repo: ReadOnlyRepository[Animal]) -> None:
    animal = repo.get_value()
    print(animal)

# Safe: ReadOnlyRepository[Dog] can substitute for ReadOnlyRepository[Animal]
dog_repo: ReadOnlyRepository[Dog] = ReadOnlyRepository(Dog())
inspect_animal_source(dog_repo)

# Contravariant Type: Consumer / Write-Only Sink
InT = TypeVar("InT", contravariant=True)

class Sink(Generic[InT]):
    def consume(self, item: InT) -> None:
        print(f"Consumed: {item}")

def process_dog_sink(sink: Sink[Dog]) -> None:
    sink.consume(Dog())

# Safe: A sink capable of consuming any Animal can safely accept a Dog
animal_sink: Sink[Animal] = Sink()
process_dog_sink(animal_sink)
```

### ParamSpec

## Critical Gotchas to Watch Out For
- Type annotations do not alter how code executes. Writing `x: int = "hello"` will run in Python without raising an error unless an external static type checker (`mypy`, `pyright`) scans the code before execution.
- Writing `def add_item(val: str, items: list[str] = [])` triggers Python's shared mutable default bug. Static analyzers flag this, and the standard mitigation is items: `list[str] | None = None`.
- `list[Child]` Is Not Assignable to `list[Parent]` (Invariance). If `Dog` inherits from `Animal`, passing `list[Dog]` to a function expecting `list[Animal]` fails type checking. If the function appended a `Cat` into that `list[Animal]`, the caller's `list[Dog]` would now contain a `Cat`. Use `Sequence[Animal]` for read-only parameters instead.
- Writing `isinstance(data, list[str])` raises a `TypeError` at runtime. Python's runtime engine cannot inspect the contents of parameterized containers. Use `isinstance(data, list)` instead.
- Complex type annotations often cause circular import loops between domain modules. Solve this by placing imports inside an `if typing.TYPE_CHECKING:` block, which only executes during static analysis scans and remains inactive during runtime execution.