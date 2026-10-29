# Project Layout & Package Architecture

- Structuring a professional Python repository requires establishing predictable boundaries between source code, tests, configuration, and build artifacts.
- A clean architectural layout eliminates accidental import bugs, enforces clean packaging pipelines, and streamlines development for team environments.

## Modern Project Layouts

### Flat Layout
```
flat_project/
├── pyproject.toml
├── README.md
├── tests/
│   └── test_core.py
└── my_package/          <-- Package sits directly in the repository root
    ├── __init__.py
    └── core.py
```

- In this layout, the root package directory sits directly alongside configuration files, documentation, and the test suite.
- Simple to set up, so beginners can run `python my_package/core.py` without understanding installation mechanics.
- **The Structural Flaw**
	- Accidental Import Problem
	- When invoking a test runner (e.g., `pytest`) from the project root, Python automatically places the current working directory (`.`) at the head of `sys.path`.
	- The test runner imports `my_package` directly from the filesystem rather than testing the packaged, installed distribution in the virtual environment.
	- This can hide critical packaging defects, such as missing data files, broken compiled extensions, or unlisted package dependencies.

### `src` Layout

```
src_project/
├── pyproject.toml
├── README.md
├── tests/
│   └── test_core.py
└── src/
    └── my_package/      <-- Package is nested inside src/
        ├── __init__.py
        ├── py.typed     <-- Signals PEP 561 typing support
        └── core.py

Repository Root (tests/, pyproject.toml)
  │
  ├── Current working directory added to sys.path: "."
  │   └── Cannot import "my_package" directly because it is inside "src/"!
  │
  └── Requires editable install or built wheel in .venv:
      └── .venv/lib/python3.X/site-packages/my_package (or .pth reference)
```

- In this layout, all importable application source code is isolated inside a dedicated `src/` directory.
- **Prevents False Positives in Testing**
	- Because `src/` is not on `sys.path` by default when running commands from the project root, tests will fail immediately unless the package is explicitly installed into the active virtual environment (e.g., via `uv sync` or an editable install).
	- This guarantees that tests run against the true packaged artifact.
- **Clean Artifact Isolation**
	- Build tools can unambiguously distinguish between packaging code inside `src/` and non-distributed top-level files (such as `tests/`, `docs/`, `scripts/`, or configuration files).
- **Editable Install Predictability**
	- Modern build backends can generate standard `.pth` links directly targeting the `src/` folder without exposing extraneous root files.

## The Role of `pyproject.toml`

### The Three Foundational PEPs
- **PEP 518 (`[build-system]` table)**
	- Standardized `pyproject.toml` as the universal configuration file format and defined how to specify tool requirements necessary to build the package.
- **PEP 517 (Decoupled Build Engine)**
	- Established a standardized hook API allowing build frontends (`pip`, `uv`, `build`) to call build backends (`hatchling`, `flit_core`, `setuptools`) without executing arbitrary, imperative setup scripts.
- **PEP 621 (`[project]` table)**
	- Standardized core project metadata fields (such as `name`, `version`, `dependencies`, `license`, and `authors`) so metadata remains portable across any compliant build backend.

### Complete, Production-Grade pyproject.toml Blueprint

```toml
# ==============================================================================
# 1. BUILD SYSTEM SPECIFICATION (PEP 518 & PEP 517)
# ==============================================================================
[build-system]
requires = ["hatchling>=1.20.0"]
build-backend = "hatchling.build"

# ==============================================================================
# 2. STANDARDIZED CORE METADATA (PEP 621)
# ==============================================================================
[project]
name = "enterprise-vault"
version = "0.1.0"
description = "Production credential management client and SDK"
readme = "README.md"
license = { text = "Apache-2.0" }
requires-python = ">=3.11"
authors = [
    { name = "Platform Team", email = "platform-eng@example.com" }
]
classifiers = [
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Operating System :: OS Independent",
    "Typing :: Typed",
]

# Abstract Runtime Dependencies
dependencies = [
    "httpx>=0.27.0",
    "pydantic>=2.6.0",
    "cryptography>=42.0.0",
]

# Standardized Optional Dependencies (e.g., pip install enterprise-vault[aws])
[project.optional-dependencies]
aws = [
    "boto3>=1.34.0",
]

# CLI Entrypoint Executables
[project.scripts]
vault-cli = "enterprise_vault.cli:run_app"

# ==============================================================================
# 3. MODERN DEPENDENCY GROUPS (PEP 735)
# Used by tools like uv and pdm for non-published development environments.
# ==============================================================================
[dependency-groups]
dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "ruff>=0.3.0",
    "mypy>=1.9.0",
]

# ==============================================================================
# 4. UNIFIED TOOL CONFIGURATIONS
# Eliminates external configuration files (.flake8, pytest.ini, etc.)
# ==============================================================================
[tool.hatch.build.targets.wheel]
packages = ["src/enterprise_vault"]

[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP"]

[tool.mypy]
python_version = "3.11"
strict = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra -q --strict-markers"
```

## Module Resolution and Imports

```
src/enterprise_vault/
├── __init__.py           <-- Defines public package API surface (__all__)
├── py.typed              <-- Signals to type checkers that inline types exist
├── _client.py            <-- Internal implementation (prefixed with _)
├── _crypto.py            <-- Internal cryptographic primitives
└── models.py             <-- Public data models
```

- Maintaining a clean internal and external module boundary prevents brittle imports and circular dependency loops.
- **Absolute Imports**
	- Recommended Rule for Public Boundaries & External Access.
	- Specifies the full path starting from the root package namespace.
	- Absolute imports are explicit, resilient to refactoring across directories, and easy to locate via code search.
- **Explicit Relative Imports**
	- Recommended Rule for Cohesive Internal Modules.
	- Uses leading dots (`.` or `..`) to reference modules within the current package hierarchy.
	- *Best practice*
		- Keep relative imports shallow (e.g., `.module` or `..parent_module`).
		- Deeply nested relative imports (`....module`) reduce code readability and should be avoided in favor of absolute imports.

```python
# Absolute Import
from enterprise_vault._crypto import generate_key  # Absolute import

# Explicit Relative Imports
from ._crypto import generate_key   # Same directory level
from .models import VaultCredential  # Same directory level
```

### Designing Clean Public APIs with `__all__`

- When designing libraries, the contents of internal submodules (especially those prefixed with `_`) should remain hidden from public consumption.
- Re-exporting approved interfaces inside `src/enterprise_vault/__init__.py` establishes an explicit public contract.
- **Behavior Enforced by `__all__`:**
	- *Wildcard Imports:* `from enterprise_vault import *` will import only the identifiers declared in `__all__`.
	- *Type Checking Contract (PEP 561 / Pyright / Mypy):* Type checkers consider symbols imported into `__init__.py` as private unless they are assigned an alias (e.g., `from ._client import VaultClient as VaultClient`) or explicitly listed in `__all__`.
	- *IDE Code Completion:* Modern IDEs inspect `__all__` to populate top-level suggestions, preventing internal helper functions from polluting consumer auto-complete dialogs.

```python
# src/enterprise_vault/__init__.py
"""Enterprise Vault SDK.

Public classes and functions exposed for library consumers.
"""

from enterprise_vault._client import VaultClient
from enterprise_vault.models import VaultCredential

# Define exact symbols exported when wildcard imported (from enterprise_vault import *)
# and explicitly recognized by static type checkers (mypy, pyright) as public APIs.
__all__ = [
    "VaultClient",
    "VaultCredential",
]

# Clean up namespace so imported submodules do not leak into package namespace
del _client
del models
```