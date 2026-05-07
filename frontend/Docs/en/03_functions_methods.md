# Functions and Methods

## Learning Goals

- Define and call functions.
- Pass arguments and return values.
- Understand local variables and scope.
- Use built-in functions and simple lambda expressions.

## Defining a Function

```python
def square(n):
    return n * n

print(square(5))
```

## Parameters and Return Values

Parameters are inputs. `return` sends a result back to the caller.

```python
def greet(name, message="Hello"):
    return f"{message}, {name}!"
```

## Scope

Variables created inside a function are local to that function.

```python
def add(a, b):
    total = a + b
    return total
```

## Practice

1. Write `area(width, height)`.
2. Write `is_even(n)`.
3. Write a function that returns the largest number in a list.

## Summary

Functions make code reusable, easier to test, and easier to read.
