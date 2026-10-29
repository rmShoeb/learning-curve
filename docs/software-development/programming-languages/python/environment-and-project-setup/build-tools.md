# Build Tools

- Under PEP 517 and PEP 518, the build process is decoupled into frontends (tools that coordinate, like `pip`, `uv`, or `build`) and backends (tools that package source trees into distributable formats).
- Understanding the underlying mechanics of these backends and the anatomy of the artifacts they produce demystifies what happens when code transforms into an installable distribution.
- A build backend is an actual Python engine that executes when triggered.
- Its job is to turn a raw folder of Python scripts on the machine into a strictly structured, compressed, standards-compliant distribution file (`.whl` or `.tar.gz`) that other computers can understand.
- Without build tools, we only have loose code files and a text file and no mechanism to produce an installable artifact.

## The Anatomy of a Build Artifact

- A Wheel (`.whl`, defined in PEP 427) is a standard ZIP archive with a specifically formatted filename and internal layout.
- Installing a wheel is fundamentally an extraction operation.
- An installer unpacks the archive directly into a target `site-packages` directory without executing setup scripts.
- Inspecting a .whl archive reveals two primary top-level components.
	- The actual importable package tree
	- Critical `.dist-info` Files

```
requests-2.31.0-py3-none-any.whl (ZIP Archive)
├── requests/                           <-- The actual importable package tree
│   ├── __init__.py
│   ├── api.py
│   ├── models.py
│   └── ...
└── requests-2.31.0.dist-info/          <-- Distribution metadata directory
    ├── METADATA                        <-- Standardized package metadata (PEP 566/643)
    ├── WHEEL                           <-- Wheel specification metadata
    ├── RECORD                          <-- Manifest of all files with SHA-256 hashes
    ├── entry_points.txt                <-- CLI executable script bindings
    └── licenses/                       <-- Packaged license files
        └── LICENSE
```

### `.dist-info` Files

- `METADATA`
	- A key-value text file conforming to the Core Metadata Specification (PEP 566 / PEP 643).
	- Installers parse this directly without executing Python code to read package constraints.

	```
	Metadata-Version: 2.1
	Name: requests
	Version: 2.31.0
	Summary: Python HTTP for Humans.
	Requires-Python: >=3.7
	Requires-Dist: charset-normalizer<4,>=2
	Requires-Dist: idna<4,>=2.5
	Requires-Dist: urllib3<3,>=1.21.1
	Requires-Dist: certifi>=2017.4.17
	Provides-Extra: socks
	Requires-Dist: PySocks!=1.5.7,>=1.5.6; extra == 'socks'
	```

- `WHEEL`
	- Declares the wheel format version and the build engine details.
	- `Root-Is-Purelib`:
		- When set to `true`, the contents are installed into `purelib` (architecture-independent site-packages).
		- When set to `false`, contents target `platlib` (architecture-specific site-packages containing binary extensions).

	```
	Wheel-Version: 1.0
	Generator: hatchling 1.21.0
	Root-Is-Purelib: true
	Tag: py3-none-any
	```

- `RECORD`
	- A CSV file containing the relative path, cryptographic hash, and byte size of every single file within the archive.
	- Integrity Verification: Installers use `RECORD` to ensure no files were corrupted or altered.
	- Clean Uninstallation: When running pip uninstall, the package manager reads RECORD to safely delete all installed files without leaving orphan assets behind.

## Traditional Build Engines

### `distutils` - The Deprecated Foundation
- Introduced in Python 1.6, `distutils` was the standard library's original packaging engine.
- It handled basic module builds and C-extension compilation.
- Over time, it stagnated and accumulated technical debt, ultimately being deprecated in Python 3.10 and completely removed in Python 3.12 via PEP 632.

### `setuptools`
- `setuptools` emerged as an enhanced third-party extension of `distutils`, introducing `setup.py`, dependency declarations (`install_requires`), and `easy_install` (the precursor to `pip`).
- There are some problems with the legacy `setuptools`.
	- *Arbitrary Code Execution:* Reading metadata required executing `setup.py`. This meant non-deterministic builds, security hazards, and bootstrapping deadlocks.
	- *Global State Mutation:* `setuptools` monkey-patched standard library `distutils` internals at runtime.
	- *Implicit Behaviors:* Automatic file discovery frequently included unintended development files, temporary caches, or tests inside generated distribution archives.
