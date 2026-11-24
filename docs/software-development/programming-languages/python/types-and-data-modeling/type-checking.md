# Static Analysis, Type Checking, and Code Quality Pipelines

## Static Type Checkers
- Static type annotations require an external analyzer to verify correctness.
- They analyze Python source code and stub files (`.pyi`) without executing the program.
- While all major checkers adhere to Python Enhancement Proposals (PEPs), they differ in implementation language, inference heuristics, and execution speed.
- Tools like `mypy` and `pyright` inspect abstract syntax trees (ASTs) alongside type stubs (`.pyi`) to spot mismatches before execution.

### `mypy`
- It is the original reference static type checker for Python, written in Python itself (and compiled via `mypyc` for performance).
- Operates conservatively on unannotated functions.
- Unless explicitly configured otherwise, `mypy` treats unannotated function bodies as `Any` and skips checking their internals.
- Supports deep static plugins for frameworks that rely heavily on metaclasses and dynamic attribute generation, such as SQLAlchemy, Pydantic, and Django.
- Widely used as the authoritative gatekeeper in Continuous Integration pipelines.

### `pyright`
- It is an open-source static type checker created by Microsoft, implemented in TypeScript and running on Node.js.
- Built from the ground up for speed and incremental analysis.
- Unlike `mypy`, `pyright` performs aggressive type inference inside unannotated functions by default and supports multi-threaded file checking, typically executing 5x to 10x faster than `mypy` on large repositories.
- Frequently implements newly ratified typing PEPs earlier than competing tools.

### `Pylance`
- It is Microsoft's proprietary language server extension for Visual Studio Code.
- It embeds the `pyright` engine at its core to deliver real-time type diagnostics, squiggly error underlines, auto-imports, semantic highlighting, and IntelliSense autocompletion inside the editor.
- Running `pyright` in CI guarantees that automated build checks enforce the exact same type rules developers see inside VS Code via `Pylance`.
- Because `pyright` infers types inside unannotated local scopes while `mypy` defaults to `Any`, code passing `Pylance` inside VS Code may fail `mypy` in CI (and vice versa). Standardize on one primary checker for CI enforcement, or run both in CI if library compatibility is required.

## Type Narrowing, `TypeGuard`, and `@overload`
- Static checkers narrow the active type of a variable by parsing standard conditional branches and function signatures.

### Control-Flow Type Narrowing
- Static checkers inspect conditional guards (`isinstance`, `issubclass`, `is None`, `==`, `in`, and `assert`) to narrow union types within specific branches.

```python
def normalize_payload(data: str | bytes | None) -> str:
    # Active type: str | bytes | None
    if data is None:
        return ""

    # Active type narrowed to: str | bytes
    if isinstance(data, bytes):
        # Active type narrowed to: bytes
        return data.decode("utf-8")

    # Active type narrowed to: str
    return data.strip()
```

### Custom Type Narrowing
- When validation requires inspecting the contents of a collection or evaluating complex predicates, built-in `isinstance()` checks are insufficient.
- Python provides `typing.TypeGuard` and `typing.TypeIs` to allow helper functions to narrow types for the caller.
- `TypeGuard[T]` narrows the variable only inside the `if` (positive) branch and does not narrow the `else` branch.
- `TypeIs[T]` acts like a true `isinstance()` check, narrowing both the `if` branch (to `T`) and the `else` branch (by subtracting `T` from the original union).

```Python
from typing import Any, TypeGuard, TypeIs, assert_type

def is_list_of_strings(items: list[Any]) -> TypeGuard[list[str]]:
    """Verifies that every element in the list is an instance of str."""
    return all(isinstance(item, str) for item in items)

def join_records(records: list[Any]) -> str:
    if is_list_of_strings(records):
        # Static checker narrows `records` from `list[Any]` to `list[str]`
        return ", ".join(records)
    raise TypeError("Expected a list containing only strings.")

def is_str(value: object) -> TypeIs[str]:
    """Narrows a value to `str` in the positive branch and excludes `str` in the negative branch."""
    return isinstance(value, str)

def format_token(token: str | int) -> str:
    if is_str(token):
        # Positive branch: static checker narrows `token` to `str`
        assert_type(token, str)
        return token.strip().upper()
    else:
        # Negative branch: static checker subtracts `str`, narrowing `token` to `int`
        assert_type(token, int)
        return f"NUM-{token:04d}"
```

### Function Overloading
- Python does not support runtime method overloading.
- However, when a function's return type depends directly on its input argument types or literal flags, `@typing.overload` lets developers declare multiple static signatures above a single unified implementation.
- Every `@overload` decorated function contains only a type signature declaration with an ellipsis (`...`) body, and only one un-decorated function at the bottom holds the actual runtime implementation.
- At runtime, Python discards the `@overload` stub definitions and executes only the final un-decorated implementation.
- Every `@overload` signature must be compatible with the concrete implementation's parameter and return types.

