# C#

# Setup

[Install C# on Ubuntu and run programs](https://terminalroot.com/how-to-install-csharp-on-ubuntu-and-getting-started/)

# Introduction

```c#
using System;
namespace HelloWorld{
    class Program{
        static void Main(string[] args){
            Console.WriteLine("Hello World!");
            // single line comment
            /*
            multi-line comment
            */
        }
    }
}
```


# Variables and Constants

## Data types
int, double, char, string, bool

## Storage
int-4 bytes, long-8 bytes, float-4 bytes, double-8bytes, bool-1 bit, char-2 bytes,
string-2 bytes per character

## Declaration

```c#
// type variableName = value;
int n = 15;
long myNum = 15000000000L;
const double PI = 3.14159D; // cannot declare a constant variable without assigning the value. If you do, an error will occur: A const field requires a value to be provided.
float f1 = 35e3F; // this means 35x10^3, can also use E
/*
    long types should end with L
    floats with F
    double with D
*/
char c;
c = 'C';
int x=5, y=6, z=50;
int x, y, z;
x = y = z = 50;
bool b = true; // or false
```

## Type Casting

### Implicit casting (automatically)

```c#
int x = 6;
double d = x;
```

### Explicit Casting (manually)

```c#
int x = 6;
double d = (double)x;
```

This can also be done using the `Convert` class.
```c#
Convert.ToBoolean()
Convert.ToDouble()
Convert.ToString()
Convert.ToInt32() // (int)
Convert.ToInt64() // (long)
```

## Strings
A string variable contains a collection of characters surrounded by double quotes.

```c#
// methods
str.ToUpper()
str.ToLower()
str.Substring(pos)

// attributes
str.Length

// concatenation
str1+str2 or string.Concat(str1, str2);

// interpolation, similar to python's f-string
$"something {variable} something {variable}"

str[0] // string access
str.IndexOf('e') // index of the given character in the string
```

## Input/Output

```c#
Console.ReadLine(); // returns a string
// convert data
int age = Convert.ToInt32(Console.ReadLine());
// to read data other than string
string[] tokens = Console.ReadLine().Split();
int x = int.Parse(tokens[0]);
int y = int.Parse(tokens[1]);
```
Entering wrong input type will invoke exception (e.g. `System.FormatException`).

## Operators
Pretty much the same as C/C++. But, C# uses the `+` operator for both addition and concatenation.

```c#
"Six " + 6 // results in a string -> Six 6
```


# Others

```c#
// Shorthand if-else
variable = (condition) ? expressionTrue : expressionFalse;
// array
string[] cars;
string[] cars = new string[4];
string[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
string[] cars = new string[4] {"Volvo", "BMW", "Ford", "Mazda"};
string[] cars = new string[] {"Volvo", "BMW", "Ford", "Mazda"};
cars[0] = "Opel";
Console.WriteLine(cars[0]);
cars.Length
// multi-dimensional array
int [,] arr = {{1,2,3}, {4,5,6}, {7,8,9}};
var arr = new int[3,3];
a[2,2] = 96;
// loop
foreach (type variableName in arrayName){
    // code block to be executed
}
Array.Sort(cars);
using System.Linq;
myNumbers.Max()/Min()/Sum();
// methods
static void MyMethod(){
    Console.WriteLine("I just got executed!");
}
static void MyMethod(string fname){
    Console.WriteLine(fname + " Refsnes");
}
static int MyMethod(int x){
    return 5 + x;
}
static void Main(string[] args){
    MyMethod();
    MyMethod(child3: "John", child1: "Liam", child2: "Liam");
}
// overloading
int MyMethod(int x)
float MyMethod(float x)
double MyMethod(double x, double y)
// oop
class Car{
    string color = "red";
    static void Main(string[] args){
        Car myObj = new Car();
        Console.WriteLine(myObj.color);
    }
}
// into multiple files
// prog2.cs
class Car{
    public string color = "red";
    // constructor - no return type
    public Car(){
        model = "Mustang"; // Set the initial value for model
    }
    public Car(string modelName){
        model = modelName;
    }
    public void fullThrottle(){
        Console.WriteLine("The car is going as fast as it can!");
    }
}
// prog.cs
class Program{
    static void Main(string[] args){
        Car myObj = new Car();
        Console.WriteLine(myObj.color);
    }
}
// access modifiers
public, private, protected, internal
// if an access modifier is not specified, private is assumed.
// exception handling
try{}
catch (Exception e){
    Console.WriteLine(e.Message);
}
finally{
    Console.WriteLine("The 'try catch' is finished.");
}
// Stack
using System.Collections.Generic;
// Stack allows null (for reference types) and duplicate values.
Stack<int> numbers = new Stack<int>();
numbers.Push(1); numbers.Push(2); numbers.Push(3); numbers.Push(4);
int[] arr = new int[]{ 1, 2, 3, 4};
Stack<int> myStack = new Stack<int>(arr);
foreach(var item in numbers) Console.Write(item + ",");
numbers.Count
numbers.Contains(5) // checks whether an item exists or not
numbers.Peek() // returns the last element, throws exception if the stack is empty
numbers.Pop() // returns the last element and removes it. throws exception if the stack is empty

while(myStack.Count>0) Console.Write(myStack.Pop() + ",");
numbers.Clear(); // empties the stack
// list
using System.Collections.Generic;
var l = new List<int>();
var l = new List<Student>();
l.Add(1);
l[0];
l.Insert(idx, value)
l.Remove(value)
l.RemoveAt(idx)
l.Contains(value)
l.IndexOf(value)
l.Clear()
l.ToString()

// KeyValuePair
var kvp = new KeyValuePair<char, int>();
var l = new List<KeyValuePair<char, int>>();
l.Add(new KeyValuePair<char, int>('c', 96));

// StringBuilder
using System.Text;
StringBuilder sb = new StringBuilder(); // string will be appended later
StringBuilder sb = new StringBuilder(50); // intial length of the String
StringBuilder sb = new StringBuilder("Hello World!");
sb.Append("Hello "); // appends "Hello"
sb.AppendLine("World!"); // appends "Wolrd!\n"
sb.Insert(5," C#"); // insert C# at the index 5
sb.Remove(6, 3); // remove 3 characters, starting from index 6
sb.Replace("World", "C#"); // replace "World" with "C#"
sb.Length
sb.Capacity
sb.ToString()
sb.Clear()

// dictionary
using System.Collections.Generic;
// Keys must be unique and cannot be null. Values can be null or duplicate.
Dictionary<int, string> numberNames = new Dictionary<int, string>();
numberNames.Add(1,"One"); //adding a key/value using the Add() method
// trying to add element with existing key will throw run-time exception
foreach(var kvp in numberNames)
    Console.WriteLine($"Key: {kvp.Key}, Value: {kvp.Value}");
// access an element with its key
numberNames[4] // will throw exception if key does not exist
// use
cities.ContainsKey("France")
// to check if the key exists, before trying to access it
//creating a dictionary using collection-initializer syntax
var cities = new Dictionary<string, string>(){
    {"UK", "London, Manchester, Birmingham"},
    {"USA", "Chicago, New York, Washington"},
    {"India", "Mumbai, New Delhi, Pune"}
};
cities["France"] = "Paris"; //throws run-time exception: KeyNotFoundException
cities.Remove("UK"); // removes UK
cities.Remove("France"); //throws run-time exception: KeyNotFoundException
```

# Resources
- [C# Tutorial](https://www.w3schools.com/cs/index.php)
- [Learn C# Programming](https://www.tutorialsteacher.com/csharp)