- Modern `setuptools` (PEP 517 / PEP 621 Compliant)
	- To maintain relevance in the modern packaging ecosystem, modern `setuptools` implements PEP 517 hooks (`setuptools.build_meta`) and reads declarative configurations directly from `pyproject.toml`, removing the need for an executable `setup.py` in standard pure-Python projects.

## Modern Pure-Python Backends

- For projects consisting solely of Python code and data assets, modern backends offer lean, predictable alternatives to `setuptools`.

### `hatchling`
- It is the build backend for the Hatch project.
- It has become the recommended general-purpose standard for modern Python packaging.
- Key Architectural Characteristics:
	- *Strict Declarative Configuration:* Fully separates project metadata from code execution.
	- *Plugin Architecture:* Supports pluggable hooks for dynamic metadata resolution (e.g., retrieving versions from Git tags via `hatch-vcs`).
	- *Flexible File Inclusion/Exclusion:* Uses glob patterns to explicitly control which files land in `sdist` vs. `wheel` archives.

#### Configuration Example

```toml
[build-system]
requires = ["hatchling", "hatch-vcs"]
build-backend = "hatchling.build"

[project]
name = "api-sdk"
dynamic = ["version"]
dependencies = ["httpx>=0.27.0"]

[tool.hatch.version]
source = "vcs"  # Automatically resolves version from git tags

[tool.hatch.build.targets.wheel]
packages = ["src/api_sdk"]
# Explicitly exclude non-runtime artifacts
exclude = [
    "*.pyc",
    "tests",
]
```

### `flit-core`
- It is a minimalist, lightweight build backend intended primarily for simple, pure-Python modules and libraries.
- Key Architectural Characteristics:
	- *Zero Overhead:* Contains no external dependencies and ships as a tiny package.
	- *Strict Convention Over Configuration:*
		- Avoids complex configuration parameters.
		- It expects package code to live at `<name>.py` or `src/<name>/` and parses the version string directly from a `__version__` variable in the code.
	- *No Plugin Layer:* Intentionally omits dynamic plugin hooks to keep build operations completely deterministic.

#### Configuration Example

```toml
[build-system]
requires = ["hatchling", "hatch-vcs"]
build-backend = "hatchling.build"

[project]
name = "api-sdk"
dynamic = ["version"]
dependencies = ["httpx>=0.27.0"]

[tool.hatch.version]
source = "vcs"  # Automatically resolves version from git tags

[tool.hatch.build.targets.wheel]
packages = ["src/api_sdk"]
# Explicitly exclude non-runtime artifacts
exclude = [
    "*.pyc",
    "tests",
]
```

## Native Extension Backends

- When a package requires high-performance computational kernels, low-level hardware access, or native library bindings, it must incorporate compiled languages (such as C, C++, or Rust).
- This requires build backends capable of orchestrating external native compilers (gcc, clang, msvc, rustc).

### `setuptools` with C-Extensions - The Traditional Native Route
- It compiles C/C++ files via a `setup.py` file wrapping Python's internal C-API bindings.
- Managing multi-file C/C++ dependencies, cross-platform linking, and modern compiler flags directly inside `setup.py` scripts is notoriously brittle across heterogeneous operating systems.

#### Example

```c
/* src/fast_math.c */
#include <Python.h>

static PyObject* method_add(PyObject* self, PyObject* args) {
    long a, b;
    if (!PyArg_ParseTuple(args, "ll", &a, &b)) return NULL;
    return PyLong_FromLong(a + b);
}

static PyMethodDef FastMathMethods[] = {
    {"add", method_add, METH_VARARGS, "Add two numbers natively"},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef fastmathmodule = {
    PyModuleDef_HEAD_INIT, "fast_math", NULL, -1, FastMathMethods
};

PyMODINIT_FUNC PyInit_fast_math(void) {
    return PyModule_Create(&fastmathmodule);
}
```

```python
# setup.py (Required for native extensions in setuptools)
from setuptools import setup, Extension

fast_math_module = Extension("fast_math", sources=["src/fast_math.c"])

setup(
    ext_modules=[fast_math_module],
)
```

### `scikit-build-core` - The Modern CMake Standard
- It is a next-generation PEP 517 build backend designed specifically for C, C++, and Fortran projects.
- Rather than reinventing compilation logic in Python, it delegates build orchestration directly to CMake and Ninja.
- It integrates directly with existing C/C++ ecosystems, header libraries, and toolchains.
- Supports high-performance build systems like Ninja out of the box.
- Ideal for scientific computing, image processing, and machine learning modules.

