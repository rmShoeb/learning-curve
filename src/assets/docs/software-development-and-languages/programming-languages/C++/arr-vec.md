# Arrays and Vectors

## Arrays

```c++
// declaration
int arr[100];
// initialization
int arr[5]{1,2,3,4,5};
int arr[5]{1,2,3}; // rest of the elements will be initialized to 0
int arr[]{1,2,3,4,5,6,7}; // array size will be calculated automatically
int arr[100]{0}; // all elements will be initialized to 0
```

- C++ does not do any bound calculation, i.e. if array size is 5 and we try to access 10th location, it does not stop us from doing so, although this kind of operation outputs garbage value.
- If we try to store something outside of bound of array, the program will most likely crash, although it depends on the running operating system.

### Multidimensional Arrays
- Although there are no limits to dimensions in C++, some compilers impose limits, but they are high enough.

```c++
// initialization
int movie_review[2][3]{
    {1,2,3},
    {1,2,3}
}
```

## Vectors
- Vector type is part of the standard library.

```c++
#include <vector>
using namespace std;
// or
using std::vector;
// declaration
vecto<int> vec;
vector<char> vowels(5); // constructor initialization, allows space for 5 chars. values are automatically set to 0
//initialization
vector<char> vowels{'a', 'e', 'i', 'o', 'u'}; // size is set automatically according to the number of elements
vector<double> temps(365, 8.0); // first parameter tells how many elements there will be. second parameter says the default value for all the elements.
```

- Like array, memory locations are contiguous in vector.
- If square brackets are used for accessing elements, then vector provides no bounds checking. But it provides functions for bound checking.

```c++
vec.at(index);
cin >> vec.at(0);
vec.at(0) = 95;
```

- When the `.at()` is used and we try to access an out of bound memory, it throws an `std::out_of_bound exception` exception (captured at runtime), which doesn’t happen in array indexing.
- The program does crash though, if exceptions are not handled.

```c++
// to increase the vector size
vec.push_back(96);
// 2D-vector
vector<vector<int>> vec{
    {1,2,3,4},
    {1,2,3,4}
};
// access elements
vec[0][1];
vec.at(0).at(1);
```

### The `size()` method
- The `size()` method of vector returns an unsigned integer.
- So, if this is compared with a variable of type other than unsigned integer (e.g. `i < vec.size(); // i is int`), some compilers give a warning.


# Input/Output

## Basic I/O

### `std::cin`
- to read stream of data from console using keyboard.
- Space, tabs and newlines are terminators. So, space separated inputs are considered as different inputs.
- This is why `cin` cannot read long space-separated strings. To get around this problem, we will have to use other operators/methods than the extraction operator.
- Since, `cin` reads data from buffer, if there is anything in the buffer, it won’t wait for keyboard input, and read whatever there is in the buffer until it finds a terminator.

### `std::cout`
- `std::endl` flushes the stream.
- If the stream is buffered, it may not get written in the terminal until it is flushed. This is important for file I/O.