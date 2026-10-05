# Libraries

## `algorithm`
- The header `<algorithm>` defines a collection of functions especially designed to be used on ranges of elements.
- A range is any sequence of objects that can be accessed through iterators or pointers, such as an array or an instance of some of the STL containers.
- Notice though, that algorithms operate through iterators directly on the values, not affecting in any way the structure of any possible container (it never affects the size or storage allocation of the container).

### Non-modifying sequence operations

**`find(first, last, val)`**
- `first`: iterator to the initial position in a sequence.
- `last`: iterator to the final position in a sequence.
- `val`: value to search for in the range.
- Returns: An iterator to the first element in the range that compares equal to `val`. If no elements match, the function returns last.
```c++
it = find (myvector.begin(), myvector.end(), 30);
if (it != myvector.end())
    std::cout << "Element found in myvector: " << *it << ’\n’;
else
    std::cout << "Element not found in myvector\n";
```

### Modifying sequence operations

**`transform(first1, last1, result, UnaryOperator op)`**
- `first1`: iterator to the initial position of the first sequence.
- `last1`: iterator to the final position of the first sequence.
- `result`: iterator to the initial position of the sequence where the result will be stored.
- `op`: This can either be a function pointer or a function object.

```c++
std::transform (foo.begin(), foo.end(), bar.begin(), op_increase); // op_increase is a user-defined function
// std::plus adds together its two arguments:
std::transform (foo.begin(), foo.end(), bar.begin(), foo.begin(), std::plus<int>());
```

### Partitions
### Sorting
### Binary Search

## `cctype`

### Character classification functions

### Character conversion functions

**`tolower(c)`**
- `c`: Character to be converted, casted to an `int`, or `EOF`.
- Returns: The lowercase equivalent to `c`, if such value exists, or `c` (unchanged) otherwise. The value is returned as an `int` value that can be implicitly casted to `char`.

**`toupper(c)`**
- Similar to `tolower(c)`.

## `cfloat`
- contains information about floating point numbers.
- also has the same functionalities of `climits`

## `climits`

```c++
// contains information about data types for the compiler
INT_MAX -> maximum possible value in int
INT_MIN -> minimum possible value in int
```

## `initializer_list`

```c++
int m = std::max({a, b, c});
```

## `iomanip`

- for I/O manipulation
```c++
cout << fixed << setprecision(2); // sets double and float precision to 2-digits
```