#### Configuration Example

```toml
# pyproject.toml
[build-system]
requires = ["scikit-build-core>=0.8.0"]
build-backend = "scikit_build_core.build"

[project]
name = "cpp_engine"
version = "0.1.0"
requires-python = ">=3.10"

[tool.scikit-build]
cmake.version = ">=3.20"
ninja.version = ">=1.10"
```

**Associated CMakeLists.txt**

```
cmake_minimum_required(VERSION 3.20)
project(cpp_engine LANGUAGES CXX)

find_package(Python REQUIRED COMPONENTS Interpreter Development.Module)

python_add_library(cpp_engine MODULE src/main.cpp WITH_SOABI)
install(TARGETS cpp_engine DESTINATION .)
```

### `maturin` - The Modern Rust Ecosystem Standard
- It is a specialized PEP 517 build backend that compiles Rust crates into Python extension modules using PyO3 or uniffi.
- It is the technology powering industry-standard libraries like `pydantic-core`, `polars`, and `ruff`.
- Eliminates entire categories of C-based memory leaks and segfaults.
- Direct access to the rich Rust package ecosystem (`crates.io`).
- Built-in commands for compiling multi-platform wheels for Linux, macOS, and Windows.
- Running `uv build` or `maturin build` triggers cargo behind the scenes, compiles native machine code, and links it into an importable shared object library (`.so` / `.pyd`) placed directly inside the generated `.whl`.

#### Example

**Configuration - `pyproject.toml`**

```toml
[build-system]
requires = ["maturin>=1.4,<2.0"]
build-backend = "maturin"

[project]
name = "rust_accelerator"
version = "0.1.0"
requires-python = ">=3.11"

[tool.maturin]
features = ["pyo3/extension-module"]
module-name = "rust_accelerator._rust"
```

**Rust Module (`src/lib.rs`)**

```rust
use pyo3::prelude::*;

#[pyfunction]
fn compute_heavy_hash(input: String) -> PyResult<String> {
    // Fast native computation in Rust
    Ok(format!("processed_{}", input))
}

#[pymodule]
fn _rust(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(compute_heavy_hash, m)?)?;
    Ok(())
}
```

## Backend Selection Decision Matrix

| Project Profile                             | Recommended Build Backend | Build Artifact Type                                             |
|---------------------------------------------|---------------------------|-----------------------------------------------------------------|
| Modern Application / Microservice / SDK     | `hatchling`               | Pure Python Wheel (`py3-none-any`)                               |
| Minimal / Single-File Utility Library       | `flit-core`               | Pure Python Wheel (`py3-none-any`)                               |
| Modern High-Performance Native Extensions   | `maturin`                 | Platform-Specific Binary Wheel (e.g., `cp311-cp311-manylinux...`)|
| Complex C / C++ / Scientific Compute Engine | `scikit-build-core`       | Platform-Specific Binary Wheel (e.g., `cp311-cp311-manylinux...`) |
| Legacy Packaging / Monolithic Codebases     | `setuptools`              | Pure or Platform-Specific Wheel                                 |

## Build Backends and Build Frontends (or Project Managers)

### Difference between them

| Dimension | Build Backend | Build Frontend |
|---|---|---|
| What it is | A library/engine invoked behind the scenes. | A command-line tool we directly interact with in the terminal. |
| Execution Context | Runs inside an isolated Python environment to assemble files. | Runs directly on the host machine. |
| Responsibilities | Assembling and zipping `.whl` and `sdist` files, generating `METADATA` and `RECORD`. | Managing Python versions, resolving dependency trees, generating lockfiles, creating virtualenvs, orchestrating builds. |
| Direct Interaction | We almost never invoke it directly via CLI. | We execute commands like `uv run`, `uv add`, `uv build`. |

### How They Collaborate Under the Hood

When a developer executes a build command (e.g. `uv build` or `python -m build`)

1. `uv` reads `pyproject.toml` to find `[build-system] requires = ["hatchling"]`.
2. `uv` creates an isolated, temporary environment and installs hatchling into it.
3. `uv` calls `hatchling` to execute its `build_wheel()` and `build_sdist()` hooks.
4. `hatchling` processes the files and builds `dist/my_app-0.1.0-py3-none-any.whl`.
5. `hatchling` hands the wheel back to `uv`.
6. `uv` destroys the temporary environment and confirms build completion.