```python
from typing import Literal, overload

# Overload 1: Single integer ID returns a single string
@overload
def fetch_username(user_id: int, *, as_list: Literal[False] = False) -> str: ...

# Overload 2: Explicit as_list=True flag wraps the result in a list
@overload
def fetch_username(user_id: int, *, as_list: Literal[True]) -> list[str]: ...

# Overload 3: A sequence of IDs always returns a list of strings
@overload
def fetch_username(user_id: list[int], *, as_list: bool = ...) -> list[str]: ...

# Concrete Runtime Implementation (no @overload decorator; not visible to callers)
def fetch_username(
    user_id: int | list[int],
    *,
    as_list: bool = False,
) -> str | list[str]:
    if isinstance(user_id, list):
        return [f"user_{uid}" for uid in user_id]
    username = f"user_{user_id}"
    return [username] if as_list else username

# Static checker resolves exact return types without requiring union checks:
single_name: str = fetch_username(42)
forced_list: list[str] = fetch_username(42, as_list=True)
batch_names: list[str] = fetch_username([1, 2, 3])
```

## Escape Hatches
- When external libraries lack proper stubs or static inference hits its limits, developers can override the checker using two mechanisms, `cast()` and `# type: ignore`
- `cast()` tells the analyzer to treat the expression as the designated type.
- At runtime, `cast()` does nothing and returns the object unchanged
- `assert_type(val, ExpectedType)` asks the static type checker to verify that its inferred type for `val` matches `ExpectedType` exactly.
- If the checker infers a different type (such as `Any` instead of `int`), static analysis fails immediately.
- At runtime, `assert_type()` does nothing.
- When a false positive cannot be resolved cleanly, `# type: ignore` and `# pyright: ignore`suppresses specific error codes on a line.
- Writing `# type: ignore` without an error bracket (`[error-code]`) suppresses every type error on that line, including genuine typos introduced months later during refactoring.
- Always include the explicit error code to avoid silencing unrelated issues.

```Python
from typing import cast, assert_type

raw_untyped_object: object = {"user": "admin", "privilege": 1}
typed_dict = cast(dict[str, Any], raw_untyped_object)
# Suppresses only the specific error code; unrelated errors on this line still surface
legacy_result = eval("40 + 2")  # type: ignore[no-untyped-call]
# For pyright-specific diagnostics:
value = dynamic_registry.lookup("key")  # pyright: ignore[reportUnknownMemberType]

def compute_total(prices: list[float]) -> float:
    total = sum(prices)
    # Fails static analysis if `total` is ever inferred as `Any` or `int`
    assert_type(total, float)
    return total
```

## High-Speed Linting and Formatting with Ruff
- While `mypy` and `pyright` verify type soundness, Ruff (written in Rust) enforces code style, import sorting, bug-pattern detection, and type-annotation hygiene across large repositories in milliseconds.
- Ruff replaces legacy Python toolchains (`flake8`, `black`, `isort`, `pyupgrade`, and `flake8-annotations`).
- Ruff organizes lint rules into prefixed categories.
- `ANN` (`flake8-annotations`): Enforces that all public functions, methods, and return values carry explicit type annotations (preventing developers from leaving functions untyped).
- `UP` (`pyupgrade`): Automatically rewrites legacy typing syntax into modern equivalents (e.g., converting `typing.List[str]` to `list[str]` and `typing.Optional[int] `to `int | None`).
- `TCH` (`flake8-type-checking`): Moves imports used exclusively inside type annotations into `if TYPE_CHECKING:` blocks to eliminate circular imports and reduce runtime startup overhead.
- `B` (`flake8-bugbear`): Catches common Python runtime pitfalls such as mutable default arguments (`def fn(items: list[str] = [])`).
- `I` (`isort`): Sorts and groups standard library, third-party, and local imports deterministically.

### Typical CI Execution Workflow

```bash
# 1. Check lint and typing-hygiene rules (with optional --fix auto-remediation)
ruff check .

# 2. Verify code formatting matches canonical style
ruff format --check .

# 3. Execute static type analysis
mypy src/
# or: pyright
```

### Sample Configuration

```toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_unused_configs = true
warn_redundant_casts = true
warn_unused_ignores = true
disallow_any_generics = true
disallow_untyped_defs = true
no_implicit_optional = true
check_untyped_defs = true

# Ignore missing type stubs for specific legacy third-party libraries
[[tool.mypy.overrides]]
module = ["legacy_vendor_sdk.*"]
ignore_missing_imports = true

[tool.pyright]
pythonVersion = "3.12"
typeCheckingMode = "strict"
include = ["src"]
exclude = ["**/__pycache__", ".venv", "migrations"]
reportMissingTypeStubs = false
reportUnknownMemberType = "warning"

[tool.ruff]
target-version = "py312"
line-length = 100
src = ["src"]

[tool.ruff.lint]
select = [
    "E",     # pycodestyle errors
    "F",     # Pyflakes logic errors
    "I",     # isort import sorting
    "UP",    # pyupgrade modern syntax
    "ANN",   # flake8-annotations (enforce type hints)
    "B",     # flake8-bugbear common bugs
    "TCH",   # flake8-type-checking (isolate TYPE_CHECKING imports)
    "RUF",   # Ruff-specific rules
]
ignore = [
    "ANN101", # Missing type annotation for `self` in method
    "ANN102", # Missing type annotation for `cls` in classmethod
]

[tool.ruff.lint.per-file-ignores]
# Relax strict annotation enforcement inside test suites
"tests/**/*.py" = ["ANN"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```